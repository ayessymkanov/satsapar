define(['plugins/router', 'viewmodels/parameters', 'jquery', 'moment', 'datetimepicker', 'jqueryui', 'knockout', 'durandal/app', 'viewmodels/localdataservice'],
    function (router, params, $, moment, datetimepicker, jqueryui, ko,app, localdataservice) {
    ko.bindingHandlers.ko_autocomplete = {
        init: function (element, params) {
            $(element).autocomplete(params());
        },
        update: function (element, params) {
            $(element).autocomplete("option", "source", params().source);
        }
    };
    
    var popularDirections = [
    { stationfrom: 'Астана', stationfromcode: 2708000, stationto: 'Караганда', stationtocode: 2708950 },
    { stationfrom: 'Астана', stationfromcode: 2708000, stationto: 'Алмата', stationtocode: 2700000 },
    { stationfrom: 'Астана', stationfromcode: 2708000, stationto: 'Жамбыл', stationtocode: 2700710 },
    { stationfrom: 'Алмата', stationfromcode: 2700000, stationto: 'Астана', stationtocode: 2708000 }
    ];
        try {
            var directionsSaved = [];
            var directionsLatest = localdataservice.get('directionsLatest');
            if (directionsLatest != null) {
                var prevResult = directionsLatest;
                var props = Object.getOwnPropertyNames(prevResult);
                var j = 0;
                for (i = props.length-1; i >-1 ; i--) {
                    if (prevResult[props[i]].hasOwnProperty('stationfrom') ) {
                        directionsSaved.push(prevResult[props[i]]);                        
                    }
                }
                directionsSaved.sort(function (a, b) {
                    return a.updatets == b.updatets ? 0 : +(a.updatets > b.updatets) || -1;
                });
                for (i = directionsSaved.length - 1; i > -1; i--) {
                    if (j < 4) {
                        popularDirections[j] = directionsSaved[i];
                        j++;
                    }
                }
            }
        } catch (e) { }
    function moveTo(departDate, selectedLocation, selectedLocation2) {
        var result;
        var csrfToken = $("input[name='__RequestVerificationToken']").val();
        $('#spinner').addClass("loading");
        $.ajax({
            async: true,
            headers: { __RequestVerificationToken: csrfToken },
            url: '/Home/SearchTrains',
            type: 'POST',
            data: {
                when: departDate,
                stationFromCode: selectedLocation,
                stationToCode: selectedLocation2
            },            
            success: function (data) {
                if (data === undefined) {
                    alert('В указанную дату поезд не ходит либо произошла ошибка при поиске на эту дату! ');
                    return;
                }
                try {
                    if (!('Trains' in data)) {
                        alert(result);
                        return;
                    }
                }
                catch (err) {
                    alert(data);
                    return;
                }
                params.trainsInfo = data;
                router.navigate('#trains', true);
                $('#spinner').removeClass("loading");
            },
            error: function (data) {
                alert('В указанную дату поезд не ходит либо произошла ошибка при поиске на эту дату! ');
                
            },
            complete: function(){
                $('#spinner').removeClass("loading");
            }
        }
      );
       
    }
    var IndexModel;
    (function (IndexModel) {
        var ViewModel = (function () {
            function ViewModel() {
                var indexpage = localdataservice.get('indexpage');
                this.selectedValue = ko.observable(indexpage==null?'':indexpage.selectedValue);
                this.selectLocation = this.selectLocation.bind(this);
                this.selectedValue2 = ko.observable(indexpage == null ? '' : indexpage.selectedValue2);
                this.selectLocation2 = this.selectLocation2.bind(this);
                this.searchButtonClick = this.searchButtonClick.bind(this);
                this.isMobileDevice = params.isDeviceMobile;                
            }
            ViewModel.prototype.getLocations = function (request, response) {
                var text = request.term;
                var csrfToken = $("input[name='__RequestVerificationToken']").val();
                $.ajax({                    
                    headers: { __RequestVerificationToken: csrfToken },
                    url: '/Home/StationAutoComplete',
                    data: {
                          term: text ,
                        delay: 0.5
                    },
                    type: 'POST',                    
                    success: function (data) {
                        // fake response
                        //data = mockWebApiResponse(text);
                        response($.map(data, function (location) {
                            return {
                                locationValue: location.StationCode,
                                label: location.StationName
                            };
                        }));
                    }
                });
            };
            ViewModel.prototype.searchButtonClick = function (router) {
                var departDate = $('#searchDate').val();
                if (departDate == null || departDate.length==0){
                    alert('Выберите дату отправления !');
                    return;
                }
                if (this.selectedValue() == null) {
                    alert('Выберите пункт отправление из всплывающего списка!');
                    return;
                }
                if (this.selectedValue2()==null){
                    alert('Выберите пункт назначения из всплывающего списка!');
                    return;
                }
                try {                    
                    localdataservice.save('indexpage', {
                        selectedValue: this.selectedValue(), selectedValue2: this.selectedValue2(), searchDate: departDate,
                        fromstation: $('#fromstation').val(), tostation: $('#tostation').val()
                    });
                    var directionsLatest = localdataservice.get('directionsLatest');
                    var key = 'key' + '_' + this.selectedValue() + '_' + this.selectedValue2();
                    var prevResult = {};
                    if (directionsLatest != null)
                        prevResult = directionsLatest;
                    prevResult[key] = { stationfrom: $('#fromstation').val(), stationfromcode: this.selectedValue(), stationto: $('#tostation').val(), stationtocode: this.selectedValue2(),updatets:new Date() };
                    localdataservice.save('directionsLatest', prevResult);
                } catch (e) {}
                moveTo(departDate, this.selectedValue, this.selectedValue2);
            }            
            ViewModel.prototype.getDirectionNames = function (id) {
                var fromStation = popularDirections[id].stationfrom;
                if (fromStation.length > 7) {
                    fromStation = fromStation.substr(0, 7)+'.';
                }
                return fromStation + " - " + popularDirections[id].stationto;
            }
            ViewModel.prototype.populateDirection = function (id) {
                this.selectedValue(popularDirections[id].stationfromcode);
                $('#fromstation').val(popularDirections[id].stationfrom);
                this.selectedValue2(popularDirections[id].stationtocode);
                $('#tostation').val(popularDirections[id].stationto);
            };
            ViewModel.prototype.selectLocation = function (event, ui) {
                this.selectedValue(ui.item.locationValue);
                var city =ui.item.label.split('->')[0];
                $('#fromstation').val(city);
                return false;
            };
            ViewModel.prototype.selectLocation2 = function (event, ui) {
                this.selectedValue2(ui.item.locationValue);
                var city = ui.item.label.split('->')[0];
                $('#tostation').val(city);
                return false;
            };
            ViewModel.prototype.attached = attached;
            return ViewModel;
        })();
        IndexModel.ViewModel = ViewModel;            
    })(IndexModel || (IndexModel = {}));

    return new IndexModel.ViewModel();
    function attached(view) {
        //$(document).on({
        //    ajaxStart: function () { $('#spinner').addClass("loading"); },
        //    ajaxStop: function () { $('#spinner').removeClass("loading"); }
        //});
        //$("#spinner").bind("ajaxStart", function () {
        //    $(this).show();
        //    }).bind("ajaxStop", function () {
        //        $(this).hide();
        //    }).bind("ajaxError", function () {
        //        $(this).hide();
        //    });           
        var indexpage = localdataservice.get('indexpage');
        if (indexpage != null) {
            if (indexpage.searchDate < new Date())
                indexpage.searchDate = new Date() + 1;
            $('#searchDate').val(indexpage.searchDate);
            $('#fromstation').val(indexpage.fromstation);
            $('#tostation').val(indexpage.tostation);
        }
        var date = new Date();
        date.setDate(date.getDate() - 1);

        $(view).find('#datetimepicker3').datetimepicker(
                  {
                      pickTime: false, language: 'ru',
                      minDate: new Date()
                  }
                );

        $(view).on('click', '.navbar-collapse.in', function (e) {
            if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
                $(this).collapse('hide');
            }
            return true;
        })  
        $('#istaxi').click(function () {
            $('label[for=' + this.id + ']').toggleClass('checked');
        });        
    };  
});
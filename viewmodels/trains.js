define(['durandal/app',
    'knockout',
    'plugins/router', 'viewmodels/parameters', 'viewmodels/localdataservice'], function (app, ko, router, params, localdataservice) {
        var typesofwagon = ['Общий', 'Сидячий', 'Плацкартный', 'Купе', 'Мягкий', 'Люкс'];
        ko.expressionRewriting._twoWayBindings['customData'] = true;
        ko.bindingHandlers['customData'] = {            
            update: function (element, valueAccessor, allBindingsAccessor) {
                var value = ko.isObservable(valueAccessor()) ? valueAccessor() : valueAccessor;
                var unwrappedValue = value();
                var v1 = allBindingsAccessor().ind;
                if (v1 == 1) {
                    v1 = unwrappedValue.length-1;
                }                
                unwrappedValue[v1] = unwrappedValue[v1].charAt(0) + unwrappedValue[v1].slice(1).toLowerCase();
                $(element).text(unwrappedValue[v1]);                
            }
        };
        ko.bindingHandlers.placeInfo = {
            update: function (element, valueAccessor, allBindingsAccessor) {
                var value = ko.isObservable(valueAccessor()) ? valueAccessor() : valueAccessor;
                var typeString = allBindingsAccessor().type;
                var typeID = typesofwagon.indexOf(typeString) + 1;
                var info = allBindingsAccessor().infotype;
                var cars = value();
                var result=0;
                for (var i = 0; i < cars.length; i++) {
                    if (typeID == 11 && cars[i].Type != 3 && cars[i].Type != 4 && cars[i].Type !=6) {
                        result += cars[i].FreeSeats;                    
                    } else if (cars[i].Type == typeID) {
                        if (info == 0)
                            result = cars[i].Tariffs[0].TariffValue;
                        else {
                            result = cars[i].FreeSeats;
                        }
                        break;
                    }
                }
                if (result == 0) {
                    result = '';
                }
                $(element).text(result);
            }
        };
        ko.bindingHandlers.customTimeInPath = {            
            update: function (element, valueAccessor, allBindingsAccessor) {
                var value = ko.isObservable(valueAccessor()) ? valueAccessor() : valueAccessor;
                var timeInWay = value();
                var result;
                if ( timeInWay.indexOf('.') >= 0)
                {
                    var res = timeInWay.split('.');
                    if (res.length==2)
                    {                       
                        result = res[0] + " Д " + res[1].substring(0, 2) + " ч. " + res[1].substring(3, 5) + " мин.";
                    }
                }
                else if (timeInWay!=null && timeInWay.length>3)
                    result = timeInWay.substring(0, 2) + " ч. " + timeInWay.substring(3, 5) + " мин.";               
                
                $(element).text(result);
            }
        };
        var dayGetObj = function () {
            return { arr: {day:ko.observable(),visible:ko.observable(false)}, exctDate: ko.observable('') }
        };
        var trains = ko.observableArray();
        var Typewagons = ko.observable([]);
        var arr = [dayGetObj(), dayGetObj(), dayGetObj(), dayGetObj(), dayGetObj(), dayGetObj(), dayGetObj()];
        var datescalendar = ko.observable({
            day1: arr[0].arr, day2: arr[1].arr, day3: arr[2].arr,
            day4: arr[3].arr, day5: arr[4].arr, day6: arr[5].arr, day7: arr[6].arr, currentday: ko.observable()
        });        
        var activateRefresh = function () {            
            if (params.trainsInfo == null || (params.trainsInfo === undefined)) {
                var tempval = localdataservice.get('trainsInfo');
                if (tempval == null) {
                    router.navigateBack();
                }
                params.trainsInfo = tempval;
            }
            else
                localdataservice.save('trainsInfo', params.trainsInfo);
            for (var i = 0; i < params.trainsInfo.Trains.length; i++) {
                var t = params.trainsInfo.Trains[i]
                for (var tr = 0; tr < t.TrainsCollection.length; tr++) {
                    var tempArr = [];
                    t.TrainsCollection[tr].Cars.forEach(function (entry) {
                        tempArr.push({ type: typesofwagon[entry.Type - 1], wagons: entry.FreeSeats, typedisp: typesofwagon[entry.Type - 1].substr(0,5) });
                    });                    
                    t.TrainsCollection[tr].traindetails = ko.observable({ modelpath: ko.observable(), viewpath: ko.observable(), trainInfo: ko.observable(), Typewagons: ko.observableArray(tempArr) });
                    t.TrainsCollection[tr].visible = ko.observable("block");                    
                }
            }
            trains(params.trainsInfo);
            var selecteddate = trains().Trains[0].Date;
            datescalendar().currentday(moment(selecteddate).format('d'));
            if (datescalendar().currentday() <= 0)
                datescalendar().currentday(7);
            var currday = datescalendar().currentday() - 1;
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (i <= currday) {
                    item.exctDate(moment(selecteddate).add('days', -1 * (currday - i)));
                    item.arr.day(moment(selecteddate).add('days', -1 * (currday - i)).format('D') + " " + moment(selecteddate).format('MMM').substr(0, 3) + ".");
                }
                else {
                    item.exctDate(moment(selecteddate).add('days', i - currday));
                    item.arr.day(moment(selecteddate).add('days', i - currday).format('D') + " " + moment(selecteddate).format('MMM').substr(0, 3) + ".");
                }                
            }
            arr[currday].arr.visible(true);
            if (currday-1>=0){            
                arr[currday - 1].arr.visible(true);
            }
            if (currday + 1 < 7) {
                arr[currday + 1].arr.visible(true);
            } else {
                arr[currday - 2].arr.visible(true);
            }
        };
        var detailed = function (cartype, tr) {
            try {
                var trainVal = tr();
                for (var i = 0; i < trainVal.Trains.length; i++) {
                    var t = trainVal.Trains[i]
                    for (var tr = 0; tr < t.TrainsCollection.length; tr++) {
                        t.TrainsCollection[tr].traindetails().modelpath('');
                        t.TrainsCollection[tr].traindetails().viewpath('')
                        t.TrainsCollection[tr].traindetails().trainInfo(null);                        
                    }
                }
                var self = this;
                var result;
                var csrfToken = $("input[name='__RequestVerificationToken']").val();
                $('#spinner').addClass("loading");
                $.ajax({
                    async: true,
                    headers: { __RequestVerificationToken: csrfToken },
                    url: '/Home/GetTrain',
                    data: {
                        fromStationCode: trainVal.PassRouteCodeFrom,
                        toStationCode: trainVal.PassRouteCodeTo,
                        departureDateTime: moment(this.DepartureDateTime).format("DD-MM-YY HH:mm:ss"),
                        trainNumber: this.Number
                    },
                    type: 'POST',
                    success: function (data) {
                        try {
                            result = data;
                            self.traindetails().viewpath('views/trainselection');
                            self.traindetails().modelpath('viewmodels/trainselection');
                            var carsresult = result.ForwardDirectionDto.Trains[0].Train.Cars;
                            var cars;
                            self.traindetails().Typewagons([]);
                            var found = false;
                            for (var j = 0; j < carsresult.length; j++) {
                                if (carsresult[j].Type.toLowerCase() == cartype.toLowerCase()) {
                                    cars = carsresult[j];
                                    cars.trainref = self;
                                    found = true;
                                } else if (!found) {
                                    if (carsresult[j].Type.toLowerCase() != 'плацкартный' &&
                                        carsresult[j].Type.toLowerCase() != 'купе' &&
                                        carsresult[j].Type.toLowerCase() != 'люкс') {
                                        cars = carsresult[j];
                                        for (var t = 1; t < carsresult[j].length; t++) {
                                            for (var s = 0; s < carsresult[j].cars.Cars[s].length; s++)
                                                cars.Cars.push(carsresult[j].cars.Cars[s]);
                                        }
                                        cars.trainref = self;
                                    }
                                }
                                var sumwagons = 0;
                                carsresult[j].Cars.forEach(function (entry) {
                                    sumwagons += entry.Places.length;
                                });

                                self.traindetails().Typewagons().push({
                                    type: carsresult[j].Type, wagons: sumwagons, typedisp: carsresult[j].Type.substr(0, 5)
                                });
                            }

                            self.traindetails().trainInfo(cars);
                            self.traindetails(self.traindetails());
                        } catch (ex) { }
                    },
                    error: function () { alert('Ошибка') },
                    complete: function () { $('#spinner').removeClass("loading") }
                });
            }
            catch (err) {
                alert(err);
            }
        }
        return {
            
            isMobileDevice: params.isDeviceMobile,
            inputboxs: {
                checkbox1: ko.observable({ checked: false, src: ko.observable("img/night-filter.png") }), checkbox2: ko.observable({ checked: false, src: ko.observable("img/morning-filter.png") }), checkbox3: ko.observable({ checked: false, src: ko.observable("img/dinner-filter.png") }), checkbox4: ko.observable({ checked: false, src: ko.observable("img/evenning-filter.png") }), checkbox5: ko.observable({ checked: false, src: ko.observable("img/night-filter.png") }),
                checkbox6: ko.observable({ checked: false, src: ko.observable("img/morning-filter.png") }), checkbox7: ko.observable({ checked: false, src: ko.observable("img/dinner-filter.png") }), checkbox8: ko.observable({ checked: false, src: ko.observable("img/evenning-filter.png") })
            },
            trains: trains,
            datescalendar: datescalendar,
            arrval: arr,            
            activate: function () {
                try{
                    activateRefresh();
                } catch(err){}
                $('#spinner').removeClass("loading");
            },
            searchbydate: function (day) {
                var dt;
                if (day == 8  || day == -8) {
                    var selecteddate=trains().Trains[0].Date;
                    if (day == -8){
                        dt=moment(selecteddate).add('days', -7);
                    }
                    else {
                        dt = moment(selecteddate).add('days', 7);
                    }
                    if (dt < moment()) {
                        dt = moment().add('days',1);
                    }
                }
                else {
                    dt=arr[day - 1].exctDate();
                }
                if (dt < moment().add('days',-1)) {
                    alert('Дата отправления не может быть меньше чем сегодня!');
                    return true;
                }
                $('#spinner').addClass("loading");
                var result;
                var csrfToken = $("input[name='__RequestVerificationToken']").val();
                $.ajax({
                    async: true,
                    headers: { __RequestVerificationToken: csrfToken },
                    url: '/Home/SearchTrains',
                    data: {
                        when: dt.format("DD.MM.YYYY"),
                        stationFromCode: params.trainsInfo.PassRouteCodeFrom,
                        stationToCode: params.trainsInfo.PassRouteCodeTo
                    },
                    type: 'POST',
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
                        activateRefresh();
                    },
                    error: function (data) {
                        alert('В указанную дату поезд не ходит либо произошла ошибка при поиске на эту дату! ');

                    },
                    complete: function () {
                        $('#spinner').removeClass("loading");
                    }
                }
              );
            },
            filtertrains: function (id, checkbox) {
                var chbx = checkbox();
                if (chbx.checked) {
                    chbx.checked = false;
                    chbx.src ( chbx.src().replace("selected", ""));
                } else {
                    chbx.checked = true;
                    var filePart = chbx.src().split(".");
                    chbx.src ( filePart[0] + "selected." + filePart[1]);
                }
                val = "block";
                var inputboxs=this.inputboxs             
                for (var i = 0; i < this.trains().Trains.length; i++) {
                    var t = this.trains().Trains[i]
                    for (var tr = 0; tr < t.TrainsCollection.length; tr++) {
                        var deptime = parseInt(moment(t.TrainsCollection[tr].DepartureDateTime).format('HH'));
                        var arrtime = parseInt(moment(t.TrainsCollection[tr].ArrivalDateTime).format('HH'));
                        if (id<5){
                            if (deptime >= 0 && deptime < 6) {
                                if (inputboxs.checkbox1().checked == true) {
                                    val = "block";
                                }
                                else 
                                    val = "none";
                            }
                            if (deptime >= 6 && deptime < 12) {
                                if (inputboxs.checkbox2().checked == true) {
                                    val = "block";
                                }
                                else 
                                    val = "none";
                            }
                            if (deptime >= 12 && deptime < 18) {
                                if (inputboxs.checkbox3().checked == true) {
                                    val = "block";
                                }
                                else 
                                    val = "none";
                            }
                            if (deptime >= 18 && deptime < 24) {
                                if (inputboxs.checkbox4().checked == true) {
                                    val = "block";
                                }
                                else 
                                    val = "none";
                            }
                            if (inputboxs.checkbox4().checked != true && inputboxs.checkbox3().checked != true && inputboxs.checkbox2().checked != true && inputboxs.checkbox1().checked != true) {
                                val = "block";
                            }
                        }
                        else {
                            if (arrtime >= 0 && arrtime < 6) {
                                if (inputboxs.checkbox5().checked == true) {
                                    val = "block";
                                }
                                else 
                                    val = "none";
                            }
                            if (arrtime >= 6 && arrtime < 12) {
                                if (inputboxs.checkbox6().checked == true) {
                                    val = "block";
                                }
                                else 
                                    val = "none";
                            }
                            if (arrtime >= 12 && arrtime < 18) {
                                if (inputboxs.checkbox7().checked == true) {
                                    val = "block";
                                }
                                else 
                                    val = "none";
                            }
                            if (arrtime >= 18 && arrtime < 24) {
                                if (inputboxs.checkbox8().checked == true) {
                                    val = "block";
                                }
                                else 
                                    val = "none";
                            }
                            if (inputboxs.checkbox8().checked != true && inputboxs.checkbox7().checked != true && inputboxs.checkbox6().checked != true && inputboxs.checkbox5().checked != true) {
                                val = "block";
                            }
                        }
                        t.TrainsCollection[tr].visible(val);
                    }                    
                }
                return true;
            },
            clickdetail: function (cartype, tr) {
              
                detailed.call(this,cartype, tr);
                $('#spinner').removeClass("loading");
            },
            changedirection: function () {
                var temp = params.trainsInfo.PassRouteCodeFrom;
                params.trainsInfo.PassRouteCodeFrom = params.trainsInfo.PassRouteCodeTo;
                params.trainsInfo.PassRouteCodeTo = temp;
                this.searchbydate(this.datescalendar().currentday());                
            }
        }        
});
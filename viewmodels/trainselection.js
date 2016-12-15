define(['knockout',
    'plugins/router', 'viewmodels/parameters'], function (ko, router, params) {
        ko.bindingHandlers['html'] = {
            //'init': function() {
            //  return { 'controlsDescendantBindings': true }; // this line prevents parse "injected binding"
            //},
            'update': function (element, valueAccessor) {
                // setHtml will unwrap the value if needed
                ko.utils.setHtml(element, valueAccessor());
            }
        };
        return {
            isMobileDevice: params.isDeviceMobile,
            cars: ko.observable(),
            car: ko.observable(),
            carlen: ko.observable(),
            userselection: ko.observable(),
            activate: function (activationData) {
                if (activationData == null)
                    return true;
                this.cars(activationData);
                this.car(this.cars().Cars[0]);
                var totalcar = 0;
                for (var t = 0; t < this.cars().Cars.length; t++)
                    totalcar += this.cars().Cars[t].Places.length;
                this.carlen(totalcar);
                this.userselection({ carnumber: ko.observable(), selectedplaces: ko.observableArray(), train: ko.observable(), car: null });
            },
            sendinfo: function () {
                var selectedpl = this.userselection().selectedplaces();
                if (selectedpl.length > 0) {
                    params.userselection = this.userselection();
                    this.userselection = ko.observable({ carnumber: ko.observable(), selectedplaces: ko.observableArray(), train: this.userselection().train, car: null });
                    router.navigate('#passenger', true);
                } else {
                    alert('Выберите места !');
                }
                return true;
            },
            clickaddplaces: function (plc, id, cr) {
                var formAnz = document.getElementById('form' + id);
                var usl = this.userselection();
                if (usl.carnumber() != id) {
                    usl.carnumber(id);
                    usl.selectedplaces([]);
                    usl.train(this.cars().trainref);
                    usl.car = this.car();
                    usl.car.carsref = this.cars();
                }
                var selPlaces = usl.selectedplaces();
                var lgth = selPlaces.length;
                if (document.getElementById('p_' + plc + '_' + id).style.color != "#5DE078" && document.getElementById('p_' + plc + '_' + id).style.color != "rgb(93, 224, 120)") {
                    for (var i = 0; i < lgth; i++) {
                        if (selPlaces[i] == plc) {
                            document.getElementById('p_' + plc + '_' + id).style.color = "#5DE078";
                            selPlaces.splice(i, 1);
                            dispSelection(formAnz, usl.selectedplaces(), id);
                            return true;
                        }
                    }
                }
                if (lgth == 4) {
                    alert('Нельзя выбрать более 4 мест за раз');
                    return false;
                }
                selPlaces.push(plc);
                document.getElementById('p_' + plc + '_' + id).style.color = "#C4C4C4";
                dispSelection(formAnz, usl.selectedplaces(), id);
                return true;
            }
            ,
            clickchangecar: function (num, elm) {
                this.userselection().carnumber('');
                this.userselection().selectedplaces([]);
                this.car(this.cars().Cars[num]);
                addplaces(this.cars(), this.car(), this);
                return true;
            },
            attached: function () {
                var c = this.cars();
                if (c == undefined) {
                    return true;
                }
                var b = '<div id="radios">';
                for (var ind = 0; ind < c.Cars.length; ind++) {
                    var currentcar = c.Cars[ind];
                    var checkedval = '';
                    if (ind == 0)
                        checkedval = 'checked="checked"';
                    b = b + '<div><input id="radio' + ind + '" class="a" type="radio" name="radio" value="' + ind + '" ' + checkedval + '  data-bind="click: $root.clickchangecar.bind($data,' + ind + ',\'radio' + ind + '\')"><label for="radio' + ind + '" >' + currentcar.Number + ' вагон (<span class="bracket-hint">' + currentcar.Places.length + ' мест</span>)</label></div>';
                }
                b += '</div>';
                addelement(b, this);
                addplaces(this.cars(), this.car(), this);
            }
        }
        function addplaces(crs, cr, m) {
            var temp = '<form id="form' + cr.Number + '">';
            if (crs.Type.toLowerCase() == 'плацкартный' && !m.isMobileDevice) {
                temp += '<img src="img/plasskard.png" class="wagon-image" />';
                for (var i = 1; i < 55; i++) {
                    if (cr.Places.indexOf(String("000" + i).slice(-3)) >= 0) {
                        temp += '<span class=" place-' + i + ' free-place"><a id="p_' + i + '_' + cr.Number + '" style="color:#5DE078;" data-toggle="tooltip" title="' + ((i % 2 == 0) ? 'верхнее' : 'нижнее') + '" data-bind="click: $root.clickaddplaces.bind($data,\'' + i + '\',\'' + cr.Number + '\',1)">' + i + '</a></span>';
                    } else {
                        temp += '<span id="p_' + i + '_' + cr.Number + '" class="place-' + i + ' sold-place">' + i + '</span>';
                    }
                }
            } else {
                if (crs.Type.toLowerCase() == 'купе' && !m.isMobileDevice) {
                    temp += '<img src="img/kupe.png" class="wagon-image" />';
                    for (var i = 1; i < 37; i++) {
                        if (cr.Places.indexOf(String("000" + i).slice(-3)) >= 0) {
                            temp += '<span class=" place-' + i + ' free-place"><a id="p_' + i + '_' + cr.Number + '"  style="color:#5DE078;" data-toggle="tooltip" title="' + ((i % 2 == 0) ? 'верхнее' : 'нижнее') + '"  data-bind="click: $root.clickaddplaces.bind($data,\'' + i + '\',\'' + cr.Number + '\',1)">' + i + '</a></span>';
                        } else {
                            temp += '<span id="p_' + i + '_' + cr.Number + '" class="place-' + i + ' sold-place">' + i + '</span>';
                        }
                    }
                } else {
                    //if (crs.Type.toLowerCase() == 'люкс') {
                    //temp += '<img src="img/kupe.png" class="wagon-image" />';
                    for (var i = 1; i < 180; i++) {
                        if (cr.Places.indexOf(String("000" + i).slice(-3)) >= 0) {
                            temp += '<span class="free-place" style="display: inline-block; margin: 0px 2px;"><a id="p_' + i + '_' + cr.Number + '"  style="color:#5DE078;display:inline;" data-toggle="tooltip" title="' + ((i % 2 == 0) ? 'верхнее' : 'нижнее') + '"  data-bind="click: $root.clickaddplaces.bind($data,\'' + i + '\',\'' + cr.Number + '\',1)">' + i + '</a></span>';
                        }
                        //else {
                        //temp += '<span id="p_' + i + '_' + cr.Number + '" class="place-' + i + ' sold-place">' + i + '</span>';
                        //}
                    }
                    //}
                }

            }
            $('#wag-pict' + cr.Number).html(temp + '</form>');
            ko.applyBindings(m, $('#form' + cr.Number)[0]);
                $('[data-toggle="tooltip"]').tooltip();
        }
        function addelement(c, m) {
            $('#wagonsel').html(c);
            ko.applyBindings(m, $("#radios")[0]);
        }
        function dispSelection(formDisp, selPlacs, wag) {
            var selPlaces = selPlacs;
            var tempMin = 1000;
            var tempMax = 0;
            for (var i = 0; i < selPlaces.length; i++) {
                if (tempMin > parseInt(selPlaces[i]))
                    tempMin = parseInt(selPlaces[i]);
                if (tempMax < parseInt(selPlaces[i]))
                    tempMax = parseInt(selPlaces[i]);
            }
            if (selPlaces.length > 0) {
                if (selPlaces.length <= 1)
                    document.getElementById("placDiv" + wag).innerHTML = tempMin;
                else {
                    document.getElementById("placDiv" + wag).innerHTML = tempMin + '-' + tempMax;
                }
                return;
            }
            else {
                document.getElementById("placDiv" + wag).innerHTML = "";
            }
        }
    });

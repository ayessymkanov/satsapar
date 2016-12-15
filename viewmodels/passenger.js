define(['durandal/app',
    'knockout',
    'plugins/router', 'viewmodels/parameters', 'viewmodels/localdataservice'], function (app, ko, router, params, localdataservice) {
        ko.bindingHandlers.calculatetotal = {
            update: function (element, valueAccessor, allBindingsAccessor) {
                var value = ko.isObservable(valueAccessor()) ? valueAccessor() : valueAccessor;                
                $(element).text( value()+200);
            }
        };
        ko.bindingHandlers.getval = {
            update: function (element, valueAccessor, allBindingsAccessor) {
                var value = ko.isObservable(valueAccessor()) ? valueAccessor() : valueAccessor;
                var txt='';
                var arr=value();
                for (var i = 0; i < arr.length;i++){
                    txt += arr[i] + ','
                }                
                $(element).text(txt.substring(0, txt.length - 1));
            }
        };
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
        var Country = function (abbrev, countryName) {
            this.abbrev = abbrev;
            this.countryName = countryName;
        };
        var arrCountries = [new Country('KAZ', 'Казахстан'), new Country('RUS', 'Россия'), new Country('UZB', 'Узбекистан'), new Country('AUS', 'Австралия'), new Country('AUT', 'Австрия'), new Country('AZE', 'Азербайджан'), new Country('ALA', 'Аландские острова'), new Country('ALB', 'Албания'), new Country('DZA', 'Алжир'), new Country('VIR', 'Виргинские Острова (США)'), new Country('ASM', 'Американское Самоа'), new Country('AIA', 'Ангилья'), new Country('AGO', 'Ангола'), new Country('AND', 'Андорра'), new Country('ATA', 'Антарктида'), new Country('ATG', 'Антигуа и Барбуда'), new Country('ARG', 'Аргентина'), new Country('ARM', 'Армения'), new Country('ABW', 'Аруба'), new Country('AFG', 'Афганистан'), new Country('BHS', 'Багамы'), new Country('BGD', 'Бангладеш'), new Country('BRB', 'Барбадос'), new Country('BHR', 'Бахрейн'), new Country('BLZ', 'Белиз'), new Country('BLR', 'Белоруссия'), new Country('BEL', 'Бельгия'), new Country('BEN', 'Бенин'), new Country('BMU', 'Бермуды'), new Country('BGR', 'Болгария'), new Country('BOL', 'Боливия'), new Country('BES', 'Бонэйр, Синт-Эстатиус и Саба'), new Country('BIH', 'Босния и Герцеговина'), new Country('BWA', 'Ботсвана'), new Country('BRA', 'Бразилия'), new Country('IOT', 'Британская территория в Индийском океане'), new Country('VGB', 'Британские Виргинские острова'), new Country('BRN', 'Бруней'), new Country('BFA', 'Буркина-Фасо'), new Country('BDI', 'Бурунди'), new Country('BTN', 'Бутан'), new Country('VUT', 'Вануату'), new Country('VAT', 'Ватикан'), new Country('GBR', 'Великобритания'), new Country('HUN', 'Венгрия'), new Country('VEN', 'Венесуэла'), new Country('UMI', 'Внешние малые острова (США)'), new Country('TLS', 'Восточный Тимор'), new Country('VNM', 'Вьетнам'), new Country('GAB', 'Габон'), new Country('HTI', 'Гаити'), new Country('GUY', 'Гайана'), new Country('GMB', 'Гамбия'), new Country('GHA', 'Гана'), new Country('GLP', 'Гваделупа'), new Country('GTM', 'Гватемала'), new Country('GUF', 'Гвиана'), new Country('GIN', 'Гвинея'), new Country('GNB', 'Гвинея-Бисау'), new Country('DEU', 'Германия'), new Country('GGY', 'Гернси'), new Country('GIB', 'Гибралтар'), new Country('HND', 'Гондурас'), new Country('HKG', 'Гонконг'), new Country('GRD', 'Гренада'), new Country('GRL', 'Гренландия'), new Country('GRC', 'Греция'), new Country('GEO', 'Грузия'), new Country('GUM', 'Гуам'), new Country('DNK', 'Дания'), new Country('JEY', 'Джерси'), new Country('DJI', 'Джибути'), new Country('DMA', 'Доминика'), new Country('DOM', 'Доминиканская Республика'), new Country('COD', 'Демократическая Республика Конго'), new Country('EGY', 'Египет'), new Country('ZMB', 'Замбия'), new Country('ESH', 'САДР'), new Country('ZWE', 'Зимбабве'), new Country('ISR', 'Израиль'), new Country('IND', 'Индия'), new Country('IDN', 'Индонезия'), new Country('JOR', 'Иордания'), new Country('IRQ', 'Ирак'), new Country('IRN', 'Иран'), new Country('IRL', 'Ирландии Ирландия'), new Country('ISL', 'Исландия'), new Country('ESP', 'Испания'), new Country('ITA', 'Италия'), new Country('YEM', 'Йемен'), new Country('CPV', 'Кабо-Верде'), new Country('CYM', 'Острова Кайман'), new Country('KHM', 'Камбоджа'), new Country('CMR', 'Камерун'), new Country('CAN', 'Канада'), new Country('QAT', 'Катар'), new Country('KEN', 'Кения'), new Country('CYP', 'Кипр'), new Country('KGZ', 'Киргизия'), new Country('KIR', 'Кирибати'), new Country('TWN', 'Китайская Республика'), new Country('PRK', 'КНДР (Корейская Народно-Демократическая Республика)'), new Country('CHN', 'КНР (Китайская Народная Республика)'), new Country('CCK', 'Кокосовые острова'), new Country('COL', 'Колумбия'), new Country('COM', 'Коморы'), new Country('CRI', 'Коста-Рика'), new Country('CIV', 'Кот-д Ивуар'), new Country('CUB', 'Куба'), new Country('KWT', 'Кувейт'), new Country('CUW', 'Кюрасао'), new Country('LAO', 'Лаос'), new Country('LVA', 'Латвия'), new Country('LSO', 'Лесото'), new Country('LBR', 'Либерия'), new Country('LBN', 'Ливан'), new Country('LBY', 'Ливия'), new Country('LTU', 'Литва'), new Country('LIE', 'Лихтенштейн'), new Country('LUX', 'Люксембург'), new Country('MUS', 'Маврикий'), new Country('MRT', 'Мавритания'), new Country('MDG', 'Мадагаскар'), new Country('MYT', 'Майотта'), new Country('MAC', 'Макао'), new Country('MKD', 'Македония'), new Country('MWI', 'Малави'), new Country('MYS', 'Малайзия'), new Country('MLI', 'Мали'), new Country('MDV', 'Мальдивы'), new Country('MLT', 'Мальта'), new Country('MAR', 'Марокко'), new Country('MTQ', 'Мартиника'), new Country('MHL', 'Маршалловы Острова'), new Country('MEX', 'Мексика'), new Country('FSM', 'Микронезия'), new Country('MOZ', 'Мозамбик'), new Country('MDA', 'Молдавия'), new Country('MCO', 'Монако'), new Country('MNG', 'Монголия'), new Country('MSR', 'Монтсеррат'), new Country('MMR', 'Мьянма'), new Country('NAM', 'Намибия'), new Country('NRU', 'Науру'), new Country('NPL', 'Непал'), new Country('NER', 'Нигер'), new Country('NGA', 'Нигерия'), new Country('NLD', 'Нидерланды'), new Country('NIC', 'Никарагуа'), new Country('NIU', 'Ниуэ'), new Country('NZL', 'Новая Зеландия'), new Country('NCL', 'Новая Каледония'), new Country('NOR', 'Норвегия'), new Country('ARE', 'ОАЭ'), new Country('OMN', 'Оман'), new Country('BVT', 'Остров Буве'), new Country('IMN', 'Остров Мэн'), new Country('COK', 'Острова Кука'), new Country('NFK', 'Остров Норфолк'), new Country('CXR', 'Остров Рождества'), new Country('PCN', 'Острова Питкэрн'), new Country('SHN', 'Острова Святой Елены, Вознесения и Тристан-да-Кунья'), new Country('PAK', 'Пакистан'), new Country('PLW', 'Палау'), new Country('PSE', 'Государство Палестина'), new Country('PAN', 'Панама'), new Country('PNG', 'Папуа - Новая Гвинея'), new Country('PRY', 'Парагвай'), new Country('PER', 'Перу'), new Country('POL', 'Польша'), new Country('PRT', 'Португалия'), new Country('PRI', 'Пуэрто-Рико'), new Country('COG', 'Республика Конго'), new Country('KOR', 'Республика Корея'), new Country('REU', 'Реюньон'), new Country('RWA', 'Руанда'), new Country('ROU', 'Румыния'), new Country('SLV', 'Сальвадор'), new Country('WSM', 'Самоа'), new Country('SMR', 'Сан-Марино'), new Country('STP', 'Сан-Томе и Принсипи'), new Country('SAU', 'Саудовская Аравия'), new Country('SWZ', 'Свазиленд'), new Country('MNP', 'Северные Марианские острова'), new Country('SYC', 'Сейшельские Острова'), new Country('BLM', 'Сен-Бартелеми'), new Country('MAF', 'Сен-Мартен'), new Country('SPM', 'Сен-Пьер и Микелон'), new Country('SEN', 'Сенегал'), new Country('VCT', 'Сент-Винсент и Гренадины'), new Country('KNA', 'Сент-Китс и Невис'), new Country('LCA', 'Сент-Люсия'), new Country('SRB', 'Сербия'), new Country('SGP', 'Сингапур'), new Country('SXM', 'Синт-Мартен'), new Country('SYR', 'Сирия'), new Country('SVK', 'Словакия'), new Country('SVN', 'Словения'), new Country('SLB', 'Соломоновы Острова'), new Country('SOM', 'Сомали'), new Country('SDN', 'Судан'), new Country('SUR', 'Суринам'), new Country('USA', 'США'), new Country('SLE', 'Сьерра-Леоне'), new Country('TJK', 'Таджикистан'), new Country('THA', 'Таиланд'), new Country('TZA', 'Танзания'), new Country('TCA', 'Тёркс и Кайкос'), new Country('TGO', 'Того'), new Country('TKL', 'Токелау'), new Country('TON', 'Тонга'), new Country('TTO', 'Тринидад и Тобаго'), new Country('TUV', 'Тувалу'), new Country('TUN', 'Тунис'), new Country('TKM', 'Туркмения'), new Country('TUR', 'Турция'), new Country('UGA', 'Уганда'), new Country('UKR', 'Украина'), new Country('WLF', 'Уоллис и Футуна'), new Country('URY', 'Уругвай'), new Country('FRO', 'Фареры'), new Country('FJI', 'Фиджи'), new Country('PHL', 'Филиппины'), new Country('FIN', 'Финляндия'), new Country('FLK', 'Фолклендские острова'), new Country('FRA', 'Франция'), new Country('PYF', 'Французская Полинезия'), new Country('ATF', 'Французские Южные и Антарктические Территории'), new Country('HMD', 'Херд и Макдональд'), new Country('HRV', 'Хорватия'), new Country('CAF', 'ЦАР'), new Country('TCD', 'Чад'), new Country('MNE', 'Черногория'), new Country('CZE', 'Чехия'), new Country('CHL', 'Чили'), new Country('CHE', 'Швейцария'), new Country('SWE', 'Швеция'), new Country('SJM', 'Шпицберген и Ян-Майен'), new Country('LKA', 'Шри-Ланка'), new Country('ECU', 'Эквадор'), new Country('GNQ', 'Экваториальная Гвинея'), new Country('ERI', 'Эритрея'), new Country('EST', 'Эстония'), new Country('ETH', 'Эфиопия'), new Country('ZAF', 'ЮАР'), new Country('SGS', 'Южная Георгия и Южные Сандвичевы Острова'), new Country('SSD', 'Южный Судан'), new Country('JAM', 'Ямайка'), new Country('JPN', 'Япония')];

        var initiatialize = function (i) {
            return {
                num: i + 1, firstname: ko.observable(''), lastname: ko.observable(''), middlename: ko.observable(''), docnum: ko.observable(''),
                documenttype: ko.observable(), tarifftype: ko.observable(),
                birthdate: { visible: ko.observable(true), bdate: { d: ko.observable(), m: ko.observable(), y: ko.observable() } },
                polPassenger: ko.observable(), nationality: ko.observable()
            }
        };
        var vm = function () {
            var selPlaces = null;
            if (params.userselection != null) {
                var train = params.userselection.train();
                localdataservice.save('userselection', {
                    atrain:train,
                    car: params.userselection.car,
                    carnumber: params.userselection.carnumber(),
                    selectedplaces: params.userselection.selectedplaces()                    
                });
                selPlaces = params.userselection.selectedplaces();
            } else {
                var tempval = localdataservice.get('userselection');
                if (tempval != null) {
                    params.userselection = {};
                    params.userselection.car= tempval.car;
                    params.userselection.carnumber= ko.observable(tempval.carnumber);
                    params.userselection.selectedplaces = ko.observableArray(tempval.selectedplaces);
                    params.userselection.train = ko.observable(tempval.atrain);
                    selPlaces = tempval.selectedplaces;
                }
            }
            if (params.trainsInfo == null) {
                params.trainsInfo = localdataservice.get('trainsInfo');
            }
            var total = selPlaces.length;
            var tempMin = 1000;
            var tempMax = 0;
            var placesdetail = ko.observableArray();
            if (total > 1) {
                for (var i = 0; i < total; i++) {
                    placesdetail.push(initiatialize(i));
                    if (tempMin > parseInt(selPlaces[i]))
                        tempMin = parseInt(selPlaces[i]);
                    if (tempMax < parseInt(selPlaces[i]))
                        tempMax = parseInt(selPlaces[i]);
                }
            } else {
                if (total == 1) {
                    placesdetail.push(initiatialize(0));
                    tempMin = selPlaces[0];
                    tempMax = tempMin;
                }
            }
            params.userselection.tempMin = tempMin;
            params.userselection.tempMax = tempMax;
            params.userselection.email = ko.observable(localdataservice.get('email'));
            this.selection = params.userselection;
            this.placetotal = total;
            this.placesdetail = placesdetail;
            this.traininfo = params.trainsInfo;

            this.dateparams = {
                days: function () { var dd = []; for (var i = 1; i < 32; i++) dd.push(i); return dd; },
                month: function () { var mm = []; for (var i = 1; i < 13; i++) mm.push(i); return mm; },
                year: function () { var dd = []; for (var i = moment().year() ; i > 1920; i--) dd.push(i); return dd; }
            };
            this.typeOfPlaces = ko.observable();
            this.countries = arrCountries;
            this.isDisable = ko.observable(false);
            this.isMobileDevice = params.isDeviceMobile;
        };
        var detski = 4;
        vm.prototype.changetariff = function () {            
            if (this.tarifftype() == detski) {
                this.birthdate.visible(true);
                var svitelstRJD = 5;
                this.documenttype(svitelstRJD);
            } else {
                //this.birthdate.visible(false);
                this.documenttype(4);
            }
        };
        vm.prototype.processorder = function (type,buttonname) {
            if (!document.getElementById('agreeCheckbox').checked) {
                alert('Для подтверждения согласия установите флажок');
                return false;
            }
            if (this.selection.email() == null || this.selection.email().trim().length <= 0 || !validateEmail(this.selection.email().trim())) {
                alert('Введите электронный адресс для отправки билета после подтверждения! Должен быть введён в правильном формате');
                $("#email").focus();
                return true;
            }
            var details = this.placesdetail();
            var vzrosli = 0;
                
             
            for (var i = 0; i < details.length; i++) {
                if (details[i].firstname() == null
                    || details[i].firstname().trim().length <= 0
                    || details[i].lastname()==null
                    || details[i].lastname().trim().length <= 0
                    || details[i].middlename() == null
                    || details[i].middlename().trim().length <= 0
                    || details[i].docnum() == null
                    || details[i].docnum().trim().length <= 0
                    || (details[i].tarifftype() == detski && !(details[i].birthdate.bdate.d() > 0 && details[i].birthdate.bdate.y() > 0 && details[i].birthdate.bdate.m() > 0) || (details[i].documenttype() == 4 && details[i].docnum().trim().length < 8))
                    ) {
                    alert('Введите все данные ФИО,Номер Документа,дата рождения для детского билета(для уд. личности 9 символов)!');
                    return false;
                }
                if (details[0].tarifftype() != detski){
                    vzrosli++;
                }
            }
            if (vzrosli == 0) {
                alert('Для детского билета нужно сопровождения взрослого!');
                return false;
            }
            localdataservice.save('email', this.selection.email());
            $('#spinner').addClass("loading");
            document.getElementById("kaspibutton").disabled = true;
            document.getElementById("visabutton").disabled = true;
            var result;
            var csrfToken = $("input[name='__RequestVerificationToken']").val();
            $.ajax({
                async: true,
                headers: { __RequestVerificationToken: csrfToken },
                    url: '/Booking/BookPlaces',
                    data: ko.toJSON({
                        typeOfPlaces:this.typeOfPlaces,
                        details: this.placesdetail(),
                        selectionfield: {
                            email: this.selection.email(), car: {
                                wagon: this.selection.car.Number,
                                Train: this.selection.train().Number,
                                CarServiceType: this.selection.car.carsref.Type, ClassService: this.selection.car.carsref.ClassService.Type,
                                rangestart: this.selection.tempMin, rangeend: this.selection.tempMax,
                                StationFrom: this.traininfo.PassRouteCodeFrom,
                                StationToCode: this.traininfo.PassRouteCodeTo,
                                DateDepartureTime: moment(this.selection.train().DepartureDateTime).format("DD-MM-YY HH:mm:ss"),
                                PaymentType:type
                            }
                        }
                    }),
                    contentType: "application/json",
                    dataType: "json",
                    type: 'POST',                    
                    success: function (data) {
                        result = data;
                        try {
                            if (result === undefined) {
                                alert('Произошла ошибка при бронирование! ');
                                return false;
                            }
                            if ('error' in result) {
                                alert('Произошла ошибка при бронирование! ' + result.error);
                                return false;
                            }
                        } catch (ex) { }
                        
                        params.paymentinfo = result;
                        router.navigate('#payment', true);
                    },
                    error: function(data,  textStatus,  errorThrown){
                        alert(textStatus+"<br>"+errorThrown);
                    },
                    complete: function () {
                        $('#spinner').removeClass("loading");
                        document.getElementById("kaspibutton").disabled = false;
                        document.getElementById("visabutton").disabled = false;
                    }
                }
             );            
            return true;
        };  
        return vm;
})
define(['durandal/app',
    'knockout',
    'plugins/router', 'viewmodels/parameters'], function (app,ko,router,params) {
        var typesofwagon = ['Общий', 'Сидячий', 'Плацкартный', 'Купе', 'Мягкий', 'Люкс'];
        var orderdetails = ko.observable();
        
        var activatefunc = function () {
            var selection = params.userselection;
            if (selection == null || !('Tickets' in selection.booking)) {
                alert('Ошибка');
                return false;
            }            
            var bk = selection.booking;
            for (var i = 0; i < bk.Tickets.length; i++) {
                bk.Tickets[i].isNeedReturn = ko.observable(false);
            }
            selection.booking.Car.CarType = typesofwagon[selection.booking.Car.Type - 1];
            selection.booking.payment = selection.order.payment;
            selection.booking.orderStatus = selection.order.orderstatusdesc;
            selection.booking.orderid = selection.order.orderid;
            orderdetails(selection.booking);
        };
        var print = function () {
            var selection = params.userselection;
            if (selection.order.orderstatus != 2) {
                alert('Билет ' + selection.order.orderstatusdesc);
                return true;
            }
            $.extend(
            {
                redirectPost: function(location, args)
                {
                    var form = '';
                    $.each( args, function( key, value ) {
                        value = value.split('"').join('\"')
                        form += '<input type="hidden" name="'+key+'" value="'+value+'">';
                    });
                    $('<form action="' + location + '" method="POST">' + form + '</form>').appendTo($(document.body)).submit();
                }
            });
            var redirect = 'Booking/PrintOrder';
            $.redirectPost(redirect, { '__RequestVerificationToken': $("input[name='__RequestVerificationToken']").val(), 'bookingCode': params.userselection.searchinput.trim() });
            


        };
        return {
            isMobileDevice: params.isDeviceMobile,
            print:print,
            activate: function () {
                $('#spinner').addClass("loading");
                try {
                    activatefunc();
                } catch (ex) { }
                $('#spinner').removeClass("loading");
            },
            orderdetails: orderdetails ,
            refresh: function () {
                var result;
                $('#spinner').addClass("loading");
                var csrfToken = $("input[name='__RequestVerificationToken']").val();
                try {
                    $.ajax({
                        async: false,
                        headers: { __RequestVerificationToken: csrfToken },
                        url: '/Booking/BookingInfo',
                        data: {
                            bookingCode: params.userselection.searchinput.trim()
                        },
                        type: 'POST',
                        success: function (data) {
                            result = data;
                        }
                    }
                    );
                    if (result == undefined || result.booking == undefined || !('Tickets' in result.booking)) {
                        if ('error' in result)
                            alert(result.error);
                        else
                            alert('Системная ошибка');
                        return false;
                    }
                    result.searchinput = params.userselection.searchinput.trim();
                    params.userselection = result;
                    activatefunc();
                } catch (ex) { }
                $('#spinner').removeClass("loading");
            }
        };
    });
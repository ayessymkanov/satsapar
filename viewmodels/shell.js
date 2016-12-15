define(['plugins/router', 'durandal/app', 'knockout', 'jquery', 'viewmodels/parameters'], function (router, app, ko, $, params) {

    return {
        isMobileDevice: params.isDeviceMobile,
        router:router,
        searchinput:ko.observable(''),        
        requestbookinginfo: function () {            
            if (this.searchinput() == null || this.searchinput().trim().length <= 0) {
                alert('Введите номер брони!');
                return false;
            }
            var result;
            window.location = "#close";
            $('#spinner').addClass("loading");
            
            try {
                var csrfToken = $("input[name='__RequestVerificationToken']").val();
                $.ajax({
                    async: false,
                    headers: { __RequestVerificationToken: csrfToken },
                    url: '/Booking/BookingInfo',
                    data: {
                        bookingCode: this.searchinput().trim()
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
            } catch (ex) { }

            $('#spinner').removeClass("loading");
            
            result.searchinput = this.searchinput().trim();
            params.userselection = result;
            try{
                if (router.activeItem().__moduleId__ === "viewmodels/orderinfo") {
                    router.activeItem().activate();
                    
                    return true;

                } 
            }catch(ex){}
            router.navigate('#orderinfo', true);
            
            //if (!('orderlink' in result) || result==undefined) {
            //    if ('error' in result)
            //        alert(result.error);
            //    else
            //        alert('Системная ошибка');
            //    return false;
            //}
            //window.location = result.orderlink;

            return true;
        },
        activate: function () {
            router.map([
                { route: '', title: '', moduleId: 'viewmodels/index', nav: true },
                { route: 'trains', moduleId: 'viewmodels/trains', nav: true },               
                { route: 'passenger', moduleId: 'viewmodels/passenger', nav: true },
                { route: 'payment', moduleId: 'viewmodels/payment', nav: true },
                { route: 'orderinfo', moduleId: 'viewmodels/orderinfo', nav: true }

            ]).buildNavigationModel();            
            return router.activate();
        }
    };
});
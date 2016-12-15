define(['durandal/app',
    'knockout',
    'plugins/router'], function () {
        var trainsInfo = null;
        var userselection = null;
        var paymentinfo = null;
        var isDeviceMobile = ko.observable(false);
        return  {
            trainsInfo: trainsInfo,
            userselection: userselection,
            paymentinfo: paymentinfo,
            isDeviceMobile:isDeviceMobile
        };        
    });
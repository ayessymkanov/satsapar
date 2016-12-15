define(['durandal/app',
    'knockout',
    'plugins/router', 'viewmodels/parameters'], function (app, ko, router, params) {
        var vm = function () {
            this.paymentinfo = params.paymentinfo;
        };
        vm.prototype.sendform = function () {
            document.forms.SendOrder.disabled = true;
            document.forms.SendOrder.innerHtml = "Идет загрузка..";
            document.forms.SendOrder.submit()
            document.forms.SendOrder.disabled = false;
        }
        return vm;
    })
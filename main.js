requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions',
        'moment': '../Scripts/js/moment-with-locales.min',
        'datetimepicker': '../Scripts/js/bootstrap-datetimepicker.min',
        'jqueryui': '../Scripts/js/jquery-ui',
        'jquery': '../Scripts/js/jquery.min'
        
        
    },
    urlArgs: "v=" + (isNaN(spaVersion) ? '1.0' : spaVersion)   
});

define('jquery', function () { return jQuery; });
define('knockout', ko);

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'viewmodels/parameters'], function (system, app, viewLocator, params) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");
    
    params.isDeviceMobile(isMobileScreen);
    window.params = params;
    app.title = 'ЖД билеты';

    app.configurePlugins({
        router: true,
        widget: true,
        dialog: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});
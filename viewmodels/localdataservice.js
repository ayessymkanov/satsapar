define([], function () {
    //var localDataService = (function () {
    //    var _storage = window.localStorage;
    //    var _ds = {
    //        exists: function (key) {
    //            return _storage[key] !== undefined;
    //        },
    //        get: function (key) {
    //            var retrunValue = null,
    //                value;
    //            if (_ds.exists(key)) {
    //                value = _storage[key];
    //                try{
    //                    retrunValue=JSON.parse(value);
    //                } catch (e) {
    //                    if (e.constructor.name === 'SyntaxError') {
    //                        retrunValue = value;
    //                    }
    //                }
    //            }
    //        },
    //        save: function (key, value) {
    //            if (typeof value === 'object') {
    //                _storage.setItem(key,JSON.stringify( value));
    //            } else {
    //                _storage.setItem(key, value);
    //            }
    //        }
    //    }
    //    return _ds;
    //})();
    var _storage = window.localStorage;
    return {
                exists: function (key) {
                    return _storage[key] !== undefined;
                },
                delete: function (key) {
                    if (this.exists(key)) {
                        _storage.removeItem(key);
                    }
                    
                },
                get: function (key) {
                    var retrunValue = null,
                        value;
                    if (this.exists(key)) {
                        value = _storage[key];
                        try{
                            retrunValue=JSON.parse(value);
                        } catch (e) {
                            if (e.constructor.name === 'SyntaxError') {
                                retrunValue = value;
                            }
                        }
                    }
                    return retrunValue;
                },
                save: function (key, value) {
                    if (typeof value === 'object') {
                        var seen = [];
                        _storage.setItem(key, JSON.stringify(value, function (key, val) {
                            if (val != null && typeof val == "object") {
                                if (seen.indexOf(val) >= 0) {
                                    return;
                                }
                                seen.push(val);
                            }
                            return val;
                        }));
                    } else {
                        _storage.setItem(key, value);
                    }
                }            
            }
})
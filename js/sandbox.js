var Sandbox =  {
    create : function (core, module_selector) {
        var CONTAINER = core.dom.query('#' + module_selector);
        var baseUrl = 'http://localhost:3000';
        var authToken = '';

        return {
            find : function (selector) {
                return CONTAINER.query(selector);
            },
            addEvent : function (element, type, fn) {
                core.dom.bind(element, type, fn);           
            },
            removeEvent : function (element, type, fn) {
                core.dom.unbind(element, type, fn);              
            },
            notify : function (evt) {
                if (core.is_obj(evt) && evt.type) {
                    core.triggerEvent(evt);
                }         
            },
            listen : function (evts) {
                if (core.is_obj(evts)) {
                    core.registerEvents(evts, module_selector);
                }
            },
            ignore : function (evts) {
                if (core.is_arr) {
                    core.removeEvents(evts, module_selector);
                }   
            },
            create_element : function (el, config) {
                var i, child, text;
                el = core.dom.create(el);
                
                if (config) {
                    if (config.children && core.is_arr(config.children)) {
                        i = 0;
                        while(child = config.children[i]) {
                            el.appendChild(child);
                            i++;
                        }
                        delete config.children;
                    }
                    if (config.text) {
                        el.appendChild(document.createTextNode(config.text));
                        delete config.text;
                    }
                    core.dom.apply_attrs(el, config);
                }
                return el;
            },
            login: function (username, password, callback) {
                return core.post(
                    baseUrl + '/auth.json',
                    {username: username, password: password},
                    function (response, status) {
                        if (status === 'success') {
                            sessionStorage.token = response.token;
                        } else {
                            delete sessionStorage.token;
                        };
                    
                        return callback(response, status);
                    }
                );
            },
            getData: function (callback) {
                return core.get(
                    baseUrl + '/products.json',
                    sessionStorage.token,
                    callback
                )
            }
        };
    }
}

CORE.create_module("search-box", function (sb) {
    var searchInput, searchButton, resetButton;
    
    return {
        init: function () {
            searchInput = sb.find("#search_input")[0];
            searchButton = sb.find("#search_button")[0];
            resetButton = sb.find("#quit_search")[0];
            
            sb.addEvent(searchButton, "click", this.search);
            sb.addEvent(resetButton, "click", this.reset);
        },
        destroy: function () {
            sb.removeEvent(searchButton, "click", this.search);
            sb.removeEvent(resetButton, "click", this.reset);
            
            searchInput = null;
            searchButton = null;
            resetButton = null;
        },
        search: function () {
            var query = searchInput.value;
            
            if (query) {
                // this will trigger an event that the product-panel is listening to
                sb.notify({
                    type : 'perform-search',
                    data : query
                });
            }
        },
        reset: function () {
            searchInput.value = "";
            
            sb.notify({
                type : 'quit-search'
            });
        }
    };
});

CORE.create_module("filters-bar", function (sb) {
    var filters;

    return {
        init : function () {
            filters = sb.find('a');
            sb.addEvent(filters, "click", this.filterProducts);
        },
        destroy : function () {
            sb.removeEvent(filters, "click", this.filterProducts);
            filter = null;
        },
        filterProducts : function (e) {
            sb.notify({
                    type : 'change-filter',
                    data : e.currentTarget.innerHTML
                });
        }
    };
});

CORE.create_module("product-panel", function (sb) {
    var products;

    function eachProduct(fn) {
        var i = 0, product;
        for ( ; product = products[i++]; ) {
            fn(product);
        }
    }
    
    function reset () {
        eachProduct(function (product) {
            product.style.opacity = '1';
        });
    }

    return {
        init : function () {
            var that = this;

            this.getProducts();

            sb.listen({
                'change-filter' : this.change_filter,
                'reset-filter'  : this.reset,
                'perform-search': this.search,
                'quit-search'   : this.reset
            });
            eachProduct(function (product) {
                sb.addEvent(product, 'click', that.addToCart);
            });
        },
        destroy : function () {
            var that = this;
            eachProduct(function (product) {
                sb.removeEvent(product, 'click', that.addToCart);
            });
            sb.ignore(['change-filter', 'reset-filter', 'perform-search', 'quit-search']);
        },
        getProducts: function () {
            var serverProducts;
            
            sb.login('moravia', 'argentina', function(response) {
                
                sb.getData(function (response) {
                    if(response.length) {
                        serverProducts = response;
                    };
                })
            });
            
            
            products = sb.find("li");
            
        },
        createProducts: function (serverProducts) {
            console.log(serverProducts);
        },
        reset : reset,
        change_filter : function (filter) {
            reset();
            eachProduct(function (product) {
                if (product.getAttribute("data-8088-keyword").toLowerCase().indexOf(filter.toLowerCase()) < 0) {
                    product.style.opacity = '0.2';
                }
            });
        },
        search : function (query) {
            reset();
            query = query.toLowerCase();
            eachProduct(function (product) {
                if (product.getElementsByTagName('p')[0].innerHTML.toLowerCase().indexOf(query) < 0) {
                    product.style.opacity = '0.2';
                }
            });
        }
    };
});

CORE.start_all();

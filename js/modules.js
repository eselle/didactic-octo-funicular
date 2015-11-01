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

    function each(array, fn) {
        var i = 0, product;
        for ( ; product = array[i++]; ) {
            fn(product);
        }
    }
    
    function reset () {
        each(products, function (product) {
            product.style.opacity = '1';
        });
    }

    return {
        init : function () {
            this.getProducts();

            sb.listen({
                'change-filter' : this.change_filter,
                'reset-filter'  : this.reset,
                'perform-search': this.search,
                'quit-search'   : this.reset
            });
        },
        destroy : function () {
            var that = this;
            each(products, function (product) {
                sb.removeEvent(product, 'click', that.addToCart);
            });
            sb.ignore(['change-filter', 'reset-filter', 'perform-search', 'quit-search']);
        },
        getProducts: function () {
            var serverProducts;
            var that = this;
            
            sb.login('moravia', 'argentina', function(response) {
                
                sb.getData(function (response) {
                    if(response.length) {
                        that.createProducts(response);
                    };
                })
            });
        },
        createProducts: function (productsResponse) {
            var productsContainer = sb.find('ul')[0];
            var that = this;
            
            each(productsResponse, function (product) {
                var productItem = sb.create_element(
                    'li',
                    { 
                        id : product.id,
                        'data-8088-keyword': product.keyword,                                 
                        children : [ 
                            sb.create_element('img', { 'src' : product.file }), 
                            sb.create_element('p', { text : product.name })
                        ]
                    }
                );
                
                sb.addEvent(productItem, 'click', that.addToCart);
                productsContainer.appendChild(productItem);
            });
            
            products = sb.find('li'); 
        },
        reset : reset,
        change_filter : function (filter) {
            reset();
            each(products, function (product) {
                if (product.getAttribute("data-8088-keyword").toLowerCase().indexOf(filter.toLowerCase()) < 0) {
                    product.style.opacity = '0.2';
                }
            });
        },
        search : function (query) {
            reset();
            query = query.toLowerCase();
            each(products, function (product) {
                if (product.getElementsByTagName('p')[0].innerHTML.toLowerCase().indexOf(query) < 0) {
                    product.style.opacity = '0.2';
                }
            });
        },
        addToCart : function (e) {
            var li = e.currentTarget;
        
            sb.notify({
                type: 'add-to-cart',
                data: {
                    id: li.id,
                    name: li.getElementsByTagName('p')[0].innerHTML
                }
            })
        }
    };
});

CORE.create_module("shopping-cart", function (sb) {
    var cart;
    
    return {
        init: function () {
            cart = sb.find("#shopping-list")[0];
            
            sb.listen({
                'add-to-cart': this.addProduct
            })
        },
        
        //Here I'm doing the same as in product-panel, erasing objects and removing events
        destroy: function () {
            cart = null;
            
            sb.ignore(['add-to-cart']);
        },
        
        addProduct : function (product) { 
            var cartItem = sb.find('#cart-item' + product.id)[0]; 
            if (!cartItem) { 
                cartItem = sb.create_element('li', { id : "cart-item" + product.id, children : [ 
                        sb.create_element('span', { 'class' : 'product_name', text : product.name }), 
                        ]}); 

                cart.appendChild(cartItem);
            }
        }
    };
});

CORE.start_all();

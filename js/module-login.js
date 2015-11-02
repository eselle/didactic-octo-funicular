CORE.create_module("login", function (sb) {
    var userInput, passwordInput, loginButton;
    
    return {
        init: function () {
            userInput = sb.find("#username")[0];
            passwordInput = sb.find("#password")[0];
            loginButton = sb.find("#login_button")[0];
            
            sb.addEvent(loginButton, "click", this.login);
        },
        destroy: function () {
            sb.removeEvent(loginButton, "click", this.login);
            
            userInput = null;
            passwordInput = null;
            loginButton = null;
        },
        login: function () {
            var username = userInput.value;
            var password = passwordInput.value;
            
            sb.login(username, password, function (response, status) {
                console.log(response);
                if(response.success === true) {
                    //change to href
                    window.location.replace('/');
                } else {

                };
            });
        }
    }
});

CORE.start('login');

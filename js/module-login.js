CORE.create_module("login", function (sb) {
    var userInput, passwordInput, loginForm, messageAlert;
    
    return {
        init: function () {
            userInput = sb.find("#username")[0];
            passwordInput = sb.find("#password")[0];
            loginForm = sb.find("#login_form")[0];
            messageAlert = sb.find(".message-alert")[0];
            
            sb.addEvent(loginForm, "submit", this.login);
        },
        destroy: function () {
            sb.removeEvent(loginButton, "click", this.login);
            
            userInput = null;
            passwordInput = null;
            loginButton = null;
        },
        login: function (e) {
            var username = userInput.value;
            var password = passwordInput.value;
            
            e.preventDefault();
            sb.login(username, password, function (response, status) {
                if(response.success === true) {
                    window.location.href='/';
                } else {
                    if(response.message) {
                        messageAlert.innerHTML = response.message;
                    };
                };
            });
        }
    }
});

CORE.start('login');

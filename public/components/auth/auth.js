var app = angular.module("TodoApp.Auth", []);

app.config(["$routeProvider", function ($routeProvider) {  
    $routeProvider
        .when("/signup", {
            templateUrl: "components/auth/signup/signup.html",
            controller: "SignupController"
        })
        .when("/login", {
            templateUrl: "components/auth/login/login.html",
            controller: "LoginController"
        })
        .when("/logout", {
            controller: "LogoutController",
            template: ""
        })
        .when("/forgot", {
            templateUrl: "components/auth/forgot/forgot.html",
            controller: "ForgotPasswordController"
        })
}]);

app.service("TokenService", [function () {  
    var userToken = "token";

    this.setToken = function (token) {
        localStorage[userToken] = token;
    };

    this.getToken = function () {
        console.log(userToken)
        return localStorage[userToken];
    };

    this.removeToken = function () {
        localStorage.removeItem(userToken);
    };
}]);

app.service("UserService", ["$http", "$location", "TokenService", function ($http, $location, TokenService) {  
    this.signup = function (user) {
        return $http.post("/auth/signup", user);
    };

    this.login = function (user) {
        return $http.post("/auth/login", user).then(function (response) {
            TokenService.setToken(response.data.token);
            return response;
        });
    };

    this.logout = function () {
        TokenService.removeToken();
        $location.path("/login");
    };

    this.isAuthenticated = function () {
        return !!TokenService.getToken();
    };
    
    this.changePassword = function (newPassword) {  
        console.log(newPassword);
        return $http.post("/auth/change-password", {newPassword: newPassword}).then(function (response) {
            alert("Password Changed Successfully!");
            return response.data;
        }, function (response) {
            alert("Problem with the server");
        });
    };
    this.forgotPassword = function (email) {  
        console.log("Sending an email to " + email);
        return $http.post("/auth/forgot", {email: email})
    };
}]);

app.service("AuthInterceptor", ["$q", "$location", "TokenService", function ($q, $location, TokenService) {  
    this.request = function(config) {
        var token = TokenService.getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    };

    this.responseError = function(response) {
        if (response.status === 401) {
            TokenService.removeToken();
            $location.path("/login");
        }
        return $q.reject(response);
    };
}]);

app.config(["$httpProvider", function ($httpProvider) {  
    $httpProvider.interceptors.push("AuthInterceptor");
}]);
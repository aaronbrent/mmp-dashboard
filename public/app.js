var app = angular.module("TodoApp", ["ngRoute", "TodoApp.Auth", "chart.js"]);

app.config(function ($routeProvider, ChartJsProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "components/home/home.html"
        })
        .when("/todos", {
            templateUrl: "components/todos/todos.html",
            controller: "TodoController"
        })
        .when("/profile", {
            templateUrl: "components/profile/profile.html",
            controller: "ProfileController"
        })
});

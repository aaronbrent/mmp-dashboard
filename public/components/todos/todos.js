var app = angular.module("TodoApp");

app.service("TodoService", ["$http", function ($http) {
    this.getTodos = function () {
        return $http.get("/api/todo").then(function (response) {
            return response.data;
        }, function (response) {
            alert("Error " + response.status + ": " + response.statusText);
        });
    };

    this.saveTodo = function (todo) {
        return $http.post("/api/todo", todo).then(function (response) {
            return response.data;
        }, function (response) {
            alert("Error " + response.status + ": " + response.statusText);
        });
    };
}]);

app.controller("TodoController", ["$scope", "$http", "TodoService", function ($scope, $http, TodoService) {
     $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];

    // define and immediately invoke this function when the 
    // page loads to get the list of todos from the server
    (function getTodos() {
        TodoService.getTodos().then(function (todos) {
            $scope.todos = todos;
        });
    })();
}]);
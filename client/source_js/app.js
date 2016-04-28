var app = angular.module('mainApp', ['ngRoute', 'MainControllers', 'MainServices']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/list', {
        templateUrl: 'partials/list.html',
        controller: 'mainController'
    })

}]);

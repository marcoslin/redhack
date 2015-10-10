(function () {

    var app = angular.module('redhack', ['ui.router','ui.bootstrap']);

    // Define application route

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'view/home.html',
                controller: 'HomeController'
            })

            // Search
            .state('search', {
                url: '/search',
                templateUrl: 'view/search.html',
                controller: 'HomeController'
            })
            .state('search-route', {
                url: '/search-route',
                templateUrl: 'view/search-route.html',
                controller: 'RouteController'
            })
            .state('search-save', {
                url: '/search-save',
                templateUrl: 'view/search-save.html',
                controller: 'RouteController'
            })

            // Main
            .state('main', {
                url: '/main',
                templateUrl: 'view/main.html',
                controller: 'MainController'
            })
        ;

    }]);


})();
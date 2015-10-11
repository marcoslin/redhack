(function () {

    var app = angular.module('redhack', ['ui.router','ui.bootstrap', 'ngResource']);

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
            .state('main-pre', {
                url: '/main-pre',
                templateUrl: 'view/main-pre.html',
                controller: 'MainController'
            })
            .state('main-post', {
                url: '/main-post',
                templateUrl: 'view/main-post.html',
                controller: 'MainController'
            })


            .state('main-route', {
                url: '/main-route',
                templateUrl: 'view/main-route.html',
                controller: 'MainController'
            })

            // Game
            .state('game', {
                url: '/game',
                templateUrl: 'view/game.html'
            })
        ;

    }]);


})();
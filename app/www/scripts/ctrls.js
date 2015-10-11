(function () {
    var app = angular.module('redhack');

    app.controller('CoreController', ['$scope', '$rootScope', '$log', function ($scope, $rootScope, $log) {
        $scope.fs = {
            'show_logo': false,
            'row_style': 'col-xs-10 col-xs-offset-1'
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            $log.info('State changed to', toState);
            if (toState.name === 'home') {
                $scope.fs.show_logo = false;
            } else {
                $scope.fs.show_logo = true;
            }
        });
    }]);


    app.controller('HomeController', ['$scope', 'dataService', '$q', '$log', function ($scope, dataService, $q, $log) {
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.open = function($event) {
            $scope.status.opened = true;
        };
        $scope.status = {
            opened: false
        };

        $scope.dt = new Date("2015-10-12");
        $scope.dt_hour = 14;
        $scope.dt_min = 50;

        $scope.trovastazione = function (station) {
            $log.info('Search trovastazione:', station);
            return dataService.trovastazione(station).then(function (data) {
                $log.info('trovastazione:', data.results);
                return data.results;
            });
        };

    }]);

    app.controller('RouteController', ['$scope', '$state', 'dataService', '$log', function ($scope, $state, dataService, $log) {
        $scope.showDetail = function () {
            $state.go('search-save');
        };
    }]);

    app.controller('MainController', ['$scope', '$state', 'dataService', '$log', function ($scope, $state, dataService, $log) {
        $scope.rate = 0;
        $scope.max = 5;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

        dataService.numeropersone().then(function (data) {
            $log.info('numeropersone: ', data);
            $scope.numeropersone = data.totale_persone;

        });


    }]);


    

})();

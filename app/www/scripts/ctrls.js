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


    app.controller('HomeController', ['$scope', '$log', function ($scope, $log) {
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.open = function($event) {
            $scope.status.opened = true;
        };
        $scope.status = {
            opened: false
        };
        $scope.today();
    }]);

    app.controller('RouteController', ['$scope', '$state', '$log', function ($scope, $state, $log) {
        $scope.showDetail = function () {
            $state.go('search-save');
        };
    }]);

    app.controller('MainController', ['$scope', '$state', '$log', function ($scope, $state, $log) {
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
    }]);


    

})();
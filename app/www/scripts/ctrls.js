(function () {
    var app = angular.module('redhack');


    app.controller('HomeController', ['$scope', '$log', function ($scope, $log) {
        $scope.message = 'hello';
    }]);

    app.controller('RouteController', ['$scope', '$state', '$log', function ($scope, $state, $log) {
        $scope.showDetail = function () {
            $state.go('search-save');
        };
    }]);

    app.controller('MainController', ['$scope', '$state', '$log', function ($scope, $state, $log) {
        $scope.message = 'hello';
    }]);


    

})();

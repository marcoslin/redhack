(function () {
    var app = angular.module('redhack'),
        server = "http://localhost:5000/"
    ;

    app.service('dataService', ['$resource', '$log', function ($resource, $log) {
        var self = this;

        this.trovastazione = function (station) {
            var url = server + 'trovastazione?name=:name',
                srv = $resource(url, {name: station})
            ;
            return srv.get().$promise;
        };

        this.numeropersone = function () {
            var url = server + 'numeropersone',
                srv = $resource(url)
            ;
            return srv.get().$promise;
        };

    }]);
})();


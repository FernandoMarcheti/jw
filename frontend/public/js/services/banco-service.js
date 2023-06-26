(function (angular) {
    'use strict';

    angular.module('sce').factory('BancoService', function ($http, baseUrlApi) {
        var service = this;
        var urlBase = baseUrlApi.apiUrl + 'banco';

        service.recuperarBancos = function () {
            return $http.get(urlBase + '/febraban');
        };

        return service;
    });

})(angular);
(function (angular) {
    'use strict';

    angular.module('sce').factory('ContaBancariaService', function ($http, baseUrlApi, $q) {
        var service = this;
        var urlBase = baseUrlApi.apiUrl + 'contaBancaria';

        service.salvarContaBancaria = function (contaBancaria) {
            return $q(function (resolve, reject) {
                if (contaBancaria._id) {
                    $http.put(urlBase + '/' + contaBancaria._id, contaBancaria)
                        .then(function (response) {
                            resolve(response);
                        });
                } else {
                    $http.post(urlBase, contaBancaria)
                        .then(function (response) {
                            resolve(response);
                        });
                }
            });
        };

        service.recuperarContasBancarias = function () {
            return $http.get(urlBase);
        };

        service.excluirContaBancaria = function (id) {
            return $http.delete(urlBase + '/' + id)
        };

        return service;
    });

})(angular);
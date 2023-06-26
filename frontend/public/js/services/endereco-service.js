(function (angular) {
    'use strict';

    angular.module('sce').factory('enderecoService', function ($http, baseUrlApi, $q) {
        var service = this;
        var urlBase = baseUrlApi.apiUrl + 'endereco';

        service.buscarEndereco = function (cep) {
            return $q(function (resolve, reject) {
                $http.get(urlBase + '/' + cep)
                    .then(function (response) {
                        resolve(response);
                    })
                    .catch(function (response) {
                        reject({ mensagem: "mensagem..." });
                    });
            });
        }

        service.formatarEndereco = function (endereco) {
            var complemento = endereco.complemento ? `, ${endereco.complemento}` : '';
            return `${endereco.logradouro}, ${endereco.numero} ${complemento}<br>
            ${endereco.bairro}<br>
            ${endereco.localidade}/${endereco.uf}<br>
            CEP: ${endereco.cep}`;
        }

        return service;
    });

})(angular);
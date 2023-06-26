(function (angular) {
    'use strict';

    angular.module('sce').factory('produtoService', function ($http, baseUrlApi, $q) {
        var service = this;
        var urlBase = baseUrlApi.apiUrl + 'produto';

        service.salvar = function (produto) {
            return $q(function(resolve, reject){
                if (produto._id) {
                    $http.put(urlBase + '/' + produto._id, produto)
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(response) {
                        reject({mensagem: "mensagem...."});
                    });
                } else {
                    $http.post(urlBase, produto)
                    .then(function(response){
                        resolve(response);
                    })
                    .catch(function(response){
                        reject({mensagem: "mensagem...."});
                    });
                }
            });
        };

        service.buscarProdutos = function (nome) {
            return $q(function(resolve, reject){
                $http.get(urlBase + '?search=' + nome)
                .then(function(response){
                    resolve(response);
                })
                .catch(function(response){
                    reject({mensagem: "mensagem...."});
                });
            });
        };

        service.excluirProduto = function (id) {
            return $q(function(resolve, reject){
                $http.delete(urlBase + '/' + id)
                .then(function(response){
                    resolve(response);
                })
                .catch(function(response){
                    reject({mensagem: "mensagem...."});
                });
            });           
        }

        return service;
    });

})(angular);
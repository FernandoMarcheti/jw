(function(angular){

	'use strict';

	angular.module('sce').factory('lancamentoService', ['$q', 'baseUrlApi', '$http', '$resource', function ($q, baseUrlApi, $http, $resource) {
		var service = this;
        var urlBase = baseUrlApi.apiUrl + 'lancamento';

        service.salvar = function (lancamento) {
            
            return $q(function(resolve, resject){
                if (lancamento._id) {
                    $http.put(urlBase + '/' + lancamento._id, lancamento)
                    .then(function(){
                        resolve({mensagem: 'Os dados do lancamento foram atualizados com sucesso'});
                    })
                    .catch(function(){
                        resject({mensagem: 'Os dados do lancamento não puderam ser atualizados'});
                    });
                } else {
                    $http.post(urlBase, lancamento)
                    .then(function(){
                        resolve({mensagem: 'Os dados do lancamento foram salvos com sucesso'});
                    })
                    .catch(function(){
                        resject({mensagem: 'Os dados do lancamento não puderam ser salvos'});
                    });
                }   
            });
            
        };

        service.excluir = function (lancamentoId) {
            return $q(function(resolve, resject){
                $http.delete(urlBase + '/' + lancamentoId)
                    .then(function(response){
                        resolve(response);
                    })
                    .catch(function(response){
                        resject({mensagem: 'Os dados do lançamento não puderam ser carregados'});
                    });
            });
        };

        service.buscarLancamentos = function (periodo) {
            if(!periodo) {
                periodo = {};
            }

            return $q(function (resolve, resject) {
                var resource = $resource(urlBase, {}, {
                    get: {
                        method: 'GET',
                        data: false,
                        headers: { 'data-inicio': periodo.dtInicio, 'data-fim': periodo.dtFim }
                    }
                });

                resource.get({}, function (response) {
                    resolve(response);
                }, function () {
                    resject({ mensagem: 'Os dados do relatório não puderam ser carregados' });
                });
            });
        };

        service.buscarLancamentoPorId = function(lancamentoId){
            return $q(function(resolve, resject){
                $http.get(urlBase + '/editar/' +lancamentoId)
                    .then(function(response){
                        resolve(response);
                    })
                    .catch(function(response){
                        resject({mensagem: 'Os dados do lançamento não puderam ser carregados'});
                    });
            });
        }

        service.carregarClientesEProdutos = function () {
            return $q(function(resolve, resject){
                $http.get(urlBase + '/carregarDados')
                    .then(function(response){
                        resolve(response);
                    })
                    .catch(function(response){
                        resject({mensagem: 'Os dados do lançamento não puderam ser carregados'});
                    });
            });
        };

        service.carregarNumeroLancamento = function(){
            return $q(function(resolve, resject){
                $http.get(urlBase + '/carregarDados/numeroLancamento/novo')
                    .then(function(response){
                        resolve(response);
                    })
                    .catch(function(response){
                        resject({mensagem: 'Os dados do lançamento não puderam ser carregados'});
                    });
            });
        };

		return service;
	}]);

})(angular);
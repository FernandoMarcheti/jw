(function(angular){

	'use strict';

	angular.module('sce').factory('empresaService', ['$q', 'baseUrlApi', '$http', function ($q, baseUrlApi, $http) {
		var service = this;
        var urlBase = baseUrlApi.apiUrl + 'empresa';
        var urlBaseNotificacao = baseUrlApi.apiUrl + 'notificacao';

        //notificação
        service.enviarNotificacao = function (notificacao) {
            return $q(function(resolve, resject){
                $http.post(urlBaseNotificacao, notificacao)
                .then(function(){
                    resolve({mensagem: 'Notificações enviadas com sucesso'});
                })
                .catch(function(){
                    resject({mensagem: 'Houve um erro no envio das notificações'});
                });
            });
        };


        service.salvar = function (empresa) {
            return $q(function(resolve, resject){
                if (empresa._id) {
                    $http.put(urlBase + '/' + empresa._id, empresa)
                    .then(function(){
                        resolve({mensagem: 'Os dados da empresa foram atualizados com sucesso'});
                    })
                    .catch(function(){
                        resject({mensagem: 'Os dados da empresa não puderam ser atualizados'});
                    });
                } else {
                    $http.post(urlBase, empresa)
                    .then(function(){
                        resolve({mensagem: 'Os dados da empresa foram salvos com sucesso'});
                    })
                    .catch(function(){
                        resject({mensagem: 'Os dados da empresa não puderam ser salvos'});
                    });
                }   
            });
            
        };

        service.buscarEmpresa = function () {
            return $q(function(resolve, resject){
                $http.get(urlBase)
                    .then(function(response){
                        resolve(response);
                    })
                    .catch(function(response){
                        resject({mensagem: 'Os dados da empresa não puderam ser carregados'});
                    });
            });
        };

		return service;
	}]);

})(angular);
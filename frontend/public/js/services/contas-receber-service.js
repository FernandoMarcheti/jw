(function (angular) {

    'use strict';

    angular.module('sce').factory('contasReceberService', ['$q', '$http', 'baseUrlApi', '$resource', function ($q, $http, baseUrlApi, $resource) {
        var service = this;
        var urlBase = baseUrlApi.apiUrl + 'contas-receber';

        service.salvar = function (fechamentos) {
            return $q(function (resolve, reject) {
                $http.post(urlBase, fechamentos)
                    .success(function (response) {
                        resolve({ response: response, mensagem: "mensagem..." });
                    })
                    .error(function (response) {
                        reject({ mensagem: "Erro ao tentar realizar esta operação" });
                    });
            });
        };

        service.salvar13 = function (fechamento) {
            return $q(function (resolve, reject) {
                $http.post(urlBase + '/salvar/decimo-terceiro/', fechamento)
                    .success(function (response) {
                        resolve({ response: response, mensagem: "mensagem..." });
                    })
                    .error(function (response) {
                        reject({ mensagem: "Erro ao tentar realizar esta operação" });
                    });
            });
        };

        service.baixar = function (conta) {
            return $q(function (resolve, reject) {
                $http.post(urlBase + '/baixar/', conta)
                    .success(function (response) {
                        resolve(response);
                    })
                    .error(function (response) {
                        reject({ mensagem: "Erro ao tentar realizar esta operação" });
                    });
            });
        };

        service.buscarContasReceber = function (obj) {
            if (!obj) obj = {};

            return $q(function (resolve, resject) {
                var resource = $resource(urlBase, {}, {
                    get: {
                        method: 'GET',
                        data: false,
                        headers: { 'data-inicio': obj.dtInicio, 'data-fim': obj.dtFim }
                    }
                });

                resource.get({}, function (response) {
                    resolve(response.contasReceber);
                }, function () {
                    resject({ mensagem: 'Os dados do contas à receber não puderam ser carregados' });
                });
            });
        };

        service.agruparContas = function (contas) {
            var contasAgrupadas = [];

            contas.forEach(function (conta) {
                var f = {};
                f.numeroFechamento = conta.numerofechamento;
                f.cliente = conta.lancamentos[0].cliente.razaoSocial;
                f.dataVencimento = conta.dataVencimento;
                if(!conta.isConta13){
                    f.mensalidade = conta.lancamentos[0].cliente.valorMensalidade || 0;
                } else {
                    f.mensalidade = 0;
                }
                    
                f.mensalidadeSemFormato = conta.lancamentos[0].cliente.valorMensalidade || 0;
                f.valorLancamento = conta.lancamentos.reduce(function (prev, cur) {
                    return prev + cur.valorTotal;
                }, 0);
                f.valorTotal = f.mensalidade + f.valorLancamento;
                f.isBaixada = conta.isBaixada;
                f.codigoCliente = conta.lancamentos[0].cliente.codigo
                f.lancamentos = conta.lancamentos;
                contasAgrupadas.push(f);
            });

            return contasAgrupadas;
        };

        return service;
    }]);

})(angular);
(function (angular) {

    'use strict';

    angular.module('sce').factory('fechamentoService', ['$q', 'baseUrlApi', '$http', '$resource', 'lancamentoService', function ($q, baseUrlApi, $http, $resource, lancamentoService) {
        var service = this;
        var urlBase = baseUrlApi.apiUrl + 'fechamento';
	var lancamentoUrl = baseUrlApi.apiUrl + 'lancamento';

        service.buscarFechamentos = function (periodo) {
            return $q(function (resolve, resject) {
                var resource = $resource(urlBase, {}, {
                    get: {
                        method: 'GET',
                        data: false,
                        headers: { 'data-inicio': periodo.dataInicio, 'data-fim': periodo.dataFim }
                    }
                });

                resource.get({}, function (response) {
                    
		    let mesAtual = new Date().getMonth()+1;
                    let lancamentos = [];
                    if(mesAtual == 13) {
                        let produtos = getProdutos13Cache(mesAtual);
                        var promisesSequences = [];
                        var promisesLancamentos = [];
                        let cliente = {}
                        let clientes = []
                        let quantidadeClientes = 0;
                        new Promise(function(resolve2, reject){
                            response.fechamentos.forEach(f => {
                                cliente = f.lancamentos[0].cliente;
                                if(cliente.decimoTerceiro && cliente.tipoDecimoTerceiro === "parcelado") {
                                    quantidadeClientes++;
                                    clientes.push(cliente)
                                }
                            });
                            quantidadeClientes = quantidadeClientes * 12;
                            for (let index = 0; index < quantidadeClientes; index++) {
                                promisesSequences.push(lancamentoService.carregarNumeroLancamento())
                            }
                            Promise.all(promisesSequences)
                                .then(function(nLancamento){
                                    new Promise(function(resolve3, reject){
                                        let produtos = getProdutos13Cache()
                                        let contadorLancamentos = 0
                                        let cliente = {}
                                        let ano = new Date().getFullYear();
                                        nLancamento.forEach(n => {

                                            if(contadorLancamentos == 0) {
                                                cliente = clientes.pop();
                                            }
                                            let produto = produtos[contadorLancamentos]
                                            let sequence = n.data.sequence;
                                            let lancamento = {
                                                cliente: cliente,
                                                produto: produto,
                                                numeroLancamento: sequence,
                                                quantidade: 1,
                                                valorUnitario: cliente.valorMensalidade ? cliente.valorMensalidade / 12 : 0,
                                                valorTotal: cliente.valorMensalidade ? cliente.valorMensalidade / 12 : 0,
                                                data: new Date(ano, contadorLancamentos, 1)
                                            }
                                            promisesLancamentos.push(lancamento);
                                            contadorLancamentos++;
                                            if(contadorLancamentos == 12) {
                                                contadorLancamentos = 0
                                            }
                                        });
                                        Promise.all(promisesLancamentos)
                                            .then(function(lancamento){
                                                $http.post(lancamentoUrl, lancamento)
                                                .then(function(){
                                                    resolve(response);
                                                })
                                        })
                                        .catch(function(errLancamento){
                                            SnackBarService.error(errLancamento.data.mensagem);
                                        });
                                    });
                                    
                                 });
                        })
                    } else {
                        resolve(response);
                    }
                }, function () {
                    resject({ mensagem: 'Os dados do fechamento não puderam ser carregados' });
                });
            });
        };


	function getProdutos13Cache() {
            return [{
                "_id": "5961a3506a4c0022f8d39b2e",
                "codigo": 237,
                "sequencia": 1,
                "nome": "01/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39b4a",
                "codigo": 265,
                "sequencia": 2,
                "nome": "02/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39b36",
                "codigo": 245,
                "sequencia": 3,
                "nome": "03/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39b43",
                "codigo": 258,
                "sequencia": 4,
                "nome": "04/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39b35",
                "codigo": 244,
                "sequencia": 5,
                "nome": "05/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39b41",
                "codigo": 256,
                "sequencia": 6,
                "nome": "06/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39b37",
                "codigo": 246,
                "sequencia": 7,
                "nome": "07/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39b2a",
                "codigo": 233,
                "sequencia": 8,
                "nome": "08/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39b5b",
                "codigo": 282,
                "sequencia": 9,
                "nome": "09/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39b32",
                "codigo": 241,
                "sequencia": 10,
                "nome": "10/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39b02",
                "codigo": 192,
                "sequencia": 11,
                "nome": "11/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }, {
                "_id": "5961a3506a4c0022f8d39a6a",
                "codigo": 36,
                "sequencia": 12,
                "nome": "12/12 - Parcela Adicional dos honorários Contábeis",
                "valor": 0
            }];
        }

        return service;
    }]);

})(angular);

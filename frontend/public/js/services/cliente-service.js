(function (angular) {
    'use strict';

    angular.module('sce').factory('clienteService', function ($http, baseUrlApi, $q, lancamentoService) {
        var service = this;
        var urlBase = baseUrlApi.apiUrl + 'cliente';

        service.salvar = function (cliente) {
            return $q(function(resolve, reject){
                if (cliente._id) {

                    $http.put(urlBase + '/' + cliente._id, cliente)
                    .then(function(response){

                        if(cliente.decimoTerceiro && cliente.tipoDecimoTerceiro === "parcelado" && !cliente.parcelasDecimoTerceiroAtualizadas) {

                            let mesAtual = new Date().getMonth()+1;
                            let ano = new Date().getFullYear();

                            let periodo = { dtInicio: new Date(ano, mesAtual-1, 1).getTime(), dtFim: new Date(ano, 11, 31).getTime() };
                            lancamentoService.buscarLancamentos(periodo)
                                .then(function(lancamentos){

                                    let lancamentoFiltrados = lancamentos.result
                                        .filter(l => l.cliente._id == cliente._id)
                                        .filter(l => [237, 265, 245, 258, 244, 256, 246, 233, 282, 241, 192, 36].find(e => e == l.produto.codigo ));

                                    lancamentoFiltrados.forEach(l => {
                                        lancamentoService.excluir(l._id);
                                    });

                                    let produtos = getProdutos13Cache(mesAtual);
                                    for (const p of produtos) {
                                        lancamentoService.carregarNumeroLancamento()
                                        .then(function(nLancamento){
                                            let sequence = nLancamento.data.sequence;
                                            let lancamento = {
                                                cliente: cliente,
                                                produto: p,
                                                numeroLancamento: sequence,
                                                quantidade: 1,
                                                valorUnitario: cliente.valorMensalidade / 12,
                                                valorTotal: cliente.valorMensalidade / 12,
                                                data: new Date(ano, mesAtual-1, 1)
                                            }
                                            lancamentoService.salvar(lancamento)
                                                .then(function() {
                                                    cliente.parcelasDecimoTerceiroAtualizadas = true;
                                                    $http.put(urlBase + '/' + cliente._id, cliente)
                                                        .then(function(responseFinal){
                                                            resolve({responseFinal: responseFinal, mensagem: 'Cliente alterado com sucesso'});
                                                        }).catch(function(){
                                                            reject({mensagem: 'Ocorreu um erro ao alterar o Cliente'});
                                                        })
                                                });
                                            mesAtual++;
            
                                        })
                                        .catch(function(errLancamento){
                                            SnackBarService.error(errLancamento.data.mensagem);
                                        });
                                    } 
                                })
                        } else {
                            resolve({response: response, mensagem: 'Cliente alterado com sucesso'});
                        }
                        
                    })
                    .catch(function(response){
                        reject({mensagem: 'Ocorreu um erro ao alterar o Cliente'});
                    });
                } else {
                    $http.post(urlBase, cliente)
                    .then(function(response){
                        resolve({response: response, mensagem: "Cliente salvo com sucesso"});
                    })
                    .catch(function(response){
                        reject({mensagem: "Ocorreu um erro ao salvar o Cliente"});
                    });
                }
            });            
        };

        service.buscarClientes = function (param) {
            return $q(function(resolve, reject){
                $http.get(urlBase + '?search=' + param)
                .then(function(cliente){
                    resolve(cliente);
                })
                .catch(function(){
                    reject({mensagem: 'Ocorreu um erro ao buscar os Clientes'});
                });    
            });
            
        };

        service.buscarClientePorId = function (codigo) {
            return $q(function(resolve, reject){
                $http.get(urlBase + '/' + codigo)
                .then(function(cliente){
                    resolve(cliente);
                })
                .catch(function(){
                    reject({mensagem: 'Ocorreu um erro ao buscar o Cliente'});
                });    
            });            
        };

        service.excluirCliente = function (id) {
            return $q(function(resolve, reject){
                $http.delete(urlBase + '/' + id)
                .then(function(response){
                    resolve({mensagem: "Cliente excluído com sucesso"});
                })
                .catch(function(response){
                    reject({mensagem: "Ocorreu um erro ao excluír Cliente"});
                });
            });
        };

        service.getNextSequence = function(){
            return $q(function(resolve, reject){
                $http.get(urlBase + '/recuperar/codigo')
                .then(function(response){
                    resolve(response);
                })
                .catch(function(response){
                    reject({mensagem: "Ocorreu um erro"});
                });
            });
        }

        function getProdutos13Cache(sequencia) {
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
            }].filter(n => n.sequencia >= sequencia)
        }

        return service;
    });

})(angular);
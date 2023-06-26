'use strict';

var FechamentoService = require('../services/fechamento');
var LancamentoService = require('../services/lancamento');
var ClienteService = require('../services/cliente');

class FechamentoController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/fechamento', this.getFechamentos.bind(this));   
    }

    getFechamentos(req, res) {
        LancamentoService.getLancamentos(req)
            .then(response => {
                if(!response.result.length){
                    return [];
                //     res.send({ fechamentos: [], mensagem: 'Nenhum Lançamento encontrado' });
                //     return;
                }
                return FechamentoService.montarFechamentos(req, response.result)
            })
            .then(lancamentos => {
                // if(lancamentos){
                    var promisesClientesAtual = [];
                    new Promise(function(resolve, reject){
                        lancamentos.forEach(function(lancamento){
                            var clienteId = lancamento[0].cliente.codigo;
                            promisesClientesAtual.push(ClienteService.getClienteById(req, clienteId));
                        });
                        Promise.all(promisesClientesAtual).then(function(clientes){
                            resolve(clientes);
                        });
                    }).then(function(clientes){
                        lancamentos.forEach(function(lancamentoGrupo, keyLancamento){
                            lancamentoGrupo.forEach(function(lancamento){
				delete lancamento.cliente;
                                lancamento.cliente = clientes[keyLancamento];
                                
				if(!lancamento.cliente.pagarMensalidade){
                                    lancamento.cliente.valorMensalidade = 0;
                                }
                            });                            
                        });

                        lancamentos = lancamentos.filter(function(l){
                            return l[0].cliente.gerarBoleto;
                        });
                   

                    }).then(function(){

                        ClienteService.getClientes(req)
                        .then(clientesAll => {

                            return clientesAll.filter(function(c){
                                return c.gerarBoleto;
                            });

                        }).then(function(clienteBoleto){

                            var lancamentosCompleto = inserirClientesSemLancamento(clienteBoleto, lancamentos)

                            lancamentosCompleto = lancamentosCompleto.sort(function(a, b){
                               return a[0].cliente.codigo - b[0].cliente.codigo;
                            });

                            var promises = [];
                            lancamentosCompleto.forEach(function (fechamento) { 
                                promises.push(FechamentoService.createFechamento(req, fechamento));
                            });
                            Promise.all(promises).then(function (response) {
                                var fechamentos = [];
                                response.forEach(function (e) {
                                    fechamentos.push(e.fechamentos);
                                });
                                res.send({ fechamentos: fechamentos, mensagem: response[0].mensagem });
                            }); 
                        });
                    });
                              
            });
    }
}

module.exports = FechamentoController;

function inserirClientesSemLancamento(clienteBoleto, lancamentos){
    var lancamentosCompleto = []
    lancamentos.forEach(function(l){
        lancamentosCompleto.push(l);
    });

    clienteBoleto.forEach(function(c){
        var existeCliente = false;
        lancamentos.forEach(function(l){
            if(c.codigo == l[0].cliente.codigo){
                existeCliente = true;
            }
        });

        if(!existeCliente){
            lancamentosCompleto.push([{cliente: c, quantidade: 0, valorUnitario: 0, valorTotal: 0, produto: {}}]);
        }
    });
    return lancamentosCompleto;
}

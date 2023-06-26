'use strict';

var LancamentoService = require('../services/lancamento');
var ClienteService = require('../services/cliente');
var ProdutoService = require('../services/produto');

class LancamentoController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/lancamento', this.getLancamentos.bind(this));
        this.router.get('/lancamento/editar/:id', this.getLancamentoById.bind(this));
        this.router.get('/lancamento/carregarDados', this.getClientesEProdutos.bind(this));
        this.router.get('/lancamento/carregarDados/numeroLancamento/novo', this.getNextSequence.bind(this));
        this.router.post('/lancamento', this.createLancamento.bind(this));
        this.router.delete('/lancamento/:id', this.deleteLancamento.bind(this));
        this.router.put('/lancamento/:id', this.putLancamento.bind(this));        
    }

    getLancamentos(req, res) {
        LancamentoService.getLancamentos(req).then(function (response) {
            res.send(response);
        });
    }

    getLancamentoById(req, res) {
        LancamentoService.getLancamentoById(req).then(function (response) {
            res.send(response);
        });
    }

    createLancamento(req, res) {
        LancamentoService.createLancamento(req).then(function (response) {
            res.send(response);

        });
    }

    deleteLancamento(req, res) {
        LancamentoService.deleteLancamento(req).then(function (response) {
            res.send(response);
        });
    }

    putLancamento(req, res) {
        LancamentoService.putLancamento(req).then(function (response) {
            res.send(response);
        });
    }

    getClientesEProdutos(req, res) {
        var responseArray = [];
        ClienteService.getClientes(req).then(function (response) {
            responseArray.push(response);
            ProdutoService.getProdutos(req).then(function (response) {
                responseArray.push(response);
                res.send(responseArray);
            });            
        });        
    }

    getNextSequence(req, res){
        LancamentoService.getNextSequence(req)
        .then(function(response){
            res.send(response);
        })
        .catch(function(response){
            res.send(response);
        });
    }
}

module.exports = LancamentoController;

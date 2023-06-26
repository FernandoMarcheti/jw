'use strict';

var ProdutoService = require('../services/produto');

class ProdutoController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/produto?:search', this.getProdutos.bind(this));
        this.router.get('/produto/:id', this.getProdutoById.bind(this));
        this.router.post('/produto', this.createProduto.bind(this));
        this.router.delete('/produto/:id', this.deleteProduto.bind(this));
        this.router.put('/produto/:id', this.putProduto.bind(this));
    }

    getProdutos(req, res) {
        ProdutoService.getProdutos(req).then(function (response) {
            res.send(response);
        });
    }

    getProdutoById(req, res) {
        ProdutoService.getProdutoById(req).then(function (response) {
            res.send(response);
        });
    }

    createProduto(req, res) {

        ProdutoService.getProdutos(req).then(function (response) {
            if(!response) {
                response = [];
            }
            
            let result = response.filter(function (value) {
                return value.nome.toLowerCase().removeAccents() == req.body.nome.toLowerCase().removeAccents();
            });

            if (!result.length) {
                ProdutoService.createProduto(req).then(function (response) {
                    res.send(response);
                });
            } else {
                res.send({ valido: false, mensagem: 'Já existe um produto cadastrado com esse nome!' });
            }
        });
    }

    deleteProduto(req, res) {
        ProdutoService.deleteProduto(req).then(function (response) {
            res.send(response);
        });
    }

    putProduto(req, res) {

        ProdutoService.getProdutos(req).then(function (response) {
            let result = response.filter(function (value) {
                return value.nome.toLowerCase().removeAccents() == req.body.nome.toLowerCase().removeAccents() && value._id != req.body._id;
            });

            if (!result.length) {
                ProdutoService.putProduto(req).then(function (response) {
                    res.send(response);
                });
            } else {
                res.send({ valido: false, mensagem: 'Já existe um produto cadastrado com esse nome!' });
            }
        });
    }
}

module.exports = ProdutoController;
'use strict';

var ContaBancariaService = require('../services/contaBancaria');

class ContaBancariaController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/contabancaria', this.getContasBancarias.bind(this));
        this.router.get('/contabancaria/:id', this.getContaBancariaById.bind(this));
        this.router.post('/contabancaria', this.createContaBancaria.bind(this));
        this.router.delete('/contabancaria/:id', this.deleteContaBancaria.bind(this));
        this.router.put('/contabancaria/:id', this.putContaBancaria.bind(this));
    }

    getContasBancarias(req, res) {
        ContaBancariaService.getContasBancarias().then(function(response){
            res.send(response);
        });
    }

    getContaBancariaById(req, res) {
        ContaBancariaService.getContaBancariaById(req).then(function (response) {
            res.send(response);
        });
    }

    createContaBancaria(req, res) {
        ContaBancariaService.createContaBancaria(req).then(function (response) {
            res.send(response);
        });
    }

    deleteContaBancaria(req, res) {
        ContaBancariaService.deleteContaBancaria(req).then(function (response) {
            res.send(response);
        });
    }

    putContaBancaria(req, res) {
        ContaBancariaService.putContaBancaria(req).then(function (response) {
            res.send(response);
        });
    }

}

module.exports = ContaBancariaController;
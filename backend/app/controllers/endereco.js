'use strict';

var EnderecoService = require('../services/endereco');

class EnderecoController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/endereco/:cep', this.getEndereco.bind(this));
    }

    getEndereco(req, res) {
        EnderecoService.getEndereco(req).then(function (response) {
            res.send(response);
        });
    }
}

module.exports = EnderecoController;
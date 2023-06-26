'use strict';

var EmpresaService = require('../services/empresa');

class EmpresaController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/empresa', this.getEmpresa.bind(this));
        this.router.post('/empresa', this.createEmpresa.bind(this));
        this.router.delete('/empresa/:id', this.deleteEmpresa.bind(this));
        this.router.put('/empresa/:id', this.putEmpresa.bind(this));
    }

    getEmpresa(req, res) {
        EmpresaService.getEmpresa(req).then(function (response) {
            res.send(response);
        });
    }

    createEmpresa(req, res) {
        EmpresaService.createEmpresa(req).then(function (response) {
            res.send(response);
        });
    }

    deleteEmpresa(req, res) {
        EmpresaService.deleteEmpresa(req).then(function (response) {
            res.send(response);
        });
    }

    putEmpresa(req, res) {
        EmpresaService.getEmpresa(req).then(function (response) {
            EmpresaService.putEmpresa(req).then(function (response) {
                res.send(response);
            });
        });
    }
}

module.exports = EmpresaController;
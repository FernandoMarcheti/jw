'use strict';

var AgendaCompromissoService = require('../services/agendaCompromisso');

class AgendaCompromissoController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/agenda-compromisso', this.getCompromissos.bind(this));
        this.router.post('/agenda-compromisso', this.createCompromisso.bind(this));
        this.router.delete('/agenda-compromisso/:id', this.deleteCompromisso.bind(this));
    }

    getCompromissos(req, res) {
        AgendaCompromissoService.getCompromissos(req).then(function (response) {
            res.send(response);
        });
    }

    createCompromisso(req, res) {
        AgendaCompromissoService.createCompromisso(req).then(function (response) {
            res.send(response);
        });
    }

    deleteCompromisso(req, res) {
        AgendaCompromissoService.deleteCompromisso(req).then(function (response) {
            res.send(response);
        });
    }
}

module.exports = AgendaCompromissoController;
'use strict';

var NotificacaoService = require('../services/notificacao-service');

class NotificacaoController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/notificacao', this.create.bind(this));
    }

    create(req, res) {
        NotificacaoService.create(req).then(function (response) {
            res.send(response);
        });
    }
}

module.exports = NotificacaoController;
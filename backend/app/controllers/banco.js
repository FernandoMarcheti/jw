'use strict';

class BancoController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/banco/febraban', this.getBancosFebraban.bind(this));
    }

    getBancosFebraban(req, res) {
        res.send(require('../util/bancos.json'));
    }
}

module.exports = BancoController;
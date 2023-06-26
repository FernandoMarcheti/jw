'use strict';

var ClienteService = require('../services/cliente');

class ClienteController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/cliente?:search', this.getClientes.bind(this));
        this.router.get('/cliente/:id', this.getClienteById.bind(this));
        this.router.get('/cliente/recuperar/codigo', this.getNextSequence.bind(this));
        this.router.post('/cliente', this.createCliente.bind(this));
        this.router.delete('/cliente/:id', this.deleteCliente.bind(this));
        this.router.put('/cliente/:id', this.putCliente.bind(this));
    }

    getClientes(req, res) {
        ClienteService.getClientes(req).then(function (response) {
            res.send(response);
        });
    }

    getClienteById(req, res) {
        ClienteService.getClienteById(req).then(function (response) {
            res.send(response);
        });
    }

    createCliente(req, res) {
        ClienteService.getClientes(req).then(function (response) {
            if(!response.clientes) {
                response.clientes = [];
            }

            let result = response.clientes.filter(function (value) {
                return value.razaoSocial.toLowerCase().removeAccents() == req.body.razaoSocial.toLowerCase().removeAccents();
            });

            if (!result.length) {
                ClienteService.createCliente(req).then(function (response) {
                    res.send(response);
                });
            } else {
                res.send({ valido: false, mensagem: 'Já existe um cliente cadastrado com esse cnpj/ cpf!' });
            }
        });
    }

    deleteCliente(req, res) {
        ClienteService.deleteCliente(req).then(function (response) {
            res.send(response);
        });
    }

    putCliente(req, res) {
        ClienteService.getClientes(req).then(function (response) {
            let result = response.filter(function (value) {
                return false;//value.nome.toLowerCase().removeAccents() == req.body.nome.toLowerCase().removeAccents() && value._id != req.body._id;
            });

            if (!result.length) {
                ClienteService.putCliente(req).then(function (response) {
                    res.send(response);
                });
            } else {
                res.send({ valido: false, mensagem: 'Já existe um cliente cadastrado com esse nome!' });
            }
        });
    }

    getNextSequence(req, res){
        ClienteService.getNextSequence(req)
        .then(function(response){
            res.send(response);
        })
        .catch(function(response){
            res.send(response);
        });
    }
}

module.exports = ClienteController;
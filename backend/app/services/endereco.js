'use strict';

var uuid = require('node-uuid');
var ObjectID = require("mongodb").ObjectID;
var ServiceBase = require('./serviceBase');
var Correios = require('node-correios'),
    correios = new Correios();

class EnderecoService {
    constructor() {
        this._connection = ServiceBase.getConnection();
    }

    getEndereco(req) {
         return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                correios.consultaCEP({ cep: req.params.cep }, function(err, result) {
                    err ? reject(err) : resolve(result);
                });     
            });
        });
    }
}

module.exports = new EnderecoService();
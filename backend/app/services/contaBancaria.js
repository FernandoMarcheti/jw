'use strict';

var uuid = require('node-uuid');
var ObjectID = require("mongodb").ObjectID;
var ServiceBase = require('./serviceBase');

class ContaBancariaService {
    constructor() {
        this._connection = ServiceBase.getConnection();
    }

    getProdutoById(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('produto').findOne({ _id: ObjectID(req.params.id) }, function (err, result) {
                    err ? reject(err) : resolve(result);
                });
            });
        });
    }

    getContasBancarias() {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {

                db.collection('contaBancaria').find({}).toArray(function (err, result) {
                    err ? reject(err) : resolve(result);
                });
            });
        });
    }

    createContaBancaria(req) {
        var contaBancaria = req.body;

        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {

                db.collection('contaBancaria').insert(contaBancaria, { safe: true }, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ contaBancaria: result.ops[0], mensagem: 'Operação realizada com sucesso!', valido: true });
                    }
                });
            });
        });
    }

    deleteContaBancaria(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {

                db.collection('contaBancaria').remove({ _id: ObjectID(req.params.id) }, function (err, result) {
                    err ? reject(err) : resolve({ mensagem: 'Operação realizada com sucesso!' });
                });
            });
        });
    }

    putContaBancaria(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                delete req.body._id;

                db.collection('contaBancaria').update({ _id: ObjectID(req.params.id) }, { $set: req.body }, function (err, result) {
                    console.log(result);
                    err ? reject(err) : resolve({ valido: true, mensagem: 'Operação realizada com sucesso!' });
                });
            });
        });
    }
}

module.exports = new ContaBancariaService();
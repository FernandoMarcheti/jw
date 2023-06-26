'use strict';

var uuid = require('node-uuid');
var ObjectID = require("mongodb").ObjectID;
var ServiceBase = require('./serviceBase');

class ProdutoService {
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

    getProdutos(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                var where = { };

                if (req.query.search && req.query.search != 'null' && req.query.search != 'undefined' && req.query.search != "") {
                   where.$text = {
                        $search: req.query.search,
                        $language: 'none',
                        $caseSensitive: false,
                        $diacriticSensitive: false
                    }
                }

                db.collection('produto').find(where).toArray(function (err, result) {
                    err ? reject(err) : resolve(result);
                });

                //db.close();
            });
        });
    }

    createProduto(req) {
        var produto = req.body;

        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {

                ServiceBase.getNextSequence(db, 'codigoproduto').then(function (sequence) {
                    produto.codigo = sequence;

                    db.collection('produto').insert(produto, { safe: true }, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {

                            resolve({ produto: result.ops[0], mensagem: 'Operação realizada com sucesso!', valido: true });
                        }
                    });
                    //db.close();
                }).catch(function (resp) {
                    reject(resp);
                });
            });
        });
    }

    deleteProduto(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {

                db.collection('produto').remove({ _id: ObjectID(req.params.id) }, function (err, result) {
                    err ? reject(err) : resolve({ mensagem: 'Operação realizada com sucesso!' });
                });

                //db.close();
            });
        });
    }

    putProduto(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                delete req.body._id;

                db.collection('produto').update({ _id: ObjectID(req.params.id) }, { $set: req.body }, function (err, result) {
                    console.log(result);
                    err ? reject(err) : resolve({ valido: true, mensagem: 'Operação realizada com sucesso!' });
                });

                //db.close();
            });
        });
    }
}

module.exports = new ProdutoService();
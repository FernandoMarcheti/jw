'use strict';

var uuid = require('node-uuid');
var ObjectID = require("mongodb").ObjectID;
var ServiceBase = require('./serviceBase');
var moment = require('moment');

class ContasReceberService {
    constructor() {
        this._connection = ServiceBase.getConnection();
    }

    baixarContasReceber(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                // delete req.body._id;

                db.collection('contasreceber').update({ numerofechamento: req.body.numeroFechamento }, 
                    { $set: req.body }, function (err, result) {
                    err ? reject(err) : resolve({ mensagem: 'Operação realizada com sucesso!' });
                });
            });
        });
    }

    createContasReceber(req) {
        var contasReceber = req.body;
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('contasreceber').insert(contasReceber, { safe: true }, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ contasReceber: result.ops[0], mensagem: 'Operação realizada com sucesso!' });
                    }
                });
            });
        });
    }

    createContasReceber13(req, contas) {
        var contasReceber = contas;
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('contasreceber').insert(contasReceber, { safe: true }, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ contasReceber: result.ops[0], mensagem: 'Operação realizada com sucesso!' });
                    }
                });
            });
        });
    }

    getContasReceber(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                var where = { "isBaixada": {"$exists":false} };

                if (req.header('data-inicio') && req.header('data-fim')) {
                    let dtInicio = moment(parseInt(req.header('data-inicio'), 10)).set({ hours: 0, minute: 0, second: 0 });
                    let dtFim = moment(parseInt(req.header('data-fim'), 10)).set({ hours: 23, minute: 59, second: 59 });

                    where.dataVencimento = {
                        // $elemMatch: {
                            // dataVencimento: {
                                $gte: dtInicio.format(),
                                $lte: dtFim.format()
                            // }
                        // }
                    };
                }

                db.collection('contasreceber').find(where).sort({numerofechamento:-1}).toArray(function (err, result) {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(result);
                    }
                });
            });
        });
    }

    getNextSequence(req){        
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                ServiceBase.getNextSequence(db, 'numerofechamento')
                .then(function (sequence) { 
                    resolve({ sequence: sequence });        
                })
                .catch(function (resp) {
                    reject(resp);
                }); 
            });
        });
    }
}

module.exports = new ContasReceberService();

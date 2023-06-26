'use strict';

var uuid = require('node-uuid');
var ServiceBase = require('./serviceBase');
var moment = require('moment');

class LancamentoService {
    constructor() {
        this._connection = ServiceBase.getConnection();
    }

    getLancamentos(req) {
         return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                var where = {};

                if(req.header('data-inicio') && req.header('data-fim')) {
                    let dtInicio = moment(parseInt(req.header('data-inicio'),10)).set({ hours: 0, minute: 0, second: 0});
                    let dtFim = moment(parseInt(req.header('data-fim'),10)).set({ hours: 23, minute: 59, second: 59});
                    
                    where.data = {
                        $gte: dtInicio.format(),
                        $lte: dtFim.format()
                    };
                }
                
                db.collection('lancamento').find(where).sort({numeroLancamento:-1}).limit(5000).toArray(function (err, result) {

                    if (err) {
                        reject(err)
                    } else {
                        resolve({result: result})
                    }
                });
            });
        });
    }

    getLancamentoById(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('lancamento').findOne({ _id: req.params.id }, function (err, result) {
                    err ? reject(err) : resolve(result);
                });
            });
        });
    }

    createLancamento(req) {
        var lancamento = req.body;
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {      
                lancamento.data = moment(lancamento.data).utc().format();
                
                db.collection('lancamento').insert(lancamento, { safe: true }, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ lancamento: result.ops[0], mensagem: 'Operação realizada com sucesso!' });
                    }
                });
            });
        });
    }

    deleteLancamento(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('lancamento').remove({ _id: req.params.id }, function (err, result) {
                    err ? reject(err) : resolve({ mensagem: 'Operação realizada com sucesso!' });
                });
            });
        });
    }

    putLancamento(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                delete req.body._id;

                db.collection('lancamento').update({ numeroLancamento: req.body.numeroLancamento }, { $set: req.body }, function (err, result) {
                    err ? reject(err) : resolve({ mensagem: 'Operação realizada com sucesso!' });
                });
            });
        });
    }

    getClientesEProdutos(req) {
         return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('lancamento').find().toArray(function (err, result) {
                    if(err) {
                        reject(err)
                    } else {                         
                        resolve(result[0]); 
                    }
                });       
            });
        });
    }

    getNextSequence(req){        
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                ServiceBase.getNextSequence(db, 'numerolancamento')
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

module.exports = new LancamentoService();

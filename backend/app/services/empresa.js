'use strict';

var uuid = require('node-uuid');
var ObjectID = require("mongodb").ObjectID;
var ServiceBase = require('./serviceBase');

class EmpresaService {
    constructor() {
        this._connection = ServiceBase.getConnection();
    }

    getEmpresa(req) {
         return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('empresa').find().toArray(function (err, result) {
                    if(err) {
                        reject(err)
                    } else {                         
                        resolve(result[0]); 
                    }
                });       
            });
        });
    }

    createEmpresa(req) {
        var empresa = req.body;
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {                
                db.collection('empresa').insert(empresa, { safe: true }, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ empresa: result.ops[0], mensagem: 'Operação realizada com sucesso!' });
                    }
                });
            });
        });
    }

    deleteEmpresa(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('empresa').remove({ _id: ObjectID(req.params.id) }, function (err, result) {
                    err ? reject(err) : resolve({ mensagem: 'Operação realizada com sucesso!' });
                });
            });
        });
    }

    putEmpresa(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                delete req.body._id;

                db.collection('empresa').update({ _id: ObjectID(req.params.id) }, { $set: req.body }, function (err, result) {
                    err ? reject(err) : resolve({ mensagem: 'Operação realizada com sucesso!' });
                });
            });
        });
    }
}

module.exports = new EmpresaService();
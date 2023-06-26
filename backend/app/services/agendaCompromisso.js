'use strict';

var uuid = require('node-uuid');
var ObjectID = require("mongodb").ObjectID;
var ServiceBase = require('./serviceBase');

class AgendaCompromissoService {
    constructor() {
        this._connection = ServiceBase.getConnection();
    }

    getCompromissos(req) {
         return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('agenda').find().toArray(function (err, result) {
                    if(err) {
                        reject(err)
                    } else {                         
                        resolve(result); 
                    }
                });       
            });
        });
    }

    createCompromisso(req) {
        var compromisso = req.body;
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {                
                db.collection('agenda').insert(compromisso, { safe: true }, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ compromisso: result.ops[0], mensagem: 'Operação realizada com sucesso!' });
                    }
                });
            });
        });
    }

    deleteCompromisso(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('agenda').remove({ _id: ObjectID(req.params.id) }, function (err, result) {
                    err ? reject(err) : resolve({ mensagem: 'Operação realizada com sucesso!' });
                });
            });
        });
    }
}

module.exports = new AgendaCompromissoService();
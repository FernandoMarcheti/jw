'use strict';

var uuid = require('node-uuid');
var ObjectID = require("mongodb").ObjectID;
var ServiceBase = require('./serviceBase');

class ClienteService {
    constructor() {
        this._connection = ServiceBase.getConnection();
    }

    getClienteById(req, id) {
        var _id = -1;
        if(id){
            _id = id
        } else {
            _id = req.params.id
        }
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('cliente').findOne({ codigo: id }, function (err, result) {
                    err ? reject(err) : resolve(result);
                });
            });
        });
    }

    getClientes(req) {
         return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                var where = {};
                var response = {clientes: [], nextSequence: -1};
                if (req.query.search && req.query.search != 'null' && req.query.search != 'undefined' && req.query.search != "") {
                    where.razaoSocial = new RegExp(req.query.search.toLowerCase().removeAccents(), 'i');
                }

                db.collection('cliente').find(where).toArray(function (err, result) {
                    if(err) {
                        reject(err)
                    } else {                         
                        resolve(result); 
                    }
                });       

                //db.close();
            });
        });
    }

    createCliente(req) {
        var cliente = req.body;
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {                
                db.collection('cliente').insert(cliente, { safe: true }, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ cliente: result.ops[0], mensagem: 'Operação realizada com sucesso!' });
                    }
                });
            });
        });
    }

    deleteCliente(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {

                db.collection('cliente').remove({ _id: ObjectID(req.params.id) }, function (err, result) {
                    err ? reject(err) : resolve({ mensagem: 'Operação realizada com sucesso!' });
                });

                //db.close();
            });
        });
    }

    putCliente(req) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                delete req.body._id;

                db.collection('cliente').update({ codigo: req.body.codigo }, { $set: req.body }, function (err, result) {
                    err ? reject(err) : resolve({ mensagem: 'Operação realizada com sucesso!' });
                });

                //db.close();
            });
        });
    }

    getNextSequence(req){        
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                ServiceBase.getNextSequence(db, 'codigocliente')
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

module.exports = new ClienteService();

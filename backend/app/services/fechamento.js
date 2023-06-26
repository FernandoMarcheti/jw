'use strict';

var uuid = require('node-uuid');
var ObjectID = require("mongodb").ObjectID;
var ServiceBase = require('./serviceBase');

class FechamentoService {
    constructor() {
        this._connection = ServiceBase.getConnection();
    }

    createSequence(sequence) {
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('counters').update(
                    {_id: "numerofechamento" }
                    ,{ $set : { seq: sequence}}
                    , function (err, result) {
                    if (err)
                        reject('Error get SEQUENCE');

                    resolve();
                });
            });
        });
    }

    getFechamentos(req) {
         return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.collection('fechamento').find().toArray(function (err, result) {
                    if(err) {
                        reject(err)
                    } else {                         
                        resolve(result); 
                    }
                });       
            });
        });
    }

    createFechamento(req, lancamentos) {
        var fechamento = { lancamentos: lancamentos };
        return this._connection.then(function (db) {
            return new Promise(function (resolve, reject) {

                ServiceBase.getNextSequence(db, 'numerofechamento').then(function (sequence) {
                    fechamento.numerofechamento = sequence;

                    db.collection('fechamento').insert(fechamento, { safe: true }, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ fechamentos: result.ops[0], mensagem: 'Operação realizada com sucesso!', valido: true });
                        }
                    });
                    //db.close();
                }).catch(function (resp) {
                    reject(resp);
                });
            });
        });
    }

    montarFechamentos(req, lancamentos){
        var fechamentos = [];
        var lancamentosPorCliente = [];
        var fechamentosSortCliente = lancamentos.sort(function(a, b){
           return parseInt(a.cliente.codigo) - parseInt(b.cliente.codigo);
        });

        var _id = fechamentosSortCliente[0].cliente._id;
        fechamentosSortCliente.forEach(function(fechamento, key){
            if(fechamento.cliente._id === _id){
                lancamentosPorCliente.push(fechamento);
            } else {
                fechamentos.push(lancamentosPorCliente);
                lancamentosPorCliente = [];
                lancamentosPorCliente.push(fechamento);
                _id = fechamento.cliente._id;
            }                
        });
        fechamentos.push(lancamentosPorCliente);
        return new Promise(function (resolve, reject) {
            resolve(fechamentos);      
        });
    }
}

module.exports = new FechamentoService();
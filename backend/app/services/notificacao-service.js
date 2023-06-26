'use strict';

var ServiceBase = require('./serviceBase');
var nodemailer = require('nodemailer');

class NotificacaoService {
    constructor() {
        this._connection = ServiceBase.getConnection();
    }

    create(req) {

        return new Promise(function (resolve, reject) {
            let notificacao = req.body;

            
            var emails = [];
    
            for (let index = 0; index < notificacao.emails.length; index++) {
                var email = {
                    from: '"Deives - Pecorare e Associados" <juridico@pecorare.com.br>',
                    to: notificacao.emails[index],
                    subject: notificacao.titulo,
                    text: notificacao.corpo, 
                };
                emails.push(email);
            }
    
            // https://github.com/nodemailer/nodemailer
            var transporte = nodemailer.createTransport({
                pool: true,
                host: 'relay.mailbaby.net',
                port: '587',
                secure: false,
                auth: {
                    user: 'mb37076', 
                    pass: 'Zbqn24kNAU4AxCsNMZQA'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            
            transporte.on("idle", function () {
                setTimeout(()=> {
                    while (transporte.isIdle() && emails.length) {
                        transporte.sendMail(emails.shift(), function(err, info){
                            if(err) {
                                console.error('Erro envio email', err)
                                reject();
                            }
                        });
                    }
                }, 1000);
            });

            resolve();
        });
        
    }
}

module.exports = new NotificacaoService();

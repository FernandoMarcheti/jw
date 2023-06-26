'use strict';

global.window = {document: {createElementNS: () => {return {}} }};
global.navigator = {};
global.btoa = () => {};

var ServiceBase = require('./serviceBase');
var fs = require('fs');
var nodemailer = require('nodemailer');

class BoletoService {
    constructor() {
        this._connection = ServiceBase.getConnection();
    }

    criaPastas() {
        var dirBoleto = '/boletos';
        var dirLogBoleto = '/boletos/log-email';
        if (!fs.existsSync(dirBoleto)){
            fs.mkdirSync(dirBoleto);
        }
        if (!fs.existsSync(dirLogBoleto)){
            fs.mkdirSync(dirLogBoleto);
        }

        var data = new Date();
        var ano = data.getFullYear();
        var mes = '0' + (data.getMonth() + 1);
        var dia = data.getDate();
        var pastaData = '/' + ano + '-' + mes.substring(mes.length > 2 ? 1 : 0) + '-' + dia; 
        var dirData = dirLogBoleto + pastaData;
        if (!fs.existsSync(dirData)){
            fs.mkdirSync(dirData);
        }
        return dirData + '/';
    }

    escreveEMandaEmail(req) {
        
        var diretorioLogEmail = this.criaPastas();
        var requisicoesParaEmail = req.body;
        var mensagens = [];
        var count = 1;

        var quantidadeMensagens = requisicoesParaEmail.length;
        var mensagensProcessadas = 0;

        var promisePDF = new Promise(function (resolve, reject) {
            requisicoesParaEmail.forEach(boletoObj => {
                
                console.log("***** CONSOLE 1")
                if(boletoObj.info == null) {
                    boletoObj.info = {};
                }

                var nomeArquivoPdfETxt = count + ' - ' + boletoObj.razaoSocial.replace(/[^\w\s]/gi, '') + '' + new Date().getTime();
                var nomeBoletoArquivo = diretorioLogEmail + nomeArquivoPdfETxt + '.html'

                var nomeArquivoPdf = diretorioLogEmail + nomeArquivoPdfETxt + '.pdf';

                var titulo = boletoObj.info.titulo || 'Boleto - Honorários Profissionais';
                var corpo = boletoObj.info.corpo || '';
                var email = {
                    from: 'cobranca@pecorare.com.br',
                    to: boletoObj.email,
                    subject: titulo,
                    text: corpo, 
                    attachments: [{ 
                        filename: 'boleto.pdf', 
                        path: nomeArquivoPdf 
                    }],

                    extra: {
                            // email : mensagem.email,
                            boletoObj : boletoObj,
                            nomeArquivoPdfETxt : nomeArquivoPdfETxt
                    }
                };
                
                fs.writeFileSync(nomeBoletoArquivo, boletoObj.html);

                if(!boletoObj.email) {
                    console.log("***** CONSOLE 5")
                    var copoTxt = 'Erro no envio do boleto para ' + boletoObj.razaoSocial + '\n\n' + 'E-mail não encontrado no cadastro';
                    var boleto = diretorioLogEmail + nomeArquivoPdfETxt + '.txt';
                    fs.writeFileSync(boleto, copoTxt);
                    mensagensProcessadas++;
                    if(quantidadeMensagens == mensagensProcessadas) {
                        resolve();
                    }
                } else {
                    mensagens.push({email: email, boletoObj: boletoObj, nomeArquivoPdfETxt: nomeArquivoPdfETxt});
                }

		boletoObj.html = 
                `<div>` + boletoObj.html +  `
                <style>
                    * {
                        padding-top: 1%;
                        padding-left: 1%;
                        padding-right: 1%;
                    }
                </style> </div>`;

                
                var request = require('sync-request');
                var res = request('POST', 'http://node-pdf:3000/export/pdf', {
                    json: {'html' : boletoObj.html },
                });

                if(res.statusCode == 200) {
                    console.log('mensagensProcessadas ', mensagensProcessadas);
                    fs.writeFileSync(nomeArquivoPdf, res.body);
                    mensagensProcessadas++;
                    if(quantidadeMensagens == mensagensProcessadas) {
                        resolve();
                    }
                }
             
                count++;
            })
        }).catch(function(err) {
            reject(err);
        })

        return promisePDF
            .then(() => {
                // https://github.com/nodemailer/nodemailer
                var transporte = nodemailer.createTransport({
                    pool: true,
                    // maxConnections: 50,
                    // maxMessages : 500,
                    host: 'relay.mailbaby.net',
                    port: '587',
                    secure: false,
                    auth: {
                        user: 'mb37076',
                        pass: 'Zbqn24kNAU4AxCsNMZQA'             // e a senha da nossa conta
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                
                console.log('Emails - ' + mensagens.length);

                transporte.on("idle", function () {
                    // send next message from the pending queue
                    setTimeout(()=> {
                        while (transporte.isIdle() && mensagens.length) {
                            // var mensagem = mensagens.shift();
                            // var email = mensagem.email;
                            // var boletoObj = mensagem.boletoObj;
                            // var nomeArquivoPdfETxt = mensagem.nomeArquivoPdfETxt;
                            transporte.sendMail(mensagens.shift().email, function(err, info){
                                if(err) {
                                    // log
                                   console.log(err) 
                                    var copoTxt = 'Erro no envio do boleto' + email.extra.boletoObj.razaoSocial + ' para ' + email.extra.boletoObj.email + '\n\n' + err;
                                    var boleto = diretorioLogEmail + email.extra.nomeArquivoPdfETxt + '.txt';
                                    fs.writeFile(boleto, copoTxt, function(err, data) {
                                    });
                                    
                                } else {
					console.log(info)
                                    // não apagar boletos por enquanto
                                    // fs.unlinkSync(nomeBoletoArquivo);
                                    // fs.unlinkSync(nomeArquivoPdf);
                                    var copoTxt = 'Boleto enviado via e-mail para ' + boletoObj.razaoSocial + ' para ' + boletoObj.email + '\n\n' + err;
                                    var boleto = diretorioLogEmail + 'enviados/' + nomeArquivoPdfETxt + '.txt';
                                    fs.writeFile(boleto, copoTxt, function(err, data) {
                                    });
                                } 
                            });
                        }
                    }, 1000);
                });
            })
            .catch((err) => 
                console.log('caiu no catch')
            );
    }

    escreve(req) {
        this.criaPastas();

        var boleto = '/boletos/boleto' + new Date().getTime() + '.html';
        fs.writeFile(boleto, req.body, function(err, data) {
        });

        return new Promise(function (resolve, reject) {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    }

    escreveRelatorio(req) {
        this.criaPastas();
        var boleto = '/boletos/relatorio' + new Date().getTime() + '.html';
        fs.writeFile(boleto, req.body, function(err, data) {
        });

        return new Promise(function (resolve, reject) {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    }
    

    getBoletoDecimoTerceiro(req, cliente, empresa, dadosBoleto) {
        var obj = montarObjetoBoletoDecimoTerceiro(cliente, empresa, dadosBoleto);
        return new Promise(function (resolve, reject) {
            var boleto = new Boleto(obj.objBoleto);
            
            console.log("Linha digitável: " + boleto['linha_digitavel'])

            boleto.renderHTML(function (html) {
                resolve({ html: html, dadosBoleto, valorBoleto: obj.totalSemFormatar });
            });
        });
    }
}

module.exports = new BoletoService();

function montarObjetoBoleto(contasReceber, empresa) {
    var banco = require('../util/contas-bancarias.json');
    var total = contasReceber.lancamentos.reduce(function (prev, cur) {
        return prev + cur.valorTotal;
    }, 0);
    
    total = (total + contasReceber.lancamentos[0].cliente.valorMensalidade).toFixed(2);
    var objBoleto = {
        'banco': banco[contasReceber.banco.banco.codigo].nome,
        'data_emissao': new Date(),
        'data_vencimento': new Date(contasReceber.dataVencimento),
        'valor': parseInt(total.toString().replace('.', '')),
        'nosso_numero': zerosAEsqueda(contasReceber.numerofechamento, 7),
        'numero_documento': zerosAEsqueda(contasReceber.numerofechamento, 6),
        'cedente': empresa.razaoSocial,
        'cedente_cnpj': empresa.cnpjCpf.toString().replace('.', '').replace('-', ''), // sem pontos e traços
        'agencia': contasReceber.banco.agencia,
        'codigo_cedente': banco[contasReceber.banco.banco.codigo].codigoCedente,
        'carteira': "102"
    };
    return objBoleto;
}

function montarObjetoBoletoDecimoTerceiro(cliente, empresa, dadosBoleto) {
    var banco = require('../util/contas-bancarias.json');
    var anoCadastro = cliente.dataConstituicao.substring(0, 4);
    var total = 0;
    var anoAtual = new Date().getFullYear().toString();
    if (anoAtual == anoCadastro) {
        var mesCadastro = parseInt(cliente.dataConstituicao.substring(5, 7));
        total = (((cliente.valorMensalidade / 12) * mesCadastro) / 2).toFixed(2);
    } else {
        total = (cliente.valorMensalidade / 2).toFixed(2);
    }
    var nossoNumero = new Date().getFullYear().toString() + cliente.codigo.toString();
    var objBoleto = {
        'banco': banco[dadosBoleto.banco].nome,
        'data_emissao': new Date(),
        'data_vencimento': new Date(dadosBoleto.dataVencimento),
        'valor': parseInt(total.toString().replace('.', '')),
        'nosso_numero': zerosAEsqueda(nossoNumero, 7),
        'numero_documento': zerosAEsqueda(nossoNumero, 6),
        'cedente': empresa.razaoSocial,
        'cedente_cnpj': empresa.cnpjCpf.toString().replace('.', '').replace('-', ''), // sem pontos e traços
        'agencia': banco[dadosBoleto.banco].agencia,
        'codigo_cedente': banco[dadosBoleto.banco].codigoCedente, // PSK (código da carteira)
        'carteira': "102"
    };
    return { objBoleto: objBoleto, totalSemFormatar: total };
}

function zerosAEsqueda(valor, qtdNumeros) {
    var zeros = '';
    var tamanhoN = valor.toString().length;
    while (tamanhoN < qtdNumeros) {
        zeros += '0';
        tamanhoN++;
    }
    return zeros + valor.toString();
}

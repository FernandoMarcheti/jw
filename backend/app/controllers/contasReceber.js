'use strict';

var ContasReceberService = require('../services/contasReceber');
var EmpresaService = require('../services/empresa');
var ClienteService = require('../services/cliente');
var FechamentoService = require('../services/fechamento');
let config = require('../util/config-properties');

var fetch = require('node-fetch');

class ContasReceberController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/contas-receber', this.getContasReceber.bind(this));
        this.router.post('/contas-receber/decimo-terceiro/buscar/boleto', this.getDecimoTerceiro.bind(this));
        this.router.post('/contas-receber', this.createContasAReceber.bind(this)); 
        this.router.post('/contas-receber/baixar', this.baixarContasAReceber.bind(this)); 
        this.router.post('/contas-receber/salvar/decimo-terceiro', this.createContasAReceber13.bind(this)); 
    }

    baixarContasAReceber(req, res){
        ContasReceberService.baixarContasReceber(req)
        .then(function (response) {
            res.send(response);
        });
    }

    createContasAReceber(req, res) {
        var contas = [];
        var clientes = [];
        ContasReceberService.createContasReceber(req).then(function (response) {
            req.body.forEach(function(conta){ 
                    contas.push(conta);
                    if(conta.lancamentos[0].cliente.gerarBoleto) {
                       clientes.push(conta.lancamentos[0].cliente); 
                    }         
                         
                });
            res.send(contas);
        });               
    }

    createContasAReceber13(req, res) {
        var clientes = [];
        var contas = [];
        ContasReceberService.getNextSequence(req)
        .then(function(sequenceRes){
            let numFechamento = sequenceRes.sequence;

            ClienteService.getClientes(req)
            .then(function (response) {
                response.forEach(function(c){ 
                    if(c.decimoTerceiro && !c.parcelasDecimoTerceiroAtualizadas && c.gerarBoleto && setValor13(c) > 0) {
                        let lancamentos = [];
                        let conta = {};
                        lancamentos.push({ cliente: c, valorTotal: setValor13(c)});
                        conta.numerofechamento = numFechamento;
                        conta.lancamentos = lancamentos;
                        conta.dataVencimento = req.body.dataVencimento;
                        conta.isConta13 = true;
                        contas.push(conta);
                        numFechamento++;
                    }         
                         
                });

                FechamentoService.createSequence(numFechamento-1)
                .then(function(){
                    ContasReceberService.createContasReceber13(req, contas).then(function (response) {
                        res.send(contas);
                    }); 
                });
            });
        });
    }

    getContasReceber(req, res) {
        ContasReceberService.getContasReceber(req).then(function (response){
            res.send({ contasReceber: response });
        });
    }

    getDecimoTerceiro(req, res){
        var contas = req.body;
            EmpresaService.getEmpresa(req).then(function (empresa) {
                var empresa = empresa;
                ClienteService.getClientes(req).then(function (clientes) {
                        var jsonBoletos = montarDecimoTerceiro(contas, empresa);
                        var request = require('request');
                        request.post(
                            config.pathApiBoleto,
                            //prod
       			            // 'http://localhost/api/Home',
                            { json: jsonBoletos },
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    res.send({ body: body, empresa: empresa });
                                }
                            }
                        ); 
                });
            });
    }
}

module.exports = ContasReceberController;

function montarDecimoTerceiro(contas, empresa){
    var retorno = [];
    contas.forEach(function(c){
        if(c.lancamentos[0].cliente.decimoTerceiro){
            var conta = {};
            conta.id = c.banco.banco.codigo;
            conta.dataVencimento = new Date(c.dataVencimento).toISOString();
            conta.cedente = {};
            conta.cedente.cnpj = empresa.cnpjCpf;
            conta.cedente.razaoSocial = empresa.razaoSocial;
            conta.cedente.agencia = c.banco.agencia.toString().split('-')[0];
            conta.cedente.digitoAgencia = c.banco.agencia.toString().split('-')[1] || "";
            conta.cedente.conta = c.banco.contaCorrente.toString().split('-')[0];
            conta.cedente.digitoConta = c.banco.contaCorrente.toString().split('-')[1] || "";
            conta.cedente.jurosMora = empresa.jurosMora || 0;
            conta.cedente.valorMulta = empresa.valorMulta || 0;

            conta.cliente = {};
            conta.cliente.cpfCnpj = c.lancamentos[0].cliente.cnpjCpf;
            conta.cliente.razaoSocial = c.lancamentos[0].cliente.razaoSocial;
            conta.cliente.endereco = c.lancamentos[0].cliente.enderecos[0].endereco.logradouro + ', ' + c.lancamentos[0].cliente.enderecos[0].endereco.numero;
            conta.cliente.bairro = c.lancamentos[0].cliente.enderecos[0].endereco.bairro;
            conta.cliente.cidade = c.lancamentos[0].cliente.enderecos[0].endereco.localidade;
            conta.cliente.cep = c.lancamentos[0].cliente.enderecos[0].endereco.cep;
            conta.cliente.uf = c.lancamentos[0].cliente.enderecos[0].endereco.uf;
            conta.cliente.valorMensalidade = c.lancamentos[0].cliente.valorMensalidade;

            var valor = 0;
            // c.lancamentos.forEach(function(v){
            //    valor += v.valorTotal;
            // });
            conta.valor = c.lancamentos[0].valorTotal;
            conta.nossoNumero = c.numerofechamento;
            // conta.lancamentos = c.lancamentos;
            conta.observacao = c.observacao;
            conta.isDecimoTerceiro = true;
            retorno.push(conta);
        }
        
    });
    return retorno;
}

function setValor13(cliente){
    let inicioServicos = cliente.inicioServicos.substring(0, 4);
    let anoAtual = new Date().getFullYear();

    if(anoAtual == inicioServicos){
        let mesInicio = parseInt(cliente.inicioServicos.substring(5, 7));
        let valorMes = cliente.valorMensalidade / 12;
        let totalMeses = 12 - mesInicio + 1;
        return totalMeses * valorMes / 2;
    }

    return cliente.valorMensalidade / 2;
}

'use strict';

var BoletoService = require('../services/boleto');
var EmpresaService = require('../services/empresa');
var ContasReceberService = require('../services/contasReceber');
let config = require('../util/config-properties');

class BoletoController {

    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/boleto', this.getBoleto.bind(this));
        this.router.post('/boleto/write', this.escreve.bind(this)); 
        this.router.post('/boleto/write/relatorio', this.escreveRelatorio.bind(this)); 
        this.router.post('/boleto/write/via/email', this.escreveEMandaEmail.bind(this));
    }

    escreveEMandaEmail(req, res) {
        BoletoService.escreveEMandaEmail(req).then(function (response) {
            res.send(response);
        });
    }

    escreve(req, res) {
        BoletoService.escreve(req).then(function (response) {
            res.send(response);
        });
    }

    escreveRelatorio(req, res) {
        BoletoService.escreveRelatorio(req).then(function (response) {
            res.send(response);
        });
    }

    getBoleto(req, res) {
        var promises = [];
        var clientes = [];
        var contas = [];
        var empresa = {};
        
        var promisesClientesAtual = [];
        
        EmpresaService.getEmpresa(req).then(function (empresa) {
            empresa = empresa;

            req.body.forEach(function(conta){ 
                contas.push(conta);
                if(conta.lancamentos[0].cliente.gerarBoleto) {
                   clientes.push(conta.lancamentos[0].cliente); 
                }         
                      
            });
            var jsonBoletos = montarContas(clientes, empresa, contas);
            var request = require('request');
            request.post(
                config.pathApiBoleto,
                { json: jsonBoletos },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.send({ body: body, empresa: empresa });
                    }
                }); 
        }); 
    }
}

module.exports = BoletoController;

function montarContas(clientes, empresa, contas){
    var retorno = [];
    contas.forEach(function(c){
        if(c.lancamentos[0].cliente.gerarBoleto){
            var conta = {};
            conta.id = c.banco.banco.codigo;
            conta.dataVencimento = c.dataVencimento;
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
            conta.cliente.valorMensalidade = c.lancamentos[0].cliente.valorMensalidade || 0;

            var valor = 0;
            c.lancamentos.forEach(function(v){
               valor += v.valorTotal;
            });
            conta.valor = valor + conta.cliente.valorMensalidade;
            conta.nossoNumero = c.numerofechamento;
            conta.lancamentos = c.lancamentos;
            conta.observacao = c.observacao;
            retorno.push(conta);
        }
        
    });
    return retorno;
}
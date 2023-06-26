var express = require('express');
var app = express();
var apiRouter = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors');

//app.use(express.static('./app'));

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.text({ type: 'text/html', limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
app.use('/api/v1', apiRouter);


require('./app/util/prototype.js');

var ProdutoController = require('./app/controllers/produto');
var produtoController = new ProdutoController(apiRouter);

var ClienteController = require('./app/controllers/cliente');
var clienteController = new ClienteController(apiRouter);

var BancoController = new require('./app/controllers/banco');
var bancoController = new BancoController(apiRouter);

var ContaBancariaController = new require('./app/controllers/contaBancaria');
var contaBancariaController = new ContaBancariaController(apiRouter);

var EmpresaController = new require('./app/controllers/empresa');
var empresaController = new EmpresaController(apiRouter);

var EnderecoController = new require('./app/controllers/endereco');
var enderecoController = new EnderecoController(apiRouter);

var LancamentoController = new require('./app/controllers/lancamento');
var lancamentoController = new LancamentoController(apiRouter);

var FechamentoController = new require('./app/controllers/fechamento');
var fechamentoController = new FechamentoController(apiRouter);

var BoletoController = new require('./app/controllers/boleto');
var boletoController = new BoletoController(apiRouter);

var ContasReceberController = new require('./app/controllers/contasReceber');
var contasReceberController = new ContasReceberController(apiRouter);

var AgendaCompromissoController = new require('./app/controllers/agendaCompromisso');
var agendaCompromissoController = new AgendaCompromissoController(apiRouter);

var NotificacaoController = new require('./app/controllers/notificacao-controller');
var notificacaoController = new NotificacaoController(apiRouter);

// Aplicação disponível em http://127.0.0.1:9000/
app.listen(9001);

// Produção
// var server = app.listen(9001); 

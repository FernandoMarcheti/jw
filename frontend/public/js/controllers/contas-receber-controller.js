(function (angular) {

	'use strict';

	angular.module('sce').controller('ContasAReceberController', function ($scope, 
		contasReceberService, relatorioService, $timeout, NgTableParams) {
		var vm = this;

		function formatarContas(contas) {
			if (Array.isArray(contas)) {
				contas = contas.map(function (obj) {
					vm.totalReceber += obj.valorTotal;
					obj.mensalidade = obj.mensalidade.addMaskMoney();
					obj.valorLancamento = obj.valorLancamento.addMaskMoney();
					obj.valorTotal = obj.valorTotal.addMaskMoney();
					return obj;
				});
			} else {
				vm.totalReceber = obj.valorTotal;
				contas.mensalidade = contas.mensalidade.addMaskMoney();
				contas.valorLancamento = contas.valorLancamento.addMaskMoney();
				contas.valorTotal = contas.valorTotal.addMaskMoney();
			}

			return contas;
		}

		$scope.$watch('vm.contasReceber.dataVencimento', function (newValue, oldValue) {
			if (newValue) {
				vm.contasReceber.dataVencimentoFilter = new Date(newValue).toISOString();
			} else {
				vm.contasReceber.dataVencimentoFilter = "";
			}
		});

		vm.init = function () {
			vm.contasReceber = {};
			vm.contasReceber.naoBaixados = true;
			vm.buscarContasAReceber();
		};

		vm.filtrarCliente = function(numeroFechamento){
			if(numeroFechamento.toString().length > 4){
				let clientePorNumero = vm.contasAgrupadas.filter(function(data){
					return data.numeroFechamento == numeroFechamento;
				});
	
				let todosFechamentosCliente = vm.contasAgrupadas.filter(function(data){
					return data.cliente == clientePorNumero[0].cliente;
				});
				vm.tableParams = new NgTableParams({}, { dataset: todosFechamentosCliente});
			} else {
				vm.tableParams = new NgTableParams({}, { dataset: vm.contasAgrupadas});
			}
		}

		vm.buscarContasAReceber = function () {
			contasReceberService.buscarContasReceber()
				.then(function (response) {
					vm.contas = response.sort(
						(a, b)=> b.numerofechamento - a.numerofechamento);
					vm.agruparContasNaoBaixadas(vm.contas);
					vm.tableParams = new NgTableParams({}, { dataset: vm.contasAgrupadas});
				})
				.catch(function (response) {
					SnackBarService.error(response.mensagem);
				});
		};

		vm.agruparContasNaoBaixadas = function (contas) {
			vm.contasAgrupadas = [];
			vm.totalReceber = 0;
			vm.contasAgrupadas = contasReceberService.agruparContas(contas).filter(function (c) { return !c.isBaixada });
			vm.contasAgrupadas = formatarContas(vm.contasAgrupadas);
			vm.totalReceber = vm.totalReceber.addMaskMoney();
		};

		vm.baixar = function(conta){
			vm.confirmarBaixa = conta;
		}

		vm.confirmar = function(){

			vm.confirmarBaixa.isBaixada = true;
			vm.confirmarBaixa.dataBaixa = new Date();
			contasReceberService.baixar(vm.confirmarBaixa)
				.then(function (response) {
					SnackBarService.success("Título baixado com sucesso");
					$('#confirmar-baixa-modal').modal('hide');
					vm.init();
				});
		}

		vm.gerarCartaCobranca = function (conta) {

			vm.cartaCobranca = {};
			vm.cartaCobranca.cliente = conta.cliente;
			if(conta.lancamentos[0].cliente.enderecos){
				vm.cartaCobranca.endereco = `${conta.lancamentos[0].cliente.enderecos[0].endereco.logradouro}, ${conta.lancamentos[0].cliente.enderecos[0].endereco.numero}, ${conta.lancamentos[0].cliente.enderecos[0].endereco.bairro}, ${conta.lancamentos[0].cliente.enderecos[0].endereco.localidade}/${conta.lancamentos[0].cliente.enderecos[0].endereco.uf}, CEP. ${conta.lancamentos[0].cliente.enderecos[0].endereco.cep}`
			}
			if(conta.lancamentos[0].cliente.responsavelEntrega){
				vm.cartaCobranca.responsavel =  conta.lancamentos[0].cliente.responsavelEntrega;
			}
			
			var hoje = new Date();
			var mesPorExtenso = getMesPorExtenso(hoje.getMonth());
			vm.cartaCobranca.data = `Matão/SP, ${hoje.getDate()} de ${mesPorExtenso} de ${hoje.getFullYear()}`;

			var contasPorCliente = getContasPorCliente(conta.codigoCliente);
			contasPorCliente.reverse();
			vm.relatorioCartaCobranca = [];
			vm.valorTotalMensalidadeCarta = 0;
			vm.valorTotalDespesas = 0;
			vm.valorTotalTitulo = 0;
			
			contasPorCliente.forEach(function(element) {
				var mensalidadeSemFormato = parseFloat(element.mensalidade.replace('.', '').replace('R$', '').replace(',', '.'));
				var titulo = parseFloat(element.valorTotal.replace('.', '').replace('R$', '').replace(',', '.'));
				vm.valorTotalTitulo += titulo;

				vm.relatorioCartaCobranca.push({
					nrTitulo: element.numeroFechamento,
					dataVenc: element.dataVencimento,
					valorMensalidade: element.mensalidade,
					valorDespesas: element.valorLancamento,
					valorTitulo: element.valorTotal,
				});
				vm.valorTotalMensalidadeCarta += mensalidadeSemFormato;
				vm.valorTotalDespesas += parseFloat(element.valorLancamento.replace('.', '').replace('R$', '').replace(',', '.'));
				
			});

			vm.valorTotalMensalidadeCarta = vm.valorTotalMensalidadeCarta.addMaskMoney();
			vm.valorTotalDespesas =  vm.valorTotalDespesas.addMaskMoney();
			vm.valorTotalTitulo =  vm.valorTotalTitulo.addMaskMoney();

			$timeout(function(){
            	relatorioService.gerarRelatorio(document.getElementById('divRelatorio'));
			});
		};

		function getContasPorCliente(cliente){
			return vm.contasAgrupadas.filter(c => c.codigoCliente == cliente);
		}

		function getMesPorExtenso(mes){
			var meses = new Array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro");
			return meses[mes]
		}

		vm.init();

	});
})(angular);
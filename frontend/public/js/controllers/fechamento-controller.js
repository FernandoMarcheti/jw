(function (angular) {

	'use strict';

	angular.module('sce').controller('FechamentoController', function ($scope, fechamentoService, 
		contasReceberService, ContaBancariaService, $timeout, 
		relatorioService, boletoService, NgTableParams, $rootScope) {
		var vm = this;
		var _dataInicio = null;
		var _dataFim = null;

		function formatarFechamento(fechamentos) {
			if (Array.isArray(fechamentos)) {
				fechamentos = fechamentos.map(function (obj) {
					obj.mensalidade = obj.mensalidade.addMaskMoney();
					obj.valorLancamento = obj.valorLancamento.addMaskMoney();
					obj.valorTotal = obj.valorTotal.addMaskMoney();
					return obj;
				});
			} else {
				fechamentos.mensalidade = fechamentos.mensalidade.addMaskMoney();
				fechamentos.valorLancamento = fechamentos.valorLancamento.addMaskMoney();
				fechamentos.valorTotal = fechamentos.valorTotal.addMaskMoney();
			}

			return fechamentos;
		}

	    vm.init = function () {
	    	vm.fechamento = {};
	    	vm.buscarContasBancarias();
	    	vm.bancos = [];
		};

	    vm.buscarFechamentos = function(){
	    	let dataInicio = document.querySelector('#fechamento-data-inicio').value;
			vm.fechamento.dataInicio = DateHelper.textoParaData(dataInicio);

			let dataFim = document.querySelector('#fechamento-data-fim').value;
			vm.fechamento.dataFim = DateHelper.textoParaData(dataFim);

	    	if(vm.fechamento.dataInicio)
	    		_dataInicio =  vm.fechamento.dataInicio.getTime();
	    	if(vm.fechamento.dataFim)
	    		_dataFim = vm.fechamento.dataFim.getTime();
	    	fechamentoService.buscarFechamentos({
	    		dataInicio: _dataInicio, dataFim: _dataFim})
	    	.then(function(response){
	    		if(response.fechamentos.length){
	    			vm.fechamentos = response.fechamentos;
					vm.fechamentosPorCliente();	
					vm.tableParams = new NgTableParams({}, { dataset: vm.fechamentosAgrupados});
	    		} else {
	    			SnackBarService.success(response.mensagem);
	    		}				
			})
			.catch(function(response){
				SnackBarService.error(response.mensagem);
			});
	    };

	    vm.buscarContasBancarias = function(){
	    	ContaBancariaService.recuperarContasBancarias()
	    	.then(function(response){
	    		vm.contasBancarias = response.data;
	    	})
	    	.catch(function(response){

	    	});
	    };

	    vm.Fechamento = function(form){
	    	if(form.$invalid){
	    		return;
	    	}
	    	$scope.fechamentoGerado = true;
	    	vm.buscarFechamentos();
	    };

	    vm.fechamentosPorCliente = function(){
	    	vm.fechamentosAgrupados = [];
			vm.fechamentos.forEach(function(fechamento){
				var f = {};
			    f.numeroFechamento = fechamento.numerofechamento;
				f.cliente = fechamento.lancamentos[0].cliente.razaoSocial;
			    f.mensalidade = fechamento.lancamentos[0].cliente.valorMensalidade || 0;
			    f.valorLancamento = fechamento.lancamentos.reduce(function(prev, cur){
					return prev + cur.valorTotal;
				}, 0);
				f.valorTotal = f.mensalidade + f.valorLancamento;
				if(f.valorTotal > 0){
					vm.fechamentosAgrupados.push(f);
				}
				
			});
			vm.fechamentosAgrupados = formatarFechamento(vm.fechamentosAgrupados);			
	    };

	    

	    vm.decimoTerceiro = function(ev){
	    	$mdDialog.show({
	    		controller: DeciomoTerceiroDialogController,
		      	templateUrl: 'partials/dialogs/fechamento-dialog.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	clickOutsideToClose:true,
	    	})
	    	.then(function(answer) {
	      		$scope.status = 'You said the information was "' + answer + '".';
	    	}, function() {
	      		$scope.status = 'You cancelled the dialog.';
	    	});
	    };

	    vm.init();

	    vm.gerarDecimoTerceiro = function(){
	    	$rootScope.loading = true;
	    	$('#boleto-13-modal').modal('hide');
	    	if (!vm.fechamento.banco){
				SnackBarService.error("Campos Obrigatórios não preenchidos");
				return false;
			}

			let dataVencimento = document.querySelector('#boleto-13-info-data-vencimento').value;
			vm.fechamento.dataVencimento = DateHelper.textoParaData(dataVencimento);

			let bancoSelecionado = vm.fechamento.banco;
			vm.fechamento.dataVencimento = vm.fechamento.dataVencimento || new Date();
			vm.fechamento.banco = vm.contasBancarias[0];

      		contasReceberService.salvar13(vm.fechamento)
      		.then(function(response){
      			response.response.forEach(function(c){
      				c.banco = vm.fechamento.banco;
      				c.observacao = vm.fechamento.observacao;
      			});
      			vm.contasReceber = response.response;
	    		boletoService.decimoTerceiro(response.response)
		    	.then(function(response){					

					boletoService.escreve(response.response)
							.then(function(response){
								if(response){
									
									$('#fechamento-relatorio-modal').modal('show');
									$rootScope.loading = false;
								}   
							})
							.catch(function(response){
								console.log(response);
							});

		    	})
		    	.catch(function(response){
		    	});
	    	})
	    	.catch(function(response){
	    	});
	    };

	    vm.gerarContasAReceber = function(){
    		if (!vm.fechamento.banco){
				SnackBarService.error("Campos Obrigatórios não preenchidos");
				return false;
			}

		let dataVencimento = document.querySelector('#boleto-info-data-vencimento').value;
		vm.fechamento.dataVencimento = DateHelper.textoParaData(dataVencimento);
    		
    		let	dados = vm.fechamento;
		let fechamantosAux = [];
    		vm.fechamentos.forEach(function(f){

			f.mensalidade = f.lancamentos[0].cliente.valorMensalidade || 0;
			f.valorLancamento = f.lancamentos.reduce(function(prev, cur){
        			return prev + cur.valorTotal;
    			}, 0);
    			f.valorTotal = f.mensalidade + f.valorLancamento;

    			f.dataVencimento = dados.dataVencimento || new Date();
    			f.observacao = dados.observacao || '';
    			f.banco = vm.contasBancarias.find(function(b){
    						return b.banco.descricao === dados.banco
    					});

			if(f.valorTotal > 0){
				fechamantosAux.push(f);
			}
    		});
      		vm.fechamentos = fechamantosAux;
      		vm.salvarContasAReceber();
	    };

	    vm.salvarContasAReceber = function(){
	    	contasReceberService.salvar(vm.fechamentos)
	    	.then(function(response){
	    		vm.contasReceber = response.response;
	    		$('#boleto-modal').modal('hide'); 
	    		$('#confirmar-impressao-boleto-modal').modal('show');
	    	})
	    	.catch(function(response){
	    	});
	    };

	    vm.imprimirBoletos = function(){
			$rootScope.loading = true;
	    	boletoService.buscar(vm.contasReceber)
	    		.then(function(response){
					if(response.response){

						boletoService.escreve(response.response)
							.then(function(response){
								if(response){
									
									$('#confirmar-impressao-boleto-modal').modal('hide');
									$('#fechamento-relatorio-modal').modal('show');
									$rootScope.loading = false;
								}   
							})
							.catch(function(response){
								console.log(response);
							});

						// if(hasImprimir){
						// 	var w = window.open();
			            //     $(w.document.body).html(response.response);
		                // 	w.print();	
						// }
						// $('#confirmar-impressao-boleto-modal').modal('hide');
						// $('#fechamento-relatorio-modal').modal('show');
		    		}   
	    		})
	    		.catch(function(response){
	    			console.log(response);
	    		});

			
	    }

	    vm.gerarRelatorioFechamento = function(){
	    	vm.totalMensalidade = 0;
            vm.totalDespesas = 0;
            vm.totalGeral = 0;
            vm.dataInicio = _dataInicio;
            vm.dataFim = _dataFim;

            vm.contasReceberRelatorio = contasReceberService.agruparContas(vm.contasReceber);

            vm.contasReceberRelatorio.forEach(obj => {
                vm.totalMensalidade += obj.mensalidade;
                vm.totalDespesas += obj.valorLancamento;
                vm.totalGeral += obj.valorTotal;
            });
    		vm.habilitarTabelaContasReceber = true;
    		$timeout(function(){
				relatorioService.escreve(document.getElementById('divRelatorio').innerHTML)
							.then(function(response){
								if(response.response){
								}   
							})
							.catch(function(response){
								console.log(response);
							});
				relatorioService.gerarRelatorio(document.getElementById('divRelatorio'));
    		});
    		
    		$('#fechamento-relatorio-modal').modal('hide');
		}	

	});
})(angular)

(function (angular) {

	'use strict';

	angular.module('sce').controller('LancamentoController', function ($scope, lancamentoService, $q,
	 $timeout, $location, $routeParams, $window, NgTableParams) {
		var vm = this;

		function setDatas(data){
	 		return data ? data.convertToDate() : null;
	 	}

	    vm.init = function () {
	    	vm.lancamento = { data: new Date() };
	    	if($routeParams.lancamentoId){
	    		vm.buscarLancamentos();
	    		vm.carregarClientesEProdutos();
	    		vm.buscarLancamentoPorId($routeParams.lancamentoId);	    		
	    	} else {	    		
	    		vm.buscarLancamentos();
	    		vm.carregarClientesEProdutos();
	    		vm.carregarNumeroLancamento();
	    	}	    			
		};

		vm.buscarLancamentos = function(){
			lancamentoService.buscarLancamentos()
			.then(function(response){
				vm.lancamentos = response.result.sort(
					(a, b)=> b.numeroLancamento - a.numeroLancamento);
				vm.tableParams = new NgTableParams({}, { dataset: vm.lancamentos});
			})
			.catch(function(response){
				SnackBarService.error(response.mensagem);
			});
		};

		vm.carregarClientesEProdutos = function(){
			lancamentoService.carregarClientesEProdutos()
			.then(function(response){
				vm.lancamento.produto; vm.lancamento.cliente;
				vm.clientes = response.data[0];
				vm.produtos = response.data[1];
			})
			.catch(function(response){
				SnackBarService.error(response.mensagem);
			});
		};

		vm.carregarNumeroLancamento = function(){
			lancamentoService.carregarNumeroLancamento()
			.then(function(response){
				vm.lancamento.numeroLancamento = response.data.sequence;
			})
			.catch(function(response){
				SnackBarService.error(response.data.mensagem);
			});
		};

	    vm.calculaTotal = function(){
	    	vm.lancamento.valorTotal = vm.lancamento.valorUnitario * vm.lancamento.quantidade;
	    };

	    vm.salvar = function(){
	    	let data = document.querySelector('#lancamento-data-lancamento').value;
			vm.lancamento.data = DateHelper.textoParaData(data);

	    	if ($scope.lancamentoForm.$invalid) {
				SnackBarService.error("Campos Obrigatórios");
				return false;
			}

			if(!vm.lancamento.cliente){
				SnackBarService.error("Cliente Inválido");
				return false;
			}

			if(!vm.lancamento.produto){
				SnackBarService.error("Produto Inválido");
				return false;
			}

			if(vm.lancamento.produto.nome.toLowerCase().indexOf('desconto') == 0){
				vm.lancamento.valorUnitatio -= vm.lancamento.valorUnitario * 2;
				vm.lancamento.valorTotal -= vm.lancamento.valorTotal * 2;
			}

	    	lancamentoService.salvar(vm.lancamento)
	    	.then(function(response){
	    		SnackBarService.success(response.mensagem);
	    		delete vm.lancamento;
	    		delete vm.cliente;
	    		delete vm.produto;	
				$window.location.href = '#/lancamento';
				vm.init();
	    	}).catch(function(response){
	    		SnackBarService.error(response.mensagem);
	    	});
	    };

	    vm.editar = function(lancamento){
	    	vm.lancamento = lancamento;
	    	vm.cliente = lancamento.cliente.razaoSocial;
	    	vm.produto = lancamento.produto.nome;
	    	vm.lancamento.data = DateHelper.setDatePicker(vm.lancamento.data);
	    };

		vm.carregarValorUnitario = function(produto){
			vm.lancamento.valorUnitario = null;
			vm.produtos.forEach(function(p){
				if(p.nome === produto.nome)
					vm.lancamento.valorUnitario = p.valor;
			});
			vm.calculaTotal();
		};

	    vm.init();

	    vm.completeCliente = function(string){
	    	let output = [];
	    	vm.hideCliente = false;
	    	if(!string){
	    		vm.filterClientes = vm.clientes;
	    		return;
	    	}
	    	angular.forEach(vm.clientes, function(c){
	    		if(c.razaoSocial.toLowerCase().indexOf(string.toLowerCase()) >= 0 ||
	    			c.codigo.toString().indexOf(string) >= 0){
	    			output.push(c);
	    		}
	    	});
	    	vm.filterClientes = output.filter((c, i)=> output.indexOf(c) == i);
	    };

	    vm.setInputCliente = function(cliente){
	    	vm.cliente = cliente.razaoSocial;
	    	vm.lancamento.cliente = cliente;
	    	vm.hideCliente = true;
	    };

	    vm.completeProduto = function(string){
	    	let output = [];
	    	vm.hideProduto = false;
	    	if(!string){
	    		vm.filterProdutos = vm.produtos;
	    		return;
	    	}
	    	angular.forEach(vm.produtos, function(p){
	    		if(p.nome.toLowerCase().indexOf(string.toLowerCase()) >= 0 || 
	    			p.codigo.toString().indexOf(string) >= 0){
	    			output.push(p);
	    		}
	    	});
	    	vm.filterProdutos = output.filter((c, i)=> output.indexOf(c) == i);
	    };

	    vm.setInputProduto = function(produto){
	    	vm.produto = produto.nome;
	    	vm.lancamento.produto = produto;
	    	vm.hideProduto = true;
	    	vm.carregarValorUnitario(produto);
	    };

	    vm.hideOrShowCliente = function(cliente){
	    	vm.hideCliente = cliente ? false : true; 
	    }

	    vm.hideClientes = function(){
	    	$timeout(function(){
	    		vm.hideCliente = true;
	    	}, 500);
	    }

	    vm.hideOrShowProduto = function(produto){
	    	vm.hideProduto = produto ? false : true; 
	    }

	    vm.hideProdutos = function(){
	    	$timeout(function(){
	    		vm.hideProduto = true;
	    	}, 500);
	    }
	 
	});
})(angular);
(function (angular) {

	'use strict';

	angular.module('sce').controller('ReciboPagamentoController', function ($scope, 
		empresaService, relatorioService, $timeout, clienteService) {
		var vm = this;
		vm.init = function () {

			vm.reciboPagamento = { dataEmissao: new Date()
			};

			empresaService.buscarEmpresa().then(function(response){
				vm.empresa = response.data;
			});

			clienteService.buscarClientes()
				.then(function (response) {
					vm.clientes = response.data;				
				})
				.catch(function (response) {
					SnackBarService.error(response.mensagem);
				});
		};

		vm.imprimir = function () {
			let dataEmissao = document.querySelector('#recibo-pagamento-data-emissao').value;
			vm.reciboPagamento.dataEmissao = DateHelper.textoParaData(dataEmissao);

			if($scope.reciboPagamentoForm.$invalid) {
				SnackBarService.error("Campos obrigatórios não preenchidos");
				return false;
			}

			relatorioService.gerarRelatorio(document.querySelector('#divRelatorio'));
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
	    	vm.reciboPagamento.favorecido = cliente.razaoSocial;
	    	vm.hideCliente = true;
	    };

	    vm.hideOrShowCliente = function(cliente){
	    	vm.hideCliente = cliente ? false : true; 
	    }

	    vm.hideClientes = function(){
	    	$timeout(function(){
	    		vm.hideCliente = true;
	    	}, 500);
	    }
	});
})(angular);
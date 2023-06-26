(function (angular) {

	'use strict';

	angular.module('sce').controller('EmpresaController', function ($scope, empresaService, clienteService, $location, $window) {
		var vm = this;
		vm.ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
		'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR',
		'RS', 'SC', 'SE', 'SP', 'TO'];

	    vm.init = function () {
	    	vm.empresa = {};
			empresaService.buscarEmpresa()
			.then(function(empresa){
				if(empresa){
					vm.empresa = empresa.data;
					vm.empresa.jurosMora = vm.empresa.jurosMora;
					setEndereco(vm.empresa);
					setTelefone(vm.empresa);
				}
			})
			.catch(function(data){
				SnackBarService.error(data.mensagem);
			});
		};

	    vm.salvar = function(){
	    	
	    	if(validaFormCliente()){
	    		vm.empresa.enderecos =  [{endereco: vm.endereco}];
				vm.empresa.telefones = [{telefone: vm.telefone.telefone}, 
					{telefone: vm.telefone.celular}, {telefone: vm.telefone.telefoneAdicional}];

		    	empresaService.salvar(vm.empresa)
		    	.then(function(data){
		    		SnackBarService.success(data.mensagem);
		    	}).catch(function(data){
		    		SnackBarService.error(data.mensagem);
		    	});
	    	}
	    };

	    vm.init();

	    //condição feita para layout novo
		function setEndereco(empresa){
			if(empresa.enderecos){
				vm.endereco = {};
				vm.endereco.cep = empresa.enderecos[0].endereco.cep;
				vm.endereco.logradouro = empresa.enderecos[0].endereco.logradouro;
				vm.endereco.numero = empresa.enderecos[0].endereco.numero;
				vm.endereco.complemento = empresa.enderecos[0].endereco.complemento;
				vm.endereco.bairro = empresa.enderecos[0].endereco.bairro;
				vm.endereco.uf = empresa.enderecos[0].endereco.uf;
				vm.endereco.localidade = empresa.enderecos[0].endereco.localidade;
			}
			
		}

		function setTelefone(empresa){
			if(empresa.telefones){
				vm.telefone = {};
				vm.telefone.telefone = empresa.telefones[0] ? empresa.telefones[0].telefone : "";
				vm.telefone.celular = empresa.telefones[1] ? empresa.telefones[1].telefone : "";
				vm.telefone.telefoneAdicional = empresa.telefones[2] ? empresa.telefones[2].telefone : "";		
			}
		}

		function validaFormCliente(){
	 		if($scope.empresaForm.cnpjCpf.$invalid){
				SnackBarService.error("CNPJ/ CPF Inválido");
				return false;
			}

			if($scope.empresaForm.cep.$invalid){
				SnackBarService.error("CEP Inválido");
				return false;
			}

			if($scope.empresaForm.$invalid){
				SnackBarService.error("Campos Obrigatórios não preenchidos");
				return false;
			}
			return true;
		}

		vm.reajustar = function() {
			clienteService.buscarClientes()
				.then(function (response) {
					response.data.forEach((c) => {
						c.valorMensalidade +=  c.valorMensalidade * vm.empresa.reajusteMensalidade
						
						clienteService.salvar(c)
							.then(function (responseSave) {
								SnackBarService.success(responseSave.mensagem);	
							})
							.catch(function(responseSave){
								SnackBarService.error(responseSave.mensagem);
							});
					})
				})
				.catch(function (response) {
					SnackBarService.error(response.mensagem);
				});
		}

	});
})(angular);
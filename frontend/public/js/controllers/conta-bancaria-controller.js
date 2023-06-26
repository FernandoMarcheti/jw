(function (angular) {

	'use strict';

	angular.module('sce').controller('ContaBancariaController', function ($scope, ContaBancariaService,
	 BancoService, NgTableParams) {
		var vm = this;

		vm.init = function () {
			BancoService.recuperarBancos().then(function (response) {
				vm.bancos = response.data;
			});

			ContaBancariaService.recuperarContasBancarias().then(function (response) {
				vm.contasBancarias = response.data;
				vm.tableParams = new NgTableParams({}, { dataset: vm.contasBancarias});
			});

			vm.contaBancaria = {
				banco: null,
				agencia: null,
				contaCorrente: null
			};
		};

		vm.salvar = function () {
			if ($scope.contaBancariaForm.$invalid){
				SnackBarService.error("Campos Obrigatórios não preenchidos");
				return false;
			}
				

			vm.bancos.forEach(function (obj, key) {
				if (obj.codigo == vm.contaBancaria.banco) {
					vm.contaBancaria.banco = obj;
				}
			});

			ContaBancariaService.salvarContaBancaria(vm.contaBancaria).then(function (response) {
				SnackBarService.success(response.data.mensagem);
				vm.init();
			});
		};

		vm.excluir = function (contaBancaria) {
			delete vm.contaBancaria;
			vm.contaBancariaExlcluir = contaBancaria;	
		};

		vm.confirmar = function(){
	 		ContaBancariaService.excluirContaBancaria(vm.contaBancariaExlcluir._id)
			.then(function (response) {
				SnackBarService.success(response.data.mensagem);
				$('#confirmar-exclusao-modal').modal('hide');
				vm.init();
			})
			.catch(function(response){
				SnackBarService.error(response.data.mensagem);
			});
	 	}

		vm.editar = function (id) {
			vm.contasBancarias.forEach(function (obj, key) {
				if (obj._id == id) {
					vm.contaBancaria = angular.copy(obj);
					vm.contaBancaria.banco = vm.contaBancaria.banco.codigo;
				}
			});
		};

		vm.cancelar = function () {
			vm.contaBancaria = {};
		};

		vm.init();

		vm.confirmarcaoExclusao = function(id){
			vm.idExclusao = id;
			$mdDialog.show({
	    		controller: ExclusaoDialogController,
		      	templateUrl: 'partials/dialogs/confirmacao-exclusao-dialog.html',
		      	parent: angular.element(document.body),
		      	clickOutsideToClose:true,
	    	});
		}

		function ExclusaoDialogController($scope, $mdDialog) { 
	    	$scope.sim = function(){
	    		vm.excluir(vm.idExclusao);
	    		$mdDialog.hide();
		    };

		    $scope.nao = function() {
	    		$mdDialog.hide();
		    };
	    }
	});

})(angular);
(function (angular) {

	'use strict';

	angular.module('sce').controller('NotificacaoController', function (empresaService, clienteService) {
		var vm = this;
		vm.tipoEnvio = 'especifico'
		vm.notificacao = {};
		vm.emails = [];
		vm.hide = true;

		vm.emailsLista = []

		function init() {
			clienteService.buscarClientes()
				.then(function (response) {

					let clientes = response.data;
					clientes = clientes
						.filter(c => (c.envioBoleto === 'email' || c.envioBoleto === 'ambos') && c.email)
						.filter(c => c.gerarBoleto);
					vm.emailsLista = clientes.map(c => c.email)				
					
				})
				.catch(function (response) {
					SnackBarService.error('Ocorreu um erro ao carregar os e-mails. Tente novamente');
				});
		}

	    vm.salvar = function(){

			if(!vm.notificacao.titulo) {
				SnackBarService.error(`Título do email não preenchido`);
				return false
			}
			if(!vm.notificacao.corpo) {
				SnackBarService.error(`Corpo do email não preenchido`);
				return false
			}
			if('especifico' === vm.tipoEnvio) {
				if(vm.email.substring(vm.email.length-2) === ';') {
					vm.email = vm.email.substring(0, vm.email.length-2)
				} else if(vm.email.substring(vm.email.length-1) === ';'){
					vm.email = vm.email.substring(0, vm.email.length-1)
				}
				vm.notificacao.emails = vm.email.split(';')
	
				for (const email of vm.notificacao.emails) {
					if(!vm.emailsLista.includes(email)) {
						SnackBarService.error(`O email ${email} está inválido`);
						return false;
					}
				}
			} else if ('marcados' === vm.tipoEnvio) {
				vm.notificacao.emails = vm.emailsLista;
			} else {
				SnackBarService.error(`Nenhum tipo de envio foi selecionado. Favor, verificar.`);
				return false;
			}

			empresaService.enviarNotificacao(vm.notificacao)
			 .then(function(data){
			 	SnackBarService.success(data.mensagem);
			 }).catch(function(data){
			 	SnackBarService.error(data.mensagem);
			 });
	    };

	    vm.complete = function(string){
	    	let output = [];
	    	vm.hide = false;
	    	if(!string){
	    		vm.filterClientes = vm.clientes;
	    		return;
	    	}
			var lastIndex = string.lastIndexOf(';');
			string = string.substring(lastIndex + 2);

	    	angular.forEach(vm.emailsLista, function(c){
	    		if(c.toLowerCase().indexOf(string.toLowerCase()) >= 0){
	    			output.push(c);
	    		}
	    	});
	    	vm.emails = output.filter((c, i)=> output.indexOf(c) == i);
	    };

		vm.setInput = function(email){
	    	// vm.emails.push(email);
	    	// vm.lancamento.cliente = cliente;
			// vm.email = email
			// vm.emails =+ email
			if(!vm.email.includes(';')) {
				vm.email = '';
			} else {
				var lastIndex = vm.email.lastIndexOf(';');
				vm.email = vm.email.substring(0, lastIndex+1)
			}

			vm.email += email + ';'
			document.getElementById("tipoEnvioEspecificoIn").focus();

	    	vm.hide = true;
	    };

		vm.hideOrShow = function(email){
	    	vm.hide = email ? false : true; 
	    }

	    function hide(){
	    	$timeout(function(){
	    		vm.hide = true;
	    	}, 500);
	    }

		init();
	});
})(angular);
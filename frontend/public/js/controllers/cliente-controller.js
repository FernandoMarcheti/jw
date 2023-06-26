(function(angular){

	'use strict';

	angular.module('sce').controller('ClienteController', function ($scope, $filter, $location,
			clienteService, $routeParams, $window, $timeout, enderecoService, relatorioService) { //, $mdDialog, enderecoService, relatorioService
		var vm = this;
		vm.ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
		'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR',
		'RS', 'SC', 'SE', 'SP', 'TO'];

		vm.cliente = {};
		vm.novaData = new Date();

		vm.init = function () {
			if($routeParams.clienteId){
				vm.buscarClientePorId($routeParams.clienteId);
			} else {
				vm.buscarClientes();				
			}
		};

		vm.novo = function(){
			vm.posicaoFinal++;
			vm.posicaoAtual = vm.posicaoFinal;
			vm.cliente = {};
			vm.telefone = {};
			vm.endereco = {};
			vm.cliente.tipoEnvioBoleto = {};
			vm.cliente.tipoDecimoTerceiro = {};
			clienteService.getNextSequence()
			.then(function(response){
				vm.cliente.codigo = response.data.sequence;
			})
			.catch(function(response){
				SnackBarService.error(response.data.mensagem);
			});
		};

		vm.buscarClientes = function () {
			clienteService.buscarClientes()
				.then(function (response) {
					vm.clientes = response.data.sort(
						(a, b)=> a.codigo - b.codigo);
					vm.posicaoAtual = vm.posicaoAtual || 0;
					vm.posicaoInicial = 0;
					vm.posicaoFinal = vm.clientes.length -1;

					setCliente(vm.clientes[vm.posicaoAtual]);		
				})
				.catch(function (response) {
					SnackBarService.error(response.mensagem);
				});
		};

		vm.checkGerarBoleto = function () {
			if(!vm.cliente.envioBoleto) {
				vm.cliente.envioBoleto = "fisico"
			}
		}

		vm.checkDecimoTerceiro = function () {
			if(!vm.cliente.tipoDecimoTerceiro) {
				vm.cliente.tipoDecimoTerceiro = "comum"
			}
		}
		
		vm.proximo = function(){
			if(vm.posicaoAtual == vm.posicaoFinal){
				setCliente(vm.clientes[vm.posicaoInicial]);
				vm.posicaoAtual = vm.posicaoInicial;
				$timeout(function(){
					window.scrollTo(0, 0);
				}, 1000);
				return;
			}
			setCliente(vm.clientes[++vm.posicaoAtual]);
			$timeout(function(){
				window.scrollTo(0, 0);
			}, 1000);
		}

		vm.anterior = function(){
			if(vm.posicaoAtual == vm.posicaoInicial){
				setCliente(vm.clientes[vm.posicaoFinal]);
				vm.posicaoAtual = vm.posicaoFinal;
				$timeout(function(){
					window.scrollTo(0, 0);
				}, 1000);
				return;
			}
			setCliente(vm.clientes[--vm.posicaoAtual]);
			$timeout(function(){
				window.scrollTo(0, 0);
			}, 1000);
		}


		vm.pesquisar = function(){
			let cliente = angular.copy(document.querySelector('#cliente-pesquisa').value);
			vm.pesquisa = cliente;

			vm.inputPesquisaCache = vm.inputPesquisaCache ? vm.inputPesquisaCache : cliente;
			if(vm.inputPesquisaCache == cliente && vm.isCache){

				setCliente(vm.arrayPesquisaCache[++vm.contadorCache % vm.arrayPesquisaCache.length]);
				vm.isCache = true;
				return;
			}

			var contador = 0;
			var clientePesquisa = vm.clientes.find(function(c){
				return c.codigo == cliente;
			});

			if(clientePesquisa){
				while(vm.clientes[contador].codigo != clientePesquisa.codigo){
					contador++;
				}
				vm.posicaoAtual = contador;
				setCliente(clientePesquisa);
				$timeout(function(){
					window.scrollTo(0, 0);
				}, 1000);
				return;
			}
			
			if(cliente){
				clientePesquisa = vm.clientes
				.filter(c => c.razaoSocial.indexOf(cliente.toString().toUpperCase()) != -1);

				vm.contadorCache = 0;
				vm.arrayPesquisaCache = clientePesquisa;
				vm.inputPesquisaCache = cliente;
				vm.isCache = true;


				if(clientePesquisa.length){
					while(vm.clientes[contador].codigo != clientePesquisa[0].codigo){
						contador++;
					}
					vm.posicaoAtual = contador;
					setCliente(clientePesquisa[0]);
					$timeout(function(){
						window.scrollTo(0, 0);
					}, 1000);
					return;
				}
			}	
			
			SnackBarService.success('Cliente não encontrado');
		}

		vm.cancelar = function(){
			vm.buscarClientePorId(1);
		}

		vm.salvar = function () {

			let dataRegistro = document.querySelector('#cliente-data-registro').value;
			vm.cliente.dataRegistro = DateHelper.textoParaData(dataRegistro);

			let dataUltimoRegistro = document.querySelector('#cliente-data-ultimo-registro').value;
			vm.cliente.dataUltimoRegistro = DateHelper.textoParaData(dataUltimoRegistro);

			let inicioServicos = document.querySelector('#cliente-inicio-servicos').value;
			vm.cliente.inicioServicos = DateHelper.textoParaData(inicioServicos);

			let fimServicos = document.querySelector('#cliente-fim-servicos').value;
			vm.cliente.fimServicos = DateHelper.textoParaData(fimServicos);

			if(validaFormCliente()){
				vm.cliente.pagarMensalidade = true;
				vm.cliente.enderecos =  [{endereco: vm.endereco}];
				vm.cliente.telefones = [{telefone: vm.telefone.telefone}, 
						{telefone: vm.telefone.celular}, {telefone: vm.telefone.telefoneAdicional}];
				
				clienteService.salvar(vm.cliente)
				.then(function (response) {
					SnackBarService.success(response.mensagem);	
					vm.init();			
				})
				.catch(function(response){
					SnackBarService.error(response.mensagem);
				});
			}		
			
		};

		vm.buscarClientePorId = function(id){
			clienteService.buscarClientePorId(id)
			.then(function(response){			
				setCliente(response);
								
			})
			.catch(function(response){
				SnackBarService.error(response.mensagem);
			});	
		}

		vm.init();

		function setCliente(cliente){
			if(!cliente) return;
			vm.cliente = cliente;
			if(vm.cliente.inicioServicos)
				vm.cliente.inicioServicos = DateHelper.setDatePicker(vm.cliente.inicioServicos);
			vm.cliente.fimServicos = DateHelper.setDatePicker(vm.cliente.fimServicos);
			vm.cliente.dataRegistro = DateHelper.setDatePicker(vm.cliente.dataRegistro);
			vm.cliente.dataUltimoRegistro = DateHelper.setDatePicker(vm.cliente.dataUltimoRegistro);
			setEndereco(vm.cliente);
			setTelefone(vm.cliente);
		}

		//condição feita para layout novo
		function setEndereco(cliente){
			if(cliente.enderecos){
				vm.endereco = {};
				vm.endereco.cep = cliente.enderecos[0].endereco.cep;
				vm.endereco.logradouro = cliente.enderecos[0].endereco.logradouro;
				vm.endereco.numero = cliente.enderecos[0].endereco.numero;
				vm.endereco.complemento = cliente.enderecos[0].endereco.complemento;
				vm.endereco.bairro = cliente.enderecos[0].endereco.bairro;
				vm.endereco.uf = cliente.enderecos[0].endereco.uf;
				vm.endereco.localidade = cliente.enderecos[0].endereco.localidade;
			}
			
		}

		function setTelefone(cliente){
		        vm.telefone = {};
                       	if(cliente.telefones){
				vm.telefone.telefone = cliente.telefones[0] ? cliente.telefones[0].telefone : "";
				vm.telefone.celular = cliente.telefones[1] ? cliente.telefones[1].telefone : "";
				vm.telefone.telefoneAdicional = cliente.telefones[2] ? cliente.telefones[2].telefone : "";		
			}
		}
	 
	 	function validaFormCliente(){
	 		if($scope.clienteForm.cnpjCpf.$invalid){
				SnackBarService.error("CNPJ/ CPF Inválido");
				return false;
			}

			if($scope.clienteForm.cep.$invalid){
				SnackBarService.error("CEP Inválido");
				return false;
			}

			if($scope.clienteForm.$invalid){
				SnackBarService.error("Campos Obrigatórios não preenchidos");
				return false;
			}
			return true;
	 	}

	 	vm.gerarEtiquetas = function (ev, cliente) {
			// vm.clienteSelecionado = cliente;
		
			// $mdDialog.show({
			// 	controller: EtiquetaDialogController,
			// 	templateUrl: 'partials/dialogs/etiqueta-dialog.html',
			// 	parent: angular.element(document.body),
			// 	targetEvent: ev,
			// 	clickOutsideToClose: true,
			// })
			// 	.then(function (answer) {
			// 		//$scope.status = 'You said the information was "' + answer + '".';
			// 	}, function () {
			// 		//$scope.status = 'You cancelled the dialog.';
			// 	});
		};

		vm.confirmar = function(cliente){
			$scope.exibirGerarEtiqueta = !vm.clienteSelecionado ? true : false;

			// $scope.ok = function (cliente) {
			// 	if()

			if(!cliente.quantidadeEtiqueta){
				SnackBarService.error("O campo Quantidade é Obrigatório");
				return false;
			}

			var html = '';

			if (vm.clienteSelecionado) {
				html = preprarEtiqueta(cliente.quantidadeEtiqueta, vm.clienteSelecionado);
			} else {
				clienteService.buscarClientes().then(function (response) {
					
					response.data.forEach(function (obj) {
						if (cliente.gerarEtiquetaTodos) {
							if (obj.gerarEtiqueta) {
								html += preprarEtiqueta(cliente.quantidadeEtiqueta, obj);
							}
						} else {
							html += preprarEtiqueta(cliente.quantidadeEtiqueta, obj);
						}


					});

					$timeout(function(){
						// relatorioService.gerarRelatorio(document.getElementById('divRelatorio'));
						relatorioService.gerarRelatorioHTML(html);
						$('#etiqueta-modal').modal('hide');
					});
				});
			}
		}

		vm.gerarRelatorio = function () {

            setTimeout(function() {
                relatorioService.gerarRelatorio(document.getElementById('divRelatorio'));
            }, 1000);
		};

		vm.gerarRelatorioDistrato = function () {

            setTimeout(function() {
                relatorioService.gerarRelatorio(document.getElementById('divRelatorioDistrato'));
            }, 1000);
		};

		function preprarEtiqueta(quantidade, cliente) {
			var html = `
			<style>	

					html, body {
						margin:0;
						padding:0;
						width: 21.5cm;
						overflow-x: visible;
					}

					@page{
			    		margin: 0;
			    		margin-left: 0cm;
					}

					.card {
				        margin-left: 1cm;
				        margin-top: 1.0cm;
				        margin-bottom: 0.5cm;
						width: 9.5cm;
						display: inline-block;
					}

					p {
						margin: 0;
					}
			</style>
			`;

			

			for (var i = 0; i < quantidade; i++) {
				html += montarEtiqueta(cliente);
			}

			return html;

		}

		function montarEtiqueta(cliente) {
			return `
					<div class="card">
						<div>
							<p>À</p>
							<p>${cliente.razaoSocial}</p>
							<p>${enderecoService.formatarEndereco(cliente.enderecos[0].endereco)}</p>
						</div>
					</div>`
		}

		vm.buscarEndereco = function(cep){
			if(cep && cep.length == 9) {
				enderecoService.buscarEndereco(cep)
				.then(function(response){
					if(response.data.erro) {
						SnackBarService.error('Não foi possível carregar Endereço');
					} else {
						vm.endereco = response.data;
					}
				})
				.catch(function(response){
					SnackBarService.error('Não foi possível carregar Endereço');
				});
			} else {
				SnackBarService.error('CEP Inválido');
			}
		};	

		vm.gerarContrato = function (){
			window.open('/pdf/contratoprestacaoservicos.pdf');
		}

		vm.gerarDistrato = function (){
			window.open('/pdf/distratoprestacaoservicos.pdf');
		}


	});

})(angular);

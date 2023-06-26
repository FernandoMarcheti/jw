(function (angular) {

	'use strict';

	angular.module('sce').controller('ProdutoController', function (NgTableParams, produtoService, $scope) {

		let self = this;

		self.init = ()=>{
			self.produtos = [];
			self.buscarProdutos();
		}

		self.buscarProdutos = (valor) =>{
			produtoService.buscarProdutos(valor)
			.then( (response) =>{
				response.data.forEach(f => f.codigo = parseInt(f.codigo));
				self.produtos = formatarProduto(response.data.sort(
					(a, b)=> a.codigo - b.codigo));
				self.tableParams = new NgTableParams({}, { dataset: self.produtos});
			})
			.catch(() =>{
				SnackBarService.error(response.data.mensagem);
			});
		}
		
		self.salvar = (produtoForm) =>{
			if ($scope.produtoForm.$invalid){
				SnackBarService.error("Campos Obrigatórios não preenchidos");
				return false;
			}

			self.produto.valor = self.produto.valor || 0;
			produtoService.salvar(self.produto)
			.then(function (response) {

				if (!response.data.valido) {
					SnackBarService.error(response.data.mensagem);
					return false;
				}

				SnackBarService.success(response.data.mensagem);
				delete self.produto;
				self.init();
			})
			.catch(function(response){
				SnackBarService.error(response.data.mensagem);
			});
		}

		self.editar = function(produto) {
			self.produto = angular.copy(produto);
			self.produto.valor = self.produto.valor.removeMaskMoney();
		};

		self.excluir = function (produto) {
			delete self.produto;
			self.produtoExlcluir = produto;		
		};

	 	self.confirmar = function(){
	 		produtoService.excluirProduto(self.produtoExlcluir._id)
			.then(function (response) {
				SnackBarService.success(response.data.mensagem);
				$('#confirmar-exclusao-modal').modal('hide');
				self.init();
			})
			.catch(function(response){
				SnackBarService.error(response.data.mensagem);
			});
	 	}

		self.init();

		function formatarProduto(produtos) {
			if (Array.isArray(produtos)) {
				produtos = produtos.map(function (obj) {
					obj.codigo = obj.codigo;
					obj.valor = obj.valor.addMaskMoney();

					return obj;
				});
			} else {
				produtos.codigo = produtos.codigo.toString();
				produtos.valor = produtos.valor.addMaskMoney();
			}

			return produtos;
		}
	});
})(angular);

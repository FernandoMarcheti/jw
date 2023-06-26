(function (angular) {

    'use strict';

    angular.module('sce').controller('GastosClienteRelatorioController', GastosClienteRelatorioController);

    function GastosClienteRelatorioController($scope, lancamentoService, 
        relatorioService, $timeout, NgTableParams) {
        var vm = this;

        vm.init = function () {
            vm.gastosPorCliente = [];
            vm.habilitarBotaoGerar = false;
        };

        vm.pesquisar = function (formulario) {
            let dataInicio = document.querySelector('#gastos-cliente-data-inicio').value;
            vm.dataInicio = DateHelper.textoParaData(dataInicio);
            let dataFim = document.querySelector('#gastos-cliente-data-fim').value;
            vm.dataFim  = DateHelper.textoParaData(dataFim);
            
            if (!dataInicio || !dataFim) {
                SnackBarService.error("Campos Obrigatórios não preenchidos");
                return false;
            }

            lancamentoService.buscarLancamentos({ dtInicio: vm.dataInicio.getTime(), 
                dtFim: vm.dataFim.getTime() }).then(response => {
                if (!response.result.length) {
                    SnackBarService.error("Nenhum Cliente foi encontrado neste período");
                    return false;
                }
                var clientes = [];
                var codigo = [];
                vm.gastosPorCliente = [];

                response.result.forEach((obj, key) => {

                    if (codigo.indexOf(obj.cliente.codigo) === -1) {
                        response.result.forEach((objAux, keyAux) => {
                            if (objAux.cliente.codigo == obj.cliente.codigo) {
                                clientes.push(objAux);
                            }
                        });
                    }

                    if (clientes.length) {
                        vm.gastosPorCliente.push(clientes);
                        codigo.push(obj.cliente.codigo);
                        clientes = [];
                    }

                });

                $scope.$broadcast('gastosPorClienteBroadcast', { data: vm.gastosPorCliente });

                vm.gcr = {};
                vm.gcr.dtInicio = vm.dataInicio.getTime();
                vm.gcr.dtFim = vm.dataFim.getTime();

                var model = vm.gastosPorCliente.sort(function(a, b){                  
                    return parseInt(a[0].cliente.codigo) - parseInt(b[0].cliente.codigo);
                });
               
                vm.gcr.gastos = [];
                vm.gcr.lancamentos = [];
                vm.gcr.totalGeral = 0;
                var subTotal, totalDespesas = 0, totalMensalidade = 0;

                model.forEach((arr) => {
                    var subTotal = 0;
                    var codigoCliente = arr[0].cliente.codigo;
                    var cliente = arr[0].cliente.razaoSocial;
                    var lancamentos = [];
                    arr.forEach((obj, key) => {
                        var lancamento = {};
                        subTotal += obj.valorTotal;
                        lancamento.numeroLancamento = obj.numeroLancamento;
                        lancamento.data = obj.data;
                        lancamento.produto = obj.produto.nome;
                        lancamento.quantidade = obj.quantidade;
                        lancamento.valorUnitario = obj.valorUnitario;
                        lancamento.valorTotal = obj.valorTotal;
                        lancamentos.push(lancamento);

                    });
                    totalDespesas += subTotal
                    totalMensalidade += arr[0].cliente.valorMensalidade || 0;
                    vm.gcr.gastos.push({lancamentos: lancamentos, subTotal: subTotal, cliente: {codigo: codigoCliente, razaoSocial: cliente}});
                });

                vm.valorTotal = totalDespesas;
                vm.habilitarBotaoGerar = true;

                vm.tableParams = new NgTableParams({}, { dataset: vm.gcr.gastos});
            });

        };

        vm.gerarRelatorio = function () {
            vm.tableParams.count(vm.gcr.gastos.length);

            setTimeout(function() {
                relatorioService.gerarRelatorio(document.getElementById('divRelatorio'));
            }, 10);

            
        };

        vm.init();

    }
})(angular);
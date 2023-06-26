(function (angular) {

    'use strict';

    angular.module('sce').controller('ContasReceberRelatorioController', ContasReceberRelatorioController);

    function ContasReceberRelatorioController($scope, contasReceberService, relatorioService, 
        $timeout, NgTableParams) {
        var vm = this;

        vm.init = function () {
            vm.titulosAberto = [];
            vm.habilitarBotaoGerar = false;
        };

        vm.pesquisar = function () {
            let dataInicio = document.querySelector('#titulos-aberto-data-inicio').value;
            vm.dataInicio = DateHelper.textoParaData(dataInicio);
            let dataFim = document.querySelector('#titulos-aberto-data-fim').value;
            vm.dataFim  = DateHelper.textoParaData(dataFim);

            if (!dataInicio || !dataFim) {
                SnackBarService.error("Campos Obrigatórios não preenchidos");
                return false;
            }

            contasReceberService.buscarContasReceber({ dtInicio: vm.dataInicio.getTime(), 
                dtFim: vm.dataFim.getTime() }).then(response => {
                if (!response.length) {
                    SnackBarService.error("Nenhum Título Encontrado");
                    return false;    
                }
                vm.totalMensalidade = 0;
                vm.totalDespesas = 0;
                vm.totalGeral = 0;

                vm.titulosAberto = contasReceberService.agruparContas(response).filter(function(c){ return !c.isBaixada });
                vm.titulosAberto = vm.titulosAberto.sort((a,b)=> b.numeroFechamento - a.numeroFechamento);


                vm.titulosAberto.forEach(obj => {
                    vm.totalMensalidade += obj.mensalidade;
                    vm.totalDespesas += obj.valorLancamento;
                    vm.totalGeral += obj.valorTotal;
                });
                

                vm.habilitarBotaoGerar = true;
                vm.tableParams = new NgTableParams({}, { dataset: vm.titulosAberto});
            });

        };

        vm.gerarRelatorio = function () {
            // vm.tableParams.sorting("cliente", 'desc');
            vm.tableParams.count(vm.titulosAberto.length);
            // vm.tableParams.filter({'cliente':'JW'});

            vm.tableParams.filter(vm.tableParams._params.filter);

            setTimeout(function() {
                relatorioService.gerarRelatorio(document.getElementById('divRelatorio'));
            }, 1000);
        };

        vm.init();

    }
})(angular);
(function (angular) {

    'use strict';

    angular.module('sce').controller('ValoresProdutoRelatorioController', function ($scope, 
        lancamentoService, relatorioService, $timeout, NgTableParams) {
        var vm = this;

        vm.init = function () {
            vm.lancamentos = [];
            vm.habilitarBotaoGerar = false;
        };

        vm.pesquisar = function () {
            let dataInicio = document.querySelector('#valores-produtos-data-inicio').value;
            vm.dataInicio = DateHelper.textoParaData(dataInicio);
            let dataFim = document.querySelector('#valores-produtos-data-fim').value;
            vm.dataFim  = DateHelper.textoParaData(dataFim);

            if (!dataInicio || !dataFim) {
                SnackBarService.error("Campos Obrigatórios não preenchidos");
                return false;
            }

            lancamentoService.buscarLancamentos({ dtInicio: vm.dataInicio.getTime(), 
                dtFim: vm.dataFim.getTime() })
                .then(function (response) {
                    vm.lancamentos = response.result;
                    if (!vm.lancamentos.length) {
                        SnackBarService.error("Nenhum Produto foi encontrado neste período");
                        return false;
                    }

                    vm.lancamentos.sort(function (a, b) {
                        return parseInt(a.produto.codigo) - parseInt(b.produto.codigo);
                    });

                    var produtosAgrupados = [];
                    var produtos = [];
                    var codigo = vm.lancamentos[0].produto.codigo;
                    vm.lancamentos.forEach(function (c, k) {
                        if (c.produto.codigo == codigo) {
                            produtos.push(c);
                        } else {
                            produtosAgrupados.push(produtos);
                            produtos = [];
                            produtos.push(c);
                            codigo = c.produto.codigo;
                        }
                    });
                    produtosAgrupados.push(produtos);

                    vm.produtosRelatorio = [];
                    produtosAgrupados.forEach(function (el) {
                        var p = {};
                        p.codigo = el[0].produto.codigo;
                        p.nome = el[0].produto.nome;
                        p.valor = el.reduce(function (prev, cur) {
                            return prev + cur.valorTotal;
                        }, 0);
                        vm.produtosRelatorio.push(p);
                    });
                    
                    vm.valorTotal = vm.produtosRelatorio.map(function (obj) { 
                    return obj.valor }).reduce(function (a, b) { return a + b; }, 0);

                    vm.habilitarBotaoGerar = true;
                    vm.tableParams = new NgTableParams({}, { dataset: vm.produtosRelatorio});
                });
        };

        vm.gerarRelatorio = function () {
            vm.tableParams.count(vm.produtosRelatorio.length);
            
            setTimeout(function() {
                relatorioService.gerarRelatorio(document.getElementById('divRelatorio'));
            }, 10);
        };

        vm.init();
    });

})(angular);
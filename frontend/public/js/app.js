(function (angular) {
    'use strict';

    angular.module('sce', ['ngRoute', 'ngTable', 'ui.utils.masks', 'ngResource'])
        .constant('baseUrlApi', {
			// Produção
            // apiUrl: 'http://127.0.0.1:9001/api/v1/'
            apiUrl: 'http://52.205.96.169:9001/api/v1/'
        })
        .config(function ($routeProvider, $locationProvider) { //$routeProvider, $locationProvider, $httpProvider, $mdThemingProvider

            $routeProvider
                .when('/', {
                    templateUrl: 'partials/cliente.html'
                })
                .when('/cliente', {
                    templateUrl: 'partials/cliente.html'
                })
                .when('/produto', {
                    templateUrl: 'partials/produto.html'
                })
                .when('/lancamento', {
                    templateUrl: 'partials/lancamento.html'
                })
                .when('/contas-receber', {
                    templateUrl: 'partials/contas-receber.html'
                })         
                .when('/recibo-pagamento', {
                    templateUrl: 'partials/recibo-pagamento.html'
                })
                .when('/empresa', {
                    templateUrl: 'partials/empresa.html'
                })
                .when('/conta-bancaria', {
                    templateUrl: 'partials/conta-bancaria.html'
                })
                .when('/notificacao', {
                    templateUrl: 'partials/notificacao.html'
                })
                .when('/fechamento', {
                    templateUrl: 'partials/fechamento.html'
                })
                .when('/relatorio/valores/produto', {
                    templateUrl: 'partials/valores-produto-relatorio.html'
                })
                .when('/relatorio/titulos/aberto', {
                    templateUrl: 'partials/titulos-aberto-relatorio.html'
                })  
                .when('/relatorio/gastos/cliente', {
                    templateUrl: 'partials/gastos-cliente-relatorio.html'
                })
                // .when('/agenda-compromisso', {
                //     templateUrl: 'partials/agenda-compromisso.html'
                // })
                .otherwise({
                    redirectTo: '/'
                });

            //$mdThemingProvider.theme("success-toast");
            //$mdThemingProvider.theme("error-toast");
        })
        .run(function (PrototypeController) { //menuService, $rootScope, 
            PrototypeController.load();
            // $rootScope.pagination = {
            //     limit: 5,
            //     page: 1,
            //     limitOptions: [5, 10, 20, 50],
            //     label: { page: 'Página:', rowsPerPage: 'Registros por página:', of: 'de' },
            //     order: ''
            // }
            // menuService.load();
        });
})(angular);

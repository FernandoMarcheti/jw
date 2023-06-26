(function (angular) {

    'use strict';
    angular.module('sce')
    .filter('cnpj', function () {
        return function (valor) { 
            if(valor) {
                return valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"); }
            }
            
    });
})(angular);
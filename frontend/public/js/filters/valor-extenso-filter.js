(function (angular) {

    'use strict';
    angular.module('sce')
    .filter('extenso', function () {
        return function (valor) { return new Extenso(valor).humanize(); }
    });
})(angular);
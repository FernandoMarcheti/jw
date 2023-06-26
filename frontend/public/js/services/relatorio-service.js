(function (angular) {
    'use strict';

    angular.module('sce').factory('relatorioService', ['$q', '$http', 'baseUrlApi', '$resource', function ($q, $http, baseUrlApi, $resource) {
        var service = this;

        service.escreve = function(relatorio) {
  
            var req = {
              method: 'POST',
              url: baseUrlApi.apiUrl + 'boleto/write/relatorio',
              headers: {
                'Content-Type': 'text/html'  
              },
              data: relatorio 
            }

            return $q(function(resolve, reject){
                $http(req)
                .then(function(response){
                    resolve(response);
                })
                .catch(function(response){
                    reject({mensagem: "mensagem...."});
                });
              });
        }

        service.gerarRelatorio = function (html) {
            var allLinks = $('head').clone().find('script').remove().end().html();
            var keepColors = '<style>body {-webkit-print-color-adjust: exact !important; }</style>';

            var printWindow = window.open();
            printWindow.document.write('<html><head>' + keepColors + allLinks + '</head><body onload="window.print()">' + $(html).html() + '</body></html>');
            printWindow.document.close();
        };

        service.gerarRelatorioHTML = function (html) {
            var allLinks = $('head').clone().find('script').remove().end().html();
            var keepColors = '<style>body {-webkit-print-color-adjust: exact !important; }</style>';

            var printWindow = window.open();
            printWindow.document.write('<html><head>' + keepColors + allLinks + '</head><body onload="window.print()">' + html + '</body></html>');
            printWindow.document.close();
        };

        return service;
    }]);

})(angular);
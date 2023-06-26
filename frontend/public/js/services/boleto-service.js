(function (angular) {

    'use strict';

    angular.module('sce').factory('boletoService', ['$q', '$http', 'baseUrlApi', '$resource', function ($q, $http, baseUrlApi, $resource) {
        var service = this;
        var urlBase = baseUrlApi.apiUrl + 'boleto';
        var urlContas = baseUrlApi.apiUrl + 'contas-receber'
        
        service.escreve = function(boletos) {

          var boletosHtml = boletos.filter(b => b.envioBoleto === 'fisico' || b.envioBoleto === 'ambos').map(b => b.html);

          var boletosComDemonstrativoParteUm = boletosHtml.slice(0, 100).join('');
          var boletosComDemonstrativoParteDois = boletosHtml.slice(100, 200).join('');
          var boletosComDemonstrativoParteTres = boletosHtml.slice(200).join('');

          var req1 = {
            method: 'POST',
            url: urlBase + '/write',
            headers: {
              'Content-Type': 'text/html'  
            },
            data: boletosComDemonstrativoParteUm 
          }

          var req2 = {
            method: 'POST',
            url: urlBase + '/write',
            headers: {
              'Content-Type': 'text/html'  
            },
            data: boletosComDemonstrativoParteDois 
          }

          var req3 = {
            method: 'POST',
            url: urlBase + '/write',
            headers: {
              'Content-Type': 'text/html'  
            },
            data: boletosComDemonstrativoParteTres 
          }

          var boletosPorEmail = boletos.filter(b => b.envioBoleto === 'email' || b.envioBoleto === 'ambos');

          var req4 = {
            method: 'POST',
            url: urlBase + '/write/via/email',
            data: boletosPorEmail 
          }

          // var requisicoesParaEmail = [];
          // boletosPorEmail.forEach(b => {
          //   requisicoesParaEmail.push(
          //     {
          //       method: 'POST',
          //       url: urlBase + '/write/via/email',
          //       data: b 
          //     }
          //   );
          // });          

          return $q(function(resolve, reject){
            $http(req1)
            .then(function(response1){
              $http(req2)
              .then(function(response2){
                $http(req3)
                .then(function(response3){
                  $http(req4)
                    .then(function(res4) {
                      resolve(res4)
                    })
                })
              })
            })
            .catch(function(response){
                reject({mensagem: "mensagem...."});
            });
          });
          
          
        }

        service.buscar = function (contas) {
            return $q(function (resolve, reject) {
                $http.post(urlBase, contas)
                    .success(function (response) {

                        var htmlBoleto = "";
                        var boletos = [];
                        var count = 0;
                        contas = contas.filter(function(conta){
                            return conta.lancamentos[0].cliente.gerarBoleto;
                        });
                        contas.forEach(function(conta){
                            if(conta.lancamentos[0].cliente.gerarBoleto){
                                htmlBoleto = htmlUnescape(response.body[count].html)
                                boletos.push(htmlBoleto);
                                count++;
                            }      
                        });
                        var agora = inserirDemonstrativo(contas, boletos, response.empresa, response.body);
                        resolve({ response: agora, mensagem: "mensagem..." });
                    })
                    .error(function (response) {
                        reject({ mensagem: "mensagem..." });
                    });
            });
        };    

        service.decimoTerceiro = function(contas){
            return $q(function(resolve, reject){

                $http.post(urlContas + '/decimo-terceiro/buscar/boleto', contas)
                    .success(function (response) {

                        var htmlBoleto = "";
                        var boletos = [];
                        var count = 0;
                        contas = contas.filter(function(conta){
                            return conta.lancamentos[0].cliente.gerarBoleto;
                        });
                        contas.forEach(function(conta){
                            if(conta.lancamentos[0].cliente.gerarBoleto){
                                htmlBoleto = htmlUnescape(response.body[count].html)
                                boletos.push(htmlBoleto);
                                count++;
                            }      
                        });
                        var agora = inserirDemonstrativo13(contas, boletos, response.empresa, response.body);
                        resolve({ response: agora, mensagem: "mensagem..." });
                    })
                    .error(function (response) {
                        reject({ mensagem: "mensagem..." });
                    });






               // var resource = $resource(urlContas + '/decimo-terceiro', {}, {
               //      get: {
               //          method: 'GET',
               //          data: false,
               //          headers: { 'dataVencimento': params.dataVencimento, 
               //                      'observacao': params.observacao,
               //                      'banco': params.banco.banco.codigo }
               //      }
               //  });

               //  resource.get({}, function (response) {
               //      var htmlBoleto = "";
               //      var boletos = [];
               //      var count = 0;
               //      // contas = contas.filter(function(conta){
               //      //     return conta.lancamentos[0].cliente.gerarBoleto;
               //      // });
               //      response.body.forEach(function(conta){
               //          // if(conta.lancamentos[0].cliente.gerarBoleto){
               //              htmlBoleto = htmlUnescape(response.body[count].html)
               //              htmlBoleto += "<div style=\"margin-bottom: 150px;\"> </div>";
               //              boletos.push(htmlBoleto);
               //              count++;
               //          // }      
               //      });
               //      var agora = inserirDemonstrativo13(params, boletos, response.empresa, response.body);
               //      resolve({ response: agora, mensagem: "mensagem..." });
               //      // resolve(response.body);
               //  }, function () {
               //      resject({ mensagem: 'Os dados do contas à receber não puderam ser carregados' });
               //  });   
            });
        };  

        return service;
    }]);

})(angular);

function htmlUnescape(str){
    return str
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

function inserirDemonstrativo13(contas, boletos, empresa, dadosBoleto){
    var boletosComDemonstrativo = [];
    var nossoNumero = '';
    var count = 0;
    contas.forEach(function(conta){
            var dataVencimento = conta.dataVencimento.split('-');
            dataVencimento = `${dataVencimento[2].substring(0,2)}/${dataVencimento[1]}/${dataVencimento[0]}`;
            nossoNumero = conta.numerofechamento;

            var demonstrativo = `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta content="text/html; charset=UTF-8" http-equiv="content-type">      
                  <title></title>

                  <style type="text/css">

                    html, body{
                      height: 100%;
                    }

                    .negrito{
                      font-weight: bold;
                    }

                    .left{
                      float: left;
                    }

                    .left-390{
                        position: absolute;
                        left: 390;
                    }

                    .left-490{
                        position: absolute;
                        left: 490px;
                    }

                    .left-30{
                        position: absolute;
                        left: 30px;
                    }

                    .center{
                       text-align: center;
                    }

                    .font-10{
                      font-size: 10px;
                    }

                    .font-12{
                      font-size: 12px;
                    }

                    .height-20 {
                      height: 20px;
                    }

                    table, .borda {
                      border: 1px solid black;
                      border-collapse: collapse;
                    }
                    th, td {
                      padding: 1px;
                      text-align: left;    
                    }

                    .pdl-45{
                      padding-left: 45px;
                    }

                    .pd-200{
                      padding: 0 200px;
                    }

                    .pd-20{
                      padding: 0 20px;
                    }

                    .borda-direita{
                      border-right: 1px solid black;
                    }

                    .borda-embaixo{
                      border-bottom: 1px solid black;
                    }

                    .mt-40{
                      margin-top: 40px;
                    }

                  </style>
                </head>
                <body>
                  <table style="width:800px" class="borda">
                    <tr>
                      <td class="font-10 borda-direita" colspan="3">Beneficiário</th>
                      <td class="font-10 borda-direita">Agência/Código Beneficiário</td>
                      <td class="font-10">Vencimento</td>
                    </tr>
                    <tr>
                      <td class="negrito font-12 borda-direita" colspan="3">${empresa.razaoSocial}</td>
                      <td rowspan="2" class="center negrito font-12 borda-direita borda-embaixo"> ${conta.banco.agencia}/${dadosBoleto[count].codigoBeneficiario} </td>
                      <td rowspan="2" class="center negrito font-12  borda-embaixo">${dataVencimento}</td>
                    </tr>
                    <tr>
                      <td class="negrito font-12 borda-direita borda-embaixo" colspan="3">CNPJ: ${empresa.cnpjCpf}</td>
                    </tr>

                    <tr>
                      <td class="font-10 borda-direita" colspan="3">Pagador</td>
                      <td class="font-10 borda-direita">Número do Documento</td>
                      <td class="font-10">Nosso Número</td>
                    </tr>
                    <tr>
                      <td class="font-12 negrito borda-direita borda-embaixo" colspan="3">${conta.lancamentos[0].cliente.codigo} - ${conta.lancamentos[0].cliente.razaoSocial}</td>
                      <td class="font-12 negrito center borda-direita borda-embaixo">${dadosBoleto[count].numeroDocumento}</td>
                      <td class="font-12 negrito center borda-embaixo">${dadosBoleto[count].nossoNumero}</td>
                    </tr>

                    <tr>
                      <td class="font-10" width="15%">Espécie</td>
                      <td class="font-10" width="15%">Quantidade</td>
                      <td class="font-10 borda-direita">(x) Valor</td>
                      <td class="font-10 borda-direita">(=) Valor do Documento</td>
                      <td class="font-10">(-) Desconto</td>
                    </tr>
                    <tr>
                      <td class="font-12 negrito pdl-45 borda-direita borda-embaixo" colspan="3">R$</td>
                      <td class="font-12 negrito center borda-direita borda-embaixo">R$ ${dadosBoleto[count].valor.toFixed(2).toString().replace('.', ',')}</td>
                      <td class="borda-embaixo"></td>
                    </tr>

                    <tr>
                      <td class="borda-direita" colspan="3"></td>
                      <td class="font-10 borda-direita">(+) Outros Acréscimos</td>
                      <td class="font-10">(=) Valor Cobrado</td>
                    </tr>

                    <tr>
                      <td class="font-12 negrito borda-direita borda-embaixo" colspan="3">Demonstrativo</td>
                      <td class="borda-direita"></td>
                      <td class="borda-direita"></td>
                    </tr>
                  </table>

                  <div style="width:800px; height: 400px;" class="borda">
                        <span >Descrição</span>
                        <span >Quantidade</span>
                        <span >Valor</span><br>
                       
            `;    

            demonstrativo+= ` <br>
                        <span class="left-30">Valor Total</span>
                        <span class="left-390"></span>
                        <span class="left-490">R$ ${dadosBoleto[count].valor.toFixed(2).toString().replace('.', ',')}</span><br>        
                        <p class="center mt-40"> ${conta.observacao}</p>
                  </div>

                </body>
                </html>
            `;

            var objBoletoComDemonstrativo = {
              html: demonstrativo + boletos[count],
              envioBoleto: conta.lancamentos[0].cliente.envioBoleto,
              email: conta.lancamentos[0].cliente.email,
              razaoSocial: conta.lancamentos[0].cliente.razaoSocial,
              info: empresa.emailCobranca
            };

            boletosComDemonstrativo.push(objBoletoComDemonstrativo);
            count++;
       
    });

    return boletosComDemonstrativo;
}

function inserirDemonstrativo(contas, boletos, empresa, dadosBoleto){
    var boletosComDemonstrativo = [];
    var nossoNumero = '';
    var count = 0;
    contas.forEach(function(conta){
        if(conta.lancamentos[0].cliente.gerarBoleto){
            var dataVencimento = conta.dataVencimento.split('-');
            dataVencimento = `${dataVencimento[2].substring(0,2)}/${dataVencimento[1]}/${dataVencimento[0]}`;
            nossoNumero = conta.numerofechamento;

            var demonstrativo = ` 
                <!DOCTYPE html>
                <html>
                <head>
                  <meta content="text/html; charset=UTF-8" http-equiv="content-type">       
                  <title></title>

                  <style type="text/css">

                    html, body{
                      height: 100%;
                    }

                    .negrito{
                      font-weight: bold;
                    }

                    .left{
                      float: left;
                    }

                    .left-390{
                        position: absolute;
                        left: 390px;
                    }

                    .left-490{
                        position: absolute;
                        left: 490px;
                    }

                    .left-30{
                        position: absolute;
                        left: 30px;
                    }

                    .center{
                       text-align: center;
                    }

                    .font-10{
                      font-size: 12px;
                    }

                    .font-12{
                      font-size: 16px;
                    }

                    .height-20 {
                      height: 20px;
                    }

                    table, .borda {
                      border: 1px solid black;
                      border-collapse: collapse;
                    }
                    th, td {
                      padding: 1px;
                      text-align: left;    
                    }

                    .pdl-45{
                      padding-left: 45px;
                    }

                    .pd-200{
                      padding: 0 200px;
                    }

                    .pd-20{
                      padding: 0 20px;
                    }

                    .borda-direita{
                      border-right: 1px solid black;
                    }

                    .borda-embaixo{
                      border-bottom: 1px solid black;
                    }

                    .mt-40{
                      margin-top: 40px;
                    }

                  </style>
                </head>
                <body>

                  <table style="width:750px" class="borda">
                    <tr>
                      <td class="font-10 borda-direita" colspan="3">Beneficiário</th>
                      <td class="font-10 borda-direita">Agência/Código Beneficiário</td>
                      <td class="font-10">Vencimento</td>
                    </tr>
                    <tr>
                      <td class="negrito font-12 borda-direita" colspan="3">${empresa.razaoSocial}</td>
                      <td rowspan="2" class="center negrito font-12 borda-direita borda-embaixo"> ${conta.banco.agencia.split('-')[0]}/${dadosBoleto[count].codigoBeneficiario} </td>
                      <td rowspan="2" class="center negrito font-12  borda-embaixo">${dataVencimento}</td>
                    </tr>
                    <tr>
                      <td class="negrito font-12 borda-direita borda-embaixo" colspan="3">CNPJ: ${empresa.cnpjCpf}</td>
                    </tr>

                    <tr>
                      <td class="font-10 borda-direita" colspan="3">Pagador</td>
                      <td class="font-10 borda-direita">Número do Documento</td>
                      <td class="font-10">Nosso Número</td>
                    </tr>
                    <tr>
                      <td class="font-12 negrito borda-direita borda-embaixo" colspan="3">${conta.lancamentos[0].cliente.codigo} - ${conta.lancamentos[0].cliente.razaoSocial}</td>
                      <td class="font-12 negrito center borda-direita borda-embaixo">${dadosBoleto[count].numeroDocumento}</td>
                      <td class="font-12 negrito center borda-embaixo">${dadosBoleto[count].nossoNumero}</td>
                    </tr>

                    <tr>
                      <td class="font-10" width="15%">Espécie</td>
                      <td class="font-10" width="15%">Quantidade</td>
                      <td class="font-10 borda-direita">(x) Valor</td>
                      <td class="font-10 borda-direita">(=) Valor do Documento</td>
                      <td class="font-10">(-) Desconto</td>
                    </tr>
                    <tr>
                      <td class="font-12 negrito pdl-45 borda-direita borda-embaixo" colspan="3">R$</td>
                      <td class="font-12 negrito center borda-direita borda-embaixo">R$ ${dadosBoleto[count].valor.toFixed(2).toString().replace('.', ',')}</td>
                      <td class="borda-embaixo"></td>
                    </tr>

                    <tr>
                      <td class="borda-direita" colspan="3"></td>
                      <td class="font-10 borda-direita">(+) Outros Acréscimos</td>
                      <td class="font-10">(=) Valor Cobrado</td>
                    </tr>

                    <tr>
                      <td class="font-12 negrito borda-direita borda-embaixo" colspan="3">Demonstrativo</td>
                      <td class="borda-direita"></td>
                      <td class="borda-direita"></td>
                    </tr>
                  </table>

                  <div style="width:735px; height: 350px;" class="borda">
                        <span class="left-30">Descrição</span>
                        <span class="left-390">Quantidade</span>
                        <span class="left-490">Valor</span><br>
                        <span class="left-30">Mensalidade</span>
                        <span class="left-390"></span>
                        <span class="left-490">R$ ${ conta.lancamentos[0].cliente.valorMensalidade ? conta.lancamentos[0].cliente.valorMensalidade.toFixed(2).toString().replace('.', ',') : '0,00'}</span><br>
            `;     

                conta.lancamentos.forEach(function(lancamento){
                    demonstrativo += `
                        <span class="left-30">${lancamento.produto.nome || ''}</span>
                        <span class="left-390">${lancamento.quantidade || ''}</span>
                        <span class="left-490">R$ ${lancamento.valorTotal.toFixed(2).toString().replace('.', ',') || ''}</span><br>
                    `;
                });

            demonstrativo+= ` <br>
                        <span class="left-30">Valor Total</span>
                        <span class="left-390"></span>
                        <span class="left-490">R$ ${dadosBoleto[count].valor.toFixed(2).toString().replace('.', ',')}</span><br>         
                        <p class="center mt-40"> ${conta.observacao}</p>
                  </div>

                </body>
                </html>
            `;

            var objBoletoComDemonstrativo = {
              html: demonstrativo + boletos[count],
              envioBoleto: conta.lancamentos[0].cliente.envioBoleto,
              email: conta.lancamentos[0].cliente.email,
              razaoSocial: conta.lancamentos[0].cliente.razaoSocial,
              info: empresa.emailCobranca
            };

            boletosComDemonstrativo.push(objBoletoComDemonstrativo);
            count++;
        }
        
    });

    return boletosComDemonstrativo;
}

function pedleft(numero, pad){
    var str = "" + numero;
    var pad = pad;
    return pad.substring(0, pad.length - str.length) + str;
}

using api.Models;
using BoletoNetCore.Arquivo;
using BoletoNetCore.Banco;
using BoletoNetCore.Boleto;
using BoletoNetCore.BoletoImpressao;
using BoletoNetCore.Enums;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;

namespace Api.Controllers
{
    [Route("api/boletos")]
    [ApiController]
    public class BoletoController : ControllerBase
    {
        private static int _proximoNossoNumero = 1;
        private static int _contador = 1;

        private Retorno Credcitrus(Conta obj, Beneficiario beneficiarioObj, string nConvenio, string digitoCodigo)
        {
            DateTime vencimento = obj.dataVencimento;

            var banco = Banco.Instancia(BoletoNetCore.Banco.Bancos.Sicoob);
            banco.Beneficiario = beneficiarioObj;
            banco.FormataBeneficiario();

            Boletos boletos = new Boletos
            {
                Banco = banco
            };

            boletos.Add(GerarBoleto(boletos.Banco, vencimento, 1, "N", 10));

            var html = new StringBuilder();
            var boletoHtml =  "";
            foreach (var boletoTmp in boletos)
            {
                var boletoParaImpressao = new BoletoBancario
                {
                    Boleto = boletoTmp,
                    OcultarInstrucoes = true,
                    MostrarComprovanteEntrega = false,
                    MostrarEnderecoBeneficiario = true,
                    ExibirDemonstrativo = true,
                    OcultarReciboPagador = true
                };

                html.Append("<div style=\"page-break-after: always;\">");
                html.Append(boletoParaImpressao.MontaHtmlEmbedded());
                html.Append("</div>");
                boletoHtml = html.ToString();
                html.Append("</div>");

            }

            Retorno objRetorno = new Retorno();
            objRetorno.html = WebUtility.HtmlDecode(boletoHtml);
            objRetorno.nossoNumero = obj.nossoNumero.ToString().PadLeft(7, '0');
            objRetorno.numeroDocumento = obj.nossoNumero.ToString().PadLeft(9, '0');
            objRetorno.codigoBeneficiario = nConvenio;
            objRetorno.valor = (decimal)obj.valor;
            return objRetorno;
        }

        [HttpPost]
        public IActionResult Post([FromBody] List<Conta> contas)
        {



            string nConvenio = "242530";
            string digitoCodigo = "0";
            var beneficiario = contas[0].cedente;
            var cliente = contas[0].cliente;

            var contaBancaria = new ContaBancaria
            {
                Agencia = beneficiario.agencia,
                DigitoAgencia = beneficiario.digitoAgencia,
                Conta = beneficiario.conta,
                DigitoConta = beneficiario.digitoConta,
                CarteiraPadrao = "1",
                VariacaoCarteiraPadrao = "01",
                TipoCarteiraPadrao = TipoCarteira.CarteiraCobrancaSimples,
                TipoFormaCadastramento = TipoFormaCadastramento.ComRegistro,
                TipoImpressaoBoleto = TipoImpressaoBoleto.Empresa
            };

            var beneficiarioObj = new Beneficiario
            {
                CPFCNPJ = beneficiario.cnpj,
                Nome = beneficiario.razaoSocial,
                Codigo = nConvenio,
                CodigoDV = digitoCodigo,
                CodigoTransmissao = "",
                Endereco = new Endereco
                {
                    LogradouroEndereco = cliente.endereco,
                    LogradouroNumero = "",
                    LogradouroComplemento = "",
                    Bairro = cliente.bairro,
                    Cidade = cliente.cidade,
                    UF = cliente.uf,
                    CEP = cliente.cep
                },
                ContaBancaria = contaBancaria
            };

                

            string boletosHtml = "";
            var response = new HttpResponseMessage();
            List<Retorno> objsRetorno = new List<Retorno>();
            var banco = Banco.Instancia(BoletoNetCore.Banco.Bancos.Sicoob);
            banco.Beneficiario = beneficiarioObj;
            banco.FormataBeneficiario();
            Boletos boletos = new Boletos
            {
                Banco = banco
            };

            foreach (var obj in contas)
            {
                string boleto = "";

                if (obj.isDecimoTerceiro)
                {

                } 
                else
                {
                    DateTime vencimento = obj.dataVencimento;

                        

                    boletos.Add(GerarBoleto(boletos.Banco, vencimento, 1, "N", 10));

                    var html = new StringBuilder();
                    var boletoHtml = "";
                    foreach (var boletoTmp in boletos)
                    {
                        var boletoParaImpressao = new BoletoBancario
                        {
                            Boleto = boletoTmp,
                            OcultarInstrucoes = true,
                            MostrarComprovanteEntrega = false,
                            MostrarEnderecoBeneficiario = true,
                            ExibirDemonstrativo = true,
                            OcultarReciboPagador = true
                        };

                        html.Append("<div style=\"page-break-after: always;\">");
                        html.Append(boletoParaImpressao.MontaHtmlEmbedded());
                        html.Append("</div>");
                        boletoHtml = html.ToString();
                        html.Append("</div>");

                    }

                    Retorno objRetorno = new Retorno();
                    objRetorno.html = WebUtility.HtmlDecode(boletoHtml);
                    objRetorno.nossoNumero = obj.nossoNumero.ToString().PadLeft(7, '0');
                    objRetorno.numeroDocumento = obj.nossoNumero.ToString().PadLeft(9, '0');
                    objRetorno.codigoBeneficiario = nConvenio;
                    objRetorno.valor = (decimal)obj.valor;
                        
                    objsRetorno.Add(objRetorno);
                }

            }

            DateTime d1 = DateTime.Now;
            var nomeAquivo = (d1.ToShortDateString() + d1.ToLongTimeString()).Replace("/", "").Replace(":", "");
            GerarArquivoRemessa(nConvenio, nomeAquivo, beneficiarioObj, contas[0].id, boletos, nomeAquivo, contas[0].observacao);
                

            
            return Ok(objsRetorno);

        }

        private void GerarArquivoRemessa(string nConvenio, string nossoNumero, Beneficiario c, int numeroBanco, Boletos boletos, string nomeAquivo, string obs)
        {
            var path = @"C:\boletos";
            path = CriaSubdiretorio(path, nossoNumero);
            path += "\\" + nomeAquivo + ".txt";
            var banco = Banco.Instancia(BoletoNetCore.Banco.Bancos.Sicoob);
            //Stream st = File.OpenWri

            //ArquivoRemessa arquivo = new ArquivoRemessa(TipoArquivo.CNAB240);

            //arquivo.GerarArquivoRemessa(nConvenio, banco, c, boletos, st, 1);



            var arquivoRemessa = new ArquivoRemessa(boletos.Banco, TipoArquivo.CNAB240, 1);
            using (var fileStream = new FileStream(path, FileMode.Create))
            {
                arquivoRemessa.GerarArquivoRemessa(boletos, fileStream);
            }

        }

        private string CriaSubdiretorio(string path, string subDiretorio)
        {
            string pathString = System.IO.Path.Combine(path, subDiretorio);
            System.IO.Directory.CreateDirectory(pathString);
            return pathString;
        }

        internal static Boleto GerarBoleto(IBanco banco, DateTime vencimento, int i, string aceite, int NossoNumeroInicial)
        {

            var pagador = new Pagador
            {
                CPFCNPJ = "443.316.101-28",
                Nome = "Pagador Teste PF",
                Observacoes = "Matricula 678/9",
                Endereco = new Endereco
                {
                    LogradouroEndereco = "Rua Testando",
                    LogradouroNumero = "456",
                    Bairro = "Bairro",
                    Cidade = "Cidade",
                    UF = "SP",
                    CEP = "56789012"
                }
            };
            var boleto = new Boleto(banco)
            {
                Pagador = pagador,
                DataEmissao = DateTime.Now.AddDays(-3),
                DataProcessamento = DateTime.Now,
                DataVencimento = vencimento,
                ValorTitulo = (decimal)100 * i,
                NossoNumero = NossoNumeroInicial == 0 ? "" : (NossoNumeroInicial + _proximoNossoNumero).ToString(),
                NumeroDocumento = "BB" + _proximoNossoNumero.ToString("D6") + (char)(64 + i),
                EspecieDocumento = TipoEspecieDocumento.DM,
                Aceite = aceite,
                CodigoInstrucao1 = "11",
                CodigoInstrucao2 = "22",
                DataDesconto = DateTime.Now.AddMonths(i),
                ValorDesconto = (decimal)(100 * i * 0.10),
                DataMulta = DateTime.Now.AddMonths(i),
                PercentualMulta = (decimal)2.00,
                ValorMulta = (decimal)(100 * i * (2.00 / 100)),
                DataJuros = DateTime.Now.AddMonths(i),
                PercentualJurosDia = (decimal)0.2,
                ValorJurosDia = (decimal)(100 * i * (0.2 / 100)),
                AvisoDebitoAutomaticoContaCorrente = "2",
                MensagemArquivoRemessa = "Mensagem para o arquivo remessa",
                NumeroControleParticipante = "CHAVEPRIMARIA" + _proximoNossoNumero
            };
            // Mensagem - Instruções do Caixa
            boleto.ImprimirValoresAuxiliares = true;

            boleto.ValidarDados();
            _contador++;
            _proximoNossoNumero++;
            return boleto;
        }
    }
}
﻿using System;

namespace BoletoNetCore.Exceptions
{
    public sealed class BoletoNetCoreException : Exception
    {
        private BoletoNetCoreException(string message)
            : base(message)
        {
        }

        private BoletoNetCoreException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        public static BoletoNetCoreException BancoNaoImplementado(int codigoBanco)
        {
            return new BoletoNetCoreException($"Banco não implementando: {codigoBanco}");
        }

        public static BoletoNetCoreException ErroAoFormatarBeneficiario(Exception ex)
        {
            return new BoletoNetCoreException("Erro durante a formatação do beneficiário.", ex);
        }

        public static BoletoNetCoreException ErroAoFormatarCodigoDeBarra(Exception ex)
        {
            return new BoletoNetCoreException("Erro durante a formatação do código de barra.", ex);
        }

        public static Exception ErroAoFormatarNossoNumero(Exception ex)
        {
            return new BoletoNetCoreException("Erro durante a formatação do nosso número.", ex);
        }

        public static Exception ErroAoValidarBoleto(Exception ex)
        {
            return new BoletoNetCoreException("Erro durante a validação do boleto.", ex);
        }

        public static Exception ErroAoGerarRegistroHeaderDoArquivoRemessa(Exception ex)
        {
            return new BoletoNetCoreException("Erro durante a geração do registro HEADER do arquivo de REMESSA.", ex);
        }

        public static Exception ErroAoGerarRegistroDetalheDoArquivoRemessa(Exception ex)
        {
            return new BoletoNetCoreException("Erro durante a geração dos registros de DETALHE do arquivo de REMESSA.",
                ex);
        }

        public static Exception ErroAoGerrarRegistroTrailerDoArquivoRemessa(Exception ex)
        {
            return new BoletoNetCoreException("Erro durante a geração do registro TRAILER do arquivo de REMESSA.", ex);
        }

        public static Exception AgenciaInvalida(string agencia, int digitos)
        {
            return new BoletoNetCoreException($"O número da agência ({agencia}) deve conter {digitos} dígitos.");
        }

        public static Exception ContaInvalida(string conta, int digitos)
        {
            return new BoletoNetCoreException($"O número da conta ({conta}) deve conter {digitos} dígitos.");
        }

        public static Exception CodigoBeneficiarioInvalido(string codigoBeneficiario, int digitos)
        {
            return new BoletoNetCoreException(
                $"O código do beneficiário ({codigoBeneficiario}) deve conter {digitos} dígitos.");
        }

        public static Exception CodigoBeneficiarioInvalido(string codigoBeneficiario, string digitos)
        {
            return new BoletoNetCoreException(
                $"O código do beneficiário ({codigoBeneficiario}) deve conter {digitos} dígitos.");
        }

        public static Exception CarteiraNaoImplementada(string carteiraComVariacao)
        {
            return new BoletoNetCoreException($"Carteira não implementada: {carteiraComVariacao}");
        }

        public static Exception NumeroSequencialInvalido(int numeroSequencial)
        {
            return new BoletoNetCoreException($"Número sequencial é inválido: {numeroSequencial}");
        }
    }
}
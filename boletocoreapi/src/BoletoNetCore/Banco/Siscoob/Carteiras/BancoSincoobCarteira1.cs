﻿using System;
using BoletoNetCore.Enums;
using BoletoNetCore.Extensions;
using static System.String;

namespace BoletoNetCore.Banco.Siscoob.Carteiras
{
    [CarteiraCodigo("1/01")]
    internal class BancoSincoobCarteira1 : ICarteira<BancoSicoob>
    {
        private BancoSincoobCarteira1()
        {
        }

        internal static Lazy<ICarteira<BancoSicoob>> Instance { get; } =
            new Lazy<ICarteira<BancoSicoob>>(() => new BancoSincoobCarteira1());

        public void FormataNossoNumero(Boleto.Boleto boleto)
        {
            var beneficiario = boleto.Banco.Beneficiario;
            if ((beneficiario.ContaBancaria.TipoImpressaoBoleto == TipoImpressaoBoleto.Empresa) &
                (boleto.NossoNumero == Empty))
                throw new Exception("Nosso Número não informado.");

            // Nosso número não pode ter mais de 7 dígitos
            if (boleto.NossoNumero.Length > 7)
                throw new Exception("Nosso Número (" + boleto.NossoNumero + ") deve conter 7 dígitos.");

            boleto.NossoNumero = boleto.NossoNumero.PadLeft(7, '0');

            // Base para calcular DV: Agencia (4 caracteres) Código do Beneficiário com dígito (10 caracteres) Nosso Número (7 caracteres)
            var baseCalculoDV =
                $"{beneficiario.ContaBancaria.Agencia}{beneficiario.Codigo.PadLeft(9, '0')}{beneficiario.CodigoDV}{boleto.NossoNumero}";
            boleto.NossoNumeroDV = baseCalculoDV.CalcularDVSicoob();
            boleto.NossoNumeroFormatado = $"{boleto.NossoNumero}-{boleto.NossoNumeroDV}";
        }

        public string FormataCodigoBarraCampoLivre(Boleto.Boleto boleto)
        {
            var beneficiario = boleto.Banco.Beneficiario;
            var contaBancaria = beneficiario.ContaBancaria;
            return
                $"{boleto.Carteira}{contaBancaria.Agencia}{boleto.VariacaoCarteira}{beneficiario.Codigo}{beneficiario.CodigoDV}{boleto.NossoNumero}{boleto.NossoNumeroDV}001";
        }
    }
}
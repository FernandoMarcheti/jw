﻿using System;
using BoletoNetCore.Extensions;
using static System.String;

namespace BoletoNetCore.Banco.Itau.Carteiras
{
    [CarteiraCodigo("112")]
    internal class BancoItauCarteira112 : ICarteira<BancoItau>
    {
        private BancoItauCarteira112()
        {
        }

        internal static Lazy<ICarteira<BancoItau>> Instance { get; } =
            new Lazy<ICarteira<BancoItau>>(() => new BancoItauCarteira112());

        public void FormataNossoNumero(Boleto.Boleto boleto)
        {
            if (IsNullOrWhiteSpace(boleto.NossoNumero) || boleto.NossoNumero == "00000000")
            {
                // Banco irá gerar Nosso Número
                boleto.NossoNumero = new string('0', 8);
                boleto.NossoNumeroDV = "0";
                boleto.NossoNumeroFormatado = $"{boleto.Carteira}/{boleto.NossoNumero}-{boleto.NossoNumeroDV}";
            }
            else
            {
                // Nosso Número informado pela empresa
                // Nosso número não pode ter mais de 8 dígitos
                if (boleto.NossoNumero.Length > 8)
                    throw new Exception($"Nosso Número ({boleto.NossoNumero}) deve conter 8 dígitos.");

                boleto.NossoNumero = boleto.NossoNumero.PadLeft(8, '0');
                boleto.NossoNumeroDV =
                    (boleto.Banco.Beneficiario.ContaBancaria.Agencia + boleto.Banco.Beneficiario.ContaBancaria.Conta +
                     boleto.Banco.Beneficiario.ContaBancaria.DigitoConta + boleto.Carteira + boleto.NossoNumero)
                    .CalcularDVItau();
                boleto.NossoNumeroFormatado = $"{boleto.Carteira}/{boleto.NossoNumero}-{boleto.NossoNumeroDV}";
            }
        }

        public string FormataCodigoBarraCampoLivre(Boleto.Boleto boleto)
        {
            return
                $"{boleto.Carteira}{boleto.NossoNumero}{boleto.NossoNumeroDV}{boleto.Banco.Beneficiario.ContaBancaria.Agencia}{boleto.Banco.Beneficiario.ContaBancaria.Conta}{boleto.Banco.Beneficiario.ContaBancaria.DigitoConta}000";
        }
    }
}
﻿using System.Collections.Generic;
using BoletoNetCore.Exceptions;

namespace BoletoNetCore.Banco.Safra
{
    internal sealed partial class BancoSafra : BancoFebraban<BancoSafra>, IBanco
    {
        public BancoSafra()
        {
            Codigo = 422;
            Nome = "Safra";
            Digito = "7";
            IdsRetornoCnab400RegistroDetalhe = new List<string> {"1"};
            RemoveAcentosArquivoRemessa = true;
        }

        public void FormataBeneficiario()
        {
            var contaBancaria = Beneficiario.ContaBancaria;

            if (!CarteiraFactory<BancoSafra>.CarteiraEstaImplementada(contaBancaria.CarteiraComVariacaoPadrao))
                throw BoletoNetCoreException.CarteiraNaoImplementada(contaBancaria.CarteiraComVariacaoPadrao);

            contaBancaria.FormatarDados("ATÉ O VENCIMENTO EM QUALQUER BANCO. APÓS O VENCIMENTO SOMENTE NO SAFRA.", "",
                "", 6);

            Beneficiario.CodigoFormatado =
                $"{contaBancaria.Agencia}-{contaBancaria.DigitoAgencia} / {contaBancaria.Conta}-{contaBancaria.DigitoConta}";
        }
    }
}
﻿using System;
using static System.String;

namespace BoletoNetCore.Banco.Banrisul.Carteiras
{
    [CarteiraCodigo("1")]
    internal class BancoBanrisulCarteira1 : ICarteira<BancoBanrisul>
    {
        private BancoBanrisulCarteira1()
        {
        }

        internal static Lazy<ICarteira<BancoBanrisul>> Instance { get; } =
            new Lazy<ICarteira<BancoBanrisul>>(() => new BancoBanrisulCarteira1());

        public void FormataNossoNumero(Boleto.Boleto boleto)
        {
            // Nosso número não pode ter mais de 11 dígitos

            if (IsNullOrWhiteSpace(boleto.NossoNumero) || boleto.NossoNumero == "00000000")
            {
                // Banco irá gerar Nosso Número
                boleto.NossoNumero = new string('0', 8);
                boleto.NossoNumeroDV = "00";
                boleto.NossoNumeroFormatado = boleto.NossoNumero + "-" + boleto.NossoNumeroDV;
            }
            else
            {
                // Nosso Número informado pela empresa
                if (boleto.NossoNumero.Length > 8)
                    throw new Exception($"Nosso Número ({boleto.NossoNumero}) deve conter 8 dígitos.");
                boleto.NossoNumero = boleto.NossoNumero.PadLeft(8, '0');

                var dv1 = Mod10Banrisul(boleto.NossoNumero);
                var dv1e2 = Mod11Banrisul(boleto.NossoNumero,
                    dv1); // O módulo 11 sempre devolve os dois Dígitos, pois, as vezes o dígito calculado no mod10 será incrementado em 1
                boleto.NossoNumeroDV = dv1e2.ToString("00");
                boleto.NossoNumeroFormatado = boleto.NossoNumero + "-" + boleto.NossoNumeroDV;
            }
        }

        public string FormataCodigoBarraCampoLivre(Boleto.Boleto boleto)
        {
            var contaBancaria = boleto.Banco.Beneficiario.ContaBancaria;
            var campoLivre = $"21{contaBancaria.Agencia}{contaBancaria.Conta.Substring(0, 7)}{boleto.NossoNumero}40";
            var dv1 = Mod10Banrisul(campoLivre);
            var dv1e2 = Mod11Banrisul(campoLivre,
                dv1); // O módulo 11 sempre devolve os dois Dígitos, pois, as vezes o dígito calculado no mod10 será incrementado em 1
            return campoLivre + dv1e2.ToString("00");
        }

        private int Mod10Banrisul(string seq)
        {
            /* (N1*1-9) + (N2*2-9) + (N3*1-9) + (N4*2-9) + (N5*1-9) + (N6*2-9) + (N7*1-9) + (N8*2-9)
             * Observação:
             * a) a subtração do 9 somente será feita se o produto obtido da multiplicação individual for maior do que 9. 
             * b) quando o somatório for menor que 10, o resto da divisão por 10 será o próprio somatório. 
             * c) quando o resto for 0, o primeiro DV é igual a 0.
             */
            int soma = 0, resto, peso = 2;

            for (var i = seq.Length - 1; i >= 0; i--)
            {
                var n = Convert.ToInt32(seq.Substring(i, 1));
                var result = n * peso > 9 ? n * peso - 9 : n * peso;
                soma += result;
                peso = peso == 2 ? 1 : 2;
            }

            if (soma < 10)
                resto = soma;
            else
                resto = soma % 10;
            var dv1 = resto == 0 ? 0 : 10 - resto;
            return dv1;
        }

        private int Mod11Banrisul(string seq, int dv1)
        {
            /* Obter somatório (peso de 2 a 7), sempre da direita para a esquerda (N1*4)+(N2*3)+(N3*2)+(N4*7)+(N5*6)+(N6*5)+(N7*4)+(N8*3)+(N9*2)
             * Caso o somatório obtido seja menor que "11", considerar como resto da divisão o próprio somatório.
             * Caso o ''resto'' obtido no cálculo do módulo ''11'' seja igual a ''1'', considera-se o DV inválido. 
             * Soma-se, então, "1" ao DV obtido do módulo "10" e refaz-se o cálculo do módulo 11 . 
             * Se o dígito obtido pelo módulo 10 era igual a "9", considera-se então (9+1=10) DV inválido. 
             * Neste caso, o DV do módulo "10" automaticamente será igual a "0" e procede-se assim novo cálculo pelo módulo "11". 
             * Caso o ''resto'' obtido no cálculo do módulo "11" seja ''0'', o segundo ''NC'' será igual ao próprio ''resto''
             */
            int peso = 2, mult, sum = 0, rest, dv2, b = 7, n;
            seq += dv1.ToString();
            bool dvInvalido;
            for (var i = seq.Length - 1; i >= 0; i--)
            {
                n = Convert.ToInt32(seq.Substring(i, 1));
                mult = n * peso;
                sum += mult;
                if (peso < b)
                    peso++;
                else
                    peso = 2;
            }

            seq = seq.Substring(0, seq.Length - 1);
            rest = sum < 11 ? sum : sum % 11;
            if (rest == 1)
                dvInvalido = true;
            else
                dvInvalido = false;

            if (dvInvalido)
            {
                var novoDv1 = dv1 == 9 ? 0 : dv1 + 1;
                dv2 = Mod11Banrisul(seq, novoDv1);
            }
            else
            {
                dv2 = rest == 0 ? 0 : 11 - rest;
            }

            if (!dvInvalido)
            {
                var digitos = dv1.ToString() + dv2;
                return Convert.ToInt32(digitos);
            }

            return dv2;
        }
    }
}
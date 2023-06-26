using System;

namespace BoletoNetCore.Util
{
    public class TCampoRegistroEDI
    {
        #region Variáveis Privadas

        #endregion

        #region Propriedades

        /// <summary>
        ///     Descrição do campo no registro EDI (meramente descritivo)
        /// </summary>
        public string DescricaoCampo { get; set; }

        /// <summary>
        ///     Tipo de dado de ORIGEM das informações do campo EDI.
        /// </summary>
        public TTiposDadoEDI TipoCampo { get; set; }

        /// <summary>
        ///     Tamanho em caracteres do campo no arquivo EDI (DESTINO)
        /// </summary>
        public int TamanhoCampo { get; set; }

        /// <summary>
        ///     Quantidade de casas decimais do campo, caso ele seja do tipo numérico sem decimais. Caso
        ///     não se aplique ao tipo de dado, o valor da propriedade será ignorado nas funções de formatação.
        /// </summary>
        public int QtdDecimais { get; set; }

        /// <summary>
        ///     Valor de ORIGEM do campo, sem formatação, no tipo de dado adequado ao campo. O valor deve ser atribuido
        ///     com o tipo de dado adequado ao seu proposto, por exemplo, Double para representar valor, DateTime para
        ///     representar datas e/ou horas, etc.
        /// </summary>
        public object ValorNatural { get; set; }

        /// <summary>
        ///     Valor formatado do campo, pronto para ser utilizado no arquivo EDI. A formatação será de acordo
        ///     com a especificada na propriedade TipoCampo, com numéricos alinhados à direita e zeros à esquerda
        ///     e campos alfanuméricos alinhados à esquerda e com brancos à direita.
        ///     Também pode receber o valor vindo do arquivo EDI, para ser decodificado e o resultado da decodificação na
        ///     propriedade
        ///     ValorNatural
        /// </summary>
        public string ValorFormatado { get; set; }

        /// <summary>
        ///     Número de ordem do campo no registro EDI
        /// </summary>
        public int OrdemNoRegistroEDI { get; set; }

        /// <summary>
        ///     Caractere separador dos elementos de campos com o tipo DATA. Colocar null caso esta propriedade
        ///     não se aplique ao tipo de dado.
        /// </summary>
        public string SeparadorDatas { get; set; }

        /// <summary>
        ///     Caractere separador dos elementos de campos com o tipo HORA. Colocar null caso esta propriedade
        ///     não se aplique ao tipo de dado.
        /// </summary>
        public string SeparadorHora { get; set; }

        /// <summary>
        ///     Posição do caracter inicial do campo no arquivo EDI
        /// </summary>
        public int PosicaoInicial { get; set; }

        public int PosicaoFinal { get; set; }

        /// <summary>
        ///     Caractere de Preenchimento do campo da posição inicial até a posição final
        /// </summary>
        public char Preenchimento { get; set; } = ' ';

        #endregion

        #region Construtores

        /// <summary>
        ///     Cria um objeto TCampoRegistroEDI
        /// </summary>
        public TCampoRegistroEDI()
        {
        }

        /// <summary>
        ///     Cria um objeto do tipo TCampoRegistroEDI inicializando as propriedades básicas.
        /// </summary>
        /// <param name="pTipoCampo">Tipo de dado de origem dos dados</param>
        /// <param name="pPosicaoInicial">Posição Inicial do Campo no Arquivo</param>
        /// <param name="pTamanho">Tamanho em caracteres do campo (destino)</param>
        /// <param name="pDecimais">Quantidade de decimais do campo (destino)</param>
        /// <param name="pValor">Valor do campo (Origem), no tipo de dado adequado ao propósito do campo</param>
        /// <param name="pPreenchimento">Caractere de Preenchimento do campo caso o valor não ocupe todo o tamanho</param>
        /// <param name="pSeparadorHora">Separador de hora padrão; null para sem separador</param>
        /// <param name="pSeparadorData">Separador de data padrão; null para sem separador</param>
        public TCampoRegistroEDI(TTiposDadoEDI pTipoCampo, int pPosicaoInicial, int pTamanho, int pDecimais,
            object pValor, char pPreenchimento, string pSeparadorHora, string pSeparadorData)
        {
            TipoCampo = pTipoCampo;
            TamanhoCampo = pTamanho;
            QtdDecimais = pDecimais;
            ValorNatural = pValor;
            SeparadorHora = pSeparadorHora;
            SeparadorDatas = pSeparadorData;
            OrdemNoRegistroEDI = 0;
            DescricaoCampo = "";
            PosicaoInicial = pPosicaoInicial - 1; //Compensa a indexação com base em zero
            PosicaoFinal = pPosicaoInicial + TamanhoCampo;
            Preenchimento = pPreenchimento;
        }

        /// <summary>
        ///     Cria um objeto do tipo TCampoRegistroEDI inicializando as propriedades básicas.
        /// </summary>
        /// <param name="pTipoCampo">Tipo de dado de origem dos dados</param>
        /// <param name="pPosicaoInicial">Posição Inicial do Campo no Arquivo</param>
        /// <param name="pTamanho">Tamanho em caracteres do campo (destino)</param>
        /// <param name="pDecimais">Quantidade de decimais do campo (destino)</param>
        /// <param name="pValor">Valor do campo (Origem), no tipo de dado adequado ao propósito do campo</param>
        /// <param name="pPreenchimento">Caractere de Preenchimento do campo caso o valor não ocupe todo o tamanho</param>
        public TCampoRegistroEDI(TTiposDadoEDI pTipoCampo, int pPosicaoInicial, int pTamanho, int pDecimais,
            object pValor, char pPreenchimento)
        {
            TipoCampo = pTipoCampo;
            TamanhoCampo = pTamanho;
            QtdDecimais = pDecimais;
            ValorNatural = pValor;
            SeparadorHora = null;
            SeparadorDatas = null;
            OrdemNoRegistroEDI = 0;
            DescricaoCampo = "";
            PosicaoInicial = pPosicaoInicial - 1; //Compensa a indexação com base em zero
            PosicaoFinal = pPosicaoInicial + TamanhoCampo;
            Preenchimento = pPreenchimento;
        }

        #endregion

        #region Métodos Públicos

        /// <summary>
        ///     Aplica formatação ao valor do campo em ValorNatural, colocando o resultado na propriedade ValorFormatado
        /// </summary>
        public void CodificarNaturalParaEDI()
        {
            switch (TipoCampo)
            {
                case TTiposDadoEDI.ediAlphaAliEsquerda_____:
                {
                    if (ValorNatural != null)
                    {
                        if (ValorNatural.ToString().Trim().Length >= TamanhoCampo)
                            ValorFormatado = ValorNatural.ToString().Trim().Substring(0, TamanhoCampo);
                        else
                            ValorFormatado = ValorNatural.ToString().Trim().PadRight(TamanhoCampo, Preenchimento); //' '
                    }
                    else
                    {
                        ValorFormatado = string.Empty.PadRight(TamanhoCampo, Preenchimento); //' '
                    }

                    break;
                }
                case TTiposDadoEDI.ediAlphaAliDireita______:
                {
                    if (ValorNatural != null)
                    {
                        if (ValorNatural.ToString().Trim().Length >= TamanhoCampo)
                            ValorFormatado = ValorNatural.ToString().Trim().Substring(0, TamanhoCampo);
                        else
                            ValorFormatado = ValorNatural.ToString().Trim().PadLeft(TamanhoCampo, Preenchimento); //' '
                    }
                    else
                    {
                        ValorFormatado = string.Empty.PadLeft(TamanhoCampo, Preenchimento); //' '
                    }

                    break;
                }
                case TTiposDadoEDI.ediInteiro______________:
                {
                    ValorFormatado = ValorNatural.ToString().Trim().PadLeft(TamanhoCampo, Preenchimento); //'0'
                    break;
                }
                case TTiposDadoEDI.ediNumericoSemSeparador_:
                {
                    if (ValorNatural == null)
                    {
                        var aux = "";
                        ValorFormatado =
                            aux.Trim().PadLeft(TamanhoCampo,
                                ' '); //Se o Número for NULL, preenche com espaços em branco
                    }
                    else
                    {
                        var Formatacao = "{0:f" + QtdDecimais + "}";
                        ValorFormatado = string.Format(Formatacao, ValorNatural).Replace(",", "").Replace(".", "")
                            .Trim().PadLeft(TamanhoCampo, Preenchimento); //'0'
                    }

                    break;
                }
                case TTiposDadoEDI.ediNumericoComPonto_____:
                {
                    var Formatacao = "{0:f" + QtdDecimais + "}";
                    ValorFormatado = string.Format(Formatacao, ValorNatural).Replace(",", ".").Trim()
                        .PadLeft(TamanhoCampo, Preenchimento); //'0'
                    break;
                }
                case TTiposDadoEDI.ediNumericoComVirgula___:
                {
                    var Formatacao = "{0:f" + QtdDecimais + "}";
                    ValorFormatado = string.Format(Formatacao, ValorNatural).Replace(".", ",").Trim()
                        .PadLeft(TamanhoCampo, Preenchimento); //'0'
                    break;
                }
                case TTiposDadoEDI.ediDataAAAAMMDD_________:
                {
                    if ((DateTime) ValorNatural != DateTime.MinValue)
                    {
                        var sep = SeparadorDatas == null ? "" : SeparadorDatas;
                        var Formatacao = "{0:yyyy" + sep + "MM" + sep + "dd}";
                        ValorFormatado = string.Format(Formatacao, ValorNatural);
                    }
                    else
                    {
                        ValorNatural = "";
                        goto case TTiposDadoEDI.ediAlphaAliEsquerda_____;
                    }

                    break;
                }
                case TTiposDadoEDI.ediDataDDMM_____________:
                {
                    if ((DateTime) ValorNatural != DateTime.MinValue)
                    {
                        var sep = SeparadorDatas == null ? "" : SeparadorDatas;
                        var Formatacao = "{0:dd" + sep + "MM}";
                        ValorFormatado = string.Format(Formatacao, ValorNatural);
                    }
                    else
                    {
                        ValorNatural = "";
                        goto case TTiposDadoEDI.ediAlphaAliEsquerda_____;
                    }

                    break;
                }
                case TTiposDadoEDI.ediDataDDMMAAAA_________:
                {
                    if ((DateTime) ValorNatural != DateTime.MinValue)
                    {
                        var sep = SeparadorDatas == null ? "" : SeparadorDatas;
                        var Formatacao = "{0:dd" + sep + "MM" + sep + "yyyy}";
                        ValorFormatado = string.Format(Formatacao, ValorNatural);
                    }
                    else
                    {
                        ValorNatural = "";
                        goto case TTiposDadoEDI.ediAlphaAliEsquerda_____;
                    }

                    break;
                }
                case TTiposDadoEDI.ediDataDDMMAA___________:
                {
                    if ((DateTime) ValorNatural != DateTime.MinValue)
                    {
                        var sep = SeparadorDatas == null ? "" : SeparadorDatas;
                        var Formatacao = "{0:dd" + sep + "MM" + sep + "yy}";
                        ValorFormatado = string.Format(Formatacao, ValorNatural);
                    }
                    else
                    {
                        ValorNatural = "";
                        goto case TTiposDadoEDI.ediAlphaAliEsquerda_____;
                    }

                    break;
                }
                case TTiposDadoEDI.ediDataMMAAAA___________:
                {
                    if ((DateTime) ValorNatural != DateTime.MinValue)
                    {
                        var sep = SeparadorDatas == null ? "" : SeparadorDatas;
                        var Formatacao = "{0:MM" + sep + "yyyy}";
                        ValorFormatado = string.Format(Formatacao, ValorNatural);
                    }
                    else
                    {
                        ValorNatural = "";
                        goto case TTiposDadoEDI.ediAlphaAliEsquerda_____;
                    }

                    break;
                }
                case TTiposDadoEDI.ediDataMMDD_____________:
                {
                    if ((DateTime) ValorNatural != DateTime.MinValue)
                    {
                        var sep = SeparadorDatas == null ? "" : SeparadorDatas;
                        var Formatacao = "{0:MM" + sep + "dd}";
                        ValorFormatado = string.Format(Formatacao, ValorNatural);
                    }
                    else
                    {
                        ValorNatural = "";
                        goto case TTiposDadoEDI.ediAlphaAliEsquerda_____;
                    }

                    break;
                }
                case TTiposDadoEDI.ediHoraHHMM_____________:
                {
                    var sep = SeparadorHora == null ? "" : SeparadorHora;
                    var Formatacao = "{0:HH" + sep + "mm}";
                    ValorFormatado = string.Format(Formatacao, ValorNatural);
                    break;
                }
                case TTiposDadoEDI.ediHoraHHMMSS___________:
                {
                    var sep = SeparadorHora == null ? "" : SeparadorHora;
                    var Formatacao = "{0:HH" + sep + "mm" + sep + "ss}";
                    ValorFormatado = string.Format(Formatacao, ValorNatural);
                    break;
                }
                case TTiposDadoEDI.ediDataDDMMAAAAWithZeros:
                {
                    var sep = SeparadorDatas == null ? "" : SeparadorDatas;
                    if (ValorNatural != null || !ValorNatural.ToString().Trim().Equals(""))
                    {
                        var Formatacao = "{0:dd" + sep + "MM" + sep + "yyyy}";
                        ValorFormatado = string.Format(Formatacao, ValorNatural);
                    }
                    else
                    {
                        ValorFormatado = "00" + sep + "00" + sep + "0000";
                    }

                    break;
                }
                case TTiposDadoEDI.ediDataAAAAMMDDWithZeros:
                {
                    var sep = SeparadorDatas == null ? "" : SeparadorDatas;
                    if (ValorNatural != null)
                    {
                        var Formatacao = "{0:yyyy" + sep + "MM" + sep + "dd}";
                        ValorFormatado = string.Format(Formatacao, ValorNatural);
                    }
                    else
                    {
                        ValorFormatado = "00" + sep + "00" + sep + "0000";
                    }

                    break;
                }
            }
        }

        /// <summary>
        ///     Transforma o valor vindo do campo do registro EDI da propriedade ValorFormatado para o valor natural (com o tipo
        ///     de dado adequado) na propriedade ValorNatural
        /// </summary>
        public void DecodificarEDIParaNatural()
        {
            if (ValorFormatado.Trim().Equals(""))
                ValorNatural = null;
            else
                switch (TipoCampo)
                {
                    case TTiposDadoEDI.ediAlphaAliEsquerda_____:
                    {
                        ValorNatural = ValorFormatado.Trim();
                        break;
                    }
                    case TTiposDadoEDI.ediAlphaAliDireita______:
                    {
                        ValorNatural = ValorFormatado.Trim();
                        break;
                    }
                    case TTiposDadoEDI.ediInteiro______________:
                    {
                        ValorNatural = long.Parse(ValorFormatado.Trim());
                        break;
                    }
                    case TTiposDadoEDI.ediNumericoSemSeparador_:
                    {
                        var s = ValorFormatado.Substring(0, ValorFormatado.Length - QtdDecimais) + "," +
                                ValorFormatado.Substring(ValorFormatado.Length - QtdDecimais, QtdDecimais);
                        ValorNatural = double.Parse(s.Trim());
                        break;
                    }
                    case TTiposDadoEDI.ediNumericoComPonto_____:
                    {
                        ValorNatural = double.Parse(ValorFormatado.Replace(".", ",").Trim());
                        break;
                    }
                    case TTiposDadoEDI.ediNumericoComVirgula___:
                    {
                        ValorNatural = double.Parse(ValorFormatado.Trim().Replace(".", ","));
                        break;
                    }
                    case TTiposDadoEDI.ediDataAAAAMMDD_________:
                    {
                        if (!ValorFormatado.Trim().Equals(""))
                        {
                            var cAno = "";
                            var cMes = "";
                            var cDia = "";
                            if (SeparadorDatas != null)
                            {
                                var split = ValorFormatado.Split(SeparadorDatas.ToCharArray());
                                cAno = split[0];
                                cMes = split[1];
                                cDia = split[2];
                            }
                            else
                            {
                                cAno = ValorFormatado.Substring(0, 4);
                                cMes = ValorFormatado.Substring(4, 2);
                                cDia = ValorFormatado.Substring(6, 2);
                            }

                            if (cDia.Equals("00") && cMes.Equals("00") && cAno.Equals("0000"))
                                ValorNatural = null;
                            else
                                ValorNatural = DateTime.Parse(cDia + "/" + cMes + "/" + cAno);
                        }
                        else
                        {
                            ValorNatural = null;
                        }

                        break;
                    }
                    case TTiposDadoEDI.ediDataDDMM_____________:
                    {
                        if (!ValorFormatado.Trim().Equals(""))
                        {
                            var cAno = "1900";
                            var cMes = "";
                            var cDia = "";
                            if (SeparadorDatas != null)
                            {
                                var split = ValorFormatado.Split(SeparadorDatas.ToCharArray());
                                cMes = split[1];
                                cDia = split[0];
                            }
                            else
                            {
                                cMes = ValorFormatado.Substring(2, 2);
                                cDia = ValorFormatado.Substring(0, 2);
                            }

                            ValorNatural = DateTime.Parse(cDia + "/" + cMes + "/" + cAno);
                        }
                        else
                        {
                            ValorNatural = null;
                        }

                        break;
                    }
                    case TTiposDadoEDI.ediDataDDMMAAAA_________:
                    {
                        var cDia = "";
                        var cMes = "";
                        var cAno = "";
                        if (SeparadorDatas != null)
                        {
                            var split = ValorFormatado.Split(SeparadorDatas.ToCharArray());
                            cAno = split[2];
                            cMes = split[1];
                            cDia = split[0];
                        }
                        else
                        {
                            cDia = ValorFormatado.Substring(0, 2);
                            cMes = ValorFormatado.Substring(2, 2);
                            cAno = ValorFormatado.Substring(4, 4);
                        }

                        if ((cDia.Equals("00") && cMes.Equals("00") && cAno.Equals("0000")) ||
                            ValorFormatado.Trim().Equals(""))
                            ValorNatural = DateTime.Parse("01/01/1900"); //data start
                        else
                            ValorNatural = DateTime.Parse(cDia + "/" + cMes + "/" + cAno);
                        break;
                    }
                    case TTiposDadoEDI.ediDataDDMMAA___________:
                    {
                        var cDia = "";
                        var cMes = "";
                        var cAno = "";
                        if (SeparadorDatas != null)
                        {
                            var split = ValorFormatado.Split(SeparadorDatas.ToCharArray());
                            cAno = split[2];
                            cMes = split[1];
                            cDia = split[0];
                        }
                        else
                        {
                            cDia = ValorFormatado.Substring(0, 2);
                            cMes = ValorFormatado.Substring(2, 2);
                            cAno = ValorFormatado.Substring(4, 2);
                        }

                        ValorNatural = DateTime.Parse(cDia + "/" + cMes + "/" + cAno);
                        break;
                    }
                    case TTiposDadoEDI.ediDataMMAAAA___________:
                    {
                        var cDia = "01";
                        var cMes = "";
                        var cAno = "";
                        if (SeparadorDatas != null)
                        {
                            var split = ValorFormatado.Split(SeparadorDatas.ToCharArray());
                            cAno = split[1];
                            cMes = split[0];
                        }
                        else
                        {
                            cMes = ValorFormatado.Substring(0, 2);
                            cAno = ValorFormatado.Substring(2, 4);
                        }

                        ValorNatural = DateTime.Parse(cDia + "/" + cMes + "/" + cAno);
                        break;
                    }
                    case TTiposDadoEDI.ediDataMMDD_____________:
                    {
                        var cDia = "";
                        var cMes = "";
                        var cAno = "1900";
                        if (SeparadorDatas != null)
                        {
                            var split = ValorFormatado.Split(SeparadorDatas.ToCharArray());
                            cMes = split[0];
                            cDia = split[1];
                        }
                        else
                        {
                            cDia = ValorFormatado.Substring(2, 2);
                            cMes = ValorFormatado.Substring(0, 2);
                        }

                        ValorNatural = DateTime.Parse(cDia + "/" + cMes + "/" + cAno);
                        break;
                    }
                    case TTiposDadoEDI.ediHoraHHMM_____________:
                    {
                        var cHora = "";
                        var cMinuto = "";
                        if (SeparadorHora != null)
                        {
                            var split = ValorFormatado.Split(SeparadorHora.ToCharArray());
                            cHora = split[0];
                            cMinuto = split[1];
                        }
                        else
                        {
                            cHora = ValorFormatado.Substring(0, 2);
                            cMinuto = ValorFormatado.Substring(2, 2);
                        }

                        ValorNatural = DateTime.Parse(cHora + ":" + cMinuto + ":00");
                        break;
                    }
                    case TTiposDadoEDI.ediHoraHHMMSS___________:
                    {
                        var cHora = "";
                        var cMinuto = "";
                        var cSegundo = "";
                        if (SeparadorHora != null)
                        {
                            var split = ValorFormatado.Split(SeparadorHora.ToCharArray());
                            cHora = split[0];
                            cMinuto = split[1];
                            cSegundo = split[2];
                        }
                        else
                        {
                            cHora = ValorFormatado.Substring(0, 2);
                            cMinuto = ValorFormatado.Substring(2, 2);
                            cSegundo = ValorFormatado.Substring(4, 2);
                        }

                        ValorNatural = DateTime.Parse(cHora + ":" + cMinuto + ":00");
                        break;
                    }
                    case TTiposDadoEDI.ediDataDDMMAAAAWithZeros:
                    {
                        goto case TTiposDadoEDI.ediDataDDMMAAAA_________;
                    }
                    case TTiposDadoEDI.ediDataAAAAMMDDWithZeros:
                    {
                        goto case TTiposDadoEDI.ediDataAAAAMMDD_________;
                    }
                }
        }

        #endregion

        #region Métodos Privados e Protegidos

        #endregion
    }
}
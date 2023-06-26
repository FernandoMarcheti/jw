'use strict';

var nodemailer = require('nodemailer');
var fs = require('fs');
const folder = '/home/fernando/Documentos/sce/email/2021-05-3/'




// var pdfs = carregarPdfs();
// var clientes = carregarClientes();
let clientesComBoletos = carregarClientesComBoletos();

var mensagens = [];

clientesComBoletos.forEach(boletoObj => {

    var nomeArquivoPdf = '/home/fernando/Documentos/sce/email/2021-05-3/' + boletoObj.pdf;
    var titulo = 'Boleto Eletrônico – Pecorare & Associados Contabilidade S/S'
    var corpo = 'Boa tarde,\n\nAnexo ao presente e-mail, segue o BOLETO referente aos honorários do mês de Abril de 2021 em formato PDF, com vencimento para o dia 10.05.2021.\n\nDiversas empresas têm sido alvo de quadrilhas especializadas em fraudes bancárias cuja atuação consiste na adulteração de dados constantes nos boletos de pagamentos. A partir da adulteração criminosa os valores pagos não são creditados na conta corrente da empresa emissora, mas sim, numa conta corrente dos fraudadores. \n\nAo receber um boleto bancário, orienta-se que sejam verificados os dados impressos, entre eles: número do banco, se o número do código de barras corresponde ao da parte superior do respectivo boleto, CNPJ da empresa emissora, data de vencimento do título e a correspondência do valor cobrado em relação ao devido pelo sacado.\n\nEstas orientações são válidas tanto para os boletos recebidos fisicamente ou por e-mail.\n\nOutrossim, informamos que o escritório Pecorare & Associados Contabilidade S/S Ltda, trabalha exclusivamente com os bancos Sicoob – Credicitrus e Sicoob – Coopecredi para a emissão de boletos bancários referente cobrança de honorários.\n\nEm caso de BOLETO vencido, é necessário atualizá-lo no site do Banco SICOOB pelo link: https://www.sicoob.com.br/web/sicoob/segunda-via-boleto.\n\nAtenção: Em decorrência da pandemia ocasionada pelo COVID-19, orientamos que pague sua fatura via internet, evitando filas de banco e lotéricas para segurança de todos.\n\nCaso tenha dúvidas, por favor, entre em contato, estaremos sempre à disposição para melhor atendê-lo.\n\n*** Por favor, não responda este e-mail, pois é gerado automaticamente. Caso necessite falar conosco, utilize os canais de atendimento abaixo. ***\n\nAt.te.,\nDeives Rafael Gomes\nPecorare & Associados Contabilidade S/S Ltda.\ne-mail: juridico@pecorare.com.br\nSkype: deives.rafael.gomes\n16 3383 1919 / 16 3382 1423';
    var email = {
        from: 'cobranca@pecorare.com.br',
        to: boletoObj.email,
        subject: titulo,
        text: corpo, 
        attachments: [{ 
            filename: 'boleto.pdf', 
            path: nomeArquivoPdf
        }],

        // extra: {
        //         // email : mensagem.email,
        //         boletoObj : boletoObj,
        //         nomeArquivoPdfETxt : nomeArquivoPdfETxt
        // }
    };

    mensagens.push({email: email, boletoObj: boletoObj});
});

var transporte = nodemailer.createTransport({
    pool: true,
    // maxConnections: 50,
    // maxMessages : 500,
    host: 'smtp.u.inova.com.br',
    port: '587',
    secure: false,
    auth: {
        user: 'cobranca@pecorare.com.br', // Basta dizer qual o nosso usuário
        pass: 'Pecorare@550'             // e a senha da nossa conta
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log('inicio');

let count = 1;
transporte.on("idle", function () {
    setTimeout(()=> {

        
        while (transporte.isIdle() && mensagens.length) {
            transporte.sendMail(mensagens.shift().email, function(err, info){
                if(err) {
                    console.log('NÃO ENVIADO ' + count);
                } else {
                    console.log('ENVIADO ' + count);
                } 
                count++;
            });
        }
    }, 1000);
});


console.log('FIM');


// let teste = pdfs.map(a => { 
//     let index = a.indexOf('-');
//     return a.substring(index+2);
// })

// let count = 0;
// for (const pdf of pdfs) {
//     // console.log(pdf.toString());
//     for (const cliente of clientes) {
        
        
//         if (count == 200) return;
//         if(cliente.razaoSocial && cliente.email && pdf.toString().includes(cliente.razaoSocial.replace(/[^\w\s]/gi, ''))) {

//             cliente.pdf = pdf
//             console.log(cliente)
//             count++;
//         }


//     }

// }
// console.log(count)





function carregarPdfs() {
    let pdfs = [];
    fs.readdirSync(folder).forEach(file => {
            pdfs.push(file);
        });
    return pdfs;
}

function carregarClientes() {
    return [
        {
          "codigo": 932,
          "razaoSocial": "J C N INDÚSTRIA E COMÉRCIO LTDA.",
          "email": "cimag@cimag.agr.br",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 931,
          "razaoSocial": "JOVANI EMILIO PUREZA",
          "email": "jovanipureza@ig.com.br",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 930,
          "razaoSocial": "TRANSFÁTIMA LTDA.",
          "email": "trans_fatima@outlook.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 929,
          "razaoSocial": "G M TRANSPORTES MATÃO LTDA.",
          "email": "mi_geraldi@hotmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 928,
          "razaoSocial": "JOÃO BATISTA KFOURI",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "joaokfouri@uol.com.br"
        },
        {
          "codigo": 927,
          "razaoSocial": "GERRA STUDIO E EVENTOS LTDA.",
          "email": "gerra@gerra.com.br",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 925,
          "razaoSocial": "JOÃO APARECIDO ALVES",
          "email": "restaurantemallagueta@uol.com.br",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 924,
          "razaoSocial": "EVERSON JOSÉ BAZOTTI ZANI",
          "email": "universodacerveja@ig.com.br",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 923,
          "razaoSocial": "B D R CONSULTORIA EM GESTÃO EMPRESARIAL LTDA",
          "email": "bruno@mecpar.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 922,
          "razaoSocial": "TECHMODER COMÉRCIO DE MÁQUINAS LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "techmoder@gmail.com"
        },
        {
          "codigo": 921,
          "razaoSocial": "NATÁLIA MARIA ANTONIOSSI",
          "email": "dra.nataliaantoniossi@yahoo.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 920,
          "razaoSocial": "AGÊNCIA ARTEMIS PROPAGANDA E PUBLICIDADE LTDA. – ME",
          "email": "financeiro@agenciaartemis.com.br",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 919,
          "razaoSocial": "L.M. CLÍNICA ODONTOLÓGICA LTDA",
          "email": "odontoexmatao@gmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 918,
          "razaoSocial": "JOSEFINA VERGINIA TRALLI CORTEZI",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "multicar@gmail.com"
        },
        {
          "codigo": 917,
          "razaoSocial": "PÉRICO VIDROS LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "silvio.vidros@hotmail.com"
        },
        {
          "codigo": 916,
          "razaoSocial": "C.B.E.A TRANSPORTES E LOGÍSTICA LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "sandra@cbatransportes.com.br"
        },
        {
          "codigo": 915,
          "razaoSocial": "C.B.E.A TRANSPORTES E LOGÍSTICA LTDA.",
          "email": "sandra@cbatransportes.com.br",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 914,
          "razaoSocial": "RICARDO HENRIQUE VALENTIN",
          "email": "financeiro@rvservicos.net.br",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 913,
          "razaoSocial": "CLEIDE MARIA DA SILVA REIS",
          "email": "reis.pesca@hotmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 912,
          "razaoSocial": "DROGARIA JOÃO PAULO II NOVA EUROPA LTDA",
          "email": "atyne2762@gmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 911,
          "razaoSocial": "EMPORIUM COUNTRY MATÃO LTDA",
          "email": "renatohs84@gmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 910,
          "razaoSocial": "HOSAKI & HOSAKI LTDA",
          "email": "hosaki.hosaki@hotmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 909,
          "razaoSocial": "DROGARIA SÃO FRANCISCO DE DOBRADA LTDA",
          "email": "brunahosaki@gmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 908,
          "razaoSocial": "JOÃO VITOR PINHEIRO EIRELI",
          "email": "jvpenergiasolar@gmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 907,
          "razaoSocial": "GUERRA & GUERRA SOLUÇÕES AGRÍCOLAS LTDA",
          "email": "cassioguerra4@gmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 906,
          "razaoSocial": "VICENTINO TRANSPORTES LTDA",
          "email": "vicentino.marcelo99@hotmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 905,
          "razaoSocial": "CALIJURI BEBIDAS LTDA.",
          "email": "calijurifesta@hotmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 904,
          "razaoSocial": "BRAD MIX CONCRETO EIRELI",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "concreleme.financeiro@gmail.com"
        },
        {
          "codigo": 903,
          "razaoSocial": "CERVEJARIA PIPS N’ SHEEPS INDÚSTRIA E COMÉRCIO DE BEBIDAS LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "pipspecorare@gmail.com"
        },
        {
          "codigo": 902,
          "razaoSocial": "ASA MATÃO PROMOÇÃO DE VENDAS LTDA.",
          "email": "sergiomatao@sportsasa.com.br",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 901,
          "razaoSocial": "N & N ADMINISTRAÇÃO DE BENS PRÓPRIOS LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "cimag@cimag.agr.br"
        },
        {
          "codigo": 900,
          "razaoSocial": "JESUINO ORLANDINI JÚNIOR SOCIEDADE INDIVIDUAL DE ADVOCACIA",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "orlandini@orlandini.com.br"
        },
        {
          "codigo": 899,
          "razaoSocial": "V J S LABORATÓRIO DE PRÓTESE ODONTOLÓGICA LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "vanessacontasf@gmail.com"
        },
        {
          "codigo": 898,
          "razaoSocial": "HELO CONCRETO E LOCAÇÃO DE MÁQUINAS LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "concreleme.financeiro@gmail.com"
        },
        {
          "codigo": 896,
          "razaoSocial": "RODRIGO AUGUSTO RIBEIRO DE SOUZA – ME",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "rodrigoaugustorsouza@gmail.com"
        },
        {
          "codigo": 895,
          "razaoSocial": "ANTONIO FRANCISCO CASARI",
          "gerarBoleto": true,
          "email": "rtlubrificante@gmail.com",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 894,
          "razaoSocial": "LUMAR TECNOLOGIA DA INFORMAÇÃO EIRELI",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "marcelo@vanin.adv.br"
        },
        {
          "codigo": 893,
          "razaoSocial": "LAERTE LOURENÇON INDÚSTRIA E COMÉRCIO DE AUTO PEÇAS",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "sonia@lsl-ind.com.br"
        },
        {
          "codigo": 892,
          "razaoSocial": "MULTIPLA NEGOCIAL LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "multipla.negocial@hotmail.com"
        },
        {
          "codigo": 891,
          "razaoSocial": "MARCELO CARBONARO RODRIGUES",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "marcelo.rodrigues@palomax.com.br"
        },
        {
          "codigo": 890,
          "razaoSocial": "RS LUBRIFICANTES EIRELI",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "rslubrificantes@hotmail.com"
        },
        {
          "codigo": 889,
          "razaoSocial": "J. L. DA SILVA LIMPEZA DE ENTULHO",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "transterra@chulin.com.br"
        },
        {
          "codigo": 888,
          "razaoSocial": "INTEGRAMED MEDICINA DO TRABALHO LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "moabertaci@gmail.com"
        },
        {
          "codigo": 887,
          "razaoSocial": "E. C. M. MARGUTI CONSTRUÇÕES",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "juridico@pecorare.com.br"
        },
        {
          "codigo": 886,
          "razaoSocial": "THELLY PAOLO PIZZARIA LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "pietro2303@hotmail.com"
        },
        {
          "codigo": 885,
          "razaoSocial": "CONDOMÍNIO RESIDENCIAL EDIFÍCIO ROSINA",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "juridico@pecorare.com.br"
        },
        {
          "codigo": 884,
          "razaoSocial": "PUREZA E PUREZA GESTÃO EMPRESARIAL LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "jovanipureza@ig.com.br"
        },
        {
          "codigo": 883,
          "razaoSocial": "MARIA JOSÉ BERNICHI CUNHA – ME",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "juridico@pecorare.com.br"
        },
        {
          "codigo": 882,
          "razaoSocial": "CONDOMÍNIO EDIFICIO MATÃO",
          "gerarBoleto": false,
          "email": null,
          "envioBoleto": null
        },
        {
          "codigo": 881,
          "razaoSocial": "CLÍNICA UROLÓGICA MATONENSE EIRELI",
          "email": "clinimed.medicos@gmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 880,
          "razaoSocial": "GALLOTTI & MORAES SOCIEDADE DE ADVOGADAS",
          "email": "mariaaugustafortunatomoraes@gmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 879,
          "razaoSocial": "ANA FLÁVIA BOZELLI",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "aflavia.bozelli@gmail.com"
        },
        {
          "codigo": 878,
          "razaoSocial": "L S L INDÚSTRIA E COMÉRCIO DE AUTO PEÇAS EIRELI – EPP",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "sonia@lsl-ind.com.br"
        },
        {
          "codigo": 877,
          "razaoSocial": "L M DISTRIBUIDORA DE BEBIDAS E CONVENIÊNCIA LTDA.",
          "gerarBoleto": false,
          "email": null,
          "envioBoleto": null
        },
        {
          "codigo": 876,
          "razaoSocial": "AG COMÉRCIO DE FRUTAS LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "adenir.jsantos@hotmail.com"
        },
        {
          "codigo": 875,
          "razaoSocial": "POLETO & PEREZ COMÉRCIO DE TINTAS LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "contato@avenidatintasmatao.com.br"
        },
        {
          "codigo": 874,
          "razaoSocial": "SEBASTIÃO TOKUDIRO INONE INOUE – ME",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "juridico@pecorare.com.br"
        },
        {
          "codigo": 873,
          "razaoSocial": "WM CHOPERIA EIRELI – ME",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "wagnerpiloto77@icloud.com"
        },
        {
          "codigo": 872,
          "razaoSocial": "ALLAN DIEGO BEZERRA COSTA 36322961896",
          "gerarBoleto": false,
          "email": "adiferreira@outlook.com",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 871,
          "razaoSocial": "CLEBER APARECIDO PIRES – ME",
          "gerarBoleto": false,
          "email": null,
          "envioBoleto": null
        },
        {
          "codigo": 870,
          "razaoSocial": "EXPORTAGRO PROMOÇÃO DE VENDAS LTDA.",
          "gerarBoleto": false,
          "envioBoleto": "ambos",
          "email": "carlinhosantanna@gmail.com"
        },
        {
          "codigo": 869,
          "razaoSocial": "ASSOCIAÇÃO COPAÍBA",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "associacaocopaiba@hotmail.com"
        },
        {
          "codigo": 868,
          "razaoSocial": "ANDRÉ FERNANDES MAZI",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "cactushamburgueria@gmail.com"
        },
        {
          "codigo": 867,
          "razaoSocial": "AGÊNCIA ARTEMIS PROPAGANDA E PUBLICIDADE LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "financeiro@agenciaartemis.com.br"
        },
        {
          "codigo": 866,
          "razaoSocial": "GONÇALVES E ANDRADE CLÍNICA MÉDICA S/S",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "tati_unesp@hotmail.com"
        },
        {
          "codigo": 865,
          "razaoSocial": "MARCELO VANIN SOCIEDADE INDIVIDUAL DE ADVOCACIA",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "marcelo@vanin.adv.br"
        },
        {
          "codigo": 864,
          "razaoSocial": "ASSOCIAÇÃO DESPORTIVA MATONENSE - A D M",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "juridico@pecorare.com.br"
        },
        {
          "codigo": 863,
          "razaoSocial": "RS LUBRIFICANTES EIRELI – ME",
          "email": "rslubrificantes@hotmail.com",
          "gerarBoleto": true,
          "envioBoleto": "ambos"
        },
        {
          "codigo": 862,
          "razaoSocial": "MAX SOLLAR EIRELI – ME",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "edson@maxsollar.com.br"
        },
        {
          "codigo": 861,
          "razaoSocial": "LILIANE CRISTINA DOS SANTOS – ME",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "sandra@cbatransportes.com.br"
        },
        {
          "codigo": 860,
          "razaoSocial": "DROGARIA JOÃO PAULO II NOVA EUROPA LTDA.",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "atyne2762@gmail.com"
        },
        {
          "codigo": 859,
          "razaoSocial": "PIAZZA DI FIORI PIZZARIA MATÃO LTDA. - ME",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "pietro2303@hotmail.com"
        },
        {
          "codigo": 858,
          "razaoSocial": "AGÊNCIA MISSIONÁRIA DE PLANTAÇÃO DE IGREJAS E EVANGELISMO – AMPLIE",
          "email": "amplieparq@gmail.com",
          "gerarBoleto": false,
          "envioBoleto": null
        },
        {
          "codigo": 857,
          "razaoSocial": "ARCAL CIMENTO & CAL LTDA. – ME",
          "gerarBoleto": false,
          "email": null,
          "envioBoleto": null
        },
        {
          "codigo": 853,
          "razaoSocial": "M. H. DOS REIS PESCA",
          "gerarBoleto": true,
          "envioBoleto": "ambos",
          "email": "reis.pesca@hotmail.com"
        },
        {
          "codigo": 852,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ADRIANO CARLOS RODRIGUES PADARIA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 851,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": false,
          "razaoSocial": "C. R. DIAS MORENO DIGITALIZAÇÃO - ME",
          "envioBoleto": "fisico"
        },
        {
          "codigo": 850,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARIA FÁTIMA PEIXOTO DOS SANTOS 09894050875",
          "envioBoleto": null
        },
        {
          "codigo": 849,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "RF METAL PEÇAS LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 848,
          "email": "novaejo@hotmail.com",
          "gerarBoleto": false,
          "razaoSocial": "JOSÉ CARLOS NOVAES DA SILVA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 847,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "RICIERI MATURO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 846,
          "email": "ceterpmatao@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "LEONARDO SALANI JACOB",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 845,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CECCHETTO CLÍNICA MÉDICA LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 844,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LEZ STORE CONFECÇÕES LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 843,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MEGA ORION INDÚSTRIA METALÚRGICA LTDA. - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 842,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LEONARDO MARQUES 34338884851",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 841,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AGÊNCIA MISSIONÁRIA DE PLANTAÇÃO DE IGREJAS",
          "envioBoleto": null
        },
        {
          "codigo": 840,
          "email": "mariahelena@colorall.com.br",
          "gerarBoleto": true,
          "razaoSocial": "COLORALL BRA INDÚSTRIA DE CORANTES NATURAIS EIRELI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 839,
          "email": "concreleme.financeiro@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CONCRETO MATÃO LTDA. - EPP (Filial)",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 838,
          "email": "nfe.fmmangueira@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "PAULA APARECIDA DOS REIS JOHANSEN - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 837,
          "email": "cartoriostalucia@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "BEATRIZ ALVES PONCEANO NUNES",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 836,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ALTERNATIVA FRUTAS PRESTADORA DE SERVIÇOS EIRELI",
          "envioBoleto": null
        },
        {
          "codigo": 835,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CARLOS SIMÃO COURY CORRÊA",
          "envioBoleto": null
        },
        {
          "codigo": 834,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GEANE MARIA DE OLIVEIRA PEREIRA",
          "envioBoleto": null
        },
        {
          "codigo": 833,
          "email": "sandra@cbatransportes.com.br / sandra.transpar@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "LILIANE CRISTINA DOS SANTOS - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 832,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "WAGNER CARDOZO GOULARTE PEREIRA",
          "envioBoleto": null
        },
        {
          "codigo": 831,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JHONE LUIS DOS SANTOS PROMOÇÃO DE VENDAS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 830,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANTONIO MARCOS FERREIRA SOCIEDADE INDIVIDUAL DE AD",
          "envioBoleto": null
        },
        {
          "codigo": 829,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "RAFAEL HENRIQUE DA SILVA PROMOÇÃO DE VENDAS - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 828,
          "email": "paranapesca@yahoo.com.br",
          "gerarBoleto": true,
          "razaoSocial": "EDIVALDO DA SILVA BATISTA PROMOÇÃO DE VENDAS - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 827,
          "email": "silvio@onflag.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ONFLAG MARKETING DE RESULTADOS EIRELI - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 826,
          "email": "cleibe@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "A. C. SPORT INVEST LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 825,
          "email": "sonia@lsl-ind.com.br",
          "gerarBoleto": true,
          "razaoSocial": "VENOM INDÚSTRIA E COMÉRCIO DE AUTO PEÇAS EIRELI - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 824,
          "email": "wagnerpiloto77@icloud.com",
          "gerarBoleto": true,
          "razaoSocial": "PILOTO APOIO ADMINISTRATIVO EIRELI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 823,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "J. DOS SANTOS TINTAS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 822,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "HZA ELETRODOMÉSTICOS EIRELI - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 821,
          "email": "giovana.cortes@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "GARCIA & CORTES SOCIEDADE DE ADVOGADAS",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 820,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "I.T.M LOCAÇÃO INDUSTRIAL EIRELI - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 819,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TORRES TÍTULOS E CAPITALIZAÇÃO LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 818,
          "email": "torresleonedo29@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "LOPES PROMOÇÃO DE VENDAS E APOIO ADMINISTRATIVO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 817,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LEONEDO TEIXEIRA TORRES - ME",
          "envioBoleto": null
        },
        {
          "codigo": 816,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SUPERMERCADO CALIJURI LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 815,
          "email": "cristianogouveia@adv.oabsp.org.br",
          "gerarBoleto": true,
          "razaoSocial": "CRISTIANO R DE GOUVEIA SOCIEDADE IND DE ADVOCACIA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 814,
          "email": "torresleonedo29@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "SÔNIA LOPES STELA TORRES",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 813,
          "email": "concreleme.financeiro@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CONCRETO MATÃO LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 812,
          "email": "victorjbsantos@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "BARBOSA SANTOS CLÍNICA MÉDICA EIRELI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 811,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LESSA FABIANA CHIOZZINI CORRETORA DE SEGUROS",
          "envioBoleto": null
        },
        {
          "codigo": 810,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DANIEL LEITE FERREIRA JÚNIOR - ME",
          "envioBoleto": null
        },
        {
          "codigo": 809,
          "email": "drcharlesmatao@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CHARLES ALEXANDRE DE ALMEIDA JÚNIOR",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 808,
          "email": "santos.maarlon012@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "M. P. DOS SANTOS VESTUÁRIO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 807,
          "email": "thaispastori@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "THAIS PASTORI - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 806,
          "email": "sueli@orthocamp.com.br",
          "gerarBoleto": true,
          "razaoSocial": "G & C COMÉRCIO DE PRODUTOS ODONTOLÓGICOS EIRELI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 805,
          "email": "veraestevespg@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "VERA LÚCIA RODRIGUES ESTEVES",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 804,
          "email": "dap2013@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "DANIEL PAULO DAGUANO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 803,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JW COMÉRCIO DE BEBIDAS LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 801,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ADIFLEX BR EIRELI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 800,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANTONIO SÉRGIO ANTONIOSSI",
          "envioBoleto": null
        },
        {
          "codigo": 799,
          "email": "rslubrificantes@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "EMPROLUB – EMPRESA PRODUTORA DE LUBRIFICANTES EIRELI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 798,
          "email": "elenwendys@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "ELEN WENDY DA SILVA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 797,
          "email": "pietro2303@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "PAOLO SILVA APOIO ADMINISTRATIVO LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 796,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FLÁVIO BORDIGNON - ME",
          "envioBoleto": "fisico"
        },
        {
          "codigo": 795,
          "email": "katiareolon@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "P & F MULTIPLA NEGOCIAL LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 794,
          "email": "gerencia@toquesport.com.br",
          "gerarBoleto": true,
          "razaoSocial": "MARIANA ANTONIOSSI CONFECÇÕES - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 793,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARCELO AUGUSTO DUARTE TEIXEIRA",
          "envioBoleto": null
        },
        {
          "codigo": 792,
          "email": "mellmichelon@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "MICHELON SOCIEDADE DE ADVOGADOS",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 791,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PATRÍCIA MICHELI GOMES - ME",
          "envioBoleto": null
        },
        {
          "codigo": 790,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "R L APOIO ADMINISTRATIVO LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 789,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ADRIANO JOSÉ SGORLON 26378352810",
          "envioBoleto": null
        },
        {
          "codigo": 788,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MEDICAL VET - CLÍNICA MÉDICA VETERINÁRIA - SCP",
          "envioBoleto": null
        },
        {
          "codigo": 787,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MÁXIMA ESPAÇO GOURMET RIBEIRÃO PRETO LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 786,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DARCI FERREIRA PROENÇA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 785,
          "email": "flavio_lizeo@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "ASSOCIAÇÃO MATONENSE DE PAIS E AMIGOS DO BASQUETE",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 784,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "INEIDE WANY BERNARDI HASSELAAR",
          "envioBoleto": null
        },
        {
          "codigo": 783,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CROM INDÚSTRIA E COMÉRCIO EIRELI - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 782,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VALDIR PAULO DA SILVA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 781,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ISOTÉRMICA",
          "envioBoleto": null
        },
        {
          "codigo": 780,
          "email": "lpfarmaceutica@lpfarmaceutica.com.br",
          "gerarBoleto": false,
          "razaoSocial": "LP FARMACÊUTICA LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 779,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LFZ COMUNICAÇÃO LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 778,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TRIB IMPLEMENTOS AGRÍCOLAS LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 777,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AGER AGRICULTURE MÁQ. E IMPLTOS. AGRÍCOLA EIRELI",
          "envioBoleto": null
        },
        {
          "codigo": 776,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MEGA ORION INDÚSTRIA METALÚRGICA EIRELI - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 775,
          "email": "marcelocordoa@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CORDOA & CALIGHER DISTRIBUIDORA LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 774,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CAMILA SÁ HIRATSUKA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 773,
          "email": "andreagaedke18@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "EBITI - EMPRESA BRASILEIRA DE ISOLAÇÃO TÉRMICA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 772,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARCELO MOTA COUTO EIRELI",
          "envioBoleto": null
        },
        {
          "codigo": 771,
          "email": "financeiro@rvservicos.net.br",
          "gerarBoleto": true,
          "razaoSocial": "RV PORTARIAS E LIMPEZAS EIRELI. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 770,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VINI IMPORTAÇÃO E EXPORTAÇÃO DE ALIMENTOS LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 769,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARINA RISTOW",
          "envioBoleto": null
        },
        {
          "codigo": 768,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "OFFICINA DA SAÚDE LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 767,
          "email": "falcaiautopecas@yahoo.com.br",
          "gerarBoleto": true,
          "razaoSocial": "AUTO PEÇAS E MECÂNICA BARSAGLINI LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 766,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "OLDER LUIZ NICOLUCCI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 765,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "A C R NUNES CARRETAS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 764,
          "email": "financeiro@elite.com.br",
          "gerarBoleto": true,
          "razaoSocial": "OUTLETS FACTORY ELITE EIRELI - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 763,
          "email": "sebastiao_gledson82@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "SEBASTIÃO GLEDISON DOS REIS - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 762,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "COIFAS RIBEIRÃO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 761,
          "email": "cimag@cimag.agr.br",
          "gerarBoleto": true,
          "razaoSocial": "GLOBAL INDÚSTRIA DE PEÇAS AGRÍCOLAS LTDA ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 760,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MEDICAL VET-CLÍNICA MÉDICA VETERINÁRIA EIRELI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 759,
          "email": "cidofutura@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "BAZAR GARDINI LTDA - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 758,
          "email": "cidofutura@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "AG PAPELARIA LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 757,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": false,
          "razaoSocial": "ALMIR REYNALDO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 756,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "RUBENS MAZZETTI JUNIOR - ME",
          "envioBoleto": null
        },
        {
          "codigo": 755,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARCELO RICARDO LUZIA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 754,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARIA EUGÊNIA GANDINI PANEGOSSI DOS SANTOS",
          "envioBoleto": null
        },
        {
          "codigo": 753,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "THIAGO AUGUSTO DOS SANTOS",
          "envioBoleto": null
        },
        {
          "codigo": 752,
          "email": "cristiano@transcape.com.br",
          "gerarBoleto": true,
          "razaoSocial": "HEXA TRANSPORTE & LOCAÇÃO LTDA - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 751,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FACTORY OUTLETS EIRELI - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 750,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LEVPEL INDª E COMº DE PAPÉIS, PRODUTOS DE HIGIENE",
          "envioBoleto": null
        },
        {
          "codigo": 749,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "R&J BUSINESS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 748,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FERNANDA APARECIDA DE CAMPOS GARDINI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 747,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ROBSON ROBERTO FERREIRA 37863409861",
          "envioBoleto": null
        },
        {
          "codigo": 746,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MÁRCIA APARECIDA PICHI BARBOZA 06003420855",
          "envioBoleto": null
        },
        {
          "codigo": 745,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "REGINA CELIA FERRARI REGUERO",
          "envioBoleto": null
        },
        {
          "codigo": 744,
          "email": "apae.matao@apaematao.org.br",
          "gerarBoleto": true,
          "razaoSocial": "ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS DE MATÃO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 743,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GIANA BALDAN AQUINO",
          "envioBoleto": null
        },
        {
          "codigo": 742,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JOÃO CUSTÓDIO DE OLIVEIRA TRANSPORTE DE CARGAS-ME",
          "envioBoleto": null
        },
        {
          "codigo": 741,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "EZEQUIEL FELIX PEREIRA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 740,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FB SOLDAS DE PRECISÃO EIRELI - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 739,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MULTIPLA NEGOCIAL LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 738,
          "email": "modertechmatao@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "MODERTECH ASSISTÊNCIA TÉCNICA CNC LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 737,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TAMANINI LOCAÇÃO E SERVIÇOS EIRELI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 736,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SILVA & CAXA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 735,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JULIANA DE ALMEIDA MARTINS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 734,
          "email": "fabriciosanas@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "FABRÍCIO ALEXANDRE SANAS - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 733,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FERNANDA APARECIDA DE CAMPOS GARDINI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 732,
          "email": "juniorgardini@jwgrupo.com.br",
          "gerarBoleto": true,
          "razaoSocial": "JW PRESTAÇÃO DE SERVIÇOS LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 731,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "IMOBILIÁRIA CUSINATO LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 730,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PONS INDÚSTRIA METALÚRGICA LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 729,
          "email": "financeiro@cardimix.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CARDIMIX CONCRETO & REBOCO EIRELI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 728,
          "email": "financeiro@cardimix.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CARDIMIX COMº DE MATERIAIS DE CONSTRUÇÃO EIRELI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 727,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ULTRAFAST COMÉRCIO DE GÁS LTDA. - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 726,
          "email": "ferreira_marcel@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "MMF CONSULTORIA E ASSESSORIA EMPRESARIAL LTDA.-ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 725,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SANDRA ANDREIA DOS SANTOS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 724,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SANDRA  ANDREIA DOS SANTOS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 723,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "NORMA LOURDES DA SILVA 13878210833",
          "envioBoleto": null
        },
        {
          "codigo": 722,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CAFÉ & LANCHONETE VOVÓ TERESA LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 721,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "COIFAS SÃO CARLOS LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 720,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "BRANCO PERES CITRUS LTDA. - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 719,
          "email": "lxpecorari@yahoo.com",
          "gerarBoleto": true,
          "razaoSocial": "LUIZ ANTONIO PECORARE XAVIER - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 718,
          "email": "cimag@cimag.agr.br",
          "gerarBoleto": true,
          "razaoSocial": "J.L. DIAS IMPLEMENTOS AGRÍCOLAS LTDA - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 717,
          "email": "rothobras@rothobras.com.br",
          "gerarBoleto": false,
          "razaoSocial": "BARROS INDÚSTRIA DE ROTOMOLDAGEM EIRELI",
          "envioBoleto": null
        },
        {
          "codigo": 716,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "MARTINELI & MARTINELI MATÃO LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 715,
          "email": "clinicagraziosi@outlook.com",
          "gerarBoleto": true,
          "razaoSocial": "CLÍNICA MÉDICA CRIS GRAZIOSI S/S",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 714,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LOJA CADIOLI LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 713,
          "email": "ovidsan@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "SANTOS & GODOY PRESTAÇÃO DE SERVIÇOS LTDA. – ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 712,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FACILE IMPORTADORA E EXPORTADORA LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 711,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CROM INDÚSTRIA E COMÉRCIO EIRELI - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 710,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PAPER SOLUTION COMº E BENEFICIAMENTO DE PAPEL LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 709,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ADALBERTO DOS SANTOS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 708,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FERNANDO FELIPE ROSSI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 707,
          "email": "marcosberetellaimports@hotmail.com",
          "gerarBoleto": false,
          "razaoSocial": "MARCOS HENRIQUE BERETELLA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 706,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CARLOS TEIXEIRA DE JESUS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 705,
          "email": "vanessa@arnaldolimaadvogados.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ARNALDO LIMA - ADVOGADOS ASSOCIADOS",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 704,
          "email": "alvaro@njembalagens.com.br",
          "gerarBoleto": true,
          "razaoSocial": "NJ - REPRESENTAÇÕES DE ARTIGOS DE PAPEIS LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 703,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARCIEL DIEGO PORTOLANI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 702,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TRANSGAVI TRANSPORTE LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 701,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GRÁFICA EXATA IMPRESSOS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 700,
          "email": "katia@ciamatonense.com.br",
          "gerarBoleto": true,
          "razaoSocial": "BRANCO PERES AMBIENTAL LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 699,
          "email": "dri.galera@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "ADRIANA GALERA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 698,
          "email": "cleibe@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CLEIBE NICÁCIO DA SILVA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 697,
          "email": "bruini@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "GERALDO JOSÉ BRUINI - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 696,
          "email": "renato.spedo@predilecta.com.br",
          "gerarBoleto": true,
          "razaoSocial": "RENATO REINALDO SPEDO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 695,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JOÃO GOMES DO NASCIMENTO APOIO ADMINISTRATIVO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 694,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CÁSSIA REGINA CHIARENTIN DE OLIVEIRA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 693,
          "email": "associacaocopaiba@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "INCORPORADORA CUSINATO LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 692,
          "email": "silvana.rainha.pratezi@gmail.com",
          "gerarBoleto": false,
          "razaoSocial": "SILVANA  APARECIDA RAINHA PRATEZI - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 691,
          "email": "jacobbar.jacob@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "JACOB RESTAURANTE EIRELI - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 690,
          "email": "ronaldobussola1@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "BUSSOLA VEÍCULOS EIRELI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 689,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FACTORY OUTLETS EIRELI - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 688,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FACTORY OUTLETS EIRELI - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 687,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GUILHERME CESAR BANDELI",
          "envioBoleto": null
        },
        {
          "codigo": 686,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PEGASUS MOTUCA CONFECÇÕES LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 685,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MEIDSON ABRANCHES RENHE",
          "envioBoleto": null
        },
        {
          "codigo": 684,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ALPHABIO-CONSULTORIA E PROJ EM CIÊNCIAS BIOLÓGICAS",
          "envioBoleto": null
        },
        {
          "codigo": 683,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DE SANTI APOIO ADMINISTRATIVO LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 682,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AMANDA CRISTINA COMELLI DROGARIA",
          "envioBoleto": null
        },
        {
          "codigo": 681,
          "email": "luizcomelli@terra.com.br",
          "gerarBoleto": true,
          "razaoSocial": "KATHLEN MEYRE COMELLI DROGARIA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 680,
          "email": "fabiano@predilecta.com.br",
          "gerarBoleto": true,
          "razaoSocial": "PRANDI APOIO ADMINISTRATIVO LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 679,
          "email": "calijurifesta@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CALIJURI BEBIDAS LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 678,
          "email": "ceterpmatao@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "LC ENGENHARIA, CONSULTORIA E ASSESSORIA LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 677,
          "email": "financeiro@elite.com.br",
          "gerarBoleto": true,
          "razaoSocial": "OUTLET CONFECÇÕES ELITE LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 676,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SÉRGIO LUIZ REINA - ME",
          "envioBoleto": "fisico"
        },
        {
          "codigo": 675,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JOSIMARA MENEGHESSO FERREIRA GOMES - ME",
          "envioBoleto": null
        },
        {
          "codigo": 674,
          "email": "clinicaunivet@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "PEDRO HENRIQUE DAVASSI GABRIEL",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 673,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "IGNÁCIO & GOBETE LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 672,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "COPRES MATERIAIS ELÉTRICOS EIRELI - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 671,
          "email": "silvana.rainha.pratezi@gmail.com",
          "gerarBoleto": false,
          "razaoSocial": "MBX LTDA. - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 670,
          "email": "financeiro@rvservicos.net.br",
          "gerarBoleto": true,
          "razaoSocial": "RV SERVIÇOS MATÃO LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 669,
          "email": "celia.cardozo@mecpar.com",
          "gerarBoleto": true,
          "razaoSocial": "DI IORIO BRAGA & PORTO CONSULTORIA LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 668,
          "email": "financeiro@elite.com.br",
          "gerarBoleto": true,
          "razaoSocial": "EVOLUTION CONSULTORIA LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 667,
          "email": "rslubrificantes@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "RS LUBRIFICANTES EIRELI - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 666,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TRANSCAPE MATÃO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 665,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VERCESI LEME CONFECÇÕES LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 664,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LAFER IMPORTAÇÃO E EXPORTAÇÃO DE ALIMENTOS LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 663,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CITRUS NOROESTE COMÉRCIO DE FRUTAS LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 662,
          "email": "financeiro@frutarabrasil.com.br",
          "gerarBoleto": true,
          "razaoSocial": "FRUTARA BRASIL INDÚSTRIA E COMÉRCIO LTDA. - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 661,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SOMAR BR IMPORT. E EXPORT. DE ARTIGOS ESCOLARES",
          "envioBoleto": null
        },
        {
          "codigo": 660,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "WR CONCRETO PRÉ-MISTURADO LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 659,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "EDES QUARESIMA FUNILARIA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 658,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ADRIANA APARECIDA SCHIABELI ROSA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 657,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "SALVADOR BARSAGLINI NETO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 656,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANDRÉ FERNANDO MATSUMOTO 30467684863",
          "envioBoleto": null
        },
        {
          "codigo": 655,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VINI IMPORTAÇÃO E EXPORTAÇÃO DE ALIMENTOS LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 654,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "OSIEL VALVERDE - ME",
          "envioBoleto": null
        },
        {
          "codigo": 653,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ZENAIDE DE SOUZA CONFECÇÕES - ME",
          "envioBoleto": null
        },
        {
          "codigo": 652,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JORGE AURÉLIO CAOS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 651,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARCELO HENRIQUE CADIOLI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 650,
          "email": "runningforlife@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CARLA CRISTINA MARTINS JOB - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 649,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CONSTRUTORA AREMA LTDA. - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 648,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "",
          "envioBoleto": null
        },
        {
          "codigo": 647,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MAGNON MAX PORTOLANI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 646,
          "email": "afonsoinformatica@globomail.com",
          "gerarBoleto": true,
          "razaoSocial": "MARIELI CRISTINA DA SILVA SANTOS - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 645,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MCG - SERRALHERIA LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 644,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PICCHI COMÉRCIO DE PEÇAS PARA REFRIGERAÇÃO LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 643,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MATÃO COIFAS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 642,
          "email": "fatratores@ig.com.br",
          "gerarBoleto": true,
          "razaoSocial": "B M TRATORES LTDA - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 641,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARIA JOSÉ SPILLA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 640,
          "email": "universodacerveja@ig.com.br",
          "gerarBoleto": true,
          "razaoSocial": "UNIVERSO DA CERVEJA LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 639,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "RR EMPREENDIMENTOS IMOBILIÁRIOS & REPRESENTAÇÕES",
          "envioBoleto": null
        },
        {
          "codigo": 638,
          "email": "lcbsilva25@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "MÁRCIA FRASSOM DA SILVA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 637,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ALBANO ANTONIO GIANNINI - SÍTIO BELO",
          "envioBoleto": null
        },
        {
          "codigo": 636,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "RR IMPORTAÇÃO E EXPORTAÇÃO DE PLÁSTICOS EM GERAL",
          "envioBoleto": null
        },
        {
          "codigo": 635,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "G L MERCEARIA, PADARIA E CONFEITARIA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 634,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SILVA CONSULTORIA, ASSESSORIA E ENGENHARIA LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 633,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LEEN AUTO POSTO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 632,
          "email": "camilaminelo@bol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "MARIA AMÉLIA GANDINI - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 631,
          "email": "moabertaci@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "B STRATEGY TECNOLOGIA E CONSULTORIA EMPRESARIAL EIRELI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 630,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MRGM COMÉRCIO DE TINTAS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 629,
          "email": "polegato.jorge@terra.com.br",
          "gerarBoleto": true,
          "razaoSocial": "JORGE LUIZ POLEGATO JÚNIOR ATACADO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 628,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANTONIOSI & ANTONIOSI MÓVEIS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 627,
          "email": "eletricasabia@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ELÉTRICA SABIÁ LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 626,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MÁRIO BRANCO PERES",
          "envioBoleto": null
        },
        {
          "codigo": 625,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MÁRIO BRANCO PERES",
          "envioBoleto": null
        },
        {
          "codigo": 624,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FERNANDO TOMAZINI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 623,
          "email": "multipla.negocial@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "MULTIPLA NEGOCIAL LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 622,
          "email": "carimbosmatao@bol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CARIMBOS MATÃO LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 621,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MÁRIO BRANCO PERES",
          "envioBoleto": null
        },
        {
          "codigo": 620,
          "email": "katia@ciamatonense.com.br",
          "gerarBoleto": true,
          "razaoSocial": "M B P COMÉRCIO E IMPORTAÇÃO LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 619,
          "email": "financeiro@elite.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CONFECÇÕES ELITE LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 618,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ASSOC DE PAIS E MEST. DA EMEF PROF HELENA BORSETTI",
          "envioBoleto": null
        },
        {
          "codigo": 617,
          "email": "mac.marciosantos@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "GRANDE LOJA MAÇÔNICA MISTA DO BRASIL",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 616,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "BRUNO RODRIGUES DA SILVA REPRESENTAÇÃO",
          "envioBoleto": null
        },
        {
          "codigo": 615,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MRC REPRESENTAÇÃO COMERCIAL S/S LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 614,
          "email": "ceterpmatao@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "SALANI E JACOB EMPREENDIMENTOS LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 613,
          "email": "cintia.podio@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CINTIA DE SOUZA FERNANDES - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 612,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "WILLIAN RONIE CARUZO REPRESENTAÇÕES",
          "envioBoleto": null
        },
        {
          "codigo": 611,
          "email": "viniciusthg@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "THOMÉ TRANSPORTES E MECANIZAÇÃO AGRÍCOLA LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 610,
          "email": "mariana.pin@brancoperes.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ULYSSES RODRIGUES SOCIEDADE INDIVIDUAL DE ADVOCACIA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 609,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ARNALDO GÁS MATÃO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 608,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FRANCISCO PEREIRA ALVES DE CAMPOS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 607,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "APARECIDO DE ANUNZIO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 606,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LUZIA DUARTE COSTA DA SILVA SORVETERIA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 605,
          "email": "duarte.cs.luzia@gmail.com",
          "gerarBoleto": false,
          "razaoSocial": "APARECIDO PINTO DA SILVA SORVETERIA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 604,
          "email": "gerencia@toquesport.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CONFECÇÕES TOQUE SPORT LTDA - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 603,
          "email": "rothobras@rothobras.com.br",
          "gerarBoleto": false,
          "razaoSocial": "BARROS INDÚSTRIA DE ROTOMOLDAGEM EIRELI",
          "envioBoleto": null
        },
        {
          "codigo": 602,
          "email": "cocmatao@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "RMX PARTICIPAÇÕES LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 601,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ELLEN CRISTINA RICCI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 600,
          "email": "eliceumartinspio@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "OLGA NOIVAS LOCAÇÃO DE TRAJES E VEÍCULOS LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 599,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LUIZ HENRIQUE FIGUEIRA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 598,
          "email": "masselma@yahoo.com.br",
          "gerarBoleto": false,
          "razaoSocial": "LEANDRO ROSSLER DARIS - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 597,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CEFE - CENTRO DE FISIOTERAPIA E ESTÉTICA S/S",
          "envioBoleto": null
        },
        {
          "codigo": 596,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JHONY SARAIVA PENA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 595,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "KATIA REGINA CALABRES NUNES - ME",
          "envioBoleto": null
        },
        {
          "codigo": 594,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JÚNIOR RODRIGUES GARDINI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 593,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "A & C TREINAMENTO EM CONTROLE DE QUALIDADE LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 592,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DIVINO ROBERTO GOMES DE MORAES",
          "envioBoleto": null
        },
        {
          "codigo": 591,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AZ BRASIL ASSESSORIA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 590,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "F. P. CHAVES - CONFECÇÕES - ME \"FILIAL\"\"\"",
          "envioBoleto": null
        },
        {
          "codigo": 589,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "F. P. CHAVES - CONFECÇÕES - ME \"MATRIZ\"\"\"",
          "envioBoleto": null
        },
        {
          "codigo": 588,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VIPROT INDÚSTRIA E COMÉRCIO LTDA. - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 587,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "HORIAM SERVIÇOS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 586,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AGROMAX COMERCIO DE FERTILIZANTES FOLHARES LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 585,
          "email": "rob.laranjeira@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "R L APOIO ADMINISTRATIVO LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 584,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CAFÉ & CIA 21 LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 583,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "COOP DE ECO E CRED MUT DOS EMP DA MAUSER DO BRASIL",
          "envioBoleto": null
        },
        {
          "codigo": 582,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VERA LUCIA PORTRONIERI PIVA COPIADORAS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 581,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TOMAZ E TOMAZ APOIO ADMINISTRATIVO MATÃO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 580,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "MARTHA JANETE FERNANDES PEDROSO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 579,
          "email": "alexandregermanome@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "ALEXANDRE GERMANO DOS SANTOS  - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 578,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DUCAR TRANSPORTES MATÃO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 577,
          "email": "at_asonuma@yahoo.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ANA TEREZA TIEKO ASONUMA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 576,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DAN ARTEFATOS DE MADEIRA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 575,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "OSETE & CASTRO LANCHONETE LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 574,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MAGRO & VERONEZ LANCHONETE LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 573,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "EVANDRO JULIO DOS SANTOS INFORMATICA",
          "envioBoleto": null
        },
        {
          "codigo": 572,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TRANSPAR TRANSPORTE E LOGISTICA DE MATÃO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 571,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PATRICIA RODRIGUES DA SILVA PADARIA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 570,
          "email": "nfe.fmmangueira@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "FM MATAO MANGUEIRAS HIDRAULICAS LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 569,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CAMSHAFT’S COMÉRCIO DE AUTO PEÇAS LTDA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 568,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FABIO DA SILVA GARDINI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 567,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PAULO SERGIO MARTINS DE CAMPOS",
          "envioBoleto": null
        },
        {
          "codigo": 566,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CITRUS ALIANÇA COMÉRCIO DE FRUTAS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 565,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MIGUEL E PAGLIUSO REPRESENTACOES LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 564,
          "email": "faria@sorema.com.br",
          "gerarBoleto": true,
          "razaoSocial": "SOCIEDADE RECREATIVA MATONENSE",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 563,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AUTO POSTO PORUNGA LTDA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 562,
          "email": "juninho.manzi@outlook.com",
          "gerarBoleto": true,
          "razaoSocial": "DANILO MANZI JÚNIOR REPRESENTAÇÕES",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 561,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PERISSE E OLIVEIRA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 560,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "EMILIA BOCCHI MONAZZI",
          "envioBoleto": null
        },
        {
          "codigo": 559,
          "email": "jcandrade6148@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "IZAANI SARAIVA PENA DE ANDRADE - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 558,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JUVENAL ANTUNES FRANÇA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 557,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TRIOCOR TINTAS E VERNIZES LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 556,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "COPRES COMERCIAL LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 555,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "NELSON ROGERIO CAZAO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 554,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ACOUGUE E MERCEARIA GONCALVES MATAO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 553,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "C.G.D. INDUSTRIA E COMERCIO DE AUTO PECAS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 552,
          "email": "licampi@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ELIANA CRISTINA CAMPI RICCI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 551,
          "email": "sergio@espacomatao.com.br",
          "gerarBoleto": true,
          "razaoSocial": "PINOTTI E FLORIANO LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 550,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ELIANE CRISTINA ANTUNES MATAO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 549,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ARABELA RODRIGUES DA SILVA",
          "envioBoleto": null
        },
        {
          "codigo": 548,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CONSTRUTORA CUSINATO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 547,
          "email": "minas.sabor@terra.com.br",
          "gerarBoleto": true,
          "razaoSocial": "MINAS SABOR INDÚSTRIA E COMERCIO DE ALIMENTOS LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 546,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JORGE ANDRE MARQUES DE SOUZA RUSSOMANO",
          "envioBoleto": null
        },
        {
          "codigo": 545,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MUNDIAL VEICULOS MATAO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 544,
          "email": "gisadotti@ig.com.br",
          "gerarBoleto": true,
          "razaoSocial": "DOTTI & ALMEIDA RESTAURANTE LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 543,
          "email": "pjcalixto@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "SOUZA E SOUZA LOCACAO E TERRAPLENAGEM LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 542,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PALACIO DO SOM E ACESSORIOS LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 541,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "J. M. TRANSPORTES E LOGISTICA MATÃO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 540,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SANDRA REGINA PIVA COPIADORAS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 539,
          "email": "espacofest.buffet@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "ESPAÇO FEST BUFFET E EVENTOS LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 538,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "",
          "envioBoleto": null
        },
        {
          "codigo": 537,
          "email": "transterra@chulin.com.br",
          "gerarBoleto": true,
          "razaoSocial": "LIG-LIMPE E CATA ENTULHO MATÃO COM E LOC LTDA  EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 536,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JANDIR JOSE EMILIO JUNIOR REPRESENTACOES",
          "envioBoleto": null
        },
        {
          "codigo": 535,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "NORIVAL ANGELO BORDIGNON",
          "envioBoleto": null
        },
        {
          "codigo": 534,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SEFISIO - SERVICO ESP. DE FISIOTERAPIA E ERGONOMIA",
          "envioBoleto": null
        },
        {
          "codigo": 533,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ALTERNATIVA MODA INTIMA LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 532,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JOSE LUIZ MANCHINI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 531,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JOSE LUIZ MANCHINI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 530,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DENTAL ALVES COMÉRCIO DE PRODUTOS ODONTOLOGICOS",
          "envioBoleto": null
        },
        {
          "codigo": 529,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MINIMERCADO COSTA & COSTA MATÃO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 528,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CLAUDEMIRA MARIA DE ALMEIDA SOUZA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 527,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TRANSPORTADORA TRANSVS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 526,
          "email": "sueli@orthocamp.com.br",
          "gerarBoleto": true,
          "razaoSocial": "DENTAL MATÃO COM° DE EQUIPTOS ODONT. EIRELI - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 525,
          "email": "katia@ciamatonense.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CMS - COMPANHIA MATONENSE DE SANEAMENTO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 524,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SILVIA HELENA PETINATTI SANCHES - ME",
          "envioBoleto": null
        },
        {
          "codigo": 523,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ARLINDO DONIZETE PERSIGHINI MATÃO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 522,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANGELA MARIA APPOLONI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 521,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SUELI APARECIDA MORAES RAMOS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 520,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AMINOM CONSTRUTORA LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 519,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PAULO FERREIRA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 518,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LUCIANA BATISTA RIZZI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 517,
          "email": "dejadaguano@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "DIEGO ANTONIO DAGUANO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 516,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MB-TEC MONTAGENS INDUSTRIAIS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 515,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "RAFAEL BEVILLACQUA QUARESMA",
          "envioBoleto": null
        },
        {
          "codigo": 514,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AMARAL-CONS. AVALIACOES E PERICIAS AGRONOMICAS S/S",
          "envioBoleto": null
        },
        {
          "codigo": 513,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ELMA ELENA MORTARI COSTA PIZZARIA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 512,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MULT-PLAN SERVIÇOS INTEGRADOS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 511,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "BRUNO RAFAEL MANZI REPRESENTACOES",
          "envioBoleto": null
        },
        {
          "codigo": 510,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VALDECIR MARCOLINO FEITOZA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 509,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANTONIO MARCOS DE OLIVEIRA MATERIAIS DE CONSTRUÇÃO",
          "envioBoleto": null
        },
        {
          "codigo": 508,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JOSE CARLOS TROLESI",
          "envioBoleto": null
        },
        {
          "codigo": 507,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "F. D COMERCIO DE GASES INDUSTRIAIS LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 506,
          "email": "cimag@cimag.agr.br",
          "gerarBoleto": true,
          "razaoSocial": "J.L. DIAS IMPLEMENTOS AGRICOLAS LTDA. - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 505,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CONSTRUTORA L B LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 504,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MOORES & VISCARDI REPRESENTAÇÕES LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 503,
          "email": "kilomania.jaboticabal@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "JOVILSON CARDOSO SILVA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 502,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ALMALA COMERCIO E SERVICOS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 501,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DANIEL ROBERTO FERREIRA",
          "envioBoleto": null
        },
        {
          "codigo": 500,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VALDINEIA APARECIDA VICENTE - ME",
          "envioBoleto": null
        },
        {
          "codigo": 499,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PAULO ROBERTO FERREIRA FILHO",
          "envioBoleto": null
        },
        {
          "codigo": 498,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "APARECIDA GONCALVES DE SIQUEIRA GOES - ME",
          "envioBoleto": null
        },
        {
          "codigo": 497,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VICTOR DOS SANTOS & SANTOS COM. DE BORRACHA LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 496,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "M R EDUCACIONAL S/C LTDA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 495,
          "email": "laemcasamatao@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CUTTI & OTRENTI RESTAURANTE LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 494,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GERALDINI E SABAT S/S LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 493,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JULIANA DE ANDRADE SILVA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 492,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "BOTELHO VEICULOS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 491,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARACATU MATAO INSTALACOES E MANUTENCOES ELETRICAS",
          "envioBoleto": null
        },
        {
          "codigo": 490,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DROGARIA SAO LOURENCO DO TURVO LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 489,
          "email": "caetaanno@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "PEDRO CAETANO REPRESENTACOES",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 488,
          "email": "tadiotti@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CINEMATOGRÁFICA TADIOTTI LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 487,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VICENTE MANTOVANELI MANTEGA MATAO ME",
          "envioBoleto": null
        },
        {
          "codigo": 486,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CENTRO DE EDUCACAO INTEGRAL DE MATAO S/S LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 485,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "B.C. MOLON REPRESENTAÇOES S/S LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 484,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CASA DOS PARAFUSOS E EQUIPTOS. INDS. LTDA - FILIAL",
          "envioBoleto": null
        },
        {
          "codigo": 483,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ASSOCIACAO PAO DA VIDA",
          "envioBoleto": null
        },
        {
          "codigo": 482,
          "email": "carolineramos18@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "ESPAÇO FEST BUFFET E EVENTOS LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 481,
          "email": "jmlfernanda@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "PAPELARIA CASA GRANDE DE MATÃO LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 480,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GERALDO ANTONIO MAREGA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 479,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "SOLANGE DOS SANTOS HIRATSUKA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 478,
          "email": "estrela-matao@ig.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ESTRELA DE MATAO TRANSPORTES LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 477,
          "email": "vinicius.michele@bol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "BONIN APOIO ADMINISTRATIVO LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 476,
          "email": "mariahelena@colorall.com.br",
          "gerarBoleto": true,
          "razaoSocial": "TECNOCOR-TECNOLOGIA EM CORANTES NATURAIS LTDA EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 475,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MATONENSE ACABAMENTOS GRAFICOS LTDA EPP",
          "envioBoleto": null
        },
        {
          "codigo": 474,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LANCHONETE E RESTAURANTE TURBIANI LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 473,
          "email": "papelariajpoficial@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "PAPELARIA JOÃO PAULO II LTDA ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 472,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SERGIO BENEDITO DAVASSI FILHO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 471,
          "email": "restaurantesantamonica@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "GOMES & FERREIRA RESTAURANTE LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 470,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "EDRIANE CRISTINA RIBEIRO",
          "envioBoleto": null
        },
        {
          "codigo": 469,
          "email": "csclaudinei@bol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "SILVA & SILVA CLÍNICA MÉDICA S/S",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 468,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CASA DOS PARAFUSOS E EQUIPAMENTOS INDUSTRIAIS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 467,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANDREZA PINTO DO NASCIMENTO ENTRETENDIMENTOS ME",
          "envioBoleto": null
        },
        {
          "codigo": 466,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "HDS MECPAR DISTRIBUIDORA DE AUTO PEÇAS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 465,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JOAO LUIZ CARMO",
          "envioBoleto": null
        },
        {
          "codigo": 464,
          "email": "financeiro@elite.com.br",
          "gerarBoleto": true,
          "razaoSocial": "BÉGGIO LORENZO EMPREEND. E PARTICIPACOES LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 463,
          "email": "rbarcellos@terra.com.br",
          "gerarBoleto": false,
          "razaoSocial": "ROBERTO RICHIERO DE BARCELLOS",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 462,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANGELA MORAIS ANTONINI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 461,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GUERRA DE MORAES & MORAES LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 460,
          "email": "claudiacgalera@icloud.com",
          "gerarBoleto": true,
          "razaoSocial": "CLAUDIA CRISTINA GALERA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 459,
          "email": "iromonazzi@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "MONAZZI & VALLIM S/S",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 458,
          "email": "fmmenzani@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CONCEICAO CARDOSO SILVA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 457,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CONSÓRCIO CENTRAL",
          "envioBoleto": null
        },
        {
          "codigo": 456,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARIA ESTELA AQUINO DE AMORIM",
          "envioBoleto": null
        },
        {
          "codigo": 455,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CARAGÍ PARTICIPAÇÕES LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 454,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "EDRIANE CRISTINA RIBEIRO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 453,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PAVARINA & SANDRIN INFORMATICA LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 452,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "OLIVEIRA PORTO ENGENHARIA LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 451,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ROSA MARIA DE BARROS FIGUEIRA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 450,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARCOS ANTONIO ALVAREZ - ME",
          "envioBoleto": null
        },
        {
          "codigo": 449,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GABRIELA RIZZI GALDEANO",
          "envioBoleto": null
        },
        {
          "codigo": 448,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AGRINEGOCIO REPRESENTACOES LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 447,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ADRIANO MARCHEZIM REPRESENTAÇÕES",
          "envioBoleto": null
        },
        {
          "codigo": 446,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "STA. CATA COMÉRCIO DE ROUPAS LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 445,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VIP RESTAURANTE E CERVEJARIA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 444,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LOPES & GARCIA INFORMATICA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 443,
          "email": "cimag@cimag.agr.br",
          "gerarBoleto": true,
          "razaoSocial": "CIMAG INDÚSTRIA E COMÉRCIO DE MÁQUINAS AGRÍCOLAS LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 442,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SILVIA MARIA SARDI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 441,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CADIOLLI & CADIOLLI MATÃO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 439,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ALBANO ANTONIO GIANNINI REPRESENTAÇOES",
          "envioBoleto": null
        },
        {
          "codigo": 438,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "HORIAM SEGURANCA E VIGILANCIA LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 437,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CARLOS ALBERTO MARTINS CATARINO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 435,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JULIO & TAGLIAVINI S/S LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 434,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MATEUS APARECIDO PASTRELI ME",
          "envioBoleto": null
        },
        {
          "codigo": 433,
          "email": "vendasembalagens@process.com.br",
          "gerarBoleto": true,
          "razaoSocial": "WAMINGO REPRESENTACOES LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 432,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LOPES & GARBIM LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 431,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DIAMANCORTE INDUSTRIA E COMERCIO LTDA. - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 430,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FIDUCIA PAULISTA FACTORING - FOMENTO MERCANTIL LTD",
          "envioBoleto": null
        },
        {
          "codigo": 429,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "EJ & EJ LANCHONETE LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 428,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ELIAS PAULO ESQUETINI ME",
          "envioBoleto": null
        },
        {
          "codigo": 427,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "NEUSA DE FATIMA PUZZI RUFFO ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 426,
          "email": "jcoledam@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "JOÃO CARLOS COLEDAM - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 425,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FRETE FORTE TRANSPORTES LTDA. - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 424,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ICHIBAN TRANSPORTES LTDA. - ME",
          "envioBoleto": null
        },
        {
          "codigo": 423,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CITRUS 10 INDÚSTRIA E COMÉRCIO DE SUCOS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 422,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GERALDO MORELLI MORENO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 421,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "HENRIMAR GUSTAVO CORDEIRO LADEIA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 420,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "HORIAM CENTRO DE APERF. E FORM.DE VIGILANTES LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 419,
          "email": "maticritrans@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "MATICRI TRANSPORTES LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 417,
          "email": "despachantenogueira@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CENTRO DE FORMAÇÃO DE CONDUTORES NOGUEIRA S/S LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 416,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DISTAK VIDEO LOCADORA MATAO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 415,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AUTO POSTO SARRIA LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 413,
          "email": "despachantenogueira@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "C. F. C. BAIRRO ALTO LTDA ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 412,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MEC - USI USINAGEM LTDA. EPP",
          "envioBoleto": null
        },
        {
          "codigo": 411,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ASSOPEC COBRANCAS LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 410,
          "email": "jovanipureza@ig.com.br",
          "gerarBoleto": true,
          "razaoSocial": "JOVANI EMILIO PUREZA ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 409,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARIA CESIRA TREVISAN BERTONHA",
          "envioBoleto": null
        },
        {
          "codigo": 407,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MESSI SERVICOS AGRICOLAS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 405,
          "email": "podio@process.com.br",
          "gerarBoleto": true,
          "razaoSocial": "R. A. FERNANDES REPRESENTACOES LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 404,
          "email": "geraldi_transportes@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "MAURO GERALDI ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 403,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ABERRACHID & ROSA REPRESENTACOES LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 402,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DAVID & TOLEDO SANTOS REPRESENTACOES LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 401,
          "email": "autoremil@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "AUTO MECÂNICA REMIL LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 400,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SANTOS & VERNE LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 399,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PEDRO SERGIO FRANZINI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 398,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DIRECAO CERTA TRANSPORTES RODOVIARIOS LTDA EPP",
          "envioBoleto": null
        },
        {
          "codigo": 396,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ADJAIR DE PAULA ME",
          "envioBoleto": null
        },
        {
          "codigo": 395,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CINEMAX VIDEO LOCADORA MATÃO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 394,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CONECT COMERCIO E SERVICOS MATAO LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 393,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "EDSON LUIZ TROLY",
          "envioBoleto": null
        },
        {
          "codigo": 392,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ARADAL - ELETRICA E INSTRUMENTACAO LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 391,
          "email": "flavia.cjolli@gmail.com; robertoalisson175@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "ALISSON ROBERTO GARCIA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 390,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LUCIVALDO PEREIRA DOS SANTOS ME",
          "envioBoleto": null
        },
        {
          "codigo": 389,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CHEROKEE TRANSPORTES LTDA EPP",
          "envioBoleto": null
        },
        {
          "codigo": 387,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AMADEU GUSTAVO DOTTI CONSTRUTORA",
          "envioBoleto": null
        },
        {
          "codigo": 385,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "OSVALDO VINHA REPRESENTACOES LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 384,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DIMON MONTAGENS S/C LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 383,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CONSTRUTORA E.L.S. LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 382,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SCUTTI INDUSTRIAL E ARMAZENAGEM LTDA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 381,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VANDEP COMERCIO E MANUTENCAO LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 380,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "HONDA & HONDA MATAO LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 379,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LUIZ FELIPE GANDINI SALTO",
          "envioBoleto": null
        },
        {
          "codigo": 378,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARIA DA CONCEICAO PINHEIRO DE SOUZA",
          "envioBoleto": null
        },
        {
          "codigo": 377,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PAULINO ESQUELINO MATAO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 376,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CLEUSA CRISTINA CAPPI ABRANTES MATAO ME",
          "envioBoleto": null
        },
        {
          "codigo": 375,
          "email": "jcmatao.financeiro@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "NASCIMENTO & FIORAVANTI SOLUÇÕES EMPRESARIAIS LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 374,
          "email": "vadinhofinotti@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CLINICA N. S. A. MATAO S/C LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 373,
          "email": "juliarruiz1@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "SILVIO MARÇAL ORLANDINI - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 372,
          "email": "bethramos063@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CARRETAS MATÃO LTDA. - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 370,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARTA SUELI ANASTACIO PECORARI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 369,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ESTEVES & ESTEVES REPRESENTAÇÕES COMERCIAIS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 368,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ALMEIDA & JONAS CONFECCOES LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 367,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GAVIAO DOURADO MATERIAIS PARA CONSTRUCAO LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 366,
          "email": "laurocadioli@hotmail.com",
          "gerarBoleto": false,
          "razaoSocial": "LAURO JOSE CADIOLI MATAO - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 365,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CONSULT MEDICINA E SAUDE S/S",
          "envioBoleto": null
        },
        {
          "codigo": 364,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LENA FLORES FLORICULTURA LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 363,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "EDSON BENEDITO DA COSTA ESQUADRIAS ME",
          "envioBoleto": null
        },
        {
          "codigo": 362,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "L. L. G. INDUSTRIA E COMERCIO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 361,
          "email": "lpfarmaceutica@lpfarmaceutica.com.br",
          "gerarBoleto": false,
          "razaoSocial": "LP FARMACÊUTICA LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 360,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FLAVIO DE GODOY MATAO ME",
          "envioBoleto": null
        },
        {
          "codigo": 359,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CAETANO DOS ANJOS JACOB",
          "envioBoleto": null
        },
        {
          "codigo": 357,
          "email": "flavio@links.inf.br",
          "gerarBoleto": true,
          "razaoSocial": "FLÁVIO RODRIGUES LOPES INFORMÁTICA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 356,
          "email": "asreyo@hotmail.com",
          "gerarBoleto": false,
          "razaoSocial": "KATIANDREA PARTICIPAÇÕES LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 355,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PAZELLI & PAZELLI LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 354,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SILVA & SILVA JARDINAGENS S/C LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 353,
          "email": "labor_analisa@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "ANALISA LABORATÓRIO DE ANALISES CLINICAS LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 352,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CABRERA & LISBOA LTDA EPP",
          "envioBoleto": null
        },
        {
          "codigo": 350,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VARANDA'S HOTEL E RESTAURANTE LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 349,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARCOS ROBERTO DE MORAES - ME",
          "envioBoleto": null
        },
        {
          "codigo": 347,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANGELI & FURLANETTO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 346,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARCOS DONIZETE SOARES - ME",
          "envioBoleto": null
        },
        {
          "codigo": 345,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "APARECIDA MORALES GOBBO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 343,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "4R TRANSPORTES MATÃO - EIRELI - ME",
          "envioBoleto": null
        },
        {
          "codigo": 342,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "USI-PAR COMERCIO E USINAGEM LTDA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 341,
          "email": "multicar@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "MULTCAR SERVICOS E PECAS LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 340,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DANIEL PAULINO - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 339,
          "email": "financeiro@mjaviation.com.br",
          "gerarBoleto": true,
          "razaoSocial": "WGC COMERCIO DE PRODUTOS DE PETRÓLEO EIRELI - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 338,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "NADIR APARECIDA DIAS ESCAMES MATAO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 337,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LISBOA & LISBOA MATAO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 336,
          "email": "thiagojoveliano@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "JOVELIANO & JOVELIANO LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 335,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "HDS MECPAR INDUSTRIA E COMERCIO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 334,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ELITE MEGA STORE LTDA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 333,
          "email": "jsbombas@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "JSB IRRIGAÇÕES EIRELI - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 332,
          "email": "rodovalematao@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "RODOVALE MATÃO LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 331,
          "email": "contato@polyatex.com.br",
          "gerarBoleto": true,
          "razaoSocial": "POLYATEX IND. E COMERCIO DE AVIAMENTOS LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 329,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "HOME SET COMERCIAL LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 328,
          "email": "ceterpmatao@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CETERP-CENTRO DE TERAPIA, REAB E PSICOTÉCNICO LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 327,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JORGE ANTONIO CHEL - ME",
          "envioBoleto": null
        },
        {
          "codigo": 326,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "DELEO & DELEO S/C LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 325,
          "email": "helplocadora@globo.com",
          "gerarBoleto": true,
          "razaoSocial": "HELP LOCADORA MATAO LTDA - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 324,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PIONEIRA IMPLEMENTOS AGRICOLAS LTDA EPP",
          "envioBoleto": null
        },
        {
          "codigo": 323,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CLINICA DE FISIOTERAPIA FERREIRA & FERREIRA S/C LT",
          "envioBoleto": null
        },
        {
          "codigo": 322,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARGARETE CRISTINA GREGGIO SILVA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 321,
          "email": "helenaperisse@gmail.com",
          "gerarBoleto": false,
          "razaoSocial": "CLINICA MEDICA PERISSE E OLIVEIRA LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 320,
          "email": "mariacostabranco2008@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "MARIA APARECIDA DA COSTA BRANCO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 319,
          "email": "financeiro@elite.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CONCEITO BÁSICO CONFECÇÕES LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 318,
          "email": "shopingcar@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "BOTELHO & BOTELHO VEICULOS LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 317,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "R A R REPRESENTACOES COMERCIAIS LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 316,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "COMERCIAL RABACHINI LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 315,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FS MATÃO ORGANIZAÇÃO CONTÁBIL S/S LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 314,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ESTEVES REPRESENTAÇAO COMERCIAL LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 312,
          "email": "joemirpinotti@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "JOEMIR ANTONIO PINOTTI DE OLIVEIRA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 310,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CLINICA MEDICA GAVIAO PEIXOTO S/C LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 307,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "HANAUER & HANAUER DE MATAO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 306,
          "email": "fabriciosanas@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "SANAS INFORMATICA LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 305,
          "email": "vicente.malzoni@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "VICENTE MALZONI NETTO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 304,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "APARECIDO ANTONIO COLEDAM MATAO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 303,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SCUTTI & SIMOES REPRESENTACAO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 302,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ALMEIDA & CARDOSO DECORACOES LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 300,
          "email": "reservas@hotelpousadaflorenca.com.br",
          "gerarBoleto": true,
          "razaoSocial": "POUSADA FLORENCA LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 299,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JOSE ROBERTO CARDOSO MATAO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 297,
          "email": "soniapuzzi@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "SONIA MARIA PUZZI DOS SANTOS MATAO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 296,
          "email": "clmiyaji@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "NEUROCOR CLINICA NEUROCARDIOLOGICA S/S",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 295,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ENGEMAT ENGENHARIA INDUSTRIA COM. LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 294,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MB -TEC COMERCIO E SERVICOS LTDA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 290,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MORAIS TEC LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 288,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MALTA  DE PAULA PRESTADORA DE SERVIÇOS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 287,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CANADENSE MONTAGENS E MANUTENCAO INDL. LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 286,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SONIA MARIA CARDOSO PEREIRA",
          "envioBoleto": null
        },
        {
          "codigo": 285,
          "email": "financeiro@frutarabrasil.com.br",
          "gerarBoleto": true,
          "razaoSocial": "SOCCER CLUB MATAO LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 284,
          "email": "unipressadesivos@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "LIZEO INDÚSTRIA DE ADESIVOS E SELANTES EIRELI",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 282,
          "email": "financeiro@cardimix.com.br",
          "gerarBoleto": false,
          "razaoSocial": "CARDIMIX CONCRETO PRÉ-MISTURADO EIRELI - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 281,
          "email": "joao.cecchetto@terra.com.br",
          "gerarBoleto": false,
          "razaoSocial": "JOÃO LUIZ CECCHETTO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 280,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CDL - CAMARA DE DIRIGENTES LOJISTAS DE MATAO",
          "envioBoleto": null
        },
        {
          "codigo": 279,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "INDUSTRIA E COM. DE FORMICIDAS ROSINHA LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 277,
          "email": "fabianoescames@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "FABIANO ESCAMES MATAO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 274,
          "email": "",
          "gerarBoleto": true,
          "razaoSocial": "COPRES COMERCIAL LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 273,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARKA MATAO REPRESENTACOES LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 272,
          "email": "kilomania.jaboticabal@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "JAILSON CARDOSO SILVA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 271,
          "email": "marcosberetellaimports@hotmail.com",
          "gerarBoleto": false,
          "razaoSocial": "BERETELLA & BERETELLA MATAO LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 270,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CITRUSTECH COMERCIO E ENGENHARIA LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 269,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GRÁFICA MATONENSE LTDA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 266,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "RIBEIRO & RIBEIRO MATAO  S/C LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 263,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "LUIZ ANTONIO BASSI & CIA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 262,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SILVA & MOREIRA MATAO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 258,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "QUALIAGUA COMERCIAL LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 257,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TRANSPORTADORA JUSTINO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 256,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JURANDIR VALERIO DOS SANTOS MATAO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 252,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TRANSJUS LOCADORA MATAO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 250,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VINICIUS LUBRIFICANTES LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 248,
          "email": "marcosberetellaimports@hotmail.com",
          "gerarBoleto": false,
          "razaoSocial": "SÉRGIO LUIZ BERETELLA MATAO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 247,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MILTON DE DEUS E SILVA MATAO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 246,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ELIAS & ROMAO MATAO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 243,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PHARMACIA BOTHÂNICA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 237,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ASSIND ASSESSORIA INDUSTRIAL S/C LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 236,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CLAUDEMIRA DINIZ DE SOUZA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 234,
          "email": "sandra@cbatransportes.com.br",
          "gerarBoleto": true,
          "razaoSocial": "C.B.E.A TRANSPORTES E LOGÍSTICA LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 232,
          "email": "eletricasabia.adm@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "LUIZ ANTONIO COLOMBERA - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 231,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ASSOCIAÇÃO PAULISTA DE MEDICINA SEC. REG. DE MATAO",
          "envioBoleto": null
        },
        {
          "codigo": 230,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MATUISKI & OLIVEIRA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 227,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SERV & PECAS GARCIA COMERCIAL LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 225,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "BORGES & CHENCE LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 223,
          "email": "estrela-matao@ig.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ESTRELA DE MATAO AUTO POSTO LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 220,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MARQUEL JOIAS E RELOGIOS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 218,
          "email": "andre.autoescola@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "ANDRE CENTRO DE FORMACAO DE CONDUTORES S/C LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 214,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "COMERCIO E CONFECCOES MOTUCA LTDA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 213,
          "email": "financeiro@acematao.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ASSOCIACAO COMERCIAL E EMPRESARIAL DE MATAO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 210,
          "email": "juridico@pecorare.com.br",
          "gerarBoleto": true,
          "razaoSocial": "PAPELARIA PERSIGUELLI & FENILLE LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 209,
          "email": "kleber-cabral@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "NELMA DA SILVA PEREIRA CABRAL",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 208,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AMARAL INSTALACOES ELETRICAS LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 207,
          "email": "kleber-cabral@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "KLEBER NOGUEIRA CABRAL",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 204,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "BREXPORT INTERNATIONAL TRADE LTDA.",
          "envioBoleto": null
        },
        {
          "codigo": 203,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AUTO POSTO SAO LOURENCO & PINOTTI LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 199,
          "email": "display@displaymatao.com.br",
          "gerarBoleto": true,
          "razaoSocial": "DISPLAY MATÃO INFORMÁTICA LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 198,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FRANCESCO SERRAU MATAO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 192,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "JOSELI APDA. DE OLIVEIRA A. CONFECÇÕES - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 191,
          "email": "financeiro@elite.com.br",
          "gerarBoleto": true,
          "razaoSocial": "PINTA E BORDA ESTAMPARIA LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 190,
          "email": "odontomacb@yahoo.com.br",
          "gerarBoleto": true,
          "razaoSocial": "MARCO ANTONIO DA COSTA BORGES",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 189,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PAULO GERALDO JOVELIANO",
          "envioBoleto": null
        },
        {
          "codigo": 188,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CLINICA ODONTOLOGICA CHIOZZINI S/S LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 187,
          "email": "fatratores@ig.com.br",
          "gerarBoleto": true,
          "razaoSocial": "FELIPE TRATORES LTDA.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 184,
          "email": "faturamento@oclarim.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CENTRO ESPÍRITA O CLARIM",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 183,
          "email": "unisilk@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CAETANO & ALMEIDA MATAO LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 179,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AUTO POSTO SANTA ERNESTINA LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 175,
          "email": "machadoeletrica@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "MACHADO COM. E INST.ELETRICAS LTDA -E.P.P.",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 173,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "VAUDEMIR APARECIDO DE SOUZA MATAO",
          "envioBoleto": null
        },
        {
          "codigo": 172,
          "email": "podio@process.com.br",
          "gerarBoleto": true,
          "razaoSocial": "RENATO AUGUSTO FERNANDES - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 171,
          "email": "sergiodavassi@process.com.br",
          "gerarBoleto": true,
          "razaoSocial": "LUB-TEEN REVESTIMENTOS COMERCIAIS REPRESENTAÇÃO",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 163,
          "email": "cristiano@transcape.com.br",
          "gerarBoleto": true,
          "razaoSocial": "TRANSCAPE MATAO LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 162,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SÉRGIO CORDEIRO FERREIRA  APOIO ADMINISTRATIVO-ME",
          "envioBoleto": null
        },
        {
          "codigo": 161,
          "email": "franscrenon@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "BOSQUE LUBRIFICANTES LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 156,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "AUTO POSTO LARANJAO DE MATAO LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 153,
          "email": "clinimed.medicos@gmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CLINIMED SERVIÇOS DE FISIOTERAPIA S/S",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 152,
          "email": "ctamorim@ig.com.br",
          "gerarBoleto": true,
          "razaoSocial": "AMORIM & BONIN LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 146,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MENVE ASSESSORIA E PROJETOS S/C LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 133,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "REGINALDO APARECIDO TRINDADE - E.P.P.",
          "envioBoleto": null
        },
        {
          "codigo": 127,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GUANDALINI & SAVEGNAGO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 120,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MOREIRA MATAO MECANICA E FUNILARIA LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 115,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "UNIDENTE ASSISTÊNCIA ODONTOLÓGIA S/C LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 114,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "STADIO CONFECCOES ESPORTIVAS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 107,
          "email": "fertrinda@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "CARLOS FERNANDO TRINDADE",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 98,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CAMPI MONTAGENS E MANUTENCAO INDUSTRIAIS LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 97,
          "email": "transterra@chulin.com.br",
          "gerarBoleto": true,
          "razaoSocial": "TRANSTERRA CHULIN COMÉRCIO E LOCAÇOES LTDA - EPP",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 95,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANTONIO LEONEL REGUIM - ME",
          "envioBoleto": null
        },
        {
          "codigo": 92,
          "email": "carlosaofreitas@yahoo.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CARLOS ALBERTO DE OLIVEIRA FREITAS",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 90,
          "email": "mariateresajoveliano@bol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "M D B - SANTA ERNESTINA - SP - MUNICIPAL",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 87,
          "email": "amelinhatecidos@outlook.com",
          "gerarBoleto": true,
          "razaoSocial": "AMELINHA TECIDOS LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 86,
          "email": "advocaciabettimjorge@gmail.com",
          "gerarBoleto": false,
          "razaoSocial": "ANTONIO VALENTIN BETTIM REPRESENTACOES",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 76,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "APARECIDO DA SILVA FERRAMENTAS - ME",
          "envioBoleto": null
        },
        {
          "codigo": 75,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ALEXANDRE PAULO BRANDES",
          "envioBoleto": null
        },
        {
          "codigo": 72,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CASA DO CALÇADO MATÃO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 71,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SIDARTA EMPREENDIMENTOS E PARTICIPACOES LTDA - EPP",
          "envioBoleto": null
        },
        {
          "codigo": 67,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "NORIVAL SLAVIERO REPRESENTACOES",
          "envioBoleto": null
        },
        {
          "codigo": 59,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "REFRIAR MANUTENCAO E COMERCIO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 57,
          "email": "financeiro@elite.com.br",
          "gerarBoleto": true,
          "razaoSocial": "BÉGGIO LORENZO AGROPECUARIA LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 55,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CASA DA VOVÓ ANASTÁCIA CONFECÇÕES LTDA. ME",
          "envioBoleto": null
        },
        {
          "codigo": 53,
          "email": "fabiomanzi@uol.com.br",
          "gerarBoleto": true,
          "razaoSocial": "MANZI & CARDOZO CONFECÇÕES LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 42,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "CAMINOTTO & CAMINOTTO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 41,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "TECIMA INDUSTRIA E COMERCIO LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 36,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "PEDRO JORGE DE SOUZA DOBRADA",
          "envioBoleto": null
        },
        {
          "codigo": 35,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GUSTAVO GOMES DA SILVA",
          "envioBoleto": null
        },
        {
          "codigo": 32,
          "email": "ciclobazartoto@yahoo.com.br",
          "gerarBoleto": true,
          "razaoSocial": "CICLO BAZAR DO TOTO LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 31,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "SIQUITELLI & VIZOTO LTDA ME",
          "envioBoleto": null
        },
        {
          "codigo": 30,
          "email": "jhreolon@outlook.com",
          "gerarBoleto": true,
          "razaoSocial": "HOTEL LEIRIA PALACE LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 29,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "MATÃO PALACE LAVANDERIA LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 27,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "GOMES & VIANA DE SOUZA LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 26,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "APPOLONI VEICULOS & CIA. LTDA",
          "envioBoleto": null
        },
        {
          "codigo": 19,
          "email": "diskfarma@hotmail.com",
          "gerarBoleto": true,
          "razaoSocial": "IRINEU ANDUCA & CIA. LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 12,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ESPACO MATAO COMUNICACOES LTDA - ME",
          "envioBoleto": null
        },
        {
          "codigo": 11,
          "email": "luciana@raizcomercial.com.br",
          "gerarBoleto": true,
          "razaoSocial": "LUCIANA REGINA ANGELINI MATAO - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 10,
          "email": "sergiomatao@sportsasa.com.br",
          "gerarBoleto": true,
          "razaoSocial": "SPORT’S ASA LTDA. – ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 8,
          "email": "raiz@raizcomercial.com.br",
          "gerarBoleto": true,
          "razaoSocial": "RAIZ COMERCIAL LTDA",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 7,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "ANTONIO JOAO DE CAETANO MATAO - ME",
          "envioBoleto": null
        },
        {
          "codigo": 5,
          "email": "financeiro@elite.com.br",
          "gerarBoleto": true,
          "razaoSocial": "ETREAL COMERCIO LTDA - ME",
          "envioBoleto": "ambos"
        },
        {
          "codigo": 4,
          "email": "",
          "gerarBoleto": false,
          "razaoSocial": "FERNANDES & PEDROSO FRIOS LTDA - ME",
          "envioBoleto": null
        }
      ] 
    ;
}

function carregarClientesComBoletos() {
    return [
        {
            codigo: 5,
            email: 'financeiro@elite.com.br',
            gerarBoleto: true,
            razaoSocial: 'ETREAL COMERCIO LTDA - ME',
            envioBoleto: 'ambos',
            pdf: '1 - ETREAL COMERCIO LTDA  ME1620044037423.pdf'
          },
          {
            codigo: 92,
            email: 'carlosaofreitas@yahoo.com.br',
            gerarBoleto: true,
            razaoSocial: 'CARLOS ALBERTO DE OLIVEIRA FREITAS',
            envioBoleto: 'ambos',
            pdf: '10 - CARLOS ALBERTO DE OLIVEIRA FREITAS1620044037424.pdf'
          },
          {
            codigo: 552,
            email: 'licampi@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'ELIANA CRISTINA CAMPI RICCI',
            envioBoleto: 'ambos',
            pdf: '100 - ELIANA CRISTINA CAMPI RICCI1620044037431.pdf'
          },
          {
            codigo: 559,
            email: 'jcandrade6148@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'IZAANI SARAIVA PENA DE ANDRADE - ME',
            envioBoleto: 'ambos',
            pdf: '101 - IZAANI SARAIVA PENA DE ANDRADE  ME1620044037431.pdf'
          },
          {
            codigo: 562,
            email: 'juninho.manzi@outlook.com',
            gerarBoleto: true,
            razaoSocial: 'DANILO MANZI JÚNIOR REPRESENTAÇÕES',
            envioBoleto: 'ambos',
            pdf: '102 - DANILO MANZI JNIOR REPRESENTAES1620044037431.pdf'
          },
          {
            codigo: 564,
            email: 'faria@sorema.com.br',
            gerarBoleto: true,
            razaoSocial: 'SOCIEDADE RECREATIVA MATONENSE',
            envioBoleto: 'ambos',
            pdf: '103 - SOCIEDADE RECREATIVA MATONENSE1620044037431.pdf'
          },
          {
            codigo: 570,
            email: 'nfe.fmmangueira@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'FM MATAO MANGUEIRAS HIDRAULICAS LTDA - ME',
            envioBoleto: 'ambos',
            pdf: '104 - FM MATAO MANGUEIRAS HIDRAULICAS LTDA  ME1620044037431.pdf'
          },
          {
            codigo: 577,
            email: 'at_asonuma@yahoo.com.br',
            gerarBoleto: true,
            razaoSocial: 'ANA TEREZA TIEKO ASONUMA - ME',
            envioBoleto: 'ambos',
            pdf: '105 - ANA TEREZA TIEKO ASONUMA  ME1620044037431.pdf'
          },
          {
            codigo: 579,
            email: 'alexandregermanome@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'ALEXANDRE GERMANO DOS SANTOS  - ME',
            envioBoleto: 'ambos',
            pdf: '106 - ALEXANDRE GERMANO DOS SANTOS   ME1620044037431.pdf'
          },
          {
            codigo: 580,
            email: 'juridico@pecorare.com.br',
            gerarBoleto: true,
            razaoSocial: 'MARTHA JANETE FERNANDES PEDROSO - ME',
            envioBoleto: 'ambos',
            pdf: '107 - MARTHA JANETE FERNANDES PEDROSO  ME1620044037431.pdf'
          },
          {
            codigo: 585,
            email: 'rob.laranjeira@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'R L APOIO ADMINISTRATIVO LTDA. - ME',
            envioBoleto: 'ambos',
            pdf: '108 - R L APOIO ADMINISTRATIVO LTDA  ME1620044037431.pdf'
          },
          {
            codigo: 600,
            email: 'eliceumartinspio@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'OLGA NOIVAS LOCAÇÃO DE TRAJES E VEÍCULOS LTDA - ME',
            envioBoleto: 'ambos',
            pdf: '109 - OLGA NOIVAS LOCAO DE TRAJES E VECULOS LTDA  ME1620044037434.pdf'
          },
          {
            codigo: 97,
            email: 'transterra@chulin.com.br',
            gerarBoleto: true,
            razaoSocial: 'TRANSTERRA CHULIN COMÉRCIO E LOCAÇOES LTDA - EPP',
            envioBoleto: 'ambos',
            pdf: '11 - TRANSTERRA CHULIN COMRCIO E LOCAOES LTDA  EPP1620044037424.pdf'
          },
          {
            codigo: 602,
            email: 'cocmatao@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'RMX PARTICIPAÇÕES LTDA',
            envioBoleto: 'ambos',
            pdf: '110 - RMX PARTICIPAES LTDA1620044037434.pdf'
          },
          {
            codigo: 604,
            email: 'gerencia@toquesport.com.br',
            gerarBoleto: true,
            razaoSocial: 'CONFECÇÕES TOQUE SPORT LTDA - EPP',
            envioBoleto: 'ambos',
            pdf: '111 - CONFECES TOQUE SPORT LTDA  EPP1620044037434.pdf'
          },
          {
            codigo: 607,
            email: 'juridico@pecorare.com.br',
            gerarBoleto: true,
            razaoSocial: 'APARECIDO DE ANUNZIO - ME',
            envioBoleto: 'ambos',
            pdf: '112 - APARECIDO DE ANUNZIO  ME1620044037434.pdf'
          },
          {
            codigo: 610,
            email: 'mariana.pin@brancoperes.com.br',
            gerarBoleto: true,
            razaoSocial: 'ULYSSES RODRIGUES SOCIEDADE INDIVIDUAL DE ADVOCACIA',
            envioBoleto: 'ambos',
            pdf: '113 - ULYSSES RODRIGUES SOCIEDADE INDIVIDUAL DE ADVOCACIA1620044037434.pdf'
          },
          {
            codigo: 613,
            email: 'cintia.podio@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'CINTIA DE SOUZA FERNANDES - ME',
            envioBoleto: 'ambos',
            pdf: '114 - CINTIA DE SOUZA FERNANDES  ME1620044037434.pdf'
          },
          {
            codigo: 614,
            email: 'ceterpmatao@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'SALANI E JACOB EMPREENDIMENTOS LTDA',
            envioBoleto: 'ambos',
            pdf: '115 - SALANI E JACOB EMPREENDIMENTOS LTDA1620044037434.pdf'
          },
          {
            codigo: 617,
            email: 'mac.marciosantos@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'GRANDE LOJA MAÇÔNICA MISTA DO BRASIL',
            envioBoleto: 'ambos',
            pdf: '116 - GRANDE LOJA MANICA MISTA DO BRASIL1620044037434.pdf'
          },
          {
            codigo: 620,
            email: 'katia@ciamatonense.com.br',
            gerarBoleto: true,
            razaoSocial: 'M B P COMÉRCIO E IMPORTAÇÃO LTDA',
            envioBoleto: 'ambos',
            pdf: '117 - M B P COMRCIO E IMPORTAO LTDA1620044037434.pdf'
          },
          {
            codigo: 622,
            email: 'carimbosmatao@bol.com.br',
            gerarBoleto: true,
            razaoSocial: 'CARIMBOS MATÃO LTDA - ME',
            envioBoleto: 'ambos',
            pdf: '118 - CARIMBOS MATO LTDA  ME1620044037434.pdf'
          },
          {
            codigo: 623,
            email: 'multipla.negocial@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'MULTIPLA NEGOCIAL LTDA. - ME',
            envioBoleto: 'ambos',
            pdf: '119 - MULTIPLA NEGOCIAL LTDA  ME1620044037434.pdf'
          },
          {
            codigo: 107,
            email: 'fertrinda@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'CARLOS FERNANDO TRINDADE',
            envioBoleto: 'ambos',
            pdf: '12 - CARLOS FERNANDO TRINDADE1620044037424.pdf'
          },
          {
            codigo: 627,
            email: 'eletricasabia@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'ELÉTRICA SABIÁ LTDA',
            envioBoleto: 'ambos',
            pdf: '120 - ELTRICA SABI LTDA1620044037435.pdf'
          },
          {
            codigo: 629,
            email: 'polegato.jorge@terra.com.br',
            gerarBoleto: true,
            razaoSocial: 'JORGE LUIZ POLEGATO JÚNIOR ATACADO - ME',
            envioBoleto: 'ambos',
            pdf: '121 - JORGE LUIZ POLEGATO JNIOR ATACADO  ME1620044037435.pdf'
          },
          {
            codigo: 632,
            email: 'camilaminelo@bol.com.br',
            gerarBoleto: true,
            razaoSocial: 'MARIA AMÉLIA GANDINI - ME',
            envioBoleto: 'ambos',
            pdf: '122 - MARIA AMLIA GANDINI  ME1620044037435.pdf'
          },
          {
            codigo: 638,
            email: 'lcbsilva25@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'MÁRCIA FRASSOM DA SILVA - ME',
            envioBoleto: 'ambos',
            pdf: '123 - MRCIA FRASSOM DA SILVA  ME1620044037435.pdf'
          },
          {
            codigo: 640,
            email: 'universodacerveja@ig.com.br',
            gerarBoleto: true,
            razaoSocial: 'UNIVERSO DA CERVEJA LTDA.',
            envioBoleto: 'ambos',
            pdf: '124 - UNIVERSO DA CERVEJA LTDA1620044037435.pdf'
          },
          {
            codigo: 642,
            email: 'fatratores@ig.com.br',
            gerarBoleto: true,
            razaoSocial: 'B M TRATORES LTDA - EPP',
            envioBoleto: 'ambos',
            pdf: '125 - B M TRATORES LTDA  EPP1620044037435.pdf'
          },
          {
            codigo: 646,
            email: 'afonsoinformatica@globomail.com',
            gerarBoleto: true,
            razaoSocial: 'MARIELI CRISTINA DA SILVA SANTOS - ME',
            envioBoleto: 'ambos',
            pdf: '126 - MARIELI CRISTINA DA SILVA SANTOS  ME1620044037435.pdf'
          },
          {
            codigo: 650,
            email: 'runningforlife@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'CARLA CRISTINA MARTINS JOB - ME',
            envioBoleto: 'ambos',
            pdf: '127 - CARLA CRISTINA MARTINS JOB  ME1620044037435.pdf'
          },
          {
            codigo: 657,
            email: 'juridico@pecorare.com.br',
            gerarBoleto: true,
            razaoSocial: 'SALVADOR BARSAGLINI NETO',
            envioBoleto: 'ambos',
            pdf: '128 - SALVADOR BARSAGLINI NETO1620044037435.pdf'
          },
          {
            codigo: 662,
            email: 'financeiro@frutarabrasil.com.br',
            gerarBoleto: true,
            razaoSocial: 'FRUTARA BRASIL INDÚSTRIA E COMÉRCIO LTDA. - EPP',
            envioBoleto: 'ambos',
            pdf: '129 - FRUTARA BRASIL INDSTRIA E COMRCIO LTDA  EPP1620044037435.pdf'
          },
          {
            codigo: 153,
            email: 'clinimed.medicos@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'CLINIMED SERVIÇOS DE FISIOTERAPIA S/S',
            envioBoleto: 'ambos',
            pdf: '13 - CLINIMED SERVIOS DE FISIOTERAPIA SS1620044037425.pdf'
          },
          {
            codigo: 667,
            email: 'rslubrificantes@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'RS LUBRIFICANTES EIRELI - ME',
            envioBoleto: 'ambos',
            pdf: '130 - RS LUBRIFICANTES EIRELI  ME1620044037435.pdf'
          },
          {
            codigo: 668,
            email: 'financeiro@elite.com.br',
            gerarBoleto: true,
            razaoSocial: 'EVOLUTION CONSULTORIA LTDA.',
            envioBoleto: 'ambos',
            pdf: '131 - EVOLUTION CONSULTORIA LTDA1620044037435.pdf'
          },
          {
            codigo: 669,
            email: 'celia.cardozo@mecpar.com',
            gerarBoleto: true,
            razaoSocial: 'DI IORIO BRAGA & PORTO CONSULTORIA LTDA.',
            envioBoleto: 'ambos',
            pdf: '132 - DI IORIO BRAGA  PORTO CONSULTORIA LTDA1620044037435.pdf'
          },
          {
            codigo: 670,
            email: 'financeiro@rvservicos.net.br',
            gerarBoleto: true,
            razaoSocial: 'RV SERVIÇOS MATÃO LTDA. - ME',
            envioBoleto: 'ambos',
            pdf: '133 - RV SERVIOS MATO LTDA  ME1620044037435.pdf'
          },
          {
            codigo: 674,
            email: 'clinicaunivet@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'PEDRO HENRIQUE DAVASSI GABRIEL',
            envioBoleto: 'ambos',
            pdf: '134 - PEDRO HENRIQUE DAVASSI GABRIEL1620044037435.pdf'
          },
          {
            codigo: 678,
            email: 'ceterpmatao@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'LC ENGENHARIA, CONSULTORIA E ASSESSORIA LTDA.',
            envioBoleto: 'ambos',
            pdf: '135 - LC ENGENHARIA CONSULTORIA E ASSESSORIA LTDA1620044037436.pdf'
          },
          {
            codigo: 679,
            email: 'calijurifesta@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'CALIJURI BEBIDAS LTDA.',
            envioBoleto: 'ambos',
            pdf: '136 - CALIJURI BEBIDAS LTDA1620044037436.pdf'
          },
          {
            codigo: 680,
            email: 'fabiano@predilecta.com.br',
            gerarBoleto: true,
            razaoSocial: 'PRANDI APOIO ADMINISTRATIVO LTDA. - ME',
            envioBoleto: 'ambos',
            pdf: '137 - PRANDI APOIO ADMINISTRATIVO LTDA  ME1620044037436.pdf'
          },
          {
            codigo: 681,
            email: 'luizcomelli@terra.com.br',
            gerarBoleto: true,
            razaoSocial: 'KATHLEN MEYRE COMELLI DROGARIA',
            envioBoleto: 'ambos',
            pdf: '138 - KATHLEN MEYRE COMELLI DROGARIA1620044037436.pdf'
          },
          {
            codigo: 690,
            email: 'ronaldobussola1@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'BUSSOLA VEÍCULOS EIRELI',
            envioBoleto: 'ambos',
            pdf: '139 - BUSSOLA VECULOS EIRELI1620044037436.pdf'
          },
          {
            codigo: 161,
            email: 'franscrenon@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'BOSQUE LUBRIFICANTES LTDA - ME',
            envioBoleto: 'ambos',
            pdf: '14 - BOSQUE LUBRIFICANTES LTDA  ME1620044037425.pdf'
          },
          {
            codigo: 691,
            email: 'jacobbar.jacob@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'JACOB RESTAURANTE EIRELI - ME',
            envioBoleto: 'ambos',
            pdf: '140 - JACOB RESTAURANTE EIRELI  ME1620044037436.pdf'
          },
          {
            codigo: 693,
            email: 'associacaocopaiba@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'INCORPORADORA CUSINATO LTDA.',
            envioBoleto: 'ambos',
            pdf: '141 - INCORPORADORA CUSINATO LTDA1620044037436.pdf'
          },
          {
            codigo: 696,
            email: 'renato.spedo@predilecta.com.br',
            gerarBoleto: true,
            razaoSocial: 'RENATO REINALDO SPEDO - ME',
            envioBoleto: 'ambos',
            pdf: '142 - RENATO REINALDO SPEDO  ME1620044037436.pdf'
          },
          {
            codigo: 697,
            email: 'bruini@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'GERALDO JOSÉ BRUINI - ME',
            envioBoleto: 'ambos',
            pdf: '143 - GERALDO JOS BRUINI  ME1620044037436.pdf'
          },
          {
            codigo: 698,
            email: 'cleibe@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'CLEIBE NICÁCIO DA SILVA',
            envioBoleto: 'ambos',
            pdf: '144 - CLEIBE NICCIO DA SILVA1620044037436.pdf'
          },
          {
            codigo: 700,
            email: 'katia@ciamatonense.com.br',
            gerarBoleto: true,
            razaoSocial: 'BRANCO PERES AMBIENTAL LTDA.',
            envioBoleto: 'ambos',
            pdf: '145 - BRANCO PERES AMBIENTAL LTDA1620044037436.pdf'
          },
          {
            codigo: 704,
            email: 'alvaro@njembalagens.com.br',
            gerarBoleto: true,
            razaoSocial: 'NJ - REPRESENTAÇÕES DE ARTIGOS DE PAPEIS LTDA.',
            envioBoleto: 'ambos',
            pdf: '146 - NJ  REPRESENTAES DE ARTIGOS DE PAPEIS LTDA1620044037437.pdf'
          },
          {
            codigo: 705,
            email: 'vanessa@arnaldolimaadvogados.com.br',
            gerarBoleto: true,
            razaoSocial: 'ARNALDO LIMA - ADVOGADOS ASSOCIADOS',
            envioBoleto: 'ambos',
            pdf: '147 - ARNALDO LIMA  ADVOGADOS ASSOCIADOS1620044037437.pdf'
          },
          {
            codigo: 713,
            email: 'ovidsan@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'SANTOS & GODOY PRESTAÇÃO DE SERVIÇOS LTDA. – ME',
            envioBoleto: 'ambos',
            pdf: '148 - SANTOS  GODOY PRESTAO DE SERVIOS LTDA  ME1620044037437.pdf'
          },
          {
            codigo: 715,
            email: 'clinicagraziosi@outlook.com',
            gerarBoleto: true,
            razaoSocial: 'CLÍNICA MÉDICA CRIS GRAZIOSI S/S',
            envioBoleto: 'ambos',
            pdf: '149 - CLNICA MDICA CRIS GRAZIOSI SS1620044037437.pdf'
          },
          {
            codigo: 163,
            email: 'cristiano@transcape.com.br',
            gerarBoleto: true,
            razaoSocial: 'TRANSCAPE MATAO LTDA',
            envioBoleto: 'ambos',
            pdf: '15 - TRANSCAPE MATAO LTDA1620044037425.pdf'
          },
          {
            codigo: 716,
            email: 'juridico@pecorare.com.br',
            gerarBoleto: true,
            razaoSocial: 'MARTINELI & MARTINELI MATÃO LTDA. - ME',
            envioBoleto: 'ambos',
            pdf: '150 - MARTINELI  MARTINELI MATO LTDA  ME1620044037437.pdf'
          },
          {
            codigo: 718,
            email: 'cimag@cimag.agr.br',
            gerarBoleto: true,
            razaoSocial: 'J.L. DIAS IMPLEMENTOS AGRÍCOLAS LTDA - EPP',
            envioBoleto: 'ambos',
            pdf: '151 - JL DIAS IMPLEMENTOS AGRCOLAS LTDA  EPP1620044037437.pdf'
          },
          {
            codigo: 719,
            email: 'lxpecorari@yahoo.com',
            gerarBoleto: true,
            razaoSocial: 'LUIZ ANTONIO PECORARE XAVIER - ME',
            envioBoleto: 'ambos',
            pdf: '152 - LUIZ ANTONIO PECORARE XAVIER  ME1620044037437.pdf'
          },
          {
            codigo: 726,
            email: 'ferreira_marcel@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'MMF CONSULTORIA E ASSESSORIA EMPRESARIAL LTDA.-ME',
            envioBoleto: 'ambos',
            pdf: '153 - MMF CONSULTORIA E ASSESSORIA EMPRESARIAL LTDAME1620044037437.pdf'
          },
          {
            codigo: 728,
            email: 'financeiro@cardimix.com.br',
            gerarBoleto: true,
            razaoSocial: 'CARDIMIX COMº DE MATERIAIS DE CONSTRUÇÃO EIRELI',
            envioBoleto: 'ambos',
            pdf: '154 - CARDIMIX COM DE MATERIAIS DE CONSTRUO EIRELI1620044037437.pdf'
          },
          {
            codigo: 729,
            email: 'financeiro@cardimix.com.br',
            gerarBoleto: true,
            razaoSocial: 'CARDIMIX CONCRETO & REBOCO EIRELI',
            envioBoleto: 'ambos',
            pdf: '155 - CARDIMIX CONCRETO  REBOCO EIRELI1620044037438.pdf'
          },
          {
            codigo: 732,
            email: 'juniorgardini@jwgrupo.com.br',
            gerarBoleto: true,
            razaoSocial: 'JW PRESTAÇÃO DE SERVIÇOS LTDA. - ME',
            envioBoleto: 'ambos',
            pdf: '156 - JW PRESTAO DE SERVIOS LTDA  ME1620044037438.pdf'
          },
          {
            codigo: 738,
            email: 'modertechmatao@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'MODERTECH ASSISTÊNCIA TÉCNICA CNC LTDA. - ME',
            envioBoleto: 'ambos',
            pdf: '157 - MODERTECH ASSISTNCIA TCNICA CNC LTDA  ME1620044037438.pdf'
          },
          {
            codigo: 744,
            email: 'apae.matao@apaematao.org.br',
            gerarBoleto: true,
            razaoSocial: 'ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS DE MATÃO',
            envioBoleto: 'ambos',
            pdf: '158 - ASSOCIAO DE PAIS E AMIGOS DOS EXCEPCIONAIS DE MATO1620044037438.pdf'
          },
          {
            codigo: 752,
            email: 'cristiano@transcape.com.br',
            gerarBoleto: true,
            razaoSocial: 'HEXA TRANSPORTE & LOCAÇÃO LTDA - EPP',
            envioBoleto: 'ambos',
            pdf: '159 - HEXA TRANSPORTE  LOCAO LTDA  EPP1620044037438.pdf'
          },
          {
            codigo: 171,
            email: 'sergiodavassi@process.com.br',
            gerarBoleto: true,
            razaoSocial: 'LUB-TEEN REVESTIMENTOS COMERCIAIS REPRESENTAÇÃO',
            envioBoleto: 'ambos',
            pdf: '16 - LUBTEEN REVESTIMENTOS COMERCIAIS REPRESENTAO1620044037425.pdf'
          },
          {
            codigo: 758,
            email: 'cidofutura@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'AG PAPELARIA LTDA.',
            envioBoleto: 'ambos',
            pdf: '160 - AG PAPELARIA LTDA1620044037438.pdf'
          },
          {
            codigo: 759,
            email: 'cidofutura@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'BAZAR GARDINI LTDA - EPP',
            envioBoleto: 'ambos',
            pdf: '161 - BAZAR GARDINI LTDA  EPP1620044037438.pdf'
          },
          {
            codigo: 761,
            email: 'cimag@cimag.agr.br',
            gerarBoleto: true,
            razaoSocial: 'GLOBAL INDÚSTRIA DE PEÇAS AGRÍCOLAS LTDA ME',
            envioBoleto: 'ambos',
            pdf: '162 - GLOBAL INDSTRIA DE PEAS AGRCOLAS LTDA ME1620044037438.pdf'
          },
          {
            codigo: 763,
            email: 'sebastiao_gledson82@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'SEBASTIÃO GLEDISON DOS REIS - ME',
            envioBoleto: 'ambos',
            pdf: '163 - SEBASTIO GLEDISON DOS REIS  ME1620044037438.pdf'
          },
          {
            codigo: 764,
            email: 'financeiro@elite.com.br',
            gerarBoleto: true,
            razaoSocial: 'OUTLETS FACTORY ELITE EIRELI - EPP',
            envioBoleto: 'ambos',
            pdf: '164 - OUTLETS FACTORY ELITE EIRELI  EPP1620044037438.pdf'
          },
          {
            codigo: 767,
            email: 'falcaiautopecas@yahoo.com.br',
            gerarBoleto: true,
            razaoSocial: 'AUTO PEÇAS E MECÂNICA BARSAGLINI LTDA.',
            envioBoleto: 'ambos',
            pdf: '165 - AUTO PEAS E MECNICA BARSAGLINI LTDA1620044037438.pdf'
          },
          {
            codigo: 771,
            email: 'financeiro@rvservicos.net.br',
            gerarBoleto: true,
            razaoSocial: 'RV PORTARIAS E LIMPEZAS EIRELI. - ME',
            envioBoleto: 'ambos',
            pdf: '166 - RV PORTARIAS E LIMPEZAS EIRELI  ME1620044037438.pdf'
          },
          {
            codigo: 773,
            email: 'andreagaedke18@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'EBITI - EMPRESA BRASILEIRA DE ISOLAÇÃO TÉRMICA',
            envioBoleto: 'ambos',
            pdf: '167 - EBITI  EMPRESA BRASILEIRA DE ISOLAO TRMICA1620044037438.pdf'
          },
          {
            codigo: 775,
            email: 'marcelocordoa@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'CORDOA & CALIGHER DISTRIBUIDORA LTDA. - ME',
            envioBoleto: 'ambos',
            pdf: '168 - CORDOA  CALIGHER DISTRIBUIDORA LTDA  ME1620044037438.pdf'
          },
          {
            codigo: 785,
            email: 'flavio_lizeo@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'ASSOCIAÇÃO MATONENSE DE PAIS E AMIGOS DO BASQUETE',
            envioBoleto: 'ambos',
            pdf: '169 - ASSOCIAO MATONENSE DE PAIS E AMIGOS DO BASQUETE1620044037438.pdf'
          },
          {
            codigo: 172,
            email: 'podio@process.com.br',
            gerarBoleto: true,
            razaoSocial: 'RENATO AUGUSTO FERNANDES - ME',
            envioBoleto: 'ambos',
            pdf: '17 - RENATO AUGUSTO FERNANDES  ME1620044037425.pdf'
          },
          {
            codigo: 792,
            email: 'mellmichelon@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'MICHELON SOCIEDADE DE ADVOGADOS',
            envioBoleto: 'ambos',
            pdf: '170 - MICHELON SOCIEDADE DE ADVOGADOS1620044037439.pdf'
          },
          {
            codigo: 794,
            email: 'gerencia@toquesport.com.br',
            gerarBoleto: true,
            razaoSocial: 'MARIANA ANTONIOSSI CONFECÇÕES - EPP',
            envioBoleto: 'ambos',
            pdf: '171 - MARIANA ANTONIOSSI CONFECES  EPP1620044037439.pdf'
          },
          {
            codigo: 795,
            email: 'katiareolon@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'P & F MULTIPLA NEGOCIAL LTDA. - ME',
            envioBoleto: 'ambos',
            pdf: '172 - P  F MULTIPLA NEGOCIAL LTDA  ME1620044037439.pdf'
          },
          {
            codigo: 797,
            email: 'pietro2303@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'PAOLO SILVA APOIO ADMINISTRATIVO LTDA.',
            envioBoleto: 'ambos',
            pdf: '173 - PAOLO SILVA APOIO ADMINISTRATIVO LTDA1620044037439.pdf'
          },
          {
            codigo: 798,
            email: 'elenwendys@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'ELEN WENDY DA SILVA - ME',
            envioBoleto: 'ambos',
            pdf: '174 - ELEN WENDY DA SILVA  ME1620044037439.pdf'
          },
          {
            codigo: 799,
            email: 'rslubrificantes@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'EMPROLUB – EMPRESA PRODUTORA DE LUBRIFICANTES EIRELI',
            envioBoleto: 'ambos',
            pdf: '175 - EMPROLUB  EMPRESA PRODUTORA DE LUBRIFICANTES EIRELI1620044037439.pdf'
          },
          {
            codigo: 804,
            email: 'dap2013@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'DANIEL PAULO DAGUANO - ME',
            envioBoleto: 'ambos',
            pdf: '176 - DANIEL PAULO DAGUANO  ME1620044037439.pdf'
          },
          {
            codigo: 806,
            email: 'sueli@orthocamp.com.br',
            gerarBoleto: true,
            razaoSocial: 'G & C COMÉRCIO DE PRODUTOS ODONTOLÓGICOS EIRELI',
            envioBoleto: 'ambos',
            pdf: '177 - G  C COMRCIO DE PRODUTOS ODONTOLGICOS EIRELI1620044037439.pdf'
          },
          {
            codigo: 807,
            email: 'thaispastori@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'THAIS PASTORI - ME',
            envioBoleto: 'ambos',
            pdf: '178 - THAIS PASTORI  ME1620044037440.pdf'
          },
          {
            codigo: 808,
            email: 'santos.maarlon012@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'M. P. DOS SANTOS VESTUÁRIO - ME',
            envioBoleto: 'ambos',
            pdf: '179 - M P DOS SANTOS VESTURIO  ME1620044037440.pdf'
          },
          {
            codigo: 175,
            email: 'machadoeletrica@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'MACHADO COM. E INST.ELETRICAS LTDA -E.P.P.',
            envioBoleto: 'ambos',
            pdf: '18 - MACHADO COM E INSTELETRICAS LTDA EPP1620044037425.pdf'
          },
          {
            codigo: 809,
            email: 'drcharlesmatao@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'CHARLES ALEXANDRE DE ALMEIDA JÚNIOR',
            envioBoleto: 'ambos',
            pdf: '180 - CHARLES ALEXANDRE DE ALMEIDA JNIOR1620044037440.pdf'
          },
          {
            codigo: 812,
            email: 'victorjbsantos@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'BARBOSA SANTOS CLÍNICA MÉDICA EIRELI',
            envioBoleto: 'ambos',
            pdf: '181 - BARBOSA SANTOS CLNICA MDICA EIRELI1620044037440.pdf'
          },
          {
            codigo: 813,
            email: 'concreleme.financeiro@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'CONCRETO MATÃO LTDA.',
            envioBoleto: 'ambos',
            pdf: '182 - CONCRETO MATO LTDA1620044037440.pdf'
          },
          {
            codigo: 814,
            email: 'torresleonedo29@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'SÔNIA LOPES STELA TORRES',
            envioBoleto: 'ambos',
            pdf: '183 - SNIA LOPES STELA TORRES1620044037440.pdf'
          },
          {
            codigo: 815,
            email: 'cristianogouveia@adv.oabsp.org.br',
            gerarBoleto: true,
            razaoSocial: 'CRISTIANO R DE GOUVEIA SOCIEDADE IND DE ADVOCACIA',
            envioBoleto: 'ambos',
            pdf: '184 - CRISTIANO R DE GOUVEIA SOCIEDADE IND DE ADVOCACIA1620044037440.pdf'
          },
          {
            codigo: 818,
            email: 'torresleonedo29@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'LOPES PROMOÇÃO DE VENDAS E APOIO ADMINISTRATIVO',
            envioBoleto: 'ambos',
            pdf: '185 - LOPES PROMOO DE VENDAS E APOIO ADMINISTRATIVO1620044037440.pdf'
          },
          {
            codigo: 821,
            email: 'giovana.cortes@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'GARCIA & CORTES SOCIEDADE DE ADVOGADAS',
            envioBoleto: 'ambos',
            pdf: '186 - GARCIA  CORTES SOCIEDADE DE ADVOGADAS1620044037440.pdf'
          },
          {
            codigo: 824,
            email: 'wagnerpiloto77@icloud.com',
            gerarBoleto: true,
            razaoSocial: 'PILOTO APOIO ADMINISTRATIVO EIRELI',
            envioBoleto: 'ambos',
            pdf: '187 - PILOTO APOIO ADMINISTRATIVO EIRELI1620044037440.pdf'
          },
          {
            codigo: 825,
            email: 'sonia@lsl-ind.com.br',
            gerarBoleto: true,
            razaoSocial: 'VENOM INDÚSTRIA E COMÉRCIO DE AUTO PEÇAS EIRELI - EPP',
            envioBoleto: 'ambos',
            pdf: '188 - VENOM INDSTRIA E COMRCIO DE AUTO PEAS EIRELI  EPP1620044037440.pdf'
          },
          {
            codigo: 827,
            email: 'silvio@onflag.com.br',
            gerarBoleto: true,
            razaoSocial: 'ONFLAG MARKETING DE RESULTADOS EIRELI - ME',
            envioBoleto: 'ambos',
            pdf: '189 - ONFLAG MARKETING DE RESULTADOS EIRELI  ME1620044037440.pdf'
          },
          {
            codigo: 183,
            email: 'unisilk@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'CAETANO & ALMEIDA MATAO LTDA - ME',
            envioBoleto: 'ambos',
            pdf: '19 - CAETANO  ALMEIDA MATAO LTDA  ME1620044037425.pdf'
          },
          {
            codigo: 828,
            email: 'paranapesca@yahoo.com.br',
            gerarBoleto: true,
            razaoSocial: 'EDIVALDO DA SILVA BATISTA PROMOÇÃO DE VENDAS - ME',
            envioBoleto: 'ambos',
            pdf: '190 - EDIVALDO DA SILVA BATISTA PROMOO DE VENDAS  ME1620044037440.pdf'
          },
          {
            codigo: 833,
            email: 'sandra@cbatransportes.com.br / sandra.transpar@hotmail.com',
            gerarBoleto: true,
            razaoSocial: 'LILIANE CRISTINA DOS SANTOS - ME',
            envioBoleto: 'ambos',
            pdf: '191 - LILIANE CRISTINA DOS SANTOS  ME1620044037441.pdf'
          },
          {
            codigo: 837,
            email: 'cartoriostalucia@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'BEATRIZ ALVES PONCEANO NUNES',
            envioBoleto: 'ambos',
            pdf: '192 - BEATRIZ ALVES PONCEANO NUNES1620044037441.pdf'
          },
          {
            codigo: 838,
            email: 'nfe.fmmangueira@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'PAULA APARECIDA DOS REIS JOHANSEN - ME',
            envioBoleto: 'ambos',
            pdf: '193 - PAULA APARECIDA DOS REIS JOHANSEN  ME1620044037441.pdf'
          },
          {
            codigo: 839,
            email: 'concreleme.financeiro@gmail.com',
            gerarBoleto: true,
            razaoSocial: 'CONCRETO MATÃO LTDA. - EPP (Filial)',
            envioBoleto: 'ambos',
            pdf: '194 - CONCRETO MATO LTDA  EPP Filial1620044037441.pdf'
          },
          {
            codigo: 840,
            email: 'mariahelena@colorall.com.br',
            gerarBoleto: true,
            razaoSocial: 'COLORALL BRA INDÚSTRIA DE CORANTES NATURAIS EIRELI',
            envioBoleto: 'ambos',
            pdf: '195 - COLORALL BRA INDSTRIA DE CORANTES NATURAIS EIRELI1620044037441.pdf'
          },
          {
            codigo: 846,
            email: 'ceterpmatao@uol.com.br',
            gerarBoleto: true,
            razaoSocial: 'LEONARDO SALANI JACOB',
            envioBoleto: 'ambos',
            pdf: '196 - LEONARDO SALANI JACOB1620044037441.pdf'
          },
          {
            codigo: 853,
            email: 'reis.pesca@hotmail.com',
            razaoSocial: 'M. H. DOS REIS PESCA',
            pdf: '197 - M H DOS REIS PESCA1620044037441.pdf'
          },
          {
            codigo: 859,
            email: 'pietro2303@hotmail.com',
            razaoSocial: 'PIAZZA DI FIORI PIZZARIA MATÃO LTDA. - ME',
            pdf: '198 - PIAZZA DI FIORI PIZZARIA MATO LTDA  ME1620044037441.pdf'
          },
          {
            codigo: 860,
            email: 'atyne2762@gmail.com',
            razaoSocial: 'DROGARIA JOÃO PAULO II NOVA EUROPA LTDA.',
            pdf: '199 - DROGARIA JOO PAULO II NOVA EUROPA LTDA1620044037442.pdf'
          },
          {
            codigo: 8,
            razaoSocial: 'RAIZ COMERCIAL LTDA',
            email: 'raiz@raizcomercial.com.br',
            pdf: '2 - RAIZ COMERCIAL LTDA1620044037423.pdf'
          },
          {
            codigo: 184,
            razaoSocial: 'CENTRO ESPÍRITA O CLARIM',
            email: 'faturamento@oclarim.com.br',
            pdf: '20 - CENTRO ESPRITA O CLARIM1620044037425.pdf'
          },
          {
            codigo: 861,
            email: 'sandra@cbatransportes.com.br',
            razaoSocial: 'LILIANE CRISTINA DOS SANTOS – ME',
            pdf: '200 - LILIANE CRISTINA DOS SANTOS  ME1620044037442.pdf'
          },
          {
            codigo: 862,
            email: 'edson@maxsollar.com.br',
            razaoSocial: 'MAX SOLLAR EIRELI – ME',
            pdf: '201 - MAX SOLLAR EIRELI  ME1620044037442.pdf'
          },
          {
            codigo: 863,
            email: 'rslubrificantes@hotmail.com',
            razaoSocial: 'RS LUBRIFICANTES EIRELI – ME',
            pdf: '202 - RS LUBRIFICANTES EIRELI  ME1620044037442.pdf'
          },
          {
            codigo: 864,
            email: 'juridico@pecorare.com.br',
            razaoSocial: 'ASSOCIAÇÃO DESPORTIVA MATONENSE - A D M',
            pdf: '203 - ASSOCIAO DESPORTIVA MATONENSE  A D M1620044037442.pdf'
          },
          {
            codigo: 865,
            email: 'marcelo@vanin.adv.br',
            razaoSocial: 'MARCELO VANIN SOCIEDADE INDIVIDUAL DE ADVOCACIA',
            pdf: '204 - MARCELO VANIN SOCIEDADE INDIVIDUAL DE ADVOCACIA1620044037442.pdf'
          },
          {
            codigo: 866,
            email: 'tati_unesp@hotmail.com',
            razaoSocial: 'GONÇALVES E ANDRADE CLÍNICA MÉDICA S/S',
            pdf: '205 - GONALVES E ANDRADE CLNICA MDICA SS1620044037442.pdf'
          },
          {
            codigo: 867,
            email: 'financeiro@agenciaartemis.com.br',
            razaoSocial: 'AGÊNCIA ARTEMIS PROPAGANDA E PUBLICIDADE LTDA.',
            pdf: '206 - AGNCIA ARTEMIS PROPAGANDA E PUBLICIDADE LTDA1620044037443.pdf'
          },
          {
            codigo: 868,
            email: 'cactushamburgueria@gmail.com',
            razaoSocial: 'ANDRÉ FERNANDES MAZI',
            pdf: '207 - ANDR FERNANDES MAZI1620044037443.pdf'
          },
          {
            codigo: 869,
            email: 'associacaocopaiba@hotmail.com',
            razaoSocial: 'ASSOCIAÇÃO COPAÍBA',
            pdf: '208 - ASSOCIAO COPABA1620044037443.pdf'
          },
          {
            codigo: 873,
            email: 'wagnerpiloto77@icloud.com',
            razaoSocial: 'WM CHOPERIA EIRELI – ME',
            pdf: '209 - WM CHOPERIA EIRELI  ME1620044037443.pdf'
          },
          {
            codigo: 187,
            razaoSocial: 'FELIPE TRATORES LTDA.',
            email: 'fatratores@ig.com.br',
            pdf: '21 - FELIPE TRATORES LTDA1620044037425.pdf'
          },
          {
            codigo: 874,
            email: 'juridico@pecorare.com.br',
            razaoSocial: 'SEBASTIÃO TOKUDIRO INONE INOUE – ME',
            pdf: '210 - SEBASTIO TOKUDIRO INONE INOUE  ME1620044037443.pdf'
          },
          {
            codigo: 875,
            email: 'contato@avenidatintasmatao.com.br',
            razaoSocial: 'POLETO & PEREZ COMÉRCIO DE TINTAS LTDA.',
            pdf: '211 - POLETO  PEREZ COMRCIO DE TINTAS LTDA1620044037443.pdf'
          },
          {
            codigo: 876,
            email: 'adenir.jsantos@hotmail.com',
            razaoSocial: 'AG COMÉRCIO DE FRUTAS LTDA.',
            pdf: '212 - AG COMRCIO DE FRUTAS LTDA1620044037443.pdf'
          },
          {
            codigo: 878,
            email: 'sonia@lsl-ind.com.br',
            razaoSocial: 'L S L INDÚSTRIA E COMÉRCIO DE AUTO PEÇAS EIRELI – EPP',
            pdf: '213 - L S L INDSTRIA E COMRCIO DE AUTO PEAS EIRELI  EPP1620044037443.pdf'
          },
          {
            codigo: 879,
            email: 'aflavia.bozelli@gmail.com',
            razaoSocial: 'ANA FLÁVIA BOZELLI',
            pdf: '214 - ANA FLVIA BOZELLI1620044037444.pdf'
          },
          {
            codigo: 880,
            email: 'mariaaugustafortunatomoraes@gmail.com',
            razaoSocial: 'GALLOTTI & MORAES SOCIEDADE DE ADVOGADAS',
            pdf: '215 - GALLOTTI  MORAES SOCIEDADE DE ADVOGADAS1620044037444.pdf'
          },
          {
            codigo: 881,
            email: 'clinimed.medicos@gmail.com',
            razaoSocial: 'CLÍNICA UROLÓGICA MATONENSE EIRELI',
            pdf: '216 - CLNICA UROLGICA MATONENSE EIRELI1620044037444.pdf'
          },
          {
            codigo: 884,
            email: 'jovanipureza@ig.com.br',
            razaoSocial: 'PUREZA E PUREZA GESTÃO EMPRESARIAL LTDA.',
            pdf: '217 - PUREZA E PUREZA GESTO EMPRESARIAL LTDA1620044037444.pdf'
          },
          {
            codigo: 885,
            email: 'juridico@pecorare.com.br',
            razaoSocial: 'CONDOMÍNIO RESIDENCIAL EDIFÍCIO ROSINA',
            pdf: '218 - CONDOMNIO RESIDENCIAL EDIFCIO ROSINA1620044037444.pdf'
          },
          {
            codigo: 886,
            email: 'pietro2303@hotmail.com',
            razaoSocial: 'THELLY PAOLO PIZZARIA LTDA.',
            pdf: '219 - THELLY PAOLO PIZZARIA LTDA1620044037444.pdf'
          },
          {
            codigo: 190,
            razaoSocial: 'MARCO ANTONIO DA COSTA BORGES',
            email: 'odontomacb@yahoo.com.br',
            pdf: '22 - MARCO ANTONIO DA COSTA BORGES1620044037425.pdf'
          },
          {
            codigo: 887,
            email: 'juridico@pecorare.com.br',
            razaoSocial: 'E. C. M. MARGUTI CONSTRUÇÕES',
            pdf: '220 - E C M MARGUTI CONSTRUES1620044037444.pdf'
          },
          {
            codigo: 888,
            email: 'moabertaci@gmail.com',
            razaoSocial: 'INTEGRAMED MEDICINA DO TRABALHO LTDA.',
            pdf: '221 - INTEGRAMED MEDICINA DO TRABALHO LTDA1620044037445.pdf'
          },
          {
            codigo: 889,
            email: 'transterra@chulin.com.br',
            razaoSocial: 'J. L. DA SILVA LIMPEZA DE ENTULHO',
            pdf: '222 - J L DA SILVA LIMPEZA DE ENTULHO1620044037445.pdf'
          },
          {
            codigo: 890,
            email: 'rslubrificantes@hotmail.com',
            razaoSocial: 'RS LUBRIFICANTES EIRELI',
            pdf: '223 - RS LUBRIFICANTES EIRELI1620044037445.pdf'
          },
          {
            codigo: 891,
            email: 'marcelo.rodrigues@palomax.com.br',
            razaoSocial: 'MARCELO CARBONARO RODRIGUES',
            pdf: '224 - MARCELO CARBONARO RODRIGUES1620044037445.pdf'
          },
          {
            codigo: 892,
            email: 'multipla.negocial@hotmail.com',
            razaoSocial: 'MULTIPLA NEGOCIAL LTDA.',
            pdf: '225 - MULTIPLA NEGOCIAL LTDA1620044037445.pdf'
          },
          {
            codigo: 893,
            email: 'sonia@lsl-ind.com.br',
            razaoSocial: 'LAERTE LOURENÇON INDÚSTRIA E COMÉRCIO DE AUTO PEÇAS',
            pdf: '226 - LAERTE LOURENON INDSTRIA E COMRCIO DE AUTO PEAS1620044037445.pdf'
          },
          {
            codigo: 894,
            email: 'marcelo@vanin.adv.br',
            razaoSocial: 'LUMAR TECNOLOGIA DA INFORMAÇÃO EIRELI',
            pdf: '227 - LUMAR TECNOLOGIA DA INFORMAO EIRELI1620044037445.pdf'
          },
          {
            codigo: 895,
            email: 'rtlubrificante@gmail.com',
            razaoSocial: 'ANTONIO FRANCISCO CASARI',
            pdf: '228 - ANTONIO FRANCISCO CASARI1620044037445.pdf'
          },
          {
            codigo: 896,
            email: 'rodrigoaugustorsouza@gmail.com',
            razaoSocial: 'RODRIGO AUGUSTO RIBEIRO DE SOUZA – ME',
            pdf: '229 - RODRIGO AUGUSTO RIBEIRO DE SOUZA  ME1620044037445.pdf'
          },
          {
            codigo: 191,
            razaoSocial: 'PINTA E BORDA ESTAMPARIA LTDA',
            email: 'financeiro@elite.com.br',
            pdf: '23 - PINTA E BORDA ESTAMPARIA LTDA1620044037425.pdf'
          },
          {
            codigo: 898,
            email: 'concreleme.financeiro@gmail.com',
            razaoSocial: 'HELO CONCRETO E LOCAÇÃO DE MÁQUINAS LTDA.',
            pdf: '230 - HELO CONCRETO E LOCAO DE MQUINAS LTDA1620044037445.pdf'
          },
          {
            codigo: 899,
            email: 'vanessacontasf@gmail.com',
            razaoSocial: 'V J S LABORATÓRIO DE PRÓTESE ODONTOLÓGICA LTDA.',
            pdf: '231 - V J S LABORATRIO DE PRTESE ODONTOLGICA LTDA1620044037445.pdf'
          },
          {
            codigo: 901,
            email: 'cimag@cimag.agr.br',
            razaoSocial: 'N & N ADMINISTRAÇÃO DE BENS PRÓPRIOS LTDA.',
            pdf: '232 - N  N ADMINISTRAO DE BENS PRPRIOS LTDA1620044037445.pdf'
          },
          {
            codigo: 902,
            email: 'sergiomatao@sportsasa.com.br',
            razaoSocial: 'ASA MATÃO PROMOÇÃO DE VENDAS LTDA.',
            pdf: '233 - ASA MATO PROMOO DE VENDAS LTDA1620044037445.pdf'
          },
          {
            codigo: 904,
            email: 'concreleme.financeiro@gmail.com',
            razaoSocial: 'BRAD MIX CONCRETO EIRELI',
            pdf: '234 - BRAD MIX CONCRETO EIRELI1620044037446.pdf'
          },
          {
            codigo: 906,
            email: 'vicentino.marcelo99@hotmail.com',
            razaoSocial: 'VICENTINO TRANSPORTES LTDA',
            pdf: '235 - VICENTINO TRANSPORTES LTDA1620044037446.pdf'
          },
          {
            codigo: 907,
            email: 'cassioguerra4@gmail.com',
            razaoSocial: 'GUERRA & GUERRA SOLUÇÕES AGRÍCOLAS LTDA',
            pdf: '236 - GUERRA  GUERRA SOLUES AGRCOLAS LTDA1620044037446.pdf'
          },
          {
            codigo: 908,
            email: 'jvpenergiasolar@gmail.com',
            razaoSocial: 'JOÃO VITOR PINHEIRO EIRELI',
            pdf: '237 - JOO VITOR PINHEIRO EIRELI1620044037446.pdf'
          },
          {
            codigo: 909,
            email: 'brunahosaki@gmail.com',
            razaoSocial: 'DROGARIA SÃO FRANCISCO DE DOBRADA LTDA',
            pdf: '238 - DROGARIA SO FRANCISCO DE DOBRADA LTDA1620044037446.pdf'
          },
          {
            codigo: 910,
            email: 'hosaki.hosaki@hotmail.com',
            razaoSocial: 'HOSAKI & HOSAKI LTDA',
            pdf: '239 - HOSAKI  HOSAKI LTDA1620044037446.pdf'
          },
          {
            codigo: 207,
            razaoSocial: 'KLEBER NOGUEIRA CABRAL',
            email: 'kleber-cabral@uol.com.br',
            pdf: '24 - KLEBER NOGUEIRA CABRAL1620044037425.pdf'
          },
          {
            codigo: 911,
            email: 'renatohs84@gmail.com',
            razaoSocial: 'EMPORIUM COUNTRY MATÃO LTDA',
            pdf: '240 - EMPORIUM COUNTRY MATO LTDA1620044037446.pdf'
          },
          {
            codigo: 912,
            email: 'atyne2762@gmail.com',
            razaoSocial: 'DROGARIA JOÃO PAULO II NOVA EUROPA LTDA',
            pdf: '241 - DROGARIA JOO PAULO II NOVA EUROPA LTDA1620044037446.pdf'
          },
          {
            codigo: 913,
            email: 'reis.pesca@hotmail.com',
            razaoSocial: 'CLEIDE MARIA DA SILVA REIS',
            pdf: '242 - CLEIDE MARIA DA SILVA REIS1620044037446.pdf'
          },
          {
            codigo: 914,
            email: 'financeiro@rvservicos.net.br',
            razaoSocial: 'RICARDO HENRIQUE VALENTIN',
            pdf: '243 - RICARDO HENRIQUE VALENTIN1620044037446.pdf'
          },
          {
            codigo: 915,
            email: 'sandra@cbatransportes.com.br',
            razaoSocial: 'C.B.E.A TRANSPORTES E LOGÍSTICA LTDA.',
            pdf: '244 - CBEA TRANSPORTES E LOGSTICA LTDA1620044037447.pdf'
          },
          {
            codigo: 916,
            email: 'sandra@cbatransportes.com.br',
            razaoSocial: 'C.B.E.A TRANSPORTES E LOGÍSTICA LTDA.',
            pdf: '245 - CBEA TRANSPORTES E LOGSTICA LTDA1620044037447.pdf'
          },
          {
            codigo: 917,
            email: 'silvio.vidros@hotmail.com',
            razaoSocial: 'PÉRICO VIDROS LTDA.',
            pdf: '246 - PRICO VIDROS LTDA1620044037447.pdf'
          },
          {
            codigo: 918,
            email: 'multicar@gmail.com',
            razaoSocial: 'JOSEFINA VERGINIA TRALLI CORTEZI',
            pdf: '247 - JOSEFINA VERGINIA TRALLI CORTEZI1620044037447.pdf'
          },
          {
            codigo: 919,
            email: 'odontoexmatao@gmail.com',
            razaoSocial: 'L.M. CLÍNICA ODONTOLÓGICA LTDA',
            pdf: '248 - LM CLNICA ODONTOLGICA LTDA1620044037447.pdf'
          },
          {
            codigo: 920,
            email: 'financeiro@agenciaartemis.com.br',
            razaoSocial: 'AGÊNCIA ARTEMIS PROPAGANDA E PUBLICIDADE LTDA. – ME',
            pdf: '249 - AGNCIA ARTEMIS PROPAGANDA E PUBLICIDADE LTDA  ME1620044037447.pdf'
          },
          {
            codigo: 209,
            razaoSocial: 'NELMA DA SILVA PEREIRA CABRAL',
            email: 'kleber-cabral@uol.com.br',
            pdf: '25 - NELMA DA SILVA PEREIRA CABRAL1620044037425.pdf'
          },
          {
            codigo: 921,
            email: 'dra.nataliaantoniossi@yahoo.com',
            razaoSocial: 'NATÁLIA MARIA ANTONIOSSI',
            pdf: '250 - NATLIA MARIA ANTONIOSSI1620044037448.pdf'
          },
          {
            codigo: 922,
            email: 'techmoder@gmail.com',
            razaoSocial: 'TECHMODER COMÉRCIO DE MÁQUINAS LTDA.',
            pdf: '251 - TECHMODER COMRCIO DE MQUINAS LTDA1620044037448.pdf'
          },
          {
            codigo: 923,
            email: 'bruno@mecpar.com',
            razaoSocial: 'B D R CONSULTORIA EM GESTÃO EMPRESARIAL LTDA',
            pdf: '252 - B D R CONSULTORIA EM GESTO EMPRESARIAL LTDA1620044037448.pdf'
          },
          {
            codigo: 924,
            email: 'universodacerveja@ig.com.br',
            razaoSocial: 'EVERSON JOSÉ BAZOTTI ZANI',
            pdf: '253 - EVERSON JOS BAZOTTI ZANI1620044037448.pdf'
          },
          {
            codigo: 925,
            email: 'restaurantemallagueta@uol.com.br',
            razaoSocial: 'JOÃO APARECIDO ALVES',
            pdf: '254 - JOO APARECIDO ALVES1620044037448.pdf'
          },
          {
            codigo: 927,
            email: 'gerra@gerra.com.br',
            razaoSocial: 'GERRA STUDIO E EVENTOS LTDA.',
            pdf: '255 - GERRA STUDIO E EVENTOS LTDA1620044037448.pdf'
          },
          {
            codigo: 928,
            email: 'joaokfouri@uol.com.br',
            razaoSocial: 'JOÃO BATISTA KFOURI',
            pdf: '256 - JOO BATISTA KFOURI1620044037448.pdf'
          },
          {
            codigo: 929,
            email: 'mi_geraldi@hotmail.com',
            razaoSocial: 'G M TRANSPORTES MATÃO LTDA.',
            pdf: '257 - G M TRANSPORTES MATO LTDA1620044037449.pdf'
          },
          {
            codigo: 930,
            email: 'trans_fatima@outlook.com',
            razaoSocial: 'TRANSFÁTIMA LTDA.',
            pdf: '258 - TRANSFTIMA LTDA1620044037449.pdf'
          },
          {
            codigo: 931,
            email: 'jovanipureza@ig.com.br',
            razaoSocial: 'JOVANI EMILIO PUREZA',
            pdf: '259 - JOVANI EMILIO PUREZA1620044037449.pdf'
          },
          {
            codigo: 210,
            razaoSocial: 'PAPELARIA PERSIGUELLI & FENILLE LTDA - ME',
            email: 'juridico@pecorare.com.br',
            pdf: '26 - PAPELARIA PERSIGUELLI  FENILLE LTDA  ME1620044037425.pdf'
          },
          {
            codigo: 932,
            email: 'cimag@cimag.agr.br',
            razaoSocial: 'J C N INDÚSTRIA E COMÉRCIO LTDA.',
            pdf: '260 - J C N INDSTRIA E COMRCIO LTDA1620044037449.pdf'
          },
          {
            codigo: 213,
            razaoSocial: 'ASSOCIACAO COMERCIAL E EMPRESARIAL DE MATAO',
            email: 'financeiro@acematao.com.br',
            pdf: '27 - ASSOCIACAO COMERCIAL E EMPRESARIAL DE MATAO1620044037425.pdf'
          },
          {
            codigo: 218,
            razaoSocial: 'ANDRE CENTRO DE FORMACAO DE CONDUTORES S/C LTDA',
            email: 'andre.autoescola@hotmail.com',
            pdf: '28 - ANDRE CENTRO DE FORMACAO DE CONDUTORES SC LTDA1620044037426.pdf'
          },
          {
            codigo: 223,
            razaoSocial: 'ESTRELA DE MATAO AUTO POSTO LTDA',
            email: 'estrela-matao@ig.com.br',
            pdf: '29 - ESTRELA DE MATAO AUTO POSTO LTDA1620044037426.pdf'
          },
          {
            codigo: 10,
            razaoSocial: 'SPORT’S ASA LTDA. – ME',
            email: 'sergiomatao@sportsasa.com.br',
            pdf: '3 - SPORTS ASA LTDA  ME1620044037424.pdf'
          },
          {
            codigo: 225,
            razaoSocial: 'BORGES & CHENCE LTDA - ME',
            email: 'juridico@pecorare.com.br',
            pdf: '30 - BORGES  CHENCE LTDA  ME1620044037426.pdf'
          },
          {
            codigo: 232,
            email: 'eletricasabia.adm@gmail.com',
            razaoSocial: 'LUIZ ANTONIO COLOMBERA - EPP',
            pdf: '31 - LUIZ ANTONIO COLOMBERA  EPP1620044037426.pdf'
          },
          {
            codigo: 234,
            email: 'sandra@cbatransportes.com.br',
            razaoSocial: 'C.B.E.A TRANSPORTES E LOGÍSTICA LTDA.',
            pdf: '32 - CBEA TRANSPORTES E LOGSTICA LTDA1620044037426.pdf'
          },
          {
            codigo: 258,
            email: 'juridico@pecorare.com.br',
            razaoSocial: 'QUALIAGUA COMERCIAL LTDA - ME',
            pdf: '33 - QUALIAGUA COMERCIAL LTDA  ME1620044037426.pdf'
          },
          {
            codigo: 272,
            email: 'kilomania.jaboticabal@hotmail.com',
            razaoSocial: 'JAILSON CARDOSO SILVA - ME',
            pdf: '34 - JAILSON CARDOSO SILVA  ME1620044037426.pdf'
          },
          {
            codigo: 277,
            email: 'fabianoescames@uol.com.br',
            razaoSocial: 'FABIANO ESCAMES MATAO - ME',
            pdf: '35 - FABIANO ESCAMES MATAO  ME1620044037426.pdf'
          },
          {
            codigo: 281,
            email: 'joao.cecchetto@terra.com.br',
            razaoSocial: 'JOÃO LUIZ CECCHETTO',
            pdf: '36 - JOO LUIZ CECCHETTO1620044037426.pdf'
          },
          {
            codigo: 284,
            email: 'unipressadesivos@gmail.com',
            razaoSocial: 'LIZEO INDÚSTRIA DE ADESIVOS E SELANTES EIRELI',
            pdf: '37 - LIZEO INDSTRIA DE ADESIVOS E SELANTES EIRELI1620044037426.pdf'
          },
          {
            codigo: 285,
            email: 'financeiro@frutarabrasil.com.br',
            razaoSocial: 'SOCCER CLUB MATAO LTDA - ME',
            pdf: '38 - SOCCER CLUB MATAO LTDA  ME1620044037426.pdf'
          },
          {
            codigo: 296,
            email: 'clmiyaji@hotmail.com',
            razaoSocial: 'NEUROCOR CLINICA NEUROCARDIOLOGICA S/S',
            pdf: '39 - NEUROCOR CLINICA NEUROCARDIOLOGICA SS1620044037426.pdf'
          },
          {
            codigo: 11,
            razaoSocial: 'LUCIANA REGINA ANGELINI MATAO - ME',
            email: 'luciana@raizcomercial.com.br',
            pdf: '4 - LUCIANA REGINA ANGELINI MATAO  ME1620044037424.pdf'
          },
          {
            codigo: 297,
            email: 'soniapuzzi@uol.com.br',
            razaoSocial: 'SONIA MARIA PUZZI DOS SANTOS MATAO - ME',
            pdf: '40 - SONIA MARIA PUZZI DOS SANTOS MATAO  ME1620044037426.pdf'
          },
          {
            codigo: 300,
            email: 'reservas@hotelpousadaflorenca.com.br',
            razaoSocial: 'POUSADA FLORENCA LTDA - ME',
            pdf: '41 - POUSADA FLORENCA LTDA  ME1620044037427.pdf'
          },
          {
            codigo: 304,
            email: 'juridico@pecorare.com.br',
            razaoSocial: 'APARECIDO ANTONIO COLEDAM MATAO',
            pdf: '42 - APARECIDO ANTONIO COLEDAM MATAO1620044037427.pdf'
          },
          {
            codigo: 305,
            email: 'vicente.malzoni@gmail.com',
            razaoSocial: 'VICENTE MALZONI NETTO',
            pdf: '43 - VICENTE MALZONI NETTO1620044037427.pdf'
          },
          {
            codigo: 312,
            email: 'joemirpinotti@uol.com.br',
            razaoSocial: 'JOEMIR ANTONIO PINOTTI DE OLIVEIRA - ME',
            pdf: '44 - JOEMIR ANTONIO PINOTTI DE OLIVEIRA  ME1620044037427.pdf'
          },
          {
            codigo: 318,
            email: 'shopingcar@hotmail.com',
            razaoSocial: 'BOTELHO & BOTELHO VEICULOS LTDA',
            pdf: '45 - BOTELHO  BOTELHO VEICULOS LTDA1620044037427.pdf'
          },
          {
            codigo: 320,
            email: 'mariacostabranco2008@hotmail.com',
            razaoSocial: 'MARIA APARECIDA DA COSTA BRANCO',
            pdf: '46 - MARIA APARECIDA DA COSTA BRANCO1620044037427.pdf'
          },
          {
            codigo: 325,
            email: 'helplocadora@globo.com',
            razaoSocial: 'HELP LOCADORA MATAO LTDA - EPP',
            pdf: '47 - HELP LOCADORA MATAO LTDA  EPP1620044037427.pdf'
          },
          {
            codigo: 328,
            email: 'ceterpmatao@uol.com.br',
            razaoSocial: 'CETERP-CENTRO DE TERAPIA, REAB E PSICOTÉCNICO LTDA',
            pdf: '48 - CETERPCENTRO DE TERAPIA REAB E PSICOTCNICO LTDA1620044037427.pdf'
          },
          {
            codigo: 331,
            email: 'contato@polyatex.com.br',
            razaoSocial: 'POLYATEX IND. E COMERCIO DE AVIAMENTOS LTDA - ME',
            pdf: '49 - POLYATEX IND E COMERCIO DE AVIAMENTOS LTDA  ME1620044037427.pdf'
          },
          {
            codigo: 19,
            razaoSocial: 'IRINEU ANDUCA & CIA. LTDA - ME',
            email: 'diskfarma@hotmail.com',
            pdf: '5 - IRINEU ANDUCA  CIA LTDA  ME1620044037424.pdf'
          },
          {
            codigo: 332,
            email: 'rodovalematao@uol.com.br',
            razaoSocial: 'RODOVALE MATÃO LTDA - ME',
            pdf: '50 - RODOVALE MATO LTDA  ME1620044037427.pdf'
          },
          {
            codigo: 333,
            email: 'jsbombas@uol.com.br',
            razaoSocial: 'JSB IRRIGAÇÕES EIRELI - EPP',
            pdf: '51 - JSB IRRIGAES EIRELI  EPP1620044037427.pdf'
          },
          {
            codigo: 336,
            email: 'thiagojoveliano@hotmail.com',
            razaoSocial: 'JOVELIANO & JOVELIANO LTDA',
            pdf: '52 - JOVELIANO  JOVELIANO LTDA1620044037427.pdf'
          },
          {
            codigo: 339,
            email: 'financeiro@mjaviation.com.br',
            razaoSocial: 'WGC COMERCIO DE PRODUTOS DE PETRÓLEO EIRELI - EPP',
            pdf: '53 - WGC COMERCIO DE PRODUTOS DE PETRLEO EIRELI  EPP1620044037427.pdf'
          },
          {
            codigo: 341,
            email: 'multicar@gmail.com',
            razaoSocial: 'MULTCAR SERVICOS E PECAS LTDA - ME',
            pdf: '54 - MULTCAR SERVICOS E PECAS LTDA  ME1620044037427.pdf'
          },
          {
            codigo: 353,
            email: 'labor_analisa@hotmail.com',
            razaoSocial: 'ANALISA LABORATÓRIO DE ANALISES CLINICAS LTDA',
            pdf: '55 - ANALISA LABORATRIO DE ANALISES CLINICAS LTDA1620044037428.pdf'
          },
          {
            codigo: 357,
            email: 'flavio@links.inf.br',
            razaoSocial: 'FLÁVIO RODRIGUES LOPES INFORMÁTICA - ME',
            pdf: '56 - FLVIO RODRIGUES LOPES INFORMTICA  ME1620044037428.pdf'
          },
          {
            codigo: 372,
            email: 'bethramos063@gmail.com',
            razaoSocial: 'CARRETAS MATÃO LTDA. - ME',
            pdf: '57 - CARRETAS MATO LTDA  ME1620044037428.pdf'
          },
          {
            codigo: 373,
            email: 'juliarruiz1@gmail.com',
            razaoSocial: 'SILVIO MARÇAL ORLANDINI - ME',
            pdf: '58 - SILVIO MARAL ORLANDINI  ME1620044037428.pdf'
          },
          {
            codigo: 374,
            email: 'vadinhofinotti@gmail.com',
            razaoSocial: 'CLINICA N. S. A. MATAO S/C LTDA',
            pdf: '59 - CLINICA N S A MATAO SC LTDA1620044037428.pdf'
          },
          {
            codigo: 32,
            razaoSocial: 'CICLO BAZAR DO TOTO LTDA - ME',
            email: 'ciclobazartoto@yahoo.com.br',
            pdf: '6 - CICLO BAZAR DO TOTO LTDA  ME1620044037424.pdf'
          },
          {
            codigo: 375,
            email: 'jcmatao.financeiro@gmail.com',
            razaoSocial: 'NASCIMENTO & FIORAVANTI SOLUÇÕES EMPRESARIAIS LTDA.',
            pdf: '60 - NASCIMENTO  FIORAVANTI SOLUES EMPRESARIAIS LTDA1620044037428.pdf'
          },
          {
            codigo: 391,
            email: 'flavia.cjolli@gmail.com; robertoalisson175@gmail.com',
            razaoSocial: 'ALISSON ROBERTO GARCIA',
            pdf: '61 - ALISSON ROBERTO GARCIA1620044037428.pdf'
          },
          {
            codigo: 401,
            email: 'autoremil@hotmail.com',
            razaoSocial: 'AUTO MECÂNICA REMIL LTDA. - ME',
            pdf: '62 - AUTO MECNICA REMIL LTDA  ME1620044037428.pdf'
          },
          {
            codigo: 404,
            email: 'geraldi_transportes@hotmail.com',
            razaoSocial: 'MAURO GERALDI ME',
            pdf: '63 - MAURO GERALDI ME1620044037428.pdf'
          },
          {
            codigo: 405,
            email: 'podio@process.com.br',
            razaoSocial: 'R. A. FERNANDES REPRESENTACOES LTDA.',
            pdf: '64 - R A FERNANDES REPRESENTACOES LTDA1620044037429.pdf'
          },
          {
            codigo: 410,
            email: 'jovanipureza@ig.com.br',
            razaoSocial: 'JOVANI EMILIO PUREZA ME',
            pdf: '65 - JOVANI EMILIO PUREZA ME1620044037429.pdf'
          },
          {
            codigo: 413,
            email: 'despachantenogueira@hotmail.com',
            razaoSocial: 'C. F. C. BAIRRO ALTO LTDA ME',
            pdf: '66 - C F C BAIRRO ALTO LTDA ME1620044037429.pdf'
          },
          {
            codigo: 417,
            email: 'despachantenogueira@hotmail.com',
            razaoSocial: 'CENTRO DE FORMAÇÃO DE CONDUTORES NOGUEIRA S/S LTDA',
            pdf: '67 - CENTRO DE FORMAO DE CONDUTORES NOGUEIRA SS LTDA1620044037429.pdf'
          },
          {
            codigo: 419,
            email: 'maticritrans@uol.com.br',
            razaoSocial: 'MATICRI TRANSPORTES LTDA.',
            pdf: '68 - MATICRI TRANSPORTES LTDA1620044037429.pdf'
          },
          {
            codigo: 426,
            email: 'jcoledam@hotmail.com',
            razaoSocial: 'JOÃO CARLOS COLEDAM - ME',
            pdf: '69 - JOO CARLOS COLEDAM  ME1620044037429.pdf'
          },
          {
            codigo: 53,
            razaoSocial: 'MANZI & CARDOZO CONFECÇÕES LTDA - ME',
            email: 'fabiomanzi@uol.com.br',
            pdf: '7 - MANZI  CARDOZO CONFECES LTDA  ME1620044037424.pdf'
          },
          {
            codigo: 427,
            email: 'juridico@pecorare.com.br',
            razaoSocial: 'NEUSA DE FATIMA PUZZI RUFFO ME',
            pdf: '70 - NEUSA DE FATIMA PUZZI RUFFO ME1620044037429.pdf'
          },
          {
            codigo: 433,
            email: 'vendasembalagens@process.com.br',
            razaoSocial: 'WAMINGO REPRESENTACOES LTDA.',
            pdf: '71 - WAMINGO REPRESENTACOES LTDA1620044037429.pdf'
          },
          {
            codigo: 443,
            email: 'cimag@cimag.agr.br',
            razaoSocial: 'CIMAG INDÚSTRIA E COMÉRCIO DE MÁQUINAS AGRÍCOLAS LTDA.',
            pdf: '72 - CIMAG INDSTRIA E COMRCIO DE MQUINAS AGRCOLAS LTDA1620044037429.pdf'
          },
          {
            codigo: 458,
            email: 'fmmenzani@hotmail.com',
            razaoSocial: 'CONCEICAO CARDOSO SILVA - ME',
            pdf: '73 - CONCEICAO CARDOSO SILVA  ME1620044037429.pdf'
          },
          {
            codigo: 459,
            email: 'iromonazzi@hotmail.com',
            razaoSocial: 'MONAZZI & VALLIM S/S',
            pdf: '74 - MONAZZI  VALLIM SS1620044037429.pdf'
          },
          {
            codigo: 464,
            email: 'financeiro@elite.com.br',
            razaoSocial: 'BÉGGIO LORENZO EMPREEND. E PARTICIPACOES LTDA.',
            pdf: '75 - BGGIO LORENZO EMPREEND E PARTICIPACOES LTDA1620044037429.pdf'
          },
          {
            codigo: 469,
            email: 'csclaudinei@bol.com.br',
            razaoSocial: 'SILVA & SILVA CLÍNICA MÉDICA S/S',
            pdf: '76 - SILVA  SILVA CLNICA MDICA SS1620044037429.pdf'
          },
          {
            codigo: 471,
            email: 'restaurantesantamonica@hotmail.com',
            razaoSocial: 'GOMES & FERREIRA RESTAURANTE LTDA. - ME',
            pdf: '77 - GOMES  FERREIRA RESTAURANTE LTDA  ME1620044037429.pdf'
          },
          {
            codigo: 473,
            email: 'papelariajpoficial@gmail.com',
            razaoSocial: 'PAPELARIA JOÃO PAULO II LTDA ME',
            pdf: '78 - PAPELARIA JOO PAULO II LTDA ME1620044037429.pdf'
          },
          {
            codigo: 476,
            email: 'mariahelena@colorall.com.br',
            razaoSocial: 'TECNOCOR-TECNOLOGIA EM CORANTES NATURAIS LTDA EPP',
            pdf: '79 - TECNOCORTECNOLOGIA EM CORANTES NATURAIS LTDA EPP1620044037429.pdf'
          },
          {
            codigo: 57,
            razaoSocial: 'BÉGGIO LORENZO AGROPECUARIA LTDA',
            email: 'financeiro@elite.com.br',
            pdf: '8 - BGGIO LORENZO AGROPECUARIA LTDA1620044037424.pdf'
          },
          {
            codigo: 477,
            email: 'vinicius.michele@bol.com.br',
            razaoSocial: 'BONIN APOIO ADMINISTRATIVO LTDA. - ME',
            pdf: '80 - BONIN APOIO ADMINISTRATIVO LTDA  ME1620044037429.pdf'
          },
          {
            codigo: 478,
            email: 'estrela-matao@ig.com.br',
            razaoSocial: 'ESTRELA DE MATAO TRANSPORTES LTDA',
            pdf: '81 - ESTRELA DE MATAO TRANSPORTES LTDA1620044037430.pdf'
          },
          {
            codigo: 479,
            email: 'juridico@pecorare.com.br',
            razaoSocial: 'SOLANGE DOS SANTOS HIRATSUKA - ME',
            pdf: '82 - SOLANGE DOS SANTOS HIRATSUKA  ME1620044037430.pdf'
          },
          {
            codigo: 481,
            email: 'jmlfernanda@hotmail.com',
            razaoSocial: 'PAPELARIA CASA GRANDE DE MATÃO LTDA. - ME',
            pdf: '83 - PAPELARIA CASA GRANDE DE MATO LTDA  ME1620044037430.pdf'
          },
          {
            codigo: 482,
            email: 'carolineramos18@hotmail.com',
            razaoSocial: 'ESPAÇO FEST BUFFET E EVENTOS LTDA. - ME',
            pdf: '84 - ESPAO FEST BUFFET E EVENTOS LTDA  ME1620044037430.pdf'
          },
          {
            codigo: 485,
            email: 'juridico@pecorare.com.br',
            razaoSocial: 'B.C. MOLON REPRESENTAÇOES S/S LTDA - ME',
            pdf: '85 - BC MOLON REPRESENTAOES SS LTDA  ME1620044037430.pdf'
          },
          {
            codigo: 488,
            email: 'tadiotti@uol.com.br',
            razaoSocial: 'CINEMATOGRÁFICA TADIOTTI LTDA. - ME',
            pdf: '86 - CINEMATOGRFICA TADIOTTI LTDA  ME1620044037430.pdf'
          },
          {
            codigo: 489,
            email: 'caetaanno@uol.com.br',
            razaoSocial: 'PEDRO CAETANO REPRESENTACOES',
            pdf: '87 - PEDRO CAETANO REPRESENTACOES1620044037430.pdf'
          },
          {
            codigo: 495,
            email: 'laemcasamatao@hotmail.com',
            razaoSocial: 'CUTTI & OTRENTI RESTAURANTE LTDA - ME',
            pdf: '88 - CUTTI  OTRENTI RESTAURANTE LTDA  ME1620044037430.pdf'
          },
          {
            codigo: 503,
            email: 'kilomania.jaboticabal@hotmail.com',
            razaoSocial: 'JOVILSON CARDOSO SILVA - ME',
            pdf: '89 - JOVILSON CARDOSO SILVA  ME1620044037430.pdf'
          },
          {
            codigo: 87,
            razaoSocial: 'AMELINHA TECIDOS LTDA - ME',
            email: 'amelinhatecidos@outlook.com',
            pdf: '9 - AMELINHA TECIDOS LTDA  ME1620044037424.pdf'
          },
          {
            codigo: 506,
            email: 'cimag@cimag.agr.br',
            razaoSocial: 'J.L. DIAS IMPLEMENTOS AGRICOLAS LTDA. - EPP',
            pdf: '90 - JL DIAS IMPLEMENTOS AGRICOLAS LTDA  EPP1620044037430.pdf'
          },
          {
            codigo: 517,
            email: 'dejadaguano@hotmail.com',
            razaoSocial: 'DIEGO ANTONIO DAGUANO - ME',
            pdf: '91 - DIEGO ANTONIO DAGUANO  ME1620044037430.pdf'
          },
          {
            codigo: 525,
            email: 'katia@ciamatonense.com.br',
            razaoSocial: 'CMS - COMPANHIA MATONENSE DE SANEAMENTO',
            pdf: '92 - CMS  COMPANHIA MATONENSE DE SANEAMENTO1620044037430.pdf'
          },
          {
            codigo: 526,
            email: 'sueli@orthocamp.com.br',
            razaoSocial: 'DENTAL MATÃO COM° DE EQUIPTOS ODONT. EIRELI - EPP',
            pdf: '93 - DENTAL MATO COM DE EQUIPTOS ODONT EIRELI  EPP1620044037430.pdf'
          },
          {
            codigo: 537,
            email: 'transterra@chulin.com.br',
            razaoSocial: 'LIG-LIMPE E CATA ENTULHO MATÃO COM E LOC LTDA  EPP',
            pdf: '94 - LIGLIMPE E CATA ENTULHO MATO COM E LOC LTDA  EPP1620044037430.pdf'
          },
          {
            codigo: 539,
            email: 'espacofest.buffet@hotmail.com',
            razaoSocial: 'ESPAÇO FEST BUFFET E EVENTOS LTDA. - ME',
            pdf: '95 - ESPAO FEST BUFFET E EVENTOS LTDA  ME1620044037430.pdf'
          },
          {
            codigo: 543,
            email: 'pjcalixto@hotmail.com',
            razaoSocial: 'SOUZA E SOUZA LOCACAO E TERRAPLENAGEM LTDA - ME',
            pdf: '96 - SOUZA E SOUZA LOCACAO E TERRAPLENAGEM LTDA  ME1620044037430.pdf'
          },
          {
            codigo: 544,
            email: 'gisadotti@ig.com.br',
            razaoSocial: 'DOTTI & ALMEIDA RESTAURANTE LTDA - ME',
            pdf: '97 - DOTTI  ALMEIDA RESTAURANTE LTDA  ME1620044037430.pdf'
          },
          {
            codigo: 547,
            email: 'minas.sabor@terra.com.br',
            razaoSocial: 'MINAS SABOR INDÚSTRIA E COMERCIO DE ALIMENTOS LTDA',
            pdf: '98 - MINAS SABOR INDSTRIA E COMERCIO DE ALIMENTOS LTDA1620044037431.pdf'
          },
          {
            codigo: 551,
            email: 'sergio@espacomatao.com.br',
            razaoSocial: 'PINOTTI E FLORIANO LTDA - ME',
            pdf: '99 - PINOTTI E FLORIANO LTDA  ME1620044037431.pdf'
          }
          
          
    ]
}

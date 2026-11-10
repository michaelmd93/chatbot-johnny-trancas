// Base de Conhecimento - Johnny Tranças
// Estrutura preparada para preenchimento com informações reais do negócio

const knowledgeBase = {
    // Tipos de trança disponíveis no negócio
    tiposTranca: {
        boxBraids: {
            nome: "Box Braids",
            palavrasChave: ["box", "box braids", "boxbraids", "braids"]
        },
        nago: {
            nome: "Nagô",
            palavrasChave: ["nagô", "nago", "nagoo"]
        },
        twists: {
            nome: "Twists",
            palavrasChave: ["twist", "twists"]
        }
    },
    
    // Tamanhos disponíveis
    tamanhos: {
        curto: {
            nome: "Curto",
            palavrasChave: ["curto", "curta", "pequeno", "pequena"]
        },
        medio: {
            nome: "Médio",
            palavrasChave: ["médio", "medio", "média", "media", "medium"]
        },
        longo: {
            nome: "Longo",
            palavrasChave: ["longo", "longa", "grande"]
        }
    },
    
    // Opções de material
    materiais: {
        cliente: {
            nome: "Fornecido pelo cliente",
            palavrasChave: ["eu", "cliente", "meu", "minha", "tenho", "possuo"]
        },
        trancista: {
            nome: "Fornecido pelo trancista",
            palavrasChave: ["trancista", "johnny", "vocês", "voce", "voceis", "fornecido"]
        }
    },
    
    // Cores disponíveis
    cores: {
        preto: {
            nome: "Preto",
            palavrasChave: ["preto", "preta", "black"]
        },
        marrom: {
            nome: "Marrom",
            palavrasChave: ["marrom", "castanho", "castanha", "brown"]
        },
        loiro: {
            nome: "Loiro",
            palavrasChave: ["loiro", "loira", "blonde", "dourado"]
        }
    },
    
    // Locais de atendimento
    locais: {
        estudio: {
            nome: "Estúdio",
            palavrasChave: ["estúdio", "estudio", "salão", "salao"]
        },
        domicilio: {
            nome: "Domicílio",
            palavrasChave: ["domicílio", "domicilio", "casa", "em casa", "minha casa"]
        }
    },
    
    // Formas de pagamento aceitas
    formasPagamento: {
        pix: {
            nome: "PIX",
            palavrasChave: ["pix", "transferência", "transferencia"]
        },
        cartao: {
            nome: "Cartão",
            palavrasChave: ["cartão", "cartao", "débito", "debito", "crédito", "credito"]
        },
        dinheiro: {
            nome: "Dinheiro",
            palavrasChave: ["dinheiro", "espécie", "especie", "cash"]
        }
    },
    
    // FAQ - Perguntas Frequentes
    // Estrutura preparada para preenchimento com informações reais
    faq: [
        {
            categoria: "material",
            pergunta: "Vocês fornecem o material?",
            resposta: "[PLACEHOLDER - Aguardando informação oficial do Johnny]",
            palavrasChave: ["fornecem", "material", "vocês", "voceis", "fornece", "material"],
            variacoes: [
                "vocês fornecem material",
                "tem material",
                "o material é de vocês",
                "quem fornece o material"
            ],
            ativo: true
        },
        {
            categoria: "atendimento",
            pergunta: "Como funciona o atendimento?",
            resposta: "[PLACEHOLDER - Aguardando informação oficial do Johnny]",
            palavrasChave: ["como", "funciona", "atendimento", "processo"],
            variacoes: [
                "como funciona",
                "como é o atendimento",
                "como funciona o processo"
            ],
            ativo: true
        }
    ],
    
    // Mensagens padrão do sistema
    mensagens: {
        saudacao: "Olá! Vou fazer algumas perguntas para entender seu atendimento. 😊",
        encaminhamentoHumano: "Claro! Vou sinalizar seu atendimento para o Johnny. 😊",
        foraDaBase: "Não tenho essa informação disponível no momento. Vou encaminhar sua dúvida para o Johnny.",
        confirmacaoDomicilio: "Você gostaria de atendimento em domicílio?",
        confirmacaoEstudio: "Você gostaria de atendimento no estúdio?"
    }
};

// Exportar para uso no chat.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = knowledgeBase;
}

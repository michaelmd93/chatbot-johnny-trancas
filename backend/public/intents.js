// Sistema de Intenções - Johnny Tranças
// Reconhece intenções do usuário e extrai informações da triagem

const intents = {
    // Saudações
    saudacao: {
        palavrasChave: [
            "oi", "olá", "ola", "oii", "oie", "hey", "hi", "hello",
            "bom dia", "boa tarde", "boa noite", "tudo bem", "td bem",
            "como vai", "como está", "opa", "eae"
        ],
        prioridade: 1
    },
    
    // Atendimento humano
    atendimentoHumano: {
        palavrasChave: [
            "falar com johnny", "falar com o johnny", "falar com uma pessoa",
            "atendimento humano", "falar com responsável", "falar com o responsável",
            "quero falar com alguém", "quero falar com uma pessoa", "preciso de atendimento",
            "tem como falar com o dono", "falar com o dono", "chamar o johnny",
            "quero atendimento humano", "falar com pessoa real"
        ],
        prioridade: 10 // Alta prioridade
    },
    
    // Solicitar reiniciar
    reiniciar: {
        palavrasChave: ["reiniciar", "recomeçar", "começar de novo", "nova triagem"],
        prioridade: 9
    },
    
    // Solicitar outras opções
    outrasOpcoes: {
        palavrasChave: [
            "outras opções", "outras opcoes", "tem outras", "quais outras",
            "tem mais opções", "tem mais opcoes", "outra opção", "outra opcao",
            "mais opções", "mais opcoes", "mais tipos", "mais modelos"
        ],
        prioridade: 8
    },
    
    // Correção de informação
    correcao: {
        palavrasChave: [
            "na verdade", "na realidade", "quer dizer", "ou seja", "correção",
            "corrigir", "desculpa", "desculpe", "errei", "me enganei",
            "não era", "nao era", "mudei de ideia", "prefiro outro"
        ],
        padroes: [
            /na\s+verdade/i,
            /na\s+realidade/i,
            /quer\s+dizer/i,
            /ou\s+seja/i
        ],
        prioridade: 7
    },
    
    // Perguntas sobre o serviço (dúvidas/FAQ)
    duvida: {
        palavrasChave: [
            // Perguntas gerais
            "quais", "qual", "que", "como", "quanto", "onde", "quando", 
            "por que", "porque", "vocês", "voceis", "tem", "tem como", 
            "é possível", "e possivel", "funciona", "fornecem", "fornece", 
            "aceitam", "aceita", "fazem", "faz", "trabalham", "trabalha",
            "usam", "usa", "opções", "opcoes", "disponíveis", "disponiveis",
            "tipos", "tamanhos", "materiais", "cores", "formas", "locais",
            "pagamento", "pagamentos", "atendimento", "atendem", "atende",
            "trança", "tranças", "opção", "opcao"
        ],
        padroesPergunta: [
            /quais?\s+(tipos?|tamanhos?|materiais?|cores?|formas?|opções?|opcoes?|tranças?|modelos?)/i,
            /que\s+(tipos?|tamanhos?|materiais?|cores?|formas?|tranças?|modelos?)/i,
            /vocês\s+(fazem|trabalham|usam|atendem|aceitam|fornecem|têm|tem)/i,
            /voceis\s+(fazem|trabalham|usam|atendem|aceitam|fornecem|tem)/i,
            /tem\s+(tipos?|tamanhos?|materiais?|cores?|tranças?|box|nagô|nago|twist)/i,
            /tem\s+como\s+(fazer|atender|fornecer)/i,
            /é\s+possível\s+(fazer|atender|fornecer)/i,
            /e\s+possivel\s+(fazer|atender|fornecer)/i,
            /quais?\s+tipo\s+tem/i,
            /qual\s+trança\s+tem/i,
            /quais?\s+tranças?\s+vocês/i,
            /que\s+tranças?\s+vocês/i,
            /vocês\s+fazem\s+quais/i,
            /tem\s+quais\s+tranças?/i,
            /quais?\s+opções?\s+vocês/i,
            /quais?\s+opções?\s+de\s+trança/i,
            /pode\s+(?:me\s+)?mostrar/i,
            /(?:quero|posso|gostaria\s+de)\s+ver/i,
            /me\s+(?:mostra|fala|diz|conta)\s+(?:as|os|quais)/i,
            /(?:tranças?|opções?|modelos?)\s+(?:estão\s+|estao\s+)?disponíveis/i,
            /(?:tranças?|opções?|modelos?)\s+(?:estão\s+|estao\s+)?disponiveis/i
        ],
        prioridade: 8 // Alta prioridade - verificar antes de triagem
    },
    
    // Informações da triagem (extração de dados)
    triagem: {
        tipoTranca: {
            padroes: [
                /quero\s+(?:fazer\s+)?([a-zà-ú\s]+?)\s+(?:trança|tranças|braid|braids)/i,
                /(?:fazer|colocar|quero|gostaria de)\s+([a-zà-ú\s]+)/i,
                /([a-zà-ú]+)\s+(?:trança|tranças|braid|braids)/i
            ],
            campo: "tipoTranca"
        },
        
        tamanho: {
            padroes: [
                /(curto|curta|médio|medio|média|media|longo|longa|grande|pequeno|pequena)/i
            ],
            campo: "tamanho"
        },
        
        cor: {
            padroes: [
                /(preto|preta|marrom|loiro|loira|castanho|castanha|ruivo|ruiva|colorido|colorida|azul|vermelho|vermelha|verde|rosa|roxo|roxa)/i
            ],
            campo: "cor"
        },
        
        local: {
            padroes: [
                /(estúdio|estudio|salão|salao|domicílio|domicilio|casa|em casa|minha casa)/i
            ],
            campo: "localAtendimento",
            formatar: (valor) => {
                const limpo = valor.toLowerCase();
                if (limpo.includes('estúdio') || limpo.includes('estudio') || limpo.includes('salão') || limpo.includes('salao')) {
                    return 'estúdio';
                }
                if (limpo.includes('domicílio') || limpo.includes('domicilio') || limpo.includes('casa')) {
                    return 'domicílio';
                }
                return valor;
            }
        },
        
        material: {
            padroes: [
                /(eu|cliente|meu|minha|tenho|possuo|trancista|johnny|vocês|voce|voceis|fornecido)/i
            ],
            campo: "material",
            formatar: (valor) => {
                const limpo = valor.toLowerCase();
                if (limpo.includes('eu') || limpo.includes('cliente') || limpo.includes('meu') || limpo.includes('minha')) {
                    return 'fornecido pelo cliente';
                }
                if (limpo.includes('trancista') || limpo.includes('johnny') || limpo.includes('vocês') || limpo.includes('voce')) {
                    return 'fornecido pelo trancista';
                }
                return valor;
            }
        },
        
        pagamento: {
            padroes: [
                /(pix|cartão|cartao|dinheiro|transferência|transferencia|débito|debito|crédito|credito)/i
            ],
            campo: "formaPagamento"
        },
        
        data: {
            padroes: [
                /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{1,2}|amanhã|amanha|hoje|semana|próxima|proxima)/i
            ],
            campo: "dataPreferencia"
        },
        
        horario: {
            padroes: [
                /(\d{1,2}:\d{2}|\d{1,2}h|manhã|manha|tarde|noite|período|periodo)/i
            ],
            campo: "horarioPreferencia"
        }
    },
    
    // Respostas para perguntas da triagem
    respostaTriagem: {
        prioridade: 5
    }
};

// Função para detectar se é uma pergunta/dúvida
function ehPergunta(texto) {
    const textoLower = texto.toLowerCase();
    
    // Verificar padrões de pergunta específicos primeiro
    for (const padrao of intents.duvida.padroesPergunta) {
        if (padrao.test(textoLower)) {
            return true;
        }
    }
    
    // Verificar se contém palavras interrogativas fortes
    const palavrasInterrogativas = ["quais", "qual", "que", "como", "quando", "onde", "porque", "por que"];
    const temInterrogativa = palavrasInterrogativas.some(palavra => textoLower.includes(palavra));
    
    // Verificar se é uma pergunta sobre opções/tipos
    const palavrasOpcoes = ["tipo", "tipos", "trança", "tranças", "opção", "opções", "opcoes", "opcao",
                            "tamanho", "tamanhos", "material", "materiais", "cor", "cores", 
                            "forma", "formas", "pagamento", "pagamentos",
                            "modelo", "modelos", "disponível", "disponíveis", "disponiveis", "disponivel"];
    const temPalavraOpcao = palavrasOpcoes.some(palavra => textoLower.includes(palavra));
    
    // Se tem palavra interrogativa E palavra de opção, é provavelmente uma pergunta
    if (temInterrogativa && temPalavraOpcao) {
        return true;
    }
    
    // Verificar padrões de pedido de informação (sem palavras interrogativas tradicionais)
    const padroesInformacao = [
        /pode\s+(?:me\s+)?mostrar/i,
        /(?:quero|posso|gostaria\s+de)\s+ver/i,
        /me\s+(?:mostra|fala|diz|conta|lista)/i,
        /mostr(?:ar?|e)\s+(?:as?\s*|os?\s*)?(?:opções|opcoes|tipos|modelos|tranças)/i
    ];
    if (padroesInformacao.some(padrao => padrao.test(textoLower))) {
        return true;
    }
    
    // Verificar palavras-chave de dúvida (método anterior como fallback)
    const palavrasDuvida = intents.duvida.palavrasChave;
    let contadorPalavras = 0;
    
    for (const palavra of palavrasDuvida) {
        if (textoLower.includes(palavra)) {
            contadorPalavras++;
        }
    }
    
    // Se tiver várias palavras de dúvida, provavelmente é uma pergunta
    return contadorPalavras >= 2;
}

// Função para detectar intenção principal
function detectarIntencao(texto) {
    const textoLower = texto.toLowerCase();
    
    // Verificar atendimento humano primeiro (alta prioridade)
    for (const palavra of intents.atendimentoHumano.palavrasChave) {
        if (textoLower.includes(palavra)) {
            return 'atendimentoHumano';
        }
    }
    
    // Verificar reiniciar
    for (const palavra of intents.reiniciar.palavrasChave) {
        if (textoLower.includes(palavra)) {
            return 'reiniciar';
        }
    }
    
    // Verificar correção
    for (const palavra of intents.correcao.palavrasChave) {
        if (textoLower.includes(palavra)) {
            return 'correcao';
        }
    }
    for (const padrao of intents.correcao.padroes) {
        if (padrao.test(textoLower)) {
            return 'correcao';
        }
    }
    
    // Verificar outras opções
    for (const palavra of intents.outrasOpcoes.palavrasChave) {
        if (textoLower.includes(palavra)) {
            return 'outrasOpcoes';
        }
    }
    
    // Verificar se é uma pergunta/dúvida (antes de triagem)
    if (ehPergunta(texto)) {
        return 'duvida';
    }
    
    // Verificar saudação
    for (const palavra of intents.saudacao.palavrasChave) {
        if (textoLower.includes(palavra)) {
            return 'saudacao';
        }
    }
    
    // Verificar se contém informações da triagem
    const informacoes = extrairInformacoesTriagem(texto);
    if (Object.keys(informacoes).length > 0) {
        return 'triagem';
    }
    
    return 'desconhecido';
}

// Função para extrair informações da triagem do texto
function extrairInformacoesTriagem(texto) {
    const informacoes = {};
    
    for (const [tipo, config] of Object.entries(intents.triagem)) {
        for (const padrao of config.padroes) {
            const match = texto.match(padrao);
            if (match && match[1]) {
                const valor = config.formatar ? config.formatar(match[1]) : match[1].trim();
                informacoes[config.campo] = valor;
                break;
            }
        }
    }
    
    return informacoes;
}

// Função para verificar FAQ
function verificarFAQ(texto) {
    const textoLower = texto.toLowerCase();
    
    for (const item of knowledgeBase.faq) {
        if (!item.ativo) continue;
        
        // Verificar palavras-chave
        for (const palavra of item.palavrasChave) {
            if (textoLower.includes(palavra)) {
                return item;
            }
        }
        
        // Verificar variações
        for (const variacao of item.variacoes) {
            if (textoLower.includes(variacao)) {
                return item;
            }
        }
    }
    
    return null;
}

// Função para responder pergunta usando base de conhecimento
// campoAtual: campo da etapa atual da triagem (ex: 'tipoTranca', 'tamanho') para contexto
function responderPergunta(texto, campoAtual) {
    const textoLower = texto.toLowerCase();
    
    // Mapear tipos de perguntas para respostas
    const respostas = {
        tiposTranca: () => {
            const tipos = Object.values(knowledgeBase.tiposTranca).map(t => t.nome);
            return tipos.length > 0 
                ? `Claro! 😊 Temos:\n${tipos.map(t => `• ${t}`).join('\n')}\n\nQual delas você gostaria de fazer?`
                : 'Não tenho essa informação disponível no momento. Vou sinalizar seu atendimento para o Johnny.';
        },
        
        tamanhos: () => {
            const tamanhos = Object.values(knowledgeBase.tamanhos).map(t => t.nome);
            return tamanhos.length > 0 
                ? `Claro! 😊 Trabalhamos com:\n${tamanhos.map(t => `• ${t}`).join('\n')}\n\nQual tamanho você gostaria?`
                : 'Não tenho essa informação disponível no momento. Vou sinalizar seu atendimento para o Johnny.';
        },
        
        materiais: () => {
            return 'Claro! 😊 O material pode ser:\n• Fornecido por você\n• Fornecido pelo trancista\n\nQual você prefere?';
        },
        
        cores: () => {
            const cores = Object.values(knowledgeBase.cores).map(c => c.nome);
            return cores.length > 0 
                ? `Claro! 😊 Temos:\n${cores.map(c => `• ${c}`).join('\n')}\n\nQual cor você gostaria?`
                : 'Não tenho essa informação disponível no momento. Vou sinalizar seu atendimento para o Johnny.';
        },
        
        locais: () => {
            return 'Claro! 😊 Atendemos:\n• No estúdio\n• Em domicílio\n\nOnde você prefere ser atendida?';
        },
        
        formasPagamento: () => {
            const formas = Object.values(knowledgeBase.formasPagamento).map(f => f.nome);
            return formas.length > 0 
                ? `Claro! 😊 Aceitamos:\n${formas.map(f => `• ${f}`).join('\n')}\n\nQual forma você pretende utilizar?`
                : 'Não tenho essa informação disponível no momento. Vou sinalizar seu atendimento para o Johnny.';
        }
    };
    
    // Mapeamento de campo da etapa para função de resposta (usado como fallback de contexto)
    const campoParaResposta = {
        'tipoTranca': respostas.tiposTranca,
        'tamanho': respostas.tamanhos,
        'material': respostas.materiais,
        'cor': respostas.cores,
        'localAtendimento': respostas.locais,
        'formaPagamento': respostas.formasPagamento
    };
    
    // Verificar se é solicitação de outras opções
    const palavrasOutrasOpcoes = ["outras", "mais", "tem outras", "quais outras", "tem mais"];
    const temOutrasOpcoes = palavrasOutrasOpcoes.some(palavra => textoLower.includes(palavra));
    
    if (temOutrasOpcoes) {
        // Verificar qual categoria pelo texto
        if (textoLower.includes('tipo') || textoLower.includes('trança') || textoLower.includes('tranças')) {
            const tipos = Object.values(knowledgeBase.tiposTranca).map(t => t.nome);
            return tipos.length > 0 
                ? `No momento, estas são as opções disponíveis:\n${tipos.map(t => `• ${t}`).join('\n')}\n\nQual delas você gostaria de fazer?`
                : 'Não tenho essa informação disponível no momento. Vou sinalizar seu atendimento para o Johnny.';
        }
        if (textoLower.includes('tamanho') || textoLower.includes('tamanhos')) return respostas.tamanhos();
        if (textoLower.includes('cor') || textoLower.includes('cores')) return respostas.cores();
        if (textoLower.includes('pagamento') || textoLower.includes('forma')) return respostas.formasPagamento();
        
        // Sem categoria explícita: usar contexto da etapa atual
        if (campoAtual && campoParaResposta[campoAtual]) {
            return campoParaResposta[campoAtual]();
        }
    }
    
    // Verificar se é pergunta sobre um item específico do catálogo
    // Ex: "Vocês fazem box braids?", "Tem nagô?"
    for (const tipo of Object.values(knowledgeBase.tiposTranca)) {
        for (const keyword of tipo.palavrasChave) {
            if (textoLower.includes(keyword)) {
                const tipos = Object.values(knowledgeBase.tiposTranca).map(t => t.nome);
                return `Sim, fazemos ${tipo.nome}! 😊 Nossas opções são:\n${tipos.map(t => `• ${t}`).join('\n')}\n\nGostaria de escolher ${tipo.nome}?`;
            }
        }
    }
    
    // Identificar tipo de pergunta pelo conteúdo do texto
    if (textoLower.includes('tipo') || textoLower.includes('trança') || textoLower.includes('tranças') || textoLower.includes('modelo') || textoLower.includes('modelos')) {
        return respostas.tiposTranca();
    }
    
    if (textoLower.includes('tamanho') || textoLower.includes('tamanhos') || textoLower.includes('comprimento')) {
        return respostas.tamanhos();
    }
    
    if (textoLower.includes('material') || textoLower.includes('materiais')) {
        return respostas.materiais();
    }
    
    if (textoLower.includes('cor') || textoLower.includes('cores') || textoLower.includes('tonalidade')) {
        return respostas.cores();
    }
    
    if (textoLower.includes('local') || textoLower.includes('atendimento') || textoLower.includes('atendem') || textoLower.includes('atende') || textoLower.includes('domicílio') || textoLower.includes('domicilio') || textoLower.includes('casa')) {
        return respostas.locais();
    }
    
    if (textoLower.includes('pagamento') || textoLower.includes('pagamentos') || textoLower.includes('forma') || textoLower.includes('formas') || textoLower.includes('pagar')) {
        return respostas.formasPagamento();
    }
    
    // Se não identificou pelo conteúdo, usar contexto da etapa atual
    if (campoAtual && campoParaResposta[campoAtual]) {
        return campoParaResposta[campoAtual]();
    }
    
    // Verificar FAQ geral
    const itemFAQ = verificarFAQ(texto);
    if (itemFAQ && itemFAQ.resposta && !itemFAQ.resposta.includes('PLACEHOLDER')) {
        return itemFAQ.resposta;
    }
    
    // Não tem resposta na base
    return 'Não tenho essa informação disponível no momento. 😊 Vou sinalizar seu atendimento para o Johnny.';
}

// Exportar para uso no chat.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { intents, detectarIntencao, extrairInformacoesTriagem, verificarFAQ, responderPergunta, ehPergunta };
}

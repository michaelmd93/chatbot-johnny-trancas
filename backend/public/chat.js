// Carregar base de conhecimento, sistema de intenções e serviço de IA
// No navegador, esses arquivos serão carregados via <script> tags

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Inicializar serviço de IA (será configurado pelo backend)
llmService.inicializar({
    apiKey: null, // Será configurado via variáveis de ambiente
    provider: 'openai',
    modelo: 'gpt-3.5-turbo'
});

const estado = {
    // Dados do cliente
    nome: "",
    telefone: "",
    
    // Dados da triagem
    tipoTranca: "",
    tamanho: "",
    material: "",
    cor: "",
    localAtendimento: "",
    formaPagamento: "",
    dataPreferencia: "",
    horarioPreferencia: "",
    
    // Controle do fluxo
    etapaAtual: 0,
    necessitaAtendimentoHumano: false,
    mensagemHumano: "",
    interpretacaoIA: null,
    
    // Controle de interpretação
    ultimaIntencao: null,
    informacoesTemporarias: {}, // Para informações fora da etapa atual
    aguardandoConfirmacao: false
};

const perguntas = [
    {
        campo: 'nome',
        pergunta: 'Para começarmos, qual é o seu nome completo?',
        respostasAcolhedoras: [
            'Para começarmos, qual é o seu nome completo?',
            'Como posso te chamar? Me diz seu nome completo.',
            'Qual é o seu nome completo?'
        ],
        validar: (v) => {
            const limpo = v.trim();
            const palavras = limpo.split(/\s+/);
            return palavras.length >= 2 && palavras.every(p => p.length > 0);
        },
        erro: 'Por favor, informe seu nome completo (nome e sobrenome).',
        formatar: (v) => v.trim()
    },
    {
        campo: 'telefone',
        pergunta: 'Agora, qual telefone posso utilizar para identificar seu atendimento?',
        respostasAcolhedoras: [
            'Prazer! 😊 Agora, qual telefone posso utilizar para identificar seu atendimento?',
            'Obrigado! Qual telefone posso usar para te identificar?',
            'Perfeito! Agora me informa seu telefone, por favor.'
        ],
        validar: (v) => {
            const limpo = v.replace(/\D/g, '');
            return limpo.length >= 10 && limpo.length <= 11;
        },
        erro: 'Pode me informar um telefone válido, por favor? 😊',
        formatar: (v) => v.replace(/\D/g, '')
    },
    {
        campo: 'tipoTranca',
        pergunta: 'Qual tipo de trança você gostaria de fazer?',
        respostasAcolhedoras: [
            'Obrigado! Vamos continuar. Qual tipo de trança você gostaria de fazer?',
            'Perfeito! Agora me conta: qual tipo de trança você deseja?',
            'Ótimo! Que tipo de trança você está pensando?'
        ],
        validar: (v) => {
            const limpo = v.trim().toLowerCase();
            // Verificar se é uma opção válida de tipo de trança
            const tiposValidos = ['box', 'box braids', 'braids', 'nagô', 'nago', 'twist', 'twists'];
            return tiposValidos.some(tipo => limpo.includes(tipo));
        },
        erro: 'Por favor, informe um tipo de trança válido (Box Braids, Nagô ou Twists).',
        formatar: (v) => {
            const limpo = v.trim().toLowerCase();
            if (limpo.includes('box')) return 'Box Braids';
            if (limpo.includes('nagô') || limpo.includes('nago')) return 'Nagô';
            if (limpo.includes('twist')) return 'Twists';
            return v.trim();
        }
    },
    {
        campo: 'tamanho',
        pergunta: 'Qual tamanho você deseja?',
        respostasAcolhedoras: [
            'Ótimo! Para eu entender melhor sua preferência, qual tamanho você gostaria?',
            'Perfeito! Qual tamanho de trança você está buscando?',
            'Legal! Me conta: qual o comprimento ideal para você?'
        ],
        validar: (v) => {
            const limpo = v.trim().toLowerCase();
            const tamanhosValidos = ['curto', 'curta', 'médio', 'medio', 'média', 'media', 'longo', 'longa', 'grande', 'pequeno', 'pequena'];
            return tamanhosValidos.some(tamanho => limpo.includes(tamanho));
        },
        erro: 'Por favor, informe um tamanho válido (Curto, Médio ou Longo).',
        formatar: (v) => {
            const limpo = v.trim().toLowerCase();
            if (limpo.includes('curto') || limpo.includes('curta') || limpo.includes('pequeno') || limpo.includes('pequena')) return 'Curto';
            if (limpo.includes('médio') || limpo.includes('medio') || limpo.includes('média') || limpo.includes('media')) return 'Médio';
            if (limpo.includes('longo') || limpo.includes('longa') || limpo.includes('grande')) return 'Longo';
            return v.trim();
        }
    },
    {
        campo: 'material',
        pergunta: 'O material será fornecido por você ou pelo trancista?',
        respostasAcolhedoras: [
            'Certo! 💜 Você já possui o material ou prefere que ele seja fornecido pelo trancista?',
            'Entendi! Você vai trazer o material ou prefere que o Johnny forneça?',
            'Ok! Quem vai fornecer o material para as tranças?'
        ],
        validar: (v) => {
            const limpo = v.trim().toLowerCase();
            const respostasCliente = ['eu', 'cliente', 'meu', 'minha', 'tenho', 'vou levar', 'levo'];
            const respostasTrancista = ['trancista', 'johnny', 'vocês', 'voce', 'voceis', 'fornecido'];
            return respostasCliente.some(resp => limpo.includes(resp)) || respostasTrancista.some(resp => limpo.includes(resp));
        },
        erro: 'Por favor, informe se o material será fornecido por você ou pelo trancista.',
        formatar: (v) => {
            const limpo = v.trim().toLowerCase();
            const respostasCliente = ['eu', 'cliente', 'meu', 'minha', 'tenho', 'vou levar', 'levo'];
            if (respostasCliente.some(resp => limpo.includes(resp))) return 'fornecido pelo cliente';
            return 'fornecido pelo trancista';
        }
    },
    {
        campo: 'cor',
        pergunta: 'Qual cor você deseja?',
        respostasAcolhedoras: [
            'Perfeito! Qual cor você gostaria para as tranças?',
            'Ótimo! Qual tonalidade você prefere?',
            'Legal! Me fala a cor que você tem em mente.'
        ],
        validar: (v) => {
            const limpo = v.trim().toLowerCase();
            const coresValidas = ['preto', 'preta', 'marrom', 'loiro', 'loira', 'castanho', 'castanha', 'ruivo', 'ruiva', 'colorido', 'colorida', 'azul', 'vermelho', 'vermelha', 'verde', 'rosa', 'roxo', 'roxa'];
            return coresValidas.some(cor => limpo.includes(cor));
        },
        erro: 'Por favor, informe uma cor válida.',
        formatar: (v) => {
            const limpo = v.trim().toLowerCase();
            if (limpo.includes('preto') || limpo.includes('preta')) return 'Preto';
            if (limpo.includes('marrom') || limpo.includes('castanho') || limpo.includes('castanha')) return 'Marrom';
            if (limpo.includes('loiro') || limpo.includes('loira')) return 'Loiro';
            return v.trim();
        }
    },
    {
        campo: 'localAtendimento',
        pergunta: 'O atendimento será no estúdio ou em domicílio?',
        respostasAcolhedoras: [
            'Certo! O atendimento será no estúdio ou em domicílio?',
            'Ok! Você prefere ser atendida no estúdio ou em casa?',
            'Entendi! Onde você gostaria de fazer as tranças?'
        ],
        validar: (v) => {
            const limpo = v.trim().toLowerCase();
            return limpo === 'estúdio' || limpo === 'estudio' || limpo === 'domicílio' || limpo === 'domicilio';
        },
        erro: 'Por favor, responda apenas "estúdio" ou "domicílio".',
        formatar: (v) => {
            const limpo = v.trim().toLowerCase();
            if (limpo === 'estudio') return 'estúdio';
            if (limpo === 'domicilio') return 'domicílio';
            return limpo;
        }
    },
    {
        campo: 'formaPagamento',
        pergunta: 'Qual forma de pagamento você pretende utilizar?',
        respostasAcolhedoras: [
            'Entendi! Como você pretende pagar?',
            'Ok! Qual será a forma de pagamento?',
            'Quanto ao pagamento, como você prefere fazer?'
        ],
        validar: (v) => v.trim().length > 0,
        erro: 'Por favor, informe a forma de pagamento.'
    },
    {
        campo: 'dataPreferencia',
        pergunta: 'Qual é a data de sua preferência?',
        respostasAcolhedoras: [
            'Quase lá! Qual data funciona melhor para você?',
            'Para finalizarmos, quando você gostaria de fazer as tranças?',
            'Sobre a data, qual seria sua preferência?'
        ],
        validar: (v) => v.trim().length > 0,
        erro: 'Por favor, informe a data de preferência.'
    },
    {
        campo: 'horarioPreferencia',
        pergunta: 'Qual horário você prefere?',
        respostasAcolhedoras: [
            'Por fim, qual horário seria ideal para você?',
            'E qual horário você prefere?',
            'Me diz que horário funciona melhor.'
        ],
        validar: (v) => v.trim().length > 0,
        erro: 'Por favor, informe o horário de preferência.'
    }
];

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = content;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    const now = new Date();
    messageTime.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSummary() {
    const summaryHTML = `
        <p>Perfeito! Confira as informações da sua solicitação:</p>
        <div class="summary">
            <div class="summary-item">
                <span class="summary-label">Nome:</span>
                <span class="summary-value">${estado.nome}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Telefone:</span>
                <span class="summary-value">${estado.telefone}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Tipo de trança:</span>
                <span class="summary-value">${estado.tipoTranca}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Tamanho:</span>
                <span class="summary-value">${estado.tamanho}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Material:</span>
                <span class="summary-value">${estado.material}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Cor:</span>
                <span class="summary-value">${estado.cor}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Local de atendimento:</span>
                <span class="summary-value">${estado.localAtendimento}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Forma de pagamento:</span>
                <span class="summary-value">${estado.formaPagamento}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Data de preferência:</span>
                <span class="summary-value">${estado.dataPreferencia}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Horário de preferência:</span>
                <span class="summary-value">${estado.horarioPreferencia}</span>
            </div>
        </div>
        <p>Suas informações foram organizadas e serão encaminhadas para o Johnny analisar.</p>
        <p><strong>Aguardando análise do Johnny.</strong></p>
        <p class="restart-hint">Digite <strong>"reiniciar"</strong> para começar uma nova triagem.</p>
    `;
    
    addMessage(summaryHTML);
}

function addMensagemHumano() {
    const mensagemHTML = `
        <div class="summary">
            <h3>📞 Atendimento Humano</h3>
            <p><strong>Solicitação registrada!</strong></p>
            <p>Seu atendimento foi sinalizado para o Johnny.</p>
            ${estado.mensagemHumano ? `<p><em>Dúvida: "${estado.mensagemHumano}"</em></p>` : ''}
        </div>
        <p>Você pode continuar a triagem ou aguardar o contato do Johnny.</p>
        <p class="restart-hint">Digite <strong>"reiniciar"</strong> para começar uma nova triagem.</p>
    `;
    
    addMessage(mensagemHTML);
}

function obterCampoAtual() {
    if (estado.etapaAtual < perguntas.length) {
        return perguntas[estado.etapaAtual].campo;
    }
    return null;
}

function obterRespostaAcolhedora(pergunta) {
    if (pergunta.respostasAcolhedoras && pergunta.respostasAcolhedoras.length > 0) {
        const indice = Math.floor(Math.random() * pergunta.respostasAcolhedoras.length);
        return pergunta.respostasAcolhedoras[indice];
    }
    return pergunta.pergunta;
}

function fazerPergunta() {
    if (estado.etapaAtual < perguntas.length) {
        setTimeout(() => {
            const pergunta = perguntas[estado.etapaAtual];
            let resposta;
            
            // Se é a pergunta de telefone e o nome foi preenchido, usar mensagem personalizada
            if (pergunta.campo === 'telefone' && estado.nome) {
                const primeiroNome = estado.nome.split(/\s+/)[0];
                resposta = `Prazer, ${primeiroNome}! 😊 Agora, qual telefone posso utilizar para identificar seu atendimento?`;
            } else {
                resposta = obterRespostaAcolhedora(pergunta);
            }
            
            addMessage(resposta);
        }, 500);
    } else {
        setTimeout(() => {
            addSummary();
            userInput.placeholder = 'Digite "reiniciar" para nova triagem';
        }, 500);
    }
}

function verificarInformacoesFaltantes() {
    const camposObrigatorios = ['nome', 'telefone', 'tipoTranca', 'tamanho', 'material', 'cor', 'localAtendimento', 'formaPagamento', 'dataPreferencia', 'horarioPreferencia'];
    
    for (const campo of camposObrigatorios) {
        if (!estado[campo] || estado[campo].trim() === '') {
            // Encontrar o índice da pergunta correspondente
            const indice = perguntas.findIndex(p => p.campo === campo);
            if (indice !== -1) {
                return indice;
            }
        }
    }
    
    return perguntas.length; // Todos os campos preenchidos
}

function normalizarCampo(campo, valor) {
    if (!valor) return valor;
    
    const normalizacoes = {
        'local_atendimento': (v) => {
            const limpo = v.toLowerCase();
            if (limpo.includes('estúdio') || limpo.includes('estudio') || limpo.includes('salão')) return 'estúdio';
            if (limpo.includes('domicílio') || limpo.includes('domicilio') || limpo.includes('casa')) return 'domicílio';
            return v;
        },
        'material': (v) => {
            const limpo = v.toLowerCase();
            if (limpo.includes('cliente') || limpo.includes('eu') || limpo.includes('meu') || limpo.includes('tenho') || limpo.includes('vou levar')) return 'fornecido pelo cliente';
            if (limpo.includes('trancista') || limpo.includes('johnny') || limpo.includes('vocês')) return 'fornecido pelo trancista';
            return v;
        },
        'tipo_tranca': (v) => {
            // Normalizar nomes de tranças conhecidas
            const limpo = v.toLowerCase();
            if (limpo.includes('box')) return 'Box Braids';
            if (limpo.includes('nagô') || limpo.includes('nago')) return 'Nagô';
            if (limpo.includes('twist')) return 'Twists';
            return v;
        },
        'telefone': (v) => {
            // Normalizar telefone removendo caracteres não numéricos
            return v.replace(/\D/g, '');
        },
        'horario_preferencia': (v) => {
            const limpo = v.toLowerCase();
            // Normalizar horários
            if (limpo.includes('h')) {
                const match = limpo.match(/(\d{1,2})h(\d{0,2})/);
                if (match) {
                    const hora = match[1];
                    const minuto = match[2] || '00';
                    return `${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}`;
                }
            }
            if (limpo.includes('tarde')) {
                const match = limpo.match(/(\d{1,2})/);
                if (match) {
                    const hora = parseInt(match[1]) + 12;
                    return `${hora}:00`;
                }
            }
            return v;
        }
    };
    
    const normalizar = normalizacoes[campo];
    return normalizar ? normalizar(valor) : valor;
}

function aplicarInformacoesTriagem(informacoes) {
    const camposMapeados = {
        'nome': 'nome',
        'telefone': 'telefone',
        'tipo_tranca': 'tipoTranca',
        'tamanho': 'tamanho',
        'material': 'material',
        'cor': 'cor',
        'local_atendimento': 'localAtendimento',
        'forma_pagamento': 'formaPagamento',
        'data_preferencia': 'dataPreferencia',
        'horario_preferencia': 'horarioPreferencia'
    };
    
    for (const [campo, valor] of Object.entries(informacoes)) {
        if (valor && valor.toString().trim() !== '') {
            const campoEstado = camposMapeados[campo] || campo;
            const valorNormalizado = normalizarCampo(campo, valor);
            estado[campoEstado] = valorNormalizado;
        }
    }
    
    // Atualizar etapaAtual para o próximo campo faltante
    estado.etapaAtual = verificarInformacoesFaltantes();
}

function reiniciarTriagem() {
    estado.nome = "";
    estado.telefone = "";
    estado.tipoTranca = "";
    estado.tamanho = "";
    estado.material = "";
    estado.cor = "";
    estado.localAtendimento = "";
    estado.formaPagamento = "";
    estado.dataPreferencia = "";
    estado.horarioPreferencia = "";
    estado.etapaAtual = 0;
    estado.necessitaAtendimentoHumano = false;
    estado.mensagemHumano = "";
    estado.interpretacaoIA = null;
    estado.ultimaIntencao = null;
    estado.informacoesTemporarias = {};
    estado.aguardandoConfirmacao = false;
    
    chatMessages.innerHTML = '';
    
    addMessage(`<p>${knowledgeBase.mensagens.saudacao}</p>`);
    fazerPergunta();
    userInput.placeholder = 'Digite sua resposta...';
    userInput.disabled = false;
    sendButton.disabled = false;
}

async function processarResposta(resposta) {
    const respostaLower = resposta.toLowerCase();
    
    // Verificar intenção de reiniciar
    if (respostaLower === 'reiniciar') {
        reiniciarTriagem();
        return;
    }
    
    // PRIORIDADE: Detectar intenção primeiro - verificar se é pergunta, comando, etc.
    const intencao = detectarIntencao(resposta);
    estado.ultimaIntencao = intencao;
    
    // Se é uma pergunta/dúvida, responder e manter etapa atual
    if (intencao === 'duvida' || intencao === 'outrasOpcoes') {
        addMessage(resposta, true);
        
        setTimeout(() => {
            const respostaPergunta = responderPergunta(resposta, obterCampoAtual());
            addMessage(respostaPergunta);
            
            // Verificar se precisa de atendimento humano
            if (respostaPergunta.includes('Vou sinalizar')) {
                estado.necessitaAtendimentoHumano = true;
                estado.mensagemHumano = resposta;
            }
            
            // Retornar à pergunta pendente (não avança etapa)
            setTimeout(() => {
                fazerPergunta();
            }, 1500);
        }, 500);
        return;
    }
    
    // Se é atendimento humano, processar imediatamente
    if (intencao === 'atendimentoHumano') {
        estado.necessitaAtendimentoHumano = true;
        estado.mensagemHumano = resposta;
        addMessage(resposta, true);
        setTimeout(() => {
            addMessage(knowledgeBase.mensagens.encaminhamentoHumano);
            setTimeout(() => {
                addMensagemHumano();
            }, 500);
        }, 500);
        return;
    }
    
    // Se é correção, processar correção
    if (intencao === 'correcao') {
        addMessage(resposta, true);
        setTimeout(() => {
            addMessage('Entendi! Você gostaria de corrigir alguma informação. 😊 Me diga qual campo você gostaria de alterar.');
            setTimeout(() => {
                fazerPergunta();
            }, 1000);
        }, 500);
        return;
    }
    
    // Se é saudação, responder apropriadamente
    if (intencao === 'saudacao') {
        addMessage(resposta, true);
        setTimeout(() => {
            addMessage('Olá! Como posso ajudar você hoje? 😊');
            // Se está no início, fazer a primeira pergunta
            if (estado.etapaAtual === 0 && !estado.nome) {
                setTimeout(() => {
                    fazerPergunta();
                }, 1000);
            }
        }, 500);
        return;
    }
    
    // Se estamos em uma etapa de triagem ativa, processar como resposta
    if (estado.etapaAtual < perguntas.length) {
        const pergunta = perguntas[estado.etapaAtual];
        
        // Se a resposta é válida para a pergunta atual, processar diretamente
        if (pergunta.validar(resposta)) {
            const valorFormatado = pergunta.formatar ? pergunta.formatar(resposta) : resposta.trim();
            estado[pergunta.campo] = valorFormatado;
            estado.etapaAtual++;
            
            addMessage(resposta, true);
            fazerPergunta();
            return;
        } else {
            // Resposta inválida para a pergunta atual
            addMessage(resposta, true);
            setTimeout(() => {
                addMessage(pergunta.erro);
            }, 500);
            return;
        }
    }
    
    // Tentar interpretar com IA primeiro
    let interpretacaoIA = null;
    if (llmService.estaDisponivel()) {
        interpretacaoIA = await llmService.interpretarMensagem(resposta, estado);
        estado.interpretacaoIA = interpretacaoIA;
    }
    
    // Se IA retornou resultado válido, usar interpretação da IA
    if (interpretacaoIA && interpretacaoIA.confianca > 0.5) {
        processarInterpretacaoIA(resposta, interpretacaoIA);
        return;
    }
    
    // Fallback: usar lógica determinística
    processarRespostaDeterministica(resposta);
}

function processarInterpretacaoIA(resposta, interpretacao) {
    addMessage(resposta, true);
    estado.ultimaIntencao = interpretacao.intencao;
    
    // Verificar intenção detectada pela IA
    switch (interpretacao.intencao) {
        case 'atendimento_humano':
            estado.necessitaAtendimentoHumano = true;
            estado.mensagemHumano = resposta;
            setTimeout(() => {
                addMessage(knowledgeBase.mensagens.encaminhamentoHumano);
                setTimeout(() => {
                    addMensagemHumano();
                }, 500);
            }, 500);
            return;
            
        case 'saudacao':
            setTimeout(() => {
                addMessage('Olá! Como posso ajudar você hoje? 😊');
                // Se está no início, fazer a primeira pergunta
                if (estado.etapaAtual === 0 && !estado.nome) {
                    setTimeout(() => {
                        fazerPergunta();
                    }, 1000);
                }
            }, 500);
            return;
            
        case 'reiniciar':
            reiniciarTriagem();
            return;
            
        case 'correcao':
            setTimeout(() => {
                addMessage('Entendi! Você gostaria de corrigir alguma informação. 😊 Me diga qual campo você gostaria de alterar.');
                setTimeout(() => {
                    fazerPergunta();
                }, 1000);
            }, 500);
            return;
            
        case 'interesse_servico':
        case 'resposta_triagem':
            // Aplicar dados extraídos pela IA
            if (interpretacao.dados_extraidos) {
                aplicarInformacoesTriagem(interpretacao.dados_extraidos);
                
                setTimeout(() => {
                    // Verificar se todas as informações foram coletadas
                    if (estado.etapaAtual >= perguntas.length) {
                        addSummary();
                        userInput.placeholder = 'Digite "reiniciar" para nova triagem';
                    } else {
                        fazerPergunta();
                    }
                }, 500);
            } else {
                // IA não extraiu dados úteis, continuar com lógica normal
                processarRespostaDeterministica(resposta);
            }
            return;
            
        case 'duvida_servico':
        case 'faq':
            // Responder pergunta usando base de conhecimento
            setTimeout(() => {
                const respostaPergunta = responderPergunta(resposta, obterCampoAtual());
                addMessage(respostaPergunta);
                
                // Verificar se precisa de atendimento humano
                if (respostaPergunta.includes('Vou sinalizar')) {
                    estado.necessitaAtendimentoHumano = true;
                    estado.mensagemHumano = resposta;
                }
                
                // Retornar à pergunta pendente (não avança etapa)
                setTimeout(() => {
                    fazerPergunta();
                }, 1500);
            }, 500);
            return;
            
        case 'desconhecido':
        default:
            // Mensagem não interpretada com segurança
            setTimeout(() => {
                addMessage('Não consegui entender essa parte da sua solicitação. 😊 Pode me explicar um pouco melhor?');
                // Continuar a triagem
                setTimeout(() => {
                    fazerPergunta();
                }, 1000);
            }, 500);
            return;
    }
}

function processarRespostaDeterministica(resposta) {
    // Detectar intenção usando lógica determinística
    const intencao = detectarIntencao(resposta);
    estado.ultimaIntencao = intencao;
    
    switch (intencao) {
        case 'atendimentoHumano':
            estado.necessitaAtendimentoHumano = true;
            estado.mensagemHumano = resposta;
            addMessage(resposta, true);
            setTimeout(() => {
                addMessage(knowledgeBase.mensagens.encaminhamentoHumano);
                setTimeout(() => {
                    addMensagemHumano();
                }, 500);
            }, 500);
            return;
            
        case 'reiniciar':
            reiniciarTriagem();
            return;
            
        case 'correcao':
            // Processar correção de informação
            addMessage(resposta, true);
            setTimeout(() => {
                addMessage('Entendi! Você gostaria de corrigir alguma informação. 😊 Me diga qual campo você gostaria de alterar.');
                // Manter na mesma etapa para correção
                setTimeout(() => {
                    fazerPergunta();
                }, 1000);
            }, 500);
            return;
            
        case 'outrasOpcoes':
            // Cliente quer ver outras opções
            addMessage(resposta, true);
            setTimeout(() => {
                const respostaOpcoes = responderPergunta(resposta, obterCampoAtual());
                addMessage(respostaOpcoes);
                
                // Retornar à pergunta pendente
                setTimeout(() => {
                    fazerPergunta();
                }, 1500);
            }, 500);
            return;
            
        case 'saudacao':
            addMessage(resposta, true);
            setTimeout(() => {
                addMessage('Olá! Como posso ajudar você hoje? 😊');
                // Se está no início, fazer a primeira pergunta
                if (estado.etapaAtual === 0 && !estado.nome) {
                    setTimeout(() => {
                        fazerPergunta();
                    }, 1000);
                }
            }, 500);
            return;
            
        case 'duvida':
            // Cliente fez uma pergunta - responder e retornar à etapa pendente
            addMessage(resposta, true);
            
            setTimeout(() => {
                const respostaPergunta = responderPergunta(resposta, obterCampoAtual());
                addMessage(respostaPergunta);
                
                // Verificar se precisa de atendimento humano
                if (respostaPergunta.includes('Vou sinalizar')) {
                    estado.necessitaAtendimentoHumano = true;
                    estado.mensagemHumano = resposta;
                }
                
                // Retornar à pergunta pendente (não avança etapa)
                setTimeout(() => {
                    fazerPergunta();
                }, 1500);
            }, 500);
            return;
            
        case 'triagem':
            // Extrair informações da triagem do texto
            const informacoes = extrairInformacoesTriagem(resposta);
            if (Object.keys(informacoes).length > 0) {
                addMessage(resposta, true);
                aplicarInformacoesTriagem(informacoes);
                
                setTimeout(() => {
                    // Verificar se todas as informações foram coletadas
                    if (estado.etapaAtual >= perguntas.length) {
                        addSummary();
                        userInput.placeholder = 'Digite "reiniciar" para nova triagem';
                    } else {
                        fazerPergunta();
                    }
                }, 500);
                return;
            }
            break;
            
        case 'desconhecido':
            // Se está no meio da triagem e a resposta não é reconhecida,
            // tratar como resposta para a pergunta atual
            if (estado.etapaAtual < perguntas.length) {
                const pergunta = perguntas[estado.etapaAtual];
                
                if (!pergunta.validar(resposta)) {
                    addMessage(resposta, true);
                    setTimeout(() => {
                        addMessage(pergunta.erro);
                    }, 500);
                    return;
                }
                
                const valorFormatado = pergunta.formatar ? pergunta.formatar(resposta) : resposta.trim();
                estado[pergunta.campo] = valorFormatado;
                estado.etapaAtual++;
                
                addMessage(resposta, true);
                fazerPergunta();
                return;
            } else {
                // Triagem já concluída
                addMessage(resposta, true);
                setTimeout(() => {
                    addMessage('A triagem já foi concluída. Digite <strong>"reiniciar"</strong> para começar novamente.');
                }, 500);
                return;
            }
    }
    
    // Se chegou aqui e está na triagem, processar como resposta normal
    if (estado.etapaAtual < perguntas.length) {
        const pergunta = perguntas[estado.etapaAtual];
        
        if (!pergunta.validar(resposta)) {
            addMessage(resposta, true);
            setTimeout(() => {
                addMessage(pergunta.erro);
            }, 500);
            return;
        }
        
        const valorFormatado = pergunta.formatar ? pergunta.formatar(resposta) : resposta.trim();
        estado[pergunta.campo] = valorFormatado;
        estado.etapaAtual++;
        
        addMessage(resposta, true);
        fazerPergunta();
    }
}

function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    processarResposta(message);
    userInput.value = '';
}

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Iniciar conversa
addMessage(`<p>${knowledgeBase.mensagens.saudacao}</p>`);
fazerPergunta();
userInput.focus();

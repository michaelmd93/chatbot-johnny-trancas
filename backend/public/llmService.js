// Serviço de Interpretação de Linguagem Natural (IA/NLP)
// Integração com provedores de LLM (OpenAI, Anthropic, etc.)

const llmService = {
    // Configuração do provedor de IA
    config: {
        // Será preenchido via variáveis de ambiente no backend
        apiKey: null,
        provider: null, // 'openai', 'anthropic', etc.
        modelo: null,
        disponivel: false
    },
    
    // Prompt para interpretação de mensagens
    promptSistema: `Você é um assistente de interpretação de linguagem natural para um chatbot de triagem de tranças.

Sua função é extrair informações estruturadas das mensagens do cliente.

CAMPOS A EXTRAIR:
- nome: nome do cliente
- tipo_tranca: tipo de trança desejada (ex: box braids, nagô, twists, etc.)
- tamanho: tamanho da trança (ex: curto, médio, longo)
- material: quem fornece o material ("fornecido pelo cliente" ou "fornecido pelo trancista")
- cor: cor da trança
- local_atendimento: "estúdio" ou "domicílio"
- forma_pagamento: forma de pagamento pretendida
- data_preferencia: data de preferência para atendimento
- horario_preferencia: horário de preferência

INTENÇÕES A IDENTIFICAR:
- saudacao: cumprimentos, "oi", "olá", etc.
- interesse_servico: demonstrar interesse em fazer tranças
- resposta_triagem: resposta à pergunta atual da triagem
- duvida_servico: pergunta sobre serviços, materiais, locais, etc.
- faq: pergunta frequente
- atendimento_humano: pedir para falar com uma pessoa/Johnny
- correcao: corrigir informação anterior
- reiniciar: pedir para recomeçar
- desconhecido: mensagem sem informação útil

REGRAS:
1. NUNCA invente informações que não estejam na mensagem
2. Se um campo não for mencionado, retorne null
3. Para local_atendimento, normalize para "estúdio" ou "domicílio"
4. Para material, normalize para "fornecido pelo cliente" ou "fornecido pelo trancista"
5. Se houver ambiguidade, marque em campos_ambiguous
6. Retorne confiança de 0 a 1 (0=baixa, 1=alta)

FORMATO DE RESPOSTA (JSON):
{
  "intencao": "nome_da_intencao",
  "dados_extraidos": {
    "nome": null,
    "tipo_tranca": null,
    "tamanho": null,
    "material": null,
    "cor": null,
    "local_atendimento": null,
    "forma_pagamento": null,
    "data_preferencia": null,
    "horario_preferencia": null
  },
  "campos_ambiguous": [],
  "confianca": 0.0,
  "mensagem_erro": null
}

Responda APENAS com o JSON, sem texto adicional.`,
    
    // Inicializar configuração
    inicializar(config) {
        this.config.apiKey = config.apiKey || null;
        this.config.provider = config.provider || 'openai';
        this.config.modelo = config.modelo || 'gpt-3.5-turbo';
        this.config.disponivel = !!(config.apiKey && config.apiKey.trim() !== '');
        
        console.log(`🤖 Serviço de IA ${this.config.disponivel ? 'inicializado' : 'não configurado'}`);
        return this.config.disponivel;
    },
    
    // Interpretar mensagem usando IA
    async interpretarMensagem(mensagem, contexto = {}) {
        // Se IA não disponível, retornar null para usar fallback
        if (!this.config.disponivel) {
            return null;
        }
        
        try {
            // Preparar prompt com contexto
            const promptUsuario = this.prepararPromptUsuario(mensagem, contexto);
            
            // Chamar API da IA (implementação simulada para demonstração)
            const resposta = await this.chamarAPI(promptUsuario);
            
            // Processar resposta
            const dadosInterpretados = this.processarResposta(resposta);
            
            return dadosInterpretados;
            
        } catch (error) {
            console.error('❌ Erro na interpretação de IA:', error);
            return null; // Fallback para lógica determinística
        }
    },
    
    // Preparar prompt com contexto da conversa
    prepararPromptUsuario(mensagem, contexto) {
        const contextoStr = contexto ? `\nCONTEXTO DA CONVERSA:\n${JSON.stringify(contexto, null, 2)}\n` : '';
        
        return `${contextoStr}
MENSAGEM DO CLIENTE:
"${mensagem}"

Extraia as informações e retorne no formato JSON especificado.`;
    },
    
    // Chamar API da IA (implementação base - pode ser adaptada para diferentes provedores)
    async chamarAPI(prompt) {
        // Esta é uma implementação simulada
        // Em produção, fazer chamada real para API da OpenAI/Anthropic/etc.
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simular resposta da IA baseada em padrões simples
        // Na implementação real, isso seria a resposta da API
        return this.simularRespostaIA(prompt);
    },
    
    // Simular resposta da IA (para desenvolvimento/fallback)
    simularRespostaIA(prompt) {
        // Extrair mensagem do prompt
        const mensagemMatch = prompt.match(/"([^"]+)"/);
        const mensagem = mensagemMatch ? mensagemMatch[1] : '';
        
        // Lógica simples de simulação baseada em palavras-chave
        const mensagemLower = mensagem.toLowerCase();
        
        // Detectar intenção
        let intencao = 'desconhecido';
        if (mensagemLower.includes('oi') || mensagemLower.includes('olá') || mensagemLower.includes('ola')) {
            intencao = 'saudacao';
        } else if (mensagemLower.includes('johnny') || mensagemLower.includes('pessoa') || mensagemLower.includes('humano')) {
            intencao = 'atendimento_humano';
        } else if (mensagemLower.includes('reiniciar') || mensagemLower.includes('recomeçar')) {
            intencao = 'reiniciar';
        } else if (mensagemLower.includes('quero') || mensagemLower.includes('fazer') || mensagemLower.includes('trança')) {
            intencao = 'interesse_servico';
        }
        
        // Extrair dados básicos
        const dados = {
            nome: null,
            tipo_tranca: null,
            tamanho: null,
            material: null,
            cor: null,
            local_atendimento: null,
            forma_pagamento: null,
            data_preferencia: null,
            horario_preferencia: null
        };
        
        // Detectar tipo de trança
        if (mensagemLower.includes('box')) dados.tipo_tranca = 'Box Braids';
        if (mensagemLower.includes('nagô') || mensagemLower.includes('nago')) dados.tipo_tranca = 'Nagô';
        if (mensagemLower.includes('twist')) dados.tipo_tranca = 'Twists';
        
        // Detectar tamanho
        if (mensagemLower.includes('curto') || mensagemLower.includes('curta')) dados.tamanho = 'Curto';
        if (mensagemLower.includes('médio') || mensagemLower.includes('medio') || mensagemLower.includes('média') || mensagemLower.includes('media')) dados.tamanho = 'Médio';
        if (mensagemLower.includes('longo') || mensagemLower.includes('longa')) dados.tamanho = 'Longo';
        
        // Detectar cor
        if (mensagemLower.includes('preto') || mensagemLower.includes('preta')) dados.cor = 'Preto';
        if (mensagemLower.includes('marrom')) dados.cor = 'Marrom';
        if (mensagemLower.includes('loiro') || mensagemLower.includes('loira')) dados.cor = 'Loiro';
        
        // Detectar local
        if (mensagemLower.includes('estúdio') || mensagemLower.includes('estudio') || mensagemLower.includes('salão')) {
            dados.local_atendimento = 'estúdio';
        }
        if (mensagemLower.includes('casa') || mensagemLower.includes('domicílio') || mensagemLower.includes('domicilio')) {
            dados.local_atendimento = 'domicílio';
        }
        
        // Detectar material
        if (mensagemLower.includes('meu') || mensagemLower.includes('minha') || mensagemLower.includes('eu tenho')) {
            dados.material = 'fornecido pelo cliente';
        }
        if (mensagemLower.includes('trancista') || mensagemLower.includes('johnny') || mensagemLower.includes('vocês')) {
            dados.material = 'fornecido pelo trancista';
        }
        
        return JSON.stringify({
            intencao: intencao,
            dados_extraidos: dados,
            campos_ambiguous: [],
            confianca: dados.tipo_tranca ? 0.8 : 0.3,
            mensagem_erro: null
        });
    },
    
    // Processar resposta da IA
    processarResposta(resposta) {
        try {
            // Tentar parsear JSON
            const dados = JSON.parse(resposta);
            
            // Validar estrutura
            if (!dados.intencao || !dados.dados_extraidos) {
                console.warn('⚠️ Resposta da IA com formato inválido');
                return null;
            }
            
            return dados;
            
        } catch (error) {
            console.error('❌ Erro ao processar resposta da IA:', error);
            return null;
        }
    },
    
    // Verificar se está disponível
    estaDisponivel() {
        return this.config.disponivel;
    },
    
    // Configurar provedor específico
    configurarProvedor(provider, config) {
        switch (provider) {
            case 'openai':
                return this.configurarOpenAI(config);
            case 'anthropic':
                return this.configurarAnthropic(config);
            default:
                console.warn(`⚠️ Provedor de IA não suportado: ${provider}`);
                return false;
        }
    },
    
    // Configuração para OpenAI (implementação futura)
    configurarOpenAI(config) {
        this.config.provider = 'openai';
        this.config.modelo = config.modelo || 'gpt-3.5-turbo';
        // Implementar chamada real para OpenAI aqui
        return true;
    },
    
    // Configuração para Anthropic (implementação futura)
    configurarAnthropic(config) {
        this.config.provider = 'anthropic';
        this.config.modelo = config.modelo || 'claude-3-sonnet';
        // Implementar chamada real para Anthropic aqui
        return true;
    }
};

// Exportar para uso no chat.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = llmService;
}

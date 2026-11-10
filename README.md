# Chatbot Johnny Tranças

Chatbot de triagem de clientes para o serviço Johnny Tranças. Coleta dados do cliente (nome, telefone) e do serviço desejado (tipo de trança, tamanho, material, cor, local, pagamento, data e horário) através de uma conversa guiada, organiza as informações e as encaminha para análise do responsável.

## Objetivo

Automatizar a triagem inicial de clientes, reduzindo mensagens manuais repetitivas. O chatbot não realiza agendamento, não calcula preços e não confirma disponibilidade — a decisão final fica com o Johnny.

## Tecnologias

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5 + CSS3 + JavaScript (servido estaticamente pelo Express em `backend/public/`)
- **Variáveis de ambiente**: dotenv

Observação: o projeto declara `sequelize` e `mysql2` como dependências e inclui um `database/schema.sql` preparado para uso futuro, mas o fluxo atual do chatbot não utiliza banco de dados.

## Estrutura do Projeto

```
CHATBOT/
├── backend/
│   ├── public/               # Frontend do chat (HTML/CSS/JS)
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── chat.js           # Controlador da conversa
│   │   ├── intents.js        # Detecção de intenções e respostas
│   │   ├── knowledge-base.js # Catálogo de opções (tipos, tamanhos, etc.)
│   │   └── llmService.js     # Camada opcional de interpretação (fallback)
│   ├── src/                  # Modelos/config preparados para uso futuro
│   │   ├── config/
│   │   └── models/
│   ├── server.js             # Express: serve /public e /health
│   └── package.json
├── database/
│   └── schema.sql            # Esquema preparado (não utilizado no fluxo atual)
├── .env.example              # Modelo das variáveis de ambiente
├── .gitignore
└── README.md
```

## Pré-requisitos

- Node.js 18+ e npm

## Instalação

1. Clone o repositório e entre no diretório `backend`:
   ```bash
   cd backend
   npm install
   ```

## Configuração das variáveis de ambiente

1. Na raiz do projeto, copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edite `.env` com os valores desejados. Para executar o chatbot em modo local, basta manter os valores padrão de `PORT` e `NODE_ENV` — as variáveis de banco e de IA não são necessárias para o fluxo atual.

O arquivo `.env` é ignorado pelo Git e não deve ser versionado.

## Como executar localmente

Dentro de `backend/`:

```bash
npm start
```

Saída esperada:

```
🚀 Servidor rodando na porta 3000
📡 Acesse: http://localhost:3000
```

Abra `http://localhost:3000` no navegador para interagir com o chatbot. A rota `/health` retorna um JSON de status.

## Fluxo de triagem

O chatbot coleta, em ordem:

1. Nome completo
2. Telefone
3. Tipo de trança
4. Tamanho
5. Material (cliente ou trancista)
6. Cor
7. Local de atendimento (estúdio ou domicílio)
8. Forma de pagamento
9. Data de preferência
10. Horário de preferência

Durante a conversa, o cliente pode fazer perguntas (ex.: "Quais opções?"), pedir para falar com o Johnny ou reiniciar a triagem digitando `reiniciar`.

## Fora do escopo atual

- Cálculo de preço, orçamento ou desconto
- Agendamento e verificação de disponibilidade
- Integração com WhatsApp
- Pagamento online
- Persistência em banco de dados
- Painel administrativo

## Autor

Projeto acadêmico — Johnny Tranças.

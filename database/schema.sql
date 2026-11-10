-- Script de criação do banco de dados Chatbot Johnny Tranças
-- Execute este script no MySQL para criar as tabelas

-- Criar banco de dados (se ainda não existir)
CREATE DATABASE IF NOT EXISTS chatbot_johnny_trancas
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE chatbot_johnny_trancas;

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL UNIQUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_telefone (telefone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de serviços (tipos de tranças)
CREATE TABLE IF NOT EXISTS servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de regras de precificação
CREATE TABLE IF NOT EXISTS regras_precificacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servico_id INT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    ativo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de FAQ (Perguntas Frequentes)
CREATE TABLE IF NOT EXISTS faq (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pergunta VARCHAR(500) NOT NULL,
    resposta TEXT NOT NULL,
    ativo TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de atendimentos
CREATE TABLE IF NOT EXISTS atendimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    tipo_tranca VARCHAR(100),
    tamanho VARCHAR(50),
    material VARCHAR(100),
    local_atendimento VARCHAR(50),
    data_desejada DATE,
    horario_desejado VARCHAR(50),
    observacoes TEXT,
    estimativa_valor DECIMAL(10, 2),
    status ENUM('em_triagem', 'pendente_confirmação', 'confirmado_pelo_johnny', 'cancelado') DEFAULT 'em_triagem',
    data_atendimento DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_data_atendimento (data_atendimento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    atendimento_id INT NOT NULL,
    remetente ENUM('cliente', 'bot') NOT NULL,
    mensagem TEXT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (atendimento_id) REFERENCES atendimentos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de métricas de triagem (para KPIs)
CREATE TABLE IF NOT EXISTS metricas_triagem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    atendimento_id INT NOT NULL,
    mensagens_trocadas INT DEFAULT 0,
    tempo_triagem_segundos INT,
    intervencao_humana TINYINT(1) DEFAULT 0,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (atendimento_id) REFERENCES atendimentos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir dados iniciais de exemplo (opcional)
INSERT INTO servicos (nome, descricao, ativo) VALUES
('Nagô', 'Trança tradicional Nagô', 1),
('Box Braids', 'Tranças em caixinha', 1),
('Senegalesa', 'Trança senegalesa', 1),
('Twist', 'Twist cabelo afro', 1);

INSERT INTO faq (pergunta, resposta, ativo) VALUES
('Quanto tempo dura a trança?', 'A duração varia de 4 a 8 semanas, dependendo do tipo de trança e dos cuidados.', 1),
('Preciso lavar o cabelo antes?', 'Sim, recomendamos chegar com o cabelo limpo e seco.', 1),
('Vocês atendem aos finais de semana?', 'Sim, atendemos aos sábados mediante agendamento prévio.', 1);

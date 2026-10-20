-- PROJETO FISICO - APLICATIVO DA CAFETERIA
-- MySQL 8.0+
CREATE DATABASE IF NOT EXISTS cafeteria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafeteria;

CREATE TABLE usuario (
 id_usuario CHAR(36) PRIMARY KEY,
 nome VARCHAR(120) NOT NULL,
 email VARCHAR(150) NOT NULL UNIQUE,
 senha_hash VARCHAR(255) NOT NULL,
 telefone VARCHAR(20),
 tipo_usuario ENUM('CLIENTE','ADMINISTRADOR','ENTREGADOR') NOT NULL
);
CREATE TABLE cliente (
 id_usuario CHAR(36) PRIMARY KEY,
 data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 pontos_fidelidade INT NOT NULL DEFAULT 0,
 FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
 CHECK (pontos_fidelidade >= 0)
);
CREATE TABLE administrador (
 id_usuario CHAR(36) PRIMARY KEY,
 FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
CREATE TABLE entregador (
 id_usuario CHAR(36) PRIMARY KEY,
 veiculo VARCHAR(60),
 placa VARCHAR(12),
 FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
CREATE TABLE categoria (
 id_categoria CHAR(36) PRIMARY KEY,
 nome VARCHAR(80) NOT NULL UNIQUE,
 descricao VARCHAR(255)
);
CREATE TABLE produto (
 id_produto CHAR(36) PRIMARY KEY,
 nome VARCHAR(120) NOT NULL,
 descricao TEXT,
 preco DECIMAL(10,2) NOT NULL,
 id_categoria CHAR(36) NOT NULL,
 imagem_url VARCHAR(500),
 ativo BOOLEAN NOT NULL DEFAULT TRUE,
 FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
 CHECK (preco >= 0)
);
CREATE TABLE carrinho (
 id_carrinho CHAR(36) PRIMARY KEY,
 id_cliente CHAR(36) NOT NULL,
 data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 status ENUM('ABERTO','FINALIZADO') NOT NULL DEFAULT 'ABERTO',
 FOREIGN KEY (id_cliente) REFERENCES cliente(id_usuario)
);
CREATE TABLE item_carrinho (
 id_item_carrinho CHAR(36) PRIMARY KEY,
 id_carrinho CHAR(36) NOT NULL,
 id_produto CHAR(36) NOT NULL,
 quantidade INT NOT NULL,
 preco_unitario DECIMAL(10,2) NOT NULL,
 FOREIGN KEY (id_carrinho) REFERENCES carrinho(id_carrinho) ON DELETE CASCADE,
 FOREIGN KEY (id_produto) REFERENCES produto(id_produto),
 UNIQUE (id_carrinho,id_produto),
 CHECK (quantidade > 0),
 CHECK (preco_unitario >= 0)
);
CREATE TABLE endereco_entrega (
 id_endereco CHAR(36) PRIMARY KEY,
 id_cliente CHAR(36) NOT NULL,
 logradouro VARCHAR(150) NOT NULL,
 numero VARCHAR(15) NOT NULL,
 complemento VARCHAR(100),
 bairro VARCHAR(100) NOT NULL,
 cidade VARCHAR(100) NOT NULL,
 estado CHAR(2) NOT NULL,
 cep CHAR(8) NOT NULL,
 FOREIGN KEY (id_cliente) REFERENCES cliente(id_usuario)
);
CREATE TABLE pedido (
 id_pedido CHAR(36) PRIMARY KEY,
 id_cliente CHAR(36) NOT NULL,
 id_endereco CHAR(36) NOT NULL,
 data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 status ENUM('PENDENTE','CONFIRMADO','EM_PREPARO','SAIU_PARA_ENTREGA','ENTREGUE','CANCELADO') NOT NULL DEFAULT 'PENDENTE',
 total DECIMAL(10,2) NOT NULL,
 FOREIGN KEY (id_cliente) REFERENCES cliente(id_usuario),
 FOREIGN KEY (id_endereco) REFERENCES endereco_entrega(id_endereco),
 CHECK (total >= 0)
);
CREATE TABLE item_pedido (
 id_item_pedido CHAR(36) PRIMARY KEY,
 id_pedido CHAR(36) NOT NULL,
 id_produto CHAR(36) NOT NULL,
 quantidade INT NOT NULL,
 preco_unitario DECIMAL(10,2) NOT NULL,
 subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * preco_unitario) STORED,
 FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
 FOREIGN KEY (id_produto) REFERENCES produto(id_produto),
 CHECK (quantidade > 0),
 CHECK (preco_unitario >= 0)
);
CREATE TABLE pagamento (
 id_pagamento CHAR(36) PRIMARY KEY,
 id_pedido CHAR(36) NOT NULL,
 forma_pagamento ENUM('PIX','CARTAO','BOLETO') NOT NULL,
 status ENUM('PENDENTE','APROVADO','RECUSADO') NOT NULL DEFAULT 'PENDENTE',
 valor DECIMAL(10,2) NOT NULL,
 data_pagamento DATETIME,
 transacao_id VARCHAR(120) UNIQUE,
 FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
 CHECK (valor >= 0)
);
CREATE TABLE entrega (
 id_entrega CHAR(36) PRIMARY KEY,
 id_pedido CHAR(36) NOT NULL UNIQUE,
 id_entregador CHAR(36),
 status ENUM('AGUARDANDO','EM_ROTA','ENTREGUE') NOT NULL DEFAULT 'AGUARDANDO',
 data_prevista DATETIME,
 data_entrega DATETIME,
 FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
 FOREIGN KEY (id_entregador) REFERENCES entregador(id_usuario)
);
-- Extensoes baseadas nos casos de uso e no mapa navegacional
CREATE TABLE cupom (
 id_cupom CHAR(36) PRIMARY KEY,
 codigo VARCHAR(40) NOT NULL UNIQUE,
 valor_desconto DECIMAL(10,2) NOT NULL,
 valido_ate DATETIME,
 ativo BOOLEAN NOT NULL DEFAULT TRUE,
 CHECK (valor_desconto >= 0)
);
CREATE TABLE pedido_cupom (
 id_pedido CHAR(36) PRIMARY KEY,
 id_cupom CHAR(36) NOT NULL,
 FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
 FOREIGN KEY (id_cupom) REFERENCES cupom(id_cupom)
);
CREATE TABLE avaliacao (
 id_avaliacao CHAR(36) PRIMARY KEY,
 id_cliente CHAR(36) NOT NULL,
 id_produto CHAR(36) NOT NULL,
 nota TINYINT NOT NULL,
 comentario TEXT,
 data_avaliacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (id_cliente) REFERENCES cliente(id_usuario),
 FOREIGN KEY (id_produto) REFERENCES produto(id_produto),
 CHECK (nota BETWEEN 1 AND 5)
);
CREATE INDEX idx_produto_categoria ON produto(id_categoria);
CREATE INDEX idx_pedido_cliente_data ON pedido(id_cliente,data_pedido);
CREATE INDEX idx_pedido_status ON pedido(status);
CREATE INDEX idx_pagamento_pedido ON pagamento(id_pedido);
CREATE INDEX idx_entrega_entregador ON entrega(id_entregador);

-- Criação das tabelas na ordem correta

CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE proprietario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE imovel (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    endereco VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    proprietario_id BIGINT,
    FOREIGN KEY (proprietario_id) REFERENCES proprietario(id)
);

CREATE TABLE inquilino (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE contrato (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    imovel_id BIGINT NOT NULL,
    inquilino_id BIGINT NOT NULL,
    FOREIGN KEY (imovel_id) REFERENCES imovel(id),
    FOREIGN KEY (inquilino_id) REFERENCES inquilino(id)
);

CREATE TABLE documento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    contrato_id BIGINT NOT NULL,
    FOREIGN KEY (contrato_id) REFERENCES contrato(id)
);

CREATE TABLE ocorrencia (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    descricao TEXT NOT NULL,
    data DATE NOT NULL,
    imovel_id BIGINT NOT NULL,
    FOREIGN KEY (imovel_id) REFERENCES imovel(id)
);

CREATE TABLE alerta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mensagem VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    usuario_id BIGINT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

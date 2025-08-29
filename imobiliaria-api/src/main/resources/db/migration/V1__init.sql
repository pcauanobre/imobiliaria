-- Tabela de usuários (simples; email único entra no V2)
CREATE TABLE usuario (
  id        BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(255) NOT NULL,
  email     VARCHAR(255) NOT NULL
);

-- Proprietário com dados básicos
CREATE TABLE proprietario (
  id   BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  doc  VARCHAR(50)  NOT NULL,
  email VARCHAR(255),
  tel   VARCHAR(50),
  obs   VARCHAR(500),

  CONSTRAINT uk_proprietario_doc UNIQUE (doc)
);

-- Imóvel com vínculo ao proprietário + todos os campos usados no código
CREATE TABLE imovel (
  id   BIGINT AUTO_INCREMENT PRIMARY KEY,
  endereco VARCHAR(255) NOT NULL,
  tipo     VARCHAR(100) NOT NULL,
  situacao VARCHAR(50)  NOT NULL DEFAULT 'LIVRE',
  obs      VARCHAR(500),

  proprietario_id BIGINT,
  CONSTRAINT fk_imovel_proprietario
    FOREIGN KEY (proprietario_id) REFERENCES proprietario (id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
);

-- Índices úteis
CREATE INDEX idx_proprietario_email ON proprietario (email);
CREATE INDEX idx_imovel_prop ON imovel (proprietario_id);

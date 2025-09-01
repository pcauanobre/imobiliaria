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
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  endereco        VARCHAR(255)  NOT NULL,
  tipo            VARCHAR(60)   NOT NULL,
  situacao        VARCHAR(40)   NOT NULL DEFAULT 'Ativo',
  obs             VARCHAR(2000),

  finalidade      VARCHAR(20),
  cep             VARCHAR(10),
  numero          VARCHAR(20),
  complemento     VARCHAR(100),
  bairro          VARCHAR(100),
  cidade          VARCHAR(100),
  uf              CHAR(2)       NOT NULL,

  area            DECIMAL(10,2),
  quartos         INT,
  banheiros       INT,
  vagas           INT,

  iptu            DECIMAL(10,2),
  condominio      DECIMAL(10,2),

  ano_construcao  INT,
  disponivel_em   DATE,

  proprietario_id BIGINT NOT NULL,
  CONSTRAINT fk_imovel_proprietario
    FOREIGN KEY (proprietario_id) REFERENCES proprietario (id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
);

-- Índices úteis
CREATE INDEX idx_imovel_owner   ON imovel (proprietario_id);
CREATE INDEX idx_imovel_cidade  ON imovel (cidade);
CREATE INDEX idx_imovel_uf      ON imovel (uf);
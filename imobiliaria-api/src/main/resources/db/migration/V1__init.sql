-- USUARIO
CREATE TABLE usuario (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','ATENDENTE') NOT NULL DEFAULT 'ATENDENTE',
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_usuario_email ON usuario(email);

-- PROPRIETARIO
CREATE TABLE proprietario (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(160) NOT NULL,
  cpf_cnpj VARCHAR(20) NOT NULL,
  telefone VARCHAR(30),
  email VARCHAR(160),
  observacoes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_proprietario_nome ON proprietario(nome);
CREATE INDEX idx_proprietario_doc ON proprietario(cpf_cnpj);

-- IMOVEL
CREATE TABLE imovel (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  proprietario_id BIGINT NOT NULL,
  logradouro VARCHAR(160),
  numero VARCHAR(30),
  bairro VARCHAR(80),
  cidade VARCHAR(80),
  uf VARCHAR(2),
  cep VARCHAR(12),
  tipo ENUM('CASA','APTO','SALA','OUTRO') NOT NULL DEFAULT 'CASA',
  observacoes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_imovel_proprietario FOREIGN KEY (proprietario_id) REFERENCES proprietario(id)
);
CREATE INDEX idx_imovel_proprietario ON imovel(proprietario_id);
CREATE INDEX idx_imovel_cidade ON imovel(cidade);

-- INQUILINO
CREATE TABLE inquilino (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(160) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  telefone VARCHAR(30),
  email VARCHAR(160),
  observacoes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_inquilino_nome ON inquilino(nome);
CREATE INDEX idx_inquilino_cpf ON inquilino(cpf);

-- CONTRATO
CREATE TABLE contrato (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  imovel_id BIGINT NOT NULL,
  inquilino_id BIGINT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  prazo_meses INT NOT NULL,
  dia_pagamento INT NOT NULL CHECK (dia_pagamento BETWEEN 1 AND 28),
  valor_inicial DECIMAL(12,2) NOT NULL,
  valor_atual DECIMAL(12,2) NOT NULL,
  status ENUM('ATIVO','ENCERRADO','VENCIDO','RENOVADO') NOT NULL DEFAULT 'ATIVO',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contrato_imovel FOREIGN KEY (imovel_id) REFERENCES imovel(id),
  CONSTRAINT fk_contrato_inquilino FOREIGN KEY (inquilino_id) REFERENCES inquilino(id)
);
CREATE INDEX idx_contrato_datas ON contrato(data_inicio, data_fim, status);
CREATE INDEX idx_contrato_inquilino ON contrato(inquilino_id);

-- DOCUMENTO
CREATE TABLE documento (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  owner_type ENUM('PROPRIETARIO','IMOVEL','INQUILINO','CONTRATO') NOT NULL,
  owner_id BIGINT NOT NULL,
  nome_original VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  tamanho BIGINT,
  storage_key VARCHAR(512) NOT NULL,
  criado_por_usuario_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_doc_usuario FOREIGN KEY (criado_por_usuario_id) REFERENCES usuario(id)
);
CREATE INDEX idx_documento_owner ON documento(owner_type, owner_id);

-- OCORRENCIA
CREATE TABLE ocorrencia (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  inquilino_id BIGINT NOT NULL,
  texto TEXT NOT NULL,
  autor_usuario_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ocorrencia_inquilino FOREIGN KEY (inquilino_id) REFERENCES inquilino(id),
  CONSTRAINT fk_ocorrencia_usuario FOREIGN KEY (autor_usuario_id) REFERENCES usuario(id)
);
CREATE INDEX idx_ocorrencia_inquilino ON ocorrencia(inquilino_id);

-- ALERTA
CREATE TABLE alerta (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tipo ENUM('REAJUSTE_ANUAL','TERMINO_CONTRATO') NOT NULL,
  contrato_id BIGINT NOT NULL,
  data_evento DATE NOT NULL,
  antecipacao_dias INT NOT NULL DEFAULT 30,
  status ENUM('PENDENTE','RESOLVIDO') NOT NULL DEFAULT 'PENDENTE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alerta_contrato FOREIGN KEY (contrato_id) REFERENCES contrato(id)
);
CREATE INDEX idx_alerta_tipo_data ON alerta(tipo, data_evento, status);

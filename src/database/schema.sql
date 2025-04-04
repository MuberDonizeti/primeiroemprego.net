-- Criar tabelas para o banco de dados

-- Tabela de usuários (base)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL CHECK (tipo_usuario IN ('candidato', 'empresa')),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de candidatos
CREATE TABLE candidatos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE,
    curriculo_url TEXT,
    CONSTRAINT fk_usuario_candidato FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de empresas
CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_empresa VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    descricao TEXT,
    CONSTRAINT fk_usuario_empresa FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de vagas
CREATE TABLE vagas (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    requisitos TEXT,
    salario DECIMAL(10,2),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ativa' CHECK (status IN ('ativa', 'inativa', 'encerrada')),
    CONSTRAINT fk_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

-- Tabela de candidaturas
CREATE TABLE candidaturas (
    id SERIAL PRIMARY KEY,
    vaga_id INTEGER REFERENCES vagas(id) ON DELETE CASCADE,
    candidato_id INTEGER REFERENCES candidatos(id) ON DELETE CASCADE,
    data_candidatura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'reprovado')),
    CONSTRAINT fk_vaga FOREIGN KEY (vaga_id) REFERENCES vagas(id),
    CONSTRAINT fk_candidato FOREIGN KEY (candidato_id) REFERENCES candidatos(id),
    CONSTRAINT unique_candidatura UNIQUE (vaga_id, candidato_id)
);

-- Índices para melhorar performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_empresas_cnpj ON empresas(cnpj);
CREATE INDEX idx_candidatos_cpf ON candidatos(cpf);
CREATE INDEX idx_vagas_empresa ON vagas(empresa_id);
CREATE INDEX idx_candidaturas_vaga ON candidaturas(vaga_id);
CREATE INDEX idx_candidaturas_candidato ON candidaturas(candidato_id);
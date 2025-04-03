const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Criar conexão com o banco de dados
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados SQLite');
        initializeTables();
    }
});

// Inicializar tabelas do banco de dados
function initializeTables() {
    // Tabela de candidatos
    db.run(`CREATE TABLE IF NOT EXISTS candidatos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        dataNascimento TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        tipo TEXT DEFAULT 'candidato'
    )`);

    // Tabela de empresas
    db.run(`CREATE TABLE IF NOT EXISTS empresas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cnpj TEXT UNIQUE NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        tipo TEXT DEFAULT 'empresa'
    )`);

    // Tabela de vagas
    db.run(`CREATE TABLE IF NOT EXISTS vagas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        requisitos TEXT,
        salario TEXT,
        empresa_id INTEGER,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empresa_id) REFERENCES empresas (id)
    )`);

    // Tabela de candidaturas
    db.run(`CREATE TABLE IF NOT EXISTS candidaturas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidato_id INTEGER,
        vaga_id INTEGER,
        data_candidatura DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pendente',
        FOREIGN KEY (candidato_id) REFERENCES candidatos (id),
        FOREIGN KEY (vaga_id) REFERENCES vagas (id)
    )`);
}

// Funções de CRUD para candidatos
const candidatosDB = {
    criar: (candidato) => {
        return new Promise((resolve, reject) => {
            const { nome, cpf, dataNascimento, telefone, email, senha } = candidato;
            db.run(
                'INSERT INTO candidatos (nome, cpf, dataNascimento, telefone, email, senha) VALUES (?, ?, ?, ?, ?, ?)',
                [nome, cpf, dataNascimento, telefone, email, senha],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },

    buscarPorEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM candidatos WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

// Funções de CRUD para empresas
const empresasDB = {
    criar: (empresa) => {
        return new Promise((resolve, reject) => {
            const { nome, cnpj, telefone, email, senha } = empresa;
            db.run(
                'INSERT INTO empresas (nome, cnpj, telefone, email, senha) VALUES (?, ?, ?, ?, ?)',
                [nome, cnpj, telefone, email, senha],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },

    buscarPorEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM empresas WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

module.exports = {
    db,
    candidatosDB,
    empresasDB
};
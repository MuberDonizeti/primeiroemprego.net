// Arquivo de conexão com o banco de dados
const { config } = require('./config');

// Função para criar conexão com MySQL
function createMySQLConnection() {
    const mysql = require('mysql2/promise');
    return mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
}

// Função para criar conexão com MongoDB
function createMongoDBConnection() {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(config.url);
    return {
        connect: async () => {
            await client.connect();
            return client.db(config.database);
        },
        close: async () => {
            await client.close();
        }
    };
}

// Função para criar conexão com SQLite
function createSQLiteConnection() {
    const sqlite3 = require('sqlite3');
    const { open } = require('sqlite');
    
    return open({
        filename: config.file,
        driver: sqlite3.Database
    });
}

// Exportar a função de conexão apropriada com base na configuração
let dbConnection;

if ('host' in config && 'user' in config) {
    // MySQL configuration
    dbConnection = createMySQLConnection;
} else if ('url' in config) {
    // MongoDB configuration
    dbConnection = createMongoDBConnection;
} else if ('file' in config) {
    // SQLite configuration
    dbConnection = createSQLiteConnection;
}

module.exports = { dbConnection };
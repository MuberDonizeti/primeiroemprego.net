// Configuração do banco de dados

// Opção 1: MySQL/MariaDB
const mysql = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'primeiroemprego',
    port: 3306
};

// Opção 2: MongoDB
const mongodb = {
    url: 'mongodb://localhost:27017',
    database: 'primeiroemprego'
};

// Opção 3: SQLite (mais simples para desenvolvimento local)
const sqlite = {
    file: './database.sqlite'
};

// Exportar a configuração desejada
// Escolha uma das opções acima e exporte-a como 'config'
const config = mysql; // Altere para mongodb ou sqlite conforme necessário

module.exports = { config };
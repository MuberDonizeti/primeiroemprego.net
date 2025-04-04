const { Pool } = require('pg');

// Configuração da conexão com o banco de dados
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Função para testar a conexão
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        client.release();
        return true;
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        return false;
    }
}

module.exports = {
    pool,
    query: (text, params) => pool.query(text, params),
    testConnection
};
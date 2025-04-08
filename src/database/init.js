// Inicialização do banco de dados
const { dbConnection } = require('./connection');
const { CandidatoModel, EmpresaModel, VagaModel, CandidaturaModel } = require('./models');

/**
 * Função para inicializar o banco de dados
 * Cria todas as tabelas necessárias se elas não existirem
 */
async function initDatabase() {
    console.log('Inicializando banco de dados...');
    
    try {
        const conn = await dbConnection();
        
        // Criar tabelas
        await EmpresaModel.criarTabela(conn);
        console.log('Tabela de empresas criada ou já existente');
        
        await CandidatoModel.criarTabela(conn);
        console.log('Tabela de candidatos criada ou já existente');
        
        await VagaModel.criarTabela(conn);
        console.log('Tabela de vagas criada ou já existente');
        
        await CandidaturaModel.criarTabela(conn);
        console.log('Tabela de candidaturas criada ou já existente');
        
        // Fechar conexão se necessário
        if (conn.close) await conn.close();
        
        console.log('Banco de dados inicializado com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        return false;
    }
}

module.exports = { initDatabase };
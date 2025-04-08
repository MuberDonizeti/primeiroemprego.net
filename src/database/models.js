// Modelos de dados para o banco de dados
const { dbConnection } = require('./connection');

// Modelo para Candidatos
class CandidatoModel {
    static async criarTabela(conn) {
        // Exemplo para MySQL
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS candidatos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cpf VARCHAR(14) UNIQUE NOT NULL,
                data_nascimento DATE NOT NULL,
                telefone VARCHAR(15) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Exemplo para SQLite
        // await conn.exec(`
        //     CREATE TABLE IF NOT EXISTS candidatos (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT,
        //         nome TEXT NOT NULL,
        //         cpf TEXT UNIQUE NOT NULL,
        //         data_nascimento TEXT NOT NULL,
        //         telefone TEXT NOT NULL,
        //         email TEXT UNIQUE NOT NULL,
        //         senha TEXT NOT NULL,
        //         data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        //     )
        // `);
    }

    static async inserir(candidato) {
        const conn = await dbConnection();
        try {
            const result = await conn.execute(
                'INSERT INTO candidatos (nome, cpf, data_nascimento, telefone, email, senha) VALUES (?, ?, ?, ?, ?, ?)',
                [candidato.nome, candidato.cpf, candidato.dataNascimento, candidato.telefone, candidato.email, candidato.senha]
            );
            return result;
        } catch (error) {
            console.error('Erro ao inserir candidato:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }

    static async buscarPorEmail(email) {
        const conn = await dbConnection();
        try {
            const [rows] = await conn.execute('SELECT * FROM candidatos WHERE email = ?', [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erro ao buscar candidato por email:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }

    static async buscarPorCPF(cpf) {
        const conn = await dbConnection();
        try {
            const [rows] = await conn.execute('SELECT * FROM candidatos WHERE cpf = ?', [cpf]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erro ao buscar candidato por CPF:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }
}

// Modelo para Empresas
class EmpresaModel {
    static async criarTabela(conn) {
        // Exemplo para MySQL
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS empresas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome_empresa VARCHAR(100) NOT NULL,
                cnpj VARCHAR(18) UNIQUE NOT NULL,
                telefone VARCHAR(15) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    static async inserir(empresa) {
        const conn = await dbConnection();
        try {
            const result = await conn.execute(
                'INSERT INTO empresas (nome_empresa, cnpj, telefone, email, senha) VALUES (?, ?, ?, ?, ?)',
                [empresa.nomeEmpresa, empresa.cnpj, empresa.telefone, empresa.email, empresa.senha]
            );
            return result;
        } catch (error) {
            console.error('Erro ao inserir empresa:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }

    static async buscarPorEmail(email) {
        const conn = await dbConnection();
        try {
            const [rows] = await conn.execute('SELECT * FROM empresas WHERE email = ?', [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erro ao buscar empresa por email:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }

    static async buscarPorCNPJ(cnpj) {
        const conn = await dbConnection();
        try {
            const [rows] = await conn.execute('SELECT * FROM empresas WHERE cnpj = ?', [cnpj]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erro ao buscar empresa por CNPJ:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }
}

// Modelo para Vagas
class VagaModel {
    static async criarTabela(conn) {
        // Exemplo para MySQL
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS vagas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(100) NOT NULL,
                empresa_id INT NOT NULL,
                localizacao VARCHAR(100) NOT NULL,
                descricao TEXT NOT NULL,
                requisitos TEXT NOT NULL,
                salario VARCHAR(50),
                data_limite DATE,
                data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (empresa_id) REFERENCES empresas(id)
            )
        `);
    }

    static async inserir(vaga) {
        const conn = await dbConnection();
        try {
            const result = await conn.execute(
                'INSERT INTO vagas (titulo, empresa_id, localizacao, descricao, requisitos, salario, data_limite) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [vaga.titulo, vaga.empresaId, vaga.localizacao, vaga.descricao, vaga.requisitos, vaga.salario, vaga.dataLimite]
            );
            return result;
        } catch (error) {
            console.error('Erro ao inserir vaga:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }

    static async listarTodas() {
        const conn = await dbConnection();
        try {
            const [rows] = await conn.execute(`
                SELECT v.*, e.nome_empresa 
                FROM vagas v 
                JOIN empresas e ON v.empresa_id = e.id
            `);
            return rows;
        } catch (error) {
            console.error('Erro ao listar vagas:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }

    static async buscarPorEmpresa(empresaId) {
        const conn = await dbConnection();
        try {
            const [rows] = await conn.execute('SELECT * FROM vagas WHERE empresa_id = ?', [empresaId]);
            return rows;
        } catch (error) {
            console.error('Erro ao buscar vagas por empresa:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }

    static async buscarPorId(id) {
        const conn = await dbConnection();
        try {
            const [rows] = await conn.execute(`
                SELECT v.*, e.nome_empresa 
                FROM vagas v 
                JOIN empresas e ON v.empresa_id = e.id 
                WHERE v.id = ?
            `, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erro ao buscar vaga por ID:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }
}

// Modelo para Candidaturas
class CandidaturaModel {
    static async criarTabela(conn) {
        // Exemplo para MySQL
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS candidaturas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                candidato_id INT NOT NULL,
                vaga_id INT NOT NULL,
                data_candidatura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) DEFAULT 'pendente',
                FOREIGN KEY (candidato_id) REFERENCES candidatos(id),
                FOREIGN KEY (vaga_id) REFERENCES vagas(id),
                UNIQUE(candidato_id, vaga_id)
            )
        `);
    }

    static async inserir(candidatoId, vagaId) {
        const conn = await dbConnection();
        try {
            const result = await conn.execute(
                'INSERT INTO candidaturas (candidato_id, vaga_id) VALUES (?, ?)',
                [candidatoId, vagaId]
            );
            return result;
        } catch (error) {
            console.error('Erro ao inserir candidatura:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }

    static async listarPorCandidato(candidatoId) {
        const conn = await dbConnection();
        try {
            const [rows] = await conn.execute(`
                SELECT c.*, v.titulo, v.localizacao, e.nome_empresa
                FROM candidaturas c
                JOIN vagas v ON c.vaga_id = v.id
                JOIN empresas e ON v.empresa_id = e.id
                WHERE c.candidato_id = ?
            `, [candidatoId]);
            return rows;
        } catch (error) {
            console.error('Erro ao listar candidaturas por candidato:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }

    static async listarPorVaga(vagaId) {
        const conn = await dbConnection();
        try {
            const [rows] = await conn.execute(`
                SELECT c.*, ca.nome, ca.email, ca.telefone
                FROM candidaturas c
                JOIN candidatos ca ON c.candidato_id = ca.id
                WHERE c.vaga_id = ?
            `, [vagaId]);
            return rows;
        } catch (error) {
            console.error('Erro ao listar candidaturas por vaga:', error);
            throw error;
        } finally {
            if (conn.close) await conn.close();
        }
    }
}

module.exports = {
    CandidatoModel,
    EmpresaModel,
    VagaModel,
    CandidaturaModel
};
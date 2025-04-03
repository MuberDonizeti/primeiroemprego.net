const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { candidatosDB, empresasDB } = require('./database/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('src'));

// Rota de registro de candidato
app.post('/api/candidatos/registro', async (req, res) => {
    try {
        const { nome, cpf, dataNascimento, telefone, email, senha } = req.body;
        
        // Criptografar a senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // Criar candidato no banco
        await candidatosDB.criar({
            nome,
            cpf,
            dataNascimento,
            telefone,
            email,
            senha: senhaHash
        });
        
        res.status(201).json({ mensagem: 'Candidato registrado com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar candidato:', error);
        res.status(500).json({ erro: 'Erro ao registrar candidato' });
    }
});

// Rota de registro de empresa
app.post('/api/empresas/registro', async (req, res) => {
    try {
        const { nome, cnpj, telefone, email, senha } = req.body;
        
        // Criptografar a senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // Criar empresa no banco
        await empresasDB.criar({
            nome,
            cnpj,
            telefone,
            email,
            senha: senhaHash
        });
        
        res.status(201).json({ mensagem: 'Empresa registrada com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar empresa:', error);
        res.status(500).json({ erro: 'Erro ao registrar empresa' });
    }
});

// Rota de login
app.post('/api/login', async (req, res) => {
    try {
        const { email, senha, tipoUsuario } = req.body;
        
        // Buscar usuário no banco de dados apropriado
        const db = tipoUsuario === 'candidato' ? candidatosDB : empresasDB;
        const usuario = await db.buscarPorEmail(email);
        
        if (!usuario) {
            return res.status(401).json({ erro: 'Usuário não encontrado' });
        }
        
        // Verificar senha
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Senha incorreta' });
        }
        
        // Remover senha do objeto de resposta
        delete usuario.senha;
        
        res.json({
            usuario,
            mensagem: 'Login realizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ erro: 'Erro ao fazer login' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
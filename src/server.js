// Servidor Express para a API do PrimeiroEmprego.net
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./database/init');

// Importar modelos
const { CandidatoModel, EmpresaModel, VagaModel, CandidaturaModel } = require('./database/models');

// Inicializar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'pages')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Middleware para simular autenticação JWT
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);
    
    // Em uma implementação real, você verificaria o token JWT aqui
    // Por enquanto, apenas simulamos a verificação
    try {
        // Simular verificação do token
        const usuarioId = token; // Em uma implementação real, você decodificaria o token
        req.usuarioId = usuarioId;
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
}

// Rotas da API

// Rota de verificação de candidato
app.post('/api/candidatos/verificar', async (req, res) => {
    try {
        const { cpf, email } = req.body;
        
        // Verificar se já existe candidato com o mesmo CPF ou email
        const candidatoCPF = await CandidatoModel.buscarPorCPF(cpf);
        const candidatoEmail = await CandidatoModel.buscarPorEmail(email);
        
        res.json({ exists: !!(candidatoCPF || candidatoEmail) });
    } catch (error) {
        console.error('Erro ao verificar candidato:', error);
        res.status(500).json({ message: 'Erro ao verificar candidato' });
    }
});

// Rota de cadastro de candidato
app.post('/api/candidatos/cadastrar', async (req, res) => {
    try {
        const candidatoData = req.body;
        
        // Inserir candidato no banco de dados
        const result = await CandidatoModel.inserir(candidatoData);
        
        res.status(201).json({ message: 'Candidato cadastrado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao cadastrar candidato:', error);
        res.status(500).json({ message: 'Erro ao cadastrar candidato' });
    }
});

// Rota de verificação de empresa
app.post('/api/empresas/verificar', async (req, res) => {
    try {
        const { cnpj, email } = req.body;
        
        // Verificar se já existe empresa com o mesmo CNPJ ou email
        const empresaCNPJ = await EmpresaModel.buscarPorCNPJ(cnpj);
        const empresaEmail = await EmpresaModel.buscarPorEmail(email);
        
        res.json({ exists: !!(empresaCNPJ || empresaEmail) });
    } catch (error) {
        console.error('Erro ao verificar empresa:', error);
        res.status(500).json({ message: 'Erro ao verificar empresa' });
    }
});

// Rota de cadastro de empresa
app.post('/api/empresas/cadastrar', async (req, res) => {
    try {
        const empresaData = req.body;
        
        // Inserir empresa no banco de dados
        const result = await EmpresaModel.inserir(empresaData);
        
        res.status(201).json({ message: 'Empresa cadastrada com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao cadastrar empresa:', error);
        res.status(500).json({ message: 'Erro ao cadastrar empresa' });
    }
});

// Rota de login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha, tipoUsuario } = req.body;
        
        let usuario;
        
        if (tipoUsuario === 'candidato') {
            usuario = await CandidatoModel.buscarPorEmail(email);
        } else if (tipoUsuario === 'empresa') {
            usuario = await EmpresaModel.buscarPorEmail(email);
        } else {
            return res.status(400).json({ message: 'Tipo de usuário inválido' });
        }
        
        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }
        
        // Verificar senha
        // Em uma implementação real, você usaria bcrypt para comparar senhas
        if (usuario.senha !== senha) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }
        
        // Gerar token JWT (simulado)
        // Em uma implementação real, você usaria jwt.sign para gerar um token
        const token = usuario.id.toString();
        
        res.json({
            message: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario.id,
                nome: tipoUsuario === 'candidato' ? usuario.nome : usuario.nome_empresa,
                email: usuario.email,
                tipo: tipoUsuario
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
});

// Rota para listar vagas
app.get('/api/vagas', async (req, res) => {
    try {
        const vagas = await VagaModel.listarTodas();
        res.json(vagas);
    } catch (error) {
        console.error('Erro ao listar vagas:', error);
        res.status(500).json({ message: 'Erro ao listar vagas' });
    }
});

// Rota para buscar vaga por ID
app.get('/api/vagas/:id', async (req, res) => {
    try {
        const vaga = await VagaModel.buscarPorId(req.params.id);
        
        if (!vaga) {
            return res.status(404).json({ message: 'Vaga não encontrada' });
        }
        
        res.json(vaga);
    } catch (error) {
        console.error('Erro ao buscar vaga:', error);
        res.status(500).json({ message: 'Erro ao buscar vaga' });
    }
});

// Rota para listar vagas de uma empresa
app.get('/api/empresas/:id/vagas', autenticarToken, async (req, res) => {
    try {
        const vagas = await VagaModel.buscarPorEmpresa(req.params.id);
        res.json(vagas);
    } catch (error) {
        console.error('Erro ao listar vagas da empresa:', error);
        res.status(500).json({ message: 'Erro ao listar vagas da empresa' });
    }
});

// Rota para criar uma nova vaga
app.post('/api/vagas', autenticarToken, async (req, res) => {
    try {
        const vagaData = req.body;
        
        // Inserir vaga no banco de dados
        const result = await VagaModel.inserir(vagaData);
        
        res.status(201).json({ message: 'Vaga criada com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao criar vaga:', error);
        res.status(500).json({ message: 'Erro ao criar vaga' });
    }
});

// Rota para candidatar-se a uma vaga
app.post('/api/vagas/:id/candidatar', autenticarToken, async (req, res) => {
    try {
        const vagaId = req.params.id;
        const candidatoId = req.usuarioId;
        
        // Inserir candidatura no banco de dados
        await CandidaturaModel.inserir(candidatoId, vagaId);
        
        res.status(201).json({ message: 'Candidatura realizada com sucesso' });
    } catch (error) {
        console.error('Erro ao candidatar-se à vaga:', error);
        res.status(500).json({ message: 'Erro ao candidatar-se à vaga' });
    }
});

// Rota para listar candidaturas de um candidato
app.get('/api/candidatos/:id/candidaturas', autenticarToken, async (req, res) => {
    try {
        const candidaturas = await CandidaturaModel.listarPorCandidato(req.params.id);
        res.json(candidaturas);
    } catch (error) {
        console.error('Erro ao listar candidaturas do candidato:', error);
        res.status(500).json({ message: 'Erro ao listar candidaturas do candidato' });
    }
});

// Rota para listar candidaturas de uma vaga
app.get('/api/vagas/:id/candidaturas', autenticarToken, async (req, res) => {
    try {
        const candidaturas = await CandidaturaModel.listarPorVaga(req.params.id);
        res.json(candidaturas);
    } catch (error) {
        console.error('Erro ao listar candidaturas da vaga:', error);
        res.status(500).json({ message: 'Erro ao listar candidaturas da vaga' });
    }
});

// Inicializar o banco de dados e iniciar o servidor
initDatabase().then(success => {
    if (success) {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } else {
        console.error('Falha ao inicializar o banco de dados. Servidor não iniciado.');
        process.exit(1);
    }
});
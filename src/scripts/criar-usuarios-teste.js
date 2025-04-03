// Criar usuários de teste para o sistema

// Dados da empresa de teste
const empresa = {
    nomeEmpresa: 'Tech Solutions Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'tech@example.com',
    telefone: '(11) 98765-4321',
    senha: 'teste123',
    tipo: 'empresa'
};

// Dados do candidato de teste
const candidato = {
    nome: 'João Silva',
    cpf: '123.456.789-00',
    dataNascimento: '1995-01-01',
    telefone: '(11) 98765-4321',
    email: 'joao@example.com',
    senha: 'teste123',
    tipo: 'candidato',
    vagasInscritas: []
};

// Função para criar os usuários de teste
function criarUsuariosTeste() {
    // Salvar empresa
    const empresas = JSON.parse(localStorage.getItem('empresas') || '[]');
    if (!empresas.some(e => e.email === empresa.email)) {
        empresas.push(empresa);
        localStorage.setItem('empresas', JSON.stringify(empresas));
        console.log('Empresa de teste criada com sucesso!');
    }

    // Salvar candidato
    const candidatos = JSON.parse(localStorage.getItem('candidatos') || '[]');
    if (!candidatos.some(c => c.email === candidato.email)) {
        candidatos.push(candidato);
        localStorage.setItem('candidatos', JSON.stringify(candidatos));
        console.log('Candidato de teste criado com sucesso!');
    }

    alert('Usuários de teste criados com sucesso!\n\n' +
          'Empresa:\n' +
          'Email: tech@example.com\n' +
          'Senha: teste123\n\n' +
          'Candidato:\n' +
          'Email: joao@example.com\n' +
          'Senha: teste123');
}

// Executar a criação dos usuários
criarUsuariosTeste();
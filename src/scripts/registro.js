// Função para validar o formato do CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto > 9 ? 0 : resto;
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto > 9 ? 0 : resto;
    if (digitoVerificador2 !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// Função para validar o formato do telefone
function validarTelefone(telefone) {
    const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return regex.test(telefone);
}

// Função para validar a idade mínima (16 anos)
function validarIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return idade >= 16;
}

// Função para formatar o CPF enquanto digita
document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{3})(\d)/, '$1.$2');
        value = value.replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2');
        value = value.replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2');
        e.target.value = value;
    }
});

// Função para formatar o telefone enquanto digita
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/^\((\d{2})\)\s(\d{4,5})(\d{4})$/, '($1) $2-$3');
        e.target.value = value;
    }
});

// Função principal para registrar candidato
async function registrarCandidato(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    // Validações
    if (!validarCPF(cpf)) {
        alert('CPF inválido!');
        return false;
    }

    if (!validarTelefone(telefone)) {
        alert('Formato de telefone inválido!');
        return false;
    }

    if (!validarIdade(dataNascimento)) {
        alert('É necessário ter pelo menos 16 anos para se cadastrar!');
        return false;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return false;
    }

    // Criar objeto com dados do candidato
    const candidatoData = {
        nome,
        cpf,
        dataNascimento,
        telefone,
        email,
        senha,
        tipo: 'candidato', // Identificador para diferenciar de empresas
        vagasInscritas: [] // Array para armazenar as vagas em que o candidato se inscreveu
    };

    try {
        // Verificar se já existe um candidato com o mesmo CPF ou email no localStorage
        const candidatos = JSON.parse(localStorage.getItem('candidatos')) || [];
        
        const cpfExists = candidatos.some(c => c.cpf === cpf);
        const emailExists = candidatos.some(c => c.email === email);
        
        if (cpfExists || emailExists) {
            if (cpfExists) {
                alert('Já existe um candidato cadastrado com este CPF!');
            } else if (emailExists) {
                alert('Já existe um candidato cadastrado com este email!');
            }
            return false;
        }

        // Adicionar o novo candidato ao array e salvar no localStorage
        candidatos.push(candidatoData);
        localStorage.setItem('candidatos', JSON.stringify(candidatos));

        alert('Cadastro realizado com sucesso!');
        window.location.href = './login.html';

    } catch (error) {
        console.error('Erro ao cadastrar candidato:', error);
        if (error.message.includes('Failed to fetch') || !navigator.onLine) {
            alert('Erro de conexão. Verifique sua internet e tente novamente.');
        } else {
            alert(`Erro ao realizar cadastro: ${error.message}`);
        }
    }

    return false;
}
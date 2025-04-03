// Função para validar o formato do CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
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

// Formatação de CPF
document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{3})(\d)/, '$1.$2');
        value = value.replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2');
        value = value.replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2');
        e.target.value = value;
    }
});

// Formatação de telefone
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/^\((\d{2})\)\s(\d{4,5})(\d{4})$/, '($1) $2-$3');
        e.target.value = value;
    }
});

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'erro') {
    const notification = document.getElementById('notification');
    notification.textContent = mensagem;
    notification.className = `notification ${tipo}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

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
        mostrarNotificacao('CPF inválido!');
        return false;
    }

    if (!validarTelefone(telefone)) {
        mostrarNotificacao('Formato de telefone inválido!');
        return false;
    }

    if (!validarIdade(dataNascimento)) {
        mostrarNotificacao('É necessário ter pelo menos 16 anos para se cadastrar!');
        return false;
    }

    if (senha !== confirmarSenha) {
        mostrarNotificacao('As senhas não coincidem!');
        return false;
    }

    try {
        const response = await fetch('http://localhost:3000/api/candidatos/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                cpf,
                dataNascimento,
                telefone,
                email,
                senha
            })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarNotificacao('Cadastro realizado com sucesso!', 'sucesso');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
        } else {
            mostrarNotificacao(data.erro || 'Erro ao cadastrar candidato');
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        mostrarNotificacao('Erro ao conectar com o servidor');
    }

    return false;
}
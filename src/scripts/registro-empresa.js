// Função para validar o formato do CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) return false;
    return true; // Implementar validação completa posteriormente
}

// Função para validar o formato do telefone
function validarTelefone(telefone) {
    const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return regex.test(telefone);
}

// Função para formatar o CNPJ enquanto digita
document.getElementById('cnpj').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, '$1/$2');
        value = value.replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, '$1-$2');
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

// Função principal para registrar empresa
async function registrarEmpresa(event) {
    event.preventDefault();

    const nomeEmpresa = document.getElementById('nomeEmpresa').value;
    const cnpj = document.getElementById('cnpj').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    // Validações
    if (!validarCNPJ(cnpj)) {
        alert('CNPJ inválido!');
        return false;
    }

    if (!validarTelefone(telefone)) {
        alert('Formato de telefone inválido!');
        return false;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return false;
    }

    // Criar objeto com dados da empresa
    const empresaData = {
        nomeEmpresa,
        cnpj,
        email,
        telefone,
        senha,
        tipo: 'empresa' // Identificador para diferenciar de candidatos
    };

    try {
        // Verificar se já existe uma empresa com o mesmo CNPJ ou email
        // Usando a API em vez do localStorage
        const response = await fetch('/api/empresas/verificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cnpj, email })
        });

        const data = await response.json();
        
        if (data.exists) {
            alert('Já existe uma empresa cadastrada com este CNPJ ou email!');
            return false;
        }

        // Cadastrar a empresa no banco de dados
        const cadastroResponse = await fetch('/api/empresas/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empresaData)
        });

        const cadastroData = await cadastroResponse.json();

        if (cadastroResponse.ok) {
            alert('Empresa cadastrada com sucesso!');
            window.location.href = './login.html';
        } else {
            alert(`Erro ao cadastrar empresa: ${cadastroData.message}`);
        }
    } catch (error) {
        console.error('Erro ao cadastrar empresa:', error);
        alert('Erro ao cadastrar empresa. Tente novamente.');
    }

    return false;
}
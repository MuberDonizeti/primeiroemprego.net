async function fazerLogin(event) {
    event.preventDefault();
    
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    try {
        // Recuperar dados do localStorage baseado no tipo de usuário
        const storageKey = tipoUsuario === 'candidato' ? 'candidatos' : 'empresas';
        const usuarios = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        console.log('Dados do localStorage:', usuarios); // Debug
        console.log('Tentativa de login:', { email, tipoUsuario }); // Debug
        
        // Procurar usuário pelo email primeiro
        const usuarioEncontrado = usuarios.find(u => u.email === email);
        
        if (!usuarioEncontrado) {
            alert(`Não existe ${tipoUsuario} cadastrado com este email.`);
            return false;
        }
        
        // Verificar a senha
        if (usuarioEncontrado.senha !== senha) {
            alert('Senha incorreta!');
            return false;
        }
        
        // Verificar se o tipo de usuário corresponde
        if (usuarioEncontrado.tipo !== tipoUsuario) {
            alert(`Este email está cadastrado como ${usuarioEncontrado.tipo}, não como ${tipoUsuario}.`);
            return false;
        }
        
        // Login bem-sucedido
        localStorage.setItem('usuarioLogado', JSON.stringify({
            ...usuarioEncontrado,
            tipoUsuario
        }));
        
        // Redirecionar para a dashboard específica
        if (tipoUsuario === 'empresa') {
            window.location.href = './dashboard-empresa.html';
        } else {
            window.location.href = './dashboard-candidato.html';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Tente novamente.');
    }
    
    return false;
}

// Adicionar usuário admin padrão se não existir
function inicializarAdmin() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (!usuarios.some(u => u.email === 'admin@devjobs.com')) {
        usuarios.push({
            id: Date.now(),
            nome: 'Administrador',
            email: 'admin@devjobs.com',
            senha: 'admin123',
            tipo: 'admin'
        });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

// Executar ao carregar a página
inicializarAdmin();

function mostrarRegistro() {
    // Implementar lógica de registro
    alert('Funcionalidade de registro em desenvolvimento');
}
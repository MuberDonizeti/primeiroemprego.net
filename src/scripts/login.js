function fazerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    // Recuperar usuários do localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        window.location.href = './dashboard.html';
    } else {
        alert('Email ou senha incorretos!');
    }
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
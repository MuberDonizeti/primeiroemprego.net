async function fazerLogin(event) {
    event.preventDefault();
    
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    try {
        // Recuperar dados do localStorage baseado no tipo de usuário
        const storageKey = tipoUsuario === 'candidato' ? 'candidatos' : 'empresas';
        const usuarios = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        // Procurar usuário
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);
        
        if (usuario) {
            // Verificar se o tipo de usuário corresponde
            if (usuario.tipo !== tipoUsuario) {
                alert('Tipo de usuário incorreto!');
                return false;
            }
            
            // Salvar informações do usuário logado
            localStorage.setItem('usuarioLogado', JSON.stringify({
                ...usuario,
                tipoUsuario
            }));
            
            // Redirecionar para a dashboard específica
            if (tipoUsuario === 'empresa') {
                window.location.href = './dashboard-empresa.html';
            } else {
                window.location.href = './dashboard-candidato.html';
            }
        } else {
            alert('Email ou senha incorretos!');
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

document.addEventListener('DOMContentLoaded', function() {
    const userTypeButtons = document.querySelectorAll('.user-type-btn');
    const tipoUsuarioInput = document.getElementById('tipoUsuario');

    userTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            userTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            tipoUsuarioInput.value = this.dataset.type;
        });
    });
});

function mostrarRegistro() {
    // Implementar lógica de registro
    alert('Funcionalidade de registro em desenvolvimento');
}
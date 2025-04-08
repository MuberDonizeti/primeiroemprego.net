async function fazerLogin(event) {
    event.preventDefault();
    
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    try {
        // Fazer login usando a API em vez do localStorage
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha, tipoUsuario })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Salvar informações do usuário logado
            localStorage.setItem('usuarioLogado', JSON.stringify({
                ...data.usuario,
                tipoUsuario,
                token: data.token // Armazenar o token JWT para autenticação
            }));
            
            // Redirecionar para a dashboard específica
            if (tipoUsuario === 'empresa') {
                window.location.href = './dashboard-empresa.html';
            } else {
                window.location.href = './dashboard-candidato.html';
            }
        } else {
            alert(data.message || 'Email ou senha incorretos!');
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
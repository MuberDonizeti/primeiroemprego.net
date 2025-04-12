async function fazerLogin(event) {
    event.preventDefault();
    
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    try {
        // Verificar se é um candidato
        if (tipoUsuario === 'candidato') {
            const candidatos = JSON.parse(localStorage.getItem('candidatos')) || [];
            const candidato = candidatos.find(c => c.email === email && c.senha === senha);
            
            if (candidato) {
                // Salvar informações do usuário logado
                localStorage.setItem('usuarioLogado', JSON.stringify({
                    ...candidato,
                    tipoUsuario
                }));
                
                window.location.href = './dashboard-candidato.html';
                return false;
            }
        }
        // Verificar se é uma empresa
        else if (tipoUsuario === 'empresa') {
            const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
            const empresa = empresas.find(e => e.email === email && e.senha === senha);
            
            if (empresa) {
                // Salvar informações do usuário logado
                localStorage.setItem('usuarioLogado', JSON.stringify({
                    ...empresa,
                    tipoUsuario
                }));
                
                window.location.href = './dashboard-empresa.html';
                return false;
            }
        }
        
        // Se não encontrou usuário válido
        alert('Email ou senha incorretos!');

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
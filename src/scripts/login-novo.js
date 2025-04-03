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

async function fazerLogin(event) {
    event.preventDefault();
    
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                senha,
                tipoUsuario
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Armazenar dados do usuário na sessão
            sessionStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
            
            mostrarNotificacao('Login realizado com sucesso!', 'sucesso');
            
            // Redirecionar para a dashboard específica
            setTimeout(() => {
                if (tipoUsuario === 'empresa') {
                    window.location.href = './dashboard-empresa.html';
                } else {
                    window.location.href = './dashboard-candidato.html';
                }
            }, 1000);
        } else {
            mostrarNotificacao(data.erro || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        mostrarNotificacao('Erro ao conectar com o servidor');
    }
    
    return false;
}

// Função de logout
function logout() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = './index.html';
}
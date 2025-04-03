function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = './login.html';
        return;
    }
    
    const usuario = JSON.parse(usuarioLogado);
    document.getElementById('userName').textContent = usuario.nome;
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = './index.html';
}

function novaVaga() {
    const modal = document.getElementById('formContainer');
    modal.classList.add('active');
}

function inscreverCandidato() {
    const modal = document.getElementById('candidatoFormContainer');
    modal.classList.add('active');
}

function cancelarForm() {
    const modal = document.getElementById('formContainer');
    modal.classList.remove('active');
}

function cancelarFormCandidato() {
    const modal = document.getElementById('candidatoFormContainer');
    modal.classList.remove('active');
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    }
}

// Prevenir fechamento ao clicar no conteúdo do modal
document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});
// Verificar se o usuário está logado e é um candidato
function verificarAutenticacao() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || usuarioLogado.tipoUsuario !== 'candidato') {
        window.location.href = './login.html';
        return null;
    }
    return usuarioLogado;
}

// Carregar informações do usuário
function carregarInfoUsuario() {
    const usuario = verificarAutenticacao();
    if (usuario) {
        document.getElementById('userName').textContent = usuario.nome;
    }
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = mensagem;
    notification.className = `notification ${tipo}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Função para formatar data
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Carregar vagas disponíveis
function carregarVagas() {
    const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
    const vagasDisponiveis = document.getElementById('vagasDisponiveis');
    const usuario = verificarAutenticacao();

    vagasDisponiveis.innerHTML = '';
    
    vagas.forEach(vaga => {
        const vagaElement = document.createElement('div');
        vagaElement.className = 'vaga-card';
        vagaElement.innerHTML = `
            <h3>${vaga.titulo}</h3>
            <p class="empresa">${vaga.empresa}</p>
            <p class="localizacao"><i class="fas fa-map-marker-alt"></i> ${vaga.localizacao}</p>
            <p class="descricao">${vaga.descricao.substring(0, 100)}...</p>
            <button onclick="abrirDetalhesVaga(${vaga.id})" class="btn-secondary">Ver Detalhes</button>
        `;
        vagasDisponiveis.appendChild(vagaElement);
    });
}

// Carregar candidaturas do usuário
function carregarCandidaturas() {
    const usuario = verificarAutenticacao();
    if (!usuario) return;

    const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
    const minhasCandidaturas = document.getElementById('minhasCandidaturas');
    
    minhasCandidaturas.innerHTML = '';
    
    usuario.vagasInscritas.forEach(vagaId => {
        const vaga = vagas.find(v => v.id === vagaId);
        if (vaga) {
            const vagaElement = document.createElement('div');
            vagaElement.className = 'vaga-card candidatura';
            vagaElement.innerHTML = `
                <h3>${vaga.titulo}</h3>
                <p class="empresa">${vaga.empresa}</p>
                <p class="localizacao"><i class="fas fa-map-marker-alt"></i> ${vaga.localizacao}</p>
                <p class="status">Status: Em análise</p>
                <button onclick="abrirDetalhesVaga(${vaga.id})" class="btn-secondary">Ver Detalhes</button>
            `;
            minhasCandidaturas.appendChild(vagaElement);
        }
    });
}

// Função para buscar vagas
function buscarVagas() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
    const vagasDisponiveis = document.getElementById('vagasDisponiveis');
    
    vagasDisponiveis.innerHTML = '';
    
    const vagasFiltradas = vagas.filter(vaga => 
        vaga.titulo.toLowerCase().includes(searchTerm) ||
        vaga.descricao.toLowerCase().includes(searchTerm) ||
        vaga.empresa.toLowerCase().includes(searchTerm)
    );
    
    vagasFiltradas.forEach(vaga => {
        const vagaElement = document.createElement('div');
        vagaElement.className = 'vaga-card';
        vagaElement.innerHTML = `
            <h3>${vaga.titulo}</h3>
            <p class="empresa">${vaga.empresa}</p>
            <p class="localizacao"><i class="fas fa-map-marker-alt"></i> ${vaga.localizacao}</p>
            <p class="descricao">${vaga.descricao.substring(0, 100)}...</p>
            <button onclick="abrirDetalhesVaga(${vaga.id})" class="btn-secondary">Ver Detalhes</button>
        `;
        vagasDisponiveis.appendChild(vagaElement);
    });
}

// Abrir modal com detalhes da vaga
function abrirDetalhesVaga(vagaId) {
    const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
    const vaga = vagas.find(v => v.id === vagaId);
    const usuario = verificarAutenticacao();
    
    if (vaga) {
        const modal = document.getElementById('vagaModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        const btnCandidatar = document.getElementById('btnCandidatar');
        
        modalTitle.textContent = vaga.titulo;
        modalContent.innerHTML = `
            <p><strong>Empresa:</strong> ${vaga.empresa}</p>
            <p><strong>Localização:</strong> ${vaga.localizacao}</p>
            <p><strong>Descrição:</strong> ${vaga.descricao}</p>
            <p><strong>Requisitos:</strong> ${vaga.requisitos}</p>
            <p><strong>Salário:</strong> ${vaga.salario}</p>
            <p><strong>Data de Publicação:</strong> ${formatarData(vaga.dataCriacao)}</p>
        `;
        
        // Verificar se o usuário já se candidatou
        const jaCandidatou = usuario.vagasInscritas.includes(vagaId);
        if (jaCandidatou) {
            btnCandidatar.textContent = 'Candidatura Enviada';
            btnCandidatar.disabled = true;
        } else {
            btnCandidatar.textContent = 'Candidatar-se';
            btnCandidatar.disabled = false;
            btnCandidatar.onclick = () => candidatarVaga(vagaId);
        }
        
        modal.style.display = 'block';
    }
}

// Função para se candidatar a uma vaga
async function candidatarVaga(vagaId) {
    const usuario = verificarAutenticacao();
    if (!usuario) return;

    try {
        // Atualizar array de candidaturas do usuário
        usuario.vagasInscritas.push(vagaId);
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

        // Atualizar no array de candidatos
        const candidatos = JSON.parse(localStorage.getItem('candidatos')) || [];
        const candidatoIndex = candidatos.findIndex(c => c.email === usuario.email);
        if (candidatoIndex !== -1) {
            candidatos[candidatoIndex].vagasInscritas.push(vagaId);
            localStorage.setItem('candidatos', JSON.stringify(candidatos));
        }

        mostrarNotificacao('Candidatura realizada com sucesso!');
        document.getElementById('vagaModal').style.display = 'none';
        carregarCandidaturas();
    } catch (error) {
        console.error('Erro ao candidatar-se:', error);
        mostrarNotificacao('Erro ao realizar candidatura. Tente novamente.', 'error');
    }
}

// Fechar modal
document.querySelector('.close').onclick = function() {
    document.getElementById('vagaModal').style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('vagaModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = './index.html';
}

// Carregar dados iniciais
document.addEventListener('DOMContentLoaded', () => {
    carregarInfoUsuario();
    carregarVagas();
    carregarCandidaturas();
});
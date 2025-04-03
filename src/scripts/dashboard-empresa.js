// Verificar se o usuário está logado e é uma empresa
function verificarAutenticacao() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || usuarioLogado.tipoUsuario !== 'empresa') {
        window.location.href = './login.html';
        return null;
    }
    return usuarioLogado;
}

// Carregar informações da empresa
function carregarInfoEmpresa() {
    const empresa = verificarAutenticacao();
    if (empresa) {
        document.getElementById('empresaName').textContent = empresa.nomeEmpresa;
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

// Carregar vagas da empresa
function carregarVagas() {
    const empresa = verificarAutenticacao();
    if (!empresa) return;

    const todasVagas = JSON.parse(localStorage.getItem('vagas')) || [];
    const minhasVagas = todasVagas.filter(vaga => vaga.empresaId === empresa.cnpj);
    const minhasVagasElement = document.getElementById('minhasVagas');

    minhasVagasElement.innerHTML = '';
    
    minhasVagas.forEach(vaga => {
        const vagaElement = document.createElement('div');
        vagaElement.className = 'vaga-card';
        vagaElement.innerHTML = `
            <h3>${vaga.titulo}</h3>
            <p class="localizacao"><i class="fas fa-map-marker-alt"></i> ${vaga.localizacao}</p>
            <p class="descricao">${vaga.descricao.substring(0, 100)}...</p>
            <div class="vaga-actions">
                <button onclick="editarVaga(${vaga.id})" class="btn-secondary">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="excluirVaga(${vaga.id})" class="btn-danger">
                    <i class="fas fa-trash"></i> Excluir
                </button>
                <button onclick="verCandidaturas(${vaga.id})" class="btn-info">
                    <i class="fas fa-users"></i> Candidaturas
                </button>
            </div>
        `;
        minhasVagasElement.appendChild(vagaElement);
    });
}

// Abrir modal para nova vaga
function abrirModalNovaVaga() {
    const modal = document.getElementById('vagaModal');
    const form = document.getElementById('vagaForm');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Nova Vaga';
    form.reset();
    document.getElementById('vagaId').value = '';
    
    modal.style.display = 'block';
}

// Editar vaga existente
function editarVaga(vagaId) {
    const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
    const vaga = vagas.find(v => v.id === vagaId);
    
    if (vaga) {
        const modal = document.getElementById('vagaModal');
        const modalTitle = document.getElementById('modalTitle');
        
        modalTitle.textContent = 'Editar Vaga';
        
        document.getElementById('vagaId').value = vaga.id;
        document.getElementById('titulo').value = vaga.titulo;
        document.getElementById('localizacao').value = vaga.localizacao;
        document.getElementById('descricao').value = vaga.descricao;
        document.getElementById('requisitos').value = vaga.requisitos;
        document.getElementById('salario').value = vaga.salario;
        
        modal.style.display = 'block';
    }
}

// Salvar vaga (criar nova ou atualizar existente)
async function salvarVaga(event) {
    event.preventDefault();
    
    const empresa = verificarAutenticacao();
    if (!empresa) return false;

    const vagaId = document.getElementById('vagaId').value;
    const vagaData = {
        titulo: document.getElementById('titulo').value,
        localizacao: document.getElementById('localizacao').value,
        descricao: document.getElementById('descricao').value,
        requisitos: document.getElementById('requisitos').value,
        salario: document.getElementById('salario').value,
        empresa: empresa.nomeEmpresa,
        empresaId: empresa.cnpj
    };

    try {
        const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        
        if (vagaId) {
            // Atualizar vaga existente
            const index = vagas.findIndex(v => v.id === parseInt(vagaId));
            if (index !== -1) {
                vagas[index] = { ...vagas[index], ...vagaData };
                mostrarNotificacao('Vaga atualizada com sucesso!');
            }
        } else {
            // Criar nova vaga
            vagaData.id = Date.now();
            vagaData.dataCriacao = new Date().toISOString();
            vagas.push(vagaData);
            mostrarNotificacao('Vaga criada com sucesso!');
        }

        localStorage.setItem('vagas', JSON.stringify(vagas));
        document.getElementById('vagaModal').style.display = 'none';
        carregarVagas();
    } catch (error) {
        console.error('Erro ao salvar vaga:', error);
        mostrarNotificacao('Erro ao salvar vaga. Tente novamente.', 'error');
    }

    return false;
}

// Excluir vaga
async function excluirVaga(vagaId) {
    if (!confirm('Tem certeza que deseja excluir esta vaga?')) return;

    try {
        const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        const index = vagas.findIndex(v => v.id === vagaId);
        
        if (index !== -1) {
            vagas.splice(index, 1);
            localStorage.setItem('vagas', JSON.stringify(vagas));
            
            // Remover a vaga das candidaturas dos usuários
            const candidatos = JSON.parse(localStorage.getItem('candidatos')) || [];
            candidatos.forEach(candidato => {
                const vagaIndex = candidato.vagasInscritas.indexOf(vagaId);
                if (vagaIndex !== -1) {
                    candidato.vagasInscritas.splice(vagaIndex, 1);
                }
            });
            localStorage.setItem('candidatos', JSON.stringify(candidatos));
            
            mostrarNotificacao('Vaga excluída com sucesso!');
            carregarVagas();
        }
    } catch (error) {
        console.error('Erro ao excluir vaga:', error);
        mostrarNotificacao('Erro ao excluir vaga. Tente novamente.', 'error');
    }
}

// Ver candidaturas de uma vaga
function verCandidaturas(vagaId) {
    const candidatos = JSON.parse(localStorage.getItem('candidatos')) || [];
    const candidatosDaVaga = candidatos.filter(c => c.vagasInscritas.includes(vagaId));
    
    const modal = document.getElementById('candidaturasModal');
    const listaCandidaturas = document.getElementById('listaCandidaturas');
    
    listaCandidaturas.innerHTML = '';
    
    if (candidatosDaVaga.length === 0) {
        listaCandidaturas.innerHTML = '<p>Ainda não há candidaturas para esta vaga.</p>';
    } else {
        candidatosDaVaga.forEach(candidato => {
            const candidaturaElement = document.createElement('div');
            candidaturaElement.className = 'candidatura-item';
            candidaturaElement.innerHTML = `
                <h3>${candidato.nome}</h3>
                <p><strong>Email:</strong> ${candidato.email}</p>
                <p><strong>Telefone:</strong> ${candidato.telefone}</p>
                <p><strong>Data de Candidatura:</strong> ${formatarData(new Date())}</p>
            `;
            listaCandidaturas.appendChild(candidaturaElement);
        });
    }
    
    modal.style.display = 'block';
}

// Fechar modais
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});

// Fechar modais ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = './index.html';
}

// Carregar dados iniciais
document.addEventListener('DOMContentLoaded', () => {
    carregarInfoEmpresa();
    carregarVagas();
});
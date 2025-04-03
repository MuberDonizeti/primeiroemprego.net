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

// Função para abrir o modal de nova vaga
function novaVaga() {
    const modal = document.getElementById('formContainer');
    modal.style.display = 'block';
}

// Função para fechar o modal de nova vaga
function cancelarForm() {
    const modal = document.getElementById('formContainer');
    modal.style.display = 'none';
    document.getElementById('vagaForm').reset();
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target == modal) {
            modal.style.display = 'none';
            if (modal.querySelector('form')) {
                modal.querySelector('form').reset();
            }
        }
    }
}

// Função para exibir as vagas
// Função para mostrar detalhes da vaga
function mostrarDetalhesVaga(index) {
    const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
    const vaga = vagas[index];
    
    const detalhesContent = document.getElementById('detalhesVagaContent');
    detalhesContent.innerHTML = `
        <div class="vaga-detalhes-completo">
            <h3>${vaga.nome}</h3>
            <div class="info-grupo">
                <p><i class="fas fa-building"></i> <strong>Empresa:</strong> ${vaga.empresa}</p>
                <p><i class="fas fa-map-marker-alt"></i> <strong>Localidade:</strong> ${vaga.localidade}</p>
                <p><i class="fas fa-money-bill-wave"></i> <strong>Salário:</strong> ${vaga.salario}</p>
                <p><i class="fas fa-file-contract"></i> <strong>Contrato:</strong> ${vaga.contrato}</p>
                <p><i class="fas fa-layer-group"></i> <strong>Nível:</strong> ${vaga.nivel}</p>
                <p><i class="fas fa-calendar-alt"></i> <strong>Data Limite:</strong> ${vaga.data}</p>
            </div>
            <div class="descricao-grupo">
                <h4>Descrição da Vaga</h4>
                <p>${vaga.descricao}</p>
            </div>
            <div class="requisitos-grupo">
                <h4>Requisitos</h4>
                <p>${vaga.requisitos}</p>
            </div>
            <div class="beneficios-grupo">
                <h4>Benefícios</h4>
                <p>${vaga.beneficios}</p>
            </div>
            ${vaga.candidatos ? `
                <div class="candidatos-grupo">
                    <h4>Candidatos Inscritos (${vaga.candidatos.length})</h4>
                    <ul>
                        ${vaga.candidatos.map(c => `
                            <li>
                                <strong>${c.nome}</strong><br>
                                Email: ${c.email}<br>
                                Telefone: ${c.telefone}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    
    const modal = document.getElementById('detalhesVagaModal');
    modal.style.display = 'block';
}

// Função para fechar o modal de detalhes
function fecharDetalhesVaga() {
    const modal = document.getElementById('detalhesVagaModal');
    modal.style.display = 'none';
}

// Modificar a função exibirVagas para adicionar o evento de clique
function exibirVagas() {
    const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
    const listaVagas = document.getElementById('listaVagas');
    
    listaVagas.innerHTML = '';
    
    if (vagas.length === 0) {
        listaVagas.innerHTML = '<p class="no-vagas">Nenhuma vaga cadastrada.</p>';
        return;
    }

    vagas.forEach((vaga, index) => {
        const vagaElement = document.createElement('div');
        vagaElement.className = 'vaga-card';
        vagaElement.onclick = () => mostrarDetalhesVaga(index);
        vagaElement.innerHTML = `
            <h3>${vaga.nome}</h3>
            <p class="empresa"><i class="fas fa-building"></i> ${vaga.empresa}</p>
            <p class="localidade"><i class="fas fa-map-marker-alt"></i> ${vaga.localidade}</p>
            <p class="salario"><i class="fas fa-money-bill-wave"></i> ${vaga.salario}</p>
            <p class="contrato"><i class="fas fa-file-contract"></i> ${vaga.contrato}</p>
            <p class="nivel"><i class="fas fa-layer-group"></i> ${vaga.nivel}</p>
            <p class="data"><i class="fas fa-calendar-alt"></i> Data Limite: ${vaga.data}</p>
            <div class="vaga-detalhes">
                <p><strong>Descrição:</strong> ${vaga.descricao}</p>
                <p><strong>Requisitos:</strong> ${vaga.requisitos}</p>
                <p><strong>Benefícios:</strong> ${vaga.beneficios}</p>
            </div>
            <p class="indice">Índice da vaga: ${index}</p>
        `;
        listaVagas.appendChild(vagaElement);
    });
}

// Manipulador do formulário de nova vaga
document.getElementById('vagaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const vaga = {
        nome: document.getElementById('nome').value,
        empresa: document.getElementById('empresa').value,
        localidade: document.getElementById('localidade').value,
        salario: document.getElementById('salario').value,
        contrato: document.getElementById('contrato').value,
        nivel: document.getElementById('nivel').value,
        descricao: document.getElementById('descricao').value,
        requisitos: document.getElementById('requisitos').value,
        beneficios: document.getElementById('beneficios').value,
        data: document.getElementById('data').value
    };
    
    let vagas = JSON.parse(localStorage.getItem('vagas')) || [];
    vagas.push(vaga);
    localStorage.setItem('vagas', JSON.stringify(vagas));
    
    cancelarForm();
    exibirVagas();
    alert('Vaga cadastrada com sucesso!');
});

// Carregar vagas quando a página for carregada
document.addEventListener('DOMContentLoaded', exibirVagas);


// Função para abrir o modal de inscrição
function inscreverCandidato() {
    const modal = document.getElementById('candidatoFormContainer');
    modal.style.display = 'block';
}

// Função para fechar o modal de inscrição
function cancelarFormCandidato() {
    const modal = document.getElementById('candidatoFormContainer');
    modal.style.display = 'none';
    document.getElementById('candidatoForm').reset();
}

// Manipulador do formulário de inscrição
document.getElementById('candidatoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const vagaIndex = parseInt(document.getElementById('vagaIndex').value);
    const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
    
    // Verifica se o índice é válido (agora inclui o índice 0)
    if (vagaIndex >= 0 && vagaIndex < vagas.length) {
        const candidato = {
            nome: document.getElementById('nomeCandidato').value,
            email: document.getElementById('emailCandidato').value,
            telefone: document.getElementById('telefoneCandidato').value,
            experiencia: document.getElementById('experienciaCandidato').value
        };
        
        // Adiciona o candidato à vaga
        if (!vagas[vagaIndex].candidatos) {
            vagas[vagaIndex].candidatos = [];
        }
        vagas[vagaIndex].candidatos.push(candidato);
        
        // Atualiza o localStorage
        localStorage.setItem('vagas', JSON.stringify(vagas));
        
        cancelarFormCandidato();
        alert('Candidatura realizada com sucesso!');
    } else {
        alert('Índice de vaga inválido!');
    }
});
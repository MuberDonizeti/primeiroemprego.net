const vagas = []

// Inicializa os dados de exemplo no localStorage
if (!localStorage.getItem('vagas')) {
    localStorage.setItem('vagas', JSON.stringify(vagasExemplo));
}

function listarVagas() {
    const listaElement = document.getElementById('listaVagas')
    listaElement.innerHTML = ''

    if (vagas.length === 0) {
        listaElement.innerHTML = '<p class="no-vagas">Nenhuma vaga cadastrada.</p>'
        return
    }

    vagas.forEach((vaga, index) => {
        const vagaDiv = document.createElement('div')
        vagaDiv.className = 'vaga-card'
        vagaDiv.innerHTML = `
            <div class="vaga-header">
                <h3>${vaga.nome}</h3>
                <span class="vaga-empresa">${vaga.empresa}</span>
            </div>
            <div class="vaga-info">
                <p><i class="fas fa-map-marker-alt"></i> ${vaga.localidade}</p>
                <p><i class="fas fa-money-bill-wave"></i> ${vaga.salario}</p>
                <p><i class="fas fa-briefcase"></i> ${vaga.contrato}</p>
                <p><i class="fas fa-layer-group"></i> ${vaga.nivel}</p>
            </div>
            <div class="vaga-descricao">
                <h4>Descrição:</h4>
                <p>${vaga.descricao}</p>
                <h4>Requisitos:</h4>
                <p>${vaga.requisitos}</p>
                <h4>Benefícios:</h4>
                <p>${vaga.beneficios}</p>
            </div>
            <div class="vaga-footer">
                <span class="vaga-data">Publicada em: ${vaga.dataCriacao}</span>
                <span class="vaga-limite">Prazo: ${vaga.dataLimite}</span>
                <button onclick="inscreverCandidato(${index})" class="btn-candidatar">Candidatar-se</button>
            </div>
        `
        listaElement.appendChild(vagaDiv)
    })
}

function novaVaga() {
    document.getElementById('formContainer').style.display = 'block'
    document.getElementById('vagaForm').onsubmit = function(e) {
        e.preventDefault()
        
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
            dataLimite: document.getElementById('data').value,
            dataCriacao: new Date().toLocaleDateString(),
            candidatos: []
        }
        
        vagas.push(vaga)
        alert('Vaga cadastrada com sucesso!')
        
        document.getElementById('vagaForm').reset()
        document.getElementById('formContainer').style.display = 'none'
        listarVagas()
    }
}

function cancelarForm() {
    document.getElementById('vagaForm').reset()
    document.getElementById('formContainer').style.display = 'none'
}

function visualizarVaga() {
    const indice = prompt('Digite o índice da vaga que deseja visualizar:')
    if (indice !== null && vagas[indice]) {
        const vaga = vagas[indice]
        alert(
            `Vaga: ${vaga.nome}\n` +
            `Descrição: ${vaga.descricao}\n` +
            `Data Limite: ${vaga.dataLimite}\n` +
            `Quantidade de candidatos: ${vaga.candidatos.length}\n` +
            `Candidatos: ${vaga.candidatos.join(', ')}`
        )
    } else {
        alert('Índice inválido!')
    }
}

function inscreverCandidato() {
    document.getElementById('candidatoFormContainer').style.display = 'block'
    document.getElementById('candidatoForm').onsubmit = function(e) {
        e.preventDefault()
        
        const vagaIndex = document.getElementById('vagaIndex').value
        
        if (!vagas[vagaIndex]) {
            alert('Índice de vaga inválido!')
            return
        }

        const candidato = {
            nome: document.getElementById('nomeCandidato').value,
            email: document.getElementById('emailCandidato').value,
            telefone: document.getElementById('telefoneCandidato').value,
            experiencia: document.getElementById('experienciaCandidato').value
        }
        
        vagas[vagaIndex].candidatos.push(candidato)
        alert('Candidato inscrito com sucesso!')
        
        document.getElementById('candidatoForm').reset()
        document.getElementById('candidatoFormContainer').style.display = 'none'
        listarVagas()
    }
}

function cancelarFormCandidato() {
    document.getElementById('candidatoForm').reset()
    document.getElementById('candidatoFormContainer').style.display = 'none'
}

function excluirVaga() {
    const indice = prompt('Digite o índice da vaga que deseja excluir:')
    if (indice !== null && vagas[indice]) {
        const confirmacao = confirm(
            `Tem certeza que deseja excluir a vaga "${vagas[indice].nome}"?`
        )
        if (confirmacao) {
            vagas.splice(indice, 1)
            alert('Vaga excluída com sucesso!')
            listarVagas()
        }
    } else {
        alert('Índice inválido!')
    }
}

function sair() {
    const confirmacao = confirm('Tem certeza que deseja sair do sistema?')
    if (confirmacao) {
        window.close()
    }
}

window.onload = listarVagas
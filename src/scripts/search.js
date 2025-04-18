async function buscarVagas(query, location) {
    try {
        const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        
        const vagasFiltradas = vagas.filter(vaga => {
            const matchQuery = vaga.titulo.toLowerCase().includes(query.toLowerCase()) ||
                             vaga.descricao.toLowerCase().includes(query.toLowerCase()) ||
                             vaga.empresa.toLowerCase().includes(query.toLowerCase());
            
            const matchLocation = !location || 
                                vaga.localizacao.toLowerCase().includes(location.toLowerCase());
            
            return matchQuery && matchLocation;
        });

        exibirResultados(vagasFiltradas);
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Ocorreu um erro ao buscar as vagas. Tente novamente.');
    }
}

function exibirResultados(vagas) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    
    if (vagas.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">Nenhuma vaga encontrada.</p>';
    } else {
        vagas.forEach(vaga => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <div class="job-header">
                    <h3>${vaga.titulo}</h3>
                    <span class="job-company">${vaga.empresa}</span>
                </div>
                <div class="job-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${vaga.localizacao}</p>
                    ${vaga.salario ? `<p><i class="fas fa-money-bill-wave"></i> ${vaga.salario}</p>` : ''}
                </div>
                <div class="job-description">
                    <p>${vaga.descricao}</p>
                </div>
                <div class="job-footer">
                    <button onclick="abrirDetalhesVaga(${vaga.id})" class="btn-apply">Ver Detalhes</button>
                </div>
            `;
            resultsContainer.appendChild(jobCard);
        });
    }

    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
    document.querySelector('.hero-section').appendChild(resultsContainer);
}

function mostrarErro(mensagem) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensagem;
    
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    document.querySelector('.search-container').appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.btn-search');
    const keywordInput = document.querySelector('input[placeholder="Cargo ou palavra-chave"]');
    const locationInput = document.querySelector('input[placeholder="Localização"]');

    searchButton.addEventListener('click', () => {
        const keyword = keywordInput.value.trim();
        const location = locationInput.value.trim();

        if (!keyword) {
            mostrarErro('Por favor, insira um cargo ou palavra-chave.');
            return;
        }

        buscarVagas(keyword, location);
    });
});
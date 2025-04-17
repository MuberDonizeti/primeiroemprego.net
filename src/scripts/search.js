// Configuração da API do Google Jobs
const GOOGLE_JOBS_API_KEY = 'API_KEY'; 
const GOOGLE_JOBS_API_URL = 'https://jobs.googleapis.com/v4/jobs:search';

async function buscarVagas(query, location) {
    try {
        const searchParams = {
            requestMetadata: {
                userId: 'user-' + Math.random().toString(36).substring(7),
                sessionId: 'session-' + Math.random().toString(36).substring(7),
                domain: 'primeiroemprego.net'
            },
            searchMode: 'JOB_SEARCH',
            jobQuery: {
                query: query,
                location: location
            }
        };

        const response = await fetch(`${GOOGLE_JOBS_API_URL}?key=${GOOGLE_JOBS_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchParams)
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar vagas');
        }

        const data = await response.json();
        exibirResultados(data.jobs || []);
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Ocorreu um erro ao buscar as vagas. Tente novamente.');
    }
}

function exibirResultados(jobs) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    
    if (jobs.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">Nenhuma vaga encontrada.</p>';
    } else {
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <div class="job-header">
                    <h3>${job.title}</h3>
                    <span class="job-company">${job.company}</span>
                </div>
                <div class="job-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${job.locations.join(', ')}</p>
                    ${job.salary ? `<p><i class="fas fa-money-bill-wave"></i> ${job.salary}</p>` : ''}
                </div>
                <div class="job-description">
                    <p>${job.description}</p>
                </div>
                <div class="job-footer">
                    <a href="${job.applicationUrl}" target="_blank" class="btn-apply">Candidatar-se</a>
                </div>
            `;
            resultsContainer.appendChild(jobCard);
        });
    }

    // Remover resultados anteriores e adicionar novos
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
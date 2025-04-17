const LINKEDIN_API_URL = 'https://api.linkedin.com/v2/jobs';

// Função para buscar vagas no LinkedIn
async function buscarVagasLinkedIn(cargo, localizacao) {
    try {
        const headers = {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
            'Content-Type': 'application/json'
        };

        const params = new URLSearchParams({
            keywords: cargo,
            location: localizacao,
            count: 10 
        });

        const response = await fetch(`${LINKEDIN_API_URL}/search?${params}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar vagas');
        }

        const data = await response.json();
        exibirResultados(data);
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Ocorreu um erro ao buscar as vagas. Tente novamente mais tarde.');
    }
}

// Função para exibir os resultados da busca
function exibirResultados(data) {
    const resultadosContainer = document.createElement('div');
    resultadosContainer.className = 'resultados-busca';
    
    if (!data.elements || data.elements.length === 0) {
        resultadosContainer.innerHTML = '<p class="no-vagas">Nenhuma vaga encontrada.</p>';
        return;
    }

    data.elements.forEach(vaga => {
        const vagaCard = document.createElement('div');
        vagaCard.className = 'vaga-card';
        vagaCard.innerHTML = `
            <div class="vaga-header">
                <h3>${vaga.title}</h3>
                <span class="vaga-empresa">${vaga.company.name}</span>
            </div>
            <div class="vaga-info">
                <p><i class="fas fa-map-marker-alt"></i> ${vaga.location.name}</p>
                <p><i class="fas fa-briefcase"></i> ${vaga.employmentStatus}</p>
            </div>
            <div class="vaga-descricao">
                <p>${vaga.description}</p>
            </div>
            <div class="vaga-footer">
                <a href="${vaga.applyUrl}" target="_blank" class="btn-candidatar">Candidatar-se no LinkedIn</a>
            </div>
        `;
        resultadosContainer.appendChild(vagaCard);
    });

    // Adicionar os resultados à página
    const mainContent = document.querySelector('.hero-section');
    const existingResults = document.querySelector('.resultados-busca');
    if (existingResults) {
        mainContent.removeChild(existingResults);
    }
    mainContent.appendChild(resultadosContainer);
}

function mostrarErro(mensagem) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensagem;
    
    const mainContent = document.querySelector('.hero-section');
    mainContent.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.querySelector('.btn-search');
    btnSearch.addEventListener('click', () => {
        const cargo = document.querySelector('input[placeholder="Cargo ou palavra-chave"]').value;
        const localizacao = document.querySelector('input[placeholder="Localização"]').value;
        
        if (!cargo) {
            mostrarErro('Por favor, insira um cargo ou palavra-chave.');
            return;
        }
        
        buscarVagasLinkedIn(cargo, localizacao);
    });
});
// Configurações globais
const CONFIG = {
    ITEMS_PER_PAGE: 12,
    DEBOUNCE_DELAY: 300
};

// Estado global da aplicação
let state = {
    currentPage: 1,
    filters: {
        tipo: 'todas',
        nivel: 'todos',
        regime: 'todos'
    },
    ordenacao: 'recentes'
};

// Função para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function buscarVagas(query, location) {
    try {
        const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
        
        let vagasFiltradas = vagas.filter(vaga => {
            const matchQuery = !query || 
                             vaga.titulo.toLowerCase().includes(query.toLowerCase()) ||
                             vaga.descricao.toLowerCase().includes(query.toLowerCase()) ||
                             vaga.empresa.toLowerCase().includes(query.toLowerCase());
            
            const matchLocation = !location || 
                                vaga.localizacao.toLowerCase().includes(location.toLowerCase());
            
            const matchTipo = state.filters.tipo === 'todas' || vaga.tipo === state.filters.tipo;
            const matchNivel = state.filters.nivel === 'todos' || vaga.nivel === state.filters.nivel;
            const matchRegime = state.filters.regime === 'todos' || vaga.regime === state.filters.regime;
            
            return matchQuery && matchLocation && matchTipo && matchNivel && matchRegime;
        });

        // Ordenação
        vagasFiltradas = ordenarVagas(vagasFiltradas);

        // Paginação
        const inicio = (state.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
        const fim = inicio + CONFIG.ITEMS_PER_PAGE;
        const vagasPaginadas = vagasFiltradas.slice(inicio, fim);
        
        exibirResultados(vagasPaginadas, vagasFiltradas.length);
        atualizarPaginacao(vagasFiltradas.length);
        
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Ocorreu um erro ao buscar as vagas. Tente novamente.');
    }
}

function ordenarVagas(vagas) {
    switch(state.ordenacao) {
        case 'recentes':
            return vagas.sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao));
        case 'antigas':
            return vagas.sort((a, b) => new Date(a.dataPublicacao) - new Date(b.dataPublicacao));
        case 'empresa':
            return vagas.sort((a, b) => a.empresa.localeCompare(b.empresa));
        default:
            return vagas;
    }
}

function exibirResultados(vagas, totalVagas) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    
    if (vagas.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">Nenhuma vaga encontrada.</p>';
    } else {
        // Adiciona contador de resultados
        const countHeader = document.createElement('div');
        countHeader.className = 'results-count';
        countHeader.innerHTML = `<p>${totalVagas} ${totalVagas === 1 ? 'vaga encontrada' : 'vagas encontradas'}</p>`;
        resultsContainer.appendChild(countHeader);

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
                    <p><i class="fas fa-briefcase"></i> ${vaga.tipo}</p>
                    <p><i class="fas fa-user-graduate"></i> ${vaga.nivel}</p>
                </div>
                <div class="job-description">
                    <p>${vaga.descricao.substring(0, 150)}${vaga.descricao.length > 150 ? '...' : ''}</p>
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

function atualizarPaginacao(totalItems) {
    const totalPages = Math.ceil(totalItems / CONFIG.ITEMS_PER_PAGE);
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    
    if (totalPages > 1) {
        paginationContainer.innerHTML = `
            <button ${state.currentPage === 1 ? 'disabled' : ''} onclick="mudarPagina(${state.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
            <span>Página ${state.currentPage} de ${totalPages}</span>
            <button ${state.currentPage === totalPages ? 'disabled' : ''} onclick="mudarPagina(${state.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        const existingPagination = document.querySelector('.pagination');
        if (existingPagination) {
            existingPagination.remove();
        }
        document.querySelector('.hero-section').appendChild(paginationContainer);
    }
}

function mudarPagina(newPage) {
    state.currentPage = newPage;
    const keyword = document.querySelector('#keyword').value.trim();
    const location = document.querySelector('#location').value.trim();
    buscarVagas(keyword, location);
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.btn-search');
    const keywordInput = document.querySelector('#keyword');
    const locationInput = document.querySelector('#location');

    // Adiciona filtros
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'search-filters';
    filtersContainer.innerHTML = `
        <div class="filter-group">
            <select id="tipo-vaga" onchange="atualizarFiltro('tipo', this.value)">
                <option value="todas">Todos os tipos</option>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Estágio">Estágio</option>
            </select>
            
            <select id="nivel-vaga" onchange="atualizarFiltro('nivel', this.value)">
                <option value="todos">Todos os níveis</option>
                <option value="Junior">Júnior</option>
                <option value="Pleno">Pleno</option>
                <option value="Senior">Sênior</option>
            </select>
            
            <select id="regime-vaga" onchange="atualizarFiltro('regime', this.value)">
                <option value="todos">Todos os regimes</option>
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
            </select>
            
            <select id="ordenacao" onchange="atualizarOrdenacao(this.value)">
                <option value="recentes">Mais recentes</option>
                <option value="antigas">Mais antigas</option>
                <option value="empresa">Por empresa</option>
            </select>
        </div>
    `;
    
    document.querySelector('.search-group').after(filtersContainer);

    // Event listeners
    const debouncedSearch = debounce(() => {
        state.currentPage = 1;
        const keyword = keywordInput.value.trim();
        const location = locationInput.value.trim();
        buscarVagas(keyword, location);
    }, CONFIG.DEBOUNCE_DELAY);

    keywordInput.addEventListener('input', debouncedSearch);
    locationInput.addEventListener('input', debouncedSearch);
    searchButton.addEventListener('click', debouncedSearch);
});

function atualizarFiltro(tipo, valor) {
    state.filters[tipo] = valor;
    state.currentPage = 1;
    const keyword = document.querySelector('#keyword').value.trim();
    const location = document.querySelector('#location').value.trim();
    buscarVagas(keyword, location);
}

function atualizarOrdenacao(valor) {
    state.ordenacao = valor;
    const keyword = document.querySelector('#keyword').value.trim();
    const location = document.querySelector('#location').value.trim();
    buscarVagas(keyword, location);
}

// Função para abrir detalhes da vaga
function abrirDetalhesVaga(id) {
    const vagas = JSON.parse(localStorage.getItem('vagas')) || [];
    const vaga = vagas.find(v => v.id === id);
    
    if (!vaga) {
        mostrarErro('Vaga não encontrada');
        return;
    }
    
    // Aqui você pode implementar a lógica para abrir uma nova página
    // ou um modal com os detalhes da vaga
    window.location.href = `/vaga/${id}`;
}
// Importar funções do módulo de integração com GitHub
import { fetchAllJobs, startJobUpdates, filterJobsByTech } from './github-jobs.js';

// Função para renderizar as vagas na interface
function renderJobs(jobs) {
    const jobsContainer = document.getElementById('vagas-container');
    if (!jobsContainer) return;

    jobsContainer.innerHTML = '';
    
    if (jobs.length === 0) {
        jobsContainer.innerHTML = `
            <div class="no-jobs-message">
                <p>Nenhuma vaga encontrada no momento.</p>
            </div>
        `;
        return;
    }

    jobs.forEach(job => {
        const jobCard = document.createElement('job-card');
        jobCard.jobData = job;
        jobsContainer.appendChild(jobCard);
    });
}

// Função para inicializar o dashboard de vagas
async function initJobsDashboard() {
    try {
        // Configurar campo de busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }

        // Iniciar atualizações periódicas de vagas
        startJobUpdates();

        // Carregar vagas iniciais
        const jobs = await fetchAllJobs();
        renderJobs(jobs);

        // Adicionar indicador de carregamento
        updateLoadingStatus(false);
    } catch (error) {
        console.error('Erro ao inicializar dashboard:', error);
        showErrorMessage('Erro ao carregar vagas. Tente novamente mais tarde.');
    }
}

// Função para lidar com a busca de vagas
function handleSearch(event) {
    const searchTerm = event.target.value.trim();
    const jobs = JSON.parse(localStorage.getItem('githubJobs')) || [];
    
    if (searchTerm === '') {
        renderJobs(jobs);
        return;
    }

    const filteredJobs = filterJobsByTech(jobs, searchTerm);
    renderJobs(filteredJobs);
}

// Função para atualizar status de carregamento
function updateLoadingStatus(isLoading) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
}

// Função para exibir mensagens de erro
function showErrorMessage(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
}

// Exportar função de inicialização
export { initJobsDashboard };
import { buscarTodasVagas, filtrarVagas } from './github-jobs.js';

// Cache para armazenar as vagas
let vagasCache = [];
let vagasFiltradas = [];
const VAGAS_POR_PAGINA = 10;
let paginaAtual = 1;

// Elementos do DOM
const loadingElement = document.getElementById('loading');
const vagasLista = document.getElementById('vagas-lista');
const pesquisaInput = document.getElementById('pesquisa');
const empresaInput = document.getElementById('empresa');
const tagsContainer = document.querySelector('.tags-container');
const btnAnterior = document.getElementById('anterior');
const btnProximo = document.getElementById('proximo');
const paginaAtualElement = document.getElementById('pagina-atual');

// Função para formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Função para criar o HTML de uma vaga
function criarVagaHTML(vaga) {
    return `
        <div class="vaga-card">
            <h2 class="vaga-titulo">
                <a href="${vaga.url}" target="_blank">${vaga.titulo}</a>
            </h2>
            <div class="vaga-empresa">${vaga.empresa}</div>
            <div class="vaga-meta">
                <span>📅 Publicado em: ${formatarData(vaga.data)}</span>
                <span>📍 Repositório: ${vaga.repositorio}</span>
            </div>
            <div class="vaga-labels">
                ${vaga.labels.map(label => `
                    <span class="vaga-label">${label}</span>
                `).join('')}
            </div>
        </div>
    `;
}

// Função para exibir as vagas na página
function exibirVagas(vagas) {
    const inicio = (paginaAtual - 1) * VAGAS_POR_PAGINA;
    const fim = inicio + VAGAS_POR_PAGINA;
    const vagasPagina = vagas.slice(inicio, fim);

    vagasLista.innerHTML = vagasPagina.map(criarVagaHTML).join('');
    
    // Atualiza paginação
    const totalPaginas = Math.ceil(vagas.length / VAGAS_POR_PAGINA);
    btnAnterior.disabled = paginaAtual === 1;
    btnProximo.disabled = paginaAtual === totalPaginas;
    paginaAtualElement.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
}

// Função para aplicar filtros
function aplicarFiltros() {
    const pesquisa = pesquisaInput.value.toLowerCase();
    const empresa = empresaInput.value.toLowerCase();
    const tagsAtivas = Array.from(document.querySelectorAll('.tag.active'))
        .map(tag => tag.dataset.tag);

    const filtros = {
        keyword: pesquisa,
        empresa: empresa,
        labels: tagsAtivas
    };

    vagasFiltradas = filtrarVagas(vagasCache, filtros);
    paginaAtual = 1; // Reset para primeira página
    exibirVagas(vagasFiltradas);
}

// Event Listeners
pesquisaInput.addEventListener('input', aplicarFiltros);
empresaInput.addEventListener('input', aplicarFiltros);

tagsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
        e.target.classList.toggle('active');
        aplicarFiltros();
    }
});

btnAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        exibirVagas(vagasFiltradas);
    }
});

btnProximo.addEventListener('click', () => {
    const totalPaginas = Math.ceil(vagasFiltradas.length / VAGAS_POR_PAGINA);
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        exibirVagas(vagasFiltradas);
    }
});

// Inicialização
async function inicializar() {
    try {
        loadingElement.style.display = 'flex';
        vagasLista.style.display = 'none';

        // Busca as vagas e armazena em cache
        vagasCache = await buscarTodasVagas();
        vagasFiltradas = [...vagasCache];
        
        // Exibe as vagas
        exibirVagas(vagasFiltradas);
    } catch (error) {
        console.error('Erro ao carregar vagas:', error);
        vagasLista.innerHTML = `
            <div class="error-message">
                Ocorreu um erro ao carregar as vagas. Por favor, tente novamente mais tarde.
            </div>
        `;
    } finally {
        loadingElement.style.display = 'none';
        vagasLista.style.display = 'block';
    }
}

// Inicia a aplicação
inicializar();
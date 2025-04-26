// Configuração da API do GitHub
const GITHUB_API_BASE = 'https://api.github.com';
const REPOS_TO_MONITOR = [
    { owner: 'backend-br', repo: 'vagas' },
    { owner: 'frontend-br', repo: 'vagas' },
    { owner: 'react-brasil', repo: 'vagas' }
];

// Função para buscar vagas de um repositório específico
async function fetchJobsFromRepo(owner, repo) {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=open&labels=job`);
        if (!response.ok) throw new Error('Erro ao buscar vagas');
        
        const issues = await response.json();
        return issues.map(issue => ({
            id: issue.id,
            titulo: issue.title,
            descricao: issue.body,
            empresa: extractCompanyName(issue.title),
            data_publicacao: new Date(issue.created_at),
            url: issue.html_url,
            labels: issue.labels.map(label => label.name),
            fonte: `${owner}/${repo}`
        }));
    } catch (error) {
        console.error(`Erro ao buscar vagas de ${owner}/${repo}:`, error);
        return [];
    }
}

// Função auxiliar para extrair nome da empresa do título
function extractCompanyName(title) {
    const matches = title.match(/\[.*?\]/);
    return matches ? matches[0].replace(/[\[\]]/g, '') : 'Empresa não especificada';
}

// Função principal para buscar todas as vagas
async function fetchAllJobs() {
    try {
        const allJobs = [];
        for (const repo of REPOS_TO_MONITOR) {
            const jobs = await fetchJobsFromRepo(repo.owner, repo.repo);
            allJobs.push(...jobs);
        }
        
        // Ordenar por data de publicação (mais recentes primeiro)
        allJobs.sort((a, b) => b.data_publicacao - a.data_publicacao);
        
        // Salvar no localStorage para acesso rápido
        localStorage.setItem('githubJobs', JSON.stringify(allJobs));
        
        return allJobs;
    } catch (error) {
        console.error('Erro ao buscar todas as vagas:', error);
        return [];
    }
}

// Função para atualizar vagas periodicamente
function startJobUpdates(intervalMinutes = 30) {
    fetchAllJobs(); // Busca inicial
    
    // Configurar atualização periódica
    setInterval(fetchAllJobs, intervalMinutes * 60 * 1000);
}

// Função para filtrar vagas por tecnologia
function filterJobsByTech(jobs, technology) {
    const techLower = technology.toLowerCase();
    return jobs.filter(job => {
        const titleMatch = job.titulo.toLowerCase().includes(techLower);
        const descMatch = job.descricao.toLowerCase().includes(techLower);
        const labelMatch = job.labels.some(label => 
            label.toLowerCase().includes(techLower)
        );
        return titleMatch || descMatch || labelMatch;
    });
}

// Exportar funções para uso em outros módulos
export {
    fetchAllJobs,
    startJobUpdates,
    filterJobsByTech
};
// Componente para exibir um card de vaga
class JobCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set jobData(data) {
        this.render(data);
    }

    render(data) {
        const formattedDate = new Date(data.data_publicacao).toLocaleDateString('pt-BR');
        
        this.shadowRoot.innerHTML = `
            <style>
                .job-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    transition: transform 0.2s;
                }

                .job-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }

                .job-title {
                    color: #2c3e50;
                    font-size: 1.2rem;
                    margin: 0 0 0.5rem 0;
                }

                .company-name {
                    color: #3498db;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }

                .job-meta {
                    display: flex;
                    justify-content: space-between;
                    color: #7f8c8d;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                }

                .labels {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .label {
                    background: #e0f2fe;
                    color: #0369a1;
                    padding: 0.25rem 0.75rem;
                    border-radius: 15px;
                    font-size: 0.8rem;
                }

                .view-button {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    transition: background 0.2s;
                }

                .view-button:hover {
                    background: #2980b9;
                }
            </style>

            <div class="job-card">
                <h3 class="job-title">${data.titulo}</h3>
                <div class="company-name">${data.empresa}</div>
                <div class="job-meta">
                    <span>Publicado em: ${formattedDate}</span>
                    <span>Fonte: ${data.fonte}</span>
                </div>
                <div class="labels">
                    ${data.labels.map(label => 
                        `<span class="label">${label}</span>`
                    ).join('')}
                </div>
                <a href="${data.url}" target="_blank" class="view-button">Ver Vaga</a>
            </div>
        `;
    }
}

customElements.define('job-card', JobCard);
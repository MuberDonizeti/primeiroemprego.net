# PrimeiroEmprego.net

Uma plataforma para conectar jovens em busca do primeiro emprego com empresas que oferecem oportunidades de entrada no mercado de trabalho.

## Sobre o Projeto

O PrimeiroEmprego.net é uma aplicação web desenvolvida para facilitar o encontro entre candidatos que buscam sua primeira experiência profissional e empresas que desejam contratar talentos em início de carreira. A plataforma permite que candidatos se cadastrem, criem perfis e se candidatem a vagas, enquanto empresas podem publicar oportunidades e gerenciar processos seletivos.

## Estrutura do Projeto

```
primeiroemprego.net/
├── src/
│   ├── database/
│   │   ├── config.js         # Configurações de conexão com o banco de dados
│   │   ├── connection.js     # Lógica de conexão com diferentes bancos de dados
│   │   ├── init.js           # Inicialização do banco de dados e criação de tabelas
│   │   └── models.js         # Modelos de dados (Candidato, Empresa, Vaga, Candidatura)
│   ├── pages/                # Páginas HTML da aplicação
│   ├── scripts/              # Scripts JavaScript para interação com o frontend
│   ├── styles/               # Arquivos CSS para estilização
│   └── server.js             # Servidor Express e rotas da API
├── .gitattributes
└── LICENSE
```

## Requisitos

- Node.js (v12 ou superior)
- NPM ou Yarn
- Um dos seguintes bancos de dados:
  - MySQL/MariaDB
  - MongoDB
  - SQLite

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/primeiroemprego.net.git
   cd primeiroemprego.net
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados (veja a seção "Configuração do Banco de Dados")

4. Inicie o servidor:
   ```bash
   node src/server.js
   ```

5. Acesse a aplicação em seu navegador:
   ```
   http://localhost:3000
   ```

## Configuração do Banco de Dados

O sistema suporta três opções de banco de dados: MySQL/MariaDB, MongoDB e SQLite. Você pode escolher qual utilizar editando o arquivo `src/database/config.js`.

### Opção 1: MySQL/MariaDB

1. Certifique-se de ter o MySQL ou MariaDB instalado e em execução
2. Crie um banco de dados chamado `primeiroemprego`
3. Edite o arquivo `src/database/config.js` para usar a configuração MySQL:

```javascript
// Exportar a configuração desejada
const config = mysql; // Use esta linha para MySQL/MariaDB
```

4. Ajuste os parâmetros de conexão conforme necessário (host, user, password, etc.)

### Opção 2: MongoDB

1. Certifique-se de ter o MongoDB instalado e em execução
2. Edite o arquivo `src/database/config.js` para usar a configuração MongoDB:

```javascript
// Exportar a configuração desejada
const config = mongodb; // Use esta linha para MongoDB
```

3. Ajuste a URL de conexão conforme necessário

### Opção 3: SQLite (recomendado para desenvolvimento)

1. Edite o arquivo `src/database/config.js` para usar a configuração SQLite:

```javascript
// Exportar a configuração desejada
const config = sqlite; // Use esta linha para SQLite
```

2. O arquivo do banco de dados será criado automaticamente no diretório raiz do projeto

## Funcionalidades

### Para Candidatos

- Cadastro de perfil
- Busca de vagas disponíveis
- Candidatura a vagas
- Acompanhamento de candidaturas

### Para Empresas

- Cadastro de perfil empresarial
- Publicação de vagas
- Gerenciamento de candidaturas recebidas
- Comunicação com candidatos

## API Endpoints

### Candidatos

- `POST /api/candidatos/verificar` - Verifica se CPF ou email já estão cadastrados
- `POST /api/candidatos/cadastrar` - Cadastra um novo candidato
- `POST /api/login/candidato` - Autentica um candidato
- `GET /api/candidatos/:id` - Obtém dados de um candidato específico

### Empresas

- `POST /api/empresas/verificar` - Verifica se CNPJ ou email já estão cadastrados
- `POST /api/empresas/cadastrar` - Cadastra uma nova empresa
- `POST /api/login/empresa` - Autentica uma empresa
- `GET /api/empresas/:id` - Obtém dados de uma empresa específica

### Vagas

- `POST /api/vagas/criar` - Cria uma nova vaga
- `GET /api/vagas` - Lista todas as vagas disponíveis
- `GET /api/vagas/:id` - Obtém detalhes de uma vaga específica
- `GET /api/empresas/:id/vagas` - Lista vagas de uma empresa específica

### Candidaturas

- `POST /api/candidaturas/criar` - Cria uma nova candidatura
- `GET /api/candidatos/:id/candidaturas` - Lista candidaturas de um candidato
- `GET /api/vagas/:id/candidaturas` - Lista candidaturas para uma vaga

## Autenticação

O sistema utiliza uma simulação de autenticação JWT. Em uma implementação real, tokens JWT seriam gerados e verificados adequadamente. Para usar os endpoints protegidos, inclua o token no cabeçalho de autorização:

```
Authorization: Bearer <token>
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para melhorar o projeto.

## Licença

Este projeto está licenciado sob os termos da licença incluída no arquivo LICENSE.
# Configuração do Banco de Dados

Este diretório contém os arquivos necessários para configurar o banco de dados PostgreSQL da aplicação PrimeiroEmprego.net.

## Estrutura

- `schema.sql`: Define a estrutura do banco de dados (tabelas, relacionamentos e índices)
- `db.js`: Arquivo de configuração para conexão com o banco de dados usando Node.js
- `.env.example`: Exemplo das variáveis de ambiente necessárias

## Pré-requisitos

1. PostgreSQL instalado e em execução
2. Node.js instalado
3. NPM (Node Package Manager) instalado

## Configuração

1. Instale as dependências necessárias:
   ```bash
   npm install pg dotenv
   ```

2. Crie um novo banco de dados PostgreSQL:
   ```sql
   CREATE DATABASE primeiroemprego;
   ```

3. Copie o arquivo `.env.example` para `.env` e configure suas variáveis:
   ```bash
   cp .env.example .env
   ```

4. Edite o arquivo `.env` com suas configurações locais:
   ```
   DB_USER=seu_usuario
   DB_HOST=localhost
   DB_NAME=primeiroemprego
   DB_PASSWORD=sua_senha
   DB_PORT=5432
   ```

5. Execute o script SQL para criar as tabelas:
   ```bash
   psql -U seu_usuario -d primeiroemprego -f schema.sql
   ```

## Estrutura do Banco de Dados

### Tabelas

1. `usuarios`
   - Armazena informações básicas de autenticação
   - Diferencia entre candidatos e empresas

2. `candidatos`
   - Informações específicas dos candidatos
   - Relacionada com a tabela usuarios

3. `empresas`
   - Informações específicas das empresas
   - Relacionada com a tabela usuarios

4. `vagas`
   - Detalhes das vagas de emprego
   - Relacionada com a tabela empresas

5. `candidaturas`
   - Registra as candidaturas dos usuários às vagas
   - Relaciona candidatos com vagas

## Índices

Foram criados índices para otimizar as consultas mais comuns:
- Busca por email (usuarios)
- Busca por CNPJ (empresas)
- Busca por CPF (candidatos)
- Busca por vagas de uma empresa
- Busca por candidaturas

## Segurança

- Nunca compartilhe seu arquivo `.env` com as credenciais do banco
- Mantenha as senhas do banco de dados seguras
- Use sempre conexões seguras com o banco de dados
- Implemente validações adequadas nas operações do banco

## Suporte

Em caso de dúvidas ou problemas:
1. Verifique se o PostgreSQL está em execução
2. Confirme as credenciais no arquivo `.env`
3. Verifique os logs do servidor para mensagens de erro
4. Certifique-se de que todas as dependências estão instaladas
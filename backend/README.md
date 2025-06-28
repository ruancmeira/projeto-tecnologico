# API de Gestão Hospitalar 🏥

Backend do sistema de gestão hospitalar desenvolvido com **NestJS**, **Prisma ORM** e **MySQL**.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.0 ou superior ([Download aqui](https://nodejs.org/))
- **Git** ([Download aqui](https://git-scm.com/))
- **Docker** e **Docker Compose** (recomendado para o banco de dados MySQL)

## 🚀 Instalação e Configuração

### Opção 1: Usando Docker (Recomendado)

Se você quer executar todo o sistema (frontend + backend + banco), veja o [README principal](../README.md) na raiz do projeto.

Para executar apenas o backend com Docker:

```bash
# Na pasta backend
docker build -t hospital-backend .
docker run -p 3333:3333 --env-file .env hospital-backend
```

### Opção 2: Instalação Manual

#### 1. Clone o repositório (se ainda não tiver feito)

```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>/backend
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Configure o MySQL

Você pode usar o Docker para o MySQL:

```bash
docker run --name mysql-hospital -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=projeto_tcc -e MYSQL_USER=user_projeto_tcc -e MYSQL_PASSWORD=user123 -p 9990:3306 -d mysql:8.0 --default-authentication-plugin=mysql_native_password
```

#### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz da pasta backend:

```env
# Database
DATABASE_URL="mysql://user_projeto_tcc:user123@localhost:9990/projeto_tcc"

# JWT
JWT_SECRET="FEmtDK8X15_p6IQP6GJA"
JWT_EXPIRES_IN="30d"

# Server
PORT=3333
NODE_ENV=development
```

#### 5. Configure o banco de dados

Execute o comando para criar as tabelas e dados iniciais:

```bash
npm run db:setup
```

Este comando vai:

- Criar todas as tabelas no banco
- Inserir dados de exemplo (médicos e pacientes)
- Criar um usuário administrador

#### 6. Inicie a aplicação

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

A API estará rodando em: **http://localhost:3333**

## 📚 Documentação da API

Após iniciar o servidor:

- **Swagger UI**: http://localhost:3333/docs
- **Prisma Studio**: `npm run db:studio` (visualizar dados)

## 🔑 Credenciais do Administrador

O sistema cria automaticamente um usuário administrador:

```
Email: admin@admin.com
Senha: admin123
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
npm run start:dev     # Iniciar servidor em modo desenvolvimento
npm run start:prod    # Iniciar servidor em modo produção
npm run build         # Compilar para produção
```

### Banco de Dados

```bash
npm run db:setup      # ⭐ Setup inicial (primeira vez)
npm run db:reset      # Resetar banco e recriar dados
npm run db:seed       # Apenas inserir dados de exemplo
npm run db:push       # Sincronizar schema sem migrations
npm run db:studio     # Abrir interface visual do banco
```

### Qualidade de Código

```bash
npm run lint          # Verificar código
npm run format        # Formatar código
npm run test          # Executar testes
```

## 🔐 Como Usar a API

### 1. Autenticação

Todas as rotas (exceto registro e login) requerem autenticação JWT.

```bash
# 1. Fazer login
curl -X POST http://localhost:3333/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"admin123"}'

# 2. Copiar o "access_token" da resposta
# 3. Usar em todas as outras requisições:
curl -X GET http://localhost:3333/v1/patients \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 2. Testando com Swagger

1. Acesse: http://localhost:3333/docs
2. Clique em "Authorize" 🔓
3. Digite: `Bearer SEU_TOKEN_AQUI`
4. Agora pode testar todos os endpoints!

## 📋 Endpoints Principais

### Autenticação

- `POST /v1/auth/login` - Fazer login e obter token JWT

### Dashboard

- `GET /v1/dashboard` - Obter dados do dashboard (contagens e próximas consultas)

### Usuários

- `GET /v1/users` - Listar usuários
- `GET /v1/users/{id}` - Ver usuário específico
- `PATCH /v1/users/{id}` - Atualizar usuário
- `DELETE /v1/users/{id}` - Excluir usuário (com proteção para admin)

### Pacientes

- `GET /v1/patients` - Listar pacientes
- `POST /v1/patients` - Criar paciente
- `GET /v1/patients/{id}` - Ver paciente
- `PATCH /v1/patients/{id}` - Atualizar paciente
- `DELETE /v1/patients/{id}` - Excluir paciente (com proteção para pacientes com consultas)

### Médicos

- `GET /v1/doctors` - Listar médicos
- `POST /v1/doctors` - Criar médico
- `GET /v1/doctors/{id}` - Ver médico
- `PATCH /v1/doctors/{id}` - Atualizar médico
- `DELETE /v1/doctors/{id}` - Excluir médico (com proteção para médicos com consultas)

### Consultas

- `GET /v1/appointments` - Listar consultas
- `POST /v1/appointments` - Agendar consulta
- `GET /v1/appointments/{id}` - Ver consulta
- `PATCH /v1/appointments/{id}` - Atualizar consulta
- `DELETE /v1/appointments/{id}` - Excluir consulta

## 📊 Status das Consultas

- `SCHEDULED` - Agendada (padrão)
- `CONFIRMED` - Confirmada pelo médico
- `CANCELLED` - Cancelada
- `COMPLETED` - Consulta realizada

## 🚨 Solução de Problemas

### ❌ Erro: "Can't connect to MySQL server"

```bash
# Verifique se o MySQL está rodando:
docker ps | grep mysql

# Reinicie o container MySQL:
docker restart mysql-hospital
```

### ❌ Erro: "Port 3333 already in use"

```bash
# Verifique qual processo está usando a porta:
lsof -ti:3333 | xargs kill -9  # Linux/macOS
netstat -ano | findstr :3333   # Windows

# Ou altere a porta no .env:
PORT=3334
```

### ❌ Erro: "JWT token invalid"

- Faça login novamente para obter novo token
- Verifique se o `JWT_SECRET` no `.env` não mudou

## 🏗️ Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/         # Autenticação (login, JWT)
│   ├── users/        # Usuários do sistema
│   ├── patients/     # Pacientes
│   ├── doctors/      # Médicos
│   └── appointments/ # Consultas médicas
├── common/
│   └── filters/      # Tratamento de erros
├── prisma/           # Configuração ORM
```

## 🔒 Segurança

- Todas as rotas (exceto login) são protegidas por JWT
- Senhas são armazenadas com hash no banco de dados
- Proteção contra exclusão de médicos e pacientes com consultas agendadas
- Proteção especial para o usuário administrador (ID 1)

## 💾 Dados de Exemplo

O sistema vem com dados pré-cadastrados:

**Médicos:**

- Dr. Carlos Pereira (Cardiologia)
- Dra. Ana Santos (Pediatria)
- Dr. Roberto Silva (Ortopedia)

**Pacientes:**

- Maria Silva
- João Santos
- Ana Costa

## 🔧 Tecnologias Utilizadas

- **Backend**: NestJS 9 + TypeScript
- **Banco**: MySQL 8 + Prisma ORM
- **Autenticação**: JWT + bcryptjs
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI 3
- **Testes**: Jest
- **Code Quality**: ESLint + Prettier

## 📈 Próximos Passos

Após configurar o projeto, você pode:

1. **Explorar a API**: Use o Swagger em `/docs`
2. **Ver os dados**: Use o Prisma Studio com `npm run db:studio`
3. **Criar novos dados**: Use os endpoints POST
4. **Modificar o código**: Arquivos em `src/modules/`
5. **Deploy**: Configure Docker ou servidor

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Faça suas mudanças
4. Execute os testes: `npm run test`
5. Formate o código: `npm run format`
6. Commit: `git commit -m 'Adiciona nova funcionalidade'`
7. Push: `git push origin feature/nova-funcionalidade`
8. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**🔥 Dica:** Se encontrar algum problema, verifique se seguiu todos os passos e se as versões do Node.js e MySQL estão corretas!

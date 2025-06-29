# Sistema de Gestão Hospitalar

Sistema completo de gestão hospitalar com frontend React e backend NestJS, configurado para execução com Docker.

## 🚀 Arquitetura do Sistema

O projeto é composto por três serviços principais:

1. **Frontend**: Aplicação React com TypeScript e Tailwind CSS
2. **Backend**: API REST em NestJS com TypeScript
3. **Banco de Dados**: MySQL 8.0

## 🔧 Requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🏃‍♂️ Como executar com Docker

Para executar todo o sistema (frontend, backend e banco de dados), execute:

```bash
docker-compose up --build
```

Para executar em segundo plano:

```bash
docker-compose up --build -d
```

### 🌐 Portas e URLs dos serviços:

| Serviço      | URL                        | Porta | Descrição                      |
| ------------ | -------------------------- | ----- | ------------------------------ |
| **Frontend** | http://localhost:8080      | 8080  | Interface de usuário           |
| **Backend**  | http://localhost:3333      | 3333  | API REST                       |
| **Swagger**  | http://localhost:3333/docs | 3333  | Documentação da API            |
| **MySQL**    | localhost:9990             | 9990  | Banco de dados (porta externa) |

### 🔑 Primeiro acesso:

O sistema criará automaticamente um usuário administrador:

- **Email**: admin@admin.com
- **Senha**: admin123

### ⚙️ Gerenciamento dos serviços:

```bash
# Parar os serviços
docker-compose down

# Visualizar logs
docker-compose logs -f

# Visualizar logs de um serviço específico
docker-compose logs -f backend

# Reiniciar um serviço específico
docker-compose restart backend

# Remover volumes (limpar banco de dados)
docker-compose down -v
```

## 📋 Estrutura do Projeto

```
projeto-tecnologico/
├── docker-compose.yml     # Configuração dos serviços Docker
├── frontend/              # Aplicação React
│   ├── Dockerfile         # Configuração para build do frontend
│   ├── nginx.conf         # Configuração do servidor web
│   └── src/               # Código fonte do frontend
├── backend/               # API NestJS
│   ├── Dockerfile         # Configuração para build do backend
│   ├── prisma/            # Schema e migrações do banco
│   └── src/               # Código fonte do backend
└── README.md              # Este arquivo
```

## 🔄 Fluxo de Dados

1. O **frontend** é servido pelo Nginx na porta 8080
2. As requisições da API são redirecionadas para o **backend** na porta 3333
3. O **backend** se conecta ao **MySQL** para persistência dos dados

## 🛠️ Desenvolvimento

Para desenvolvimento local, veja os READMEs específicos em cada pasta:

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 🔒 Segurança

- O backend utiliza autenticação JWT para proteger as rotas
- As senhas são armazenadas com hash no banco de dados
- O administrador (ID 1) tem proteções especiais contra exclusão e alteração de credenciais

## 📱 Funcionalidades Principais

- Gestão de pacientes
- Gestão de médicos
- Agendamento de consultas
- Dashboard com estatísticas
- Gerenciamento de usuários

## Executando o projeto com Docker

### Usando o Dockerfile (único container)

Este método cria um único container que contém a aplicação completa (frontend, backend e banco de dados MySQL).

#### Passos para execução:

1. **Construir a imagem Docker**:

```bash
docker build -t projeto-tecnologico .
```

2. **Executar o container**:

```bash
docker run -d -p 80:80 -p 3333:3333 --name projeto-tecnologico-container projeto-tecnologico
```

3. **Acessar a aplicação**:
   - **Frontend**: http://localhost:80 ou simplesmente http://localhost
   - **Backend API**: http://localhost:3333

#### Comandos úteis:

- **Visualizar logs**:

```bash
docker logs projeto-tecnologico-container
```

- **Parar o container**:

```bash
docker stop projeto-tecnologico-container
```

- **Iniciar um container existente**:

```bash
docker start projeto-tecnologico-container
```

- **Remover o container**:

```bash
docker rm projeto-tecnologico-container
```

### Usando o Docker Compose (múltiplos containers)

Alternativamente, você pode usar o docker-compose para executar os serviços em containers separados:

```bash
docker-compose up -d
```

Isso iniciará três containers separados para o backend, frontend e MySQL conforme definido no arquivo docker-compose.yml.

## Deploy no Fly.io

Este projeto está configurado para ser facilmente implantado no Fly.io.

### Pré-requisitos

1. Instalar o Fly CLI: [https://fly.io/docs/hands-on/install-flyctl/](https://fly.io/docs/hands-on/install-flyctl/)
2. Fazer login no Fly.io: `fly auth login`

### Deploy

Para fazer o deploy da aplicação:

```bash
# Se for o primeiro deploy:
fly launch

# Para atualizações:
fly deploy
```

### Configuração

O arquivo `fly.toml` já está configurado para:

- Expor a porta 80 para o frontend (Nginx)
- Expor a porta 3333 para a API (backend)
- Usar banco de dados MariaDB interno

### Monitoramento

```bash
# Ver logs da aplicação
fly logs

# Verificar status
fly status

# Abrir SSH na instância
fly ssh console
```

# Frontend do Sistema de Gestão Hospitalar 🏥

Interface de usuário do sistema de gestão hospitalar desenvolvida com **React**, **TypeScript**, **Tailwind CSS** e **Shadcn/UI**.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.0 ou superior ([Download aqui](https://nodejs.org/))
- **Git** ([Download aqui](https://git-scm.com/))

## 🚀 Instalação e Configuração

### Opção 1: Usando Docker (Recomendado)

Se você quer executar todo o sistema (frontend + backend + banco), veja o [README principal](../README.md) na raiz do projeto.

Para executar apenas o frontend com Docker:

```bash
# Na pasta frontend
docker build -t hospital-frontend .
docker run -p 8080:80 hospital-frontend
```

### Opção 2: Instalação Manual

#### 1. Clone o repositório (se ainda não tiver feito)

```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>/frontend
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Configure o ambiente

Crie um arquivo `.env` na raiz da pasta frontend:

```env
VITE_API_URL=http://localhost:3333
```

#### 4. Inicie a aplicação em modo desenvolvimento

```bash
npm run dev
```

A aplicação estará rodando em: **http://localhost:5173**

#### 5. Build para produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## 🛠️ Scripts Disponíveis

```bash
npm run dev        # Iniciar servidor de desenvolvimento
npm run build      # Compilar para produção
npm run lint       # Verificar código com ESLint
npm run preview    # Visualizar build de produção localmente
```

## 🧩 Componentes Principais

O frontend está organizado em componentes reutilizáveis:

### Páginas Principais

- **Home/Dashboard**: Visão geral do sistema com estatísticas
- **Pacientes**: Gerenciamento de pacientes
- **Médicos**: Gerenciamento de médicos
- **Consultas**: Agendamento e gerenciamento de consultas
- **Usuários**: Gerenciamento de usuários do sistema

### Componentes Reutilizáveis

- **Formulários**: Componentes para criação e edição de dados
- **Tabelas**: Listagens com paginação e filtragem
- **Modais**: Diálogos para confirmação e formulários
- **Cards**: Exibição de informações em formato de cartão

## 🔄 Integração com Backend

O frontend se comunica com o backend através de hooks personalizados:

- `useAuth`: Gerenciamento de autenticação e sessão
- `usePatients`: Operações CRUD para pacientes
- `useDoctors`: Operações CRUD para médicos
- `useAppointments`: Operações CRUD para consultas
- `useUsers`: Operações CRUD para usuários

## 🎨 UI/UX

O sistema utiliza:

- **Tailwind CSS**: Framework de estilização utilitária
- **Shadcn/UI**: Componentes de UI acessíveis e personalizáveis
- **Layout Responsivo**: Adaptado para desktop e dispositivos móveis

## 🔒 Autenticação

O sistema utiliza autenticação JWT:

- Login com email e senha
- Armazenamento seguro do token no localStorage
- Proteção de rotas para usuários não autenticados
- Gerenciamento de sessão expirada

## 📱 Funcionalidades

### Dashboard

- Visualização de estatísticas gerais
- Contagem de pacientes, médicos e consultas
- Listagem das próximas consultas

### Gestão de Pacientes

- Listagem com busca e filtros
- Cadastro de novos pacientes
- Visualização de detalhes
- Edição de informações
- Exclusão (com verificação de segurança)

### Gestão de Médicos

- Listagem com busca e filtros
- Cadastro de novos médicos
- Visualização de detalhes e especialidades
- Edição de informações
- Exclusão (com verificação de segurança)

### Gestão de Consultas

- Agendamento de novas consultas
- Visualização de agenda
- Alteração de status (confirmada, cancelada, concluída)
- Exclusão de consultas

### Gestão de Usuários

- Listagem de usuários do sistema
- Cadastro de novos usuários
- Edição de informações
- Exclusão (com proteção para o administrador)

## 🏗️ Estrutura do Projeto

```
src/
├── App.tsx              # Componente principal
├── components/          # Componentes reutilizáveis
│   ├── ui/              # Componentes de UI básicos
│   ├── patients/        # Componentes de pacientes
│   ├── doctors/         # Componentes de médicos
│   ├── appointments/    # Componentes de consultas
│   └── users/           # Componentes de usuários
├── hooks/               # Hooks personalizados
├── pages/               # Páginas principais
├── types/               # Definições de tipos TypeScript
└── lib/                 # Funções utilitárias
```

## 🚨 Solução de Problemas

### ❌ Erro: "Failed to fetch" ao conectar com o backend

- Verifique se o backend está rodando
- Confirme se a URL da API está correta no .env
- Verifique se há problemas de CORS

### ❌ Erro: "Invalid token" ou "Unauthorized"

- Faça login novamente para obter um novo token
- Verifique se o token não expirou

## 🔄 Desenvolvimento Contínuo

Para contribuir com o projeto:

1. Siga os padrões de código existentes
2. Utilize os componentes de UI existentes
3. Mantenha a consistência visual
4. Teste em diferentes tamanhos de tela

# Estrutura do Projeto Angular para Sistema de Gestão de Carinicultura

Este documento apresenta a estrutura do frontend do sistema de gestão para carinicultura, desenvolvido em Angular.

## Organização de Diretórios

```mermaid
graph TD
    A[fazenda-peixe-azul-app] --> B[src]
    A --> C[angular.json]
    A --> D[package.json]
    A --> E[tsconfig.json]
    
    B --> F[app]
    B --> G[assets]
    B --> H[environments]
    B --> I[index.html]
    B --> J[styles.scss]
    B --> K[main.ts]
    
    F --> L[components]
    F --> M[core]
    F --> N[features]
    F --> O[shared]
    F --> P[app.component.ts]
    F --> Q[app.module.ts]
    F --> R[app-routing.module.ts]
```

## Arquitetura Modular

O projeto segue uma arquitetura modular, separando claramente as responsabilidades:

```mermaid
graph TD
    A[App Module] --> B[Core Module]
    A --> C[Shared Module]
    A --> D[Feature Modules]
    
    D --> E[Dashboard]
    D --> F[Tanques]
    D --> G[Ciclos Produção]
    D --> H[Qualidade Água]
    D --> I[Financeiro]
    D --> J[Auth]
    
    B --> K[Services]
    B --> L[Guards]
    B --> M[Interceptors]
    B --> N[Models]
    
    C --> O[Components]
    C --> P[Pipes]
    C --> Q[Directives]
```

## Estrutura do Core

O módulo Core contém serviços, modelos e utilitários essenciais para a aplicação:

```mermaid
graph TD
    A[Core Module] --> B[Models]
    A --> C[Services]
    A --> D[Guards]
    A --> E[Interceptors]
    
    B --> F[tanque.model.ts]
    B --> G[ciclo-producao.model.ts]
    B --> H[registro-qualidade-agua.model.ts]
    B --> I[venda.model.ts]
    B --> J[compra.model.ts]
    B --> K[auth.model.ts]
    
    C --> L[api.service.ts]
    C --> M[auth.service.ts]
    C --> N[tanque.service.ts]
    C --> O[ciclo-producao.service.ts]
    C --> P[qualidade-agua.service.ts]
    C --> Q[venda.service.ts]
    C --> R[compra.service.ts]
    
    D --> S[auth.guard.ts]
    
    E --> T[auth.interceptor.ts]
```

## Fluxo de Dados

```mermaid
sequenceDiagram
    participant C as Component
    participant S as Service
    participant I as Interceptor
    participant A as API
    
    C->>S: Solicita dados
    S->>I: Realiza requisição HTTP
    I->>I: Adiciona token JWT
    I->>A: Envia requisição
    A->>I: Retorna resposta
    I->>S: Processa resposta
    S->>C: Entrega dados
```

## Módulos de Funcionalidades

```mermaid
graph TD
    A[Features] --> B[Dashboard]
    A --> C[Tanques]
    A --> D[Ciclos Produção]
    A --> E[Qualidade Água]
    A --> F[Financeiro]
    A --> G[Auth]
    
    B --> B1[dashboard.component]
    B --> B2[dashboard.module]
    
    C --> C1[tanques.module]
    C --> C2[Components]
    
    C2 --> C21[tanque-list]
    C2 --> C22[tanque-form]
    C2 --> C23[tanque-detail]
    
    D --> D1[ciclos-producao.module]
    D --> D2[Components]
    
    E --> E1[qualidade-agua.module]
    E --> E2[Components]
    
    F --> F1[financeiro.module]
    F --> F2[Components]
    
    G --> G1[auth.module]
    G --> G2[login.component]
```

## Modelo de Domínio

```mermaid
classDiagram
    class Tanque {
        +id: number
        +nome: string
        +capacidade: number
        +localizacao: string
        +especieCultura: string
    }
    
    class CicloProducao {
        +id: number
        +tanque: Tanque
        +dataInicio: string
        +dataFim: string
        +quantidadePescado: number
        +racaoGasta: number
    }
    
    class RegistroQualidadeAgua {
        +id: number
        +tanque: Tanque
        +amonia: number
        +nitrito: number
        +salinidade: number
        +turbidez: number
        +temperatura: number
        +ph: number
        +oxigenacao: number
        +data: string
    }
    
    class Venda {
        +id: number
        +tanque: Tanque
        +quantidadePescado: number
        +valorTotal: number
        +data: string
    }
    
    class Compra {
        +id: number
        +descricao: string
        +valor: number
        +data: string
        +tipo: TipoCompra
    }
    
    class Usuario {
        +id: number
        +nome: string
        +email: string
        +senha: string
        +perfis: Perfil[]
    }
    
    Tanque "1" -- "n" CicloProducao : possui
    Tanque "1" -- "n" RegistroQualidadeAgua : monitora
    CicloProducao "1" -- "n" Alimentacao : registra
    Tanque "1" -- "n" Venda : gera
```

## Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant L as LoginComponent
    participant A as AuthService
    participant API as Backend API
    participant R as Router
    participant I as AuthInterceptor
    
    U->>L: Informa credenciais
    L->>A: login(credentials)
    A->>API: POST /auth/login
    API->>A: Retorna token JWT
    A->>A: Armazena token
    A->>R: Navega para Dashboard
    
    Note over I: Em requisições subsequentes
    I->>I: Adiciona token ao header
```

## Rotas da Aplicação

```mermaid
graph TD
    A[Router Outlet] --> B{Path?}
    
    B -->|/auth/login| C[LoginComponent]
    B -->|/dashboard| D[DashboardComponent]
    B -->|/tanques| E[TanqueListComponent]
    B -->|/tanques/novo| F[TanqueFormComponent]
    B -->|/tanques/:id| G[TanqueDetailComponent]
    B -->|/tanques/editar/:id| H[TanqueFormComponent]
    B -->|/ciclos-producao| I[CiclosComponent]
    B -->|/qualidade-agua| J[QualidadeAguaComponent]
    B -->|/financeiro| K[FinanceiroComponent]
```

## Integração com o Backend

```mermaid
graph LR
    A[Angular Frontend] <-->|HTTP/REST| B[Spring Boot Backend]
    
    subgraph Frontend
        A1[Services]
        A2[Components]
        A3[Interceptors]
    end
    
    subgraph Backend
        B1[Controllers]
        B2[Services]
        B3[Repositories]
        B4[Models]
    end
    
    A1 <--> B1
    A2 --> A1
    A1 --> A2
    A3 --> A1
```

## Configuração para Ambiente de Desenvolvimento

Para iniciar o desenvolvimento:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
ng serve

# Construir para produção
ng build --prod
```

## Expandindo o Sistema

Para adicionar novos componentes ou módulos:

```bash
# Gerar um novo módulo
ng generate module features/novo-modulo --routing

# Gerar um novo componente
ng generate component features/novo-modulo/novo-componente

# Gerar um novo serviço
ng generate service core/services/novo-servico
```

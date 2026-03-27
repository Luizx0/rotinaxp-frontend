# RotinaXP Frontend

## 1. Visao geral
Aplicacao React com TypeScript para gestao de tarefas, pontos, recompensas e progresso diario.

Status do checkpoint:
- Migracao para TypeScript concluida
- Layout principal com sidebar e topbar concluido
- Navegacao com rotas publicas e protegidas concluida
- Hooks e contextos globais concluidos
- Paginas principais e dashboard com graficos concluidos
- Camada de erros padronizada em contextos e paginas concluida
- Paths centralizados para rotas e navegacao concluido
- Scripts de validacao de tipagem e build adicionados

## 2. Stack tecnica
- React + React Router
- TypeScript
- Context API
- Axios
- Recharts
- CSS global responsivo

## 3. Estrutura principal
```
src/
  components/
    charts/
    common/
    layout/
    navigation/
    tasks/
  context/
    AuthContext.tsx
    AppDataContext.tsx
  data/
    mockData.ts
  hooks/
    useAuth.ts
    useAppData.ts
    useModal.ts
  pages/
    Auth/
    Dashboard/
    Tasks/
    Rewards/
    Progress/
    Profile/
  routes/
    AppRoutes.tsx
    ProtectedRoute.tsx
  services/
    api.ts
    authService.ts
    tarefaService.ts
    rewardService.ts
    storage.ts
  styles/
    global.css
  App.tsx
  index.tsx
```

## 4. Fluxo de navegacao
- Publico:
  - /login
  - /register
- Protegido:
  - /dashboard
  - /tasks
  - /rewards
  - /progress
  - /profile

Regra:
- Sem sessao ativa, usuario e redirecionado para /login
- Com sessao ativa, usuario nao volta para login/register
- Todos os paths sao centralizados em src/routes/paths.ts

## 5. Estado global
### AuthContext
- Sessao atual
- Login
- Cadastro
- Logout
- Atualizacao de perfil
- Estado de erro e limpeza de erro (clearError)

### AppDataContext
- Tarefas
- Recompensas
- Progresso
- Criar/editar/concluir tarefa
- Resgatar recompensa
- Estado de erro e limpeza de erro (clearError)

## 6. Paginas implementadas
- Login
- Cadastro
- Dashboard (cards, abas e graficos)
- Tarefas (abas, criacao, listagem, edicao via overlay modal)
- Recompensas (filtros e resgate)
- Progresso (historico com grafico)
- Perfil (edicao de dados)

## 7. Validacao executada
### Validacao de tipos
- Comando: npm run typecheck
- Resultado esperado: sem erros em src e tsconfig

### Build
- Comando: npm run build
- Resultado esperado: build do react-scripts concluido

Erro observado no webpack:
- Caminhos absolutos contendo ! sao interpretados como sintaxe de loader
- Isso invalida cacheDirectory, include e output.path

## 8. Bloqueios conhecidos
### Bloqueio critico: caminho com !
Exemplo atual:
- D:/Luizx/!Program/RotinaXP/RotinaXP.FrontEnd/rotinaxp-frontend

Impacto:
- npm run build falha
- npm start pode falhar no mesmo motivo

Solucao recomendada:
1. Mover o projeto para um caminho sem !
2. Reabrir a pasta no VS Code
3. Rodar npm install
4. Rodar npm start e npm run build

## 9. Normas para possiveis erros
### 9.1 Regra de ambiente
- Nunca usar ! no caminho raiz do projeto
- Preferir caminhos curtos e sem caracteres especiais

### 9.2 Regra de dependencias
- Manter TypeScript compativel com react-scripts 5
- Versao padrao: typescript 4.9.5

### 9.3 Regra de tipagem
- Novos arquivos de logica em .ts
- Novos componentes React em .tsx
- Evitar any
- Tipos compartilhados sempre em src/types

### 9.4 Regra de estado
- Estado global obrigatoriamente em context + hooks
- Acesso a contexto apenas via hooks dedicados

### 9.5 Regra de servicos
- Toda chamada HTTP centralizada em services
- Interceptor de token mantido em services/api.ts

### 9.6 Regra de layout e paginas
- Componentes reutilizaveis em components
- Paginas somente para orquestrar blocos visuais e regras da tela
- Rotas declaradas em routes/AppRoutes.tsx

### 9.7 Checklist de troubleshooting rapido
1. Rodar npm run typecheck
2. Rodar npm run build
3. Se falhar por webpack/path, validar se existe ! no caminho
4. Conferir import/export apos renomeacoes de arquivos
5. Conferir versao do TypeScript
6. Reinstalar dependencias se necessario

### 9.8 Comandos oficiais de validacao
1. npm run typecheck
2. npm run build
3. npm run validate

## 10. Proximas evolucoes
- Integrar auth real com JWT no backend .NET
- Persistir tarefas/recompensas via endpoints reais
- Adicionar testes de unidade e integracao
- Adicionar telemetria e toasts de erro
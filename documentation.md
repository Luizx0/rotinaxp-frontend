# RotinaXP Frontend

## 1. Como rodar o projeto (frontend)

### Pre-requisitos
- Node.js 18+
- npm 9+

### Passo a passo
1. Abrir terminal na raiz do frontend:
   `rotinaxp-frontend`
2. Instalar dependencias:
   `npm install`
3. Rodar em desenvolvimento:
   `npm start`
4. Acessar no navegador:
   `http://localhost:3000`

Importante:
- Este projeto usa `react-scripts`, entao o comando correto de dev e `npm start`.
- `npm run dev` nao existe neste frontend.

### Comandos oficiais
- `npm start`: sobe ambiente local (dev server)
- `npm run typecheck`: valida TypeScript
- `npm run build`: gera build de producao
- `npm run validate`: roda typecheck + build em sequencia

---

## 2. Visao geral
Aplicacao React com TypeScript para gestao de tarefas, pontos, recompensas e progresso diario, com autenticacao local e arquitetura preparada para API real.

## 3. Stack tecnica
- React 19
- React Router 7
- TypeScript 4.9.5
- Context API
- Axios
- Recharts
- Material UI (MUI)
- Framer Motion
- React Joyride
- CSS global responsivo

## 4. Estrutura principal
```
src/
  components/
    charts/
    common/
    layout/
    navigation/
    rewards/
    tasks/
  context/
    AppDataContext.tsx
    AuthContext.tsx
    ThemeContext.tsx
  hooks/
    useAppData.ts
    useAuth.ts
    useModal.ts
    useThemeMode.ts
  pages/
    Auth/
      LoginPage.tsx
      RegisterPage.tsx
    Dashboard/
    HomePage/
    Profile/
    Progress/
    Rewards/
    Tasks/
  routes/
    AppRoutes.tsx
    ProtectedRoute.tsx
    paths.ts
  services/
    api.ts
    authService.ts
    errorService.ts
    rewardService.ts
    storage.ts
    tarefaService.ts
  styles/
    global.css
```

## 5. Fluxo funcional atual
- Rota publica inicial: `/` (homepage)
- Rotas publicas de autenticacao: `/login`, `/register`
- Rotas protegidas: `/dashboard`, `/tasks`, `/rewards`, `/progress`, `/profile`
- Sem sessao ativa: redireciona para login ao tentar rota protegida
- Com sessao ativa: nao volta para login/register

## 6. Estado e regras de dados

### AuthContext
- Sessao atual
- Login, cadastro, logout
- Atualizacao de perfil
- Tratamento de erro centralizado (`error`, `clearError`)

### AppDataContext
- Tarefas, recompensas e progresso
- Criar/editar/concluir tarefa
- Criar/resgatar recompensa
- Controle de onboarding/tour
- Tratamento de erro centralizado (`error`, `clearError`)

### Regra de conta nova
- Conta nova inicia zerada:
  - sem tarefas
  - sem recompensas
  - sem progresso preenchido
  - sem pontos iniciais
- Dados sao persistidos por usuario no `localStorage`

## 7. UX implementada
- Sidebar com expandir/recolher
- Iconografia com Material UI (sem siglas de duas letras no menu)
- Tema claro/escuro persistente
- Tour guiado passo a passo entre telas principais
- Animacoes suaves de entrada de cards/listas

## 8. Qualidade e validacao
Antes de subir alteracoes, execute:
1. `npm run typecheck`
2. `npm run build`

Esperado:
- typecheck sem erros
- build compilando com sucesso

## 9. Observacoes de ambiente
- Nao use `!` no caminho do projeto (pode quebrar o webpack/react-scripts).
- Em caso de erro inesperado de cache/import:
1. apagar `node_modules`
2. rodar `npm install`
3. rodar `npm run validate`

## 10. Proximas evolucoes sugeridas
- Integrar autenticacao real JWT (backend)
- Persistencia real de tarefas/recompensas via API
- Testes de unidade e integracao para fluxos criticos
- Telemetria e toasts globais de erro/sucesso
# RotinaXP

**Projeto:** RotinaXP  
**Autor:** Luizx0

---

## Problema real

Manter uma rotina de estudos, hábitos saudáveis e produtividade diária é difícil. Sem um sistema de acompanhamento, é fácil perder o foco, esquecer tarefas e não enxergar o progresso acumulado ao longo do tempo. Muitas pessoas abandonam suas metas por falta de um retorno visual que motive a continuidade.

---

## Solução proposta

O **RotinaXP** é uma aplicação web de gestão de rotina com elementos de gamificação. O usuário cadastra tarefas diárias, marca as concluídas e acumula pontos de experiência (XP). Com o XP acumulado é possível resgatar recompensas definidas pelo próprio usuário, criando um ciclo de motivação e consistência.

---

## Público-alvo

- Estudantes e concurseiros que precisam manter rotina de estudos
- Profissionais que gerenciam múltiplas tarefas e projetos
- Qualquer pessoa que queira construir hábitos de forma consistente e motivante

---

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Cadastro e login | Criação de conta e autenticação local |
| Adicionar tarefas | Criação de tarefas com título, descrição, categoria, prioridade, data limite e pontos |
| Listar tarefas | Visualização de todas as tarefas do usuário |
| Marcar como concluída | Alternância do status de conclusão de uma tarefa |
| Editar tarefa | Atualização dos dados de uma tarefa existente |
| Adicionar recompensas | Criação de recompensas personalizadas com custo em XP |
| Resgatar recompensa | Troca de XP acumulado por uma recompensa cadastrada |
| Dashboard | Visão geral dos pontos, streak, nível e metas diárias |
| Progresso | Gráficos de pontos e tarefas concluídas ao longo da semana |
| Perfil | Visualização e edição das informações do usuário |
| Tema claro/escuro | Alternância entre modo claro e escuro |
| Tour guiado | Onboarding interativo para novos usuários |

---

## Tecnologias usadas

### Linguagem
- **TypeScript** — tipagem estática em todo o projeto

### Biblioteca principal
- **React 19** — construção da interface de usuário

### UI e estilização
- **MUI (Material UI) v7** — componentes de interface prontos e responsivos
- **Emotion** — estilização com CSS-in-JS
- **Framer Motion** — animações de transição entre páginas e componentes

### Roteamento
- **React Router DOM v7** — navegação entre páginas com rotas protegidas

### Gráficos
- **Recharts** — gráficos de área e barras na página de progresso

### Requisições HTTP
- **Axios** — comunicação com a API backend

### Onboarding
- **React Joyride** — tour guiado interativo

### Testes
- **Jest** + **@testing-library/react** — testes unitários e de integração
- **@testing-library/jest-dom** — matchers adicionais para DOM

### Persistência local
- **localStorage** — armazenamento de sessão, tarefas e recompensas quando a API não está disponível

---

## Como instalar

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 16 ou superior
- npm (incluído com o Node.js)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/rotinaxp-frontend.git

# 2. Entre na pasta do projeto
cd rotinaxp-frontend

# 3. Instale as dependências
npm install

# 4. Inicie a aplicação em modo de desenvolvimento
npm start
```

A aplicação abrirá automaticamente em `http://localhost:3000`.

### Credenciais de demonstração

```
E-mail:  demo@rotinaxp.app
Senha:   demo123
```

### Variáveis de ambiente (opcional)

Crie um arquivo `.env` na raiz do projeto para apontar para uma API backend:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Se a variável não for definida, a aplicação funciona inteiramente com dados locais (localStorage).

---

## Como rodar os testes

```bash
# Testes unitários dos serviços (pasta tests/)
npm run test:unit
```

Os testes cobrem os seguintes módulos:

| Arquivo de teste | O que é testado |
|---|---|
| `storage.test.ts` | Leitura, escrita e recuperação de sessão no localStorage |
| `authService.test.ts` | Login, registro, nível por pontos, sessão e atualização de perfil |
| `tarefaService.test.ts` | CRUD de tarefas, alternância de conclusão, fallback offline |
| `rewardService.test.ts` | CRUD de recompensas, resgate e isolamento entre registros |
| `errorService.test.ts` | Extração de mensagens de erro (Axios e Error padrão) |

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção na pasta `build/` |
| `npm test` | Executa os testes com o runner do CRA (modo watch) |
| `npm run test:unit` | Executa os testes unitários da pasta `tests/` |
| `npm run typecheck` | Verifica os tipos TypeScript sem compilar |

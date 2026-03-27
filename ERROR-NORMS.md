# RotinaXP Error Norms

## Ambiente
- Nao usar `!` no caminho do projeto.
- Preferir caminho local sem caracteres especiais.
- Para dev local neste frontend, usar `npm start` (nao existe `npm run dev`).

## Toolchain
- Em projeto com `react-scripts@5`, manter `typescript@4.9.5`.
- Ao alterar dependencias criticas, rodar `npm install` limpo.

## Tipagem
- Arquivos utilitarios e servicos: `.ts`.
- Componentes React e contextos: `.tsx`.
- Evitar `any`; usar tipos em `src/types`.

## Arquitetura
- Chamada HTTP apenas em `src/services`.
- Token/headers centralizados em `src/services/api.ts`.
- Normalizacao de mensagens de erro em `src/services/errorService.ts`.
- Estado global via context + hooks.
- Erro de dominio exposto por contextos (`error` + `clearError`).
- Rotas em `src/routes/AppRoutes.tsx`.
- Paths e metadados de navegacao centralizados em `src/routes/paths.ts`.

## Checklist de falhas comuns
1. Rodar `npm install` se as dependencias nao estiverem instaladas.
2. Rodar `npm start` para validar inicializacao local.
3. Rodar `npm run typecheck`.
4. Rodar `npm run build`.
5. Se houver erro de webpack com caminho, remover `!` da rota da pasta.
6. Conferir imports quebrados por renomeacao de arquivo/pasta.
7. Conferir versoes de `typescript`, `react-scripts` e `react-router-dom`.

## Checklist de fechamento
1. `npm run typecheck` sem erros.
2. `npm run build` sem erros.
3. Fluxos de login, tarefas, recompensas e perfil exibindo feedback visual de erro/sucesso.
4. Rotas publicas/protegidas funcionando com paths centralizados.

## Plano de acao para incidente
1. Identificar erro (build, runtime, navegacao, estado, API).
2. Reproduzir com passos minimos.
3. Corrigir na camada correta (route, page, component, hook, service).
4. Revalidar types + build.
5. Atualizar documentacao com causa raiz e prevencao.

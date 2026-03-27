export const appPaths = {
  root: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  tasks: "/tasks",
  rewards: "/rewards",
  progress: "/progress",
  profile: "/profile",
} as const;

export const protectedPaths = [appPaths.dashboard, appPaths.tasks, appPaths.rewards, appPaths.progress, appPaths.profile];

export const topBarTitleMap: Record<string, string> = {
  [appPaths.dashboard]: "Painel central",
  [appPaths.tasks]: "Gestao de tarefas",
  [appPaths.rewards]: "Loja de recompensas",
  [appPaths.progress]: "Historico de progresso",
  [appPaths.profile]: "Configuracoes do perfil",
};

export const sidebarMenuItems = [
  { label: "Dashboard", to: appPaths.dashboard, code: "DB" },
  { label: "Tarefas", to: appPaths.tasks, code: "TK" },
  { label: "Recompensas", to: appPaths.rewards, code: "RW" },
  { label: "Progresso", to: appPaths.progress, code: "PG" },
  { label: "Perfil", to: appPaths.profile, code: "PF" },
];

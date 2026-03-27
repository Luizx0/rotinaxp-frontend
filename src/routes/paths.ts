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
  { label: "Dashboard", to: appPaths.dashboard, icon: "dashboard" },
  { label: "Tarefas", to: appPaths.tasks, icon: "tasks" },
  { label: "Recompensas", to: appPaths.rewards, icon: "rewards" },
  { label: "Progresso", to: appPaths.progress, icon: "progress" },
  { label: "Perfil", to: appPaths.profile, icon: "profile" },
];

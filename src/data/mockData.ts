import { ProgressPoint, Reward, Task, TaskCategory, TaskPriority, UserProfile } from "../types/app";

function isoDate(daysFromToday: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString();
}

export const taskCategories: TaskCategory[] = ["Trabalho", "Estudos", "Saude", "Pessoal"];
export const taskPriorities: TaskPriority[] = ["baixa", "media", "alta"];

export const defaultUser: UserProfile = {
  id: "user-demo",
  name: "Luiz Xavier",
  email: "demo@rotinaxp.app",
  role: "Explorador de rotina",
  points: 340,
  streak: 6,
  level: 4,
  dailyGoal: 120,
  about: "Construindo consistencia diaria com pequenas entregas.",
};

export const demoPassword = "demo123";

export const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Planejar sprint da semana",
    description: "Separar prioridades do projeto e definir blocos de foco.",
    category: "Trabalho",
    priority: "alta",
    completed: true,
    createdAt: isoDate(-3),
    dueDate: isoDate(1),
    points: 60,
  },
  {
    id: "task-2",
    title: "Treino funcional",
    description: "Sessao de 40 minutos para manter o ritmo diario.",
    category: "Saude",
    priority: "media",
    completed: false,
    createdAt: isoDate(-2),
    dueDate: isoDate(0),
    points: 35,
  },
  {
    id: "task-3",
    title: "Estudar API .NET",
    description: "Revisar autenticacao, JWT e tratamento de erros.",
    category: "Estudos",
    priority: "alta",
    completed: true,
    createdAt: isoDate(-4),
    dueDate: isoDate(2),
    points: 50,
  },
  {
    id: "task-4",
    title: "Atualizar documentacao",
    description: "Registrar estrutura de paginas e servicos do frontend.",
    category: "Trabalho",
    priority: "media",
    completed: false,
    createdAt: isoDate(-1),
    dueDate: isoDate(3),
    points: 25,
  },
  {
    id: "task-5",
    title: "Revisar metas do mes",
    description: "Ajustar metas de pontos e rotina pessoal.",
    category: "Pessoal",
    priority: "baixa",
    completed: true,
    createdAt: isoDate(-6),
    dueDate: isoDate(-1),
    points: 20,
  },
];

export const initialRewards: Reward[] = [
  {
    id: "reward-1",
    title: "Cafe especial",
    description: "Pausa curta para celebrar a meta diaria batida.",
    cost: 80,
    claimed: false,
    accent: "sunrise",
  },
  {
    id: "reward-2",
    title: "Sessao de jogo",
    description: "Uma hora livre apos concluir o bloco principal.",
    cost: 140,
    claimed: false,
    accent: "ocean",
  },
  {
    id: "reward-3",
    title: "Cinema no fim de semana",
    description: "Recompensa maior para manter a consistencia.",
    cost: 260,
    claimed: true,
    accent: "forest",
  },
  {
    id: "reward-4",
    title: "Upgrade do setup",
    description: "Guardando pontos para uma melhoria no escritorio.",
    cost: 420,
    claimed: false,
    accent: "ember",
  },
];

export const initialProgress: ProgressPoint[] = [
  { label: "Seg", points: 30, tasks: 1 },
  { label: "Ter", points: 75, tasks: 2 },
  { label: "Qua", points: 60, tasks: 2 },
  { label: "Qui", points: 110, tasks: 3 },
  { label: "Sex", points: 90, tasks: 2 },
  { label: "Sab", points: 40, tasks: 1 },
  { label: "Dom", points: 55, tasks: 1 },
];

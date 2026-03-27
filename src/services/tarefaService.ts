import { initialTasks } from "../data/mockData";
import { Task, TaskDraft } from "../types/app";
import api from "./api";
import { getStoredSessionUserId, readStorage, storageKeys, writeStorage } from "./storage";

type TasksByUser = Record<string, Task[]>;

function getCurrentUserId() {
  const userId = getStoredSessionUserId();

  if (!userId) {
    throw new Error("Sessao de usuario nao encontrada.");
  }

  return userId;
}

function getTasksStore() {
  return readStorage<TasksByUser>(storageKeys.tasksByUser, {});
}

function seedTasks(userId: string) {
  const tasksStore = getTasksStore();
  const storedTasks = tasksStore[userId];

  if (Array.isArray(storedTasks)) {
    return storedTasks;
  }

  const seededTasks = userId === "user-demo" ? initialTasks : [];
  tasksStore[userId] = seededTasks;
  writeStorage(storageKeys.tasksByUser, tasksStore);
  return seededTasks;
}

function persistTasks(userId: string, tasks: Task[]) {
  const tasksStore = getTasksStore();
  tasksStore[userId] = tasks;
  writeStorage(storageKeys.tasksByUser, tasksStore);
  return tasks;
}

function mapApiTask(rawTask: Record<string, unknown>, fallback?: Partial<Task>): Task {
  return {
    id: String(rawTask.id ?? fallback?.id ?? `task-${Date.now()}`),
    title: String(rawTask.nome ?? rawTask.title ?? fallback?.title ?? "Nova tarefa"),
    description: String(rawTask.descricao ?? rawTask.description ?? fallback?.description ?? ""),
    category: (rawTask.categoria as Task["category"]) ?? fallback?.category ?? "Pessoal",
    priority: (rawTask.prioridade as Task["priority"]) ?? fallback?.priority ?? "media",
    completed: Boolean(rawTask.concluida ?? rawTask.completed ?? fallback?.completed ?? false),
    createdAt: String(rawTask.createdAt ?? fallback?.createdAt ?? new Date().toISOString()),
    dueDate: String(rawTask.dataLimite ?? rawTask.dueDate ?? fallback?.dueDate ?? new Date().toISOString()),
    points: Number(rawTask.pontos ?? rawTask.points ?? fallback?.points ?? 30),
  };
}

export function createEmptyTaskDraft(): TaskDraft {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    title: "",
    description: "",
    category: "Pessoal",
    priority: "media",
    dueDate: tomorrow.toISOString().slice(0, 10),
    points: 30,
  };
}

export async function getTarefas(): Promise<Task[]> {
  const userId = getCurrentUserId();

  try {
    const response = await api.get("/tarefas");

    if (Array.isArray(response.data)) {
      const mappedTasks = response.data.map((item) => mapApiTask(item as Record<string, unknown>));
      persistTasks(userId, mappedTasks);
      return mappedTasks;
    }
  } catch {
    return seedTasks(userId);
  }

  return seedTasks(userId);
}

export async function criarTarefa(draft: TaskDraft): Promise<Task> {
  const userId = getCurrentUserId();

  const fallbackTask: Task = {
    id: `task-${Date.now()}`,
    title: draft.title,
    description: draft.description,
    category: draft.category,
    priority: draft.priority,
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: draft.dueDate,
    points: draft.points,
  };

  try {
    const response = await api.post("/tarefas", {
      nome: draft.title,
      descricao: draft.description,
      categoria: draft.category,
      prioridade: draft.priority,
      dataLimite: draft.dueDate,
      pontos: draft.points,
      concluida: false,
    });

    const createdTask = mapApiTask(response.data as Record<string, unknown>, fallbackTask);
    const nextTasks = [createdTask, ...seedTasks(userId)];
    persistTasks(userId, nextTasks);
    return createdTask;
  } catch {
    const nextTasks = [fallbackTask, ...seedTasks(userId)];
    persistTasks(userId, nextTasks);
    return fallbackTask;
  }
}

export async function atualizarTarefa(taskId: string, draft: TaskDraft): Promise<Task> {
  const userId = getCurrentUserId();
  const tasks = seedTasks(userId);
  const currentTask = tasks.find((item) => item.id === taskId);

  if (!currentTask) {
    throw new Error("Tarefa nao encontrada.");
  }

  const fallbackTask: Task = {
    ...currentTask,
    ...draft,
  };

  try {
    const response = await api.put(`/tarefas/${taskId}`, {
      nome: draft.title,
      descricao: draft.description,
      categoria: draft.category,
      prioridade: draft.priority,
      dataLimite: draft.dueDate,
      pontos: draft.points,
      concluida: currentTask.completed,
    });

    const updatedTask = mapApiTask(response.data as Record<string, unknown>, fallbackTask);
    const nextTasks = tasks.map((item) => (item.id === taskId ? updatedTask : item));
    persistTasks(userId, nextTasks);
    return updatedTask;
  } catch {
    const nextTasks = tasks.map((item) => (item.id === taskId ? fallbackTask : item));
    persistTasks(userId, nextTasks);
    return fallbackTask;
  }
}

export async function alternarConclusao(taskId: string): Promise<Task> {
  const userId = getCurrentUserId();
  const tasks = seedTasks(userId);
  const currentTask = tasks.find((item) => item.id === taskId);

  if (!currentTask) {
    throw new Error("Tarefa nao encontrada.");
  }

  const fallbackTask: Task = {
    ...currentTask,
    completed: !currentTask.completed,
  };

  try {
    const response = await api.patch(`/tarefas/${taskId}/concluir`, {
      concluida: fallbackTask.completed,
    });

    const updatedTask = mapApiTask(response.data as Record<string, unknown>, fallbackTask);
    const nextTasks = tasks.map((item) => (item.id === taskId ? updatedTask : item));
    persistTasks(userId, nextTasks);
    return updatedTask;
  } catch {
    const nextTasks = tasks.map((item) => (item.id === taskId ? fallbackTask : item));
    persistTasks(userId, nextTasks);
    return fallbackTask;
  }
}

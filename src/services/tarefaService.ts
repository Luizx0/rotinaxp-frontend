import { initialTasks } from "../data/mockData";
import { Task, TaskDraft } from "../types/app";
import api from "./api";
import { readStorage, storageKeys, writeStorage } from "./storage";

function seedTasks() {
  const storedTasks = readStorage<Task[]>(storageKeys.tasks, []);

  if (storedTasks.length > 0) {
    return storedTasks;
  }

  writeStorage(storageKeys.tasks, initialTasks);
  return initialTasks;
}

function persistTasks(tasks: Task[]) {
  writeStorage(storageKeys.tasks, tasks);
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
  try {
    const response = await api.get("/tarefas");

    if (Array.isArray(response.data)) {
      const mappedTasks = response.data.map((item) => mapApiTask(item as Record<string, unknown>));
      persistTasks(mappedTasks);
      return mappedTasks;
    }
  } catch {
    return seedTasks();
  }

  return seedTasks();
}

export async function criarTarefa(draft: TaskDraft): Promise<Task> {
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
    const nextTasks = [createdTask, ...seedTasks()];
    persistTasks(nextTasks);
    return createdTask;
  } catch {
    const nextTasks = [fallbackTask, ...seedTasks()];
    persistTasks(nextTasks);
    return fallbackTask;
  }
}

export async function atualizarTarefa(taskId: string, draft: TaskDraft): Promise<Task> {
  const tasks = seedTasks();
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
    persistTasks(nextTasks);
    return updatedTask;
  } catch {
    const nextTasks = tasks.map((item) => (item.id === taskId ? fallbackTask : item));
    persistTasks(nextTasks);
    return fallbackTask;
  }
}

export async function alternarConclusao(taskId: string): Promise<Task> {
  const tasks = seedTasks();
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
    persistTasks(nextTasks);
    return updatedTask;
  } catch {
    const nextTasks = tasks.map((item) => (item.id === taskId ? fallbackTask : item));
    persistTasks(nextTasks);
    return fallbackTask;
  }
}

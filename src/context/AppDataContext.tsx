import { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { initialProgress } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import { getLevelFromPoints } from "../services/authService";
import { getErrorMessage } from "../services/errorService";
import { redeemReward as redeemRewardService, getRewards } from "../services/rewardService";
import {
  alternarConclusao,
  atualizarTarefa,
  criarTarefa,
  getTarefas,
} from "../services/tarefaService";
import { ProgressPoint, Reward, Task, TaskDraft } from "../types/app";

interface AppDataContextValue {
  tasks: Task[];
  rewards: Reward[];
  progress: ProgressPoint[];
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  refreshAll: () => Promise<void>;
  addTask: (draft: TaskDraft) => Promise<void>;
  updateTask: (taskId: string, draft: TaskDraft) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<void>;
}

export const AppDataContext = createContext<AppDataContextValue | null>(null);

function buildProgress(tasks: Task[]): ProgressPoint[] {
  const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const buckets = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    return {
      dayKey: date.toISOString().slice(0, 10),
      label: weekdayLabels[date.getDay()],
      points: 0,
      tasks: 0,
    };
  });

  tasks.forEach((task) => {
    if (!task.completed) {
      return;
    }

    const dayKey = task.createdAt.slice(0, 10);
    const bucket = buckets.find((item) => item.dayKey === dayKey);

    if (!bucket) {
      return;
    }

    bucket.points += task.points;
    bucket.tasks += 1;
  });

  const hasData = buckets.some((item) => item.points > 0 || item.tasks > 0);

  if (!hasData) {
    return initialProgress;
  }

  return buckets.map(({ dayKey: _dayKey, ...item }) => item);
}

export function AppDataProvider({ children }: PropsWithChildren) {
  const { isAuthenticated, session, patchUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    setError(null);

    if (!isAuthenticated) {
      setTasks([]);
      setRewards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const [nextTasks, nextRewards] = await Promise.all([getTarefas(), getRewards()]);
      setTasks(nextTasks);
      setRewards(nextRewards);
    } catch (currentError) {
      setError(getErrorMessage(currentError, "Nao foi possivel carregar os dados da aplicacao."));
      throw currentError;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshAll().catch(() => undefined);
  }, [refreshAll, session?.user.id]);

  async function addTask(draft: TaskDraft) {
    setError(null);

    try {
      const createdTask = await criarTarefa(draft);
      setTasks((currentTasks) => [createdTask, ...currentTasks]);
    } catch (currentError) {
      setError(getErrorMessage(currentError, "Nao foi possivel criar a tarefa."));
      throw currentError;
    }
  }

  async function updateTask(taskId: string, draft: TaskDraft) {
    setError(null);

    try {
      const updatedTask = await atualizarTarefa(taskId, draft);
      setTasks((currentTasks) => currentTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (currentError) {
      setError(getErrorMessage(currentError, "Nao foi possivel atualizar a tarefa."));
      throw currentError;
    }
  }

  async function toggleTask(taskId: string) {
    const previousTask = tasks.find((task) => task.id === taskId);
    setError(null);

    let updatedTask: Task;

    try {
      updatedTask = await alternarConclusao(taskId);
    } catch (currentError) {
      setError(getErrorMessage(currentError, "Nao foi possivel alternar a tarefa."));
      throw currentError;
    }

    setTasks((currentTasks) => currentTasks.map((task) => (task.id === taskId ? updatedTask : task)));

    if (!session || !previousTask) {
      return;
    }

    const pointsDelta = updatedTask.completed === previousTask.completed ? 0 : updatedTask.completed ? updatedTask.points : -updatedTask.points;

    if (pointsDelta === 0) {
      return;
    }

    const nextPoints = Math.max(0, session.user.points + pointsDelta);
    await patchUser({
      points: nextPoints,
      level: getLevelFromPoints(nextPoints),
    });
  }

  async function redeemReward(rewardId: string) {
    setError(null);

    if (!session) {
      return;
    }

    const reward = rewards.find((item) => item.id === rewardId);

    if (!reward || reward.claimed || reward.cost > session.user.points) {
      return;
    }

    let updatedReward: Reward;

    try {
      updatedReward = await redeemRewardService(rewardId);
    } catch (currentError) {
      setError(getErrorMessage(currentError, "Nao foi possivel resgatar a recompensa."));
      throw currentError;
    }

    setRewards((currentRewards) => currentRewards.map((item) => (item.id === rewardId ? updatedReward : item)));

    const nextPoints = Math.max(0, session.user.points - reward.cost);
    await patchUser({
      points: nextPoints,
      level: getLevelFromPoints(nextPoints),
    });
  }

  function clearError() {
    setError(null);
  }

  return (
    <AppDataContext.Provider
      value={{
        tasks,
        rewards,
        progress: buildProgress(tasks),
        isLoading,
        error,
        clearError,
        refreshAll,
        addTask,
        updateTask,
        toggleTask,
        redeemReward,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

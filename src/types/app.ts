export type TaskCategory = "Saude" | "Estudos" | "Trabalho" | "Pessoal";
export type TaskPriority = "baixa" | "media" | "alta";
export type RewardAccent = "sunrise" | "ocean" | "forest" | "ember";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  streak: number;
  level: number;
  dailyGoal: number;
  about: string;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ProfileUpdatePayload {
  name: string;
  email: string;
  about: string;
  dailyGoal: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
  dueDate: string;
  points: number;
}

export interface TaskDraft {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
  points: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  claimed: boolean;
  accent: RewardAccent;
}

export interface RewardDraft {
  title: string;
  description: string;
  cost: number;
  accent: RewardAccent;
}

export interface ProgressPoint {
  label: string;
  points: number;
  tasks: number;
}

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

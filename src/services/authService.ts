import { defaultUser, demoPassword } from "../data/mockData";
import { AuthSession, LoginPayload, RegisterPayload, UserProfile } from "../types/app";
import { readStorage, storageKeys, writeStorage } from "./storage";

interface StoredAccount extends UserProfile {
  password: string;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function buildToken(userId: string) {
  return `demo-token-${userId}`;
}

function getSeedAccounts() {
  const storedAccounts = readStorage<StoredAccount[]>(storageKeys.accounts, []);

  if (storedAccounts.length > 0) {
    return storedAccounts;
  }

  const seedAccount: StoredAccount = {
    ...defaultUser,
    password: demoPassword,
  };

  writeStorage(storageKeys.accounts, [seedAccount]);
  return [seedAccount];
}

function saveAccounts(accounts: StoredAccount[]) {
  writeStorage(storageKeys.accounts, accounts);
}

function toSession(account: StoredAccount): AuthSession {
  const { password: _password, ...user } = account;
  return {
    token: buildToken(account.id),
    user,
  };
}

export function getLevelFromPoints(points: number) {
  return Math.max(1, Math.floor(points / 100) + 1);
}

export async function loginUser(payload: LoginPayload): Promise<AuthSession> {
  const accounts = getSeedAccounts();
  const account = accounts.find(
    (item) => normalizeEmail(item.email) === normalizeEmail(payload.email) && item.password === payload.password,
  );

  if (!account) {
    throw new Error("Credenciais invalidas.");
  }

  const session = toSession(account);
  writeStorage(storageKeys.authSession, session);
  return session;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthSession> {
  const accounts = getSeedAccounts();
  const alreadyExists = accounts.some((item) => normalizeEmail(item.email) === normalizeEmail(payload.email));

  if (alreadyExists) {
    throw new Error("Ja existe uma conta com esse email.");
  }

  const newAccount: StoredAccount = {
    id: `user-${Date.now()}`,
    name: payload.name.trim(),
    email: normalizeEmail(payload.email),
    password: payload.password,
    role: "Novo jogador",
    points: 0,
    streak: 0,
    level: 1,
    dailyGoal: 100,
    about: "Pronto para comecar uma nova rotina.",
  };

  saveAccounts([...accounts, newAccount]);
  const session = toSession(newAccount);
  writeStorage(storageKeys.authSession, session);
  return session;
}

export function getStoredSession(): AuthSession | null {
  const session = readStorage<AuthSession | null>(storageKeys.authSession, null);

  if (!session) {
    return null;
  }

  const accounts = getSeedAccounts();
  const account = accounts.find((item) => item.id === session.user.id);

  if (!account) {
    return null;
  }

  const freshSession = toSession(account);
  writeStorage(storageKeys.authSession, freshSession);
  return freshSession;
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(storageKeys.authSession);
}

export async function updateStoredUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const accounts = getSeedAccounts();
  const nextAccounts = accounts.map((item) => {
    if (item.id !== userId) {
      return item;
    }

    const nextPoints = typeof updates.points === "number" ? updates.points : item.points;

    return {
      ...item,
      ...updates,
      points: nextPoints,
      level: getLevelFromPoints(nextPoints),
      email: typeof updates.email === "string" ? normalizeEmail(updates.email) : item.email,
    };
  });

  saveAccounts(nextAccounts);
  const updatedAccount = nextAccounts.find((item) => item.id === userId);

  if (!updatedAccount) {
    throw new Error("Usuario nao encontrado.");
  }

  const nextSession = toSession(updatedAccount);
  writeStorage(storageKeys.authSession, nextSession);
  return nextSession.user;
}

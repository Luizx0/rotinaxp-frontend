export const storageKeys = {
  authSession: "rotinaxp.auth.session",
  accounts: "rotinaxp.auth.accounts",
  tasksByUser: "rotinaxp.tasks.byUser",
  rewardsByUser: "rotinaxp.rewards.byUser",
  onboardingByUser: "rotinaxp.onboarding.byUser",
  themeMode: "rotinaxp.theme.mode",
};

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredSessionUserId() {
  const session = readStorage<{ user?: { id?: string } } | null>(storageKeys.authSession, null);
  return session?.user?.id ?? null;
}

import { createContext, PropsWithChildren, useEffect, useState } from "react";
import {
  clearSession,
  getStoredSession,
  loginUser,
  registerUser,
  updateStoredUser,
} from "../services/authService";
import { AuthSession, LoginPayload, ProfileUpdatePayload, RegisterPayload, UserProfile } from "../types/app";

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<void>;
  patchUser: (updates: Partial<UserProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(getStoredSession());
    setIsLoading(false);
  }, []);

  async function login(payload: LoginPayload) {
    const nextSession = await loginUser(payload);
    setSession(nextSession);
  }

  async function register(payload: RegisterPayload) {
    const nextSession = await registerUser(payload);
    setSession(nextSession);
  }

  function logout() {
    clearSession();
    setSession(null);
  }

  async function updateProfile(payload: ProfileUpdatePayload) {
    if (!session) {
      return;
    }

    const updatedUser = await updateStoredUser(session.user.id, payload);
    setSession({
      ...session,
      user: updatedUser,
    });
  }

  async function patchUser(updates: Partial<UserProfile>) {
    if (!session) {
      return;
    }

    const updatedUser = await updateStoredUser(session.user.id, updates);
    setSession({
      ...session,
      user: updatedUser,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session),
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        patchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

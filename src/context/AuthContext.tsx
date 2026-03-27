import { createContext, PropsWithChildren, useEffect, useState } from "react";
import {
  clearSession,
  getStoredSession,
  loginUser,
  registerUser,
  updateStoredUser,
} from "../services/authService";
import { getErrorMessage } from "../services/errorService";
import { AuthSession, LoginPayload, ProfileUpdatePayload, RegisterPayload, UserProfile } from "../types/app";

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSession(getStoredSession());
    setIsLoading(false);
  }, []);

  async function login(payload: LoginPayload) {
    setError(null);

    try {
      const nextSession = await loginUser(payload);
      setSession(nextSession);
    } catch (currentError) {
      setError(getErrorMessage(currentError, "Nao foi possivel entrar."));
      throw currentError;
    }
  }

  async function register(payload: RegisterPayload) {
    setError(null);

    try {
      const nextSession = await registerUser(payload);
      setSession(nextSession);
    } catch (currentError) {
      setError(getErrorMessage(currentError, "Nao foi possivel criar a conta."));
      throw currentError;
    }
  }

  function logout() {
    setError(null);
    clearSession();
    setSession(null);
  }

  async function updateProfile(payload: ProfileUpdatePayload) {
    if (!session) {
      return;
    }

    setError(null);

    try {
      const updatedUser = await updateStoredUser(session.user.id, payload);
      setSession({
        ...session,
        user: updatedUser,
      });
    } catch (currentError) {
      setError(getErrorMessage(currentError, "Nao foi possivel atualizar o perfil."));
      throw currentError;
    }
  }

  async function patchUser(updates: Partial<UserProfile>) {
    if (!session) {
      return;
    }

    setError(null);

    try {
      const updatedUser = await updateStoredUser(session.user.id, updates);
      setSession({
        ...session,
        user: updatedUser,
      });
    } catch (currentError) {
      setError(getErrorMessage(currentError));
      throw currentError;
    }
  }

  function clearError() {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session),
        isLoading,
        error,
        clearError,
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

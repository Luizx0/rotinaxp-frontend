import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { readStorage, storageKeys, writeStorage } from "../services/storage";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>(() => readStorage<ThemeMode>(storageKeys.themeMode, "light"));

  useEffect(() => {
    document.body.setAttribute("data-theme", mode);
    writeStorage(storageKeys.themeMode, mode);
  }, [mode]);

  function toggleMode() {
    setMode((currentMode) => (currentMode === "light" ? "dark" : "light"));
  }

  return <ThemeContext.Provider value={{ mode, toggleMode }}>{children}</ThemeContext.Provider>;
}

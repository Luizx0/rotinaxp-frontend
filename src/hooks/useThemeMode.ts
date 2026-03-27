import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export function useThemeMode() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("useThemeMode must be used within ThemeProvider.");
  }

  return themeContext;
}

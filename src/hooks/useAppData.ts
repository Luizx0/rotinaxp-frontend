import { useContext } from "react";
import { AppDataContext } from "../context/AppDataContext";

export function useAppData() {
  const appDataContext = useContext(AppDataContext);

  if (!appDataContext) {
    throw new Error("useAppData must be used within AppDataProvider.");
  }

  return appDataContext;
}

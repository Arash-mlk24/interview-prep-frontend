"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export type ThemeMode = "light" | "dark";

interface ThemeModeContextType {
  mode: ThemeMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextType>({
  mode: "dark",
  toggleColorMode: () => {},
  setColorMode: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

interface ThemeModeProviderProps {
  children: React.ReactNode;
}

export const ThemeModeProvider: React.FC<ThemeModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("telos_theme_mode") as ThemeMode | null;
      if (savedMode === "light" || savedMode === "dark") {
        setMode(savedMode);
      }
    } catch {
      // Ignore localStorage errors in SSR/private browsing
    }
    setMounted(true);
  }, []);

  const setColorMode = (newMode: ThemeMode) => {
    setMode(newMode);
    try {
      localStorage.setItem("telos_theme_mode", newMode);
    } catch {
      // Ignore storage errors
    }
  };

  const toggleColorMode = () => {
    setColorMode(mode === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(mode);
    }
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode,
      setColorMode,
    }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};

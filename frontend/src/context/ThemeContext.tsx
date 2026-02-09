import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export interface ThemeColors {
  bg: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  divider: string;
  inputBg: string;
  inputBorder: string;
  hoverBg: string;
  // status-specific
  emptyBg: string;
}

const lightColors: ThemeColors = {
  bg: "#f8fafc",
  cardBg: "rgba(255, 255, 255, 0.7)",
  cardBorder: "rgba(255, 255, 255, 0.8)",
  cardShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
  text: "#0f172a",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
  divider: "rgba(0, 0, 0, 0.06)",
  inputBg: "rgba(255, 255, 255, 0.7)",
  inputBorder: "rgba(0, 0, 0, 0.08)",
  hoverBg: "rgba(0, 0, 0, 0.04)",
  emptyBg: "rgba(255, 255, 255, 0.5)",
};

const darkColors: ThemeColors = {
  bg: "#0B1120",
  cardBg: "rgba(30, 41, 59, 0.7)",
  cardBorder: "rgba(51, 65, 85, 0.5)",
  cardShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  text: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  divider: "rgba(255, 255, 255, 0.08)",
  inputBg: "rgba(30, 41, 59, 0.6)",
  inputBorder: "rgba(255, 255, 255, 0.1)",
  hoverBg: "rgba(255, 255, 255, 0.05)",
  emptyBg: "rgba(30, 41, 59, 0.4)",
};

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  colors: lightColors,
});

export const useAppTheme = () => useContext(ThemeContext);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("focustrack-dark-mode");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("focustrack-dark-mode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const colors = useMemo(() => (darkMode ? darkColors : lightColors), [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

import { createContext, useMemo, type ReactNode } from "react";

import { theme, type AppTheme } from "@/theme";

interface ThemeContextData {
  theme: AppTheme;
}

export const ThemeContext = createContext<ThemeContextData | undefined>(
  undefined,
);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const value = useMemo(
    () => ({
      theme,
    }),
    [],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

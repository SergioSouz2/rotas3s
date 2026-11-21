import { useContext } from "react";

import { ThemeContext } from "@/provider/ThemeProvider";

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme deve ser utilizado dentro do ThemeProvider.");
  }

  return context.theme;
}

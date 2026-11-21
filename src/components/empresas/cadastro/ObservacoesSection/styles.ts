import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(_theme: AppTheme) {
  return StyleSheet.create({
    observacoes: {
      minHeight: 100,
    },
  });
}

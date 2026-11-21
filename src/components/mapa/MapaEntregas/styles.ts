import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },

    mapa: {
      flex: 1,
    },

    marcador: {
      alignItems: "center",
      justifyContent: "center",
    },

    marcadorNumero: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      borderWidth: 3,
      borderColor: colors.textInverse,
      alignItems: "center",
      justifyContent: "center",
    },

    numero: {
      color: colors.textInverse,
      fontSize: 12,
      fontWeight: "bold",
    },
  });
}

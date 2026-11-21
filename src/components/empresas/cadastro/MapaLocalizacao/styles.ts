import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, radius } = theme;

  return StyleSheet.create({
    container: {
      width: "100%",
      height: 240,

      borderRadius: radius.lg,
      overflow: "hidden",

      backgroundColor: colors.border,
    },

    mapa: {
      flex: 1,
    },

    marcador: {
      width: 28,
      height: 28,
      borderRadius: radius.full,

      backgroundColor: colors.info,

      borderWidth: 4,
      borderColor: colors.surface,

      alignItems: "center",
      justifyContent: "center",
    },

    marcadorCentro: {
      width: 8,
      height: 8,
      borderRadius: radius.full,

      backgroundColor: colors.surface,
    },

    marcadorCentralizado: {
      position: "absolute",

      top: 0,
      bottom: 0,
      left: 0,
      right: 0,

      alignItems: "center",
      justifyContent: "center",
    },
  });
}

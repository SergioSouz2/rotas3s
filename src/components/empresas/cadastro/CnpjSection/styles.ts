import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    botaoBuscar: {
      backgroundColor: colors.info,
      borderRadius: radius.md,
      minHeight: 48,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: spacing.sm,
    },

    botaoBuscarTexto: {
      color: colors.textInverse,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },

    botaoDesabilitado: {
      opacity: 0.7,
    },
  });
}

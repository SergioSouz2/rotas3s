import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },

    content: {
      flexGrow: 1,
    },

    body: {
      padding: spacing.md,
      paddingBottom: spacing.xxl,
      gap: 10,
    },

    botaoSalvar: {
      backgroundColor: colors.success,

      minHeight: 46,
      borderRadius: radius.md,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 7,
      marginBottom: 10,
    },

    botaoSalvarDesabilitado: {
      opacity: 0.6,
    },

    botaoSalvarTexto: {
      color: colors.textInverse,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },
  });
}

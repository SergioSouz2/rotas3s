import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, typography, radius } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flexGrow: 1,
    },

    body: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,

      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xxl,
      paddingBottom: 40,

      gap: spacing.xl,
    },

    secao: {
      gap: 14,
    },

    secaoTitulo: {
      fontSize: 17,
      fontWeight: typography.weight.bold,
      color: colors.text,
    },

    // Estado de carregamento
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 48,
      gap: spacing.md,
    },

    loadingText: {
      color: colors.textSecondary,
      fontSize: typography.size.md,
    },

    // Estado de erro
    errorContainer: {
      alignItems: "center",
      paddingVertical: 36,
      gap: spacing.md,
    },

    errorText: {
      color: colors.danger,
      textAlign: "center",
      fontSize: typography.size.md,
      lineHeight: typography.lineHeight.md,
    },

    retryButton: {
      backgroundColor: colors.success,

      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,

      borderRadius: radius.md,

      alignItems: "center",
      justifyContent: "center",
    },

    retryButtonText: {
      color: colors.textInverse,
      fontWeight: typography.weight.bold,
      fontSize: typography.size.md,
    },
  });
}

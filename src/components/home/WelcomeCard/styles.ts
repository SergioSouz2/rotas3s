import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },

    info: {
      flex: 1,
      minWidth: 0,
    },

    welcome: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },

    nome: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.primary,
    },

    cargo: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },

    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      gap: 6,
      flexShrink: 0,
    },

    statusAberto: {
      backgroundColor: colors.successLight,
    },

    statusFechado: {
      backgroundColor: colors.dangerLight,
    },

    statusDot: {
      width: 7,
      height: 7,
      borderRadius: radius.full,
    },

    dotAberto: {
      backgroundColor: colors.success,
    },

    dotFechado: {
      backgroundColor: colors.danger,
    },

    statusText: {
      fontSize: 11,
      fontWeight: typography.weight.bold,
    },

    textAberto: {
      color: colors.successDark,
    },

    textFechado: {
      color: colors.dangerDark,
    },
  });
}

import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      width: "100%",
      backgroundColor: colors.successSurface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.successBorder,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: spacing.xs,
    },

    title: {
      fontSize: 15,
      fontWeight: typography.weight.bold,
      color: colors.successDarker,
    },

    content: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    info: {
      flex: 1,
    },

    infoRight: {
      flex: 1,
      alignItems: "flex-end",
    },

    label: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,
      marginBottom: 5,
    },

    value: {
      fontSize: typography.size.base,
      fontWeight: "800",
      color: colors.primary,
    },

    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: spacing.md,
      gap: spacing.sm,
    },

    status: {
      flex: 1,
    },

    statusAberto: {},

    statusFinalizado: {},

    statusText: {
      fontSize: 11,
      fontWeight: typography.weight.semibold,
      color: colors.successDarker,
    },

    button: {
      backgroundColor: colors.successDark,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: radius.sm,
      minWidth: 110,
      alignItems: "center",
    },

    buttonFinalizar: {
      backgroundColor: colors.danger,
    },

    buttonDisabled: {
      opacity: 0.6,
    },

    buttonText: {
      color: colors.textInverse,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
    },
  });
}

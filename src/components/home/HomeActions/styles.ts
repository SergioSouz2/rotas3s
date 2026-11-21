import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      width: "100%",
      gap: 10,
    },

    primaryButton: {
      backgroundColor: colors.successDark,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: spacing.lg,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
    },

    primaryButtonText: {
      fontSize: 15,
      fontWeight: typography.weight.bold,
      color: colors.textInverse,
    },

    secondaryRow: {
      flexDirection: "row",
      gap: 10,
    },

    secondaryButton: {
      flex: 1,
      minWidth: 0,

      backgroundColor: colors.infoLight,
      borderRadius: 12,

      paddingVertical: spacing.md,
      paddingHorizontal: 6,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    secondaryButtonText: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
      color: colors.info,
    },

    finishButton: {
      borderWidth: 1,
      borderColor: colors.dangerBorder,
      backgroundColor: colors.dangerSurface,
      borderRadius: 12,

      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
    },

    finishButtonText: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
      color: colors.danger,
    },

    disabledButton: {
      opacity: 0.5,
    },

    disabledFinishButton: {
      opacity: 0.5,
    },
  });
}

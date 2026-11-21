import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",

      backgroundColor: colors.surface,

      borderTopWidth: 1,
      borderTopColor: colors.border,

      paddingTop: 10,
      paddingHorizontal: spacing.sm,
    },

    tab: {
      flex: 1,
      minWidth: 0,

      alignItems: "center",
      justifyContent: "center",

      gap: spacing.xs,
      paddingVertical: 5,
    },

    label: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.medium,
      color: colors.textSecondary,
    },

    activeLabel: {
      fontWeight: typography.weight.bold,
      color: colors.primary,
    },
  });
}

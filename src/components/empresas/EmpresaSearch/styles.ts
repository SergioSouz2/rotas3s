import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",

      backgroundColor: colors.surface,

      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,

      paddingHorizontal: 15,
      height: 54,
      gap: 10,
    },

    input: {
      flex: 1,
      minWidth: 0,

      color: colors.text,
      fontSize: typography.size.md,

      paddingVertical: 0,
    },

    clearButton: {
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.xs,
    },
  });
}

import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.surface,

      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,

      paddingHorizontal: spacing.xxl,
      paddingVertical: 40,

      alignItems: "center",
      justifyContent: "center",

      gap: spacing.md,
    },

    icone: {
      width: 68,
      height: 68,

      borderRadius: 22,
      backgroundColor: colors.background,

      alignItems: "center",
      justifyContent: "center",

      marginBottom: spacing.xs,
    },

    titulo: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.bold,
      color: colors.text,

      textAlign: "center",
    },

    descricao: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,

      textAlign: "center",
      lineHeight: typography.lineHeight.md,
    },
  });
}

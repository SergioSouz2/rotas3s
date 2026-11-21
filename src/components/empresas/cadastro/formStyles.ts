import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createFormStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
    },

    secaoTitulo: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
      color: colors.text,
    },

    secaoDescricao: {
      fontSize: 11,
      lineHeight: typography.lineHeight.sm,
      color: colors.textSecondary,
    },

    label: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold,
      color: colors.text,
      marginTop: 2,
    },

    input: {
      minHeight: 42,
      borderWidth: 1,
      borderColor: colors.disabled,
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      paddingHorizontal: 10,
      paddingVertical: spacing.sm,
      fontSize: 13,
      color: colors.text,
    },

    inputMultiline: {
      minHeight: 64,
      textAlignVertical: "top",
    },
  });
}

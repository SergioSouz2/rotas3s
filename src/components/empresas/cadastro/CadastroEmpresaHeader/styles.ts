import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    header: {
      backgroundColor: colors.primary,

      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xxl,

      flexDirection: "row",
      alignItems: "center",

      gap: 14,
    },

    voltar: {
      width: 40,
      height: 40,

      borderRadius: radius.md,

      backgroundColor: colors.secondary,

      alignItems: "center",
      justifyContent: "center",
    },

    headerTextos: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xs,
    },

    headerTitulo: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
      color: colors.textInverse,
    },

    headerSubtitulo: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.regular,
      color: colors.disabled,
      lineHeight: typography.lineHeight.sm,
    },
  });
}

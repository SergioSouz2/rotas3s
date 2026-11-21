import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",

      backgroundColor: colors.primary,

      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.lg,

      gap: 14,

      minHeight: 88,
    },

    voltar: {
      width: 40,
      height: 40,

      borderRadius: radius.md,

      backgroundColor: "rgba(255, 255, 255, 0.16)",

      alignItems: "center",
      justifyContent: "center",
    },

    headerTextos: {
      flex: 1,
      minWidth: 0,

      justifyContent: "center",
      gap: spacing.xs,
    },

    headerTitulo: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,

      color: colors.textInverse,

      letterSpacing: 0.2,
    },

    headerSubtitulo: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.regular,

      color: colors.successLight,
      lineHeight: typography.lineHeight.sm,
    },
  });
}

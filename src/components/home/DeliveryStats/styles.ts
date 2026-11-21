import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "row",
      gap: 10,
    },

    card: {
      flex: 1,
      minWidth: 0,

      backgroundColor: colors.surface,

      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,

      paddingVertical: spacing.md,
      paddingHorizontal: 6,

      alignItems: "center",
      justifyContent: "center",
    },

    iconContainer: {
      width: 36,
      height: 36,

      borderRadius: radius.md,

      alignItems: "center",
      justifyContent: "center",

      marginBottom: 6,
    },

    quantidade: {
      fontSize: 23,
      fontWeight: "800",
      color: colors.primary,
    },

    titulo: {
      fontSize: 11,
      fontWeight: typography.weight.semibold,
      color: colors.textSecondary,

      marginTop: 3,
      textAlign: "center",
    },
  });
}

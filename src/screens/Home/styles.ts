import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },

    loadingText: {
      marginTop: spacing.md,
      color: colors.textSecondary,
      fontSize: theme.typography.size.md,
    },

    content: {
      flexGrow: 1,
    },

    body: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xxl,
      paddingBottom: 40,
      gap: spacing.xl,
    },

    errorText: {
      color: colors.danger,
      fontSize: theme.typography.size.md,
    },
  });
}

import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      width: "100%",
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      gap: spacing.md,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },

    headerTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      flexShrink: 1,
    },

    title: {
      fontSize: 15,
      fontWeight: typography.weight.bold,
      color: colors.primary,
    },

    statusBadge: {
      backgroundColor: colors.warningLight,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.full,
    },

    statusText: {
      fontSize: 11,
      fontWeight: typography.weight.bold,
      color: colors.warningDark,
    },

    divider: {
      height: 1,
      backgroundColor: colors.border,
    },

    content: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },

    companyIcon: {
      width: 46,
      height: 46,
      borderRadius: 12,
      backgroundColor: colors.infoLight,
      alignItems: "center",
      justifyContent: "center",
    },

    companyInfo: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xs,
    },

    companyName: {
      fontSize: 15,
      fontWeight: typography.weight.bold,
      color: colors.text,
    },

    address: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,
      lineHeight: 18,
    },

    routeButton: {
      alignSelf: "flex-end",
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
    },

    routeButtonText: {
      fontSize: 13,
      fontWeight: typography.weight.bold,
      color: colors.textInverse,
    },
  });
}

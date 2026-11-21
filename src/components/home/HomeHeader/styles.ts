import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.primary,

      paddingBottom: spacing.xl,
      paddingHorizontal: spacing.lg,

      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    brand: {
      width: 200,
      height: 70,

      justifyContent: "center",
      alignItems: "flex-start",
    },

    logo: {
      width: 200,
      height: 70,
    },

    profileButton: {
      width: 46,
      height: 46,

      borderRadius: radius.full,

      borderWidth: 1.5,
      borderColor: colors.textInverse,

      alignItems: "center",
      justifyContent: "center",
    },

    profileIcon: {
      fontSize: 23,
      color: colors.textInverse,
    },
  });
}

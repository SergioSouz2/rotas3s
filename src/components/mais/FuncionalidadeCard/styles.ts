import { StyleSheet } from "react-native";

export function createStyles(colors: any) {
  return StyleSheet.create({
    card: {
      width: "31%",
      minHeight: 124,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      borderRadius: 16,
      backgroundColor: colors.surface,
      gap: 8,
    },

    iconeContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },

    titulo: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "600",
      textAlign: "center",
    },

    emBreve: {
      color: colors.textMuted,
      fontSize: 10,
      textAlign: "center",
    },
  });
}

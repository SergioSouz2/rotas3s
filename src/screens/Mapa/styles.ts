import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    conteudo: {
      flex: 1,
      position: "relative",
    },

    centro: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.xl,
      gap: spacing.md,
    },

    mensagem: {
      color: colors.textSecondary,
      fontSize: theme.typography.size.md,
      textAlign: "center",
    },

    resumo: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 16,
      padding: spacing.md,
      borderRadius: 12,
      backgroundColor: colors.background,
      elevation: 4,
    },

    resumoTitulo: {
      color: colors.text,
      fontSize: theme.typography.size.md,
      fontWeight: "700",
    },

    resumoDetalhe: {
      color: colors.textSecondary,
      marginTop: 4,
      fontSize: 12,
    },
  });
}

import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },

    topo: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },

    icone: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.infoSoft,
      alignItems: "center",
      justifyContent: "center",
    },

    informacoes: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xs,
    },

    nome: {
      fontSize: 14,
      fontWeight: typography.weight.semibold,
      color: colors.text,
    },

    cnpj: {
      fontSize: 11,
      color: colors.textSecondary,
    },

    enderecoContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },

    endereco: {
      flex: 1,
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 17,
    },

    rodape: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      borderTopWidth: 1,
      borderTopColor: colors.background,
      paddingTop: 10,
    },

    localizacao: {
      fontSize: 11,
      fontWeight: typography.weight.medium,
    },

    localizacaoCadastrada: {
      color: colors.successDark,
    },

    localizacaoPendente: {
      color: colors.warningDark,
    },
  });
}

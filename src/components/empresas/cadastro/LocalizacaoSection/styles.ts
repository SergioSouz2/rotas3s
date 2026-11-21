import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    mapaPlaceholder: {
      minHeight: 160,
      backgroundColor: colors.background,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,

      alignItems: "center",
      justifyContent: "center",

      padding: spacing.lg,
      gap: spacing.sm,
    },

    mapaTexto: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "center",
    },

    informacoesLocalizacao: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.sm,
    },

    statusLocalizacao: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },

    statusTexto: {
      fontSize: 13,
      fontWeight: typography.weight.bold,
      color: colors.success,
      flex: 1,
    },

    coordenadasTexto: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,
    },

    avisoTexto: {
      fontSize: typography.size.sm,
      lineHeight: 18,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },

    acoesEdicao: {
      gap: spacing.sm,
      marginTop: spacing.sm,
    },

    botaoLocalizacao: {
      minHeight: 50,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.info,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: spacing.sm,
    },

    botaoLocalizacaoTexto: {
      color: colors.info,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },

    botaoConfirmar: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },

    botaoConfirmarTexto: {
      color: colors.textInverse,
      fontSize: 13,
      fontWeight: typography.weight.bold,
    },
  });
}

import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.primary,

      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },

    brand: {
      width: "100%",
      height: 70,

      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    logo: {
      width: 130,
      height: 70,
    },

    conteudo: {
      marginTop: spacing.xl,
      gap: 22,
    },

    titulos: {
      gap: 5,
      flexShrink: 1,
    },

    titulo: {
      fontSize: 25,
      fontWeight: "800",
      color: colors.textInverse,
    },

    subtitulo: {
      fontSize: 13,
      color: colors.disabled,
    },

    rodape: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: spacing.md,
    },

    contadorContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flexShrink: 1,
    },

    contador: {
      color: colors.border,
      fontSize: 13,
      fontWeight: typography.weight.medium,
    },

    botao: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 5,

      backgroundColor: colors.info,

      paddingHorizontal: 14,
      paddingVertical: 11,

      borderRadius: 11,
    },

    botaoTexto: {
      color: colors.textInverse,
      fontSize: 13,
      fontWeight: typography.weight.bold,
    },
  });
}

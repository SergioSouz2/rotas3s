import { useAppTheme } from "@/hooks/useAppTheme";
import { StyleSheet } from "react-native";

type AppTheme = ReturnType<typeof useAppTheme>;

export function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingBottom: 14,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    botaoVoltar: {
      width: 42,
      height: 42,
      justifyContent: "center",
      alignItems: "center",
    },

    headerTitulo: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
    },

    headerEspaco: {
      width: 42,
    },

    centro: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      gap: 16,
    },

    conteudo: {
      padding: 18,
      paddingBottom: 32,
      gap: 16,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      gap: 12,
    },

    linha: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    flex: {
      flex: 1,
    },

    titulo: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },

    cardTitulo: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },

    rotulo: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
    },

    valor: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.text,
    },

    campoObservacao: {
      minHeight: 92,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      color: colors.text,
      textAlignVertical: "top",
    },

    textoSecundario: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary,
    },

    statusTexto: {
      fontSize: 15,
      fontWeight: "700",
    },

    etapa: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 8,
    },

    etapaTexto: {
      fontSize: 14,
      color: colors.textSecondary,
    },

    acoesMapa: {
      flexDirection: "row",
      gap: 12,
    },

    botaoMapa: {
      flex: 1,
      minHeight: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 7,
      paddingHorizontal: 8,
    },

    botaoMapaTexto: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
    },

    aviso: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.warning,
      textAlign: "center",
    },

    rodape: {
      paddingHorizontal: 18,
      paddingTop: 14,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    botaoPrincipal: {
      minHeight: 54,
      backgroundColor: colors.primary,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },

    botaoPrincipalTexto: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textInverse,
    },

    botaoDesabilitado: {
      opacity: 0.6,
    },

    botaoSecundario: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },

    botaoSecundarioTexto: {
      color: colors.textInverse,
      fontWeight: "700",
    },
  });
}

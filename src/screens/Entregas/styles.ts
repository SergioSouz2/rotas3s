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

    content: {
      flexGrow: 1,
      paddingBottom: 32,
    },

    body: {
      paddingHorizontal: 20,
      paddingTop: 20,
      gap: 20,
    },

    tituloLinha: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },

    tituloContainer: {
      flex: 1,
      gap: 5,
    },

    titulo: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },

    subtitulo: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 21,
    },

    botaoNovaEntrega: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },

    botaoNovaEntregaTexto: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textInverse,
    },

    botaoPressionado: {
      opacity: 0.7,
    },

    erro: {
      color: colors.danger,
      fontSize: 13,
      lineHeight: 20,
    },

    estadoContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 36,
      paddingHorizontal: 24,
      gap: 12,
    },

    estadoTitulo: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },

    estadoTexto: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      textAlign: "center",
    },

    cardProgresso: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      gap: 14,
    },

    progressoCabecalho: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    cardTitulo: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },

    progressoValor: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.primary,
    },

    barraFundo: {
      height: 10,
      borderRadius: 10,
      backgroundColor: colors.border,
      overflow: "hidden",
    },

    barraPreenchimento: {
      height: "100%",
      borderRadius: 10,
      backgroundColor: colors.primary,
    },

    progressoDescricao: {
      fontSize: 13,
      color: colors.textSecondary,
    },

    estatisticas: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    cardEstatistica: {
      flexGrow: 1,
      flexBasis: "45%",
      minWidth: 0,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 16,
      paddingHorizontal: 8,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    estatisticaValor: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.text,
    },

    estatisticaLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
    },

    secaoCabecalho: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },

    secaoTitulo: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
    },

    secaoQuantidade: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.primary,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 5,
      overflow: "hidden",
    },

    cardEntrega: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },

    entregaConteudo: {
      padding: 16,
      gap: 12,
    },

    cardEntregaPressionado: {
      opacity: 0.75,
    },

    entregaCabecalho: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },

    entregaIdentificacao: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    entregaTitulo: {
      flexShrink: 1,
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },

    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      flexShrink: 1,
    },

    entregaStatus: {
      fontSize: 11,
      fontWeight: "700",
      flexShrink: 1,
    },

    entregaEndereco: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary,
    },

    entregaDescricao: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.text,
    },

    entregaRodape: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    verDetalhes: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 8,
    },

    verDetalhesTexto: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
    },

    botaoExcluir: {
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: colors.background,
    },

    avisoContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 14,
      backgroundColor: colors.surface,
      borderRadius: 12,
    },

    aviso: {
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
      color: colors.warning,
    },
  });
}

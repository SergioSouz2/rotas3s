import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },

    centro: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: spacing.xl,
    },

    textoSecundario: {
      color: colors.textSecondary,
      fontSize: 11,
      textAlign: "center",
    },

    conteudo: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      gap: 6,
    },

    botaoExcluir: {
      minHeight: 48,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.danger,
      borderRadius: radius.md,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.sm,
    },

    textoExcluir: {
      color: colors.danger,
      fontWeight: typography.weight.bold,
    },

    // Identificação da empresa
    identificacao: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: 3,
    },

    iconeEmpresa: {
      width: 34,
      height: 34,
      borderRadius: radius.md,
      backgroundColor: colors.successLight,
      alignItems: "center",
      justifyContent: "center",
    },

    identificacaoTextos: {
      flex: 1,
      gap: 2,
    },

    nomeEmpresa: {
      color: colors.text,
      fontSize: 15,
      fontWeight: typography.weight.bold,
    },

    cnpj: {
      color: colors.textSecondary,
      fontSize: typography.size.xs,
    },

    // Cards de informações
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
      gap: 5,
    },

    cardCabecalho: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 2,
    },

    cardTitulo: {
      color: colors.text,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
    },

    linha: {
      flexDirection: "row",
      gap: 10,
    },

    campo: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },

    label: {
      color: colors.textSecondary,
      fontSize: typography.size.xs,
      fontWeight: typography.weight.medium,
    },

    valor: {
      color: colors.text,
      fontSize: 11,
      fontWeight: typography.weight.semibold,
    },

    // Card de geolocalização
    cardMapa: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
      gap: 6,
    },

    mapa: {
      flex: 1,
      width: "100%",
      minHeight: 0,
    },

    mapaContainer: {
      width: "100%",
      height: 190,
      borderRadius: radius.sm,
      overflow: "hidden",
      backgroundColor: colors.border,
    },

    semLocalizacao: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
    },

    // Botões de navegação
    acoes: {
      flexDirection: "row",
      gap: spacing.sm,
    },

    botao: {
      flex: 1,
      height: 36,
      backgroundColor: colors.success,
      borderRadius: radius.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 6,
    },

    botaoDesabilitado: {
      opacity: 0.45,
    },

    textoBotao: {
      color: colors.textInverse,
      fontSize: 11,
      fontWeight: typography.weight.bold,
    },

    // Observações
    observacoes: {
      minHeight: 34,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 10,
    },

    observacoesTexto: {
      flex: 1,
      color: colors.textSecondary,
      fontSize: 11,
    },

    // Modal de informações completas
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      padding: spacing.xxl,
    },

    modalFundo: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    modalConteudo: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: 18,
      gap: radius.lg,
      maxHeight: "75%",
    },

    modalCabecalho: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },

    modalTitulo: {
      flex: 1,
      color: colors.text,
      fontSize: typography.size.base,
      fontWeight: typography.weight.bold,
    },

    modalTexto: {
      color: colors.text,
      fontSize: typography.size.md,
      lineHeight: 22,
    },
  });
}

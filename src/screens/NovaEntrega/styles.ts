import type { AppTheme } from "@/theme";
import { StyleSheet } from "react-native";

export function createStyles(theme: AppTheme) {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },

    buscaContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },

    buscaInput: {
      flex: 1,
      height: 50,
      color: colors.text,
      fontSize: typography.size.md,
    },

    secaoCabecalho: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },

    secaoTitulo: {
      color: colors.text,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },

    contador: {
      color: colors.textSecondary,
      fontSize: typography.size.sm,
    },

    lista: {
      paddingBottom: spacing.lg,
      gap: spacing.sm,
      flexGrow: 1,
    },

    carregamento: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
    },

    carregamentoTexto: {
      color: colors.textSecondary,
      fontSize: typography.size.sm,
    },

    empresaCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.md,
    },

    empresaSelecionada: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },

    empresaInformacoes: {
      flex: 1,
      gap: spacing.xs,
    },

    empresaNome: {
      color: colors.text,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },

    empresaCnpj: {
      color: colors.textSecondary,
      fontSize: typography.size.sm,
    },

    empresaEndereco: {
      color: colors.textSecondary,
      fontSize: typography.size.sm,
    },

    indicador: {
      width: 34,
      height: 34,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    indicadorSelecionado: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    indicadorTexto: {
      color: colors.textInverse,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
    },

    vazio: {
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.xxxl,
      gap: spacing.md,
    },

    vazioTitulo: {
      color: colors.text,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
      textAlign: "center",
    },

    vazioDescricao: {
      color: colors.textSecondary,
      fontSize: typography.size.sm,
      textAlign: "center",
      lineHeight: 21,
    },

    botaoCadastrar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.sm,
      marginTop: spacing.sm,
    },

    botaoCadastrarTexto: {
      color: colors.textInverse,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },

    rodape: {
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
      gap: spacing.md,
    },

    resumoSelecao: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
    },

    selecionadasTexto: {
      color: colors.textSecondary,
      fontSize: typography.size.sm,
      textAlign: "center",
    },

    botaoConfirmar: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      padding: spacing.lg,
      gap: spacing.sm,
    },

    botaoDesabilitado: {
      opacity: 0.5,
    },

    botaoConfirmarTexto: {
      color: colors.textInverse,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },
  });
}

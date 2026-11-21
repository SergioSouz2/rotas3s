import { StyleSheet } from "react-native";

type ThemeColors = ReturnType<
  typeof import("@/hooks/useAppTheme").useAppTheme
>["colors"];

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    flex: {
      flex: 1,
    },

    carregando: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },

    erro: {
      color: colors.text,
      textAlign: "center",
    },

    conteudo: {
      padding: 20,
      paddingBottom: 48,
    },

    avatarContainer: {
      alignItems: "center",
      marginBottom: 32,
      gap: 8,
    },

    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },

    nomeUsuario: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
    },

    tipoPerfil: {
      color: colors.text,
      opacity: 0.65,
      fontSize: 12,
    },

    secaoTitulo: {
      color: colors.text,
      fontSize: 17,
      fontWeight: "700",
      marginBottom: 18,
    },

    formulario: {
      gap: 18,
    },

    campo: {
      gap: 8,
    },

    label: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },

    input: {
      backgroundColor: colors.surface,
      color: colors.text,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
    },

    aviso: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 24,
      padding: 14,
      borderRadius: 12,
      backgroundColor: colors.surface,
    },

    avisoTexto: {
      flex: 1,
      color: colors.text,
      opacity: 0.75,
      fontSize: 12,
      lineHeight: 18,
    },

    botaoSalvar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 14,
      marginTop: 24,
      minHeight: 54,
    },

    botaoDesabilitado: {
      opacity: 0.6,
    },

    botaoTexto: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },
  });
}

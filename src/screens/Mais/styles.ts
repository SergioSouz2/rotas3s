import { StyleSheet } from "react-native";

export function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scroll: {
      flex: 1,
    },

    conteudo: {
      padding: 20,
      paddingBottom: 40,
    },

    destaque: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 18,
      backgroundColor: colors.surface,
      marginBottom: 28,
      gap: 12,
    },

    destaqueTexto: {
      flex: 1,
    },

    destaqueTitulo: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
    },

    destaqueDescricao: {
      color: colors.text,
      opacity: 0.65,
      fontSize: 12,
      marginTop: 4,
    },

    secaoTitulo: {
      color: colors.text,
      fontSize: 17,
      fontWeight: "700",
      marginBottom: 16,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 10,
    },

    rodape: {
      textAlign: "center",
      color: colors.text,
      opacity: 0.5,
      marginTop: 32,
      fontSize: 12,
    },
  });
}

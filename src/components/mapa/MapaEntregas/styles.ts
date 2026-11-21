import { StyleSheet } from "react-native";

import type { AppTheme } from "@/theme";

export function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
      overflow: "hidden",
    },

    mapa: {
      flex: 1,
    },

    // Marcadores das entregas
    marcador: {
      alignItems: "center",
      justifyContent: "center",
    },

    marcadorNumero: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      borderWidth: 3,
      borderColor: colors.textInverse,
      alignItems: "center",
      justifyContent: "center",
    },

    numero: {
      color: colors.textInverse,
      fontSize: 12,
      fontWeight: "bold",
    },

    // Marcador da localização atual
    marcadorLocalizacao: {
      alignItems: "center",
      justifyContent: "center",
      width: 44,
      height: 44,
    },

    localizacaoCirculoExterno: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: "rgba(33, 150, 243, 0.20)",
      alignItems: "center",
      justifyContent: "center",
    },

    localizacaoCirculoInterno: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#2196F3",
      borderWidth: 3,
      borderColor: "#FFFFFF",
      elevation: 5,
    },

    // Botão para centralizar no GPS
    botaoLocalizacao: {
      position: "absolute",
      right: 16,
      bottom: 24,
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      elevation: 6,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.15,
      shadowRadius: 5,
    },

    botaoLocalizacaoDesabilitado: {
      opacity: 0.5,
    },

    // Indicador de carregamento do GPS
    carregandoLocalizacao: {
      alignItems: "center",
      justifyContent: "center",
    },
  });
}

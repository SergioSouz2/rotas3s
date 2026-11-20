import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mapaPlaceholder: {
    height: 185,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  mapaTexto: {
    fontSize: 13,
    color: "#64748b",
  },

  botaoLocalizacao: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#102f63",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
  },

  botaoLocalizacaoTexto: {
    color: "#102f63",
    fontSize: 13,
    fontWeight: "700",
  },
});

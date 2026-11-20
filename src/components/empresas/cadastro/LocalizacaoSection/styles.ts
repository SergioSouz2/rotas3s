import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mapaPlaceholder: {
    minHeight: 160,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },

  mapaTexto: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
  },

  informacoesLocalizacao: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },

  statusLocalizacao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16a34a",
    flex: 1,
  },

  coordenadasTexto: {
    fontSize: 12,
    color: "#64748b",
  },

  avisoTexto: {
    fontSize: 12,
    lineHeight: 18,
    color: "#64748b",
    marginTop: 4,
  },

  botaoLocalizacao: {
    minHeight: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  botaoLocalizacaoTexto: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
  },
});

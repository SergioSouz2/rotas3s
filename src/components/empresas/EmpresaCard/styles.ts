import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 14,
  },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icone: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  informacoes: {
    flex: 1,
    gap: 4,
  },
  nome: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  cnpj: {
    fontSize: 12,
    color: "#64748b",
  },
  enderecoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  endereco: {
    flex: 1,
    color: "#475569",
    fontSize: 13,
    lineHeight: 19,
  },
  rodape: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
  },
  localizacao: {
    fontSize: 12,
    fontWeight: "600",
  },
});

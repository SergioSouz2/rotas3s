import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: "center",
    gap: 12,
  },
  icone: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  titulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
  descricao: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 21,
  },
});

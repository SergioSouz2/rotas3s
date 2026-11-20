import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 8,
  },

  secaoTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },

  secaoDescricao: {
    fontSize: 11,
    lineHeight: 16,
    color: "#64748b",
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginTop: 2,
  },

  input: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: "#0f172a",
  },

  inputMultiline: {
    minHeight: 64,
    textAlignVertical: "top",
  },
});

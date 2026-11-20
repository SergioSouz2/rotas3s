import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },

  secaoTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },

  secaoDescricao: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748b",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginTop: 4,
  },

  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0f172a",
  },

  inputMultiline: {
    minHeight: 78,
    textAlignVertical: "top",
  },
});

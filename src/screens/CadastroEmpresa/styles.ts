import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  content: {
    flexGrow: 1,
  },

  body: {
    padding: 12,
    paddingBottom: 24,
    gap: 10,
  },

  botaoSalvar: {
    backgroundColor: "#16a34a",
    minHeight: 46,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 10,
  },

  botaoSalvarTexto: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});

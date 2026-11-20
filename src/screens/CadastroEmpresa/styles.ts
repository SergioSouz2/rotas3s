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
    padding: 20,
    paddingBottom: 48,
    gap: 18,
  },

  botaoSalvar: {
    backgroundColor: "#16a34a",
    minHeight: 54,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginBottom: 20,
  },

  botaoSalvarTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});

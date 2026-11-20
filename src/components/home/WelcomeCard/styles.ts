import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  info: {
    flex: 1,
  },

  welcome: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
  },

  nome: {
    fontSize: 22,
    fontWeight: "800",
    color: "#102f63",
  },

  cargo: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },

  statusAberto: {
    backgroundColor: "#dcfce7",
  },

  statusFechado: {
    backgroundColor: "#fee2e2",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  dotAberto: {
    backgroundColor: "#16a34a",
  },

  dotFechado: {
    backgroundColor: "#dc2626",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  textAberto: {
    color: "#15803d",
  },

  textFechado: {
    color: "#b91c1c",
  },
});

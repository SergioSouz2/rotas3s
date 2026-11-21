import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 14,
    minHeight: 88,
  },

  voltar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextos: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },

  headerTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.2,
  },

  headerSubtitulo: {
    fontSize: 12,
    fontWeight: "400",
    color: "#dcfce7",
    lineHeight: 18,
  },
});

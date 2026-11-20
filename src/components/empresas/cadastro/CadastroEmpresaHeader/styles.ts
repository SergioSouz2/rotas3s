import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    backgroundColor: "#102f63",
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  voltar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#234b7c",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextos: {
    flex: 1,
    gap: 4,
  },

  headerTitulo: {
    fontSize: 23,
    fontWeight: "800",
    color: "#ffffff",
  },

  headerSubtitulo: {
    fontSize: 12,
    color: "#cbd5e1",
  },
});

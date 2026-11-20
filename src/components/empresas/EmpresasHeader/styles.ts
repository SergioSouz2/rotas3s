import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#102f63",
    paddingHorizontal: 16,
    paddingTop: 55,
    paddingBottom: 20,
  },

  brand: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    width: 130,
    height: 70,
  },

  conteudo: {
    marginTop: 20,
    gap: 22,
  },

  titulos: {
    gap: 5,
  },

  titulo: {
    fontSize: 25,
    fontWeight: "800",
    color: "#ffffff",
  },

  subtitulo: {
    fontSize: 13,
    color: "#cbd5e1",
  },

  rodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  contadorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },

  contador: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "500",
  },

  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 11,
  },

  botaoTexto: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});

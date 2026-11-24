import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  cabecalho: {
    backgroundColor: "#001533",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  cabecalhoIcone: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#173A67",
    alignItems: "center",
    justifyContent: "center",
  },

  cabecalhoConteudo: {
    flex: 1,
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  subtitulo: {
    color: "#CBD5E1",
    fontSize: 13,
    marginTop: 4,
  },

  areaAbas: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
    padding: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },

  aba: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },

  abaAtiva: {
    backgroundColor: "#2563EB",
  },

  abaTexto: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
  },

  abaTextoAtivo: {
    color: "#FFFFFF",
  },

  lista: {
    flex: 1,
  },

  listaConteudo: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
  },

  carregamento: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },

  textoSecundario: {
    color: "#64748B",
    fontSize: 13,
  },

  estadoErro: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  erroTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  botaoTentarNovamente: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginTop: 8,
  },

  botaoTentarNovamenteTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});

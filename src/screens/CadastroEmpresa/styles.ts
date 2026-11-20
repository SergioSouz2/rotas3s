import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  content: {
    flexGrow: 1,
  },

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

  body: {
    padding: 20,
    paddingBottom: 48,
    gap: 18,
  },

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

  botaoBuscar: {
    backgroundColor: "#2563eb",
    borderRadius: 11,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  botaoBuscarTexto: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  mapaPlaceholder: {
    height: 185,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  mapaTexto: {
    fontSize: 13,
    color: "#64748b",
  },

  botaoLocalizacao: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#102f63",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
  },

  botaoLocalizacaoTexto: {
    color: "#102f63",
    fontSize: 13,
    fontWeight: "700",
  },

  observacoes: {
    minHeight: 100,
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

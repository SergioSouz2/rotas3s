import { diaTrabalhoRepository } from "@/database/repositories/diaTrabalhoRepository";
import { empresaRepository } from "@/database/repositories/empresaRepository";
import { entregaRepository } from "@/database/repositories/entregaRepository";
import { usuarioRepository } from "@/database/repositories/usuarioRepository";

import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Usuario = Awaited<ReturnType<typeof usuarioRepository.findAll>>[number];

type Empresa = Awaited<ReturnType<typeof empresaRepository.findAll>>[number];

type DiaTrabalho = Awaited<
  ReturnType<typeof diaTrabalhoRepository.findAll>
>[number];

type EntregaDetalhada = Awaited<
  ReturnType<typeof entregaRepository.findAllWithDetails>
>[number];

export default function HomeScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [entregas, setEntregas] = useState<EntregaDetalhada[]>([]);
  const [diasTrabalho, setDiasTrabalho] = useState<DiaTrabalho[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      const [dadosUsuarios, dadosEmpresas, dadosDiasTrabalho, dadosEntregas] =
        await Promise.all([
          usuarioRepository.findAll(),
          empresaRepository.findAll(),
          diaTrabalhoRepository.findAll(),
          entregaRepository.findAllWithDetails(),
        ]);

      setUsuarios(dadosUsuarios);
      setEmpresas(dadosEmpresas);
      setDiasTrabalho(dadosDiasTrabalho);
      setEntregas(dadosEntregas);

      console.log("[SQLITE] Usuários:", dadosUsuarios.length);
      console.log("[SQLITE] Empresas:", dadosEmpresas.length);
      console.log("[SQLITE] Dias de trabalho:", dadosDiasTrabalho.length);
      console.log("[SQLITE] Entregas:", dadosEntregas.length);
    } catch (error) {
      console.error("[SQLITE] Erro ao consultar dados:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao consultar SQLite.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Text style={styles.titulo}>ROTAS3S</Text>
          <Text style={styles.subtitulo}>Gerenciamento de entregas</Text>
        </View>

        {/* RESUMO */}
        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoNumero}>{usuarios.length}</Text>
            <Text style={styles.resumoLabel}>Usuários</Text>
          </View>

          <View style={styles.resumoCard}>
            <Text style={styles.resumoNumero}>{empresas.length}</Text>
            <Text style={styles.resumoLabel}>Empresas</Text>
          </View>
        </View>

        {/* BOTÃO ATUALIZAR */}
        <Pressable
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={() => void carregarDados()}
          disabled={carregando}
        >
          <Text style={styles.botaoTexto}>
            {carregando ? "Carregando..." : "Atualizar dados"}
          </Text>
        </Pressable>

        {/* CARREGAMENTO */}
        {carregando && <ActivityIndicator size="large" color="#2563eb" />}

        {/* ERRO */}
        {erro && (
          <View style={styles.erroCard}>
            <Text style={styles.erroTexto}>{erro}</Text>
          </View>
        )}

        {!carregando && !erro && (
          <>
            {/* USUÁRIOS */}
            <Text style={styles.secaoTitulo}>Usuários cadastrados</Text>

            {usuarios.length === 0 ? (
              <Text style={styles.vazio}>Nenhum usuário encontrado.</Text>
            ) : (
              usuarios.map((usuario) => (
                <View key={usuario.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardNome}>{usuario.nome}</Text>

                    <Text style={styles.id}>#{usuario.id}</Text>
                  </View>

                  <Text style={styles.info}>E-mail: {usuario.email}</Text>

                  <Text style={styles.info}>
                    Telefone: {usuario.telefone ?? "Não informado"}
                  </Text>

                  <Text style={styles.info}>
                    CPF: {usuario.cpf ?? "Não informado"}
                  </Text>
                </View>
              ))
            )}

            {/* EMPRESAS */}
            <Text style={styles.secaoTitulo}>Empresas cadastradas</Text>

            {empresas.length === 0 ? (
              <Text style={styles.vazio}>Nenhuma empresa encontrada.</Text>
            ) : (
              empresas.map((empresa) => (
                <View key={empresa.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardNome}>{empresa.nome}</Text>

                    <Text style={styles.id}>#{empresa.id}</Text>
                  </View>

                  <Text style={styles.info}>CNPJ: {empresa.cnpj}</Text>

                  <Text style={styles.info}>
                    Telefone: {empresa.telefone ?? "Não informado"}
                  </Text>

                  <Text style={styles.info}>Endereço: {empresa.endereco}</Text>

                  <Text style={styles.info}>
                    Latitude: {empresa.latitude ?? "Não informada"}
                  </Text>

                  <Text style={styles.info}>
                    Longitude: {empresa.longitude ?? "Não informada"}
                  </Text>
                </View>
              ))
            )}

            {/* DIAS DE TRABALHO */}
            <Text style={styles.secaoTitulo}>
              Histórico de trabalho ({diasTrabalho.length})
            </Text>

            {diasTrabalho.length === 0 ? (
              <Text style={styles.vazio}>
                Nenhum dia de trabalho encontrado.
              </Text>
            ) : (
              diasTrabalho.map((dia) => (
                <View key={dia.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardNome}>{dia.data}</Text>

                    <Text style={styles.id}>#{dia.id}</Text>
                  </View>

                  <Text style={styles.info}>Usuário ID: {dia.usuarioId}</Text>

                  <Text style={styles.info}>Status: {dia.status}</Text>

                  <Text style={styles.info}>
                    Início: {dia.inicioEm ?? "Não iniciado"}
                  </Text>

                  <Text style={styles.info}>
                    Fim: {dia.fimEm ?? "Não finalizado"}
                  </Text>

                  <Text style={styles.info}>
                    Observações: {dia.observacoes ?? "Nenhuma"}
                  </Text>
                </View>
              ))
            )}

            {/* ENTREGAS */}
            <Text style={styles.secaoTitulo}>
              Entregas cadastradas ({entregas.length})
            </Text>

            {entregas.length === 0 ? (
              <Text style={styles.vazio}>Nenhuma entrega encontrada.</Text>
            ) : (
              entregas.map((entrega) => (
                <View key={entrega.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardNome}>{entrega.empresaNome}</Text>

                    <Text style={styles.id}>#{entrega.id}</Text>
                  </View>

                  <Text style={styles.info}>Data: {entrega.dataTrabalho}</Text>

                  <Text style={styles.info}>Status: {entrega.status}</Text>

                  <Text style={styles.info}>CNPJ: {entrega.empresaCnpj}</Text>

                  <Text style={styles.info}>
                    Endereço: {entrega.endereco ?? "Não informado"}
                  </Text>

                  <Text style={styles.info}>
                    Descrição: {entrega.descricao ?? "Nenhuma"}
                  </Text>

                  <Text style={styles.info}>
                    Realizada em: {entrega.realizadaEm ?? "Pendente"}
                  </Text>
                </View>
              ))
            )}
          </>
        )}

        <Text style={styles.rodape}>ROTAS3S • Dados armazenados no SQLite</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  conteudo: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
    gap: 16,
  },

  header: {
    marginBottom: 8,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f172a",
  },

  subtitulo: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  resumoContainer: {
    flexDirection: "row",
    gap: 12,
  },

  resumoCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 2,
  },

  resumoNumero: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563eb",
  },

  resumoLabel: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },

  botao: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  botaoTexto: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  secaoTitulo: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 8,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    gap: 8,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardNome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },

  id: {
    fontSize: 12,
    color: "#94a3b8",
  },

  info: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },

  erroCard: {
    backgroundColor: "#fee2e2",
    padding: 14,
    borderRadius: 12,
  },

  erroTexto: {
    color: "#991b1b",
    fontSize: 14,
  },

  vazio: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    padding: 20,
  },

  rodape: {
    fontSize: 12,
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 20,
  },
});

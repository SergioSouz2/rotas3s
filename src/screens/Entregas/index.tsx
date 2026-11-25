import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { HomeHeader } from "@/components/home/HomeHeader";
import { empresaRepository } from "@/database/repositories/empresaRepository";
import { entregaRepository } from "@/database/repositories/entregaRepository";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useHomeData } from "@/hooks/useHomeData";

import { createStyles } from "./styles";

type Entrega = Awaited<
  ReturnType<typeof entregaRepository.findByDiaTrabalhoId>
>[number];

type StatusEntrega = {
  texto: string;
  icone: keyof typeof Ionicons.glyphMap;
  cor: string;
};

type NomesEmpresas = Record<number, string>;

export function EntregasScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;

  const {
    diaTrabalho,
    carregando: carregandoJornada,
    recarregarJornada,
  } = useHomeData();

  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [nomesEmpresas, setNomesEmpresas] = useState<NomesEmpresas>({});

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregarEntregas = useCallback(async () => {
    try {
      setErro(null);

      if (!diaTrabalho?.id) {
        setEntregas([]);
        setNomesEmpresas({});
        return;
      }

      const resultado = await entregaRepository.findByDiaTrabalhoId(
        diaTrabalho.id,
      );

      // Busca apenas as empresas associadas às entregas.
      const idsEmpresas = [
        ...new Set(resultado.map((entrega) => entrega.empresaId)),
      ];

      const empresas = await Promise.all(
        idsEmpresas.map(async (empresaId) => {
          const empresa = await empresaRepository.findById(empresaId, {
            incluirExcluidas: true,
          });

          return {
            id: empresaId,
            nome: empresa?.nome?.trim() || "Empresa não encontrada",
          };
        }),
      );

      const mapaNomes: NomesEmpresas = {};

      for (const empresa of empresas) {
        mapaNomes[empresa.id] = empresa.nome;
      }

      setNomesEmpresas(mapaNomes);
      setEntregas(resultado);
    } catch (error) {
    } finally {
      setCarregando(false);
    }
  }, [diaTrabalho?.id]);

  useFocusEffect(
    useCallback(() => {
      void recarregarJornada();
    }, [recarregarJornada]),
  );

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      void carregarEntregas();
    }, [carregarEntregas]),
  );

  const atualizar = useCallback(async () => {
    setAtualizando(true);

    try {
      await recarregarJornada();
      await carregarEntregas();
    } finally {
      setAtualizando(false);
    }
  }, [recarregarJornada, carregarEntregas]);

  const jornadaAberta = diaTrabalho?.status === "aberto";

  function abrirNovaEntrega() {
    if (!jornadaAberta) {
      Alert.alert(
        "Jornada não iniciada",
        "Inicie uma jornada para registrar entregas.",
      );
      return;
    }

    router.push("/entregas/nova");
  }

  function abrirDetalhesEntrega(id: number) {
    router.push({
      pathname: "/entregas/[id]",
      params: {
        id: String(id),
      },
    });
  }

  function confirmarExclusao(id: number) {
    if (!jornadaAberta) {
      Alert.alert(
        "Jornada encerrada",
        "Não é possível excluir entregas de uma jornada finalizada.",
      );
      return;
    }

    if (excluindoId !== null) {
      return;
    }

    Alert.alert(
      "Excluir entrega",
      `Deseja realmente excluir a entrega #${id}?\n\nEssa ação não poderá ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            void excluirEntrega(id);
          },
        },
      ],
    );
  }

  async function excluirEntrega(id: number) {
    if (excluindoId !== null) {
      return;
    }

    try {
      setExcluindoId(id);

      const resultado = await entregaRepository.delete(id);

      if (!resultado) {
        throw new Error("Não foi possível excluir a entrega.");
      }

      await carregarEntregas();

      Alert.alert(
        "Entrega excluída",
        `A entrega #${id} foi excluída com sucesso.`,
      );
    } catch (error) {
      Alert.alert(
        "Erro ao excluir",
        "Não foi possível excluir a entrega. Tente novamente.",
      );
    } finally {
      setExcluindoId(null);
    }
  }

  function obterStatus(status: string): StatusEntrega {
    switch (status) {
      case "pendente":
        return {
          texto: "Pendente",
          icone: "time-outline",
          cor: colors.warning,
        };

      case "em_rota":
        return {
          texto: "Saiu para entrega",
          icone: "car-outline",
          cor: colors.primary,
        };

      case "realizada":
        return {
          texto: "Finalizada",
          icone: "checkmark-circle-outline",
          cor: colors.success,
        };

      default:
        return {
          texto: status,
          icone: "help-circle-outline",
          cor: colors.textSecondary,
        };
    }
  }

  const estatisticas = useMemo(() => {
    const total = entregas.length;

    const pendentes = entregas.filter(
      (entrega) => entrega.status === "pendente",
    ).length;

    const emRota = entregas.filter(
      (entrega) => entrega.status === "em_rota",
    ).length;

    const finalizadas = entregas.filter(
      (entrega) => entrega.status === "realizada",
    ).length;

    const progresso = total > 0 ? Math.round((finalizadas / total) * 100) : 0;

    return {
      total,
      pendentes,
      emRota,
      finalizadas,
      progresso,
    };
  }, [entregas]);

  const carregamentoInicial = carregandoJornada || carregando;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => {
              void atualizar();
            }}
            colors={[colors.primary]}
          />
        }
      >
        <HomeHeader />

        <View style={styles.body}>
          {/* CABEÇALHO */}
          <View style={styles.tituloLinha}>
            <View style={styles.tituloContainer}>
              <Text style={styles.titulo}>Entregas da jornada</Text>

              <Text style={styles.subtitulo}>
                Acompanhe suas entregas do dia
              </Text>
            </View>

            {jornadaAberta && (
              <Pressable
                style={({ pressed }) => [
                  styles.botaoNovaEntrega,
                  pressed && styles.botaoPressionado,
                ]}
                onPress={abrirNovaEntrega}
              >
                <Ionicons name="add" size={20} color={colors.textInverse} />

                <Text style={styles.botaoNovaEntregaTexto}>Nova</Text>
              </Pressable>
            )}
          </View>

          {erro && <Text style={styles.erro}>{erro}</Text>}

          {carregamentoInicial ? (
            <View style={styles.estadoContainer}>
              <ActivityIndicator size="large" color={colors.primary} />

              <Text style={styles.estadoTexto}>Carregando entregas...</Text>
            </View>
          ) : !diaTrabalho ? (
            <View style={styles.estadoContainer}>
              <Ionicons
                name="calendar-outline"
                size={44}
                color={colors.textSecondary}
              />

              <Text style={styles.estadoTitulo}>Nenhuma jornada iniciada</Text>

              <Text style={styles.estadoTexto}>
                Inicie sua jornada na tela inicial para registrar entregas.
              </Text>
            </View>
          ) : (
            <>
              {/* PROGRESSO */}
              <View style={styles.cardProgresso}>
                <View style={styles.progressoCabecalho}>
                  <Text style={styles.cardTitulo}>Progresso da jornada</Text>

                  <Text style={styles.progressoValor}>
                    {estatisticas.progresso}%
                  </Text>
                </View>

                <View style={styles.barraFundo}>
                  <View
                    style={[
                      styles.barraPreenchimento,
                      {
                        width: `${estatisticas.progresso}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.progressoDescricao}>
                  {estatisticas.finalizadas} de {estatisticas.total} entregas
                  finalizadas
                </Text>
              </View>

              {/* ESTATÍSTICAS */}
              <View style={styles.estatisticas}>
                <View style={styles.cardEstatistica}>
                  <Text style={styles.estatisticaValor}>
                    {estatisticas.total}
                  </Text>

                  <Text style={styles.estatisticaLabel}>Total</Text>
                </View>

                <View style={styles.cardEstatistica}>
                  <Text
                    style={[styles.estatisticaValor, { color: colors.warning }]}
                  >
                    {estatisticas.pendentes}
                  </Text>

                  <Text style={styles.estatisticaLabel}>Pendentes</Text>
                </View>

                <View style={styles.cardEstatistica}>
                  <Text
                    style={[styles.estatisticaValor, { color: colors.primary }]}
                  >
                    {estatisticas.emRota}
                  </Text>

                  <Text style={styles.estatisticaLabel}>Em rota</Text>
                </View>

                <View style={styles.cardEstatistica}>
                  <Text
                    style={[styles.estatisticaValor, { color: colors.success }]}
                  >
                    {estatisticas.finalizadas}
                  </Text>

                  <Text style={styles.estatisticaLabel}>Finalizadas</Text>
                </View>
              </View>

              {/* LISTA DE ENTREGAS */}
              <View style={styles.secaoCabecalho}>
                <Text style={styles.secaoTitulo}>Entregas registradas</Text>

                <Text style={styles.secaoQuantidade}>{estatisticas.total}</Text>
              </View>

              {entregas.length === 0 ? (
                <View style={styles.estadoContainer}>
                  <Ionicons
                    name="cube-outline"
                    size={44}
                    color={colors.textSecondary}
                  />

                  <Text style={styles.estadoTitulo}>
                    Nenhuma entrega registrada
                  </Text>

                  <Text style={styles.estadoTexto}>
                    {jornadaAberta
                      ? "Toque em Nova para adicionar entregas."
                      : "Esta jornada não possui entregas registradas."}
                  </Text>
                </View>
              ) : (
                entregas.map((entrega) => {
                  const status = obterStatus(entrega.status);

                  const excluindo = excluindoId === entrega.id;

                  const nomeEmpresa =
                    nomesEmpresas[entrega.empresaId] ??
                    "Empresa não encontrada";

                  return (
                    <View key={entrega.id} style={styles.cardEntrega}>
                      {/* ÁREA CLICÁVEL */}
                      <Pressable
                        style={({ pressed }) => [
                          styles.entregaConteudo,
                          pressed && styles.cardEntregaPressionado,
                        ]}
                        onPress={() => abrirDetalhesEntrega(entrega.id)}
                      >
                        <View style={styles.entregaCabecalho}>
                          <View style={styles.entregaIdentificacao}>
                            <Ionicons
                              name="business-outline"
                              size={20}
                              color={colors.primary}
                            />

                            {/* NOME REAL DA EMPRESA */}
                            <Text style={styles.entregaTitulo}>
                              {nomeEmpresa}
                            </Text>
                          </View>

                          <View style={styles.statusContainer}>
                            <Ionicons
                              name={status.icone}
                              size={16}
                              color={status.cor}
                            />

                            <Text
                              style={[
                                styles.entregaStatus,
                                { color: status.cor },
                              ]}
                            >
                              {status.texto}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.entregaEndereco}>
                          {entrega.endereco || "Endereço não informado"}
                        </Text>

                        {entrega.descricao ? (
                          <Text style={styles.entregaDescricao}>
                            {entrega.descricao}
                          </Text>
                        ) : null}
                      </Pressable>

                      {/* RODAPÉ */}
                      <View style={styles.entregaRodape}>
                        <Pressable
                          style={styles.verDetalhes}
                          onPress={() => abrirDetalhesEntrega(entrega.id)}
                        >
                          <Text style={styles.verDetalhesTexto}>
                            Ver detalhes
                          </Text>

                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={colors.primary}
                          />
                        </Pressable>

                        {jornadaAberta && (
                          <Pressable
                            style={({ pressed }) => [
                              styles.botaoExcluir,
                              pressed && styles.botaoPressionado,
                            ]}
                            onPress={() => confirmarExclusao(entrega.id)}
                            disabled={excluindoId !== null}
                            accessibilityRole="button"
                            accessibilityLabel={`Excluir entrega ${entrega.id}`}
                          >
                            {excluindo ? (
                              <ActivityIndicator
                                size="small"
                                color={colors.danger}
                              />
                            ) : (
                              <Ionicons
                                name="trash-outline"
                                size={21}
                                color={colors.danger}
                              />
                            )}
                          </Pressable>
                        )}
                      </View>
                    </View>
                  );
                })
              )}

              {diaTrabalho.status !== "aberto" && (
                <View style={styles.avisoContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={colors.warning}
                  />

                  <Text style={styles.aviso}>
                    Jornada encerrada. As entregas estão disponíveis apenas para
                    consulta.
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

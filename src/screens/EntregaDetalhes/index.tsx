import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { empresaRepository } from "@/database/repositories/empresaRepository";
import { entregaRepository } from "@/database/repositories/entregaRepository";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useHomeData } from "@/hooks/useHomeData";

import { createStyles } from "./styles";

type Entrega = NonNullable<
  Awaited<ReturnType<typeof entregaRepository.findById>>
>;

type Empresa = NonNullable<
  Awaited<ReturnType<typeof empresaRepository.findById>>
>;

type StatusEntrega = {
  titulo: string;
  descricao: string;
  icone: keyof typeof Ionicons.glyphMap;
  cor: string;
};

export function DetalheEntregaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;

  const insets = useSafeAreaInsets();

  const { diaTrabalho, recarregarJornada } = useHomeData();

  const [entrega, setEntrega] = useState<Entrega | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const entregaId = Number(id);

  const idValido = Number.isInteger(entregaId) && entregaId > 0;

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      if (!idValido) {
        throw new Error("ID_INVALIDO");
      }

      const registro = await entregaRepository.findById(entregaId);

      if (!registro) {
        setEntrega(null);
        setEmpresa(null);
        return;
      }

      const dadosEmpresa = await empresaRepository.findById(registro.empresaId);

      setEntrega(registro);
      setEmpresa(dadosEmpresa);
    } catch (error) {
      console.error("[ENTREGA DETALHES] Erro ao carregar:", error);

      setErro("Não foi possível carregar os detalhes da entrega.");
    } finally {
      setCarregando(false);
    }
  }, [entregaId, idValido]);

  useFocusEffect(
    useCallback(() => {
      void carregarDados();
      void recarregarJornada();
    }, [carregarDados, recarregarJornada]),
  );

  const jornadaAberta =
    diaTrabalho?.id === entrega?.diaTrabalhoId &&
    diaTrabalho?.status === "aberto";

  const statusAtual = entrega?.status ?? "pendente";

  const statusInfo: StatusEntrega = useMemo(() => {
    switch (statusAtual) {
      case "pendente":
        return {
          titulo: "Pendente",
          descricao: "Esta entrega ainda não foi iniciada.",
          icone: "time-outline",
          cor: colors.warning,
        };

      case "em_rota":
        return {
          titulo: "Saiu para entrega",
          descricao: "A entrega está em andamento.",
          icone: "car-outline",
          cor: colors.primary,
        };

      case "realizada":
        return {
          titulo: "Finalizada",
          descricao: "Esta entrega foi concluída.",
          icone: "checkmark-circle-outline",
          cor: colors.success,
        };

      default:
        return {
          titulo: "Status desconhecido",
          descricao: "Status não reconhecido.",
          icone: "help-circle-outline",
          cor: colors.textSecondary,
        };
    }
  }, [statusAtual, colors]);

  const indiceEtapa =
    statusAtual === "realizada" ? 2 : statusAtual === "em_rota" ? 1 : 0;

  const etapas = [
    { id: "pendente", titulo: "Pendente" },
    { id: "em_rota", titulo: "Saiu para entrega" },
    { id: "realizada", titulo: "Finalizada" },
  ];

  function formatarData(data: string | null) {
    if (!data) {
      return "Não informada";
    }

    const valor = new Date(data);

    if (Number.isNaN(valor.getTime())) {
      return "Data inválida";
    }

    return valor.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function alterarStatus() {
    if (!entrega || processando || !jornadaAberta) {
      return;
    }

    try {
      setProcessando(true);

      let resultado: Entrega | null = null;

      if (entrega.status === "pendente") {
        resultado = await entregaRepository.marcarComoSaiuParaEntrega(
          entrega.id,
        );
      } else if (entrega.status === "em_rota") {
        resultado = await entregaRepository.marcarComoRealizada(entrega.id);
      } else {
        return;
      }

      if (!resultado) {
        throw new Error("STATUS_NAO_ATUALIZADO");
      }

      setEntrega(resultado);

      Alert.alert(
        "Status atualizado",
        resultado.status === "em_rota"
          ? "A entrega saiu para entrega."
          : "A entrega foi finalizada com sucesso.",
      );
    } catch (error) {
      console.error("[ENTREGA DETALHES] Erro ao atualizar:", error);

      Alert.alert("Erro", "Não foi possível atualizar o status da entrega.");

      await carregarDados();
    } finally {
      setProcessando(false);
    }
  }

  function confirmarAlteracao() {
    if (!entrega || !jornadaAberta || processando) {
      return;
    }

    if (entrega.status === "pendente") {
      Alert.alert(
        "Sair para entrega",
        "Deseja informar que esta entrega saiu para entrega?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Confirmar",
            onPress: () => {
              void alterarStatus();
            },
          },
        ],
      );
    } else if (entrega.status === "em_rota") {
      Alert.alert(
        "Finalizar entrega",
        "Confirma que esta entrega foi concluída?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Finalizar",
            onPress: () => {
              void alterarStatus();
            },
          },
        ],
      );
    }
  }

  async function abrirMapa(aplicativo: "google" | "waze") {
    if (!entrega) {
      return;
    }

    const endereco = entrega.endereco || empresa?.endereco;

    const latitude = empresa?.latitude;
    const longitude = empresa?.longitude;

    const possuiCoordenadas =
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude);

    if (!possuiCoordenadas && !endereco) {
      Alert.alert(
        "Localização indisponível",
        "Esta entrega não possui endereço ou coordenadas.",
      );
      return;
    }

    let url: string;

    if (aplicativo === "google") {
      const destino = possuiCoordenadas
        ? `${latitude},${longitude}`
        : endereco!;

      url =
        "https://www.google.com/maps/dir/?api=1&destination=" +
        encodeURIComponent(destino);
    } else {
      if (!possuiCoordenadas) {
        Alert.alert(
          "Coordenadas necessárias",
          "Cadastre a localização da empresa para navegar pelo Waze.",
        );
        return;
      }

      url = `https://waze.com/ul?ll=${latitude},${longitude}` + "&navigate=yes";
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("[ENTREGA DETALHES] Erro ao abrir mapa:", error);

      Alert.alert("Erro", "Não foi possível abrir o mapa.");
    }
  }

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.botaoVoltar}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitulo}>Detalhes da entrega</Text>

        <View style={styles.headerEspaco} />
      </View>

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.textoSecundario}>Carregando entrega...</Text>
        </View>
      ) : erro || !entrega ? (
        <View style={styles.centro}>
          <Ionicons
            name="alert-circle-outline"
            size={44}
            color={colors.warning}
          />

          <Text style={styles.titulo}>{erro || "Entrega não encontrada"}</Text>

          <Pressable
            style={styles.botaoSecundario}
            onPress={() => router.back()}
          >
            <Text style={styles.botaoSecundarioTexto}>Voltar</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.conteudo}
          >
            {/* STATUS ATUAL */}
            <View style={styles.card}>
              <View style={styles.linha}>
                <View style={styles.flex}>
                  <Text style={styles.rotulo}>ENTREGA #{entrega.id}</Text>

                  <Text style={styles.titulo}>
                    {empresa?.nome || "Empresa não encontrada"}
                  </Text>
                </View>

                <Ionicons
                  name={statusInfo.icone}
                  size={30}
                  color={statusInfo.cor}
                />
              </View>

              <Text style={[styles.statusTexto, { color: statusInfo.cor }]}>
                {statusInfo.titulo}
              </Text>

              <Text style={styles.textoSecundario}>{statusInfo.descricao}</Text>
            </View>

            {/* ETAPAS */}
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Etapas da entrega</Text>

              {etapas.map((etapa, index) => {
                const concluida = index <= indiceEtapa;

                return (
                  <View key={etapa.id} style={styles.etapa}>
                    <Ionicons
                      name={concluida ? "checkmark-circle" : "ellipse-outline"}
                      size={24}
                      color={concluida ? colors.success : colors.textSecondary}
                    />

                    <Text
                      style={[
                        styles.etapaTexto,
                        concluida && {
                          color: colors.text,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {etapa.titulo}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* EMPRESA */}
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Informações da empresa</Text>

              <Text style={styles.rotulo}>Nome</Text>

              <Text style={styles.valor}>
                {empresa?.nome || "Não informado"}
              </Text>

              <Text style={styles.rotulo}>CNPJ</Text>

              <Text style={styles.valor}>
                {empresa?.cnpj || "Não informado"}
              </Text>

              <Text style={styles.rotulo}>Endereço</Text>

              <Text style={styles.valor}>
                {entrega.endereco || empresa?.endereco || "Não informado"}
              </Text>
            </View>

            {/* MAPAS */}
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Navegação</Text>

              <View style={styles.acoesMapa}>
                <Pressable
                  style={styles.botaoMapa}
                  onPress={() => {
                    void abrirMapa("google");
                  }}
                >
                  <Ionicons
                    name="map-outline"
                    size={20}
                    color={colors.primary}
                  />

                  <Text style={styles.botaoMapaTexto}>Google Maps</Text>
                </Pressable>

                <Pressable
                  style={styles.botaoMapa}
                  onPress={() => {
                    void abrirMapa("waze");
                  }}
                >
                  <Ionicons
                    name="navigate-outline"
                    size={20}
                    color={colors.primary}
                  />

                  <Text style={styles.botaoMapaTexto}>Waze</Text>
                </Pressable>
              </View>
            </View>

            {/* OBSERVAÇÕES */}
            {entrega.descricao ? (
              <View style={styles.card}>
                <Text style={styles.cardTitulo}>Observações</Text>

                <Text style={styles.valor}>{entrega.descricao}</Text>
              </View>
            ) : null}

            {/* FINALIZAÇÃO */}
            {entrega.status === "realizada" && (
              <View style={styles.card}>
                <Text style={styles.cardTitulo}>Entrega finalizada</Text>

                <View style={styles.linha}>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.success}
                  />

                  <Text style={styles.valor}>Concluída com sucesso</Text>
                </View>

                <Text style={styles.rotulo}>Data e horário da conclusão</Text>

                <Text style={styles.valor}>
                  {formatarData(entrega.realizadaEm)}
                </Text>
              </View>
            )}

            {!jornadaAberta && (
              <Text style={styles.aviso}>
                Esta entrega está disponível somente para consulta porque a
                jornada não está aberta.
              </Text>
            )}
          </ScrollView>

          {/* BOTÃO DE ALTERAÇÃO */}
          {jornadaAberta &&
            (entrega.status === "pendente" || entrega.status === "em_rota") && (
              <View
                style={[
                  styles.rodape,
                  {
                    paddingBottom: Math.max(insets.bottom, 0) + 16,
                  },
                ]}
              >
                <Pressable
                  style={[
                    styles.botaoPrincipal,
                    processando && styles.botaoDesabilitado,
                  ]}
                  onPress={confirmarAlteracao}
                  disabled={processando}
                >
                  {processando ? (
                    <ActivityIndicator color={colors.textInverse} />
                  ) : (
                    <>
                      <Ionicons
                        name={
                          entrega.status === "pendente"
                            ? "car-outline"
                            : "checkmark-circle-outline"
                        }
                        size={22}
                        color={colors.textInverse}
                      />

                      <Text style={styles.botaoPrincipalTexto}>
                        {entrega.status === "pendente"
                          ? "Sair para entrega"
                          : "Finalizar entrega"}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}
        </>
      )}
    </View>
  );
}

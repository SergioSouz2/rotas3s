import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { useSelecaoEntregas } from "@/contexts/SelecaoEntregasContext";
import { empresaRepository } from "@/database/repositories/empresaRepository";
import { entregaRepository } from "@/database/repositories/entregaRepository";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useHomeData } from "@/hooks/useHomeData";

import { createStyles } from "./styles";

type Empresa = Awaited<ReturnType<typeof empresaRepository.findAll>>[number];

export function SelecaoEntregasScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;

  const insets = useSafeAreaInsets();

  const {
    empresasSelecionadas,
    adicionarEmpresa,
    removerEmpresa,
    limparSelecao,
    totalSelecionadas,
  } = useSelecaoEntregas();

  const { diaTrabalho, recarregarJornada } = useHomeData();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarEmpresas = useCallback(async () => {
    try {
      setErro(null);

      const resultado = await empresaRepository.findAll();

      setEmpresas(resultado);
    } catch (error) {
      setErro("Não foi possível carregar as empresas.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);

      void carregarEmpresas();
      void recarregarJornada();
    }, [carregarEmpresas, recarregarJornada]),
  );

  const cnpjPesquisado = useMemo(() => busca.replace(/\D/g, ""), [busca]);

  const cnpjCompleto = cnpjPesquisado.length === 14;

  const empresasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return empresas;
    }

    return empresas.filter((empresa) => {
      const nome = empresa.nome.toLowerCase();

      const razaoSocial = empresa.razaoSocial?.toLowerCase() ?? "";

      const nomeFantasia = empresa.nomeFantasia?.toLowerCase() ?? "";

      const cnpj = empresa.cnpj.replace(/\D/g, "");

      return (
        nome.includes(termo) ||
        razaoSocial.includes(termo) ||
        nomeFantasia.includes(termo) ||
        (cnpjPesquisado.length > 0 && cnpj.includes(cnpjPesquisado))
      );
    });
  }, [empresas, busca, cnpjPesquisado]);

  const cnpjJaCadastrado = useMemo(() => {
    if (!cnpjCompleto) {
      return false;
    }

    return empresas.some(
      (empresa) => empresa.cnpj.replace(/\D/g, "") === cnpjPesquisado,
    );
  }, [empresas, cnpjPesquisado, cnpjCompleto]);

  const podeCadastrar = cnpjCompleto && !cnpjJaCadastrado;

  function alternarSelecao(empresaId: number) {
    if (salvando) {
      return;
    }

    if (empresasSelecionadas.includes(empresaId)) {
      removerEmpresa(empresaId);
    } else {
      adicionarEmpresa(empresaId);
    }
  }

  function cadastrarEmpresa() {
    if (!podeCadastrar || salvando) {
      return;
    }

    Keyboard.dismiss();

    router.push({
      pathname: "/empresas/nova",
      params: {
        cnpj: cnpjPesquisado,
        origem: "entregas",
      },
    });
  }

  async function confirmarSelecao() {
    if (salvando) {
      return;
    }

    if (empresasSelecionadas.length === 0) {
      Alert.alert(
        "Nenhuma empresa selecionada",
        "Selecione pelo menos uma empresa.",
      );
      return;
    }

    if (!diaTrabalho?.id || diaTrabalho.status !== "aberto") {
      Alert.alert(
        "Jornada não iniciada",
        "Inicie uma jornada antes de adicionar entregas.",
      );
      return;
    }

    try {
      setSalvando(true);
      Keyboard.dismiss();

      const entregasCriadas = await entregaRepository.createMany(
        diaTrabalho.id,
        empresasSelecionadas,
      );

      limparSelecao();

      Alert.alert(
        "Entregas registradas!",
        `${entregasCriadas.length} entrega(s) adicionada(s) à jornada.`,
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(tab)/entregas");
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Erro ao salvar",
        "Não foi possível registrar as entregas. Sua seleção foi mantida para tentar novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  function renderizarEmpresa({ item }: { item: Empresa }) {
    const indice = empresasSelecionadas.indexOf(item.id);
    const selecionada = indice !== -1;

    return (
      <Pressable
        style={[styles.empresaCard, selecionada && styles.empresaSelecionada]}
        onPress={() => alternarSelecao(item.id)}
        disabled={salvando}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: selecionada,
        }}
      >
        <View style={styles.empresaInformacoes}>
          <Text style={styles.empresaNome} numberOfLines={2}>
            {item.nome}
          </Text>

          <Text style={styles.empresaCnpj}>{item.cnpj}</Text>

          <Text style={styles.empresaEndereco} numberOfLines={2}>
            {item.endereco || "Endereço não informado"}
          </Text>
        </View>

        <View
          style={[styles.indicador, selecionada && styles.indicadorSelecionado]}
        >
          {selecionada ? (
            <Text style={styles.indicadorTexto}>{indice + 1}</Text>
          ) : (
            <Ionicons name="add" size={20} color={colors.textSecondary} />
          )}
        </View>
      </Pressable>
    );
  }

  const jornadaAberta = diaTrabalho?.status === "aberto";

  const confirmarDesabilitado =
    totalSelecionadas === 0 ||
    salvando ||
    carregando ||
    !!erro ||
    !jornadaAberta;

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Selecionar entregas"
        subtitulo="Escolha as empresas na ordem desejada"
        onVoltar={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/(tab)/entregas");
          }
        }}
      />

      <View style={styles.content}>
        <View style={styles.buscaContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textSecondary}
          />

          <TextInput
            style={styles.buscaInput}
            placeholder="Buscar empresa ou CNPJ"
            placeholderTextColor={colors.textSecondary}
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            editable={!salvando}
          />

          {busca.length > 0 && (
            <Pressable
              onPress={() => setBusca("")}
              disabled={salvando}
              hitSlop={10}
              accessibilityLabel="Limpar pesquisa"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.secaoCabecalho}>
          <Text style={styles.secaoTitulo}>Empresas cadastradas</Text>

          <Text style={styles.contador}>{empresasFiltradas.length}</Text>
        </View>

        {carregando ? (
          <View style={styles.carregamento}>
            <ActivityIndicator size="large" color={colors.primary} />

            <Text style={styles.carregamentoTexto}>Carregando empresas...</Text>
          </View>
        ) : erro ? (
          <View style={styles.vazio}>
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={colors.danger}
            />

            <Text style={styles.vazioTitulo}>Erro ao carregar empresas</Text>

            <Text style={styles.vazioDescricao}>{erro}</Text>

            <Pressable
              style={styles.botaoCadastrar}
              onPress={() => {
                setCarregando(true);
                void carregarEmpresas();
              }}
            >
              <Text style={styles.botaoCadastrarTexto}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={empresasFiltradas}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderizarEmpresa}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={
              <View style={styles.vazio}>
                <Ionicons
                  name="business-outline"
                  size={44}
                  color={colors.textSecondary}
                />

                <Text style={styles.vazioTitulo}>
                  {busca.trim()
                    ? "Empresa não encontrada"
                    : "Nenhuma empresa cadastrada"}
                </Text>

                <Text style={styles.vazioDescricao}>
                  {podeCadastrar
                    ? "Este CNPJ não está cadastrado. Você pode cadastrar a empresa para adicioná-la às suas entregas."
                    : busca.trim()
                      ? "Nenhuma empresa corresponde à pesquisa. Informe um CNPJ completo para cadastrar uma nova empresa."
                      : "Cadastre empresas para começar a organizar suas entregas."}
                </Text>

                {podeCadastrar && (
                  <Pressable
                    style={styles.botaoCadastrar}
                    onPress={cadastrarEmpresa}
                    disabled={salvando}
                    accessibilityRole="button"
                    accessibilityLabel="Cadastrar empresa"
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color={colors.textInverse}
                    />

                    <Text style={styles.botaoCadastrarTexto}>
                      Cadastrar empresa
                    </Text>
                  </Pressable>
                )}
              </View>
            }
          />
        )}

        {/* Rodapé respeitando a navegação nativa do Android */}
        <View
          style={[
            styles.rodape,
            {
              paddingBottom: Math.max(insets.bottom, 0) + 16,
            },
          ]}
        >
          <View style={styles.resumoSelecao}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={
                totalSelecionadas > 0 ? colors.primary : colors.textSecondary
              }
            />

            <Text style={styles.selecionadasTexto}>
              {totalSelecionadas} empresa(s) selecionada(s)
            </Text>
          </View>

          <Pressable
            style={[
              styles.botaoConfirmar,
              confirmarDesabilitado && styles.botaoDesabilitado,
            ]}
            disabled={confirmarDesabilitado}
            onPress={() => void confirmarSelecao()}
            accessibilityRole="button"
          >
            {salvando ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <>
                <Text style={styles.botaoConfirmarTexto}>
                  Confirmar entregas
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={colors.textInverse}
                />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

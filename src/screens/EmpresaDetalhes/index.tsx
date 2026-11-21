import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { MapaLocalizacao } from "@/components/empresas/cadastro/MapaLocalizacao";

import { empresaRepository } from "@/database/repositories/empresaRepository";
import type { Empresa } from "@/database/schema/empresas";

import { useAppSafeArea } from "@/hooks/useAppSafeArea";
import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

type CampoExpandido = {
  titulo: string;
  conteudo: string;
};

interface CampoProps {
  titulo: string;
  valor: string | null | undefined;
  onExpandir: (campo: CampoExpandido) => void;
  linhas?: number;
}

function Campo({ titulo, valor, onExpandir, linhas = 1 }: CampoProps) {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const texto = valor?.trim() || "Não informado";

  return (
    <TouchableOpacity
      style={styles.campo}
      onPress={() =>
        onExpandir({
          titulo,
          conteudo: texto,
        })
      }
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}: ${texto}`}
    >
      <Text style={styles.label}>{titulo}</Text>

      <Text style={styles.valor} numberOfLines={linhas} ellipsizeMode="tail">
        {texto}
      </Text>
    </TouchableOpacity>
  );
}

export function EmpresaDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  // O AppHeader já controla a SafeArea superior.
  const { containerStyle } = useAppSafeArea({
    top: false,
    bottom: true,
  });

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [campoExpandido, setCampoExpandido] = useState<CampoExpandido | null>(
    null,
  );

  useEffect(() => {
    let ativo = true;

    async function carregarEmpresa() {
      setCarregando(true);

      try {
        const empresaId = Number(id);

        if (!Number.isSafeInteger(empresaId) || empresaId <= 0) {
          throw new Error("ID inválido");
        }

        const resultado = await empresaRepository.findById(empresaId);

        if (ativo) {
          setEmpresa(resultado);
        }
      } catch (erro) {
        console.error("Erro ao buscar empresa:", erro);

        if (ativo) {
          Alert.alert("Erro", "Não foi possível carregar os dados da empresa.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarEmpresa();

    return () => {
      ativo = false;
    };
  }, [id]);

  const possuiLocalizacao =
    empresa?.latitude != null &&
    empresa?.longitude != null &&
    Number.isFinite(empresa.latitude) &&
    Number.isFinite(empresa.longitude) &&
    empresa.latitude >= -90 &&
    empresa.latitude <= 90 &&
    empresa.longitude >= -180 &&
    empresa.longitude <= 180;

  const coordenadas =
    possuiLocalizacao && empresa
      ? {
          latitude: empresa.latitude!,
          longitude: empresa.longitude!,
        }
      : null;

  async function abrirNavegacao(aplicativo: "google" | "waze") {
    if (!coordenadas) {
      Alert.alert(
        "Localização indisponível",
        "Esta empresa não possui coordenadas válidas.",
      );
      return;
    }

    const { latitude, longitude } = coordenadas;

    const url =
      aplicativo === "waze"
        ? `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
        : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Erro", "Não foi possível abrir o aplicativo de navegação.");
    }
  }

  const header = (
    <AppHeader
      titulo="Detalhes da empresa"
      subtitulo="Informações do ponto de entrega"
      onVoltar={() => router.back()}
    />
  );

  if (carregando || !empresa) {
    return (
      <View style={[styles.container, containerStyle]}>
        {header}

        <View style={styles.centro}>
          {carregando ? (
            <>
              <ActivityIndicator size="large" color={colors.success} />

              <Text style={styles.textoSecundario}>Carregando empresa...</Text>
            </>
          ) : (
            <>
              <Ionicons
                name="business-outline"
                size={42}
                color={colors.placeholder}
              />

              <Text style={styles.textoSecundario}>Empresa não encontrada</Text>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {header}

      <View style={styles.conteudo}>
        {/* Identificação da empresa */}
        <View style={styles.identificacao}>
          <View style={styles.iconeEmpresa}>
            <Ionicons
              name="business-outline"
              size={20}
              color={colors.success}
            />
          </View>

          <View style={styles.identificacaoTextos}>
            <Text style={styles.nomeEmpresa} numberOfLines={1}>
              {empresa.nome}
            </Text>

            <Text style={styles.cnpj} numberOfLines={1}>
              CNPJ: {empresa.cnpj}
            </Text>
          </View>
        </View>

        {/* Dados cadastrais */}
        <View style={styles.card}>
          <View style={styles.cardCabecalho}>
            <Ionicons
              name="document-text-outline"
              size={15}
              color={colors.success}
            />

            <Text style={styles.cardTitulo}>Dados cadastrais</Text>
          </View>

          <View style={styles.linha}>
            <Campo
              titulo="Razão social"
              valor={empresa.razaoSocial}
              onExpandir={setCampoExpandido}
            />

            <Campo
              titulo="Nome fantasia"
              valor={empresa.nomeFantasia}
              onExpandir={setCampoExpandido}
            />
          </View>

          <Campo
            titulo="Telefone"
            valor={empresa.telefone}
            onExpandir={setCampoExpandido}
          />
        </View>

        {/* Endereços compactos */}
        <View style={styles.card}>
          <View style={styles.cardCabecalho}>
            <Ionicons
              name="location-outline"
              size={15}
              color={colors.success}
            />

            <Text style={styles.cardTitulo}>Endereços</Text>
          </View>

          <View style={styles.linha}>
            <Campo
              titulo="Endereço de entrega"
              valor={empresa.endereco}
              onExpandir={setCampoExpandido}
              linhas={1}
            />

            <Campo
              titulo="Endereço cadastral"
              valor={empresa.enderecoCadastral}
              onExpandir={setCampoExpandido}
              linhas={1}
            />
          </View>
        </View>

        {/* Geolocalização */}
        <View style={styles.cardMapa}>
          <View style={styles.cardCabecalho}>
            <Ionicons name="map-outline" size={15} color={colors.success} />

            <Text style={styles.cardTitulo}>Geolocalização</Text>
          </View>

          <View style={styles.mapaContainer}>
            {coordenadas ? (
              <MapaLocalizacao coordenadas={coordenadas} />
            ) : (
              <View style={styles.semLocalizacao}>
                <Ionicons
                  name="location-outline"
                  size={25}
                  color={colors.placeholder}
                />

                <Text style={styles.textoSecundario}>
                  Localização não cadastrada
                </Text>
              </View>
            )}
          </View>

          {/* Botões de navegação */}
          <View style={styles.acoes}>
            <TouchableOpacity
              style={[styles.botao, !coordenadas && styles.botaoDesabilitado]}
              disabled={!coordenadas}
              onPress={() => void abrirNavegacao("google")}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Abrir no Google Maps"
            >
              <Ionicons
                name="navigate-outline"
                size={16}
                color={colors.textInverse}
              />

              <Text style={styles.textoBotao}>Google Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, !coordenadas && styles.botaoDesabilitado]}
              disabled={!coordenadas}
              onPress={() => void abrirNavegacao("waze")}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Abrir no Waze"
            >
              <Ionicons
                name="car-outline"
                size={16}
                color={colors.textInverse}
              />

              <Text style={styles.textoBotao}>Waze</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Observações */}
        <TouchableOpacity
          style={styles.observacoes}
          onPress={() =>
            setCampoExpandido({
              titulo: "Observações",
              conteudo: empresa.observacoes || "Nenhuma observação cadastrada.",
            })
          }
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Ver observações"
        >
          <Ionicons name="chatbox-outline" size={16} color={colors.success} />

          <Text style={styles.observacoesTexto} numberOfLines={1}>
            {empresa.observacoes || "Nenhuma observação cadastrada."}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={15}
            color={colors.placeholder}
          />
        </TouchableOpacity>
      </View>

      {/* Modal para visualizar informações completas */}
      <Modal
        visible={campoExpandido !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setCampoExpandido(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalFundo}
            onPress={() => setCampoExpandido(null)}
          />

          <View style={styles.modalConteudo}>
            <View style={styles.modalCabecalho}>
              <Text style={styles.modalTitulo}>{campoExpandido?.titulo}</Text>

              <TouchableOpacity
                onPress={() => setCampoExpandido(null)}
                accessibilityRole="button"
                accessibilityLabel="Fechar detalhes"
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTexto} selectable>
              {campoExpandido?.conteudo}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

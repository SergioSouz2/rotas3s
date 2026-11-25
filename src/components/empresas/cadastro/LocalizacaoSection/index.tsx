import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";

import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { MapaLocalizacao } from "@/components/empresas/cadastro/MapaLocalizacao";
import { useAppTheme } from "@/hooks/useAppTheme";

import type { Coordenadas } from "@/services/localizacaoService";

import { createFormStyles } from "../formStyles";
import { createStyles } from "./styles";

type OrigemLocalizacao = "automatica" | "gps" | "manual";

interface LocalizacaoSectionProps {
  coordenadas: Coordenadas | null;
  origemLocalizacao: OrigemLocalizacao | null;
  buscandoLocalizacao: boolean;
  localizacaoNaoEncontrada: boolean;
  mensagemSemLocalizacao?: string;
  onAtualizarLocalizacao: () => void;
  onConfirmarLocalizacaoManual: (coordenadas: Coordenadas) => void;
  onModoEdicaoChange?: (editando: boolean) => void;
}

export function LocalizacaoSection({
  coordenadas,
  buscandoLocalizacao,
  localizacaoNaoEncontrada,
  mensagemSemLocalizacao,
  onAtualizarLocalizacao,
  onConfirmarLocalizacaoManual,
  onModoEdicaoChange,
}: LocalizacaoSectionProps) {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const formStyles = useMemo(() => createFormStyles(theme), [theme]);

  const { colors } = theme;

  const [modoEdicao, setModoEdicao] = useState(false);

  const [posicaoTemporaria, setPosicaoTemporaria] =
    useState<Coordenadas | null>(null);

  // Sincroniza a posição temporária quando não está editando.
  useEffect(() => {
    if (!modoEdicao) {
      setPosicaoTemporaria(coordenadas);
    }
  }, [coordenadas, modoEdicao]);

  function iniciarEdicao() {
    if (!coordenadas || buscandoLocalizacao) {
      return;
    }

    setPosicaoTemporaria(coordenadas);
    setModoEdicao(true);

    // Impede o ScrollView de capturar os gestos do mapa.
    onModoEdicaoChange?.(true);
  }

  function cancelarEdicao() {
    setModoEdicao(false);
    setPosicaoTemporaria(null);

    // Libera a rolagem da tela.
    onModoEdicaoChange?.(false);
  }

  function confirmarEdicao() {
    if (!posicaoTemporaria) {
      return;
    }

    onConfirmarLocalizacaoManual(posicaoTemporaria);

    setModoEdicao(false);
    setPosicaoTemporaria(null);

    // Libera a rolagem após confirmar.
    onModoEdicaoChange?.(false);
  }

  return (
    <View style={formStyles.card}>
      <Text style={formStyles.secaoTitulo}>
        Localização do ponto de entrega
      </Text>

      <Text style={formStyles.secaoDescricao}>
        Confira e ajuste a localização do ponto de entrega.
      </Text>

      {buscandoLocalizacao ? (
        <View style={styles.mapaPlaceholder}>
          <ActivityIndicator size="large" color={colors.info} />

          <Text style={styles.mapaTexto}>Buscando localização...</Text>
        </View>
      ) : coordenadas ? (
        <>
          <MapaLocalizacao
            coordenadas={coordenadas}
            modoEdicao={modoEdicao}
            onAlterarPosicao={setPosicaoTemporaria}
          />

          {modoEdicao ? (
            <View style={styles.acoesEdicao}>
              <Text style={styles.mapaTexto}>
                Arraste o mapa para posicionar o marcador na entrada da empresa.
              </Text>

              <TouchableOpacity
                style={[styles.botaoLocalizacao, styles.botaoConfirmar]}
                onPress={confirmarEdicao}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Confirmar localização manual"
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={colors.textInverse}
                />

                <Text style={styles.botaoConfirmarTexto}>
                  Confirmar localização
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoLocalizacao}
                onPress={cancelarEdicao}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Cancelar edição da localização"
              >
                <Ionicons
                  name="close-circle-outline"
                  size={20}
                  color={colors.info}
                />

                <Text style={styles.botaoLocalizacaoTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.botaoLocalizacao}
              onPress={iniciarEdicao}
              disabled={buscandoLocalizacao}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Ajustar localização no mapa"
            >
              <Ionicons name="create-outline" size={20} color={colors.info} />

              <Text style={styles.botaoLocalizacaoTexto}>Ajustar no mapa</Text>
            </TouchableOpacity>
          )}
        </>
      ) : localizacaoNaoEncontrada ? (
        <View style={styles.mapaPlaceholder}>
          <Ionicons name="location-outline" size={36} color={colors.danger} />

          <Text style={styles.mapaTexto}>Localização não encontrada</Text>

          <Text style={styles.mapaTexto}>
            Não foi possível identificar as coordenadas do endereço informado.
          </Text>
        </View>
      ) : (
        <View style={styles.mapaPlaceholder}>
          <Ionicons name="map-outline" size={36} color={colors.textSecondary} />

          <Text style={styles.mapaTexto}>
            {mensagemSemLocalizacao ?? "Aguardando consulta do CNPJ"}
          </Text>
        </View>
      )}

      {!modoEdicao && (
        <TouchableOpacity
          style={styles.botaoLocalizacao}
          onPress={onAtualizarLocalizacao}
          disabled={buscandoLocalizacao}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Atualizar localização pelo GPS"
        >
          <Ionicons name="navigate-outline" size={20} color={colors.info} />

          <Text style={styles.botaoLocalizacaoTexto}>
            Atualizar localização pelo GPS
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

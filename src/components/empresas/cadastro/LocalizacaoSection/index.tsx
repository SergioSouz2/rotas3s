import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { MapaLocalizacao } from "@/components/empresas/cadastro/MapaLocalizacao";
import type { Coordenadas } from "@/services/localizacaoService";

import { formStyles } from "../formStyles";
import { styles } from "./styles";

type OrigemLocalizacao = "automatica" | "gps" | "manual";

interface LocalizacaoSectionProps {
  coordenadas: Coordenadas | null;
  origemLocalizacao: OrigemLocalizacao | null;
  buscandoLocalizacao: boolean;
  localizacaoNaoEncontrada: boolean;
  onAtualizarLocalizacao: () => void;
}

export function LocalizacaoSection({
  coordenadas,
  origemLocalizacao,
  buscandoLocalizacao,
  localizacaoNaoEncontrada,
  onAtualizarLocalizacao,
}: LocalizacaoSectionProps) {
  function obterDescricaoOrigem() {
    switch (origemLocalizacao) {
      case "automatica":
        return "Localização encontrada pelo endereço";

      case "gps":
        return "Localização atualizada pelo GPS";

      case "manual":
        return "Localização definida manualmente";

      default:
        return "Origem não identificada";
    }
  }

  return (
    <View style={formStyles.card}>
      <Text style={formStyles.secaoTitulo}>
        Localização do ponto de entrega
      </Text>

      <Text style={formStyles.secaoDescricao}>
        Confira no mapa o ponto encontrado automaticamente após consultar o
        CNPJ.
      </Text>

      {buscandoLocalizacao ? (
        <View style={styles.mapaPlaceholder}>
          <ActivityIndicator size="large" color="#2563eb" />

          <Text style={styles.mapaTexto}>
            Buscando localização do endereço...
          </Text>
        </View>
      ) : coordenadas ? (
        <>
          <MapaLocalizacao coordenadas={coordenadas} />

          <View style={styles.informacoesLocalizacao}>
            <View style={styles.statusLocalizacao}>
              <Ionicons name="checkmark-circle" size={20} color="#16a34a" />

              <Text style={styles.statusTexto}>{obterDescricaoOrigem()}</Text>
            </View>

            <Text style={styles.coordenadasTexto}>
              Latitude: {coordenadas.latitude.toFixed(6)}
            </Text>

            <Text style={styles.coordenadasTexto}>
              Longitude: {coordenadas.longitude.toFixed(6)}
            </Text>

            <Text style={styles.avisoTexto}>
              O ponto foi estimado pelo endereço. Confirme a localização ao
              chegar à empresa.
            </Text>
          </View>
        </>
      ) : localizacaoNaoEncontrada ? (
        <View style={styles.mapaPlaceholder}>
          <Ionicons name="location-outline" size={36} color="#dc2626" />

          <Text style={styles.mapaTexto}>Localização não encontrada</Text>

          <Text style={styles.mapaTexto}>
            Não foi possível identificar as coordenadas do endereço informado.
          </Text>
        </View>
      ) : (
        <View style={styles.mapaPlaceholder}>
          <Ionicons name="map-outline" size={36} color="#64748b" />

          <Text style={styles.mapaTexto}>Aguardando consulta do CNPJ</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.botaoLocalizacao}
        onPress={onAtualizarLocalizacao}
        disabled={buscandoLocalizacao}
        activeOpacity={0.8}
      >
        <Ionicons name="navigate-outline" size={20} color="#2563eb" />

        <Text style={styles.botaoLocalizacaoTexto}>Atualizar localização</Text>
      </TouchableOpacity>
    </View>
  );
}

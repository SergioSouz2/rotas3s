import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { formStyles } from "../formStyles";
import { styles } from "./styles";

interface LocalizacaoSectionProps {
  onAtualizarLocalizacao: () => void;
}

export function LocalizacaoSection({
  onAtualizarLocalizacao,
}: LocalizacaoSectionProps) {
  return (
    <View style={formStyles.card}>
      <Text style={formStyles.secaoTitulo}>Localização da entrega</Text>

      <Text style={formStyles.secaoDescricao}>
        Confirme o ponto de entrega para facilitar a navegação.
      </Text>

      <View style={styles.mapaPlaceholder}>
        <Ionicons name="map-outline" size={40} color="#64748b" />
        <Text style={styles.mapaTexto}>Prévia do mapa</Text>
      </View>

      <TouchableOpacity
        style={styles.botaoLocalizacao}
        onPress={onAtualizarLocalizacao}
      >
        <Ionicons name="locate-outline" size={20} color="#102f63" />
        <Text style={styles.botaoLocalizacaoTexto}>
          Atualizar localização pelo GPS
        </Text>
      </TouchableOpacity>
    </View>
  );
}

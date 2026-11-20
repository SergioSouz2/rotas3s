import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface EmpresaCardProps {
  nome: string;
  cnpj: string;
  endereco: string;
  possuiLocalizacao: boolean;
  onPress?: () => void;
}

export function EmpresaCard({
  nome,
  cnpj,
  endereco,
  possuiLocalizacao,
  onPress,
}: EmpresaCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topo}>
        <View style={styles.icone}>
          <Ionicons name="business" size={22} color="#2563eb" />
        </View>

        <View style={styles.informacoes}>
          <Text style={styles.nome} numberOfLines={1}>
            {nome}
          </Text>

          <Text style={styles.cnpj}>{cnpj}</Text>
        </View>

        <Ionicons name="chevron-forward" size={19} color="#94a3b8" />
      </View>

      <View style={styles.enderecoContainer}>
        <Ionicons name="location-outline" size={17} color="#64748b" />

        <Text style={styles.endereco} numberOfLines={2}>
          {endereco}
        </Text>
      </View>

      <View style={styles.rodape}>
        <Ionicons
          name={possuiLocalizacao ? "checkmark-circle" : "alert-circle-outline"}
          size={16}
          color={possuiLocalizacao ? "#16a34a" : "#ea580c"}
        />

        <Text
          style={[
            styles.localizacao,
            { color: possuiLocalizacao ? "#15803d" : "#c2410c" },
          ]}
        >
          {possuiLocalizacao
            ? "Localização cadastrada"
            : "Localização pendente"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

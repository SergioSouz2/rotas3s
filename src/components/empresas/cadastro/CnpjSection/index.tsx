import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { formStyles } from "../formStyles";
import { styles } from "./styles";

interface CnpjSectionProps {
  cnpj: string;
  buscandoCnpj: boolean;
  onChangeCnpj: (value: string) => void;
  onBuscarCnpj: () => void;
}

export function CnpjSection({
  cnpj,
  buscandoCnpj,
  onChangeCnpj,
  onBuscarCnpj,
}: CnpjSectionProps) {
  return (
    <View style={formStyles.card}>
      <Text style={formStyles.secaoTitulo}>Identificação da empresa</Text>

      <Text style={formStyles.secaoDescricao}>
        Informe o CNPJ para consultar os dados oficiais.
      </Text>

      <Text style={formStyles.label}>CNPJ</Text>

      <TextInput
        style={formStyles.input}
        value={cnpj}
        onChangeText={onChangeCnpj}
        placeholder="00.000.000/0000-00"
        placeholderTextColor="#94a3b8"
        keyboardType="numeric"
        maxLength={18}
        editable={!buscandoCnpj}
      />

      <TouchableOpacity
        style={[styles.botaoBuscar, buscandoCnpj && { opacity: 0.7 }]}
        onPress={onBuscarCnpj}
        disabled={buscandoCnpj}
        activeOpacity={0.8}
      >
        {buscandoCnpj ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Ionicons name="search-outline" size={19} color="#ffffff" />
        )}

        <Text style={styles.botaoBuscarTexto}>
          {buscandoCnpj ? "Consultando CNPJ..." : "Buscar dados oficiais"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

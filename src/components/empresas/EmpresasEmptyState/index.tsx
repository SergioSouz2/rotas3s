import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { styles } from "./styles";

interface EmpresasEmptyStateProps {
  buscando?: boolean;
}

export function EmpresasEmptyState({
  buscando = false,
}: EmpresasEmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icone}>
        <Ionicons
          name={buscando ? "search-outline" : "business-outline"}
          size={34}
          color="#64748b"
        />
      </View>

      <Text style={styles.titulo}>
        {buscando ? "Nenhuma empresa encontrada" : "Nenhuma empresa cadastrada"}
      </Text>

      <Text style={styles.descricao}>
        {buscando
          ? "Tente buscar por outro nome ou CNPJ."
          : "Cadastre sua primeira empresa para organizar seus pontos de entrega."}
      </Text>
    </View>
  );
}

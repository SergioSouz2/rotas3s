import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./styles";

interface CadastroEmpresaHeaderProps {
  onVoltar: () => void;
}

export function CadastroEmpresaHeader({
  onVoltar,
}: CadastroEmpresaHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.voltar} onPress={onVoltar}>
        <Ionicons name="arrow-back" size={23} color="#ffffff" />
      </TouchableOpacity>

      <View style={styles.headerTextos}>
        <Text style={styles.headerTitulo}>Nova empresa</Text>
        <Text style={styles.headerSubtitulo}>
          Cadastre um novo ponto de entrega
        </Text>
      </View>
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { styles } from "./styles";

interface EmpresasHeaderProps {
  quantidade: number;
  onNovaEmpresa: () => void;
}

export function EmpresasHeader({
  quantidade,
  onNovaEmpresa,
}: EmpresasHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.titulos}>
          <Text style={styles.titulo}>Empresas</Text>
          <Text style={styles.subtitulo}>Gerencie seus pontos de entrega</Text>
        </View>

        <Image
          source={require("../../../../assets/images/logo/rotas3s-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.conteudo}>
        {/* <View style={styles.titulos}>
          <Text style={styles.titulo}>Empresas</Text>
          <Text style={styles.subtitulo}>Gerencie seus pontos de entrega</Text>
        </View> */}

        <View style={styles.rodape}>
          <View style={styles.contadorContainer}>
            <Ionicons name="business-outline" size={17} color="#cbd5e1" />

            <Text style={styles.contador}>
              {quantidade} {quantidade === 1 ? "empresa" : "empresas"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botao}
            onPress={onNovaEmpresa}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.botaoTexto}>Nova empresa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

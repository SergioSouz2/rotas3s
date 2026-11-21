import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./styles";

interface AppHeaderProps {
  titulo: string;
  subtitulo?: string;
  onVoltar?: () => void;
}

export function AppHeader({ titulo, subtitulo, onVoltar }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {onVoltar && (
        <TouchableOpacity
          style={styles.voltar}
          onPress={onVoltar}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={23} color="#ffffff" />
        </TouchableOpacity>
      )}

      <View style={styles.headerTextos}>
        <Text style={styles.headerTitulo} numberOfLines={1}>
          {titulo}
        </Text>

        {subtitulo ? (
          <Text style={styles.headerSubtitulo} numberOfLines={2}>
            {subtitulo}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

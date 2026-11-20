import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { styles } from "./styles";

interface HomeActionsProps {
  onRegistrarEntrega?: () => void;
  onVerEntregas?: () => void;
  onVerRota?: () => void;
  onFinalizarTurno?: () => void;
  turnoAberto?: boolean;
}

export function HomeActions({
  onRegistrarEntrega,
  onVerEntregas,
  onVerRota,
  onFinalizarTurno,
  turnoAberto = true,
}: HomeActionsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.primaryButton, !turnoAberto && styles.disabledButton]}
        onPress={onRegistrarEntrega}
        disabled={!turnoAberto || !onRegistrarEntrega}
      >
        <Ionicons name="cube-outline" size={20} color="#ffffff" />

        <Text style={styles.primaryButtonText}>Registrar entrega</Text>
      </Pressable>

      <View style={styles.secondaryRow}>
        <Pressable
          style={styles.secondaryButton}
          onPress={onVerEntregas}
          disabled={!onVerEntregas}
        >
          <Ionicons name="list-outline" size={19} color="#2563eb" />

          <Text style={styles.secondaryButtonText}>Ver entregas</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={onVerRota}
          disabled={!onVerRota}
        >
          <Ionicons name="map-outline" size={19} color="#2563eb" />

          <Text style={styles.secondaryButtonText}>Ver rota</Text>
        </Pressable>
      </View>

      <Pressable
        style={[
          styles.finishButton,
          !turnoAberto && styles.disabledFinishButton,
        ]}
        onPress={onFinalizarTurno}
        disabled={!turnoAberto || !onFinalizarTurno}
      >
        <Ionicons name="power-outline" size={19} color="#dc2626" />

        <Text style={styles.finishButtonText}>Finalizar turno</Text>
      </Pressable>
    </View>
  );
}

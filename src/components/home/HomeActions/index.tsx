import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

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
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.primaryButton, !turnoAberto && styles.disabledButton]}
        onPress={onRegistrarEntrega}
        disabled={!turnoAberto || !onRegistrarEntrega}
        accessibilityRole="button"
        accessibilityLabel="Registrar entrega"
      >
        <Ionicons name="cube-outline" size={20} color={colors.textInverse} />

        <Text style={styles.primaryButtonText}>Registrar entrega</Text>
      </Pressable>

      <View style={styles.secondaryRow}>
        <Pressable
          style={styles.secondaryButton}
          onPress={onVerEntregas}
          disabled={!onVerEntregas}
          accessibilityRole="button"
          accessibilityLabel="Ver entregas"
        >
          <Ionicons name="list-outline" size={19} color={colors.info} />

          <Text style={styles.secondaryButtonText}>Ver entregas</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={onVerRota}
          disabled={!onVerRota}
          accessibilityRole="button"
          accessibilityLabel="Ver rota"
        >
          <Ionicons name="map-outline" size={19} color={colors.info} />

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
        accessibilityRole="button"
        accessibilityLabel="Finalizar turno"
      >
        <Ionicons name="power-outline" size={19} color={colors.danger} />

        <Text style={styles.finishButtonText}>Finalizar turno</Text>
      </Pressable>
    </View>
  );
}

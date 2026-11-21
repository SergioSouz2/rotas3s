import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

type StatusJornada = "nao_iniciada" | "aberto" | "finalizado";

interface WorkdayCardProps {
  data: string;
  inicio?: string | null;
  fim?: string | null;
  status: StatusJornada;
  processando?: boolean;
  onIniciar?: () => void;
  onFinalizar?: () => void;
}

export function WorkdayCard({
  data,
  inicio,
  fim,
  status,
  processando = false,
  onIniciar,
  onFinalizar,
}: WorkdayCardProps) {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  const jornadaAberta = status === "aberto";
  const jornadaFinalizada = status === "finalizado";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="calendar-outline"
          size={22}
          color={colors.successDark}
        />

        <Text style={styles.title}>Dia de trabalho</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.label}>Data</Text>

          <Text style={styles.value}>{data}</Text>
        </View>

        <View style={styles.infoRight}>
          <Text style={styles.label}>
            {jornadaFinalizada ? "Finalizado às" : "Iniciado às"}
          </Text>

          <View style={styles.timeContainer}>
            <Ionicons
              name="time-outline"
              size={19}
              color={colors.successDark}
            />

            <Text style={styles.value}>
              {jornadaFinalizada ? fim || "--:--" : inicio || "--:--"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.status,
            jornadaAberta && styles.statusAberto,
            jornadaFinalizada && styles.statusFinalizado,
          ]}
        >
          <Text style={styles.statusText}>
            {jornadaAberta
              ? "Jornada em andamento"
              : jornadaFinalizada
                ? "Jornada finalizada"
                : "Jornada não iniciada"}
          </Text>
        </View>

        {status === "nao_iniciada" && (
          <Pressable
            style={[styles.button, processando && styles.buttonDisabled]}
            onPress={onIniciar}
            disabled={processando}
          >
            {processando ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <Text style={styles.buttonText}>Iniciar jornada</Text>
            )}
          </Pressable>
        )}

        {jornadaAberta && (
          <Pressable
            style={[
              styles.button,
              styles.buttonFinalizar,
              processando && styles.buttonDisabled,
            ]}
            onPress={onFinalizar}
            disabled={processando}
          >
            {processando ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <Text style={styles.buttonText}>Finalizar</Text>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

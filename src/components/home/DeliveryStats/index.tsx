import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useMemo } from "react";

import { Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import type { AppTheme } from "@/theme";

import { createStyles } from "./styles";

interface DeliveryStatsProps {
  total: number;
  realizadas: number;
  pendentes: number;
}

type IconName = ComponentProps<typeof Ionicons>["name"];

type Styles = ReturnType<typeof createStyles>;

interface StatItemProps {
  titulo: string;
  quantidade: number;
  icon: IconName;
  cor: string;
  background: string;
  styles: Styles;
}

function StatItem({
  titulo,
  quantidade,
  icon,
  cor,
  background,
  styles,
}: StatItemProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: background }]}>
        <Ionicons name={icon} size={20} color={cor} />
      </View>

      <Text style={styles.quantidade}>{quantidade}</Text>

      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

export function DeliveryStats({
  total,
  realizadas,
  pendentes,
}: DeliveryStatsProps) {
  const theme: AppTheme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  return (
    <View style={styles.container}>
      <StatItem
        titulo="Total"
        quantidade={total}
        icon="cube-outline"
        cor={colors.info}
        background={colors.infoSoft}
        styles={styles}
      />

      <StatItem
        titulo="Realizadas"
        quantidade={realizadas}
        icon="checkmark-circle-outline"
        cor={colors.success}
        background={colors.successLight}
        styles={styles}
      />

      <StatItem
        titulo="Pendentes"
        quantidade={pendentes}
        icon="time-outline"
        cor={colors.warningStrong}
        background={colors.warningSoft}
        styles={styles}
      />
    </View>
  );
}

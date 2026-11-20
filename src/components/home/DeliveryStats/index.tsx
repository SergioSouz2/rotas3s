import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { styles } from "./styles";

interface DeliveryStatsProps {
  total: number;
  realizadas: number;
  pendentes: number;
}

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface StatItemProps {
  titulo: string;
  quantidade: number;
  icon: IconName;
  cor: string;
  background: string;
}

function StatItem({
  titulo,
  quantidade,
  icon,
  cor,
  background,
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
  return (
    <View style={styles.container}>
      <StatItem
        titulo="Total"
        quantidade={total}
        icon="cube-outline"
        cor="#2563eb"
        background="#dbeafe"
      />

      <StatItem
        titulo="Realizadas"
        quantidade={realizadas}
        icon="checkmark-circle-outline"
        cor="#16a34a"
        background="#dcfce7"
      />

      <StatItem
        titulo="Pendentes"
        quantidade={pendentes}
        icon="time-outline"
        cor="#ea580c"
        background="#ffedd5"
      />
    </View>
  );
}

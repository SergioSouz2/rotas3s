import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { styles } from "./styles";

interface WorkdayCardProps {
  data: string;
  inicio?: string | null;
}

export function WorkdayCard({ data, inicio }: WorkdayCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={22} color="#15803d" />

        <Text style={styles.title}>Dia de trabalho</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.label}>Data</Text>

          <Text style={styles.value}>{data}</Text>
        </View>

        <View style={styles.infoRight}>
          <Text style={styles.label}>Iniciado às</Text>

          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={19} color="#15803d" />

            <Text style={styles.value}>{inicio || "--:--"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

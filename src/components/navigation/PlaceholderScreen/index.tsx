import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface PlaceholderScreenProps {
  titulo: string;
  descricao: string;
  icon: IconName;
}

export function PlaceholderScreen({
  titulo,
  descricao,
  icon,
}: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color="#2563eb" />

      <Text style={styles.title}>{titulo}</Text>

      <Text style={styles.description}>{descricao}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#102f63",
  },

  description: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
});

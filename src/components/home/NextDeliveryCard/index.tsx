import { Ionicons } from "@expo/vector-icons";
import { Alert, Linking, Pressable, Text, View } from "react-native";

import { styles } from "./styles";

interface NextDeliveryCardProps {
  empresa: string;
  endereco: string;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
}

export function NextDeliveryCard({
  empresa,
  endereco,
  latitude,
  longitude,
  status = "Pendente",
}: NextDeliveryCardProps) {
  async function handleVerRota() {
    const possuiCoordenadas = latitude != null && longitude != null;

    const destino = possuiCoordenadas
      ? `${latitude},${longitude}`
      : endereco.trim();

    if (!destino) {
      Alert.alert(
        "Localização indisponível",
        "Esta empresa não possui endereço ou coordenadas cadastradas.",
      );
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Erro", "Não foi possível abrir a rota.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons name="location-outline" size={20} color="#102f63" />

          <Text style={styles.title}>Próxima entrega</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.companyIcon}>
          <Ionicons name="business-outline" size={24} color="#2563eb" />
        </View>

        <View style={styles.companyInfo}>
          <Text style={styles.companyName} numberOfLines={2}>
            {empresa}
          </Text>

          <Text style={styles.address} numberOfLines={2}>
            {endereco}
          </Text>
        </View>
      </View>

      <Pressable style={styles.routeButton} onPress={handleVerRota}>
        <Ionicons name="navigate-outline" size={18} color="#ffffff" />

        <Text style={styles.routeButtonText}>Ver rota</Text>
      </Pressable>
    </View>
  );
}

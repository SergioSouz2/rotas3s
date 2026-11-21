import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

import { Alert, Linking, Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

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
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  async function handleVerRota() {
    const possuiCoordenadas =
      latitude != null &&
      longitude != null &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180;

    const enderecoFormatado = endereco.trim();

    if (!possuiCoordenadas && !enderecoFormatado) {
      Alert.alert(
        "Localização indisponível",
        "Esta empresa não possui endereço ou coordenadas cadastradas.",
      );
      return;
    }

    // O Waze aceita coordenadas ou busca por endereço.
    const url = possuiCoordenadas
      ? `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
      : `https://waze.com/ul?q=${encodeURIComponent(enderecoFormatado)}&navigate=yes`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("[WAZE] Erro ao abrir rota:", error);

      Alert.alert(
        "Erro ao abrir Waze",
        "Não foi possível abrir a navegação para esta empresa.",
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />

          <Text style={styles.title}>Próxima entrega</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.companyIcon}>
          <Ionicons name="business-outline" size={24} color={colors.info} />
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

      <Pressable
        style={styles.routeButton}
        onPress={handleVerRota}
        accessibilityRole="button"
        accessibilityLabel={`Abrir Waze para ${empresa}`}
      >
        <Ionicons
          name="navigate-outline"
          size={18}
          color={colors.textInverse}
        />

        <Text style={styles.routeButtonText}>Abrir no Waze</Text>
      </Pressable>
    </View>
  );
}

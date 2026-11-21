import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface AppHeaderProps {
  titulo: string;
  subtitulo?: string;
  onVoltar?: () => void;
}

export function AppHeader({ titulo, subtitulo, onVoltar }: AppHeaderProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors, spacing } = theme;

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + spacing.lg,
        },
      ]}
    >
      {onVoltar && (
        <TouchableOpacity
          style={styles.voltar}
          onPress={onVoltar}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textInverse} />
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

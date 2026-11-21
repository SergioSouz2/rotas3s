import { useMemo } from "react";

import { Image, Pressable, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface HomeHeaderProps {
  onProfilePress?: () => void;
}

export function HomeHeader({ onProfilePress }: HomeHeaderProps) {
  // Tema global
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  // SafeArea superior
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + theme.spacing.sm;

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.brand}>
        <Image
          source={require("../../../../assets/images/logo/rotas3s-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Pressable
        style={styles.profileButton}
        onPress={onProfilePress}
        disabled={!onProfilePress}
        accessibilityRole="button"
        accessibilityLabel="Abrir perfil"
      >
        <Text style={styles.profileIcon}>👤</Text>
      </Pressable>
    </View>
  );
}

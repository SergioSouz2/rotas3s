import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Image, Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface EmpresasHeaderProps {
  quantidade: number;
  onNovaEmpresa: () => void;
}

export function EmpresasHeader({
  quantidade,
  onNovaEmpresa,
}: EmpresasHeaderProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors, spacing } = theme;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.sm,
        },
      ]}
    >
      <View style={styles.brand}>
        <View style={styles.titulos}>
          <Text style={styles.titulo}>Empresas</Text>

          <Text style={styles.subtitulo}>Gerencie seus pontos de entrega</Text>
        </View>

        <Image
          source={require("../../../../assets/images/logo/rotas3s-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.conteudo}>
        <View style={styles.rodape}>
          <View style={styles.contadorContainer}>
            <Ionicons
              name="business-outline"
              size={17}
              color={colors.disabled}
            />

            <Text style={styles.contador}>
              {quantidade} {quantidade === 1 ? "empresa" : "empresas"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botao}
            onPress={onNovaEmpresa}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Cadastrar nova empresa"
          >
            <Ionicons name="add" size={20} color={colors.textInverse} />

            <Text style={styles.botaoTexto}>Nova empresa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

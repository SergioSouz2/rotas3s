import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface EmpresasEmptyStateProps {
  buscando?: boolean;
}

export function EmpresasEmptyState({
  buscando = false,
}: EmpresasEmptyStateProps) {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  return (
    <View style={styles.container}>
      <View style={styles.icone}>
        <Ionicons
          name={buscando ? "search-outline" : "business-outline"}
          size={30}
          color={colors.textSecondary}
        />
      </View>

      <Text style={styles.titulo}>
        {buscando ? "Nenhuma empresa encontrada" : "Nenhuma empresa cadastrada"}
      </Text>

      <Text style={styles.descricao}>
        {buscando
          ? "Tente buscar por outro nome ou CNPJ."
          : "Cadastre sua primeira empresa para organizar seus pontos de entrega."}
      </Text>
    </View>
  );
}

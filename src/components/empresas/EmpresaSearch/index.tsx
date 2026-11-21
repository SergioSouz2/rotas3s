import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

import { Pressable, TextInput, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface EmpresaSearchProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function EmpresaSearch({ value, onChangeText }: EmpresaSearchProps) {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={21} color={colors.textSecondary} />

      <TextInput
        style={styles.input}
        placeholder="Buscar empresa ou CNPJ..."
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Buscar empresa ou CNPJ"
      />

      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Limpar pesquisa"
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={20} color={colors.placeholder} />
        </Pressable>
      )}
    </View>
  );
}

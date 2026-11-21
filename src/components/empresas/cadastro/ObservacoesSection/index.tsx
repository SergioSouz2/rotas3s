import { useMemo } from "react";
import { Text, TextInput, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createFormStyles } from "../formStyles";
import { createStyles } from "./styles";

interface ObservacoesSectionProps {
  observacoes: string;
  onChangeObservacoes: (value: string) => void;
}

export function ObservacoesSection({
  observacoes,
  onChangeObservacoes,
}: ObservacoesSectionProps) {
  const theme = useAppTheme();

  const formStyles = useMemo(() => createFormStyles(theme), [theme]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  return (
    <View style={formStyles.card}>
      <Text style={formStyles.secaoTitulo}>Observações</Text>

      <TextInput
        style={[formStyles.input, styles.observacoes]}
        value={observacoes}
        onChangeText={onChangeObservacoes}
        placeholder="Referências, entrada de carga, horários..."
        placeholderTextColor={colors.placeholder}
        multiline
        textAlignVertical="top"
        accessibilityLabel="Observações sobre a empresa"
      />
    </View>
  );
}

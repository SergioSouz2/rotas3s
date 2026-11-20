import { Text, TextInput, View } from "react-native";

import { formStyles } from "../formStyles";
import { styles } from "./styles";

interface ObservacoesSectionProps {
  observacoes: string;
  onChangeObservacoes: (value: string) => void;
}

export function ObservacoesSection({
  observacoes,
  onChangeObservacoes,
}: ObservacoesSectionProps) {
  return (
    <View style={formStyles.card}>
      <Text style={formStyles.secaoTitulo}>Observações</Text>

      <TextInput
        style={[formStyles.input, styles.observacoes]}
        value={observacoes}
        onChangeText={onChangeObservacoes}
        placeholder="Referências, entrada de carga, horários..."
        placeholderTextColor="#94a3b8"
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

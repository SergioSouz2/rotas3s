import { useMemo } from "react";
import { Text, TextInput, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createFormStyles } from "../formStyles";
import { createStyles } from "./styles";

interface EnderecoSectionProps {
  enderecoCadastral: string;
  enderecoEntrega: string;
  onChangeEnderecoCadastral: (value: string) => void;
  onChangeEnderecoEntrega: (value: string) => void;
}

export function EnderecoSection({
  enderecoCadastral,
  enderecoEntrega,
  onChangeEnderecoCadastral,
  onChangeEnderecoEntrega,
}: EnderecoSectionProps) {
  const theme = useAppTheme();

  const formStyles = useMemo(() => createFormStyles(theme), [theme]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  return (
    <View style={[formStyles.card, styles.container]}>
      <Text style={formStyles.secaoTitulo}>Endereços</Text>

      <Text style={formStyles.label}>Endereço cadastral</Text>

      <TextInput
        style={[formStyles.input, formStyles.inputMultiline]}
        value={enderecoCadastral}
        onChangeText={onChangeEnderecoCadastral}
        placeholder="Endereço registrado no CNPJ"
        placeholderTextColor={colors.placeholder}
        multiline
        accessibilityLabel="Endereço cadastral da empresa"
      />

      <Text style={formStyles.label}>Endereço de entrega</Text>

      <TextInput
        style={[formStyles.input, formStyles.inputMultiline]}
        value={enderecoEntrega}
        onChangeText={onChangeEnderecoEntrega}
        placeholder="Local onde a entrega será realizada"
        placeholderTextColor={colors.placeholder}
        multiline
        accessibilityLabel="Endereço de entrega da empresa"
      />
    </View>
  );
}

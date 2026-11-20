import { Text, TextInput, View } from "react-native";

import { formStyles } from "../formStyles";
import { styles } from "./styles";

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
  return (
    <View style={[formStyles.card, styles.container]}>
      <Text style={formStyles.secaoTitulo}>Endereços</Text>

      <Text style={formStyles.label}>Endereço cadastral</Text>
      <TextInput
        style={[formStyles.input, formStyles.inputMultiline]}
        value={enderecoCadastral}
        onChangeText={onChangeEnderecoCadastral}
        placeholder="Endereço registrado no CNPJ"
        placeholderTextColor="#94a3b8"
        multiline
      />

      <Text style={formStyles.label}>Endereço de entrega</Text>
      <TextInput
        style={[formStyles.input, formStyles.inputMultiline]}
        value={enderecoEntrega}
        onChangeText={onChangeEnderecoEntrega}
        placeholder="Local onde a entrega será realizada"
        placeholderTextColor="#94a3b8"
        multiline
      />
    </View>
  );
}

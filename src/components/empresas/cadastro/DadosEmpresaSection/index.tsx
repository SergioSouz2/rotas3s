import { Text, TextInput, View } from "react-native";

import { formStyles } from "../formStyles";
import { styles } from "./styles";

interface DadosEmpresaSectionProps {
  razaoSocial: string;
  nomeFantasia: string;
  telefone: string;
  onChangeRazaoSocial: (value: string) => void;
  onChangeNomeFantasia: (value: string) => void;
  onChangeTelefone: (value: string) => void;
}

export function DadosEmpresaSection({
  razaoSocial,
  nomeFantasia,
  telefone,
  onChangeRazaoSocial,
  onChangeNomeFantasia,
  onChangeTelefone,
}: DadosEmpresaSectionProps) {
  return (
    <View style={[formStyles.card, styles.container]}>
      <Text style={formStyles.secaoTitulo}>Dados da empresa</Text>

      <Text style={formStyles.label}>Razão social</Text>
      <TextInput
        style={formStyles.input}
        value={razaoSocial}
        onChangeText={onChangeRazaoSocial}
        placeholder="Razão social"
        placeholderTextColor="#94a3b8"
      />

      <Text style={formStyles.label}>Nome fantasia</Text>
      <TextInput
        style={formStyles.input}
        value={nomeFantasia}
        onChangeText={onChangeNomeFantasia}
        placeholder="Nome da empresa"
        placeholderTextColor="#94a3b8"
      />

      <Text style={formStyles.label}>Telefone</Text>
      <TextInput
        style={formStyles.input}
        value={telefone}
        onChangeText={onChangeTelefone}
        placeholder="(00) 00000-0000"
        placeholderTextColor="#94a3b8"
        keyboardType="phone-pad"
      />
    </View>
  );
}

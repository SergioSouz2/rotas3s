import { useMemo } from "react";
import { Text, TextInput, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createFormStyles } from "../formStyles";
import { createStyles } from "./styles";

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
  const theme = useAppTheme();

  const formStyles = useMemo(() => createFormStyles(theme), [theme]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  return (
    <View style={[formStyles.card, styles.container]}>
      <Text style={formStyles.secaoTitulo}>Dados da empresa</Text>

      <Text style={formStyles.label}>Razão social</Text>

      <TextInput
        style={formStyles.input}
        value={razaoSocial}
        onChangeText={onChangeRazaoSocial}
        placeholder="Razão social"
        placeholderTextColor={colors.placeholder}
        autoCorrect={false}
        accessibilityLabel="Razão social da empresa"
      />

      <Text style={formStyles.label}>Nome fantasia</Text>

      <TextInput
        style={formStyles.input}
        value={nomeFantasia}
        onChangeText={onChangeNomeFantasia}
        placeholder="Nome da empresa"
        placeholderTextColor={colors.placeholder}
        accessibilityLabel="Nome fantasia da empresa"
      />

      <Text style={formStyles.label}>Telefone</Text>

      <TextInput
        style={formStyles.input}
        value={telefone}
        onChangeText={onChangeTelefone}
        placeholder="(00) 00000-0000"
        placeholderTextColor={colors.placeholder}
        keyboardType="phone-pad"
        accessibilityLabel="Telefone da empresa"
      />
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createFormStyles } from "../formStyles";
import { createStyles } from "./styles";

interface CnpjSectionProps {
  cnpj: string;
  buscandoCnpj: boolean;
  onChangeCnpj: (value: string) => void;
  onBuscarCnpj: () => void;
}

export function CnpjSection({
  cnpj,
  buscandoCnpj,
  onChangeCnpj,
  onBuscarCnpj,
}: CnpjSectionProps) {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const formStyles = useMemo(() => createFormStyles(theme), [theme]);

  const { colors } = theme;

  return (
    <View style={formStyles.card}>
      <Text style={formStyles.secaoTitulo}>Identificação da empresa</Text>

      <Text style={formStyles.secaoDescricao}>
        Informe o CNPJ para consultar os dados oficiais.
      </Text>

      <Text style={formStyles.label}>CNPJ</Text>

      <TextInput
        style={formStyles.input}
        value={cnpj}
        onChangeText={onChangeCnpj}
        placeholder="00.000.000/0000-00"
        placeholderTextColor={colors.placeholder}
        keyboardType="numeric"
        maxLength={18}
        editable={!buscandoCnpj}
        autoCorrect={false}
        accessibilityLabel="CNPJ da empresa"
      />

      <TouchableOpacity
        style={[styles.botaoBuscar, buscandoCnpj && styles.botaoDesabilitado]}
        onPress={onBuscarCnpj}
        disabled={buscandoCnpj}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          buscandoCnpj ? "Consultando CNPJ" : "Buscar dados oficiais do CNPJ"
        }
        accessibilityState={{
          disabled: buscandoCnpj,
          busy: buscandoCnpj,
        }}
      >
        {buscandoCnpj ? (
          <ActivityIndicator size="small" color={colors.textInverse} />
        ) : (
          <Ionicons
            name="search-outline"
            size={19}
            color={colors.textInverse}
          />
        )}

        <Text style={styles.botaoBuscarTexto}>
          {buscandoCnpj ? "Consultando CNPJ..." : "Buscar dados oficiais"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

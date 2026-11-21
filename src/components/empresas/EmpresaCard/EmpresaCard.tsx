import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface EmpresaCardProps {
  nome: string;
  cnpj: string;
  endereco: string;
  possuiLocalizacao: boolean;
  onPress?: () => void;
}

export function EmpresaCard({
  nome,
  cnpj,
  endereco,
  possuiLocalizacao,
  onPress,
}: EmpresaCardProps) {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  const conteudo = (
    <>
      <View style={styles.topo}>
        <View style={styles.icone}>
          <Ionicons name="business" size={22} color={colors.info} />
        </View>

        <View style={styles.informacoes}>
          <Text style={styles.nome} numberOfLines={1}>
            {nome}
          </Text>

          <Text style={styles.cnpj}>{cnpj}</Text>
        </View>

        <Ionicons name="chevron-forward" size={19} color={colors.placeholder} />
      </View>

      <View style={styles.enderecoContainer}>
        <Ionicons
          name="location-outline"
          size={17}
          color={colors.textSecondary}
        />

        <Text style={styles.endereco} numberOfLines={2}>
          {endereco}
        </Text>
      </View>

      <View style={styles.rodape}>
        <Ionicons
          name={possuiLocalizacao ? "checkmark-circle" : "alert-circle-outline"}
          size={16}
          color={possuiLocalizacao ? colors.success : colors.warningStrong}
        />

        <Text
          style={[
            styles.localizacao,
            possuiLocalizacao
              ? styles.localizacaoCadastrada
              : styles.localizacaoPendente,
          ]}
        >
          {possuiLocalizacao
            ? "Localização cadastrada"
            : "Localização pendente"}
        </Text>
      </View>
    </>
  );

  if (!onPress) {
    return <View style={styles.container}>{conteudo}</View>;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Abrir empresa ${nome}`}
    >
      {conteudo}
    </TouchableOpacity>
  );
}

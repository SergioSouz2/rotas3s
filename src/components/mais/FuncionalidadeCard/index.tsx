import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface FuncionalidadeCardProps {
  titulo: string;
  icone: IconName;
  disponivel?: boolean;
  onPress?: () => void;
}

export function FuncionalidadeCard({
  titulo,
  icone,
  disponivel = false,
  onPress,
}: FuncionalidadeCardProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      disabled={!disponivel || !onPress}
    >
      <View style={styles.iconeContainer}>
        <Ionicons
          name={icone}
          size={26}
          color={disponivel ? colors.primary : colors.primaryLight}
        />
      </View>

      <Text style={styles.titulo}>{titulo}</Text>

      {!disponivel && <Text style={styles.emBreve}>Em breve</Text>}
    </Pressable>
  );
}

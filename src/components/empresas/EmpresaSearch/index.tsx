import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { styles } from "./styles";

interface EmpresaSearchProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function EmpresaSearch({ value, onChangeText }: EmpresaSearchProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={21} color="#64748b" />

      <TextInput
        style={styles.input}
        placeholder="Buscar empresa ou CNPJ..."
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />

      {value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={20}
          color="#94a3b8"
          onPress={() => onChangeText("")}
        />
      )}
    </View>
  );
}

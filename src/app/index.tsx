import { useUsuarioContext } from "@/contexts/UsuarioContext";
import { Redirect } from "expo-router";

import { ActivityIndicator, Text, View } from "react-native";

import { theme } from "@/theme";

export default function Index() {
  const { usuario, carregando, erro } = useUsuarioContext();

  if (carregando || erro) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
          gap: 12,
        }}
      >
        {carregando && (
          <>
            <ActivityIndicator size="large" color={theme.colors.primary} />

            <Text style={{ color: theme.colors.text }}>
              Preparando 3S Rotas...
            </Text>
          </>
        )}
      </View>
    );
  }

  if (!usuario) {
    return <Redirect href="/cadastro-inicial" />;
  }

  return <Redirect href="/(tab)" />;
}

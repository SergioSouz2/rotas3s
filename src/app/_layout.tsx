import { JornadaProvider } from "@/contexts/JornadaContext";
import { SelecaoEntregasProvider } from "@/contexts/SelecaoEntregasContext";
import { UsuarioProvider, useUsuarioContext } from "@/contexts/UsuarioContext";
import { DatabaseInitializer } from "@/database/DatabaseInitializer";

import { ThemeProvider as NavigationThemeProvider, Stack } from "expo-router";

import { ThemeProvider as AppThemeProvider } from "@/provider/ThemeProvider";
import { theme } from "@/theme";

import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

const navigationTheme = {
  dark: false,
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.danger,
  },
  fonts: {
    regular: {
      fontFamily: "System",
      fontWeight: "400" as const,
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500" as const,
    },
    bold: {
      fontFamily: "System",
      fontWeight: "700" as const,
    },
    heavy: {
      fontFamily: "System",
      fontWeight: "900" as const,
    },
  },
};

void SplashScreen.preventAutoHideAsync();

function NavegacaoPrincipal() {
  const { usuario, carregando, erro, recarregarUsuario } = useUsuarioContext();

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        {/* Rota de entrada, sempre disponível */}
        <Stack.Screen name="index" />

        {/* Cadastro obrigatório */}
        <Stack.Protected guard={!carregando && !erro && !usuario}>
          <Stack.Screen name="cadastro-inicial" />
        </Stack.Protected>

        {/* Telas disponíveis após cadastro */}
        <Stack.Protected guard={!carregando && !erro && !!usuario}>
          <Stack.Screen name="(tab)" />
          <Stack.Screen name="perfil/index" />
          <Stack.Screen name="empresas/nova" />
          <Stack.Screen name="entregas" />
          <Stack.Screen name="mapa" />
        </Stack.Protected>
      </Stack>

      {(carregando || erro) && (
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: theme.colors.background,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
            gap: 12,
          }}
        >
          {carregando ? (
            <>
              <ActivityIndicator size="large" color={theme.colors.primary} />

              <Text style={{ color: theme.colors.text }}>
                Verificando perfil...
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  color: theme.colors.danger,
                  textAlign: "center",
                }}
              >
                {erro}
              </Text>

              <TouchableOpacity onPress={() => void recarregarUsuario()}>
                <Text style={{ color: theme.colors.primary }}>
                  Tentar novamente
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <NavigationThemeProvider value={navigationTheme}>
          <StatusBar style="light" />

          <DatabaseInitializer>
            <UsuarioProvider>
              <JornadaProvider>
                <SelecaoEntregasProvider>
                  <NavegacaoPrincipal />
                </SelecaoEntregasProvider>
              </JornadaProvider>
            </UsuarioProvider>
          </DatabaseInitializer>
        </NavigationThemeProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

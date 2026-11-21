import { DatabaseInitializer } from "@/database/DatabaseInitializer";

import { ThemeProvider as NavigationThemeProvider, Stack } from "expo-router";

import { ThemeProvider as AppThemeProvider } from "@/provider/ThemeProvider";

import { theme } from "@/theme";

import * as SplashScreen from "expo-splash-screen";

import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
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
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: theme.colors.background,
                },
              }}
            >
              <Stack.Screen name="(tab)" />
              <Stack.Screen name="empresas/nova" />
            </Stack>
          </DatabaseInitializer>
        </NavigationThemeProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

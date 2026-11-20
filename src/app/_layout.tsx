import { DatabaseInitializer } from "@/database/DatabaseInitializer";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <DatabaseInitializer>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tab)" />
        </Stack>
      </ThemeProvider>
    </DatabaseInitializer>
  );
}

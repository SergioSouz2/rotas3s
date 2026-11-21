import { CustomTabBar } from "@/components/navigation/CustomTabBar";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Início" }} />

      <Tabs.Screen name="entregas" options={{ title: "Entregas" }} />

      <Tabs.Screen name="empresas" options={{ title: "Empresas" }} />

      <Tabs.Screen name="historico" options={{ title: "Histórico" }} />

      <Tabs.Screen name="mais" options={{ title: "Mais" }} />
    </Tabs>
  );
}

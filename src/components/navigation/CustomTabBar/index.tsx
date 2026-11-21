import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";

import { useMemo, type ComponentProps } from "react";

import { Pressable, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

type TabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

type IconName = ComponentProps<typeof Ionicons>["name"];

const tabIcons: Record<
  string,
  {
    active: IconName;
    inactive: IconName;
  }
> = {
  index: {
    active: "home",
    inactive: "home-outline",
  },

  entregas: {
    active: "cube",
    inactive: "cube-outline",
  },

  empresas: {
    active: "business",
    inactive: "business-outline",
  },

  historico: {
    active: "time",
    inactive: "time-outline",
  },

  mais: {
    active: "menu",
    inactive: "menu-outline",
  },
};

export function CustomTabBar({ state, descriptors }: TabBarProps) {
  const router = useRouter();

  // Tema global do 3S Rotas
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors, spacing } = theme;

  // Área segura inferior do dispositivo
  const insets = useSafeAreaInsets();

  const paddingBottom = Math.max(insets.bottom, spacing.sm);

  const handleNavigate = (routeName: string) => {
    switch (routeName) {
      case "index":
        router.navigate("/(tab)");
        break;

      case "entregas":
        router.replace("/(tab)/entregas");
        break;

      case "empresas":
        router.replace("/(tab)/empresas");
        break;

      case "historico":
        router.replace("/(tab)/historico");
        break;

      case "mais":
        router.replace("/(tab)/mais");
        break;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const focused = state.index === index;

        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : typeof options.title === "string"
              ? options.title
              : route.name;

        const icons = tabIcons[route.name] ?? {
          active: "ellipse" as IconName,
          inactive: "ellipse-outline" as IconName,
        };

        const color = focused ? colors.primary : colors.textSecondary;

        const onPress = () => {
          if (!focused) {
            handleNavigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{
              selected: focused,
            }}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            style={styles.tab}
          >
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={23}
              color={color}
            />

            <Text
              style={[styles.label, focused && styles.activeLabel]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import type { ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { db } from "./client";
import migrations from "./migrations/migrations";

interface DatabaseInitializerProps {
  children: ReactNode;
}

export function DatabaseInitializer({ children }: DatabaseInitializerProps) {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 24,
          gap: 8,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Erro ao inicializar banco de dados
        </Text>

        <Text>{error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
        }}
      >
        <ActivityIndicator size="large" />

        <Text>Preparando banco de dados...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

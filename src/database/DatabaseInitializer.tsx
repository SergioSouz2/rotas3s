import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { db } from "./client";
import migrations from "./migrations/migrations";
import { resetJornadas } from "./resetDatabase";
import { seedDatabase } from "./seed/seedDatabase";

interface DatabaseInitializerProps {
  children: ReactNode;
}

export function DatabaseInitializer({ children }: DatabaseInitializerProps) {
  const { success, error } = useMigrations(db, migrations);

  const [seedConcluido, setSeedConcluido] = useState(false);
  const [seedErro, setSeedErro] = useState<string | null>(null);

  useEffect(() => {
    if (!success) return;

    let ativo = true;

    async function inicializarDados() {
      try {
        // RESET TEMPORÁRIO PARA TESTES
        // Altere para false depois de executar uma vez.
        const RESETAR_JORNADAS = false;

        if (__DEV__ && RESETAR_JORNADAS) {
          console.log("[DATABASE] Reiniciando jornadas de teste...");

          await resetJornadas();

          console.log("[DATABASE] Jornadas reiniciadas.");
        }

        // Inicialização padrão do banco
        await seedDatabase();

        if (ativo) {
          setSeedConcluido(true);
        }
      } catch (erro) {
        console.error("[DATABASE] Erro na inicialização:", erro);

        if (ativo) {
          setSeedErro(
            erro instanceof Error
              ? erro.message
              : "Erro desconhecido ao inicializar o banco.",
          );
        }
      }
    }

    void inicializarDados();

    return () => {
      ativo = false;
    };
  }, [success]);

  // Exibe erros de migrations ou inicialização
  if (error || seedErro) {
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
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Erro ao inicializar banco de dados
        </Text>

        <Text>{error?.message ?? seedErro}</Text>
      </View>
    );
  }

  // Aguarda migrations e seed
  if (!success || !seedConcluido) {
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

  // Banco pronto
  return <>{children}</>;
}

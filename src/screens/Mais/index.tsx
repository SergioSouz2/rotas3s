import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { FuncionalidadeCard } from "@/components/mais/FuncionalidadeCard";
import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

export function MaisScreen() {
  const router = useRouter();

  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  const abrirPerfil = () => {
    router.push("/perfil");
  };

  const funcionalidades = [
    {
      titulo: "Meu Perfil",
      icone: "person-outline",
      disponivel: true,
    },
    {
      titulo: "Meu Veículo",
      icone: "car-outline",
      disponivel: false,
    },
    {
      titulo: "Ganhos",
      icone: "wallet-outline",
      disponivel: false,
    },
    {
      titulo: "Combustível",
      icone: "speedometer-outline",
      disponivel: false,
    },
    {
      titulo: "Relatórios",
      icone: "stats-chart-outline",
      disponivel: false,
    },
    {
      titulo: "Minhas Rotas",
      icone: "map-outline",
      disponivel: false,
    },
    {
      titulo: "Agenda",
      icone: "calendar-outline",
      disponivel: false,
    },
    {
      titulo: "Despesas",
      icone: "receipt-outline",
      disponivel: false,
    },
    {
      titulo: "Configurações",
      icone: "settings-outline",
      disponivel: false,
    },
  ] as const;

  return (
    <View style={styles.container}>
      {/* Header padrão do aplicativo */}
      <AppHeader titulo="Mais" subtitulo="Suas ferramentas e configurações" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* Destaque do perfil */}
        <Pressable
          style={styles.destaque}
          onPress={abrirPerfil}
          accessibilityRole="button"
          accessibilityLabel="Abrir meu perfil"
        >
          <Ionicons
            name="person-circle-outline"
            size={48}
            color={theme.colors.primary}
          />

          <View style={styles.destaqueTexto}>
            <Text style={styles.destaqueTitulo}>Meu Perfil</Text>

            <Text style={styles.destaqueDescricao}>
              Gerencie seus dados pessoais
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.primary}
          />
        </Pressable>

        {/* Funcionalidades */}
        <Text style={styles.secaoTitulo}>Minhas ferramentas</Text>

        <View style={styles.grid}>
          {funcionalidades.map((item) => (
            <FuncionalidadeCard
              key={item.titulo}
              titulo={item.titulo}
              icone={item.icone}
              disponivel={item.disponivel}
              onPress={item.titulo === "Meu Perfil" ? abrirPerfil : undefined}
            />
          ))}
        </View>

        {/* Rodapé */}
        <Text style={styles.rodape}>3S Rotas</Text>
      </ScrollView>
    </View>
  );
}

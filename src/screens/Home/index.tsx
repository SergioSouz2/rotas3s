import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { DeliveryStats } from "@/components/home/DeliveryStats";
import { HomeActions } from "@/components/home/HomeActions";
import { HomeHeader } from "@/components/home/HomeHeader";
import { NextDeliveryCard } from "@/components/home/NextDeliveryCard";
import { WelcomeCard } from "@/components/home/WelcomeCard";
import { WorkdayCard } from "@/components/home/WorkdayCard";

import { useHomeData } from "@/hooks/useHomeData";
import { styles } from "./styles";

function formatarData(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split("-");

  if (!ano || !mes || !dia) return data;

  return `${dia}/${mes}/${ano}`;
}

function formatarHora(data: string): string {
  const horario = new Date(data);

  if (Number.isNaN(horario.getTime())) return "--:--";

  return horario.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obterDataAtual(): string {
  const hoje = new Date();

  return [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");
}

export function HomeScreen() {
  const {
    usuario,
    diaTrabalho,
    carregando,
    processando,
    erro,
    iniciarJornada,
    finalizarJornada,
  } = useHomeData();

  if (carregando) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 12 }}>Carregando informações...</Text>
      </View>
    );
  }

  const status: "nao_iniciada" | "aberto" | "finalizado" =
    diaTrabalho?.status === "aberto"
      ? "aberto"
      : diaTrabalho?.status === "finalizado"
        ? "finalizado"
        : "nao_iniciada";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeHeader />

        <View style={styles.body}>
          {erro && <Text style={{ color: "#dc2626" }}>{erro}</Text>}

          <WelcomeCard
            nome={usuario?.nome ?? "Motorista"}
            turnoAberto={status === "aberto"}
          />

          <WorkdayCard
            data={formatarData(diaTrabalho?.data ?? obterDataAtual())}
            inicio={
              diaTrabalho?.inicioEm ? formatarHora(diaTrabalho.inicioEm) : null
            }
            fim={diaTrabalho?.fimEm ? formatarHora(diaTrabalho.fimEm) : null}
            status={status}
            processando={processando}
            onIniciar={iniciarJornada}
            onFinalizar={finalizarJornada}
          />

          {/* Estatísticas temporárias */}
          <DeliveryStats total={5} realizadas={2} pendentes={3} />

          <NextDeliveryCard
            empresa="Supermercado Central"
            endereco="Av. Brasil, 1250 - Centro"
          />

          <HomeActions />
        </View>
      </ScrollView>
    </View>
  );
}

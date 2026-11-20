import { ScrollView, View } from "react-native";

import { DeliveryStats } from "@/components/home/DeliveryStats/index";
import { HomeHeader } from "@/components/home/HomeHeader";
import { WelcomeCard } from "@/components/home/WelcomeCard";
import { WorkdayCard } from "@/components/home/WorkdayCard";

import { HomeActions } from "@/components/home/HomeActions";
import { NextDeliveryCard } from "@/components/home/NextDeliveryCard";
import { styles } from "./styles";

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeHeader />

        <View style={styles.body}>
          <WelcomeCard nome="Sergio Souza" turnoAberto />

          <WorkdayCard data="20/11/2026" inicio="08:00" />

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

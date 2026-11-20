import { Text, View } from "react-native";
import { styles } from "./styles";

interface WelcomeCardProps {
  nome: string;
  turnoAberto: boolean;
}

export function WelcomeCard({ nome, turnoAberto }: WelcomeCardProps) {
  const primeiroNome = nome.trim().split(/\s+/)[0] || "Motorista";

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.welcome}>Bem-vindo de volta!</Text>

        <Text style={styles.nome} numberOfLines={2}>
          Olá, {primeiroNome} 👋
        </Text>

        <Text style={styles.cargo}>Motorista</Text>
      </View>

      <View
        style={[
          styles.statusContainer,
          turnoAberto ? styles.statusAberto : styles.statusFechado,
        ]}
      >
        <View
          style={[
            styles.statusDot,
            turnoAberto ? styles.dotAberto : styles.dotFechado,
          ]}
        />

        <Text
          style={[
            styles.statusText,
            turnoAberto ? styles.textAberto : styles.textFechado,
          ]}
        >
          {turnoAberto ? "Turno aberto" : "Turno fechado"}
        </Text>
      </View>
    </View>
  );
}

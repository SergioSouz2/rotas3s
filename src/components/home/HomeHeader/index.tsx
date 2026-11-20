import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./styles";

interface HomeHeaderProps {
  onProfilePress?: () => void;
}

export function HomeHeader({ onProfilePress }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Image
          source={require("../../../../assets/images/logo/rotas3s-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Pressable
        style={styles.profileButton}
        onPress={onProfilePress}
        disabled={!onProfilePress}
      >
        <Text style={styles.profileIcon}>👤</Text>
      </Pressable>
    </View>
  );
}

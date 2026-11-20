import * as Location from "expo-location";

export interface Coordenadas {
  latitude: number;
  longitude: number;
}

export async function localizarPorEndereco(
  endereco: string,
): Promise<Coordenadas> {
  if (!endereco.trim()) {
    throw new Error("Endereço de entrega não informado.");
  }

  try {
    const resultados = await Location.geocodeAsync(endereco.trim());

    if (resultados.length === 0) {
      throw new Error("LOCALIZACAO_NAO_ENCONTRADA");
    }

    const { latitude, longitude } = resultados[0];

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("LOCALIZACAO_NAO_ENCONTRADA");
    }

    return { latitude, longitude };
  } catch (erro) {
    if (
      erro instanceof Error &&
      erro.message === "LOCALIZACAO_NAO_ENCONTRADA"
    ) {
      throw new Error(
        "Não foi possível encontrar as coordenadas desse endereço.",
      );
    }

    throw new Error("Falha ao consultar a localização do endereço.");
  }
}

export async function localizarPorGps(): Promise<Coordenadas> {
  const permissao = await Location.requestForegroundPermissionsAsync();

  if (permissao.status !== "granted") {
    throw new Error(
      "Permissão de localização negada. Autorize o acesso à localização nas configurações do aplicativo.",
    );
  }

  const servicosAtivos = await Location.hasServicesEnabledAsync();

  if (!servicosAtivos) {
    throw new Error(
      "O GPS está desativado. Ative a localização do dispositivo e tente novamente.",
    );
  }

  try {
    const posicao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = posicao.coords;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("COORDENADAS_INVALIDAS");
    }

    return {
      latitude,
      longitude,
    };
  } catch {
    throw new Error(
      "Não foi possível obter sua localização atual. Verifique o sinal do GPS e tente novamente.",
    );
  }
}

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

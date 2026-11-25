import Storage from "expo-sqlite/kv-store";

export type CoordenadasRota = {
  latitude: number;
  longitude: number;
};

export type ParadaRota = CoordenadasRota & {
  id: number;
  empresa: string;
  status: string;
};

export type ResultadoRota = {
  paradas: ParadaRota[];
  coordenadas: [number, number][];
  distanciaMetros: number;
  duracaoSegundos: number;
};

type RotaSalva = { chave: string; resultado: ResultadoRota };

export function chaveDasParadas(paradas: ParadaRota[]): string {
  return JSON.stringify(
    [...paradas].sort((a, b) => a.id - b.id)
      .map(({ id, latitude, longitude }) => [id, latitude, longitude]),
  );
}

export async function lerRotaSalva(
  jornadaId: number,
  chave: string,
): Promise<ResultadoRota | null> {
  try {
    const valor = await Storage.getItemAsync(`rota-jornada:${jornadaId}`);
    if (!valor) return null;

    const salva = JSON.parse(valor) as RotaSalva;
    return salva.chave === chave ? salva.resultado : null;
  } catch {
    return null;
  }
}

export async function calcularESalvarRota(
  jornadaId: number,
  origem: CoordenadasRota,
  paradas: ParadaRota[],
  signal: AbortSignal,
): Promise<ResultadoRota> {
  const resultado = await roteirizacaoService.otimizar(origem, paradas, signal);
  if (!signal.aborted) {
    const salva: RotaSalva = { chave: chaveDasParadas(paradas), resultado };
    try {
      await Storage.setItemAsync(`rota-jornada:${jornadaId}`, JSON.stringify(salva));
    } catch (erro) {
      console.warn("Não foi possível guardar a rota no aparelho.", erro);
    }
  }
  return resultado;
}

type WaypointOSRM = {
  waypoint_index: number;
  trips_index?: number;
};

type TrajetoOSRM = {
  distance: number;
  duration: number;
  geometry: {
    type: string;
    coordinates: number[][];
  };
};

type RespostaOSRM = {
  code: string;
  message?: string;
  trips?: TrajetoOSRM[];
  routes?: TrajetoOSRM[];
  waypoints?: WaypointOSRM[];
};

const OSRM_URL = "https://router.project-osrm.org";

function formatarCoordenada(ponto: CoordenadasRota) {
  return `${ponto.longitude},${ponto.latitude}`;
}

async function consultarOSRM(
  url: string,
  signal?: AbortSignal,
): Promise<RespostaOSRM> {
  const resposta = await fetch(url, { signal });

  if (!resposta.ok) {
    throw new Error(`OSRM_HTTP_${resposta.status}`);
  }

  const dados = (await resposta.json()) as RespostaOSRM;

  if (dados.code !== "Ok") {
    throw new Error(dados.message || dados.code);
  }

  return dados;
}

function validarTrajeto(
  trajeto: TrajetoOSRM | undefined,
): asserts trajeto is TrajetoOSRM {
  if (
    !trajeto ||
    !Number.isFinite(trajeto.distance) ||
    !Number.isFinite(trajeto.duration) ||
    trajeto.geometry?.type !== "LineString" ||
    !Array.isArray(trajeto.geometry.coordinates) ||
    trajeto.geometry.coordinates.length < 2
  ) {
    throw new Error("TRAJETO_INVALIDO");
  }
}

function extrairCoordenadas(trajeto: TrajetoOSRM): [number, number][] {
  return trajeto.geometry.coordinates.map((coordenada) => {
    const [longitude, latitude] = coordenada;

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
      throw new Error("COORDENADAS_INVALIDAS");
    }

    return [longitude, latitude];
  });
}

export const roteirizacaoService = {
  async otimizar(
    origem: CoordenadasRota,
    paradas: ParadaRota[],
    signal?: AbortSignal,
  ): Promise<ResultadoRota> {
    if (paradas.length === 0) {
      return {
        paradas: [],
        coordenadas: [],
        distanciaMetros: 0,
        duracaoSegundos: 0,
      };
    }

    const pontos = [origem, ...paradas];

    const coordenadas = pontos.map(formatarCoordenada).join(";");

    // Para uma única entrega, basta calcular o trajeto.
    if (paradas.length === 1) {
      const url =
        `${OSRM_URL}/route/v1/driving/${coordenadas}` +
        "?overview=full&geometries=geojson&steps=false";

      const dados = await consultarOSRM(url, signal);
      const trajeto = dados.routes?.[0];

      validarTrajeto(trajeto);

      return {
        paradas,
        coordenadas: extrairCoordenadas(trajeto),
        distanciaMetros: trajeto.distance,
        duracaoSegundos: trajeto.duration,
      };
    }

    // Origem fixa no GPS, destino final livre,
    // sem obrigar o motorista a voltar à origem.
    const url =
      `${OSRM_URL}/trip/v1/driving/${coordenadas}` +
      "?source=first" +
      "&destination=any" +
      "&roundtrip=false" +
      "&overview=full" +
      "&geometries=geojson" +
      "&steps=false";

    const dados = await consultarOSRM(url, signal);
    const trajeto = dados.trips?.[0];

    validarTrajeto(trajeto);

    if (!dados.waypoints || dados.waypoints.length !== pontos.length) {
      throw new Error("ORDEM_DAS_PARADAS_INVALIDA");
    }

    const origemCalculada = dados.waypoints[0];

    if (origemCalculada.waypoint_index !== 0) {
      throw new Error("ORIGEM_DIFERENTE_DO_GPS");
    }

    const paradasOrdenadas = paradas
      .map((parada, indice) => ({
        parada,
        ordem: dados.waypoints![indice + 1].waypoint_index,
      }))
      .sort((a, b) => a.ordem - b.ordem)
      .map((item) => item.parada);

    return {
      paradas: paradasOrdenadas,
      coordenadas: extrairCoordenadas(trajeto),
      distanciaMetros: trajeto.distance,
      duracaoSegundos: trajeto.duration,
    };
  },
};

import { entregaRepository } from "@/database/repositories/entregaRepository";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

interface EstatisticasEntregas {
  total: number;
  realizadas: number;
  pendentes: number;
}

const ESTATISTICAS_INICIAIS: EstatisticasEntregas = {
  total: 0,
  realizadas: 0,
  pendentes: 0,
};

export function useEntregasStats(diaTrabalhoId: number | undefined) {
  const [estatisticas, setEstatisticas] = useState<EstatisticasEntregas>(
    ESTATISTICAS_INICIAIS,
  );

  const [carregando, setCarregando] = useState(false);

  const [erro, setErro] = useState<string | null>(null);

  // Buscar estatísticas atualizadas no SQLite
  const recarregar = useCallback(async () => {
    if (diaTrabalhoId === undefined) {
      setEstatisticas(ESTATISTICAS_INICIAIS);
      setErro(null);
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro(null);

      const entregas =
        await entregaRepository.findByDiaTrabalhoId(diaTrabalhoId);

      const realizadas = entregas.filter(
        (entrega) => entrega.status === "realizada",
      ).length;

      const pendentes = entregas.filter(
        (entrega) => entrega.status === "pendente",
      ).length;

      setEstatisticas({
        total: entregas.length,
        realizadas,
        pendentes,
      });
    } catch (error) {
      setErro("Não foi possível carregar as estatísticas das entregas.");
    } finally {
      setCarregando(false);
    }
  }, [diaTrabalhoId]);

  // Atualizar sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      void recarregar();
    }, [recarregar]),
  );

  return {
    ...estatisticas,
    carregando,
    erro,
    recarregar,
  };
}

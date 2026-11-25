import { diaTrabalhoRepository } from "@/database/repositories/diaTrabalhoRepository";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

type DiaTrabalho = NonNullable<
  Awaited<ReturnType<typeof diaTrabalhoRepository.findById>>
>;

function obterDataAtual(hoje = new Date()): string {
  return [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");
}

function obterLimiteDoTurno(jornada: DiaTrabalho): number {
  const inicio = jornada.inicioEm ? new Date(jornada.inicioEm) : null;
  const limite = inicio
    ? new Date(inicio.getTime())
    : new Date(`${jornada.data}T00:00:00`);
  limite.setHours(5, 30, 0, 0);

  if (inicio && limite.getTime() <= inicio.getTime()) {
    limite.setDate(limite.getDate() + 1);
  }

  return limite.getTime();
}

async function buscarJornadaAberta(usuarioId: number) {
  let jornada = await diaTrabalhoRepository.findAbertaByUsuarioId(usuarioId);

  while (jornada) {
    const limite = obterLimiteDoTurno(jornada);
    if (Number.isNaN(limite) || limite > Date.now()) {
      return jornada;
    }

    await diaTrabalhoRepository.finalizar(jornada.id, new Date(limite).toISOString());
    jornada = await diaTrabalhoRepository.findAbertaByUsuarioId(usuarioId);
  }

  return null;
}

export function useJornada(usuarioId: number | undefined) {
  const [diaTrabalho, setDiaTrabalho] = useState<DiaTrabalho | null>(null);
  const [usuarioCarregado, setUsuarioCarregado] = useState<number | undefined>();
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const operacaoEmAndamento = useRef(false);
  const leituraEmAndamento = useRef<Promise<void> | null>(null);

  const recarregar = useCallback(async () => {
    if (usuarioId === undefined) {
      setDiaTrabalho(null);
      setUsuarioCarregado(undefined);
      return;
    }

    if (operacaoEmAndamento.current) return;
    if (leituraEmAndamento.current) return leituraEmAndamento.current;

    leituraEmAndamento.current = (async () => {
      try {
        const jornada =
          (await buscarJornadaAberta(usuarioId)) ??
          (await diaTrabalhoRepository.findByUsuarioAndData(usuarioId, obterDataAtual()));

        setDiaTrabalho(jornada);
        setErro(null);
      } catch {
        setErro("Não foi possível carregar a jornada.");
      } finally {
        leituraEmAndamento.current = null;
        setUsuarioCarregado(usuarioId);
      }
    })();

    return leituraEmAndamento.current;
  }, [usuarioId]);

  useEffect(() => {
    void recarregar();

    const assinatura = AppState.addEventListener("change", (estado) => {
      if (estado === "active") void recarregar();
    });

    return () => assinatura.remove();
  }, [recarregar]);

  useEffect(() => {
    if (!diaTrabalho) return;

    const proximaMeiaNoite = new Date();
    proximaMeiaNoite.setHours(24, 0, 0, 0);
    const limite = diaTrabalho.status === "aberto"
      ? obterLimiteDoTurno(diaTrabalho)
      : proximaMeiaNoite.getTime();

    if (Number.isNaN(limite)) return;

    let ativo = true;
    let timer = setTimeout(verificarTurno, Math.max(0, limite - Date.now()));

    async function verificarTurno() {
      await recarregar();
      if (ativo) timer = setTimeout(verificarTurno, 30_000);
    }

    return () => {
      ativo = false;
      clearTimeout(timer);
    };
  }, [diaTrabalho, recarregar]);

  const iniciarJornada = useCallback(async () => {
    if (usuarioId === undefined || operacaoEmAndamento.current) return;

    operacaoEmAndamento.current = true;
    setProcessando(true);
    setErro(null);

    try {
      await leituraEmAndamento.current;
      const jornadaAberta = await buscarJornadaAberta(usuarioId);
      const inicio = new Date();
      const data = obterDataAtual(inicio);
      const existente = jornadaAberta ??
        (await diaTrabalhoRepository.findByUsuarioAndData(usuarioId, data));

      const jornada = existente ?? await diaTrabalhoRepository.create({
        usuarioId,
        data,
        inicioEm: inicio.toISOString(),
        fimEm: null,
        status: "aberto",
        observacoes: null,
      });

      setDiaTrabalho(jornada);
    } catch {
      setErro("Não foi possível iniciar a jornada.");
    } finally {
      operacaoEmAndamento.current = false;
      setProcessando(false);
    }
  }, [usuarioId]);

  const finalizarJornada = useCallback(async () => {
    if (!diaTrabalho || diaTrabalho.status !== "aberto" || operacaoEmAndamento.current) {
      return;
    }

    const agora = Date.now();
    const limite = obterLimiteDoTurno(diaTrabalho);
    const fimEm = new Date(limite <= agora ? limite : agora).toISOString();

    operacaoEmAndamento.current = true;
    setProcessando(true);
    setErro(null);

    try {
      await leituraEmAndamento.current;
      const jornada =
        (await diaTrabalhoRepository.finalizar(diaTrabalho.id, fimEm)) ??
        (await diaTrabalhoRepository.findById(diaTrabalho.id));

      setDiaTrabalho(jornada);
    } catch {
      setErro("Não foi possível finalizar a jornada.");
    } finally {
      operacaoEmAndamento.current = false;
      setProcessando(false);
    }
  }, [diaTrabalho]);

  return {
    diaTrabalho,
    carregando: usuarioCarregado !== usuarioId,
    processando,
    erro,
    recarregar,
    iniciarJornada,
    finalizarJornada,
  };
}

import { diaTrabalhoRepository } from "@/database/repositories/diaTrabalhoRepository";
import { useCallback, useEffect, useRef, useState } from "react";

type DiaTrabalho = NonNullable<
  Awaited<ReturnType<typeof diaTrabalhoRepository.findById>>
>;

function obterDataAtual(): string {
  const hoje = new Date();

  return [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");
}

export function useJornada(usuarioId: number | undefined) {
  const [diaTrabalho, setDiaTrabalho] = useState<DiaTrabalho | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const operacaoEmAndamento = useRef(false);

  // Buscar jornada do dia atual
  const recarregar = useCallback(async () => {
    if (usuarioId === undefined) {
      setDiaTrabalho(null);
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro(null);

      const jornada = await diaTrabalhoRepository.findByUsuarioAndData(
        usuarioId,
        obterDataAtual(),
      );

      setDiaTrabalho(jornada);
    } catch (error) {
      console.error("[JORNADA] Erro ao carregar:", error);
      setErro("Não foi possível carregar a jornada.");
    } finally {
      setCarregando(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  // Iniciar jornada
  const iniciarJornada = useCallback(async () => {
    if (usuarioId === undefined || diaTrabalho || operacaoEmAndamento.current) {
      return;
    }

    operacaoEmAndamento.current = true;
    setProcessando(true);
    setErro(null);

    try {
      const dataAtual = obterDataAtual();

      // Evita duplicação da jornada
      const existente = await diaTrabalhoRepository.findByUsuarioAndData(
        usuarioId,
        dataAtual,
      );

      if (existente) {
        setDiaTrabalho(existente);
        return;
      }

      const jornada = await diaTrabalhoRepository.create({
        usuarioId,
        data: dataAtual,
        inicioEm: new Date().toISOString(),
        fimEm: null,
        status: "aberto",
        observacoes: null,
      });

      setDiaTrabalho(jornada);
    } catch (error) {
      console.error("[JORNADA] Erro ao iniciar:", error);
      setErro("Não foi possível iniciar a jornada.");
    } finally {
      operacaoEmAndamento.current = false;
      setProcessando(false);
    }
  }, [usuarioId, diaTrabalho]);

  // Finalizar jornada
  const finalizarJornada = useCallback(async () => {
    if (
      !diaTrabalho ||
      diaTrabalho.status !== "aberto" ||
      operacaoEmAndamento.current
    ) {
      return;
    }

    operacaoEmAndamento.current = true;
    setProcessando(true);
    setErro(null);

    try {
      const jornada = await diaTrabalhoRepository.finalizar(diaTrabalho.id);

      if (!jornada) {
        throw new Error("A jornada não está mais aberta.");
      }

      setDiaTrabalho(jornada);
    } catch (error) {
      console.error("[JORNADA] Erro ao finalizar:", error);
      setErro("Não foi possível finalizar a jornada.");

      await recarregar();
    } finally {
      operacaoEmAndamento.current = false;
      setProcessando(false);
    }
  }, [diaTrabalho, recarregar]);

  return {
    diaTrabalho,
    carregando,
    processando,
    erro,
    recarregar,
    iniciarJornada,
    finalizarJornada,
  };
}

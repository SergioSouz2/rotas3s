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

  // Recuperar a jornada ativa ou a jornada de hoje
  const recarregar = useCallback(async () => {
    if (usuarioId === undefined) {
      setDiaTrabalho(null);
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro(null);

      // Prioridade: jornada que continua aberta
      const jornadaAberta =
        await diaTrabalhoRepository.findAbertaByUsuarioId(usuarioId);

      if (jornadaAberta) {
        setDiaTrabalho(jornadaAberta);
        return;
      }

      // Sem jornada aberta, consultar o dia atual
      const jornadaHoje = await diaTrabalhoRepository.findByUsuarioAndData(
        usuarioId,
        obterDataAtual(),
      );

      setDiaTrabalho(jornadaHoje);
    } catch (error) {
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
      // Verificar se existe jornada aberta
      const jornadaAberta =
        await diaTrabalhoRepository.findAbertaByUsuarioId(usuarioId);

      if (jornadaAberta) {
        setDiaTrabalho(jornadaAberta);
        return;
      }

      const dataAtual = obterDataAtual();

      // Verificar se já existe jornada hoje
      const existente = await diaTrabalhoRepository.findByUsuarioAndData(
        usuarioId,
        dataAtual,
      );

      if (existente) {
        setDiaTrabalho(existente);
        return;
      }

      // Criar uma nova jornada
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

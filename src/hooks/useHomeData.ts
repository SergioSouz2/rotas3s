import { useCallback } from "react";

import { useJornadaContext } from "@/contexts/JornadaContext";
import { useUsuarioContext } from "@/contexts/UsuarioContext";

export function useHomeData() {
  const { usuario, carregando, erro, recarregarUsuario } = useUsuarioContext();

  const jornadaHook = useJornadaContext();
  const recarregarJornada = jornadaHook.recarregar;

  // Recarrega os dados utilizados na Home
  const recarregar = useCallback(async () => {
    await recarregarUsuario();
    await recarregarJornada();
  }, [recarregarUsuario, recarregarJornada]);

  return {
    usuario,

    diaTrabalho: jornadaHook.diaTrabalho,

    carregando: carregando || jornadaHook.carregando,

    processando: jornadaHook.processando,

    erro: erro || jornadaHook.erro,

    // Atualização completa
    recarregar,

    // Atualização da jornada
    recarregarJornada,

    // Ações da jornada
    iniciarJornada: jornadaHook.iniciarJornada,
    finalizarJornada: jornadaHook.finalizarJornada,
  };
}

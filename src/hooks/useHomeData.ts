import { useCallback } from "react";

import { useJornada } from "./useJornada";
import { useUsuario } from "./useUsuario";

export function useHomeData() {
  const usuarioHook = useUsuario();

  const jornadaHook = useJornada(usuarioHook.usuario?.id);

  // Recarrega os dados utilizados na Home
  const recarregar = useCallback(async () => {
    await usuarioHook.recarregar();
    await jornadaHook.recarregar();
  }, [usuarioHook.recarregar, jornadaHook.recarregar]);

  return {
    usuario: usuarioHook.usuario,
    diaTrabalho: jornadaHook.diaTrabalho,

    carregando: usuarioHook.carregando || jornadaHook.carregando,

    processando: jornadaHook.processando,

    erro: usuarioHook.erro || jornadaHook.erro,

    recarregar,

    iniciarJornada: jornadaHook.iniciarJornada,
    finalizarJornada: jornadaHook.finalizarJornada,
  };
}

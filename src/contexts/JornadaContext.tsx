import { useJornada } from "@/hooks/useJornada";
import { createContext, useContext, type ReactNode } from "react";
import { useUsuarioContext } from "./UsuarioContext";

const JornadaContext = createContext<ReturnType<typeof useJornada> | null>(null);

export function JornadaProvider({ children }: { children: ReactNode }) {
  const { usuario } = useUsuarioContext();
  const jornada = useJornada(usuario?.id);

  return (
    <JornadaContext.Provider value={jornada}>
      {children}
    </JornadaContext.Provider>
  );
}

export function useJornadaContext() {
  const jornada = useContext(JornadaContext);
  if (!jornada) {
    throw new Error("useJornadaContext deve ser usado dentro de JornadaProvider.");
  }
  return jornada;
}

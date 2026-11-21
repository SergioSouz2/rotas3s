import { usuarioRepository } from "@/database/repositories/usuarioRepository";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Usuario = NonNullable<
  Awaited<ReturnType<typeof usuarioRepository.findById>>
>;

interface UsuarioContextData {
  usuario: Usuario | null;
  carregando: boolean;
  erro: string | null;
  recarregarUsuario: () => Promise<void>;
}

const UsuarioContext = createContext<UsuarioContextData | undefined>(undefined);

export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregarUsuario = useCallback(async () => {
    try {
      setErro(null);

      const usuarios = await usuarioRepository.findAll();

      console.log("[USUARIO] Total de usuários:", usuarios.length);

      setUsuario(usuarios[0] ?? null);
    } catch (error) {
      console.error("[USUARIO] Erro ao carregar usuário:", error);

      setErro("Não foi possível carregar o perfil.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void recarregarUsuario();
  }, [recarregarUsuario]);

  return (
    <UsuarioContext.Provider
      value={{
        usuario,
        carregando,
        erro,
        recarregarUsuario,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuarioContext() {
  const context = useContext(UsuarioContext);

  if (!context) {
    throw new Error(
      "useUsuarioContext deve ser usado dentro de UsuarioProvider.",
    );
  }

  return context;
}

import { usuarioRepository } from "@/database/repositories/usuarioRepository";
import { useCallback, useEffect, useState } from "react";

type Usuario = NonNullable<
  Awaited<ReturnType<typeof usuarioRepository.findById>>
>;

export function useUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      // Temporário: utiliza o primeiro usuário cadastrado.
      // Futuramente será substituído pelo usuário autenticado.
      const usuarios = await usuarioRepository.findAll();

      setUsuario(usuarios[0] ?? null);
    } catch (error) {
      console.error("[USUARIO] Erro ao carregar:", error);
      setErro("Não foi possível carregar o usuário.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  return {
    usuario,
    carregando,
    erro,
    recarregar,
  };
}

import { diaTrabalhoRepository } from "@/database/repositories/diaTrabalhoRepository";
import { usuarioRepository } from "@/database/repositories/usuarioRepository";
import { useCallback, useEffect, useRef, useState } from "react";

type Usuario = NonNullable<
  Awaited<ReturnType<typeof usuarioRepository.findById>>
>;

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

export function useHomeData() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [diaTrabalho, setDiaTrabalho] = useState<DiaTrabalho | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const operacaoEmAndamento = useRef(false);

  const recarregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      // Temporário: primeiro usuário cadastrado.
      // Futuramente utilizaremos o usuário autenticado.
      const usuarios = await usuarioRepository.findAll();
      const usuarioAtual = usuarios[0] ?? null;

      if (!usuarioAtual) {
        setUsuario(null);
        setDiaTrabalho(null);
        return;
      }

      const jornadaAtual = await diaTrabalhoRepository.findByUsuarioAndData(
        usuarioAtual.id,
        obterDataAtual(),
      );

      setUsuario(usuarioAtual);
      setDiaTrabalho(jornadaAtual);
    } catch (error) {
      console.error("[HOME] Erro ao carregar dados:", error);
      setErro("Não foi possível carregar os dados da Home.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  const iniciarJornada = useCallback(async () => {
    if (!usuario || diaTrabalho || operacaoEmAndamento.current) return;

    operacaoEmAndamento.current = true;
    setProcessando(true);
    setErro(null);

    try {
      const dataAtual = obterDataAtual();

      // Confere novamente antes de criar, evitando duplicação
      // por uma tela que esteja com dados desatualizados.
      const existente = await diaTrabalhoRepository.findByUsuarioAndData(
        usuario.id,
        dataAtual,
      );

      if (existente) {
        setDiaTrabalho(existente);
        return;
      }

      const jornada = await diaTrabalhoRepository.create({
        usuarioId: usuario.id,
        data: dataAtual,
        inicioEm: new Date().toISOString(),
        fimEm: null,
        status: "aberto",
        observacoes: null,
      });

      setDiaTrabalho(jornada);
    } catch (error) {
      console.error("[HOME] Erro ao iniciar jornada:", error);
      setErro("Não foi possível iniciar a jornada.");
    } finally {
      operacaoEmAndamento.current = false;
      setProcessando(false);
    }
  }, [usuario, diaTrabalho]);

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
      console.error("[HOME] Erro ao finalizar jornada:", error);
      setErro("Não foi possível finalizar a jornada.");
      await recarregar();
    } finally {
      operacaoEmAndamento.current = false;
      setProcessando(false);
    }
  }, [diaTrabalho, recarregar]);

  return {
    usuario,
    diaTrabalho,
    carregando,
    processando,
    erro,
    recarregar,
    iniciarJornada,
    finalizarJornada,
  };
}

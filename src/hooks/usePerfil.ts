import { usuarioRepository } from "@/database/repositories/usuarioRepository";
import { useUsuario } from "@/hooks/useUsuario";
import { useCallback, useEffect, useState } from "react";

export function usePerfil() {
  const { usuario, carregando, erro, recarregar } = useUsuario();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!usuario) return;

    setNome(usuario.nome);
    setEmail(usuario.email);
    setTelefone(usuario.telefone ?? "");
    setCpf(usuario.cpf ?? "");
    setDataNascimento(usuario.dataNascimento ?? "");
  }, [usuario]);

  const salvarPerfil = useCallback(async () => {
    if (!nome.trim()) {
      throw new Error("Informe seu nome completo.");
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      throw new Error("Informe um e-mail válido.");
    }

    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length > 0 && cpfLimpo.length !== 11) {
      throw new Error("O CPF deve conter 11 dígitos.");
    }

    const telefoneLimpo = telefone.replace(/\D/g, "");

    if (telefoneLimpo.length > 0 && ![10, 11].includes(telefoneLimpo.length)) {
      throw new Error("Informe um telefone válido com DDD.");
    }

    setSalvando(true);

    try {
      const dados = {
        nome: nome.trim(),
        email: emailNormalizado,
        telefone: telefoneLimpo || null,
        cpf: cpfLimpo || null,
        dataNascimento: dataNascimento.trim() || null,
      };

      if (usuario) {
        await usuarioRepository.update(usuario.id, dados);
      } else {
        await usuarioRepository.create(dados);
      }

      await recarregar();
    } finally {
      setSalvando(false);
    }
  }, [nome, email, telefone, cpf, dataNascimento, usuario, recarregar]);

  return {
    usuario,
    carregando,
    erro,
    salvando,

    nome,
    setNome,

    email,
    setEmail,

    telefone,
    setTelefone,

    cpf,
    setCpf,

    dataNascimento,
    setDataNascimento,

    salvarPerfil,
  };
}

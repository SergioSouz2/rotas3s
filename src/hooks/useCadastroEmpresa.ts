import { consultarCnpj } from "@/services/cnpjService";
import {
    formatarCnpj,
    formatarTelefone,
    somenteNumeros,
    validarCnpj,
} from "@/utils/cnpj/cnpj";
import { useRef, useState } from "react";
import { Alert } from "react-native";

export function useCadastroEmpresa() {
  // Identificação
  const [cnpj, setCnpj] = useState("");

  // Dados da empresa
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [telefone, setTelefone] = useState("");

  // Endereços
  const [enderecoCadastral, setEnderecoCadastral] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");

  // Informações adicionais
  const [observacoes, setObservacoes] = useState("");

  // Controle da consulta
  const [buscandoCnpj, setBuscandoCnpj] = useState(false);

  // Identifica consultas antigas
  const versaoCnpj = useRef(0);
  const consultaEmAndamento = useRef(false);

  // Controla o endereço de entrega preenchido manualmente
  const enderecoEntregaEditado = useRef(false);

  function limparDadosEmpresa() {
    setRazaoSocial("");
    setNomeFantasia("");
    setTelefone("");
    setEnderecoCadastral("");
    setEnderecoEntrega("");
    setObservacoes("");

    enderecoEntregaEditado.current = false;
  }

  function atualizarCnpj(valor: string) {
    const novoCnpj = formatarCnpj(valor);

    if (somenteNumeros(novoCnpj) === somenteNumeros(cnpj)) {
      return;
    }

    // Invalida qualquer consulta anterior.
    versaoCnpj.current += 1;

    setCnpj(novoCnpj);

    // Evita misturar dados de empresas diferentes.
    limparDadosEmpresa();
  }

  function atualizarTelefone(valor: string) {
    setTelefone(formatarTelefone(valor));
  }

  function atualizarEnderecoEntrega(valor: string) {
    enderecoEntregaEditado.current = true;
    setEnderecoEntrega(valor);
  }

  async function buscarCnpj() {
    if (consultaEmAndamento.current) {
      return;
    }

    if (!validarCnpj(cnpj)) {
      Alert.alert(
        "CNPJ inválido",
        "Informe um CNPJ válido para consultar os dados oficiais.",
      );
      return;
    }

    const versaoConsulta = versaoCnpj.current;

    consultaEmAndamento.current = true;
    setBuscandoCnpj(true);

    try {
      const dados = await consultarCnpj(cnpj);

      // Ignora o resultado se o CNPJ foi alterado
      // enquanto a consulta estava em andamento.
      if (versaoConsulta !== versaoCnpj.current) {
        return;
      }

      setRazaoSocial(dados.razaoSocial);
      setNomeFantasia(dados.nomeFantasia);
      setTelefone(dados.telefone);
      setEnderecoCadastral(dados.enderecoCadastral);

      // Preenche automaticamente apenas quando o motorista
      // ainda não editou o endereço de entrega.
      if (!enderecoEntregaEditado.current) {
        setEnderecoEntrega(dados.enderecoCadastral);
      }
    } catch (erro) {
      if (versaoConsulta !== versaoCnpj.current) {
        return;
      }

      Alert.alert(
        "Erro na consulta",
        erro instanceof Error
          ? erro.message
          : "Não foi possível consultar os dados da empresa.",
      );
    } finally {
      consultaEmAndamento.current = false;
      setBuscandoCnpj(false);
    }
  }

  function atualizarLocalizacao() {
    Alert.alert(
      "Localização",
      "A localização pelo endereço e GPS será implementada na próxima etapa.",
    );
  }

  function salvarEmpresa() {
    Alert.alert(
      "Cadastro de empresa",
      "O salvamento no SQLite será implementado posteriormente.",
    );
  }

  return {
    // Valores
    cnpj,
    razaoSocial,
    nomeFantasia,
    telefone,
    enderecoCadastral,
    enderecoEntrega,
    observacoes,
    buscandoCnpj,

    // Atualização
    setCnpj: atualizarCnpj,
    setRazaoSocial,
    setNomeFantasia,
    setTelefone: atualizarTelefone,
    setEnderecoCadastral,
    setEnderecoEntrega: atualizarEnderecoEntrega,
    setObservacoes,

    // Ações
    buscarCnpj,
    atualizarLocalizacao,
    salvarEmpresa,
  };
}

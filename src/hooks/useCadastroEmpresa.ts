import { consultarCnpj } from "@/services/cnpjService";
import {
    Coordenadas,
    localizarPorEndereco,
} from "@/services/localizacaoService";

import {
    formatarCnpj,
    formatarTelefone,
    somenteNumeros,
    validarCnpj,
} from "@/utils/cnpj/cnpj";

import * as Location from "expo-location";
import { useRef, useState } from "react";
import { Alert, Platform } from "react-native";

type OrigemLocalizacao = "automatica" | "gps" | "manual";

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

  // Estados da consulta
  const [buscandoCnpj, setBuscandoCnpj] = useState(false);
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false);

  // Localização
  const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(null);

  const [origemLocalizacao, setOrigemLocalizacao] =
    useState<OrigemLocalizacao | null>(null);

  const [localizacaoNaoEncontrada, setLocalizacaoNaoEncontrada] =
    useState(false);

  // Controle de respostas antigas
  const versaoCnpj = useRef(0);
  const versaoEndereco = useRef(0);

  const consultaEmAndamento = useRef(false);
  const enderecoEntregaEditado = useRef(false);

  function invalidarLocalizacao() {
    versaoEndereco.current += 1;

    setCoordenadas(null);
    setOrigemLocalizacao(null);
    setLocalizacaoNaoEncontrada(false);
  }

  function limparDadosEmpresa() {
    setRazaoSocial("");
    setNomeFantasia("");
    setTelefone("");
    setEnderecoCadastral("");
    setEnderecoEntrega("");
    setObservacoes("");

    enderecoEntregaEditado.current = false;

    invalidarLocalizacao();
  }

  function atualizarCnpj(valor: string) {
    const novoCnpj = formatarCnpj(valor);

    if (somenteNumeros(novoCnpj) === somenteNumeros(cnpj)) {
      return;
    }

    versaoCnpj.current += 1;

    setCnpj(novoCnpj);
    limparDadosEmpresa();
  }

  function atualizarTelefone(valor: string) {
    setTelefone(formatarTelefone(valor));
  }

  function atualizarEnderecoEntrega(valor: string) {
    enderecoEntregaEditado.current = true;

    setEnderecoEntrega(valor);
    invalidarLocalizacao();
  }

  async function buscarLocalizacaoAutomatica(
    endereco: string,
    versaoConsultaCnpj: number,
  ) {
    const versaoConsultaEndereco = versaoEndereco.current;

    setBuscandoLocalizacao(true);
    setLocalizacaoNaoEncontrada(false);

    try {
      // Android pode exigir permissão para geocodificação.
      if (Platform.OS === "android") {
        const permissao = await Location.requestForegroundPermissionsAsync();

        if (permissao.status !== "granted") {
          throw new Error("PERMISSAO_NEGADA");
        }
      }

      if (
        versaoConsultaCnpj !== versaoCnpj.current ||
        versaoConsultaEndereco !== versaoEndereco.current
      ) {
        return;
      }

      const resultado = await localizarPorEndereco(endereco);

      if (
        versaoConsultaCnpj !== versaoCnpj.current ||
        versaoConsultaEndereco !== versaoEndereco.current
      ) {
        return;
      }

      setCoordenadas(resultado);
      setOrigemLocalizacao("automatica");
      setLocalizacaoNaoEncontrada(false);
    } catch {
      if (
        versaoConsultaCnpj !== versaoCnpj.current ||
        versaoConsultaEndereco !== versaoEndereco.current
      ) {
        return;
      }

      setCoordenadas(null);
      setOrigemLocalizacao(null);
      setLocalizacaoNaoEncontrada(true);
    } finally {
      setBuscandoLocalizacao(false);
    }
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

      if (versaoConsulta !== versaoCnpj.current) {
        return;
      }

      // Preenche dados oficiais
      setRazaoSocial(dados.razaoSocial);
      setNomeFantasia(dados.nomeFantasia);
      setTelefone(dados.telefone);
      setEnderecoCadastral(dados.enderecoCadastral);

      // Só preenche automaticamente se o motorista
      // ainda não personalizou o endereço.
      if (!enderecoEntregaEditado.current) {
        setEnderecoEntrega(dados.enderecoCadastral);
        invalidarLocalizacao();
      }

      // Localiza o endereço de entrega escolhido.
      const enderecoParaLocalizar = enderecoEntregaEditado.current
        ? enderecoEntrega
        : dados.enderecoCadastral;

      if (enderecoParaLocalizar.trim()) {
        await buscarLocalizacaoAutomatica(
          enderecoParaLocalizar,
          versaoConsulta,
        );
      } else {
        setLocalizacaoNaoEncontrada(true);
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
      "Atualizar localização",
      "A correção pelo GPS será utilizada quando o motorista chegar ao ponto de entrega.",
    );
  }

  function salvarEmpresa() {
    Alert.alert(
      "Cadastro de empresa",
      "O salvamento no SQLite será implementado na próxima etapa.",
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

    // Estados de carregamento
    buscandoCnpj,
    buscandoLocalizacao,

    // Localização
    coordenadas,
    origemLocalizacao,
    localizacaoNaoEncontrada,

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

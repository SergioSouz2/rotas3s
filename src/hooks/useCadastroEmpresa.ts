import { consultarCnpj } from "@/services/cnpjService";

import {
  type Coordenadas,
  localizarPorEndereco,
  localizarPorGps,
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

  // Impede solicitações de GPS simultâneas.
  const gpsEmAndamento = useRef(false);

  // Controla qual operação está atualizando a localização.
  const versaoOperacaoLocalizacao = useRef(0);

  function invalidarLocalizacao() {
    versaoEndereco.current += 1;
    versaoOperacaoLocalizacao.current += 1;

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
    const versaoOperacao = ++versaoOperacaoLocalizacao.current;

    const consultaAtual = () =>
      versaoConsultaCnpj === versaoCnpj.current &&
      versaoConsultaEndereco === versaoEndereco.current &&
      versaoOperacao === versaoOperacaoLocalizacao.current;

    setBuscandoLocalizacao(true);
    setLocalizacaoNaoEncontrada(false);

    try {
      if (Platform.OS === "android") {
        const permissao = await Location.requestForegroundPermissionsAsync();

        if (permissao.status !== "granted") {
          throw new Error("PERMISSAO_NEGADA");
        }
      }

      if (!consultaAtual()) {
        return;
      }

      const resultado = await localizarPorEndereco(endereco);

      if (!consultaAtual()) {
        return;
      }

      setCoordenadas(resultado);
      setOrigemLocalizacao("automatica");
      setLocalizacaoNaoEncontrada(false);
    } catch {
      if (!consultaAtual()) {
        return;
      }

      setCoordenadas(null);
      setOrigemLocalizacao(null);
      setLocalizacaoNaoEncontrada(true);
    } finally {
      if (consultaAtual()) {
        setBuscandoLocalizacao(false);
      }
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

      setRazaoSocial(dados.razaoSocial);
      setNomeFantasia(dados.nomeFantasia);
      setTelefone(dados.telefone);
      setEnderecoCadastral(dados.enderecoCadastral);

      if (!enderecoEntregaEditado.current) {
        setEnderecoEntrega(dados.enderecoCadastral);
        invalidarLocalizacao();
      }

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

  async function atualizarLocalizacao() {
    if (gpsEmAndamento.current) {
      return;
    }

    gpsEmAndamento.current = true;

    const versaoConsultaCnpj = versaoCnpj.current;
    const versaoConsultaEndereco = versaoEndereco.current;

    // Invalida operações automáticas anteriores.
    const versaoOperacao = ++versaoOperacaoLocalizacao.current;

    setBuscandoLocalizacao(true);

    try {
      const resultado = await localizarPorGps();

      // Ignora o resultado se o usuário alterou
      // o CNPJ ou o endereço durante a busca.
      if (
        versaoConsultaCnpj !== versaoCnpj.current ||
        versaoConsultaEndereco !== versaoEndereco.current ||
        versaoOperacao !== versaoOperacaoLocalizacao.current
      ) {
        return;
      }

      setCoordenadas(resultado);
      setOrigemLocalizacao("gps");
      setLocalizacaoNaoEncontrada(false);

      Alert.alert(
        "Localização atualizada",
        "O ponto de entrega foi atualizado com sua localização atual.",
      );
    } catch (erro) {
      if (
        versaoConsultaCnpj !== versaoCnpj.current ||
        versaoConsultaEndereco !== versaoEndereco.current ||
        versaoOperacao !== versaoOperacaoLocalizacao.current
      ) {
        return;
      }

      // Preserva as coordenadas anteriores.
      Alert.alert(
        "Não foi possível atualizar",
        erro instanceof Error
          ? erro.message
          : "Falha ao obter a localização pelo GPS.",
      );
    } finally {
      gpsEmAndamento.current = false;

      if (versaoOperacao === versaoOperacaoLocalizacao.current) {
        setBuscandoLocalizacao(false);
      }
    }
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

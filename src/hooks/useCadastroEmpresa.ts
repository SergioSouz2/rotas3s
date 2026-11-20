import { empresaRepository } from "@/database/repositories/empresaRepository";
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
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Platform } from "react-native";

type OrigemLocalizacao = "automatica" | "gps" | "manual";

export function useCadastroEmpresa() {
  const router = useRouter();

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

  // Estados de carregamento
  const [buscandoCnpj, setBuscandoCnpj] = useState(false);
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false);
  const [salvando, setSalvando] = useState(false);

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

  const gpsEmAndamento = useRef(false);
  const salvamentoEmAndamento = useRef(false);

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

    const versaoOperacao = ++versaoOperacaoLocalizacao.current;

    setBuscandoLocalizacao(true);

    try {
      const resultado = await localizarPorGps();

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

  function confirmarLocalizacaoManual(novaPosicao: Coordenadas) {
    versaoOperacaoLocalizacao.current += 1;

    setCoordenadas(novaPosicao);
    setOrigemLocalizacao("manual");
    setLocalizacaoNaoEncontrada(false);
  }

  async function salvarEmpresa() {
    if (salvamentoEmAndamento.current) {
      return;
    }

    if (!validarCnpj(cnpj)) {
      Alert.alert(
        "CNPJ inválido",
        "Informe um CNPJ válido para cadastrar a empresa.",
      );
      return;
    }

    if (!razaoSocial.trim()) {
      Alert.alert("Campo obrigatório", "Informe a razão social da empresa.");
      return;
    }

    if (!enderecoEntrega.trim()) {
      Alert.alert("Campo obrigatório", "Informe o endereço de entrega.");
      return;
    }

    if (
      buscandoCnpj ||
      buscandoLocalizacao ||
      consultaEmAndamento.current ||
      gpsEmAndamento.current
    ) {
      Alert.alert("Aguarde", "Espere a consulta e a localização terminarem.");
      return;
    }

    if (!coordenadas) {
      Alert.alert(
        "Localização obrigatória",
        "Localize o ponto de entrega pelo endereço ou GPS antes de salvar.",
      );
      return;
    }

    salvamentoEmAndamento.current = true;
    setSalvando(true);

    try {
      const cnpjLimpo = somenteNumeros(cnpj);
      const agora = new Date().toISOString();

      // Usa o nome fantasia como nome de exibição.
      // Caso esteja vazio, utiliza a razão social.
      const nomeExibicao = nomeFantasia.trim() || razaoSocial.trim();

      await empresaRepository.create({
        nome: nomeExibicao,
        cnpj: cnpjLimpo,
        razaoSocial: razaoSocial.trim(),
        nomeFantasia: nomeFantasia.trim(),
        telefone: somenteNumeros(telefone),
        endereco: enderecoEntrega.trim(),
        enderecoCadastral: enderecoCadastral.trim(),
        observacoes: observacoes.trim(),
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude,
        origemLocalizacao: origemLocalizacao,
        localizacaoAtualizadaEm: agora,
      });

      Alert.alert("Empresa cadastrada", "A empresa foi salva com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (erro) {
      console.error("Erro ao salvar empresa:", erro);

      const mensagem = erro instanceof Error ? erro.message : "";

      const duplicado =
        mensagem === "CNPJ_JA_CADASTRADO" || /unique|duplicate/i.test(mensagem);

      Alert.alert(
        duplicado ? "Empresa já cadastrada" : "Erro ao salvar empresa",
        duplicado
          ? "Já existe uma empresa cadastrada com este CNPJ."
          : "Não foi possível salvar a empresa no SQLite.",
      );
    } finally {
      salvamentoEmAndamento.current = false;
      setSalvando(false);
    }
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
    salvando,

    // Localização
    coordenadas,
    origemLocalizacao,
    localizacaoNaoEncontrada,
    confirmarLocalizacaoManual,

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

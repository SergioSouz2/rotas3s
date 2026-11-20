import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CadastroEmpresaHeader } from "@/components/empresas/cadastro/CadastroEmpresaHeader";
import { CnpjSection } from "@/components/empresas/cadastro/CnpjSection";
import { DadosEmpresaSection } from "@/components/empresas/cadastro/DadosEmpresaSection";
import { EnderecoSection } from "@/components/empresas/cadastro/EnderecoSection";
import { LocalizacaoSection } from "@/components/empresas/cadastro/LocalizacaoSection";
import { ObservacoesSection } from "@/components/empresas/cadastro/ObservacoesSection";

import { useCadastroEmpresa } from "@/hooks/useCadastroEmpresa";

import { styles } from "./styles";

export function CadastroEmpresaScreen() {
  // Controla a rolagem durante a edição do mapa.
  const [editandoMapa, setEditandoMapa] = useState(false);

  const {
    cnpj,
    razaoSocial,
    nomeFantasia,
    telefone,
    enderecoCadastral,
    enderecoEntrega,
    observacoes,

    buscandoCnpj,
    buscandoLocalizacao,
    salvando,

    setCnpj,
    setRazaoSocial,
    setNomeFantasia,
    setTelefone,
    setEnderecoCadastral,
    setEnderecoEntrega,
    setObservacoes,

    buscarCnpj,
    atualizarLocalizacao,
    confirmarLocalizacaoManual,
    salvarEmpresa,

    coordenadas,
    origemLocalizacao,
    localizacaoNaoEncontrada,
  } = useCadastroEmpresa();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={!editandoMapa}
      >
        <CadastroEmpresaHeader onVoltar={() => router.back()} />

        <View style={styles.body}>
          <CnpjSection
            cnpj={cnpj}
            buscandoCnpj={buscandoCnpj}
            onChangeCnpj={setCnpj}
            onBuscarCnpj={buscarCnpj}
          />

          <DadosEmpresaSection
            razaoSocial={razaoSocial}
            nomeFantasia={nomeFantasia}
            telefone={telefone}
            onChangeRazaoSocial={setRazaoSocial}
            onChangeNomeFantasia={setNomeFantasia}
            onChangeTelefone={setTelefone}
          />

          <EnderecoSection
            enderecoCadastral={enderecoCadastral}
            enderecoEntrega={enderecoEntrega}
            onChangeEnderecoCadastral={setEnderecoCadastral}
            onChangeEnderecoEntrega={setEnderecoEntrega}
          />

          <LocalizacaoSection
            coordenadas={coordenadas}
            origemLocalizacao={origemLocalizacao}
            buscandoLocalizacao={buscandoLocalizacao}
            localizacaoNaoEncontrada={localizacaoNaoEncontrada}
            onAtualizarLocalizacao={atualizarLocalizacao}
            onConfirmarLocalizacaoManual={confirmarLocalizacaoManual}
            onModoEdicaoChange={setEditandoMapa}
          />

          <ObservacoesSection
            observacoes={observacoes}
            onChangeObservacoes={setObservacoes}
          />

          <TouchableOpacity
            style={[styles.botaoSalvar, salvando && { opacity: 0.6 }]}
            onPress={salvarEmpresa}
            disabled={salvando || editandoMapa}
            activeOpacity={0.8}
          >
            {salvando ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#ffffff"
              />
            )}

            <Text style={styles.botaoSalvarTexto}>
              {salvando ? "Salvando empresa..." : "Salvar empresa"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

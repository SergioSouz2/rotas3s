import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
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

import { styles } from "./styles";

export function CadastroEmpresaScreen() {
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enderecoCadastral, setEnderecoCadastral] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [observacoes, setObservacoes] = useState("");

  function handleBuscarCnpj() {
    Alert.alert(
      "Consulta de CNPJ",
      "A busca dos dados oficiais será implementada na próxima etapa.",
    );
  }

  function handleLocalizacao() {
    Alert.alert(
      "Localização",
      "A localização pelo GPS e o mapa serão implementados posteriormente.",
    );
  }

  function handleSalvar() {
    Alert.alert(
      "Cadastro de empresa",
      "A interface está pronta para testes. O salvamento no SQLite será implementado depois.",
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CadastroEmpresaHeader onVoltar={() => router.back()} />

        <View style={styles.body}>
          <CnpjSection
            cnpj={cnpj}
            onChangeCnpj={setCnpj}
            onBuscarCnpj={handleBuscarCnpj}
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

          <LocalizacaoSection onAtualizarLocalizacao={handleLocalizacao} />

          <ObservacoesSection
            observacoes={observacoes}
            onChangeObservacoes={setObservacoes}
          />

          <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
            <Text style={styles.botaoSalvarTexto}>Salvar empresa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

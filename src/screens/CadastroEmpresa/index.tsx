import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
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
  const {
    cnpj,
    razaoSocial,
    nomeFantasia,
    telefone,
    enderecoCadastral,
    enderecoEntrega,
    observacoes,
    buscandoCnpj,

    setCnpj,
    setRazaoSocial,
    setNomeFantasia,
    setTelefone,
    setEnderecoCadastral,
    setEnderecoEntrega,
    setObservacoes,

    buscarCnpj,
    atualizarLocalizacao,
    salvarEmpresa,
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

          <LocalizacaoSection onAtualizarLocalizacao={atualizarLocalizacao} />

          <ObservacoesSection
            observacoes={observacoes}
            onChangeObservacoes={setObservacoes}
          />

          <TouchableOpacity
            style={styles.botaoSalvar}
            onPress={salvarEmpresa}
            activeOpacity={0.8}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#ffffff"
            />

            <Text style={styles.botaoSalvarTexto}>Salvar empresa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

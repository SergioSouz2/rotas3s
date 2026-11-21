import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";

import { CnpjSection } from "@/components/empresas/cadastro/CnpjSection";
import { DadosEmpresaSection } from "@/components/empresas/cadastro/DadosEmpresaSection";
import { EnderecoSection } from "@/components/empresas/cadastro/EnderecoSection";
import { LocalizacaoSection } from "@/components/empresas/cadastro/LocalizacaoSection";
import { ObservacoesSection } from "@/components/empresas/cadastro/ObservacoesSection";

import { useAppSafeArea } from "@/hooks/useAppSafeArea";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCadastroEmpresa } from "@/hooks/useCadastroEmpresa";

import { createStyles } from "./styles";

export function CadastroEmpresaScreen() {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  // SafeArea inferior para evitar a barra de navegação nativa.
  // O AppHeader já controla a SafeArea superior.
  const { bottomStyle } = useAppSafeArea({
    top: false,
    bottom: true,
  });

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

  const botaoDesabilitado = salvando || editandoMapa;

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
        <AppHeader
          titulo="Nova empresa"
          subtitulo="Cadastre um novo ponto de entrega"
          onVoltar={() => router.back()}
        />

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

          {/* Botão protegido pela SafeArea inferior */}
          <View style={bottomStyle}>
            <TouchableOpacity
              style={[
                styles.botaoSalvar,
                botaoDesabilitado && styles.botaoSalvarDesabilitado,
              ]}
              onPress={salvarEmpresa}
              disabled={botaoDesabilitado}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={
                salvando ? "Salvando empresa" : "Salvar empresa"
              }
              accessibilityState={{
                disabled: botaoDesabilitado,
                busy: salvando,
              }}
            >
              {salvando ? (
                <ActivityIndicator size="small" color={colors.textInverse} />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color={colors.textInverse}
                />
              )}

              <Text style={styles.botaoSalvarTexto}>
                {salvando ? "Salvando empresa..." : "Salvar empresa"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

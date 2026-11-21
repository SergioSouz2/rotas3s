import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/AppHeader";
import { useUsuarioContext } from "@/contexts/UsuarioContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { usePerfil } from "@/hooks/usePerfil";

import { createStyles } from "./styles";

export function PerfilScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  // Identifica se estamos no cadastro obrigatório.
  const primeiroAcesso = pathname === "/cadastro-inicial";

  // Contexto global do usuário.
  const { recarregarUsuario } = useUsuarioContext();

  // Hook responsável pelos dados e pelo SQLite.
  const {
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
  } = usePerfil();

  // Bloqueia o botão físico de voltar no cadastro inicial.
  useEffect(() => {
    if (!primeiroAcesso) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    return () => subscription.remove();
  }, [primeiroAcesso]);

  // Salva ou atualiza o perfil.
  async function handleSalvar() {
    try {
      // Persiste os dados no SQLite.
      await salvarPerfil();

      // Atualiza o usuário no contexto global.
      await recarregarUsuario();

      if (primeiroAcesso) {
        // O Stack.Protected libera a Home
        // automaticamente após o cadastro.
        return;
      }

      Alert.alert("Perfil atualizado", "Seus dados foram salvos com sucesso.");
    } catch (error) {
      Alert.alert(
        "Não foi possível salvar",
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      );
    }
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <AppHeader
        titulo={primeiroAcesso ? "Criar meu perfil" : "Meu Perfil"}
        subtitulo={
          primeiroAcesso
            ? "Cadastre seus dados para começar"
            : "Gerencie suas informações pessoais"
        }
        onVoltar={primeiroAcesso ? undefined : () => router.back()}
      />

      {/* CARREGAMENTO */}
      {carregando ? (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : erro ? (
        <View style={styles.carregando}>
          <Text style={styles.erro}>{erro}</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[
              styles.conteudo,
              {
                paddingBottom: insets.bottom + 100,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          >
            {/* AVATAR */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons
                  name="person-outline"
                  size={44}
                  color={theme.colors.primary}
                />
              </View>

              <Text style={styles.nomeUsuario}>{nome || "Motorista"}</Text>

              <Text style={styles.tipoPerfil}>
                {primeiroAcesso
                  ? "Bem-vindo ao 3S Rotas"
                  : "Perfil local • 3S Rotas"}
              </Text>
            </View>

            {/* TÍTULO DO FORMULÁRIO */}
            <Text style={styles.secaoTitulo}>
              {primeiroAcesso
                ? "Cadastre suas informações"
                : "Informações pessoais"}
            </Text>

            {/* FORMULÁRIO */}
            <View style={styles.formulario}>
              {/* NOME */}
              <View style={styles.campo}>
                <Text style={styles.label}>Nome completo *</Text>

                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Digite seu nome completo"
                  placeholderTextColor={theme.colors.text}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              {/* E-MAIL */}
              <View style={styles.campo}>
                <Text style={styles.label}>E-mail *</Text>

                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor={theme.colors.text}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
              </View>

              {/* TELEFONE */}
              <View style={styles.campo}>
                <Text style={styles.label}>Telefone</Text>

                <TextInput
                  style={styles.input}
                  value={telefone}
                  onChangeText={setTelefone}
                  placeholder="DDD + número"
                  placeholderTextColor={theme.colors.text}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>

              {/* CPF */}
              <View style={styles.campo}>
                <Text style={styles.label}>CPF</Text>

                <TextInput
                  style={styles.input}
                  value={cpf}
                  onChangeText={setCpf}
                  placeholder="000.000.000-00"
                  placeholderTextColor={theme.colors.text}
                  keyboardType="numeric"
                  maxLength={14}
                />
              </View>

              {/* DATA DE NASCIMENTO */}
              <View style={styles.campo}>
                <Text style={styles.label}>Data de nascimento</Text>

                <TextInput
                  style={styles.input}
                  value={dataNascimento}
                  onChangeText={setDataNascimento}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={theme.colors.text}
                  maxLength={10}
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* AVISO DE ARMAZENAMENTO */}
            <View style={styles.aviso}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={theme.colors.primary}
              />

              <Text style={styles.avisoTexto}>
                Seus dados serão armazenados localmente neste dispositivo.
              </Text>
            </View>

            {/* BOTÃO SALVAR */}
            <TouchableOpacity
              style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
              onPress={handleSalvar}
              disabled={salvando}
              activeOpacity={0.8}
            >
              {salvando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name={
                      primeiroAcesso
                        ? "checkmark-circle-outline"
                        : "save-outline"
                    }
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text style={styles.botaoTexto}>
                    {primeiroAcesso ? "Concluir cadastro" : "Salvar alterações"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

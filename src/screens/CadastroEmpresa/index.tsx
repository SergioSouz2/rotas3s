import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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
        <View style={styles.header}>
          <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={23} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerTextos}>
            <Text style={styles.headerTitulo}>Nova empresa</Text>
            <Text style={styles.headerSubtitulo}>
              Cadastre um novo ponto de entrega
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.secaoTitulo}>Identificação da empresa</Text>
            <Text style={styles.secaoDescricao}>
              Informe o CNPJ para consultar os dados oficiais.
            </Text>

            <Text style={styles.label}>CNPJ</Text>
            <TextInput
              style={styles.input}
              value={cnpj}
              onChangeText={setCnpj}
              placeholder="00.000.000/0000-00"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              maxLength={18}
            />

            <TouchableOpacity
              style={styles.botaoBuscar}
              onPress={handleBuscarCnpj}
            >
              <Ionicons name="search-outline" size={19} color="#ffffff" />
              <Text style={styles.botaoBuscarTexto}>Buscar dados oficiais</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.secaoTitulo}>Dados da empresa</Text>

            <Text style={styles.label}>Razão social</Text>
            <TextInput
              style={styles.input}
              value={razaoSocial}
              onChangeText={setRazaoSocial}
              placeholder="Razão social"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>Nome fantasia</Text>
            <TextInput
              style={styles.input}
              value={nomeFantasia}
              onChangeText={setNomeFantasia}
              placeholder="Nome da empresa"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.secaoTitulo}>Endereços</Text>

            <Text style={styles.label}>Endereço cadastral</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={enderecoCadastral}
              onChangeText={setEnderecoCadastral}
              placeholder="Endereço registrado no CNPJ"
              placeholderTextColor="#94a3b8"
              multiline
            />

            <Text style={styles.label}>Endereço de entrega</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={enderecoEntrega}
              onChangeText={setEnderecoEntrega}
              placeholder="Local onde a entrega será realizada"
              placeholderTextColor="#94a3b8"
              multiline
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.secaoTitulo}>Localização da entrega</Text>
            <Text style={styles.secaoDescricao}>
              Confirme o ponto de entrega para facilitar a navegação.
            </Text>

            <View style={styles.mapaPlaceholder}>
              <Ionicons name="map-outline" size={40} color="#64748b" />
              <Text style={styles.mapaTexto}>Prévia do mapa</Text>
            </View>

            <TouchableOpacity
              style={styles.botaoLocalizacao}
              onPress={handleLocalizacao}
            >
              <Ionicons name="locate-outline" size={20} color="#102f63" />
              <Text style={styles.botaoLocalizacaoTexto}>
                Atualizar localização pelo GPS
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.secaoTitulo}>Observações</Text>

            <TextInput
              style={[styles.input, styles.observacoes]}
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Referências, entrada de carga, horários..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
            <Text style={styles.botaoSalvarTexto}>Salvar empresa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

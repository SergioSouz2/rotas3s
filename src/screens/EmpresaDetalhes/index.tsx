import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { empresaRepository } from "@/database/repositories/empresaRepository";
import type { Empresa } from "@/database/schema/empresas";

import { styles } from "./styles";

export function EmpresaDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarEmpresa() {
      try {
        const empresaId = Number(id);

        if (!Number.isSafeInteger(empresaId) || empresaId <= 0) {
          throw new Error("ID inválido");
        }

        const resultado = await empresaRepository.findById(empresaId);

        if (ativo) {
          setEmpresa(resultado);
        }
      } catch (erro) {
        console.error("Erro ao buscar empresa:", erro);

        if (ativo) {
          Alert.alert("Erro", "Não foi possível carregar os dados da empresa.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarEmpresa();

    return () => {
      ativo = false;
    };
  }, [id]);

  async function abrirNavegacao(aplicativo: "google" | "waze") {
    if (!empresa || empresa.latitude === null || empresa.longitude === null) {
      Alert.alert(
        "Localização indisponível",
        "Esta empresa não possui coordenadas cadastradas.",
      );
      return;
    }

    const { latitude, longitude } = empresa;

    const url =
      aplicativo === "waze"
        ? `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
        : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Erro", "Não foi possível abrir o aplicativo de navegação.");
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.textoSecundario}>Carregando empresa...</Text>
      </View>
    );
  }

  if (!empresa) {
    return (
      <View style={styles.centro}>
        <Ionicons name="business-outline" size={48} color="#94a3b8" />

        <Text style={styles.titulo}>Empresa não encontrada</Text>

        <TouchableOpacity style={styles.botao} onPress={() => router.back()}>
          <Text style={styles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const possuiLocalizacao =
    empresa.latitude !== null && empresa.longitude !== null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#0f172a" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>{empresa.nome}</Text>

      <Text style={styles.textoSecundario}>
        Informações do ponto de entrega
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Dados da empresa</Text>

        <Text style={styles.label}>Razão social</Text>
        <Text style={styles.valor}>
          {empresa.razaoSocial || "Não informada"}
        </Text>

        <Text style={styles.label}>Nome fantasia</Text>
        <Text style={styles.valor}>
          {empresa.nomeFantasia || "Não informado"}
        </Text>

        <Text style={styles.label}>CNPJ</Text>
        <Text style={styles.valor}>{empresa.cnpj}</Text>

        <Text style={styles.label}>Telefone</Text>
        <Text style={styles.valor}>{empresa.telefone || "Não informado"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Endereços</Text>

        <Text style={styles.label}>Endereço cadastral</Text>
        <Text style={styles.valor}>
          {empresa.enderecoCadastral || "Não informado"}
        </Text>

        <Text style={styles.label}>Endereço de entrega</Text>
        <Text style={styles.valor}>{empresa.endereco}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Geolocalização</Text>

        {possuiLocalizacao ? (
          <>
            <Text style={styles.label}>Latitude</Text>
            <Text style={styles.valor}>{empresa.latitude}</Text>

            <Text style={styles.label}>Longitude</Text>
            <Text style={styles.valor}>{empresa.longitude}</Text>

            <Text style={styles.label}>Origem</Text>
            <Text style={styles.valor}>
              {empresa.origemLocalizacao || "Não informada"}
            </Text>

            <View style={styles.acoes}>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => void abrirNavegacao("google")}
              >
                <Ionicons name="navigate-outline" size={18} color="#ffffff" />
                <Text style={styles.textoBotao}>Google Maps</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botao}
                onPress={() => void abrirNavegacao("waze")}
              >
                <Ionicons name="car-outline" size={18} color="#ffffff" />
                <Text style={styles.textoBotao}>Waze</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.textoSecundario}>
            Localização não cadastrada.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Observações</Text>

        <Text style={styles.valor}>
          {empresa.observacoes || "Nenhuma observação cadastrada."}
        </Text>
      </View>
    </ScrollView>
  );
}

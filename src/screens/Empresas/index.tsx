import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { EmpresaCard } from "@/components/empresas/EmpresaCard/EmpresaCard";
import { EmpresaSearch } from "@/components/empresas/EmpresaSearch";
import { EmpresasEmptyState } from "@/components/empresas/EmpresasEmptyState";
import { EmpresasHeader } from "@/components/empresas/EmpresasHeader";

import { empresaRepository } from "@/database/repositories/empresaRepository";
import type { Empresa } from "@/database/schema/empresas";

import { styles } from "./styles";

export function EmpresasScreen() {
  const [busca, setBusca] = useState("");

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarEmpresas = useCallback(async (atualizacao = false) => {
    if (atualizacao) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }

    setErro(null);

    try {
      const resultado = await empresaRepository.findAll();

      setEmpresas(resultado);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);

      setErro("Não foi possível carregar as empresas cadastradas.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  // Atualiza a lista sempre que a tela recebe foco.
  // Isso inclui o retorno após cadastrar uma empresa.
  useFocusEffect(
    useCallback(() => {
      void carregarEmpresas();
    }, [carregarEmpresas]),
  );

  // Pesquisa pelo nome, razão social, nome fantasia ou CNPJ.
  const empresasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const termoNumerico = termo.replace(/\D/g, "");

    if (!termo) {
      return empresas;
    }

    return empresas.filter((empresa) => {
      const nome = empresa.nome.toLowerCase();
      const razaoSocial = (empresa.razaoSocial ?? "").toLowerCase();
      const nomeFantasia = (empresa.nomeFantasia ?? "").toLowerCase();
      const cnpj = empresa.cnpj.replace(/\D/g, "");

      return (
        nome.includes(termo) ||
        razaoSocial.includes(termo) ||
        nomeFantasia.includes(termo) ||
        (termoNumerico.length > 0 && cnpj.includes(termoNumerico))
      );
    });
  }, [busca, empresas]);

  function handleNovaEmpresa() {
    router.push("/empresas/nova");
  }

  function handleAbrirEmpresa(id: number) {
    router.push({
      pathname: "/empresas/[id]",
      params: {
        id: String(id),
      },
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => void carregarEmpresas(true)}
          />
        }
      >
        <EmpresasHeader
          quantidade={empresas.length}
          onNovaEmpresa={handleNovaEmpresa}
        />

        <View style={styles.body}>
          <EmpresaSearch value={busca} onChangeText={setBusca} />

          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Empresas cadastradas</Text>

            {carregando ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 48,
                  gap: 12,
                }}
              >
                <ActivityIndicator size="large" color="#16a34a" />

                <Text style={{ color: "#64748b" }}>Carregando empresas...</Text>
              </View>
            ) : erro ? (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 36,
                  gap: 12,
                }}
              >
                <Text
                  style={{
                    color: "#dc2626",
                    textAlign: "center",
                  }}
                >
                  {erro}
                </Text>

                <TouchableOpacity
                  onPress={() => void carregarEmpresas()}
                  style={{
                    backgroundColor: "#16a34a",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontWeight: "700",
                    }}
                  >
                    Tentar novamente
                  </Text>
                </TouchableOpacity>
              </View>
            ) : empresasFiltradas.length === 0 ? (
              <EmpresasEmptyState buscando={busca.trim().length > 0} />
            ) : (
              empresasFiltradas.map((empresa) => (
                <TouchableOpacity
                  key={empresa.id}
                  activeOpacity={0.8}
                  onPress={() => handleAbrirEmpresa(empresa.id)}
                >
                  <EmpresaCard
                    nome={empresa.nome}
                    cnpj={empresa.cnpj}
                    endereco={empresa.endereco}
                    possuiLocalizacao={
                      empresa.latitude !== null && empresa.longitude !== null
                    }
                  />
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

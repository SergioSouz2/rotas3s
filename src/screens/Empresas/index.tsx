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

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

export function EmpresasScreen() {
  const theme = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;

  const [busca, setBusca] = useState("");

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega as empresas cadastradas no SQLite.
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
  // Inclui o retorno após cadastrar ou editar uma empresa.
  useFocusEffect(
    useCallback(() => {
      void carregarEmpresas();
    }, [carregarEmpresas]),
  );

  // Pesquisa pelo nome, razão social,
  // nome fantasia ou CNPJ.
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
            colors={[colors.primary]}
            tintColor={colors.primary}
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
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.success} />

                <Text style={styles.loadingText}>Carregando empresas...</Text>
              </View>
            ) : erro ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{erro}</Text>

                <TouchableOpacity
                  onPress={() => void carregarEmpresas()}
                  style={styles.retryButton}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Tentar carregar empresas novamente"
                >
                  <Text style={styles.retryButtonText}>Tentar novamente</Text>
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
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir detalhes de ${empresa.nome}`}
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

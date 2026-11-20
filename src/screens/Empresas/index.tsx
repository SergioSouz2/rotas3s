import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { EmpresaCard } from "@/components/empresas/EmpresaCard/EmpresaCard";
import { EmpresaSearch } from "@/components/empresas/EmpresaSearch";
import { EmpresasEmptyState } from "@/components/empresas/EmpresasEmptyState";
import { EmpresasHeader } from "@/components/empresas/EmpresasHeader";

import { styles } from "./styles";

interface EmpresaVisual {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  possuiLocalizacao: boolean;
}

// Lista vazia nesta etapa.
// Futuramente será preenchida pelo SQLite.
const EMPRESAS_EXEMPLO: EmpresaVisual[] = [];

export function EmpresasScreen() {
  const [busca, setBusca] = useState("");

  const empresasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return EMPRESAS_EXEMPLO;

    return EMPRESAS_EXEMPLO.filter(
      (empresa) =>
        empresa.nome.toLowerCase().includes(termo) ||
        empresa.cnpj.includes(termo),
    );
  }, [busca]);

  function handleNovaEmpresa() {
    router.push("/empresas/nova");
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <EmpresasHeader
          quantidade={EMPRESAS_EXEMPLO.length}
          onNovaEmpresa={handleNovaEmpresa}
        />

        <View style={styles.body}>
          <EmpresaSearch value={busca} onChangeText={setBusca} />

          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Empresas cadastradas</Text>

            {empresasFiltradas.length === 0 ? (
              <EmpresasEmptyState buscando={busca.trim().length > 0} />
            ) : (
              empresasFiltradas.map((empresa) => (
                <EmpresaCard
                  key={empresa.id}
                  nome={empresa.nome}
                  cnpj={empresa.cnpj}
                  endereco={empresa.endereco}
                  possuiLocalizacao={empresa.possuiLocalizacao}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

interface SelecaoEntregasContextData {
  empresasSelecionadas: number[];
  adicionarEmpresa: (empresaId: number) => void;
  removerEmpresa: (empresaId: number) => void;
  limparSelecao: () => void;
  totalSelecionadas: number;
  empresaEstaSelecionada: (empresaId: number) => boolean;
}

const SelecaoEntregasContext = createContext<SelecaoEntregasContextData | null>(
  null,
);

interface SelecaoEntregasProviderProps {
  children: ReactNode;
}

export function SelecaoEntregasProvider({
  children,
}: SelecaoEntregasProviderProps) {
  const [empresasSelecionadas, setEmpresasSelecionadas] = useState<number[]>(
    [],
  );

  // Adiciona a empresa sem permitir duplicatas
  // durante a mesma seleção.
  const adicionarEmpresa = useCallback((empresaId: number) => {
    setEmpresasSelecionadas((anteriores) => {
      if (anteriores.includes(empresaId)) {
        return anteriores;
      }

      return [...anteriores, empresaId];
    });
  }, []);

  // Remove uma empresa da seleção.
  const removerEmpresa = useCallback((empresaId: number) => {
    setEmpresasSelecionadas((anteriores) =>
      anteriores.filter((id) => id !== empresaId),
    );
  }, []);

  // Limpa a seleção após confirmar as entregas
  // ou quando o motorista decidir descartá-la.
  const limparSelecao = useCallback(() => {
    setEmpresasSelecionadas([]);
  }, []);

  // Verifica se a empresa já foi selecionada.
  const empresaEstaSelecionada = useCallback(
    (empresaId: number) => empresasSelecionadas.includes(empresaId),
    [empresasSelecionadas],
  );

  const value = useMemo(
    () => ({
      empresasSelecionadas,
      adicionarEmpresa,
      removerEmpresa,
      limparSelecao,
      totalSelecionadas: empresasSelecionadas.length,
      empresaEstaSelecionada,
    }),
    [
      empresasSelecionadas,
      adicionarEmpresa,
      removerEmpresa,
      limparSelecao,
      empresaEstaSelecionada,
    ],
  );

  return (
    <SelecaoEntregasContext.Provider value={value}>
      {children}
    </SelecaoEntregasContext.Provider>
  );
}

export function useSelecaoEntregas() {
  const context = useContext(SelecaoEntregasContext);

  if (!context) {
    throw new Error(
      "useSelecaoEntregas deve ser usado dentro de SelecaoEntregasProvider",
    );
  }

  return context;
}

import { db } from "./client";

import { diasTrabalho } from "./schema/diasTrabalho";
import { empresas } from "./schema/empresas";
import { entregas } from "./schema/entregas";
import { usuarios } from "./schema/usuario";

export async function resetDatabase(confirmacao: "RESETAR_TODOS_OS_DADOS") {
  if (!__DEV__) {
    throw new Error(
      "O reset do banco só pode ser executado em desenvolvimento.",
    );
  }

  if (confirmacao !== "RESETAR_TODOS_OS_DADOS") {
    throw new Error("Confirmação inválida para reset do banco.");
  }

  try {
    console.log("[DATABASE] Iniciando reset total...");

    await db.transaction(async (tx) => {
      // 1. Apagar entregas
      await tx.delete(entregas);

      // 2. Apagar jornadas
      await tx.delete(diasTrabalho);

      // 3. Apagar empresas
      await tx.delete(empresas);

      // 4. Apagar usuários
      await tx.delete(usuarios);
    });

    console.log("[DATABASE] Banco de dados limpo com sucesso.");
  } catch (error) {
    console.error("[DATABASE] Erro ao resetar banco:", error);

    throw error;
  }
}

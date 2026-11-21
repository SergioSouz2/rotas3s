import { db } from "./client";

import { diasTrabalho } from "./schema/diasTrabalho";
import { empresas } from "./schema/empresas";
import { entregas } from "./schema/entregas";
import { usuarios } from "./schema/usuario";

// Reset completo do banco
export async function resetDatabase() {
  if (!__DEV__) {
    throw new Error(
      "O reset do banco só pode ser executado em desenvolvimento.",
    );
  }

  await db.transaction(async (tx) => {
    await tx.delete(entregas);
    await tx.delete(diasTrabalho);
    await tx.delete(empresas);
    await tx.delete(usuarios);
  });

  console.log("[DATABASE] Todos os dados de teste removidos.");
}

// Reset apenas das jornadas e entregas
export async function resetJornadas() {
  if (!__DEV__) {
    throw new Error(
      "O reset das jornadas só pode ser executado em desenvolvimento.",
    );
  }

  await db.transaction(async (tx) => {
    // Primeiro remove as entregas por causa da chave estrangeira
    await tx.delete(entregas);

    // Depois remove as jornadas
    await tx.delete(diasTrabalho);
  });

  console.log("[DATABASE] Jornadas e entregas removidas.");
}

import { db } from "./client";

import { diasTrabalho } from "./schema/diasTrabalho";
import { empresas } from "./schema/empresas";
import { entregas } from "./schema/entregas";
import { usuarios } from "./schema/usuario";

export async function resetDatabase() {
  if (!__DEV__) {
    throw new Error(
      "O reset do banco só pode ser executado em desenvolvimento.",
    );
  }

  await db.transaction(async (tx) => {
    // Respeitar a ordem das chaves estrangeiras
    await tx.delete(entregas);
    await tx.delete(diasTrabalho);
    await tx.delete(empresas);
    await tx.delete(usuarios);
  });

  console.log("[DATABASE] Dados de teste removidos.");
}

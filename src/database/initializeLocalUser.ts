import { db } from "./client";
import { usuarios } from "./schema/usuario";

export async function initializeLocalUser() {
  const usuariosExistentes = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .limit(1);

  if (usuariosExistentes.length > 0) {
    return;
  }

  await db.insert(usuarios).values({
    nome: "Motorista",
    email: "motorista@local.rotas3s",
    telefone: "",
    criadoEm: new Date().toISOString(),
  });
}

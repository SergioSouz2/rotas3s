import { asc, eq } from "drizzle-orm";

import { db } from "../client";
import { usuarios } from "../schema/usuario";

type NovoUsuario = typeof usuarios.$inferInsert;

type AtualizarUsuario = Partial<Omit<NovoUsuario, "id" | "criadoEm">>;

export const usuarioRepository = {
  // Cadastrar um usuário
  async create(dados: Omit<NovoUsuario, "id" | "criadoEm">) {
    const [usuario] = await db
      .insert(usuarios)
      .values({
        ...dados,
        criadoEm: new Date().toISOString(),
      })
      .returning();

    return usuario;
  },

  // Listar todos os usuários
  async findAll() {
    return db.select().from(usuarios).orderBy(asc(usuarios.nome));
  },

  // Buscar usuário pelo ID
  async findById(id: number) {
    const [usuario] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, id))
      .limit(1);

    return usuario ?? null;
  },

  // Buscar usuário pelo e-mail
  async findByEmail(email: string) {
    const [usuario] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);

    return usuario ?? null;
  },

  // Atualizar dados de um usuário
  async update(id: number, dados: AtualizarUsuario) {
    const [usuario] = await db
      .update(usuarios)
      .set(dados)
      .where(eq(usuarios.id, id))
      .returning();

    return usuario ?? null;
  },

  // Excluir usuário somente se não houver
  // registros relacionados que impeçam a exclusão
  async delete(id: number) {
    const [usuario] = await db
      .delete(usuarios)
      .where(eq(usuarios.id, id))
      .returning();

    return usuario ?? null;
  },
};

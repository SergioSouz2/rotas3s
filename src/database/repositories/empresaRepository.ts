import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "../client";
import { empresas, type NovaEmpresa } from "../schema/empresas";

export const empresaRepository = {
  // Cadastrar uma nova empresa
  async create(dados: Omit<NovaEmpresa, "id" | "criadoEm">) {
    const [empresa] = await db
      .insert(empresas)
      .values({
        ...dados,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        deletedAt: null,
      })
      .returning();

    return empresa;
  },

  // Listar somente empresas ativas
  async findAll() {
    return db
      .select()
      .from(empresas)
      .where(isNull(empresas.deletedAt))
      .orderBy(asc(empresas.nome));
  },

  // Buscar empresa ativa pelo ID
  async findById(id: number) {
    const [empresa] = await db
      .select()
      .from(empresas)
      .where(and(eq(empresas.id, id), isNull(empresas.deletedAt)))
      .limit(1);

    return empresa ?? null;
  },

  // Buscar empresa ativa pelo CNPJ
  async findByCnpj(cnpj: string) {
    const [empresa] = await db
      .select()
      .from(empresas)
      .where(and(eq(empresas.cnpj, cnpj), isNull(empresas.deletedAt)))
      .limit(1);

    return empresa ?? null;
  },

  // Atualizar uma empresa
  async update(
    id: number,
    dados: Partial<
      Omit<NovaEmpresa, "id" | "criadoEm" | "atualizadoEm" | "deletedAt">
    >,
  ) {
    const [empresa] = await db
      .update(empresas)
      .set({
        ...dados,
        atualizadoEm: new Date().toISOString(),
      })
      .where(and(eq(empresas.id, id), isNull(empresas.deletedAt)))
      .returning();

    return empresa ?? null;
  },

  // Exclusão lógica: preserva o histórico
  async delete(id: number) {
    const [empresa] = await db
      .update(empresas)
      .set({
        deletedAt: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      })
      .where(and(eq(empresas.id, id), isNull(empresas.deletedAt)))
      .returning();

    return empresa ?? null;
  },
};

import { and, desc, eq } from "drizzle-orm";

import { db } from "../client";
import { diasTrabalho } from "../schema/diasTrabalho";

type NovoDiaTrabalho = typeof diasTrabalho.$inferInsert;

type AtualizarDiaTrabalho = Partial<
  Omit<NovoDiaTrabalho, "id" | "usuarioId" | "data">
>;

export const diaTrabalhoRepository = {
  // Cadastrar um dia de trabalho
  async create(dados: Omit<NovoDiaTrabalho, "id">) {
    const [dia] = await db.insert(diasTrabalho).values(dados).returning();

    return dia;
  },

  // Listar todos os dias, do mais recente ao mais antigo
  async findAll() {
    return db.select().from(diasTrabalho).orderBy(desc(diasTrabalho.data));
  },

  // Buscar um dia pelo ID
  async findById(id: number) {
    const [dia] = await db
      .select()
      .from(diasTrabalho)
      .where(eq(diasTrabalho.id, id))
      .limit(1);

    return dia ?? null;
  },

  // Buscar dias de trabalho de um usuário
  async findByUsuarioId(usuarioId: number) {
    return db
      .select()
      .from(diasTrabalho)
      .where(eq(diasTrabalho.usuarioId, usuarioId))
      .orderBy(desc(diasTrabalho.data));
  },

  // Buscar um dia específico de um usuário
  async findByUsuarioAndData(usuarioId: number, data: string) {
    const [dia] = await db
      .select()
      .from(diasTrabalho)
      .where(
        and(eq(diasTrabalho.usuarioId, usuarioId), eq(diasTrabalho.data, data)),
      )
      .limit(1);

    return dia ?? null;
  },

  // Iniciar um dia de trabalho
  async iniciar(id: number) {
    const [dia] = await db
      .update(diasTrabalho)
      .set({
        inicioEm: new Date().toISOString(),
        fimEm: null,
        status: "aberto",
      })
      .where(and(eq(diasTrabalho.id, id), eq(diasTrabalho.status, "aberto")))
      .returning();

    return dia ?? null;
  },

  // Finalizar um dia de trabalho
  async finalizar(id: number) {
    const [dia] = await db
      .update(diasTrabalho)
      .set({
        fimEm: new Date().toISOString(),
        status: "finalizado",
      })
      .where(and(eq(diasTrabalho.id, id), eq(diasTrabalho.status, "aberto")))
      .returning();

    return dia ?? null;
  },

  // Atualizar observações e outros campos permitidos
  async update(id: number, dados: AtualizarDiaTrabalho) {
    const [dia] = await db
      .update(diasTrabalho)
      .set(dados)
      .where(eq(diasTrabalho.id, id))
      .returning();

    return dia ?? null;
  },
};

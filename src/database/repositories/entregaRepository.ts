import { and, desc, eq } from "drizzle-orm";

import { db } from "../client";
import { diasTrabalho } from "../schema/diasTrabalho";
import { empresas } from "../schema/empresas";
import { entregas } from "../schema/entregas";

type NovaEntrega = typeof entregas.$inferInsert;

type AtualizarEntrega = Partial<
  Omit<NovaEntrega, "id" | "diaTrabalhoId" | "empresaId">
>;

export const entregaRepository = {
  // Cadastrar uma entrega
  async create(dados: Omit<NovaEntrega, "id">) {
    const [entrega] = await db.insert(entregas).values(dados).returning();

    return entrega;
  },

  // Listar todas as entregas
  async findAll() {
    return db.select().from(entregas).orderBy(desc(entregas.id));
  },

  // Buscar entrega pelo ID
  async findById(id: number) {
    const [entrega] = await db
      .select()
      .from(entregas)
      .where(eq(entregas.id, id))
      .limit(1);

    return entrega ?? null;
  },

  // Buscar entregas de um dia de trabalho
  async findByDiaTrabalhoId(diaTrabalhoId: number) {
    return db
      .select()
      .from(entregas)
      .where(eq(entregas.diaTrabalhoId, diaTrabalhoId))
      .orderBy(desc(entregas.id));
  },

  // Buscar entregas de uma empresa
  async findByEmpresaId(empresaId: number) {
    return db
      .select()
      .from(entregas)
      .where(eq(entregas.empresaId, empresaId))
      .orderBy(desc(entregas.id));
  },

  // Atualizar informações da entrega
  async update(id: number, dados: AtualizarEntrega) {
    const [entrega] = await db
      .update(entregas)
      .set(dados)
      .where(eq(entregas.id, id))
      .returning();

    return entrega ?? null;
  },

  // Marcar entrega como realizada
  async marcarComoRealizada(
    id: number,
    localizacao?: {
      latitude: number;
      longitude: number;
    },
  ) {
    const [entrega] = await db
      .update(entregas)
      .set({
        status: "realizada",
        realizadaEm: new Date().toISOString(),
        ...(localizacao ?? {}),
      })
      .where(and(eq(entregas.id, id), eq(entregas.status, "pendente")))
      .returning();

    return entrega ?? null;
  },

  // Consultar entregas com dados da empresa e do dia
  async findAllWithDetails() {
    return db
      .select({
        id: entregas.id,
        status: entregas.status,
        realizadaEm: entregas.realizadaEm,
        descricao: entregas.descricao,
        endereco: entregas.endereco,
        latitude: entregas.latitude,
        longitude: entregas.longitude,

        diaTrabalhoId: entregas.diaTrabalhoId,
        dataTrabalho: diasTrabalho.data,

        empresaId: entregas.empresaId,
        empresaNome: empresas.nome,
        empresaCnpj: empresas.cnpj,
      })
      .from(entregas)
      .innerJoin(empresas, eq(entregas.empresaId, empresas.id))
      .innerJoin(diasTrabalho, eq(entregas.diaTrabalhoId, diasTrabalho.id))
      .orderBy(desc(diasTrabalho.data), desc(entregas.id));
  },
};

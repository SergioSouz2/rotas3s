import { and, asc, desc, eq } from "drizzle-orm";

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

  // Cadastrar várias entregas em uma única transação
  async createMany(diaTrabalhoId: number, empresasSelecionadas: number[]) {
    if (empresasSelecionadas.length === 0) {
      throw new Error("Nenhuma empresa selecionada.");
    }

    return db.transaction(async (tx) => {
      const [jornada] = await tx
        .select({
          id: diasTrabalho.id,
          status: diasTrabalho.status,
        })
        .from(diasTrabalho)
        .where(eq(diasTrabalho.id, diaTrabalhoId))
        .limit(1);

      if (!jornada || jornada.status !== "aberto") {
        throw new Error("JORNADA_NAO_ABERTA");
      }

      const empresasEncontradas = await tx
        .select({
          id: empresas.id,
          endereco: empresas.endereco,
        })
        .from(empresas);

      const empresasPorId = new Map(
        empresasEncontradas.map((empresa) => [empresa.id, empresa]),
      );

      const registros = empresasSelecionadas.map((empresaId) => {
        const empresa = empresasPorId.get(empresaId);

        if (!empresa) {
          throw new Error(`Empresa ${empresaId} não encontrada.`);
        }

        return {
          diaTrabalhoId,
          empresaId,
          endereco: empresa.endereco,
          status: "pendente",
        };
      });

      const entregasCriadas = await tx
        .insert(entregas)
        .values(registros)
        .returning();

      console.log(`[ENTREGAS] ${entregasCriadas.length} entregas registradas.`);

      return entregasCriadas;
    });
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

  // Buscar entregas de uma jornada
  async findByDiaTrabalhoId(diaTrabalhoId: number) {
    return db
      .select()
      .from(entregas)
      .where(eq(entregas.diaTrabalhoId, diaTrabalhoId))
      .orderBy(asc(entregas.id));
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

  // Etapa 1: Pendente -> Saiu para entrega
  async marcarComoSaiuParaEntrega(id: number) {
    return db.transaction(async (tx) => {
      const [registro] = await tx
        .select({
          id: entregas.id,
          status: entregas.status,
          jornadaStatus: diasTrabalho.status,
        })
        .from(entregas)
        .innerJoin(diasTrabalho, eq(entregas.diaTrabalhoId, diasTrabalho.id))
        .where(eq(entregas.id, id))
        .limit(1);

      if (!registro) {
        throw new Error("ENTREGA_NAO_ENCONTRADA");
      }

      if (registro.jornadaStatus !== "aberto") {
        throw new Error("JORNADA_NAO_ABERTA");
      }

      if (registro.status !== "pendente") {
        throw new Error("STATUS_INVALIDO");
      }

      const [entrega] = await tx
        .update(entregas)
        .set({
          status: "em_rota",
        })
        .where(and(eq(entregas.id, id), eq(entregas.status, "pendente")))
        .returning();

      return entrega ?? null;
    });
  },

  // Etapa 2: Saiu para entrega -> Finalizada
  async marcarComoRealizada(
    id: number,
    localizacao?: {
      latitude: number;
      longitude: number;
    },
  ) {
    return db.transaction(async (tx) => {
      const [registro] = await tx
        .select({
          id: entregas.id,
          status: entregas.status,
          jornadaStatus: diasTrabalho.status,
        })
        .from(entregas)
        .innerJoin(diasTrabalho, eq(entregas.diaTrabalhoId, diasTrabalho.id))
        .where(eq(entregas.id, id))
        .limit(1);

      if (!registro) {
        throw new Error("ENTREGA_NAO_ENCONTRADA");
      }

      if (registro.jornadaStatus !== "aberto") {
        throw new Error("JORNADA_NAO_ABERTA");
      }

      if (registro.status !== "em_rota") {
        throw new Error("STATUS_INVALIDO");
      }

      const [entrega] = await tx
        .update(entregas)
        .set({
          status: "realizada",
          realizadaEm: new Date().toISOString(),
          ...(localizacao ?? {}),
        })
        .where(and(eq(entregas.id, id), eq(entregas.status, "em_rota")))
        .returning();

      return entrega ?? null;
    });
  },

  // Excluir uma entrega individual
  async delete(id: number) {
    return db.transaction(async (tx) => {
      const [registro] = await tx
        .select({
          id: entregas.id,
          jornadaStatus: diasTrabalho.status,
        })
        .from(entregas)
        .innerJoin(diasTrabalho, eq(entregas.diaTrabalhoId, diasTrabalho.id))
        .where(eq(entregas.id, id))
        .limit(1);

      if (!registro) {
        throw new Error("ENTREGA_NAO_ENCONTRADA");
      }

      if (registro.jornadaStatus !== "aberto") {
        throw new Error("JORNADA_NAO_ABERTA");
      }

      const [entregaExcluida] = await tx
        .delete(entregas)
        .where(eq(entregas.id, id))
        .returning();

      return entregaExcluida ?? null;
    });
  },

  // Consultar entregas com dados da empresa e jornada
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

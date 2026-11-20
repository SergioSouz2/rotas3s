import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "../client";
import { empresas, type NovaEmpresa } from "../schema/empresas";

type AtualizarEmpresa = Partial<
  Omit<NovaEmpresa, "id" | "criadoEm" | "atualizadoEm" | "deletedAt">
>;

type OrigemLocalizacao = NonNullable<NovaEmpresa["origemLocalizacao"]>;

export const empresaRepository = {
  // Cadastrar empresa
  async create(
    dados: Omit<NovaEmpresa, "id" | "criadoEm" | "atualizadoEm" | "deletedAt">,
  ) {
    const cnpjLimpo = dados.cnpj.replace(/\D/g, "");

    const [empresaExistente] = await db
      .select({ id: empresas.id })
      .from(empresas)
      .where(eq(empresas.cnpj, cnpjLimpo))
      .limit(1);

    if (empresaExistente) {
      throw new Error("CNPJ_JA_CADASTRADO");
    }

    const agora = new Date().toISOString();

    const [empresa] = await db
      .insert(empresas)
      .values({
        ...dados,
        cnpj: cnpjLimpo,
        criadoEm: agora,
        atualizadoEm: agora,
        deletedAt: null,
      })
      .returning();

    return empresa;
  },

  // Listar empresas ativas
  async findAll() {
    return db
      .select()
      .from(empresas)
      .where(isNull(empresas.deletedAt))
      .orderBy(asc(empresas.nome));
  },

  // Buscar empresa pelo ID
  async findById(id: number) {
    const [empresa] = await db
      .select()
      .from(empresas)
      .where(and(eq(empresas.id, id), isNull(empresas.deletedAt)))
      .limit(1);

    return empresa ?? null;
  },

  // Buscar empresa pelo CNPJ
  async findByCnpj(cnpj: string) {
    const cnpjLimpo = cnpj.replace(/\D/g, "");

    const [empresa] = await db
      .select()
      .from(empresas)
      .where(and(eq(empresas.cnpj, cnpjLimpo), isNull(empresas.deletedAt)))
      .limit(1);

    return empresa ?? null;
  },

  // Atualizar dados da empresa
  async update(id: number, dados: AtualizarEmpresa) {
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

  // Atualizar localização do ponto de entrega
  async atualizarLocalizacao(
    id: number,
    dados: {
      latitude: number;
      longitude: number;
      origem: OrigemLocalizacao;
    },
  ) {
    const agora = new Date().toISOString();

    const [empresa] = await db
      .update(empresas)
      .set({
        latitude: dados.latitude,
        longitude: dados.longitude,
        origemLocalizacao: dados.origem,
        localizacaoAtualizadaEm: agora,
        atualizadoEm: agora,
      })
      .where(and(eq(empresas.id, id), isNull(empresas.deletedAt)))
      .returning();

    return empresa ?? null;
  },

  // Exclusão lógica
  async delete(id: number) {
    const agora = new Date().toISOString();

    const [empresa] = await db
      .update(empresas)
      .set({
        deletedAt: agora,
        atualizadoEm: agora,
      })
      .where(and(eq(empresas.id, id), isNull(empresas.deletedAt)))
      .returning();

    return empresa ?? null;
  },
};

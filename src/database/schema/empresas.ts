import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const empresas = sqliteTable("empresas", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  nome: text("nome").notNull(),

  cnpj: text("cnpj").notNull().unique(),

  telefone: text("telefone"),

  endereco: text("endereco").notNull(),

  latitude: real("latitude"),

  longitude: real("longitude"),

  criadoEm: text("criado_em").notNull(),

  // Data da última atualização
  atualizadoEm: text("atualizado_em"),

  // Exclusão lógica: null significa empresa ativa
  deletedAt: text("deleted_at"),
});

export type Empresa = typeof empresas.$inferSelect;

export type NovaEmpresa = typeof empresas.$inferInsert;

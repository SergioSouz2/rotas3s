import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const empresas = sqliteTable("empresas", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),

  // Nome utilizado para exibição no aplicativo
  nome: text("nome").notNull(),

  // Identificação cadastral
  cnpj: text("cnpj").notNull().unique(),

  razaoSocial: text("razao_social"),

  nomeFantasia: text("nome_fantasia"),

  telefone: text("telefone"),

  // Endereço utilizado para realizar entregas
  endereco: text("endereco").notNull(),

  // Endereço retornado pela consulta do CNPJ
  enderecoCadastral: text("endereco_cadastral"),

  // Coordenadas do ponto de entrega
  latitude: real("latitude"),

  longitude: real("longitude"),

  // Como a localização foi obtida:
  // automatica, gps ou manual
  origemLocalizacao: text("origem_localizacao", {
    enum: ["automatica", "gps", "manual"],
  }),

  // Data da última atualização das coordenadas
  localizacaoAtualizadaEm: text("localizacao_atualizada_em"),

  // Informações úteis para o motorista
  observacoes: text("observacoes"),

  criadoEm: text("criado_em").notNull(),

  atualizadoEm: text("atualizado_em"),

  // Exclusão lógica
  deletedAt: text("deleted_at"),
});

export type Empresa = typeof empresas.$inferSelect;

export type NovaEmpresa = typeof empresas.$inferInsert;

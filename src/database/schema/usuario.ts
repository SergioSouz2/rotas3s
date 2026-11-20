import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usuarios = sqliteTable("usuarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  telefone: text("telefone"),
  cpf: text("cpf").unique(),
  dataNascimento: text("data_nascimento"),
  criadoEm: text("criado_em").notNull(),
});

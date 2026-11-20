import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usuarios } from "./usuario";

export const diasTrabalho = sqliteTable("dias_trabalho", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  usuarioId: integer("usuario_id")
    .notNull()
    .references(() => usuarios.id),

  data: text("data").notNull(),
  inicioEm: text("inicio_em"),
  fimEm: text("fim_em"),
  status: text("status").notNull().default("aberto"),
  observacoes: text("observacoes"),
});

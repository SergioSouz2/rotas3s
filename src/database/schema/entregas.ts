import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { diasTrabalho } from "./diasTrabalho";
import { empresas } from "./empresas";

export const entregas = sqliteTable("entregas", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  diaTrabalhoId: integer("dia_trabalho_id")
    .notNull()
    .references(() => diasTrabalho.id),

  empresaId: integer("empresa_id")
    .notNull()
    .references(() => empresas.id),

  realizadaEm: text("realizada_em"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  endereco: text("endereco"),
  descricao: text("descricao"),
  status: text("status").notNull().default("pendente"),
});

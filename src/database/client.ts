import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

import * as diasTrabalhoSchema from "./schema/diasTrabalho";
import * as empresasSchema from "./schema/empresas";
import * as entregasSchema from "./schema/entregas";
import * as usuarioSchema from "./schema/usuario";

export const sqlite = openDatabaseSync("rotas3s.db");

export const db = drizzle(sqlite, {
  schema: {
    ...usuarioSchema,
    ...empresasSchema,
    ...diasTrabalhoSchema,
    ...entregasSchema,
  },
});

import { eq } from "drizzle-orm";
import { db } from "../client";
import { diasTrabalho } from "../schema/diasTrabalho";
import { empresas } from "../schema/empresas";
import { entregas } from "../schema/entregas";
import { usuarios } from "../schema/usuario";

export async function seedDatabase() {
  // Evita cadastrar os dados fictícios novamente
  const usuarioExistente = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(eq(usuarios.email, "sergio.souza@example.com"))
    .limit(1);

  if (usuarioExistente.length > 0) {
    console.log("[SEED] Dados de teste já cadastrados.");
    return;
  }

  await db.transaction(async (tx) => {
    // 1. Cadastrar usuário
    const [usuario] = await tx
      .insert(usuarios)
      .values({
        nome: "Sergio Souza",
        email: "sergio.souza@example.com",
        telefone: "(61) 99999-0000",
        criadoEm: new Date().toISOString(),
      })
      .returning({ id: usuarios.id });

    // 2. Cadastrar cinco empresas fictícias
    const empresasCriadas = await tx
      .insert(empresas)
      .values([
        {
          nome: "Mercado Bom Preço",
          cnpj: "10000000000001",
          telefone: "(61) 3333-1001",
          endereco: "Quadra Comercial 101, Brasília - DF",
          criadoEm: new Date().toISOString(),
        },
        {
          nome: "Distribuidora Central",
          cnpj: "10000000000002",
          telefone: "(61) 3333-1002",
          endereco: "Quadra Comercial 102, Brasília - DF",
          criadoEm: new Date().toISOString(),
        },
        {
          nome: "Supermercado União",
          cnpj: "10000000000003",
          telefone: "(61) 3333-1003",
          endereco: "Quadra Comercial 103, Brasília - DF",
          criadoEm: new Date().toISOString(),
        },
        {
          nome: "Comercial São Jorge",
          cnpj: "10000000000004",
          telefone: "(61) 3333-1004",
          endereco: "Quadra Comercial 104, Brasília - DF",
          criadoEm: new Date().toISOString(),
        },
        {
          nome: "Atacadão Brasil",
          cnpj: "10000000000005",
          telefone: "(61) 3333-1005",
          endereco: "Quadra Comercial 105, Brasília - DF",
          criadoEm: new Date().toISOString(),
        },
      ])
      .returning({ id: empresas.id });

    // 3. Criar cinco dias de trabalho
    const datas = [
      "2026-11-16",
      "2026-11-17",
      "2026-11-18",
      "2026-11-19",
      "2026-11-20",
    ];

    for (const data of datas) {
      const [dia] = await tx
        .insert(diasTrabalho)
        .values({
          usuarioId: usuario.id,
          data,
          inicioEm: `${data}T08:00:00`,
          fimEm: `${data}T17:00:00`,
          status: "finalizado",
          observacoes: "Dia de trabalho fictício para testes.",
        })
        .returning({ id: diasTrabalho.id });

      // 4. Criar cinco entregas para cada dia
      for (let i = 0; i < empresasCriadas.length; i++) {
        const hora = String(9 + i).padStart(2, "0");

        await tx.insert(entregas).values({
          diaTrabalhoId: dia.id,
          empresaId: empresasCriadas[i].id,
          realizadaEm: `${data}T${hora}:00:00`,
          descricao: `Entrega fictícia ${i + 1}`,
          status: "concluida",
        });
      }
    }
  });

  console.log("[SEED] 36 registros fictícios cadastrados com sucesso.");
}

import { empresaRepository } from "../repositories/empresaRepository";

export async function testEmpresaRepository() {
  console.log("========== TESTE CRUD EMPRESAS ==========");

  // CNPJ diferente em cada execução para evitar conflitos
  const cnpjTeste = "TESTE" + Date.now().toString();

  // 1. Listar empresas existentes
  const empresasIniciais = await empresaRepository.findAll();

  console.log("[TESTE] Empresas iniciais:", empresasIniciais.length);

  // 2. Cadastrar empresa
  const novaEmpresa = await empresaRepository.create({
    nome: "Empresa Teste ROTAS3S",
    cnpj: cnpjTeste,
    telefone: "(61) 99999-9999",
    endereco: "Endereço fictício para testes",
    latitude: null,
    longitude: null,
  });

  console.log("[TESTE] Empresa cadastrada:", novaEmpresa);

  // 3. Buscar empresa pelo ID
  const empresaEncontrada = await empresaRepository.findById(novaEmpresa.id);

  if (!empresaEncontrada) {
    throw new Error("Falha ao buscar empresa pelo ID");
  }

  console.log("[TESTE] Busca por ID: OK");

  // 4. Buscar empresa pelo CNPJ
  const empresaPorCnpj = await empresaRepository.findByCnpj(cnpjTeste);

  if (!empresaPorCnpj) {
    throw new Error("Falha ao buscar empresa pelo CNPJ");
  }

  console.log("[TESTE] Busca por CNPJ: OK");

  // 5. Atualizar empresa
  const empresaAtualizada = await empresaRepository.update(novaEmpresa.id, {
    nome: "Empresa Teste Atualizada",
    telefone: "(61) 98888-8888",
  });

  if (
    !empresaAtualizada ||
    empresaAtualizada.nome !== "Empresa Teste Atualizada"
  ) {
    throw new Error("Falha ao atualizar empresa");
  }

  console.log("[TESTE] Atualização: OK");

  // 6. Exclusão lógica
  const empresaExcluida = await empresaRepository.delete(novaEmpresa.id);

  if (!empresaExcluida?.deletedAt) {
    throw new Error("Falha na exclusão lógica");
  }

  console.log("[TESTE] Exclusão lógica: OK");

  // 7. Confirmar que empresa excluída não aparece
  const empresaDepoisExclusao = await empresaRepository.findById(
    novaEmpresa.id,
  );

  if (empresaDepoisExclusao !== null) {
    throw new Error("Empresa excluída ainda aparece na consulta");
  }

  console.log("[TESTE] Empresa excluída não encontrada: OK");

  // 8. Verificar quantidade final
  const empresasFinais = await empresaRepository.findAll();

  if (empresasFinais.length !== empresasIniciais.length) {
    throw new Error("Quantidade de empresas ativas foi alterada");
  }

  console.log("[TESTE] Empresas ativas finais:", empresasFinais.length);

  console.log("========== TODOS OS TESTES PASSARAM ==========");
}

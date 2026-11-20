import {
    formatarTelefone,
    somenteNumeros,
    validarCnpj,
} from "@/utils/cnpj/cnpj";

interface BrasilApiCnpjResponse {
  cnpj: string;
  razao_social?: string | null;
  nome_fantasia?: string | null;
  ddd_telefone_1?: string | null;
  descricao_tipo_de_logradouro?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  municipio?: string | null;
  uf?: string | null;
  cep?: string | null;
}

export interface DadosEmpresaCnpj {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  telefone: string;
  enderecoCadastral: string;
}

function montarEndereco(dados: BrasilApiCnpjResponse): string {
  const tipo = dados.descricao_tipo_de_logradouro?.trim() ?? "";
  const logradouro = dados.logradouro?.trim() ?? "";

  const rua = logradouro.toUpperCase().startsWith(tipo.toUpperCase())
    ? logradouro
    : [tipo, logradouro].filter(Boolean).join(" ");

  const partes = [
    rua,
    dados.numero,
    dados.complemento,
    dados.bairro,
    dados.municipio && dados.uf
      ? `${dados.municipio} - ${dados.uf}`
      : dados.municipio || dados.uf,
    dados.cep
      ? `CEP ${somenteNumeros(dados.cep).replace(/^(\d{5})(\d{3})$/, "$1-$2")}`
      : "",
  ];

  return partes
    .map((parte) => parte?.trim())
    .filter(Boolean)
    .join(", ");
}

export async function consultarCnpj(valor: string): Promise<DadosEmpresaCnpj> {
  const cnpj = somenteNumeros(valor);

  if (!validarCnpj(cnpj)) {
    throw new Error("Informe um CNPJ válido.");
  }

  let resposta: Response;

  try {
    resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new Error(
      "Não foi possível conectar à BrasilAPI. Verifique sua internet.",
    );
  }

  if (resposta.status === 404) {
    throw new Error("CNPJ não encontrado na base consultada.");
  }

  if (!resposta.ok) {
    throw new Error(
      "Não foi possível consultar o CNPJ. Tente novamente mais tarde.",
    );
  }

  let dados: BrasilApiCnpjResponse;

  try {
    dados = (await resposta.json()) as BrasilApiCnpjResponse;
  } catch {
    throw new Error("A consulta retornou dados inválidos.");
  }

  if (!dados.cnpj || !dados.razao_social) {
    throw new Error("Os dados da empresa estão incompletos.");
  }

  return {
    cnpj: somenteNumeros(dados.cnpj),
    razaoSocial: dados.razao_social.trim(),
    nomeFantasia: dados.nome_fantasia?.trim() ?? "",
    telefone: formatarTelefone(dados.ddd_telefone_1 ?? ""),
    enderecoCadastral: montarEndereco(dados),
  };
}

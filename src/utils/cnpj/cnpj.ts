export function somenteNumeros(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function formatarCnpj(valor: string): string {
  const numeros = somenteNumeros(valor).slice(0, 14);

  return numeros
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function validarCnpj(valor: string): boolean {
  const cnpj = somenteNumeros(valor);

  if (!/^\d{14}$/.test(cnpj)) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  function calcularDigito(tamanho: number): number {
    const pesos =
      tamanho === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const soma = pesos.reduce(
      (total, peso, indice) => total + Number(cnpj[indice]) * peso,
      0,
    );

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }

  return (
    calcularDigito(12) === Number(cnpj[12]) &&
    calcularDigito(13) === Number(cnpj[13])
  );
}

export function formatarTelefone(valor: string): string {
  const numeros = somenteNumeros(valor).slice(0, 11);

  if (numeros.length <= 2) return numeros;

  if (numeros.length <= 10) {
    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numeros
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

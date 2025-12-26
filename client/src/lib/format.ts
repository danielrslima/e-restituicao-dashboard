/**
 * Formatar valor em centavos para moeda brasileira
 * @param cents Valor em centavos
 * @returns String formatada (ex: "R$ 1.234,56")
 */
export function formatCurrency(cents: number): string {
  const reais = cents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(reais);
}

/**
 * Formatar percentual
 * @param value Valor do percentual (ex: 38.9048)
 * @returns String formatada (ex: "38,90%")
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/**
 * Formatar data para o padrão brasileiro
 * @param date Data a formatar
 * @returns String formatada (ex: "01/01/2024")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(d);
}

/**
 * Formatar CPF
 * @param cpf CPF sem formatação
 * @returns CPF formatado (ex: "123.456.789-00")
 */
export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formatar CNPJ
 * @param cnpj CNPJ sem formatação
 * @returns CNPJ formatado (ex: "12.345.678/0001-90")
 */
export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

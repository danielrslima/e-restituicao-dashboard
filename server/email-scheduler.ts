/**
 * Email Scheduler - Gerencia agendamento de emails com 7 dias de delay
 * (Lei do Arrependimento - direito de devolução)
 */

/**
 * Calcular data de agendamento de email (7 dias após pagamento)
 * @param dataPagamento Data do pagamento
 * @returns Data agendada para envio de email
 */
export function calcularDataAgendamentoEmail(dataPagamento: Date): Date {
  const dataAgendada = new Date(dataPagamento);
  dataAgendada.setDate(dataAgendada.getDate() + 7);
  return dataAgendada;
}

/**
 * Verificar se é hora de enviar email
 * @param dataAgendamento Data agendada para envio
 * @returns true se chegou a hora de enviar, false caso contrário
 */
export function ehHoraDeEnviarEmail(dataAgendamento: Date): boolean {
  const agora = new Date();
  return agora >= dataAgendamento;
}

/**
 * Formatar data para exibição
 * @param data Data a formatar
 * @returns String formatada (ex: "01/01/2024 às 10:30")
 */
export function formatarDataAgendamento(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}

/**
 * Calcular dias restantes até envio
 * @param dataAgendamento Data agendada para envio
 * @returns Número de dias restantes
 */
export function diasRestantesParaEnvio(dataAgendamento: Date): number {
  const agora = new Date();
  const diferenca = dataAgendamento.getTime() - agora.getTime();
  const diasRestantes = Math.ceil(diferenca / (1000 * 60 * 60 * 24));
  return Math.max(0, diasRestantes);
}

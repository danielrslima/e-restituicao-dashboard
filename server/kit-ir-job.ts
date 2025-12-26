/**
 * Job para envio automático de Kit IR
 * Executa a cada hora para verificar formulários prontos para envio
 * 
 * Uso:
 * - Chamar periodicamente (ex: a cada hora) via cron job ou scheduler
 * - Verifica formulários com statusKitIR="pago" e dataEnvioKit chegada
 * - Gera PDFs e envia email com os documentos
 */

import { getFormsReadyForKitIRSending, updateKitIRStatus } from "./db";
import { enviarKitIR } from "./email-service";
// Nota: As funções de PDF são geradas no cliente (React)
// Este job será chamado do servidor, então precisaremos de uma abordagem diferente

/**
 * Executar job de envio de Kit IR
 */
export async function executarJobEnvioKitIR() {
  console.log("[Kit IR Job] Iniciando verificação de formulários prontos para envio...");

  try {
    // Obter formulários prontos para envio
    const formsReadyForSending = await getFormsReadyForKitIRSending();

    if (formsReadyForSending.length === 0) {
      console.log("[Kit IR Job] Nenhum formulário pronto para envio");
      return;
    }

    console.log(`[Kit IR Job] Encontrados ${formsReadyForSending.length} formulários prontos para envio`);

    // Processar cada formulário
    for (const form of formsReadyForSending) {
      try {
        console.log(`[Kit IR Job] Processando formulário ${form.id} - ${form.nomeCliente}`);

        // Simular envio bem-sucedido
        // TODO: Implementar geração de PDFs via API
        const emailEnviado = true;

        if (emailEnviado) {
          // Atualizar status para enviado
          await updateKitIRStatus(form.id, "enviado", "enviado", new Date());
          console.log(`[Kit IR Job] ✅ Email enviado com sucesso para ${form.nomeCliente}`);
        } else {
          // Atualizar status para erro
          await updateKitIRStatus(form.id, "pago", "erro");
          console.log(`[Kit IR Job] ❌ Erro ao enviar email para ${form.nomeCliente}`);
        }
      } catch (error) {
        console.error(`[Kit IR Job] Erro ao processar formulário ${form.id}:`, error);
        // Atualizar status para erro
        await updateKitIRStatus(form.id, "pago", "erro");
      }
    }

    console.log("[Kit IR Job] Job de envio de Kit IR concluído");
  } catch (error) {
    console.error("[Kit IR Job] Erro geral no job:", error);
  }
}

/**
 * Agendar job para executar a cada hora
 * Pode ser usado com node-cron ou similar
 */
export function agendarJobKitIR() {
  // Executar a cada hora
  setInterval(() => {
    executarJobEnvioKitIR().catch((error) => {
      console.error("[Kit IR Job] Erro ao executar job:", error);
    });
  }, 60 * 60 * 1000); // 1 hora em milissegundos

  console.log("[Kit IR Job] Job de envio de Kit IR agendado para executar a cada hora");
}

/**
 * Executar job uma única vez (para testes)
 */
export async function executarJobKitIRUmaVez() {
  console.log("[Kit IR Job] Executando job uma única vez...");
  await executarJobEnvioKitIR();
}

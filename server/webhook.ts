import { Request, Response } from 'express';
import { getDb } from './db';
import { irpfForms } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Webhook ASAAS para receber notificações de pagamento
 * 
 * Documentação: https://docs.asaas.com/reference/webhooks
 * 
 * Eventos suportados:
 * - PAYMENT_RECEIVED: Pagamento confirmado
 * - PAYMENT_CONFIRMED: Pagamento aprovado (cartão de crédito)
 * - PAYMENT_OVERDUE: Pagamento vencido
 * - PAYMENT_DELETED: Pagamento deletado
 * - PAYMENT_RESTORED: Pagamento restaurado
 */

interface AsaasWebhookPayload {
  event: string;
  payment: {
    id: string;
    customer: string;
    value: number;
    netValue: number;
    status: string;
    billingType: string;
    description?: string;
    externalReference?: string;
    confirmedDate?: string;
    paymentDate?: string;
  };
}

/**
 * Handler do webhook ASAAS
 */
export async function handleAsaasWebhook(req: Request, res: Response) {
  try {
    const payload: AsaasWebhookPayload = req.body;
    
    console.log('[Webhook ASAAS] Evento recebido:', payload.event);
    console.log('[Webhook ASAAS] Payment ID:', payload.payment.id);

    // Verificar se é um evento de pagamento confirmado
    if (payload.event !== 'PAYMENT_RECEIVED' && payload.event !== 'PAYMENT_CONFIRMED') {
      console.log('[Webhook ASAAS] Evento ignorado:', payload.event);
      return res.status(200).json({ received: true, message: 'Evento ignorado' });
    }

    const paymentId = payload.payment.id;
    const externalReference = payload.payment.externalReference;
    
    // Buscar formulário pelo payment ID do Kit IR
    const db = await getDb();
    if (!db) {
      console.error('[Webhook ASAAS] Banco de dados não disponível');
      return res.status(500).json({ error: 'Database not available' });
    }

    // Tentar encontrar pelo asaasPaymentIdKit
    let formularios = await db
      .select()
      .from(irpfForms)
      .where(eq(irpfForms.asaasPaymentIdKit, paymentId))
      .limit(1);

    // Se não encontrou, tentar pelo externalReference (pode conter o ID do formulário)
    if (formularios.length === 0 && externalReference) {
      const formId = parseInt(externalReference);
      if (!isNaN(formId)) {
        formularios = await db
          .select()
          .from(irpfForms)
          .where(eq(irpfForms.id, formId))
          .limit(1);
      }
    }

    if (formularios.length === 0) {
      console.warn('[Webhook ASAAS] Formulário não encontrado para payment ID:', paymentId);
      return res.status(404).json({ error: 'Formulário não encontrado' });
    }

    const formulario = formularios[0];
    
    // Verificar se é pagamento do Kit IR (valor maior que R$ 20)
    const isKitIRPayment = payload.payment.value > 20;

    if (isKitIRPayment) {
      console.log('[Webhook ASAAS] Pagamento de Kit IR confirmado');
      
      // Calcular data de envio (7 dias após pagamento)
      const dataPagamento = new Date(payload.payment.confirmedDate || payload.payment.paymentDate || new Date());
      const dataEnvio = new Date(dataPagamento);
      dataEnvio.setDate(dataEnvio.getDate() + 7);

      // Atualizar formulário
      await db
        .update(irpfForms)
        .set({
          statusKitIR: 'pago',
          dataPagamentoKit: dataPagamento,
          asaasPaymentIdKit: paymentId,
          asaasStatusKit: payload.payment.status,
          statusEnvioKit: 'agendado',
          dataEnvioKit: dataEnvio,
          statusEmail: 'agendado',
          dataAgendamentoEmail: dataEnvio,
          updatedAt: new Date(),
        })
        .where(eq(irpfForms.id, formulario.id));

      console.log(`[Webhook ASAAS] Kit IR atualizado para formulário ${formulario.id}`);
      console.log(`[Webhook ASAAS] Envio agendado para: ${dataEnvio.toISOString()}`);

      return res.status(200).json({
        received: true,
        message: 'Kit IR atualizado com sucesso',
        scheduledDate: dataEnvio.toISOString(),
      });
    } else {
      // Pagamento inicial (cálculo)
      console.log('[Webhook ASAAS] Pagamento inicial confirmado');
      
      await db
        .update(irpfForms)
        .set({
          statusPagamento: 'pago',
          dataPagamento: new Date(payload.payment.confirmedDate || payload.payment.paymentDate || new Date()),
          asaasPaymentId: paymentId,
          asaasStatus: payload.payment.status,
          updatedAt: new Date(),
        })
        .where(eq(irpfForms.id, formulario.id));

      console.log(`[Webhook ASAAS] Pagamento inicial atualizado para formulário ${formulario.id}`);

      return res.status(200).json({
        received: true,
        message: 'Pagamento inicial atualizado com sucesso',
      });
    }
  } catch (error) {
    console.error('[Webhook ASAAS] Erro ao processar webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Validar assinatura do webhook ASAAS (opcional, mas recomendado)
 * 
 * O ASAAS envia um header 'asaas-access-token' que pode ser validado
 */
export function validateAsaasWebhook(req: Request): boolean {
  const token = req.headers['asaas-access-token'];
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;

  if (!expectedToken) {
    console.warn('[Webhook ASAAS] ASAAS_WEBHOOK_TOKEN não configurado');
    return true; // Permitir se não configurado (desenvolvimento)
  }

  if (token !== expectedToken) {
    console.error('[Webhook ASAAS] Token inválido');
    return false;
  }

  return true;
}

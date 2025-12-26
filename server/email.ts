import sgMail from "@sendgrid/mail";
import type { IrpfForm } from "../drizzle/schema";

// Configurar API key do SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = "noreply@e-restituicao.com"; // Usar domínio verificado no SendGrid

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/**
 * Enviar email de notificação quando Kit IR é pago
 */
export async function notificarKitIRPago(form: IrpfForm): Promise<boolean> {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn("[Email] SendGrid API key não configurada");
      return false;
    }

    const msg = {
      to: form.email,
      from: SENDER_EMAIL,
      subject: "Kit IR aprovado - Seus documentos serão enviados em breve",
      html: `
        <h2>Olá ${form.nomeCliente},</h2>
        <p>Seu Kit IR foi aprovado com sucesso!</p>
        <p>Seus documentos serão enviados automaticamente em 7 dias úteis:</p>
        <ul>
          <li>Planilha RT (Demonstrativo de Apuração)</li>
          <li>Esclarecimentos ao Auditor</li>
        </ul>
        <p>Qualquer dúvida, entre em contato conosco.</p>
        <p>Atenciosamente,<br><strong>e-Restituição</strong></p>
      `,
    };

    await sgMail.send(msg);
    console.log(`[Email] Notificação Kit IR enviada para ${form.email}`);
    return true;
  } catch (error) {
    console.error(`[Email] Erro ao enviar notificação Kit IR:`, error);
    return false;
  }
}

/**
 * Enviar email de notificação para admin
 */
export async function notificarAdmin(
  titulo: string,
  conteudo: string
): Promise<boolean> {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn("[Email] SendGrid API key não configurada");
      return false;
    }

    const msg = {
      to: "erestituicao@gmail.com",
      from: SENDER_EMAIL,
      subject: `[Dashboard] ${titulo}`,
      html: `
        <h2>${titulo}</h2>
        <p>${conteudo}</p>
        <p><em>Mensagem automática do Dashboard e-Restituição</em></p>
      `,
    };

    await sgMail.send(msg);
    console.log(`[Email] Notificação enviada para admin`);
    return true;
  } catch (error) {
    console.error(`[Email] Erro ao enviar notificação:`, error);
    return false;
  }
}

/**
 * Enviar email com PDFs anexados (implementação futura)
 * Requer captura de PDFs como Blob do jsPDF
 */
export async function enviarPDFsPorEmail(
  form: IrpfForm,
  planilhaRTBlob: Blob,
  esclarecimentosBlob: Blob
): Promise<boolean> {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn("[Email] SendGrid API key não configurada");
      return false;
    }

    // Converter Blobs para Buffer
    const planilhaRTBuffer = Buffer.from(await planilhaRTBlob.arrayBuffer());
    const esclarecimentosBuffer = Buffer.from(
      await esclarecimentosBlob.arrayBuffer()
    );

    const attachments = [
      {
        content: planilhaRTBuffer.toString("base64"),
        filename: `Planilha_RT_${form.cpf.replace(/[^\d]/g, "")}.pdf`,
        type: "application/pdf",
        disposition: "attachment" as const,
      },
      {
        content: esclarecimentosBuffer.toString("base64"),
        filename: `Esclarecimentos_${form.cpf.replace(/[^\d]/g, "")}.pdf`,
        type: "application/pdf",
        disposition: "attachment" as const,
      },
    ];

    const msg = {
      to: form.email,
      from: SENDER_EMAIL,
      subject: `Seus documentos IRPF - ${form.nomeCliente}`,
      html: `
        <h2>Olá ${form.nomeCliente},</h2>
        <p>Seus documentos de cálculo de IRPF estão prontos!</p>
        <p>Em anexo você encontra:</p>
        <ul>
          <li><strong>Planilha RT (Demonstrativo de Apuração)</strong> - Detalhamento completo dos cálculos</li>
          <li><strong>Esclarecimentos ao Auditor</strong> - Documentação técnica da ação</li>
        </ul>
        <p>Estes documentos são essenciais para sua declaração de ajuste anual do IR.</p>
        <p>Qualquer dúvida, entre em contato conosco.</p>
        <p>Atenciosamente,<br><strong>e-Restituição</strong></p>
      `,
      attachments,
    };

    await sgMail.send(msg);
    console.log(`[Email] Email com PDFs enviado para ${form.email}`);
    return true;
  } catch (error) {
    console.error(`[Email] Erro ao enviar email com PDFs:`, error);
    return false;
  }
}

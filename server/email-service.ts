import nodemailer from "nodemailer";

/**
 * Configuração do serviço de email
 * Usa variáveis de ambiente para credenciais
 */

const EMAIL_USER = process.env.EMAIL_USER || "kitir@e-restituicao.com.br";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "";
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587", 10);

/**
 * Criar transporter do Nodemailer
 * Configurado para usar Gmail ou SMTP customizado
 */
export const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true para 465, false para outros portos
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
};

/**
 * Interface para dados de email
 */
export interface EmailData {
  destinatario: string;
  nomeCliente: string;
  assunto: string;
  htmlContent: string;
  pdfAttachment?: {
    filename: string;
    content: Buffer;
    contentType: string;
  };
}

/**
 * Enviar email com PDF anexado
 */
export async function enviarEmailComPDF(data: EmailData): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();

    const attachments = data.pdfAttachment ? [data.pdfAttachment] : [];

    const mailOptions = {
      from: EMAIL_USER,
      to: data.destinatario,
      subject: data.assunto,
      html: data.htmlContent,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Enviado com sucesso: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar:", error);
    return false;
  }
}

/**
 * Template HTML para email do Kit IR
 */
export function gerarTemplateEmailKitIR(
  nomeCliente: string,
  numeroProcesso: string,
  irpfRestituir: number
): string {
  const irpfFormatado = (irpfRestituir / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kit IR - e-Restituição</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #27ae60;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #27ae60;
          margin: 0;
        }
        .content {
          margin: 20px 0;
        }
        .info-box {
          background-color: #f0f8f0;
          border-left: 4px solid #27ae60;
          padding: 15px;
          margin: 15px 0;
          border-radius: 4px;
        }
        .value {
          font-size: 24px;
          font-weight: bold;
          color: #27ae60;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          border-top: 1px solid #ddd;
          padding-top: 20px;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          background-color: #27ae60;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Kit IR - e-Restituição</h1>
          <p>Seus documentos estão prontos!</p>
        </div>

        <div class="content">
          <p>Olá <strong>${nomeCliente}</strong>,</p>

          <p>Após o período de 7 dias da Lei do Arrependimento, seus documentos do Kit IR foram preparados e estão prontos para protocolo na Receita Federal.</p>

          <div class="info-box">
            <p><strong>Nº do Processo:</strong> ${numeroProcesso}</p>
            <p><strong>Valor a Restituir:</strong></p>
            <div class="value">${irpfFormatado}</div>
          </div>

          <p>Os documentos anexados incluem:</p>
          <ul>
            <li>Demonstrativo de Apuração de Rendimento Tributável (Planilha RT)</li>
            <li>Esclarecimentos ao Auditor da Receita Federal</li>
            <li>Documentos Processuais</li>
          </ul>

          <p>Estes documentos devem ser protocolados junto à Receita Federal para liberação da declaração na malha fina e processamento da restituição.</p>

          <p>Em caso de dúvidas, entre em contato conosco.</p>

          <p>Atenciosamente,<br>
          <strong>e-Restituição</strong><br>
          Especialistas em Restituição de IR</p>
        </div>

        <div class="footer">
          <p>Este é um email automático. Não responda a este endereço.</p>
          <p>&copy; 2025 e-Restituição. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Enviar email de Kit IR com PDFs anexados
 */
export async function enviarKitIR(
  emailCliente: string,
  nomeCliente: string,
  numeroProcesso: string,
  irpfRestituir: number,
  pdfDemonstrativo: Buffer,
  pdfEsclarecimentos: Buffer
): Promise<boolean> {
  try {
    const htmlContent = gerarTemplateEmailKitIR(nomeCliente, numeroProcesso, irpfRestituir);

    const transporter = createEmailTransporter();

    const mailOptions = {
      from: EMAIL_USER,
      to: emailCliente,
      subject: `Kit IR - Processo ${numeroProcesso} - e-Restituição`,
      html: htmlContent,
      attachments: [
        {
          filename: `Planilha-RT-${numeroProcesso}.pdf`,
          content: pdfDemonstrativo,
          contentType: "application/pdf",
        },
        {
          filename: `Esclarecimentos-${numeroProcesso}.pdf`,
          content: pdfEsclarecimentos,
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Kit IR] Email enviado com sucesso: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[Kit IR] Erro ao enviar email:", error);
    return false;
  }
}

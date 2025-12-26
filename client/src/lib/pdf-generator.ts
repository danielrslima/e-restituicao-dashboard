import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatCurrency, formatDate } from "./format";

export interface IrpfFormData {
  id: number;
  nomeCliente: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone?: string | null;
  numeroProcesso: string;
  vara: string;
  comarca: string;
  fontePagadora: string;
  cnpj: string;
  brutoHomologado: number;
  tributavelHomologado: number;
  numeroMeses: number;
  alvaraValor: number;
  alvaraData: string;
  darfValor: number;
  darfData: string;
  honorariosValor: number;
  honorariosAno: string;
  proporcao: string;
  rendimentosTributavelAlvara: number;
  rendimentosTributavelHonorarios: number;
  baseCalculo: number;
  rra: string;
  irMensal: string;
  irDevido: number;
  irpfRestituir: number;
  createdAt: Date;
}

/**
 * Gerar PDF do Demonstrativo de Apuração (Template 1)
 */
export async function generateDemonstratividePDF(form: IrpfFormData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Configurar fonte
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);

  // Título
  doc.setFontSize(14);
  doc.setFont("Helvetica", "bold");
  doc.text("DEMONSTRATIVO DE APURAÇÃO DAS VERBAS TRIBUTÁVEIS", margin, yPos);
  doc.text("REFERENTES À RECLAMAÇÃO TRABALHISTA", margin, yPos + 6);
  yPos += 15;

  // Cabeçalho com DIRPF e ano
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.text(`DIRPF ${new Date(form.createdAt).getFullYear()}`, pageWidth - margin - 40, yPos - 9);

  // Seção: Dados do Contribuinte
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("DADOS DO CONTRIBUINTE", margin, yPos);
  yPos += 7;

  // Tabela de dados pessoais
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const tableData = [
    ["Nome do Cliente:", form.nomeCliente],
    ["CPF:", form.cpf],
    ["Data de Nascimento:", form.dataNascimento],
  ];

  tableData.forEach((row) => {
    doc.text(row[0], margin + 2, yPos);
    doc.text(row[1], margin + 50, yPos);
    yPos += 6;
  });

  yPos += 3;

  // Seção: Dados do Processo
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("DADOS DO PROCESSO", margin, yPos);
  yPos += 7;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const processData = [
    ["Nº Processo:", form.numeroProcesso],
    ["Comarca:", form.comarca],
    ["Vara:", form.vara],
  ];

  processData.forEach((row) => {
    doc.text(row[0], margin + 2, yPos);
    doc.text(row[1], margin + 50, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Seção: Valores Principais
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("1 - TOTAL DE RENDIMENTOS RETIRADO PELO AUTOR:", margin, yPos);
  doc.setFont("Helvetica", "normal");
  doc.text(formatCurrency(form.alvaraValor), pageWidth - margin - 30, yPos);
  yPos += 6;

  doc.setFont("Helvetica", "bold");
  doc.text("2 - TOTAL DE DARF PAGA:", margin, yPos);
  doc.setFont("Helvetica", "normal");
  doc.text(formatCurrency(form.darfValor), pageWidth - margin - 30, yPos);
  yPos += 6;

  doc.setFont("Helvetica", "bold");
  doc.text("3 - TOTAL DA CAUSA:", margin, yPos);
  doc.setFont("Helvetica", "normal");
  const totalCausa = form.alvaraValor + form.darfValor;
  doc.text(formatCurrency(totalCausa), pageWidth - margin - 30, yPos);
  yPos += 10;

  // Seção: Apuração de Rendimentos
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("APURAÇÃO DOS RENDIMENTOS ISENTOS DE TRIBUTAÇÃO", margin, yPos);
  yPos += 7;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  const apuracaoData = [
    ["4 - RENDIMENTOS BRUTO HOMOLOGADO/ATUALIZADO:", formatCurrency(form.brutoHomologado)],
    ["5 - RENDIMENTOS TRIBUTÁVEIS CALCULADOS NA MESMA DATA BASE:", formatCurrency(form.tributavelHomologado)],
    ["6 - PROPORÇÃO DE RENDIMENTOS TRIBUTÁVEIS:", form.proporcao],
    ["7 - TOTAL DE RENDIMENTOS ISENTOS:", formatCurrency(form.brutoHomologado - form.tributavelHomologado)],
    ["8 - RENDIMENTOS SUJEITOS À TRIBUTAÇÃO NORMAL:", formatCurrency(form.rendimentosTributavelAlvara)],
    ["9 - TOTAL DE DESPESAS PAGAS COM ADVOGADO, PERITO E CUSTAS:", formatCurrency(form.honorariosValor)],
    ["10 - PROPORÇÃO A DEDUZIR DE DESPESAS PAGAS:", formatCurrency(form.rendimentosTributavelHonorarios)],
  ];

  apuracaoData.forEach((row) => {
    doc.setFont("Helvetica", "bold");
    doc.text(row[0], margin + 2, yPos);
    doc.setFont("Helvetica", "normal");
    doc.text(row[1], pageWidth - margin - 30, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Seção: Valores Esperados da Declaração
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("VALORES ESPERADOS DA DECLARAÇÃO DE AJUSTE ANUAL DO IR", margin, yPos);
  yPos += 7;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  const declaracaoData = [
    ["11 - CNPJ:", form.cnpj],
    ["12 - FONTE PAGADORA:", form.fontePagadora],
    ["13 - RENDIMENTOS TRIBUTÁVEIS:", formatCurrency(form.baseCalculo)],
    ["14 - CONTRIBUIÇÃO PREVIDÊNCIA OFICIAL (INSS):", "R$ 0,00"],
    ["15 - IMPOSTO DE RENDA RETIDO NA FONTE:", formatCurrency(form.darfValor)],
    ["16 - MÊS DO RECEBIMENTO:", "DEZEMBRO"],
    ["17 - MESES DISCUTIDOS NA AÇÃO:", `${form.numeroMeses},00`],
    ["18 - RENDIMENTOS ISENTOS E NÃO TRIBUTÁVEIS:", formatCurrency(form.brutoHomologado - form.tributavelHomologado)],
  ];

  declaracaoData.forEach((row) => {
    doc.setFont("Helvetica", "bold");
    doc.text(row[0], margin + 2, yPos);
    doc.setFont("Helvetica", "normal");
    doc.text(row[1], pageWidth - margin - 30, yPos);
    yPos += 6;

    // Quebra de página se necessário
    if (yPos > pageHeight - margin - 10) {
      doc.addPage();
      yPos = margin;
    }
  });

  // Salvar PDF
  doc.save(`Demonstrativo_${form.nomeCliente.replace(/\s+/g, "_")}.pdf`);
}

/**
 * Gerar PDF de Esclarecimentos ao Auditor (Template 2)
 */
export async function generateEsclarecimentosPDF(form: IrpfFormData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  // Configurar fonte
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);

  // Título
  doc.setFontSize(12);
  doc.setFont("Helvetica", "bold");
  doc.text("ESCLARECIMENTOS SOBRE OS RENDIMENTOS RECEBIDOS ACUMULADAMENTE", margin, yPos);
  doc.text("AO SETOR DE MALHA FISCAL DA RECEITA FEDERAL DO BRASIL", margin, yPos + 6);
  yPos += 15;

  // Cabeçalho
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.text(`CONTRIBUINTE: ${form.nomeCliente}`, margin, yPos);
  yPos += 6;
  doc.text(`CPF: ${form.cpf}`, margin, yPos);
  yPos += 6;
  doc.text(`DATA DE NASCIMENTO: ${form.dataNascimento}`, margin, yPos);
  yPos += 6;
  doc.text(`DIRPF ${new Date(form.createdAt).getFullYear()}`, margin, yPos);
  yPos += 10;

  // Seção A
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("A) DADOS DA AÇÃO:", margin, yPos);
  yPos += 7;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const aText = `Os valores declarados se referem a rendimento recebido de forma acumulada, referente a Ação Judicial Trabalhista, processo n.º ${form.numeroProcesso} que tramitou perante a ${form.vara} de ${form.comarca}.`;
  const aLines = doc.splitTextToSize(aText, pageWidth - 2 * margin);
  doc.text(aLines, margin, yPos);
  yPos += aLines.length * 5 + 5;

  // Seção B
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("B) VALORES E DATAS:", margin, yPos);
  yPos += 7;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const bText = `2) O valor total levantado pelo(a) contribuinte, referente ao exercício foi de ${formatCurrency(form.brutoHomologado)};

3) O imposto de renda no valor total de ${formatCurrency(form.darfValor)}, foi retido pela Reclamada ${form.fontePagadora} - CNPJ n.º ${form.cnpj}, conforme documento(s) anexo(s);

4) O valor bruto da ação corresponde a soma entre o(s) alvará(s)/mandado(s) de levantamento e o imposto de renda retido, o que equivale, neste caso, ao valor de ${formatCurrency(form.alvaraValor + form.darfValor)} (item 3, da planilha);

5) O valor atualizado apurado de ${formatCurrency(form.rendimentosTributavelAlvara)} (item 8, da planilha), referente ao(s) Rendimento(s) Tributável(is), equivale(m) a ${form.proporcao} do valor bruto da ação (item 3), conforme apurado em planilha anexa;

6) O valor total apurado de despesas dedutiveis¹ com a ação judicial, sobre a mesma proporção dos rendimentos tributáveis, nos exatos termos da Lei, foi de ${formatCurrency(form.rendimentosTributavelHonorarios)}.`;

  const bLines = doc.splitTextToSize(bText, pageWidth - 2 * margin);
  doc.text(bLines, margin, yPos);
  yPos += bLines.length * 4 + 10;

  // Tabela de campos RRA
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("CAMPOS E VALORES DECLARADOS NA FICHA DE RRA* DA DIRPF,", margin, yPos);
  doc.text("NA OPÇÃO DE TRIBUTAÇÃO EXCLUSIVA NA FONTE", margin, yPos + 6);
  yPos += 15;

  // Desenhar tabela
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("A) RENDIMENTOS TRIBUTÁVEIS RECEBIDOS:", margin, yPos);
  doc.text(formatCurrency(form.baseCalculo), pageWidth - margin - 30, yPos);
  yPos += 8;

  doc.text("B) INSS RECLAMANTE:", margin, yPos);
  doc.text("R$ 0,00", pageWidth - margin - 30, yPos);
  yPos += 8;

  doc.text("C) IMPOSTO DE RENDA RETIDO NA FONTE:", margin, yPos);
  doc.text(formatCurrency(form.darfValor), pageWidth - margin - 30, yPos);
  yPos += 8;

  doc.text("D) Nº DE MESES DISCUTIDOS NA AÇÃO:", margin, yPos);
  doc.text(`${form.numeroMeses},00`, pageWidth - margin - 30, yPos);
  yPos += 10;

  // Ficha de rendimentos isentos
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("FICHA DE RENDIMENTOS ISENTOS", margin, yPos);
  yPos += 8;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("RENDIMENTOS ISENTOS:", margin, yPos);
  doc.text(formatCurrency(form.brutoHomologado - form.tributavelHomologado), pageWidth - margin - 30, yPos);
  yPos += 10;

  // Observações
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Obs.:", margin, yPos);
  yPos += 6;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const obsText = `a) Os honorários pagos, foram lançados na ficha de pagamentos, em item próprio;

b) O valor referente ao rendimento isento foi lançado na ficha de rendimentos isentos e não tributáveis, no item "OUTROS", com a denominação de "Verbas Isentas Ação Judicial", com os mesmos dados da Fonte Pagadora.

1 Art. 12.A, §2º da Lei 7.713/88`;

  const obsLines = doc.splitTextToSize(obsText, pageWidth - 2 * margin);
  doc.text(obsLines, margin, yPos);

  // Salvar PDF
  doc.save(`Esclarecimentos_${form.nomeCliente.replace(/\s+/g, "_")}.pdf`);
}

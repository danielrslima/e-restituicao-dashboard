import jsPDF from "jspdf";
import { formatCurrency } from "./format";

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
 * Gerar PDF da Planilha RT (Demonstrativo de Apuração) - Template 1
 * Segue fielmente o layout do template original com logo IR360 e tabelas
 */
export async function generateDemonstratividePDF(form: IrpfFormData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 15;

  // Logo IR360 no topo
  try {
    const logoImg = new Image();
    logoImg.src = "/logos/logo-ir360-planilha.png";
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve; // Continuar mesmo se falhar
    });
    if (logoImg.complete) {
      doc.addImage(logoImg, "PNG", (pageWidth - 60) / 2, yPos, 60, 21);
    }
  } catch (error) {
    console.warn("Erro ao carregar logo:", error);
  }

  yPos += 28;

  // Tabela de cabeçalho (verde claro)
  doc.setFillColor(200, 230, 201); // Verde claro
  doc.rect(margin, yPos, pageWidth - 2 * margin, 14, "F");
  doc.setDrawColor(0);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 14, "S");

  // Dividir em 3 colunas
  const col1Width = (pageWidth - 2 * margin) * 0.6;
  const col2Width = (pageWidth - 2 * margin) * 0.2;
  const col3Width = (pageWidth - 2 * margin) * 0.2;

  doc.line(margin + col1Width, yPos, margin + col1Width, yPos + 14);
  doc.line(margin + col1Width + col2Width, yPos, margin + col1Width + col2Width, yPos + 14);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DEMONSTRATIVO DE APURAÇÃO DAS VERBAS TRIBUTÁVEIS", margin + 2, yPos + 5);
  doc.text("REFERENTES À RECLAMAÇÃO TRABALHISTA", margin + 2, yPos + 10);
  doc.text("DIRPF", margin + col1Width + 5, yPos + 8);
  doc.text(new Date(form.createdAt).getFullYear().toString(), margin + col1Width + col2Width + 5, yPos + 8);

  yPos += 16;

  // Seção: DADOS DO CONTRIBUINTE
  doc.setFillColor(200, 230, 201);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 139); // Azul escuro
  doc.text("DADOS DO CONTRIBUINTE", margin + 2, yPos + 4);
  doc.setTextColor(0, 0, 0);
  yPos += 6;

  // Linha 1: Nome e CPF
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
  doc.line(margin + 120, yPos, margin + 120, yPos + 6);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Nome:", margin + 2, yPos + 4);
  doc.text(form.nomeCliente.toUpperCase(), margin + 15, yPos + 4);
  doc.text("CPF:", margin + 122, yPos + 4);
  doc.text(form.cpf, margin + 130, yPos + 4);
  yPos += 6;

  // Seção: DADOS DO PROCESSO
  doc.setFillColor(200, 230, 201);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 139);
  doc.text("DADOS DO PROCESSO", margin + 2, yPos + 4);
  doc.setTextColor(0, 0, 0);
  yPos += 6;

  // Linha 1: Nº Processo
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Nº do Processo:", margin + 2, yPos + 4);
  doc.text(form.numeroProcesso, margin + 30, yPos + 4);
  yPos += 6;

  // Linha 2: Vara e Comarca
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
  doc.line(margin + 90, yPos, margin + 90, yPos + 6);
  doc.text("Vara:", margin + 2, yPos + 4);
  doc.text(form.vara, margin + 15, yPos + 4);
  doc.text("Comarca:", margin + 92, yPos + 4);
  doc.text(form.comarca, margin + 110, yPos + 4);
  yPos += 6;

  // Linha 3: Fonte Pagadora e CNPJ
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
  doc.line(margin + 120, yPos, margin + 120, yPos + 6);
  doc.text("Fonte Pagadora:", margin + 2, yPos + 4);
  doc.text(form.fontePagadora, margin + 30, yPos + 4);
  doc.text("CNPJ:", margin + 122, yPos + 4);
  doc.text(form.cnpj, margin + 135, yPos + 4);
  yPos += 6;

  // Seção: VALORES PRINCIPAIS
  doc.setFillColor(200, 230, 201);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 139);
  doc.text("VALORES PRINCIPAIS", margin + 2, yPos + 4);
  doc.setTextColor(0, 0, 0);
  yPos += 6;

  const valoresPrincipais = [
    ["Bruto Homologado:", formatCurrency(form.brutoHomologado)],
    ["Tributável Homologado:", formatCurrency(form.tributavelHomologado)],
    ["Número de Meses:", form.numeroMeses.toString()],
    ["Alvará:", `${formatCurrency(form.alvaraValor)} (${form.alvaraData})`],
    ["DARF:", `${formatCurrency(form.darfValor)} (${form.darfData})`],
    ["Honorários:", `${formatCurrency(form.honorariosValor)} (${form.honorariosAno})`],
  ];

  valoresPrincipais.forEach((row) => {
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
    doc.line(margin + 60, yPos, margin + 60, yPos + 6);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.text(row[0], margin + 2, yPos + 4);
    doc.text(row[1], margin + 62, yPos + 4);
    yPos += 6;
  });

  // Seção: APURAÇÃO DE RENDIMENTOS
  doc.setFillColor(200, 230, 201);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 139);
  doc.text("APURAÇÃO DE RENDIMENTOS", margin + 2, yPos + 4);
  doc.setTextColor(0, 0, 0);
  yPos += 6;

  const apuracao = [
    ["Proporção:", form.proporcao],
    ["Rend. Trib. Alvará:", formatCurrency(form.rendimentosTributavelAlvara)],
    ["Rend. Trib. Honorários:", formatCurrency(form.rendimentosTributavelHonorarios)],
    ["Base de Cálculo:", formatCurrency(form.baseCalculo)],
    ["RRA:", form.rra],
    ["IR Mensal:", form.irMensal],
    ["IR Devido:", formatCurrency(form.irDevido)],
  ];

  apuracao.forEach((row) => {
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
    doc.line(margin + 60, yPos, margin + 60, yPos + 6);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.text(row[0], margin + 2, yPos + 4);
    doc.text(row[1], margin + 62, yPos + 4);
    yPos += 6;
  });

  // Resultado Final (destaque verde)
  doc.setFillColor(200, 230, 201);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 8, "F");
  doc.rect(margin, yPos, pageWidth - 2 * margin, 8, "S");
  doc.line(margin + 60, yPos, margin + 60, yPos + 8);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("IRPF A RESTITUIR:", margin + 2, yPos + 5.5);
  doc.text(formatCurrency(form.irpfRestituir), margin + 62, yPos + 5.5);

  // Salvar PDF
  doc.save(`Demonstrativo-${form.nomeCliente.replace(/\s+/g, "_")}.pdf`);
}

/**
 * Gerar PDF de Esclarecimentos ao Auditor - Template 2
 * CORRIGIDO para ficar 100% idêntico ao documento perfeito
 */
export async function generateEsclarecimentosPDF(form: IrpfFormData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = 20;

  // Logo e-Restituição no topo
  try {
    const logoImg = new Image();
    logoImg.src = "/logos/logotipo-e-restituicaoIR.jpg";
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve;
    });
    if (logoImg.complete) {
      doc.addImage(logoImg, "JPEG", (pageWidth - 60) / 2, yPos, 60, 15);
    }
  } catch (error) {
    console.warn("Erro ao carregar logo:", error);
  }

  yPos += 22;
  doc.setTextColor(0, 0, 0);

  // Linha horizontal grossa
  doc.setLineWidth(1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Título (centralizado, negrito)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  const titulo1 = "ESCLARECIMENTOS SOBRE OS RENDIMENTOS RECEBIDOS ACUMULADAMENTE AO SETOR DE MALHA";
  const titulo2 = "FISCAL DA RECEITA FEDERAL DO BRASIL";
  doc.text(titulo1, pageWidth / 2, yPos, { align: "center" });
  yPos += 5;
  doc.text(titulo2, pageWidth / 2, yPos, { align: "center" });
  yPos += 12;

  // Dados do contribuinte
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`CONTRIBUINTE: ${form.nomeCliente.toUpperCase()}`, margin, yPos);
  doc.text(`DIRPF ${new Date(form.createdAt).getFullYear()}`, pageWidth - margin - 30, yPos);
  yPos += 5;
  doc.text(`CPF: ${form.cpf}`, margin, yPos);
  yPos += 5;
  doc.text(`DATA DE NASCIMENTO: ${form.dataNascimento}`, margin, yPos);
  yPos += 10;

  // Seção A) DADOS DA AÇÃO: (negrito, SEM sublinhado)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("A) DADOS DA AÇÃO:", margin, yPos);
  yPos += 6;

  // Item 1) com indentação de 10mm
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const textoA = `Os valores declarados se referem a rendimento recebido de forma acumulada, referente a Ação Judicial Trabalhista, processo n.º ${form.numeroProcesso} que tramitou perante a ${form.vara} de ${form.comarca}.`;
  const linhasA = doc.splitTextToSize(textoA, pageWidth - 2 * margin - 10);
  
  // Renderizar "1)" separado e depois o texto com indentação
  doc.text("1)", margin, yPos);
  doc.text(linhasA, margin + 10, yPos);
  yPos += linhasA.length * 5 + 8;

  // Seção B) VALORES E DATAS: (negrito, SEM sublinhado)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("B) VALORES E DATAS:", margin, yPos);
  yPos += 6;

  // Itens 2-6 com ESPAÇAMENTO ENTRE PARÁGRAFOS (alinhado à esquerda, NÃO justificado)
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const totalBruto = form.alvaraValor + form.darfValor;
  
  const itensB = [
    `2) O valor total levantado pelo(a) contribuinte, referente ao exercício foi de ${formatCurrency(totalBruto)};`,
    
    `3) O imposto de renda no valor total de ${formatCurrency(form.darfValor)}, foi retido por ${form.fontePagadora} - CNPJ n.º ${form.cnpj}, conforme documento(s) anexo(s);`,
    
    `4) O valor bruto da ação corresponde a soma entre o(s) alvará(s)/mandado(s) de levantamento e o imposto de renda retido, o que equivale, neste caso, ao valor de ${formatCurrency(form.baseCalculo)} (Item 3, da planilha);`,
    
    `5) O valor atualizado apurado de ${formatCurrency(form.rendimentosTributavelAlvara)} (Item 8, da planilha), referente ao(s) Rendimento(s) Tributável(is), equivale(m) a ${form.proporcao} do valor bruto da ação (Item 3), conforme apurado em planilha anexa;`,
    
    `6) O valor total apurado de despesas dedutíveis¹ com a ação judicial, sobre a mesma proporção dos rendimentos tributáveis, nos exatos termos da Lei, foi de ${formatCurrency(form.rendimentosTributavelHonorarios)}.`
  ];

  // Renderizar cada item com espaçamento adequado (NÃO justificado)
  itensB.forEach((item, index) => {
    const linhasItem = doc.splitTextToSize(item, pageWidth - 2 * margin);
    doc.text(linhasItem, margin, yPos);
    yPos += linhasItem.length * 5 + 4; // Espaço entre parágrafos
  });
  yPos += 3;

  // Título da tabela (centralizado, negrito, SEM sublinhado)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  const titulo1RRA = "CAMPOS E VALORES DECLARADOS NA FICHA DE RRA* DA DIRPF,";
  const titulo2RRA = "NA OPÇÃO DE TRIBUTAÇÃO EXCLUSIVA NA FONTE";
  doc.text(titulo1RRA, pageWidth / 2, yPos, { align: "center" });
  yPos += 5;
  doc.text(titulo2RRA, pageWidth / 2, yPos, { align: "center" });
  yPos += 8;

  // Tabela com bordas de 0.5mm
  const tabelaRRA = [
    ["A) RENDIMENTOS TRIBUTÁVEIS RECEBIDOS:", formatCurrency(form.baseCalculo)],
    ["B) INSS RECLAMANTE:", "R$ 0,00"],
    ["C) IMPOSTO DE RENDA RETIDO NA FONTE:", formatCurrency(form.darfValor)],
    ["D) Nº DE MESES DISCUTIDOS NA AÇÃO:", `${form.numeroMeses},00`],
  ];

  tabelaRRA.forEach((row) => {
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 7, "S");
    doc.line(pageWidth - margin - 45, yPos, pageWidth - margin - 45, yPos + 7);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text(row[0], margin + 2, yPos + 4.5);
    doc.setFont("Helvetica", "normal");
    doc.text(row[1], pageWidth - margin - 3, yPos + 4.5, { align: "right" });
    yPos += 7;
  });

  yPos += 5;

  // Título: FICHA DE RENDIMENTOS ISENTOS (centralizado, negrito)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("FICHA DE RENDIMENTOS ISENTOS", pageWidth / 2, yPos, { align: "center" });
  yPos += 7;

  // Tabela de rendimentos isentos
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 7, "S");
  doc.line(pageWidth - margin - 45, yPos, pageWidth - margin - 45, yPos + 7);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.text("RENDIMENTOS ISENTOS:", margin + 2, yPos + 4.5);
  doc.setFont("Helvetica", "normal");
  const rendimentosIsentos = form.brutoHomologado - form.tributavelHomologado;
  doc.text(formatCurrency(rendimentosIsentos), pageWidth - margin - 3, yPos + 4.5, { align: "right" });
  yPos += 12;

  // Observações (negrito com dois pontos)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Observações.:", margin, yPos);
  yPos += 6;

  // Texto das observações (normal, alinhado à esquerda, NÃO justificado)
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  
  // Item a)
  const textoObsA = "a) Os honorários pagos, foram lançados na ficha de pagamentos, em item próprio;";
  const linhasObsA = doc.splitTextToSize(textoObsA, pageWidth - 2 * margin);
  doc.text(linhasObsA, margin, yPos);
  yPos += linhasObsA.length * 5 + 5;

  // Item b)
  const textoObsB = 'b) O valor referente ao rendimento isento foi lançado na ficha de rendimentos isentos e não tributáveis, no item "OUTROS", com a denominação de "Verbas Isentas Ação Judicial", com os mesmos dados da Fonte Pagadora.';
  const linhasObsB = doc.splitTextToSize(textoObsB, pageWidth - 2 * margin);
  doc.text(linhasObsB, margin, yPos);
  yPos += linhasObsB.length * 5 + 8;

  // Linha horizontal antes da referência legal
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, margin + 50, yPos);
  yPos += 5;

  // Referência legal
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text("1 Art. 12.A, §2º da Lei 7.713/88", margin, yPos);
  yPos += 8;

  // Linha horizontal grossa após referência
  doc.setLineWidth(1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Logo IR360 no rodapé
  try {
    const logoRodapeImg = new Image();
    logoRodapeImg.src = "/logos/logo-ir360-transparent.png";
    await new Promise((resolve) => {
      logoRodapeImg.onload = resolve;
      logoRodapeImg.onerror = resolve;
    });
    if (logoRodapeImg.complete) {
      doc.addImage(logoRodapeImg, "PNG", (pageWidth - 40) / 2, pageHeight - 25, 40, 19);
    }
  } catch (error) {
    console.warn("Erro ao carregar logo rodapé:", error);
  }

  // Salvar PDF
  doc.save(`Esclarecimentos-${form.nomeCliente.replace(/\s+/g, "_")}.pdf`);
}

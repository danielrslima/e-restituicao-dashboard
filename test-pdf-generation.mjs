import pkg from 'jspdf';
const { jsPDF } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dados de teste (João Pedro Oliveira)
const formData = {
  id: 2,
  nomeCliente: "JOÃO PEDRO OLIVEIRA",
  cpf: "987.654.321-00",
  dataNascimento: "22/07/1978",
  email: "joao.oliveira@email.com",
  telefone: "(21) 99876-5432",
  numeroProcesso: "0009876-54.2021.5.01.0003",
  vara: "3ª Vara do Trabalho",
  comarca: "Rio de Janeiro - RJ",
  fontePagadora: "Empresa XYZ S.A.",
  cnpj: "98.765.432/0001-10",
  brutoHomologado: 2500.00,
  tributavelHomologado: 2000.00,
  numeroMeses: 36,
  alvaraValor: 1800.00,
  alvaraData: "2023-06-10",
  darfValor: 250.00,
  darfData: "2023-07-05",
  honorariosValor: 500.00,
  honorariosAno: "2023",
  proporcao: "75%",
  rendimentosTributavelAlvara: 1350.00,
  rendimentosTributavelHonorarios: 375.00,
  baseCalculo: 1725.00,
  rra: "36",
  irMensal: "2100.00",
  irDevido: 288.00,
  irpfRestituir: 2191.81,
  createdAt: new Date("2025-12-26")
};

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

async function generateEsclarecimentosPDF() {
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
  const logoPath = path.join(__dirname, 'client/public/logos/logotipo-e-restituicaoIR.jpg');
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath).toString('base64');
    doc.addImage(`data:image/jpeg;base64,${logoData}`, "JPEG", (pageWidth - 60) / 2, yPos, 60, 15);
  }

  yPos += 22;
  doc.setTextColor(0, 0, 0);

  // Linha horizontal grossa
  doc.setLineWidth(1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Título
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
  doc.text(`CONTRIBUINTE: ${formData.nomeCliente}`, margin, yPos);
  doc.text(`DIRPF ${formData.createdAt.getFullYear()}`, pageWidth - margin - 30, yPos);
  yPos += 5;
  doc.text(`CPF: ${formData.cpf}`, margin, yPos);
  yPos += 5;
  doc.text(`DATA DE NASCIMENTO: ${formData.dataNascimento}`, margin, yPos);
  yPos += 10;

  // Seção A
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("A) DADOS DA AÇÃO:", margin, yPos);
  yPos += 6;

  // Item 1) com indentação
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const textoA = `Os valores declarados se referem a rendimento recebido de forma acumulada, referente a Ação Judicial Trabalhista, processo n.º ${formData.numeroProcesso} que tramitou perante a ${formData.vara} de ${formData.comarca}.`;
  const linhasA = doc.splitTextToSize(textoA, pageWidth - 2 * margin - 10);
  doc.text("1)", margin, yPos);
  doc.text(linhasA, margin + 10, yPos);
  yPos += linhasA.length * 5 + 8;

  // Seção B
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("B) VALORES E DATAS:", margin, yPos);
  yPos += 6;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const totalBruto = formData.alvaraValor + formData.darfValor;
  
  const itensB = [
    `2) O valor total levantado pelo(a) contribuinte, referente ao exercício foi de ${formatCurrency(totalBruto)};`,
    `3) O imposto de renda no valor total de ${formatCurrency(formData.darfValor)}, foi retido por ${formData.fontePagadora} - CNPJ n.º ${formData.cnpj}, conforme documento(s) anexo(s);`,
    `4) O valor bruto da ação corresponde a soma entre o(s) alvará(s)/mandado(s) de levantamento e o imposto de renda retido, o que equivale, neste caso, ao valor de ${formatCurrency(formData.baseCalculo)} (Item 3, da planilha);`,
    `5) O valor atualizado apurado de ${formatCurrency(formData.rendimentosTributavelAlvara)} (Item 8, da planilha), referente ao(s) Rendimento(s) Tributável(is), equivale(m) a ${formData.proporcao} do valor bruto da ação (Item 3), conforme apurado em planilha anexa;`,
    `6) O valor total apurado de despesas dedutíveis¹ com a ação judicial, sobre a mesma proporção dos rendimentos tributáveis, nos exatos termos da Lei, foi de ${formatCurrency(formData.rendimentosTributavelHonorarios)}.`
  ];

  itensB.forEach((item) => {
    const linhasItem = doc.splitTextToSize(item, pageWidth - 2 * margin);
    doc.text(linhasItem, margin, yPos);
    yPos += linhasItem.length * 5 + 4;
  });
  yPos += 3;

  // Título da tabela
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  const titulo1RRA = "CAMPOS E VALORES DECLARADOS NA FICHA DE RRA* DA DIRPF,";
  const titulo2RRA = "NA OPÇÃO DE TRIBUTAÇÃO EXCLUSIVA NA FONTE";
  doc.text(titulo1RRA, pageWidth / 2, yPos, { align: "center" });
  yPos += 5;
  doc.text(titulo2RRA, pageWidth / 2, yPos, { align: "center" });
  yPos += 8;

  // Tabela
  const tabelaRRA = [
    ["A) RENDIMENTOS TRIBUTÁVEIS RECEBIDOS:", formatCurrency(formData.baseCalculo)],
    ["B) INSS RECLAMANTE:", "R$ 0,00"],
    ["C) IMPOSTO DE RENDA RETIDO NA FONTE:", formatCurrency(formData.darfValor)],
    ["D) Nº DE MESES DISCUTIDOS NA AÇÃO:", `${formData.numeroMeses},00`],
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

  // Ficha de rendimentos isentos
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("FICHA DE RENDIMENTOS ISENTOS", pageWidth / 2, yPos, { align: "center" });
  yPos += 7;

  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 7, "S");
  doc.line(pageWidth - margin - 45, yPos, pageWidth - margin - 45, yPos + 7);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.text("RENDIMENTOS ISENTOS:", margin + 2, yPos + 4.5);
  doc.setFont("Helvetica", "normal");
  const rendimentosIsentos = formData.brutoHomologado - formData.tributavelHomologado;
  doc.text(formatCurrency(rendimentosIsentos), pageWidth - margin - 3, yPos + 4.5, { align: "right" });
  yPos += 12;

  // Observações
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Observações.:", margin, yPos);
  yPos += 6;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  
  const textoObsA = "a) Os honorários pagos, foram lançados na ficha de pagamentos, em item próprio;";
  const linhasObsA = doc.splitTextToSize(textoObsA, pageWidth - 2 * margin);
  doc.text(linhasObsA, margin, yPos);
  yPos += linhasObsA.length * 5 + 5;

  const textoObsB = 'b) O valor referente ao rendimento isento foi lançado na ficha de rendimentos isentos e não tributáveis, no item "OUTROS", com a denominação de "Verbas Isentas Ação Judicial", com os mesmos dados da Fonte Pagadora.';
  const linhasObsB = doc.splitTextToSize(textoObsB, pageWidth - 2 * margin);
  doc.text(linhasObsB, margin, yPos);
  yPos += linhasObsB.length * 5 + 8;

  // Linha horizontal
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, margin + 50, yPos);
  yPos += 5;

  // Referência legal
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text("1 Art. 12.A, §2º da Lei 7.713/88", margin, yPos);
  yPos += 8;

  // Linha horizontal grossa
  doc.setLineWidth(1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Logo IR360 no rodapé
  const logoRodapePath = path.join(__dirname, 'client/public/logos/logo-ir360-transparent.png');
  if (fs.existsSync(logoRodapePath)) {
    const logoRodapeData = fs.readFileSync(logoRodapePath).toString('base64');
    doc.addImage(`data:image/png;base64,${logoRodapeData}`, "PNG", (pageWidth - 40) / 2, pageHeight - 25, 40, 19);
  }

  // Salvar PDF
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  const outputPath = path.join(__dirname, 'Esclarecimentos-TESTE.pdf');
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`✅ PDF gerado com sucesso: ${outputPath}`);
}

generateEsclarecimentosPDF().catch(console.error);

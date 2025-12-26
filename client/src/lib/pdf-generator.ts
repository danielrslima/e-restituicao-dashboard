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

  // Tabela de dados do contribuinte
  const contribuinteData = [
    ["Nome do Cliente:", form.nomeCliente.toUpperCase()],
    ["CPF:", form.cpf],
    ["Data de Nascimento:", form.dataNascimento],
  ];

  contribuinteData.forEach((row) => {
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
    doc.line(margin + 50, yPos, margin + 50, yPos + 6);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text(row[0], margin + 2, yPos + 4);
    doc.setFont("Helvetica", "normal");
    doc.text(row[1], margin + 52, yPos + 4);
    yPos += 6;
  });

  yPos += 2;

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

  // Tabela de dados do processo
  const processoData = [
    ["Nº Processo", form.numeroProcesso],
    ["Comarca:", form.comarca],
    ["Vara:", form.vara],
  ];

  processoData.forEach((row) => {
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
    doc.line(margin + 50, yPos, margin + 50, yPos + 6);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text(row[0], margin + 2, yPos + 4);
    doc.setFont("Helvetica", "normal");
    doc.text(row[1], margin + 52, yPos + 4);
    yPos += 6;
  });

  yPos += 2;

  // Valores principais (3 linhas)
  // Item 1: Alvará (rendimentos retirados)
  // Item 2: DARF pago
  // Item 3: Total da causa = Alvará + DARF
  const totalCausa = form.alvaraValor + form.darfValor;
  const valoresPrincipais = [
    ["1 - TOTAL DE RENDIMENTOS RETIRADO PELO AUTOR:", formatCurrency(form.alvaraValor)],
    ["2 - TOTAL DE DARF PAGA:", formatCurrency(form.darfValor)],
    ["3 - TOTAL DA CAUSA", formatCurrency(totalCausa)],
  ];

  valoresPrincipais.forEach((row) => {
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
    doc.line(pageWidth - margin - 40, yPos, pageWidth - margin - 40, yPos + 6);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text(row[0], margin + 2, yPos + 4);
    doc.setFont("Helvetica", "normal");
    doc.text(row[1], pageWidth - margin - 3, yPos + 4, { align: "right" });
    yPos += 6;
  });

  yPos += 2;

  // Seção: APURAÇÃO DOS RENDIMENTOS ISENTOS DE TRIBUTAÇÃO
  doc.setFillColor(200, 230, 201);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 139);
  doc.text("APURAÇÃO DOS RENDIMENTOS ISENTOS DE TRIBUTAÇÃO", margin + 2, yPos + 4);
  doc.setTextColor(0, 0, 0);
  yPos += 6;

  // Seção de Apuração - Corrigir valores conforme template
  const rendimentosIsentos = form.brutoHomologado - form.tributavelHomologado;
  const apuracaoData = [
    ["4 - RENDIMENTOS BRUTO HOMOLOGADO/ATUALIZADO", formatCurrency(form.brutoHomologado)],
    ["5 - RENDIMENTOS TRIBUTÁVEIS CALCULADOS NA MESMA DATA BASE", formatCurrency(form.tributavelHomologado)],
    ["6 - PROPORÇÃO DE RENDIMENTOS TRIBUTÁVEIS", form.proporcao],
    ["7 - TOTAL DE RENDIMENTOS ISENTOS", formatCurrency(rendimentosIsentos)],
    ["8 - RENDIMENTOS SUJEITOS À TRIBUTAÇÃO NORMAL", formatCurrency(form.rendimentosTributavelAlvara)],
    ["9 - TOTAL DE DESPESAS PAGAS COM ADVOGADO, PERITO E CUSTAS:", formatCurrency(form.honorariosValor)],
    ["10 - PROPORÇÃO A DEDUZIR DE DESPESAS PAGAS", formatCurrency(form.rendimentosTributavelHonorarios)],
  ];

  apuracaoData.forEach((row) => {
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
    doc.line(pageWidth - margin - 40, yPos, pageWidth - margin - 40, yPos + 6);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text(row[0], margin + 2, yPos + 4);
    doc.setFont("Helvetica", "normal");
    doc.text(row[1], pageWidth - margin - 3, yPos + 4, { align: "right" });
    yPos += 6;
  });

  yPos += 2;

  // Seção: VALORES ESPERADOS DA DECLARAÇÃO DE AJUSTE ANUAL DO IR
  doc.setFillColor(200, 230, 201);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 139);
  doc.text("VALORES ESPERADOS DA DECLARAÇÃO DE AJUSTE ANUAL DO IR", margin + 2, yPos + 4);
  doc.setTextColor(0, 0, 0);
  yPos += 6;

  const declaracaoData = [
    ["11 - CNPJ:", form.cnpj],
    ["12 - FONTE PAGADORA:", form.fontePagadora],
    ["13 - RENDIMENTOS TRIBUTÁVEIS", formatCurrency(form.baseCalculo)],
    ["14 - CONTRIBUIÇÃO PREVIDÊNCIA OFICIAL (INSS):", "R$ 0,00"],
    ["15 - IMPOSTO DE RENDA RETIDO NA FONTE", formatCurrency(form.darfValor)],
    ["16 - MÊS DO RECEBIMENTO", "DEZEMBRO"],
    ["17 - MESES DISCUTIDOS NA AÇÃO", `${form.numeroMeses},00`],
    ["18 - RENDIMENTOS ISENTOS E NÃO TRIBUTÁVEIS:", formatCurrency(form.brutoHomologado - form.tributavelHomologado)],
  ];

  declaracaoData.forEach((row) => {
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "S");
    doc.line(pageWidth - margin - 40, yPos, pageWidth - margin - 40, yPos + 6);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text(row[0], margin + 2, yPos + 4);
    doc.setFont("Helvetica", "normal");
    doc.text(row[1], pageWidth - margin - 3, yPos + 4, { align: "right" });
    yPos += 6;
  });

  // Salvar PDF
  doc.save(`Planilha-RT-${form.nomeCliente.replace(/\s+/g, "_")}.pdf`);
}

/**
 * Gerar PDF de Esclarecimentos ao Auditor - Template 2
 * Segue fielmente o layout do template original com logos e formatação
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

  // Logo e-Restituição no topo (novo logo completo)
  try {
    const logoImg = new Image();
    logoImg.src = "/logos/logo-e-restituicao-novo.jpg";
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve;
    });
    if (logoImg.complete) {
      // Logo completo centralizado
      doc.addImage(logoImg, "JPEG", (pageWidth - 60) / 2, yPos, 60, 15);
    }
  } catch (error) {
    console.warn("Erro ao carregar logo:", error);
  }

  yPos += 22;
  doc.setTextColor(0, 0, 0); // Reset para preto

  // Linha horizontal grossa
  doc.setLineWidth(1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Título
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  const titulo1 = "ESCLARECIMENTOS SOBRE OS RENDIMENTOS RECEBIDOS ACUMULADAMENTE AO SETOR DE";
  const titulo2 = "MALHA FISCAL DA RECEITA FEDERAL DO BRASIL";
  doc.text(titulo1, pageWidth / 2, yPos, { align: "center" });
  yPos += 5;
  doc.text(titulo2, pageWidth / 2, yPos, { align: "center" });
  yPos += 10;

  // Dados do contribuinte
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`CONTRIBUINTE: ${form.nomeCliente.toUpperCase()}`, margin, yPos);
  doc.text(`DIRPF ${new Date(form.createdAt).getFullYear()}`, pageWidth - margin - 30, yPos);
  yPos += 5;
  doc.text(`CPF: ${form.cpf}`, margin, yPos);
  yPos += 5;
  doc.text(`DATA DE NASCIMENTO: ${form.dataNascimento}`, margin, yPos);
  yPos += 10; // Aumentado de 8 para 10

  // Seção A (COM sublinhado)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  const tituloA = "A) DADOS DA AÇÃO:";
  doc.text(tituloA, margin, yPos);
  // Adicionar sublinhado - linha mais grossa e posicionada corretamente
  const tituloAWidth = doc.getTextWidth(tituloA);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos + 0.5, margin + tituloAWidth, yPos + 0.5);
  yPos += 6;

  // Item 1) - número próximo à margem, texto com pequena indentação
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.text("1)", margin, yPos);
  const textoA = `Os valores declarados se referem a rendimento recebido de forma acumulada, referente a Ação Judicial Trabalhista, processo n.º ${form.numeroProcesso} que tramitou perante a ${form.vara} de ${form.comarca}.`;
  const linhasA = doc.splitTextToSize(textoA, pageWidth - 2 * margin - 12);
  doc.text(linhasA, margin + 12, yPos);
  yPos += linhasA.length * 5 + 8;

  // Seção B (COM sublinhado)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  const tituloB = "B) VALORES E DATAS:";
  doc.text(tituloB, margin, yPos);
  // Adicionar sublinhado - linha mais grossa e posicionada corretamente
  const tituloBWidth = doc.getTextWidth(tituloB);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos + 0.5, margin + tituloBWidth, yPos + 0.5);
  yPos += 6;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const totalBruto = form.alvaraValor + form.darfValor;
  
  // Renderizar itens 2-6 com indentação e valores em negrito
  const renderItemB = (numero: string, textoAntes: string, valor: string, textoDepois: string) => {
    doc.setFont("Helvetica", "normal");
    doc.text(numero, margin, yPos);
    
    // Calcular texto completo para quebra de linha
    const textoCompleto = textoAntes + valor + textoDepois;
    const linhasItem = doc.splitTextToSize(textoCompleto, pageWidth - 2 * margin - 12);
    
    // Renderizar com valor em negrito
    let currentY = yPos;
    linhasItem.forEach((linha: string) => {
      // Verificar se esta linha contém o valor
      if (linha.includes(valor) && valor.startsWith("R$")) {
        const partes = linha.split(valor);
        let xPos = margin + 12;
        
        if (partes[0]) {
          doc.setFont("Helvetica", "normal");
          doc.text(partes[0], xPos, currentY);
          xPos += doc.getTextWidth(partes[0]);
        }
        
        doc.setFont("Helvetica", "bold");
        doc.text(valor, xPos, currentY);
        xPos += doc.getTextWidth(valor);
        
        if (partes[1]) {
          doc.setFont("Helvetica", "normal");
          doc.text(partes[1], xPos, currentY);
        }
      } else {
        doc.setFont("Helvetica", "normal");
        doc.text(linha, margin + 12, currentY);
      }
      currentY += 5;
    });
    yPos = currentY + 3;
  };

  // Item 2 - sem valor em negrito
  doc.setFont("Helvetica", "normal");
  doc.text("2)", margin, yPos);
  const texto2 = `O valor total levantado pelo(a) contribuinte, referente ao exercício foi de ${formatCurrency(totalBruto)};`;
  const linhas2 = doc.splitTextToSize(texto2, pageWidth - 2 * margin - 12);
  doc.text(linhas2, margin + 12, yPos);
  yPos += linhas2.length * 5 + 3;

  // Item 3 - valor em negrito
  renderItemB("3)", "O imposto de renda no valor total de ", formatCurrency(form.darfValor), `, foi retido por ${form.fontePagadora} - CNPJ n.º ${form.cnpj}, conforme documento(s) anexo(s);`);

  // Item 4 - valor em negrito
  renderItemB("4)", "O valor bruto da ação corresponde a soma entre o(s) alvará(s)/mandado(s) de levantamento e o imposto de renda retido, o que equivale, neste caso, ao valor de ", formatCurrency(form.baseCalculo), " (Item 3, da planilha);");

  // Item 5 - valor em negrito
  renderItemB("5)", "O valor atualizado apurado de ", formatCurrency(form.rendimentosTributavelAlvara), ` (Item 8, da planilha), referente ao(s) Rendimento(s) Tributável(is), equivale(m) a ${form.proporcao} do valor bruto da ação (Item 3), conforme apurado em planilha anexa;`);

  // Item 6 - valor em negrito
  renderItemB("6)", "O valor total apurado de despesas dedutíveis¹ com a ação judicial, sobre a mesma proporção dos rendimentos tributáveis, nos exatos termos da Lei, foi de ", formatCurrency(form.rendimentosTributavelHonorarios), ".");

  yPos += 2; // Espaço extra após último item

  // Título da tabela RRA (centralizado, segunda linha COM sublinhado)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  const titulo1RRA = "CAMPOS E VALORES DECLARADOS NA FICHA DE RRA* DA DIRPF,";
  const titulo2RRA = "NA OPÇÃO DE TRIBUTAÇÃO EXCLUSIVA NA FONTE";
  doc.text(titulo1RRA, pageWidth / 2, yPos, { align: "center" });
  yPos += 5;
  doc.text(titulo2RRA, pageWidth / 2, yPos, { align: "center" });
  // Adicionar sublinhado na segunda linha - linha mais grossa
  const titulo2RRAWidth = doc.getTextWidth(titulo2RRA);
  doc.setLineWidth(0.5);
  doc.line((pageWidth - titulo2RRAWidth) / 2, yPos + 0.5, (pageWidth + titulo2RRAWidth) / 2, yPos + 0.5);
  yPos += 8;

  // Tabela com bordas
  const tabelaRRA = [
    ["A) RENDIMENTOS TRIBUTÁVEIS RECEBIDOS:", formatCurrency(form.baseCalculo)],
    ["B) INSS RECLAMANTE:", "R$ 0,00"],
    ["C) IMPOSTO DE RENDA RETIDO NA FONTE:", formatCurrency(form.darfValor)],
    ["D) Nº DE MESES DISCUTIDOS NA AÇÃO:", `${form.numeroMeses},00`],
  ];

  tabelaRRA.forEach((row) => {
    doc.setLineWidth(0.5); // Bordas médias
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

  // Ficha de rendimentos isentos (centralizado)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("FICHA DE RENDIMENTOS ISENTOS", pageWidth / 2, yPos, { align: "center" });
  yPos += 7;

  doc.setLineWidth(0.5); // Bordas médias
  doc.rect(margin, yPos, pageWidth - 2 * margin, 7, "S");
  doc.line(pageWidth - margin - 45, yPos, pageWidth - margin - 45, yPos + 7);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.text("RENDIMENTOS ISENTOS:", margin + 2, yPos + 4.5);
  doc.setFont("Helvetica", "normal");
  const rendimentosIsentos = form.brutoHomologado - form.tributavelHomologado;
  doc.text(formatCurrency(rendimentosIsentos), pageWidth - margin - 3, yPos + 4.5, { align: "right" });
  yPos += 12; // Aumentado de 10 para 12

  // Observações
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Observações.:", margin, yPos);
  yPos += 6;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  const obsTexto = `a) Os honorários pagos, foram lançados na ficha de pagamentos, em item próprio;

b) O valor referente ao rendimento isento foi lançado na ficha de rendimentos isentos e não tributáveis, no item "OUTROS", com a denominação de "Verbas Isentas Ação Judicial", com os mesmos dados da Fonte Pagadora.`;

  const obsLines = doc.splitTextToSize(obsTexto, pageWidth - 2 * margin);
  doc.text(obsLines, margin, yPos);
  yPos += obsLines.length * 4 + 8;

  // Linha horizontal fina antes da referência legal (parcial)
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, margin + 50, yPos);
  yPos += 5;

  // Referência legal
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.text("1 Art. 12.A, §2º da Lei 7.713/88", margin, yPos);
  yPos += 12;

  // Logo IR360 no rodapé (posição fixa)
  const logoY = pageHeight - 25;
  try {
    const logoRodapeImg = new Image();
    logoRodapeImg.src = "/logos/logo-ir360-transparent.png";
    await new Promise((resolve) => {
      logoRodapeImg.onload = resolve;
      logoRodapeImg.onerror = resolve;
    });
    if (logoRodapeImg.complete) {
      doc.addImage(logoRodapeImg, "PNG", (pageWidth - 40) / 2, logoY, 40, 19);
    }
  } catch (error) {
    console.warn("Erro ao carregar logo rodapé:", error);
  }

  // Linha horizontal GROSSA (largura total) - ACIMA do logo IR360
  doc.setLineWidth(1.5);
  doc.line(margin, logoY - 3, pageWidth - margin, logoY - 3);

  // Salvar PDF
  doc.save(`Esclarecimentos-${form.nomeCliente.replace(/\s+/g, "_")}.pdf`);
}

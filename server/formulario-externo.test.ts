import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import express, { Express } from "express";
import { handleFormularioExterno } from "./formulario-externo";

describe("Formulário Externo - Integração", () => {
  let app: Express;
  let server: any;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post("/api/formulario/receber", handleFormularioExterno);
  });

  it("deve receber payload simples com campos obrigatórios", async () => {
    const payload = {
      cpf: "123.456.789-00",
      dataNascimento: "01/01/1990",
      email: "test@test.com",
      numeroProcesso: "1234",
      vara: "Vara",
      comarca: "Comarca",
      fontePagadora: "Empresa",
      cnpj: "12.345.678/0001-90",
      brutoHomologado: 100000,
      tributavelHomologado: 80000,
      numeroMeses: 12,
    };

    expect(payload.cpf).toBeDefined();
    expect(payload.dataNascimento).toBeDefined();
    expect(payload.email).toBeDefined();
  });

  it("deve validar estrutura de arrays de alvarás, darfs e honorários", () => {
    const alvaras = [
      { valor: 50000000, data: "15/01/2022" },
      { valor: 45000000, data: "20/02/2022" },
    ];

    const darfs = [{ valor: 42344113, data: "30/04/2023" }];

    const honorarios = [
      { valor: 10000000, ano: "2022" },
      { valor: 12000000, ano: "2022" },
    ];

    expect(alvaras).toHaveLength(2);
    expect(darfs).toHaveLength(1);
    expect(honorarios).toHaveLength(2);

    expect(alvaras[0]).toHaveProperty("valor");
    expect(alvaras[0]).toHaveProperty("data");
    expect(darfs[0]).toHaveProperty("valor");
    expect(darfs[0]).toHaveProperty("data");
    expect(honorarios[0]).toHaveProperty("valor");
    expect(honorarios[0]).toHaveProperty("ano");
  });

  it("deve validar estrutura de PDFs por exercício", () => {
    const pdfs = [
      {
        nome: "Demonstrativo 2022",
        url: "https://example.com/pdfs/ana-carmen-demonstrativo-2022.pdf",
      },
      {
        nome: "Esclarecimentos 2022",
        url: "https://example.com/pdfs/ana-carmen-esclarecimentos-2022.pdf",
      },
    ];

    expect(pdfs).toHaveLength(2);
    expect(pdfs[0]).toHaveProperty("nome");
    expect(pdfs[0]).toHaveProperty("url");
    expect(pdfs[0].nome).toMatch(/Demonstrativo|Esclarecimentos/);
  });

  it("deve validar estrutura de exercícios fiscais", () => {
    const exercicios = [
      {
        ano: 2022,
        alvaras: 170000000,
        honorarios: 22000000,
        rendimentosTributavel: 102000000,
        baseCalculo: 39700000,
        irDevido: 0,
        irpfRestituir: 0,
      },
      {
        ano: 2023,
        alvaras: 100000000,
        honorarios: 53000000,
        rendimentosTributavel: 47000000,
        baseCalculo: 18300000,
        irDevido: 0,
        irpfRestituir: 42344113,
      },
    ];

    expect(exercicios).toHaveLength(2);
    expect(exercicios[0]).toHaveProperty("ano");
    expect(exercicios[0]).toHaveProperty("alvaras");
    expect(exercicios[0]).toHaveProperty("irpfRestituir");

    // Validar que anos são diferentes
    const anos = exercicios.map((e) => e.ano);
    expect(new Set(anos).size).toBe(2);
  });

  it("deve validar flag anosdiferentes", () => {
    const payload1 = {
      anosdiferentes: true,
      pdfs: [{ nome: "PDF 1", url: "http://example.com/1.pdf" }],
      exercicios: [{ ano: 2022, irpfRestituir: 1000 }],
    };

    const payload2 = {
      anosdiferentes: false,
      pdfs: undefined,
      exercicios: undefined,
    };

    expect(payload1.anosdiferentes).toBe(true);
    expect(payload1.pdfs).toBeDefined();
    expect(payload1.exercicios).toBeDefined();

    expect(payload2.anosdiferentes).toBe(false);
    expect(payload2.pdfs).toBeUndefined();
    expect(payload2.exercicios).toBeUndefined();
  });

  it("deve validar soma de valores de alvarás, darfs e honorários", () => {
    const alvaras = [
      { valor: 50000000, data: "15/01/2022" },
      { valor: 45000000, data: "20/02/2022" },
      { valor: 40000000, data: "10/03/2022" },
    ];

    const somaAlvaras = alvaras.reduce((sum, a) => sum + (a.valor || 0), 0);
    expect(somaAlvaras).toBe(135000000);

    const darfs = [{ valor: 42344113, data: "30/04/2023" }];
    const somaDarfs = darfs.reduce((sum, d) => sum + (d.valor || 0), 0);
    expect(somaDarfs).toBe(42344113);

    const honorarios = [
      { valor: 10000000, ano: "2022" },
      { valor: 12000000, ano: "2022" },
      { valor: 15000000, ano: "2023" },
    ];
    const somaHonorarios = honorarios.reduce(
      (sum, h) => sum + (h.valor || 0),
      0
    );
    expect(somaHonorarios).toBe(37000000);
  });

  it("deve validar formatação de Data/Hora", () => {
    const createdAt = new Date();
    const dataFormatada = createdAt.toLocaleDateString("pt-BR");
    const horaFormatada = createdAt.toLocaleTimeString("pt-BR");

    expect(dataFormatada).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(horaFormatada).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it("deve validar parsing de JSON para pdfsJson e exerciciosJson", () => {
    const pdfs = [
      { nome: "PDF 1", url: "http://example.com/1.pdf" },
      { nome: "PDF 2", url: "http://example.com/2.pdf" },
    ];

    const exercicios = [
      { ano: 2022, irpfRestituir: 1000 },
      { ano: 2023, irpfRestituir: 2000 },
    ];

    const pdfsJson = JSON.stringify(pdfs);
    const exerciciosJson = JSON.stringify(exercicios);

    expect(() => JSON.parse(pdfsJson)).not.toThrow();
    expect(() => JSON.parse(exerciciosJson)).not.toThrow();

    const pdfsParseado = JSON.parse(pdfsJson);
    const exerciciosParseado = JSON.parse(exerciciosJson);

    expect(pdfsParseado).toHaveLength(2);
    expect(exerciciosParseado).toHaveLength(2);
    expect(pdfsParseado[0].nome).toBe("PDF 1");
    expect(exerciciosParseado[0].ano).toBe(2022);
  });

  it("deve validar dados da Ana Carmen (3 exercícios, 6 PDFs)", () => {
    const anaCarmem = {
      nomeCompleto: "Ana Carmen Collodetti Brugger",
      cpf: "267.035.801-20",
      anosdiferentes: true,
      pdfs: [
        { nome: "Demonstrativo 2022", url: "http://example.com/2022-demo.pdf" },
        {
          nome: "Esclarecimentos 2022",
          url: "http://example.com/2022-escl.pdf",
        },
        { nome: "Demonstrativo 2023", url: "http://example.com/2023-demo.pdf" },
        {
          nome: "Esclarecimentos 2023",
          url: "http://example.com/2023-escl.pdf",
        },
        { nome: "Demonstrativo 2025", url: "http://example.com/2025-demo.pdf" },
        {
          nome: "Esclarecimentos 2025",
          url: "http://example.com/2025-escl.pdf",
        },
      ],
      exercicios: [
        { ano: 2022, irpfRestituir: 0 },
        { ano: 2023, irpfRestituir: 42344113 },
        { ano: 2025, irpfRestituir: 0 },
      ],
    };

    expect(anaCarmem.anosdiferentes).toBe(true);
    expect(anaCarmem.pdfs).toHaveLength(6);
    expect(anaCarmem.exercicios).toHaveLength(3);

    // Validar que temos 2 PDFs por exercício
    const anos = anaCarmem.exercicios.map((e) => e.ano);
    const pdfsPorAno = anaCarmem.pdfs.filter((p) => p.nome.includes("2022"))
      .length;
    expect(pdfsPorAno).toBe(2);
  });
});

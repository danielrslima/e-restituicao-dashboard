import { getDb } from './db';
import { irpfForms } from '../drizzle/schema';

/**
 * Handler para receber formulários do site externo
 * 
 * Endpoint: POST /api/formulario/receber
 * Content-Type: application/json
 */

interface FormularioExternoPayload {
  // Dados pessoais
  nomeCompleto?: string;
  nomeCliente?: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone?: string;
  
  // Dados processuais
  numeroProcesso: string;
  vara: string;
  comarca: string;
  fontePagadora: string;
  cnpj: string;
  
  // Valores de entrada
  brutoHomologado: number;
  tributavelHomologado: number;
  numeroMeses: number;
  
  // Arrays de valores (estrutura aninhada)
  alvaras?: Array<{ valor: number; data: string }>;
  darfs?: Array<{ valor: number; data: string }>;
  honorarios?: Array<{ valor: number; ano: string }>;
  
  // Cálculos (podem vir diretamente ou dentro de valorCalculos)
  proporcao?: number | string;
  rendimentosTributavelAlvara?: number;
  rendimentosTributavelHonorarios?: number;
  baseCalculo?: number;
  rra?: string;
  irMensal?: string;
  irDevido?: number;
  irpfRestituir?: number;
  
  // Objetos originais (para compatibilidade)
  userData?: any;
  valorCalculos?: any;
  
  // Campos de controle
  statusPagamento?: 'pendente' | 'pago' | 'cancelado';
  categoria?: 'free' | 'starter' | 'builder' | 'specialist';
  
  // Suporte para múltiplos exercícios fiscais
  anosdiferentes?: boolean;
  pdfs?: Array<{ nome: string; url: string }>;
  exercicios?: Array<any>; // Array de dados por exercício fiscal
}

export async function handleFormularioExterno(req: any, res: any) {
  try {
    const payload: FormularioExternoPayload = req.body;
    
    console.log('[Formulário Externo] Recebido payload completo');
    console.log('[Formulário Externo] Nome:', payload.nomeCompleto);
    console.log('[Formulário Externo] Alvarás:', payload.alvaras);
    console.log('[Formulário Externo] DARFs:', payload.darfs);
    console.log('[Formulário Externo] Honorários:', payload.honorarios);
    console.log('[Formulário Externo] IRPF a Restituir:', payload.irpfRestituir);

    // Mapear nomeCompleto para nomeCliente (compatibilidade)
    const nomeCliente = payload.nomeCompleto || payload.nomeCliente || payload.userData?.nome || '';
    
    // Validar campos obrigatórios (apenas campos essenciais)
    const camposObrigatorios = [
      'cpf', 'dataNascimento', 'email',
      'numeroProcesso', 'vara', 'comarca', 'fontePagadora', 'cnpj',
      'brutoHomologado', 'tributavelHomologado', 'numeroMeses'
    ];

    for (const campo of camposObrigatorios) {
      if (!(campo in payload)) {
        console.error(`[Formulário Externo] Campo obrigatório faltando: ${campo}`);
        return res.status(400).json({ 
          success: false, 
          error: `Campo obrigatório faltando: ${campo}` 
        });
      }
    }

    // ===== EXTRAIR ARRAYS DE ALVARÁS, DARFS E HONORÁRIOS =====
    // Pegar o primeiro elemento de cada array (ou somar todos se necessário)
    const primeiroAlvara = payload.alvaras && payload.alvaras.length > 0 ? payload.alvaras[0] : null;
    const primeiroDarf = payload.darfs && payload.darfs.length > 0 ? payload.darfs[0] : null;
    const primeiroHonorario = payload.honorarios && payload.honorarios.length > 0 ? payload.honorarios[0] : null;

    // Somar todos os valores (para casos com múltiplos alvarás/darfs/honorários)
    const somaAlvaras = payload.alvaras?.reduce((sum, a) => sum + (a.valor || 0), 0) || 0;
    const somaDarfs = payload.darfs?.reduce((sum, d) => sum + (d.valor || 0), 0) || 0;
    const somaHonorarios = payload.honorarios?.reduce((sum, h) => sum + (h.valor || 0), 0) || 0;

    console.log('[Formulário Externo] Soma Alvarás:', somaAlvaras);
    console.log('[Formulário Externo] Soma DARFs:', somaDarfs);
    console.log('[Formulário Externo] Soma Honorários:', somaHonorarios);

    // ===== EXTRAIR VALORES CALCULADOS =====
    // Podem vir diretamente no payload ou dentro de valorCalculos
    const valorCalculos = payload.valorCalculos || {};
    
    const proporcao = payload.proporcao || valorCalculos.proporcao || '';
    const rendimentosTributavelAlvara = payload.rendimentosTributavelAlvara || valorCalculos.rendimentosTributavelAlvara || 0;
    const rendimentosTributavelHonorarios = payload.rendimentosTributavelHonorarios || valorCalculos.rendimentosTributavelHonorarios || 0;
    const baseCalculo = payload.baseCalculo || valorCalculos.baseCalculo || 0;
    const rra = payload.rra || valorCalculos.rra || '';
    const irMensal = payload.irMensal || valorCalculos.irMensal || '';
    const irDevido = payload.irDevido || valorCalculos.irDevido || 0;
    const irpfRestituir = payload.irpfRestituir || valorCalculos.irpfRestituir || 0;

    console.log('[Formulário Externo] Valores calculados extraídos:');
    console.log('  - Proporção:', proporcao);
    console.log('  - Rend. Trib. Alvará:', rendimentosTributavelAlvara);
    console.log('  - Base Cálculo:', baseCalculo);
    console.log('  - IR Devido:', irDevido);
    console.log('  - IRPF a Restituir:', irpfRestituir);

    const db = await getDb();
    if (!db) {
      console.error('[Formulário Externo] Banco de dados não disponível');
      return res.status(500).json({ 
        success: false, 
        error: 'Banco de dados não disponível' 
      });
    }

    // Inserir novo formulário com TODOS os dados extraídos
    const result = await db.insert(irpfForms).values({
      nomeCliente: nomeCliente,
      cpf: payload.cpf,
      dataNascimento: payload.dataNascimento,
      email: payload.email,
      telefone: payload.telefone || null,
      numeroProcesso: payload.numeroProcesso,
      vara: payload.vara,
      comarca: payload.comarca,
      fontePagadora: payload.fontePagadora,
      cnpj: payload.cnpj,
      brutoHomologado: payload.brutoHomologado,
      tributavelHomologado: payload.tributavelHomologado,
      numeroMeses: payload.numeroMeses,
      
      // Usar a SOMA de todos os alvarás/darfs/honorários
      alvaraValor: somaAlvaras,
      alvaraData: primeiroAlvara?.data || '',
      darfValor: somaDarfs,
      darfData: primeiroDarf?.data || '',
      honorariosValor: somaHonorarios,
      honorariosAno: primeiroHonorario?.ano || '',
      
      // Valores calculados extraídos corretamente
      proporcao: String(proporcao),
      rendimentosTributavelAlvara: rendimentosTributavelAlvara,
      rendimentosTributavelHonorarios: rendimentosTributavelHonorarios,
      baseCalculo: baseCalculo,
      rra: String(rra),
      irMensal: String(irMensal),
      irDevido: irDevido,
      irpfRestituir: irpfRestituir,
      
      statusPagamento: payload.statusPagamento || 'pendente',
      categoria: payload.categoria || 'starter',
      tipoAcesso: 'pago',
      anosdiferentes: payload.anosdiferentes ? 1 : 0,
      pdfsJson: payload.pdfs ? JSON.stringify(payload.pdfs) : null,
      exerciciosJson: payload.exercicios ? JSON.stringify(payload.exercicios) : null,
    });

    console.log('[Formulário Externo] ✅ Salvo com sucesso!');
    console.log('[Formulário Externo] Nome:', nomeCliente);
    console.log('[Formulário Externo] CPF:', payload.cpf);
    console.log('[Formulário Externo] IRPF a Restituir:', irpfRestituir);
    console.log('[Formulário Externo] Anos Diferentes:', payload.anosdiferentes);
    console.log('[Formulário Externo] PDFs:', payload.pdfs?.length || 0);
    console.log('[Formulário Externo] Exercícios:', payload.exercicios?.length || 0);

    return res.status(200).json({ 
      success: true, 
      message: 'Formulário recebido e salvo com sucesso',
      nomeCliente: nomeCliente,
      cpf: payload.cpf,
      irpfRestituir: irpfRestituir,
      alvaraValor: somaAlvaras,
      darfValor: somaDarfs,
      honorariosValor: somaHonorarios
    });
  } catch (error) {
    console.error('[Formulário Externo] Erro:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao processar formulário',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

import { getDb } from './db';
import { irpfForms } from '../drizzle/schema';

/**
 * Handler para receber formulários do site externo
 * 
 * Endpoint: POST /api/formulario/receber
 * Content-Type: application/json
 */

interface FormularioExternoPayload {
  nomeCliente: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone?: string;
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
  statusPagamento?: 'pendente' | 'pago' | 'cancelado';
  categoria?: 'free' | 'starter' | 'builder' | 'specialist';
}

export async function handleFormularioExterno(req: any, res: any) {
  try {
    const payload: FormularioExternoPayload = req.body;
    
    console.log('[Formulário Externo] Recebido:', payload.nomeCliente);

    // Validar campos obrigatórios
    const camposObrigatorios = [
      'nomeCliente', 'cpf', 'dataNascimento', 'email',
      'numeroProcesso', 'vara', 'comarca', 'fontePagadora', 'cnpj',
      'brutoHomologado', 'tributavelHomologado', 'numeroMeses',
      'alvaraValor', 'alvaraData', 'darfValor', 'darfData',
      'honorariosValor', 'honorariosAno', 'proporcao',
      'rendimentosTributavelAlvara', 'rendimentosTributavelHonorarios',
      'baseCalculo', 'rra', 'irMensal', 'irDevido', 'irpfRestituir'
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

    const db = await getDb();
    if (!db) {
      console.error('[Formulário Externo] Banco de dados não disponível');
      return res.status(500).json({ 
        success: false, 
        error: 'Banco de dados não disponível' 
      });
    }

    // Inserir novo formulário
    const result = await db.insert(irpfForms).values({
      nomeCliente: payload.nomeCliente,
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
      alvaraValor: payload.alvaraValor,
      alvaraData: payload.alvaraData,
      darfValor: payload.darfValor,
      darfData: payload.darfData,
      honorariosValor: payload.honorariosValor,
      honorariosAno: payload.honorariosAno,
      proporcao: payload.proporcao,
      rendimentosTributavelAlvara: payload.rendimentosTributavelAlvara,
      rendimentosTributavelHonorarios: payload.rendimentosTributavelHonorarios,
      baseCalculo: payload.baseCalculo,
      rra: payload.rra,
      irMensal: payload.irMensal,
      irDevido: payload.irDevido,
      irpfRestituir: payload.irpfRestituir,
      statusPagamento: payload.statusPagamento || 'pendente',
      categoria: payload.categoria || 'starter',
      tipoAcesso: 'pago',
    });

    console.log('[Formulário Externo] Salvo com sucesso:', payload.nomeCliente);

    return res.status(200).json({ 
      success: true, 
      message: 'Formulário recebido e salvo com sucesso',
      nomeCliente: payload.nomeCliente,
      cpf: payload.cpf
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

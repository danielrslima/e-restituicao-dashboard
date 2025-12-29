import { eq, or, like, desc, and, isNull, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, irpfForms, InsertIrpfForm } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Obter todos os formulários IRPF com filtros opcionais
 */
export async function getAllIrpfForms(filters?: {
  statusPagamento?: string;
  search?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(irpfForms);

  if (filters?.statusPagamento) {
    query = query.where(eq(irpfForms.statusPagamento, filters.statusPagamento as any));
  }

  if (filters?.search) {
    const searchTerm = `%${filters.search}%`;
    query = query.where(
      or(
        like(irpfForms.nomeCliente, searchTerm),
        like(irpfForms.cpf, searchTerm),
        like(irpfForms.numeroProcesso, searchTerm)
      )
    );
  }

  return query.orderBy(desc(irpfForms.createdAt));
}

/**
 * Obter um formulário IRPF por ID
 */
export async function getIrpfFormById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(irpfForms).where(eq(irpfForms.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Criar um novo formulário IRPF
 */
export async function createIrpfForm(data: InsertIrpfForm) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(irpfForms).values(data);
  return result;
}

/**
 * Atualizar um formulário IRPF
 */
export async function updateIrpfForm(id: number, data: Partial<InsertIrpfForm>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(irpfForms).set(data).where(eq(irpfForms.id, id));
}

/**
 * Deletar um formulário IRPF
 */
export async function deleteIrpfForm(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(irpfForms).where(eq(irpfForms.id, id));
}


// ============================================================================
// IRPF Forms - Email Scheduling Helpers
// ============================================================================

/**
 * Obter formulários que precisam de agendamento de email (7 dias após pagamento)
 */
export async function getFormsNeedingEmailScheduling() {
  const db = await getDb();
  if (!db) return [];

  try {
    const query = await db
      .select()
      .from(irpfForms)
      .where(
        and(
          eq(irpfForms.statusPagamento, "pago"),
          isNull(irpfForms.dataAgendamentoEmail)
        )
      );
    return query;
  } catch (error) {
    console.error("[Database] Failed to get forms needing email scheduling:", error);
    return [];
  }
}

/**
 * Obter formulários prontos para envio de email (data agendada chegou)
 */
export async function getFormsReadyForEmailSending() {
  const db = await getDb();
  if (!db) return [];

  try {
    const agora = new Date();
    const query = await db
      .select()
      .from(irpfForms)
      .where(
        and(
          eq(irpfForms.statusEmail, "agendado"),
          lte(irpfForms.dataAgendamentoEmail, agora)
        )
      );
    return query;
  } catch (error) {
    console.error("[Database] Failed to get forms ready for email sending:", error);
    return [];
  }
}

/**
 * Atualizar agendamento de email
 */
export async function updateEmailScheduling(
  formId: number,
  dataAgendamento: Date,
  status: "agendado" | "enviado" | "erro"
) {
  const db = await getDb();
  if (!db) return;

  try {
    await db
      .update(irpfForms)
      .set({
        dataAgendamentoEmail: dataAgendamento,
        statusEmail: status,
        updatedAt: new Date(),
      })
      .where(eq(irpfForms.id, formId));
  } catch (error) {
    console.error("[Database] Failed to update email scheduling:", error);
  }
}

/**
 * Obter formulários por tipo de acesso (free ou pago)
 */
export async function getFormsByAccessType(tipoAcesso: "free" | "pago") {
  const db = await getDb();
  if (!db) return [];

  try {
    const query = await db
      .select()
      .from(irpfForms)
      .where(eq(irpfForms.tipoAcesso, tipoAcesso));
    return query;
  } catch (error) {
    console.error("[Database] Failed to get forms by access type:", error);
    return [];
  }
}


// ============================================================================
// Kit IR - Segundo Pagamento
// ============================================================================

/**
 * Obter formulários que precisam de envio de Kit IR (7 dias após pagamento do Kit)
 */
export async function getFormsReadyForKitIRSending() {
  const db = await getDb();
  if (!db) return [];

  try {
    const agora = new Date();
    const query = await db
      .select()
      .from(irpfForms)
      .where(
        and(
          eq(irpfForms.statusKitIR, "pago"),
          eq(irpfForms.statusEnvioKit, "agendado"),
          lte(irpfForms.dataEnvioKit, agora)
        )
      );
    return query;
  } catch (error) {
    console.error("[Database] Failed to get forms ready for Kit IR sending:", error);
    return [];
  }
}

/**
 * Atualizar status do Kit IR
 */
export async function updateKitIRStatus(
  formId: number,
  statusKitIR: "nao_solicitado" | "pendente" | "pago" | "enviado" | "cancelado",
  statusEnvioKit?: "pendente" | "agendado" | "enviado" | "erro",
  dataEnvioKit?: Date
) {
  const db = await getDb();
  if (!db) return;

  try {
    const updateData: any = {
      statusKitIR,
      updatedAt: new Date(),
    };

    if (statusEnvioKit) {
      updateData.statusEnvioKit = statusEnvioKit;
    }

    if (dataEnvioKit) {
      updateData.dataEnvioKit = dataEnvioKit;
    }

    await db
      .update(irpfForms)
      .set(updateData)
      .where(eq(irpfForms.id, formId));
  } catch (error) {
    console.error("[Database] Failed to update Kit IR status:", error);
  }
}

/**
 * Agendar envio de Kit IR (7 dias após pagamento)
 */
export async function agendarEnvioKitIR(formId: number, dataPagamentoKit: Date) {
  const db = await getDb();
  if (!db) return;

  try {
    // Calcular data de envio (7 dias após pagamento)
    const dataEnvio = new Date(dataPagamentoKit);
    dataEnvio.setDate(dataEnvio.getDate() + 7);

    await db
      .update(irpfForms)
      .set({
        statusEnvioKit: "agendado",
        dataEnvioKit: dataEnvio,
        updatedAt: new Date(),
      })
      .where(eq(irpfForms.id, formId));

    console.log(`[Kit IR] Envio agendado para ${dataEnvio.toISOString()}`);
  } catch (error) {
    console.error("[Database] Failed to schedule Kit IR sending:", error);
  }
}

/**
 * Obter formulários por status de Kit IR
 */
export async function getFormsByKitIRStatus(statusKitIR: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    const query = await db
      .select()
      .from(irpfForms)
      .where(eq(irpfForms.statusKitIR, statusKitIR as any));
    return query;
  } catch (error) {
    console.error("[Database] Failed to get forms by Kit IR status:", error);
    return [];
  }
}


/**
 * Sincroniza um formulário do Firebase para o banco de dados local
 */
export async function syncFormularioFromFirebase(firebaseData: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot sync from Firebase: database not available");
    return;
  }

  console.log('[Firebase Sync] Iniciando sincronização:', firebaseData.id);
  console.log('[Firebase Sync] Dados recebidos:', JSON.stringify(firebaseData, null, 2));

  try {
    // Mapear dados do Firebase para o schema local
    console.log('[Firebase Sync] Mapeando dados...');
    const formData = {
      // Dados pessoais
      nomeCliente: firebaseData.nomeCompleto || '',
      cpf: firebaseData.cpf || '',
      email: firebaseData.email || '',
      telefone: firebaseData.telefone || null,
      dataNascimento: firebaseData.dataNascimento || '',
      
      // Dados processuais
      numeroProcesso: firebaseData.numeroProcesso || '',
      vara: firebaseData.vara || '',
      comarca: firebaseData.comarca || '',
      fontePagadora: firebaseData.fontePagadora || '',
      cnpj: firebaseData.cnpj || '',
      
      // Valores
      brutoHomologado: firebaseData.brutoHomologado || 0,
      tributavelHomologado: firebaseData.tributavelHomologado || 0,
      numeroMeses: firebaseData.numeroMeses || 0,
      
      // Alvará, DARF e Honorários (primeiro de cada array)
      alvaraValor: firebaseData.alvaras?.[0]?.valor || 0,
      alvaraData: firebaseData.alvaras?.[0]?.data || '',
      darfValor: firebaseData.darfs?.[0]?.valor || 0,
      darfData: firebaseData.darfs?.[0]?.data || '',
      honorariosValor: firebaseData.honorarios?.[0]?.valor || 0,
      honorariosAno: firebaseData.honorarios?.[0]?.ano || '',
      
      // Valores calculados
      proporcao: firebaseData.proporcao || '0%',
      rendimentosTributavelAlvara: firebaseData.rendimentosTributavelAlvara || 0,
      rendimentosTributavelHonorarios: firebaseData.rendimentosTributavelHonorarios || 0,
      baseCalculo: firebaseData.baseCalculo || 0,
      rra: firebaseData.rra || '0',
      irMensal: firebaseData.irMensal || '0',
      irDevido: firebaseData.irDevido || 0,
      irpfRestituir: firebaseData.irpfRestituir || 0,
      
      // Tipo de acesso e pagamento
      tipoAcesso: (firebaseData.tipoAcesso || 'pago') as 'free' | 'pago',
      statusPagamento: (firebaseData.statusPagamento || 'pendente') as 'pendente' | 'pago' | 'cancelado',
      dataPagamento: firebaseData.dataPagamento ? new Date(firebaseData.dataPagamento) : null,
      asaasPaymentId: firebaseData.asaasPaymentId || null,
      asaasStatus: firebaseData.asaasStatus || null,
      
      // Kit IR (segundo pagamento)
      statusKitIR: (firebaseData.statusKitIR || 'nao_solicitado') as 'nao_solicitado' | 'pendente' | 'pago' | 'enviado' | 'cancelado',
      dataPagamentoKit: firebaseData.dataPagamentoKit ? new Date(firebaseData.dataPagamentoKit) : null,
      asaasPaymentIdKit: firebaseData.asaasPaymentIdKit || null,
      asaasStatusKit: firebaseData.asaasStatusKit || null,
      
      // Agendamento de email
      dataAgendamentoEmail: firebaseData.dataAgendamentoEmail ? new Date(firebaseData.dataAgendamentoEmail) : null,
      statusEmail: (firebaseData.statusEmail || 'pendente') as 'pendente' | 'agendado' | 'enviado' | 'erro',
      
      // Envio de Kit IR
      dataEnvioKit: firebaseData.dataEnvioKit ? new Date(firebaseData.dataEnvioKit) : null,
      statusEnvioKit: (firebaseData.statusEnvioKit || 'pendente') as 'pendente' | 'agendado' | 'enviado' | 'erro',
      
      // Firebase ID
      firebaseDocId: firebaseData.id || null,
    };

    console.log('[Firebase Sync] Dados mapeados:', JSON.stringify(formData, null, 2));

    // Verificar se já existe no banco local
    const existing = await db
      .select()
      .from(irpfForms)
      .where(eq(irpfForms.firebaseDocId, formData.firebaseDocId))
      .limit(1);

    if (existing.length > 0) {
      // Atualizar
      await db
        .update(irpfForms)
        .set(formData)
        .where(eq(irpfForms.firebaseDocId, formData.firebaseDocId));
      console.log(`[Database] Formulário ${formData.firebaseDocId} atualizado`);
    } else {
      // Inserir
      await db.insert(irpfForms).values(formData);
      console.log(`[Database] Formulário ${formData.firebaseDocId} inserido`);
    }
  } catch (error) {
    console.error("[Database] Erro ao sincronizar formulário do Firebase:", error);
    console.error("[Database] Stack trace:", (error as Error).stack);
    console.error("[Database] Dados que causaram erro:", JSON.stringify(firebaseData, null, 2));
  }
}

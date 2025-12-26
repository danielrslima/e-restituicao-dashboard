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

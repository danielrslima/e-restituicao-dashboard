import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Formulários de cálculo de IRPF enviados pelos usuários
 * Armazena dados pessoais, processuais e valores calculados
 */
export const irpfForms = mysqlTable("irpf_forms", {
  id: int("id").autoincrement().primaryKey(),
  // Dados pessoais
  nomeCliente: varchar("nome_cliente", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull(),
  dataNascimento: varchar("data_nascimento", { length: 10 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  // Dados processuais
  numeroProcesso: varchar("numero_processo", { length: 50 }).notNull(),
  vara: varchar("vara", { length: 100 }).notNull(),
  comarca: varchar("comarca", { length: 100 }).notNull(),
  fontePagadora: varchar("fonte_pagadora", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull(),
  // Valores do cálculo
  brutoHomologado: int("bruto_homologado").notNull(), // em centavos
  tributavelHomologado: int("tributavel_homologado").notNull(), // em centavos
  numeroMeses: int("numero_meses").notNull(),
  alvaraValor: int("alvara_valor").notNull(), // em centavos
  alvaraData: varchar("alvara_data", { length: 10 }).notNull(),
  darfValor: int("darf_valor").notNull(), // em centavos
  darfData: varchar("darf_data", { length: 10 }).notNull(),
  honorariosValor: int("honorarios_valor").notNull(), // em centavos
  honorariosAno: varchar("honorarios_ano", { length: 4 }).notNull(),
  // Valores calculados
  proporcao: varchar("proporcao", { length: 20 }).notNull(), // ex: "38,9048%"
  rendimentosTributavelAlvara: int("rendimentos_tributavel_alvara").notNull(),
  rendimentosTributavelHonorarios: int("rendimentos_tributavel_honorarios").notNull(),
  baseCalculo: int("base_calculo").notNull(),
  rra: varchar("rra", { length: 20 }).notNull(), // Rendimento Mensal
  irMensal: varchar("ir_mensal", { length: 20 }).notNull(),
  irDevido: int("ir_devido").notNull(),
  irpfRestituir: int("irpf_restituir").notNull(), // Resultado final em centavos
  // Status e metadados
  statusPagamento: mysqlEnum("status_pagamento", ["pendente", "pago", "cancelado"]).default("pendente").notNull(),
  tipoAcesso: mysqlEnum("tipo_acesso", ["free", "pago"]).default("pago").notNull(),
  dataPagamento: timestamp("data_pagamento"),
  dataAgendamentoEmail: timestamp("data_agendamento_email"),
  statusEmail: mysqlEnum("status_email", ["pendente", "agendado", "enviado", "erro"]).default("pendente"),
  asaasPaymentId: varchar("asaas_payment_id", { length: 100 }),
  asaasStatus: varchar("asaas_status", { length: 50 }),
  statusKitIR: mysqlEnum("status_kit_ir", ["nao_solicitado", "pendente", "pago", "enviado", "cancelado"]).default("nao_solicitado").notNull(),
  dataPagamentoKit: timestamp("data_pagamento_kit"),
  asaasPaymentIdKit: varchar("asaas_payment_id_kit", { length: 100 }),
  asaasStatusKit: varchar("asaas_status_kit", { length: 50 }),
  dataEnvioKit: timestamp("data_envio_kit"),
  statusEnvioKit: mysqlEnum("status_envio_kit", ["pendente", "agendado", "enviado", "erro"]).default("pendente"),
  firebaseDocId: varchar("firebase_doc_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type IrpfForm = typeof irpfForms.$inferSelect;
export type InsertIrpfForm = typeof irpfForms.$inferInsert;
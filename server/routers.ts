import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getAllIrpfForms, getIrpfFormById, updateKitIRStatus, syncFormularioFromFirebase, getDb } from "./db";
import { notes } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  irpf: router({
    list: protectedProcedure
      .input(z.object({
        statusPagamento: z.string().optional(),
        search: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const forms = await getAllIrpfForms({
          statusPagamento: input.statusPagamento,
          search: input.search,
        });
        return forms;
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return getIrpfFormById(input.id);
      }),
    updateKitIRStatus: adminProcedure
      .input(
        z.object({
          formId: z.number(),
          statusKitIR: z.enum(["nao_solicitado", "pendente", "pago", "enviado", "cancelado"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateKitIRStatus(input.formId, input.statusKitIR);
        return { success: true };
      }),
    syncFromFirebase: adminProcedure
      .input(
        z.object({
          firebaseData: z.any(),
        })
      )
      .mutation(async ({ input }) => {
        await syncFormularioFromFirebase(input.firebaseData);
        return { success: true };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.object({
            nomeCliente: z.string(),
            cpf: z.string(),
            dataNascimento: z.string(),
            email: z.string(),
            telefone: z.string().optional(),
            numeroProcesso: z.string(),
            vara: z.string(),
            comarca: z.string(),
            fontePagadora: z.string(),
            cnpj: z.string(),
            brutoHomologado: z.number(),
            tributavelHomologado: z.number(),
            numeroMeses: z.number(),
            alvaraValor: z.number(),
            alvaraData: z.string(),
            darfValor: z.number(),
            darfData: z.string(),
            honorariosValor: z.number(),
            honorariosAno: z.string(),
            statusPagamento: z.enum(["pendente", "pago", "cancelado"]),
            categoria: z.enum(["free", "starter", "builder", "specialist"]),
          }),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        const { irpfForms } = await import('../drizzle/schema');
        
        // Recalcular valores
        const proporcao = ((input.data.tributavelHomologado / input.data.brutoHomologado) * 100).toFixed(4) + '%';
        const rendimentosTributavelAlvara = Math.round(input.data.alvaraValor * (input.data.tributavelHomologado / input.data.brutoHomologado));
        const rendimentosTributavelHonorarios = Math.round(input.data.honorariosValor * (input.data.tributavelHomologado / input.data.brutoHomologado));
        const baseCalculo = rendimentosTributavelAlvara - rendimentosTributavelHonorarios;
        const rra = (baseCalculo / input.data.numeroMeses / 100).toFixed(2);
        const irMensal = (baseCalculo * 0.275 / input.data.numeroMeses / 100).toFixed(2);
        const irDevido = Math.round(baseCalculo * 0.275);
        const irpfRestituir = irDevido - input.data.darfValor;
        
        await db.update(irpfForms)
          .set({
            ...input.data,
            proporcao,
            rendimentosTributavelAlvara,
            rendimentosTributavelHonorarios,
            baseCalculo,
            rra,
            irMensal,
            irDevido,
            irpfRestituir,
          })
          .where(eq(irpfForms.id, input.id));
        
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        const { irpfForms } = await import('../drizzle/schema');
        await db.delete(irpfForms).where(eq(irpfForms.id, input.id));
        
        return { success: true };
      }),
    
    receberFormularioDoSite: publicProcedure
      .input(
        z.object({
          nomeCliente: z.string(),
          cpf: z.string(),
          dataNascimento: z.string(),
          email: z.string(),
          telefone: z.string().optional(),
          numeroProcesso: z.string(),
          vara: z.string(),
          comarca: z.string(),
          fontePagadora: z.string(),
          cnpj: z.string(),
          brutoHomologado: z.number(),
          tributavelHomologado: z.number(),
          numeroMeses: z.number(),
          alvaraValor: z.number(),
          alvaraData: z.string(),
          darfValor: z.number(),
          darfData: z.string(),
          honorariosValor: z.number(),
          honorariosAno: z.string(),
          proporcao: z.string(),
          rendimentosTributavelAlvara: z.number(),
          rendimentosTributavelHonorarios: z.number(),
          baseCalculo: z.number(),
          rra: z.string(),
          irMensal: z.string(),
          irDevido: z.number(),
          irpfRestituir: z.number(),
          statusPagamento: z.enum(['pendente', 'pago', 'cancelado']).optional(),
          categoria: z.enum(['free', 'starter', 'builder', 'specialist']).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        const { irpfForms } = await import('../drizzle/schema');
        
        // Inserir novo formulário
        await db.insert(irpfForms).values({
          nomeCliente: input.nomeCliente,
          cpf: input.cpf,
          dataNascimento: input.dataNascimento,
          email: input.email,
          telefone: input.telefone || null,
          numeroProcesso: input.numeroProcesso,
          vara: input.vara,
          comarca: input.comarca,
          fontePagadora: input.fontePagadora,
          cnpj: input.cnpj,
          brutoHomologado: input.brutoHomologado,
          tributavelHomologado: input.tributavelHomologado,
          numeroMeses: input.numeroMeses,
          alvaraValor: input.alvaraValor,
          alvaraData: input.alvaraData,
          darfValor: input.darfValor,
          darfData: input.darfData,
          honorariosValor: input.honorariosValor,
          honorariosAno: input.honorariosAno,
          proporcao: input.proporcao,
          rendimentosTributavelAlvara: input.rendimentosTributavelAlvara,
          rendimentosTributavelHonorarios: input.rendimentosTributavelHonorarios,
          baseCalculo: input.baseCalculo,
          rra: input.rra,
          irMensal: input.irMensal,
          irDevido: input.irDevido,
          irpfRestituir: input.irpfRestituir,
          statusPagamento: input.statusPagamento || 'pendente',
          categoria: input.categoria || 'starter',
          tipoAcesso: 'pago',
        });
        
        return { 
          success: true, 
          message: 'Formulário recebido e salvo com sucesso'
        };
      }),
  }),

  notes: router({
    list: protectedProcedure
      .input(z.object({ formId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        if (input.formId === 0) return [];
        const db = await getDb();
        if (!db) return [];
        const result = await db
          .select()
          .from(notes)
          .where(eq(notes.formId, input.formId));
        return result;
      }),
    create: protectedProcedure
      .input(z.object({
        formId: z.number(),
        conteudo: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        await db.insert(notes).values({
          formId: input.formId,
          conteudo: input.conteudo,
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        conteudo: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        await db
          .update(notes)
          .set({ conteudo: input.conteudo })
          .where(eq(notes.id, input.id));
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        await db.delete(notes).where(eq(notes.id, input.id));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

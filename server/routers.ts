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

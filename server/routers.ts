import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getAllIrpfForms, getIrpfFormById, updateKitIRStatus } from "./db";

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
  }),
});

export type AppRouter = typeof appRouter;

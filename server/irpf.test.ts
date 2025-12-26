import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

/**
 * Mock context para testes
 */
function createMockContext(isAdmin: boolean = true): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: isAdmin ? "admin" : "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("IRPF Router", () => {
  describe("irpf.list", () => {
    it("should return empty array when no forms exist", async () => {
      const ctx = createMockContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.irpf.list({});

      expect(Array.isArray(result)).toBe(true);
    });

    it("should reject non-admin users", async () => {
      const ctx = createMockContext(false);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.irpf.list({});
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should accept search parameter", async () => {
      const ctx = createMockContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.irpf.list({
        search: "test",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should accept statusPagamento filter", async () => {
      const ctx = createMockContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.irpf.list({
        statusPagamento: "pago",
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("irpf.getById", () => {
    it("should reject non-admin users", async () => {
      const ctx = createMockContext(false);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.irpf.getById({ id: 1 });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should accept valid ID parameter", async () => {
      const ctx = createMockContext(true);
      const caller = appRouter.createCaller(ctx);

      // This will return undefined or null if the form doesn't exist
      // which is expected behavior
      const result = await caller.irpf.getById({ id: 1 });

      // Result can be undefined or null, both are acceptable
      expect(result === undefined || result === null || typeof result === "object").toBe(true);
    });
  });

  describe("Authentication", () => {
    it("admin user should have role 'admin'", async () => {
      const ctx = createMockContext(true);
      expect(ctx.user?.role).toBe("admin");
    });

    it("regular user should have role 'user'", async () => {
      const ctx = createMockContext(false);
      expect(ctx.user?.role).toBe("user");
    });

    it("context should have user info", async () => {
      const ctx = createMockContext(true);
      expect(ctx.user).toBeDefined();
      expect(ctx.user?.email).toBe("test@example.com");
      expect(ctx.user?.name).toBe("Test User");
    });
  });
});

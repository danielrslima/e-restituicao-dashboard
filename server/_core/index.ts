import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { listenToFormulariosChanges } from "../firebase";
import { syncFormularioFromFirebase } from "../db";
import { handleAsaasWebhook, validateAsaasWebhook } from "../webhook";
import { handleFormularioExterno } from "../formulario-externo";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Webhook ASAAS (antes das rotas OAuth e tRPC)
  app.post("/api/webhook/asaas", async (req, res) => {
    // Validar token do webhook (opcional)
    if (!validateAsaasWebhook(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    await handleAsaasWebhook(req, res);
  });
  
  // Endpoint para receber formulários do site externo
  app.post("/api/formulario/receber", async (req, res) => {
    await handleFormularioExterno(req, res);
  });
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    
    // Inicializar listener Firebase para sincronização em tempo real
    try {
      listenToFormulariosChanges(async (formularioId, data) => {
        console.log(`[Firebase] Novo formulário detectado: ${formularioId}`);
        try {
          await syncFormularioFromFirebase({ ...data, id: formularioId });
          console.log(`[Firebase] Formulário ${formularioId} sincronizado com sucesso`);
        } catch (error) {
          console.error(`[Firebase] Erro ao sincronizar formulário ${formularioId}:`, error);
        }
      });
      console.log('[Firebase] Listener de sincronização ativado');
    } catch (error) {
      console.error('[Firebase] Erro ao ativar listener:', error);
    }
  });
}

startServer().catch(console.error);

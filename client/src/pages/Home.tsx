import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Página Home - Redireciona para o Dashboard se autenticado
 */
export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Se o usuário está autenticado e é admin, redireciona para o dashboard
    if (isAuthenticated && user?.role === "admin") {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostrar mensagem de acesso restrito
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-3xl font-bold text-slate-900">e-Restituição</h1>
          <p className="text-slate-600">Dashboard Administrativo</p>
          <p className="text-sm text-slate-500 mt-8">
            Acesso restrito. Apenas administradores podem acessar este painel.
          </p>
        </div>
      </div>
    );
  }

  // Se está autenticado mas não é admin
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-bold text-slate-900">e-Restituição</h1>
        <p className="text-slate-600">Dashboard Administrativo</p>
        <p className="text-sm text-slate-500 mt-8">
          Você não tem permissão para acessar este painel.
        </p>
      </div>
    </div>
  );
}

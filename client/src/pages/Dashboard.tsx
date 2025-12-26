import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Loader2, Eye, Download } from "lucide-react";
import { useLocation } from "wouter";
import { formatCurrency } from "@/lib/format";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Redirect if not admin
  if (user && user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const { data: forms, isLoading, error } = trpc.irpf.list.useQuery({
    search: search || undefined,
    statusPagamento: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pago: "default",
      pendente: "secondary",
      cancelado: "destructive",
    };
    const labels: Record<string, string> = {
      pago: "Pago",
      pendente: "Pendente",
      cancelado: "Cancelado",
    };
    return <Badge variant={variants[status] || "secondary"}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Formulários IRPF</h1>
        <p className="text-muted-foreground">Gerenciar cálculos de IRPF enviados pelos usuários</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Buscar por nome, CPF ou processo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status de Pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className="border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Erro ao carregar formulários</div>
        ) : forms && forms.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Nº Processo</TableHead>
                <TableHead>IRPF a Restituir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form: any) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.nomeCliente}</TableCell>
                  <TableCell>{form.cpf}</TableCell>
                  <TableCell>{form.numeroProcesso}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(form.irpfRestituir)}
                  </TableCell>
                  <TableCell>{getStatusBadge(form.statusPagamento)}</TableCell>
                  <TableCell>{new Date(form.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/formulario/${form.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-muted-foreground">Nenhum formulário encontrado</div>
        )}
      </div>
    </div>
  );
}

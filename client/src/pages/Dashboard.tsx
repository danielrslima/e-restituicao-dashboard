import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Loader2, Eye, Download, Table as TableIcon, Edit, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { formatCurrency } from "@/lib/format";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryTab, setCategoryTab] = useState<string>("all");

  // Redirect if not admin
  if (user && user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const { data: allForms, isLoading, error } = trpc.irpf.list.useQuery({
    search: search || undefined,
    statusPagamento: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
  });

  // Filtrar por categoria
  const forms = useMemo(() => {
    if (!allForms) return [];
    if (categoryTab === "all") return allForms;
    return allForms.filter((form: any) => form.categoria === categoryTab);
  }, [allForms, categoryTab]);

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

      {/* Abas de Categoria */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setCategoryTab("all")}
          className={`px-4 py-2 font-medium transition-colors ${
            categoryTab === "all"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setCategoryTab("free")}
          className={`px-4 py-2 font-medium transition-colors ${
            categoryTab === "free"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Free (R$ 0)
        </button>
        <button
          onClick={() => setCategoryTab("starter")}
          className={`px-4 py-2 font-medium transition-colors ${
            categoryTab === "starter"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Starter (R$ 5,99)
        </button>
        <button
          onClick={() => setCategoryTab("builder")}
          className={`px-4 py-2 font-medium transition-colors ${
            categoryTab === "builder"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Builder (R$ 15,99)
        </button>
        <button
          onClick={() => setCategoryTab("specialist")}
          className={`px-4 py-2 font-medium transition-colors ${
            categoryTab === "specialist"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Specialist (Negociado)
        </button>
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
                <TableHead>Categoria</TableHead>
                <TableHead>IRPF a Restituir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form: any) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.nomeCliente}</TableCell>
                  <TableCell>{form.cpf}</TableCell>
                  <TableCell>{form.numeroProcesso}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {form.categoria === "free" && "Free (R$ 0)"}
                      {form.categoria === "starter" && "Starter (R$ 5,99)"}
                      {form.categoria === "builder" && "Builder (R$ 15,99)"}
                      {form.categoria === "specialist" && "Specialist"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(form.irpfRestituir)}
                  </TableCell>
                  <TableCell>{getStatusBadge(form.statusPagamento)}</TableCell>
                  <TableCell className="text-sm">
                    <div>{new Date(form.createdAt).toLocaleDateString("pt-BR")}</div>
                    <div className="text-xs text-muted-foreground">{new Date(form.createdAt).toLocaleTimeString("pt-BR")}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/formulario/${form.id}`)}
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/tabela/${form.id}`)}
                        title="Ver Tabelas"
                      >
                        <TableIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/editar/${form.id}`)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja deletar o formulário de ${form.nomeCliente}?`)) {
                            // TODO: Implementar deleção
                            alert('Funcionalidade de deleção será implementada em breve');
                          }
                        }}
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
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

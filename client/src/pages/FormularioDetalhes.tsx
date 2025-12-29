import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { Loader2, ArrowLeft, Download, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatDate, formatCPF, formatCNPJ, formatPercent } from "@/lib/format";
import { generateDemonstratividePDF, generateEsclarecimentosPDF } from "@/lib/pdf-generator";
import { useState } from "react";

export default function FormularioDetalhes() {
  const { user } = useAuth();
  const [match, params] = useRoute("/formulario/:id");
  const [, setLocation] = useLocation();
  const [generatingDemonstrative, setGeneratingDemonstrative] = useState(false);
  const [generatingEsclarecimentos, setGeneratingEsclarecimentos] = useState(false);
  const [confirmacaoDelecao, setConfirmacaoDelecao] = useState("");
  const [deletando, setDeletando] = useState(false);
  const deleteMutation = trpc.irpf.delete.useMutation({
    onSuccess: () => {
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      console.error("Erro ao deletar:", error);
    },
  });

  // Redirect if not admin
  if (user && user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const formId = params?.id ? parseInt(params.id) : null;
  const { data: form, isLoading, error } = trpc.irpf.getById.useQuery(
    { id: formId! },
    { enabled: !!formId }
  );

  if (!match || !formId) {
    return <div>Formulário não encontrado</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="p-8 text-center text-red-500">Erro ao carregar formulário</div>
    );
  }

  const handleGenerateDemonstrative = async () => {
    setGeneratingDemonstrative(true);
    try {
      await generateDemonstratividePDF(form);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setGeneratingDemonstrative(false);
    }
  };

  const handleGenerateEsclarecimentos = async () => {
    setGeneratingEsclarecimentos(true);
    try {
      await generateEsclarecimentosPDF(form);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setGeneratingEsclarecimentos(false);
    }
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{form.nomeCliente}</h1>
            <p className="text-muted-foreground">CPF: {formatCPF(form.cpf)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Status</div>
          {getStatusBadge(form.statusPagamento)}
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Nome</div>
              <div>{form.nomeCliente}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">CPF</div>
              <div>{formatCPF(form.cpf)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Data de Nascimento</div>
              <div>{form.dataNascimento}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div>{form.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Telefone</div>
              <div>{form.telefone || "N/A"}</div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Processuais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Processuais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Nº Processo</div>
              <div>{form.numeroProcesso}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Vara</div>
              <div>{form.vara}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Comarca</div>
              <div>{form.comarca}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Fonte Pagadora</div>
              <div>{form.fontePagadora}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">CNPJ</div>
              <div>{formatCNPJ(form.cnpj)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Valores de Entrada */}
        <Card>
          <CardHeader>
            <CardTitle>Valores de Entrada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Bruto Homologado</div>
              <div className="text-lg font-semibold">{formatCurrency(form.brutoHomologado)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Tributável Homologado</div>
              <div className="text-lg font-semibold">{formatCurrency(form.tributavelHomologado)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Número de Meses</div>
              <div className="text-lg font-semibold">{form.numeroMeses}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Alvará</div>
              <div className="text-lg font-semibold">{formatCurrency(form.alvaraValor)}</div>
              <div className="text-xs text-muted-foreground">{form.alvaraData}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">DARF</div>
              <div className="text-lg font-semibold">{formatCurrency(form.darfValor)}</div>
              <div className="text-xs text-muted-foreground">{form.darfData}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Honorários</div>
              <div className="text-lg font-semibold">{formatCurrency(form.honorariosValor)}</div>
              <div className="text-xs text-muted-foreground">{form.honorariosAno}</div>
            </div>
          </CardContent>
        </Card>

        {/* Cálculos Intermediários */}
        <Card>
          <CardHeader>
            <CardTitle>Cálculos Intermediários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Proporção</div>
              <div className="text-lg font-semibold">{form.proporcao}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Rend. Trib. Alvará</div>
              <div className="text-lg font-semibold">{formatCurrency(form.rendimentosTributavelAlvara)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Rend. Trib. Honorários</div>
              <div className="text-lg font-semibold">{formatCurrency(form.rendimentosTributavelHonorarios)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Base de Cálculo</div>
              <div className="text-lg font-semibold">{formatCurrency(form.baseCalculo)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">RRA</div>
              <div className="text-lg font-semibold">{form.rra}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">IR Mensal</div>
              <div className="text-lg font-semibold">{form.irMensal}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">IR Devido</div>
              <div className="text-lg font-semibold">{formatCurrency(form.irDevido)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Resultado Final */}
        <Card className="md:col-span-2 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">IRPF a Restituir</CardTitle>
            <CardDescription className="text-green-700">Valor final calculado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {formatCurrency(form.irpfRestituir)}
            </div>
            <p className="text-sm text-green-700 mt-2">
              Data do cálculo: {formatDate(form.createdAt)}
            </p>
          </CardContent>
        </Card>

        {/* Tipo de Acesso */}
        <Card>
          <CardHeader>
            <CardTitle>Tipo de Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold" style={{
              backgroundColor: form.tipoAcesso === 'free' ? '#dbeafe' : '#e9d5ff',
              color: form.tipoAcesso === 'free' ? '#1e40af' : '#6b21a8'
            }}>
              {form.tipoAcesso === 'free' ? 'Interno (Free)' : 'Pago'}
            </div>
          </CardContent>
        </Card>

        {/* Status de Email */}
        <Card>
          <CardHeader>
            <CardTitle>Status de Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
              <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold" style={{
                backgroundColor: form.statusEmail === 'enviado' ? '#dcfce7' : form.statusEmail === 'agendado' ? '#fef3c7' : form.statusEmail === 'erro' ? '#fee2e2' : '#f3f4f6',
                color: form.statusEmail === 'enviado' ? '#166534' : form.statusEmail === 'agendado' ? '#92400e' : form.statusEmail === 'erro' ? '#991b1b' : '#374151'
              }}>
                {form.statusEmail === 'enviado' ? 'Enviado' : form.statusEmail === 'agendado' ? 'Agendado' : form.statusEmail === 'erro' ? 'Erro' : 'Pendente'}
              </div>
            </div>
            {form.dataAgendamentoEmail && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Agendado para</div>
                <div className="text-sm mt-1">{formatDate(form.dataAgendamentoEmail)}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seção de Exclusão */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Zona de Perigo - Excluir Formulário</CardTitle>
          <CardDescription>Esta ação é irreversível. Digite excluir para confirmar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="confirmacao">Digite "excluir" para confirmar</Label>
            <Input
              id="confirmacao"
              type="text"
              placeholder="excluir"
              value={confirmacaoDelecao}
              onChange={(e) => setConfirmacaoDelecao(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button
            variant="destructive"
            size="lg"
            disabled={confirmacaoDelecao !== "excluir" || deletando}
            onClick={() => {
              setDeletando(true);
              deleteMutation.mutate({ id: formId! });
            }}
          >
            {deletando ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {deletando ? "Deletando..." : "Deletar Formulário"}
          </Button>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex gap-4 flex-wrap">
        <Button
          size="lg"
          onClick={handleGenerateDemonstrative}
          disabled={generatingDemonstrative}
        >
          {generatingDemonstrative ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {generatingDemonstrative ? "Gerando..." : "Gerar Demonstrativo (PDF)"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleGenerateEsclarecimentos}
          disabled={generatingEsclarecimentos}
        >
          {generatingEsclarecimentos ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {generatingEsclarecimentos ? "Gerando..." : "Gerar Esclarecimentos (PDF)"}
        </Button>
      </div>
    </div>
  );
}

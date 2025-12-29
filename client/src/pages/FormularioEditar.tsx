import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function FormularioEditar() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: form, isLoading } = trpc.irpf.getById.useQuery({ id: Number(id) });
  const updateMutation = trpc.irpf.update.useMutation({
    onSuccess: () => {
      toast.success("Formulário atualizado com sucesso!");
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  // Estados do formulário
  const [formData, setFormData] = useState({
    // Dados pessoais
    nomeCliente: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    // Dados processuais
    numeroProcesso: "",
    vara: "",
    comarca: "",
    fontePagadora: "",
    cnpj: "",
    // Valores
    brutoHomologado: "",
    tributavelHomologado: "",
    numeroMeses: "",
    alvaraValor: "",
    alvaraData: "",
    darfValor: "",
    darfData: "",
    honorariosValor: "",
    honorariosAno: "",
    // Status
    statusPagamento: "pendente" as "pendente" | "pago" | "cancelado",
    categoria: "starter" as "free" | "starter" | "builder" | "specialist",
  });

  // Preencher formulário quando dados carregarem
  useEffect(() => {
    if (form) {
      setFormData({
        nomeCliente: form.nomeCliente || "",
        cpf: form.cpf || "",
        dataNascimento: form.dataNascimento || "",
        email: form.email || "",
        telefone: form.telefone || "",
        numeroProcesso: form.numeroProcesso || "",
        vara: form.vara || "",
        comarca: form.comarca || "",
        fontePagadora: form.fontePagadora || "",
        cnpj: form.cnpj || "",
        brutoHomologado: (form.brutoHomologado / 100).toFixed(2),
        tributavelHomologado: (form.tributavelHomologado / 100).toFixed(2),
        numeroMeses: form.numeroMeses.toString(),
        alvaraValor: (form.alvaraValor / 100).toFixed(2),
        alvaraData: form.alvaraData || "",
        darfValor: (form.darfValor / 100).toFixed(2),
        darfData: form.darfData || "",
        honorariosValor: (form.honorariosValor / 100).toFixed(2),
        honorariosAno: form.honorariosAno || "",
        statusPagamento: (form.statusPagamento || "pendente") as "pendente" | "pago" | "cancelado",
        categoria: (form.categoria || "starter") as "free" | "starter" | "builder" | "specialist",
      });
    }
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Converter valores de reais para centavos
    updateMutation.mutate({
      id: Number(id),
      data: {
        ...formData,
        brutoHomologado: Math.round(parseFloat(formData.brutoHomologado) * 100),
        tributavelHomologado: Math.round(parseFloat(formData.tributavelHomologado) * 100),
        numeroMeses: parseInt(formData.numeroMeses),
        alvaraValor: Math.round(parseFloat(formData.alvaraValor) * 100),
        darfValor: Math.round(parseFloat(formData.darfValor) * 100),
        honorariosValor: Math.round(parseFloat(formData.honorariosValor) * 100),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold">Editar Formulário IRPF</h1>
        <p className="text-muted-foreground">Editar dados do formulário #{id}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomeCliente">Nome Completo *</Label>
              <Input
                id="nomeCliente"
                value={formData.nomeCliente}
                onChange={(e) => setFormData({ ...formData, nomeCliente: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
              <Input
                id="dataNascimento"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                placeholder="DD/MM/AAAA"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dados Processuais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Processuais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numeroProcesso">Nº Processo *</Label>
              <Input
                id="numeroProcesso"
                value={formData.numeroProcesso}
                onChange={(e) => setFormData({ ...formData, numeroProcesso: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="vara">Vara *</Label>
              <Input
                id="vara"
                value={formData.vara}
                onChange={(e) => setFormData({ ...formData, vara: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="comarca">Comarca *</Label>
              <Input
                id="comarca"
                value={formData.comarca}
                onChange={(e) => setFormData({ ...formData, comarca: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="fontePagadora">Fonte Pagadora *</Label>
              <Input
                id="fontePagadora"
                value={formData.fontePagadora}
                onChange={(e) => setFormData({ ...formData, fontePagadora: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Valores do Cálculo */}
        <Card>
          <CardHeader>
            <CardTitle>Valores do Cálculo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brutoHomologado">Bruto Homologado (R$) *</Label>
              <Input
                id="brutoHomologado"
                type="number"
                step="0.01"
                value={formData.brutoHomologado}
                onChange={(e) => setFormData({ ...formData, brutoHomologado: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="tributavelHomologado">Tributável Homologado (R$) *</Label>
              <Input
                id="tributavelHomologado"
                type="number"
                step="0.01"
                value={formData.tributavelHomologado}
                onChange={(e) => setFormData({ ...formData, tributavelHomologado: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="numeroMeses">Número de Meses *</Label>
              <Input
                id="numeroMeses"
                type="number"
                value={formData.numeroMeses}
                onChange={(e) => setFormData({ ...formData, numeroMeses: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="alvaraValor">Valor ALVARÁ (R$) *</Label>
              <Input
                id="alvaraValor"
                type="number"
                step="0.01"
                value={formData.alvaraValor}
                onChange={(e) => setFormData({ ...formData, alvaraValor: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="alvaraData">Data ALVARÁ *</Label>
              <Input
                id="alvaraData"
                value={formData.alvaraData}
                onChange={(e) => setFormData({ ...formData, alvaraData: e.target.value })}
                placeholder="DD/MM/AAAA"
                required
              />
            </div>
            <div>
              <Label htmlFor="darfValor">Valor DARF (R$) *</Label>
              <Input
                id="darfValor"
                type="number"
                step="0.01"
                value={formData.darfValor}
                onChange={(e) => setFormData({ ...formData, darfValor: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="darfData">Data DARF *</Label>
              <Input
                id="darfData"
                value={formData.darfData}
                onChange={(e) => setFormData({ ...formData, darfData: e.target.value })}
                placeholder="DD/MM/AAAA"
                required
              />
            </div>
            <div>
              <Label htmlFor="honorariosValor">Valor Honorários (R$) *</Label>
              <Input
                id="honorariosValor"
                type="number"
                step="0.01"
                value={formData.honorariosValor}
                onChange={(e) => setFormData({ ...formData, honorariosValor: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="honorariosAno">Ano Honorários *</Label>
              <Input
                id="honorariosAno"
                value={formData.honorariosAno}
                onChange={(e) => setFormData({ ...formData, honorariosAno: e.target.value })}
                placeholder="AAAA"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Status e Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Status e Categoria</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="statusPagamento">Status de Pagamento</Label>
              <Select
                value={formData.statusPagamento}
                onValueChange={(value) => setFormData({ ...formData, statusPagamento: value as "pendente" | "pago" | "cancelado" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value as "free" | "starter" | "builder" | "specialist" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free (R$ 0)</SelectItem>
                  <SelectItem value="starter">Starter (R$ 5,99)</SelectItem>
                  <SelectItem value="builder">Builder (R$ 15,99)</SelectItem>
                  <SelectItem value="specialist">Specialist (Negociado)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex gap-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => setLocation("/dashboard")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}

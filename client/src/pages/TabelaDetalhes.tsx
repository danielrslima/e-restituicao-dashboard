import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export default function TabelaDetalhes() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: form, isLoading, error } = trpc.irpf.getById.useQuery({ id: Number(id) });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar formulário
      </div>
    );
  }

  // Valores de IRPF do Firebase (já calculados pela Planilha RT)
  // Usar irpfRestituir se existir, senão usar irDevido como fallback
  const valorIRPFRestituir = (form.irpfRestituir || form.irDevido) / 100;
  const taxaSelic = 51.78; // Taxa SELIC acumulada (exemplo)
  const valorOriginalIRPF = form.irDevido / 100;
  const valorAtualizadoIRPF = valorIRPFRestituir; // Usar valor do Firebase

  // Valores em reais
  const alvaraValor = form.alvaraValor / 100;
  const darfValor = form.darfValor / 100;
  const honorariosValor = form.honorariosValor / 100;
  const brutoHomologado = form.brutoHomologado / 100;
  const tributavelHomologado = form.tributavelHomologado / 100;
  const rendimentosTributavelAlvara = form.rendimentosTributavelAlvara / 100;
  const rendimentosTributavelHonorarios = form.rendimentosTributavelHonorarios / 100;
  const baseCalculo = form.baseCalculo / 100;

  // Deflação (índice 1.0000 para ano único)
  const indiceDeflacao = 1.0000;
  const alvaraCorrigido = alvaraValor * indiceDeflacao;
  const darfCorrigido = darfValor * indiceDeflacao;

  // Proporção (calcular com precisão máxima)
  const proporcao = tributavelHomologado / brutoHomologado;

  // Rendimentos Tributáveis Honorários = Honorários × Proporção
  const rendimentosTributaveisHonorarios = honorariosValor * proporcao;

  // Rendimentos Tributáveis (Tabela 2) = Tributável ALVARÁ - Tributável Honorários
  const rendimentosTributaveis = tributavelHomologado - rendimentosTributaveisHonorarios;

  // Rendimentos Isentos = Bruto Homologado - Tributável Homologado
  const rendimentosIsentos = brutoHomologado - tributavelHomologado;

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold">Tabela de Cálculos Detalhados</h1>
        <p className="text-muted-foreground">Cliente: {form.nomeCliente} - CPF: {form.cpf}</p>
      </div>

      {/* Tabela 1: RESUMO - PROPORÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>RESUMO - PROPORÇÃO</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">DARF</TableCell>
                <TableCell className="text-right">{formatCurrency(darfValor * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ALVARÁ</TableCell>
                <TableCell className="text-right">{formatCurrency(alvaraValor * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">NUM DE MESES</TableCell>
                <TableCell className="text-right">{form.numeroMeses}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bruto Homologado</TableCell>
                <TableCell className="text-right">{formatCurrency(brutoHomologado * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tributável Homologado</TableCell>
                <TableCell className="text-right">{formatCurrency(tributavelHomologado * 100)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tabela 2: BASE DE CALCULO IRPF - SELIC */}
      <Card>
        <CardHeader>
          <CardTitle>BASE DE CALCULO IRPF - SELIC Acumulada Mensalmente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>EXERCÍCIO</TableHead>
                  <TableHead className="text-right">RENDIMENTOS TRIBUTÁVEIS</TableHead>
                  <TableHead className="text-right">IRRF</TableHead>
                  <TableHead className="text-right">NÚMERO DE MESES</TableHead>
                  <TableHead className="text-right">IRPF</TableHead>
                  <TableHead>EXERCÍCIO</TableHead>
                  <TableHead className="text-right">TAXA SELIC (%)</TableHead>
                  <TableHead className="text-right">VALOR ORIGINAL</TableHead>
                  <TableHead className="text-right">VALOR ATUALIZADO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{form.alvaraData.split('/')[2]}</TableCell>
                  <TableCell className="text-right">{formatCurrency(rendimentosTributaveis * 100)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(darfValor * 100)}</TableCell>
                  <TableCell className="text-right">{form.numeroMeses.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(valorOriginalIRPF * 100)}</TableCell>
                  <TableCell>{form.alvaraData.split('/')[2]}</TableCell>
                  <TableCell className="text-right">{taxaSelic.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(valorOriginalIRPF * 100)}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {formatCurrency(valorAtualizadoIRPF * 100)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tabela 3: PREENCHIMENTO + DEFLAÇÃO + RENDIMENTOS */}
      <Card>
        <CardHeader>
          <CardTitle>PREENCHIMENTO DAS INFORMAÇÕES + CALCULO - DEFLAÇÃO + RENDIMENTOS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={3} className="text-center border-r">PREENCHIMENTO DAS INFORMAÇÕES</TableHead>
                  <TableHead colSpan={3} className="text-center border-r">CALCULO - DEFLAÇÃO</TableHead>
                  <TableHead colSpan={3} className="text-center">RENDIMENTOS</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead>ALVARÁ VALOR</TableHead>
                  <TableHead>DARF VALOR</TableHead>
                  <TableHead className="border-r">Honorários VALOR</TableHead>
                  <TableHead>Índice</TableHead>
                  <TableHead>ALVARÁ Correção</TableHead>
                  <TableHead className="border-r">DARF Correção</TableHead>
                  <TableHead>TRIBUTÁVEIS</TableHead>
                  <TableHead>Honorários</TableHead>
                  <TableHead>ISENTOS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-right">{formatCurrency(alvaraValor * 100)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(darfValor * 100)}</TableCell>
                  <TableCell className="text-right border-r">{formatCurrency(honorariosValor * 100)}</TableCell>
                  <TableCell className="text-right">{indiceDeflacao.toFixed(4)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(alvaraCorrigido * 100)}</TableCell>
                  <TableCell className="text-right border-r">{formatCurrency(darfCorrigido * 100)}</TableCell>
                  <TableCell className="text-right font-semibold text-blue-600">
                    {formatCurrency(tributavelHomologado * 100)}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(rendimentosTributaveisHonorarios * 100)}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {formatCurrency(rendimentosIsentos * 100)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Processo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nº Processo</p>
              <p className="font-medium">{form.numeroProcesso}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data ALVARÁ</p>
              <p className="font-medium">{form.alvaraData}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data DARF</p>
              <p className="font-medium">{form.darfData}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ano Honorários</p>
              <p className="font-medium">{form.honorariosAno}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Proporção</p>
              <p className="font-medium">{form.proporcao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">RRA (Rendimento Mensal)</p>
              <p className="font-medium">{form.rra}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

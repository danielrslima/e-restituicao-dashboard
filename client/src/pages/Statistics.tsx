import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { formatCurrency } from "@/lib/format";

export default function Statistics() {
  const [stats, setStats] = useState({
    totalReceita: 0,
    receitaMensal: 0,
    totalFormularios: 0,
    formulariosPagos: 0,
    formulariosKitIR: 0,
    taxaConversao: 0,
  });

  const { data: formularios } = trpc.irpf.list.useQuery({});

  useEffect(() => {
    if (!formularios) return;

    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

    let totalReceita = 0;
    let receitaMensal = 0;
    let formulariosPagos = 0;
    let formulariosKitIR = 0;

    formularios.forEach((form: any) => {
      // Receita total
      if (form.statusPagamento === "pago") {
        totalReceita += 5.99; // ou 15.99 dependendo do tipo
        formulariosPagos++;
      }

      // Receita do mês
      if (
        form.statusPagamento === "pago" &&
        new Date(form.createdAt) >= inicioMes
      ) {
        receitaMensal += 5.99;
      }

      // Kit IR
      if (form.statusKitIR === "pago") {
        formulariosKitIR++;
      }
    });

    const taxaConversao =
      formulariosPagos > 0
        ? Math.round((formulariosKitIR / formulariosPagos) * 100)
        : 0;

    setStats({
      totalReceita,
      receitaMensal,
      totalFormularios: formularios.length,
      formulariosPagos,
      formulariosKitIR,
      taxaConversao,
    });
  }, [formularios]);

  // Dados para gráfico de evolução mensal (últimos 12 meses)
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const mes = date.toLocaleString("pt-BR", { month: "short", year: "2-digit" });
    return { mes, receita: Math.random() * 500 }; // TODO: Calcular valores reais
  });

  // Top 10 maiores restituições
  const top10 =
    formularios
      ?.sort((a: any, b: any) => b.irpfRestituir - a.irpfRestituir)
      .slice(0, 10) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Estatísticas Financeiras</h1>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalReceita)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.formulariosPagos} formulários pagos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Receita Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.receitaMensal)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Conversão Kit IR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.taxaConversao}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.formulariosKitIR} de {stats.formulariosPagos}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Formulários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFormularios}</div>
            <p className="text-xs text-gray-500 mt-1">Todos os tempos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Formulários Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.formulariosPagos}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalFormularios > 0
                ? Math.round(
                    (stats.formulariosPagos / stats.totalFormularios) * 100
                  )
                : 0}
              % de conversão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Kit IR Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.formulariosKitIR}</div>
            <p className="text-xs text-gray-500 mt-1">Pacotes completos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Receita (Últimos 12 Meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="receita" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top 10 Maiores Restituições */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Maiores Valores de Restituição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {top10.map((form: any, idx: number) => (
              <div
                key={form.id}
                className="flex items-center justify-between pb-3 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-500 w-6">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-medium">{form.nomeCliente}</p>
                    <p className="text-xs text-gray-500">
                      Processo: {form.numeroProcesso}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {formatCurrency(form.irpfRestituir)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {form.statusKitIR === "pago" ? "Kit IR Pago" : "Pendente"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

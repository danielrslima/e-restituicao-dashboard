# 📋 Próximos Passos: e-Restituição Dashboard

**Data:** 26/12/2025  
**Checkpoint Atual:** 01e46237  
**Status:** Integração Firebase identificada - Site não coleta dados completos

---

## 🎯 Problema Identificado

O site **restituicaoia.com.br** salva os formulários na coleção Firebase `users` com estrutura **incompleta**. O dashboard precisa de **30+ campos** para gerar a Planilha RT, mas o site só salva **3 valores totais**.

### Estrutura Atual (Incompleta)

```json
{
  "dadosPessoais": { nomeCompleto, email, telefone, cpf, dataNascimento },
  "dadosProcesso": { numeroProcesso, comarca, vara, fontePagadora },
  "calculos": {
    "totalRestituir": 3275320.61,
    "somaAlvaras": 294601001.63,
    "somaDarfs": 22059731
  },
  "pagamentoStarter": { plano, valor, metodo, status, asaasId },
  "metadata": { criadoEm, status }
}
```

### Estrutura Necessária (Completa)

O dashboard espera estes campos na coleção `formularios`:

```javascript
{
  // Dados Pessoais
  nomeCompleto, cpf, dataNascimento, email, telefone,
  
  // Dados Processuais
  numeroProcesso, vara, comarca, fontePagadora, cnpj,
  
  // Valores de Entrada
  brutoHomologado, tributavelHomologado, numeroMeses,
  
  // Alvarás (array de objetos)
  alvaras: [
    { valor: 150000.50, data: "15/03/2020" },
    { valor: 200000.75, data: "20/06/2021" }
  ],
  
  // DARFs (array de objetos)
  darfs: [
    { valor: 10000.00, data: "25/03/2020" },
    { valor: 12000.00, data: "30/06/2021" }
  ],
  
  // Honorários (array de objetos)
  honorarios: [
    { valor: 50000.00, ano: 2020 },
    { valor: 60000.00, ano: 2021 }
  ],
  
  // Cálculos Intermediários
  proporcao, rendimentosTributavelAlvara, rendimentosTributavelHonorarios,
  baseCalculo, rra, irMensal, irDevido,
  
  // Resultado Final
  irpfRestituir,
  
  // Controle
  tipoAcesso, statusPagamento, statusKitIR, statusEmail,
  dataPagamento, createdAt
}
```

---

## 🔧 Solução 1: Modificar o Site (Prioritário)

### Arquivo: `restituicaoia.com.br/static/js/App.jsx`

**Localização do código:** Linha ~268 (onde está `const newProcess = { ... }`)

### Mudanças Necessárias:

#### 1. Adicionar campos de alvarás detalhados

```javascript
// ANTES (apenas soma)
calculos: {
  somaAlvaras: 294601001.63
}

// DEPOIS (valores individuais + datas)
alvaras: [
  { valor: 150000.50, data: "15/03/2020", dataAlvara: "15/03/2020" },
  { valor: 144601.13, data: "20/06/2021", dataAlvara: "20/06/2021" }
],
```

#### 2. Adicionar campos de DARFs detalhados

```javascript
// ANTES (apenas soma)
calculos: {
  somaDarfs: 22059731
}

// DEPOIS (valores individuais + datas)
darfs: [
  { valor: 10000.00, data: "25/03/2020", dataDarf: "25/03/2020" },
  { valor: 12059.731, data: "30/06/2021", dataDarf: "30/06/2021" }
],
```

#### 3. Adicionar honorários detalhados

```javascript
honorarios: [
  { valor: 50000.00, ano: 2020, anoHonorarios: 2020 },
  { valor: 60000.00, ano: 2021, anoHonorarios: 2021 }
],
```

#### 4. Adicionar valores de entrada

```javascript
brutoHomologado: 500000.00,
tributavelHomologado: 450000.00,
numeroMeses: 24,
```

#### 5. Adicionar cálculos intermediários

```javascript
proporcao: 0.85,
rendimentosTributavelAlvara: 250000.00,
rendimentosTributavelHonorarios: 51000.00,
baseCalculo: 301000.00,
rra: 12,
irMensal: 1500.00,
irDevido: 18000.00,
```

#### 6. Mudar coleção de destino

```javascript
// ANTES
const docRef = await addDoc(collection(db, 'users'), newProcess);

// DEPOIS
const docRef = await addDoc(collection(db, 'formularios'), newProcess);
```

### Estrutura Final do newProcess

```javascript
const newProcess = {
  // Dados Pessoais
  nomeCompleto: userData.nomeCompleto,
  cpf: userData.cpf,
  dataNascimento: userData.dataNascimento,
  email: userData.email,
  telefone: userData.telefone,
  
  // Dados Processuais
  numeroProcesso: processData.numeroProcesso,
  vara: processData.vara,
  comarca: processData.comarca,
  fontePagadora: processData.fontePagadora,
  cnpj: processData.cnpj || "",
  
  // Valores de Entrada
  brutoHomologado: valueData.brutoHomologado,
  tributavelHomologado: valueData.tributavelHomologado,
  numeroMeses: valueData.numeroMeses,
  
  // Alvarás detalhados
  alvaras: valueData.alvaras.map(a => ({
    valor: a.valor,
    data: a.data,
    dataAlvara: a.data
  })),
  
  // DARFs detalhados
  darfs: valueData.darfs.map(d => ({
    valor: d.valor,
    data: d.data,
    dataDarf: d.data
  })),
  
  // Honorários detalhados
  honorarios: valueData.honorarios.map(h => ({
    valor: h.valor,
    ano: h.ano,
    anoHonorarios: h.ano
  })),
  
  // Cálculos Intermediários
  proporcao: valorCalculos.proporcao,
  rendimentosTributavelAlvara: valorCalculos.rendTribAlvara,
  rendimentosTributavelHonorarios: valorCalculos.rendTribHonorarios,
  baseCalculo: valorCalculos.baseCalculo,
  rra: valorCalculos.rra,
  irMensal: valorCalculos.irMensal,
  irDevido: valorCalculos.irDevido,
  
  // Resultado Final
  irpfRestituir: valorCalculos.totalRestituir,
  
  // Controle
  tipoAcesso: paymentData.plano === "Starter" ? "Starter" : "Builder",
  statusPagamento: paymentData.status === "CONFIRMED" ? "pago" : "pendente",
  statusKitIR: "pendente",
  statusEmail: "pendente",
  dataPagamento: paymentData.dataConfirmacao,
  createdAt: new Date().toISOString(),
  
  // Metadata para compatibilidade
  timestamp: new Date().toISOString(),
  paymentData,
  pdfData: updatedPdfData
};

// Salvar na coleção correta
const docRef = await addDoc(collection(db, 'formularios'), newProcess);
```

---

## 🔧 Solução 2: Adicionar Edição no Dashboard

### Arquivo: `client/src/pages/FormularioDetalhes.tsx`

Adicionar botão "Editar" que abre um modal com formulário para preencher os campos faltantes:

```typescript
const [isEditing, setIsEditing] = useState(false);

// Mutation para atualizar formulário
const updateFormulario = trpc.formularios.update.useMutation({
  onSuccess: () => {
    toast.success("Formulário atualizado!");
    setIsEditing(false);
  }
});

// Botão Editar
<Button onClick={() => setIsEditing(true)}>
  <Edit className="w-4 h-4 mr-2" />
  Editar Dados
</Button>

// Modal de Edição
{isEditing && (
  <Dialog open={isEditing} onOpenChange={setIsEditing}>
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Editar Formulário</DialogTitle>
      </DialogHeader>
      
      <FormularioEditForm
        formulario={formulario}
        onSave={(data) => updateFormulario.mutate({ id, ...data })}
        onCancel={() => setIsEditing(false)}
      />
    </DialogContent>
  </Dialog>
)}
```

### Arquivo: `server/routers.ts`

Adicionar procedure de atualização:

```typescript
update: protectedProcedure
  .input(z.object({
    id: z.string(),
    brutoHomologado: z.number().optional(),
    tributavelHomologado: z.number().optional(),
    numeroMeses: z.number().optional(),
    alvaras: z.array(z.object({
      valor: z.number(),
      data: z.string()
    })).optional(),
    darfs: z.array(z.object({
      valor: z.number(),
      data: z.string()
    })).optional(),
    honorarios: z.array(z.object({
      valor: z.number(),
      ano: z.number()
    })).optional(),
    // ... outros campos
  }))
  .mutation(async ({ input, ctx }) => {
    const { id, ...data } = input;
    await updateFormularioInFirebase(id, data);
    return { success: true };
  }),
```

---

## 📊 Comparação de Soluções

| Aspecto | Modificar Site | Adicionar Edição Dashboard |
|---------|----------------|---------------------------|
| **Esforço** | Médio (1 arquivo) | Alto (múltiplos arquivos) |
| **Tempo** | ~2h | ~4-6h |
| **Automação** | ✅ Automático | ❌ Manual |
| **Escalabilidade** | ✅ Todos os futuros | ❌ Caso a caso |
| **Recomendação** | **PRIORITÁRIO** | Complementar |

---

## ✅ Checklist de Implementação

### Fase 1: Modificar Site (Essencial)

- [ ] Abrir `App.jsx` do site restituicaoia.com.br
- [ ] Localizar `const newProcess = { ... }` (linha ~268)
- [ ] Adicionar campos de alvarás detalhados (array de objetos)
- [ ] Adicionar campos de DARFs detalhados (array de objetos)
- [ ] Adicionar campos de honorários detalhados (array de objetos)
- [ ] Adicionar valores de entrada (brutoHomologado, tributavelHomologado, numeroMeses)
- [ ] Adicionar cálculos intermediários (proporção, RRA, IR Mensal, etc.)
- [ ] Mudar `collection(db, 'users')` para `collection(db, 'formularios')`
- [ ] Testar preenchimento de formulário
- [ ] Verificar no Firebase se dados foram salvos em `formularios`
- [ ] Verificar no dashboard se formulário aparece com todos os dados
- [ ] Gerar PDFs e validar que estão completos

### Fase 2: Adicionar Edição no Dashboard (Opcional)

- [ ] Criar componente `FormularioEditForm.tsx`
- [ ] Adicionar botão "Editar" em `FormularioDetalhes.tsx`
- [ ] Criar modal de edição com todos os campos
- [ ] Adicionar procedure `formularios.update` em `routers.ts`
- [ ] Implementar função `updateFormularioInFirebase` em `firebase.ts`
- [ ] Testar edição de formulário existente
- [ ] Validar que PDFs refletem as mudanças

---

## 🚀 Próximos Passos Imediatos

1. **Modificar o site** seguindo a Solução 1 acima
2. **Testar com formulário real** (preencher novo formulário no site)
3. **Validar no dashboard** que todos os dados aparecem
4. **Gerar PDFs** e confirmar que estão completos
5. **Deploy no Hostinger** seguindo `DEPLOY-HOSTINGER.md`

---

## 📁 Arquivos Importantes

**Site (restituicaoia.com.br):**
- `static/js/App.jsx` - Lógica principal do formulário
- `static/js/firebase-config.js` - Configuração Firebase

**Dashboard (e-restituicao-dashboard):**
- `server/firebase.ts` - Integração Firebase
- `server/routers.ts` - API tRPC
- `client/src/pages/FormularioDetalhes.tsx` - Visualização de formulário
- `client/src/lib/pdf-generator.ts` - Geração de PDFs

**Documentação:**
- `RETOMADA-PROJETO.md` - Status geral do projeto
- `DEPLOY-HOSTINGER.md` - Guia de deploy
- `todo.md` - Tarefas pendentes

---

## 🔍 Comando para Retomar

Quando voltar, use:

```
"Retomar projeto e-Restituição Dashboard a partir do checkpoint 01e46237. Vamos implementar as modificações no site conforme documento PROXIMOS-PASSOS-COMPLETO.md para coletar todos os dados necessários."
```

---

**Autor:** Manus AI  
**Última Atualização:** 26/12/2025

# 🚀 PRÓXIMOS PASSOS CONSOLIDADOS - e-Restituição

**Data:** 26/12/2025  
**Checkpoint Atual:** d808fa64  
**Créditos Restantes:** ~500

---

## 📌 RESUMO EXECUTIVO

O projeto e-Restituição Dashboard está **95% funcional**. Faltam apenas 3 tarefas críticas para completar a transferência e deixar o sistema 100% pronto para produção.

### Status Atual

| Componente | Status | Observação |
|-----------|--------|-----------|
| Dashboard | ✅ Funcionando | 13/13 testes passando |
| PDFs (Planilha RT) | ✅ Perfeito | Idêntico ao template |
| PDFs (Esclarecimentos) | ✅ Quase pronto | Pequenos ajustes pendentes |
| Firebase | ✅ Sincronizado | Lê ambas as coleções |
| ASAAS (Pagamentos) | ✅ Funcional | Webhook configurado |
| SendGrid (Emails) | ✅ Funcional | Agendamento 7 dias OK |
| Site | ⚠️ Incompleto | Falta coletar dados detalhados |

---

## 🎯 TAREFAS PRIORITÁRIAS (Ordem de Execução)

### TAREFA 1: Modificar Site para Coletar Dados Completos

**Prioridade:** 🔴 CRÍTICA  
**Tempo Estimado:** 2-3 horas  
**Créditos Necessários:** ~100-150

#### O Problema

O site `restituicaoia.com.br` salva apenas 3 valores totais no Firebase:
- `totalRestituir`
- `somaAlvaras`
- `somaDarfs`

O dashboard precisa de **30+ campos** detalhados para gerar a Planilha RT completa.

#### A Solução

Modificar `App.jsx` do site para salvar todos os campos necessários na coleção `formularios`.

#### Passo a Passo

**1. Acessar o arquivo do site**

```bash
# Via FTP/SSH do Hostinger
ssh usuario@restituicaoia.com.br
cd /home/usuario/restituicaoia.com.br/static/js/
nano App.jsx
```

**2. Localizar o código de salvamento (linha ~268)**

Procurar por:
```javascript
const newProcess = {
  dadosPessoais: { ... },
  dadosProcesso: { ... },
  calculos: { ... }
};
```

**3. Substituir pela estrutura completa**

Copiar o código abaixo e substituir a seção `const newProcess`:

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
  
  // Alvarás detalhados (array)
  alvaras: valueData.alvaras.map(a => ({
    valor: a.valor,
    data: a.data
  })),
  
  // DARFs detalhados (array)
  darfs: valueData.darfs.map(d => ({
    valor: d.valor,
    data: d.data
  })),
  
  // Honorários detalhados (array)
  honorarios: valueData.honorarios.map(h => ({
    valor: h.valor,
    ano: h.ano
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
  createdAt: new Date().toISOString()
};

// Salvar na coleção correta
const docRef = await addDoc(collection(db, 'formularios'), newProcess);
```

**4. Verificar mudanças importantes**

- ✅ Mudou de `collection(db, 'users')` para `collection(db, 'formularios')`
- ✅ Adicionou arrays de alvarás, DARFs e honorários
- ✅ Adicionou valores de entrada (brutoHomologado, etc.)
- ✅ Adicionou cálculos intermediários

**5. Testar localmente**

```bash
# Fazer upload para Hostinger
# Preencher novo formulário no site
# Verificar que dados aparecem no Firebase (coleção: formularios)
```

**6. Validar no Dashboard**

- Novo formulário deve aparecer na listagem
- Todos os campos devem estar preenchidos
- PDFs devem gerar sem erros

#### Validação

Após modificar o site, preencher um novo formulário e verificar:

```javascript
// No Firebase Console, coleção 'formularios', novo documento
{
  nomeCompleto: "...",
  cpf: "...",
  alvaras: [ { valor: 150000.50, data: "15/03/2020" }, ... ],
  darfs: [ { valor: 10000.00, data: "25/03/2020" }, ... ],
  honorarios: [ { valor: 50000.00, ano: 2020 }, ... ],
  // ... todos os 30+ campos
}
```

---

### TAREFA 2: Finalizar Template PDF Esclarecimentos

**Prioridade:** 🟡 ALTA  
**Tempo Estimado:** 1-2 horas  
**Créditos Necessários:** ~50-100

#### O Problema

O PDF de Esclarecimentos precisa de pequenos ajustes de formatação para ser 100% idêntico ao documento perfeito.

#### Ajustes Necessários

Verificar em `client/src/lib/pdf-generator.ts`:

1. **Sublinhados nos títulos**
   - Título "A) DADOS DA AÇÃO:" deve ter sublinhado
   - Título "B) VALORES E DATAS:" deve ter sublinhado
   - Texto "NA OPÇÃO DE TRIBUTAÇÃO EXCLUSIVA NA FONTE" deve ter sublinhado

2. **Valores em negrito**
   - Todos os valores R$ nos itens 3-6 devem estar em negrito

3. **Linha horizontal**
   - Deve haver linha grossa antes do logo IR360

#### Código a Verificar

```typescript
// Em pdf-generator.ts, função generateEsclarecimentos()

// Verificar se sublinhados estão aplicados
doc.setFont("Arial", "bold");
doc.setFontSize(11);
doc.textWithLink("A) DADOS DA AÇÃO:", 20, yPosition, {
  underline: true  // ← Deve estar aqui
});

// Verificar se valores estão em negrito
doc.setFont("Arial", "bold");
doc.text(`R$ ${formatarMoeda(formulario.irMensal)}`, 150, yPosition);
```

#### Teste de Validação

1. Gerar PDF de Esclarecimentos
2. Comparar com documento perfeito: `/home/ubuntu/upload/0-EsclarecimentosJoseRamos.pdf`
3. Validar visualmente:
   - Sublinhados visíveis ✅
   - Valores em negrito ✅
   - Espaçamentos corretos ✅
   - Logo IR360 com linha grossa acima ✅

---

### TAREFA 3: Criar Documentação de Deploy

**Prioridade:** 🟡 ALTA  
**Tempo Estimado:** 1-2 horas  
**Créditos Necessários:** ~50

#### O Que Fazer

Criar documento `DEPLOY-HOSTINGER.md` com passo a passo para:

1. Transferir código do dashboard para Hostinger
2. Configurar variáveis de ambiente
3. Configurar domínio customizado
4. Configurar SSL/TLS
5. Testar com pagamentos reais
6. Monitorar logs

#### Estrutura do Documento

```markdown
# 📦 GUIA DE DEPLOY - e-Restituição Dashboard

## Pré-requisitos
- Acesso SSH/FTP ao Hostinger
- Node.js 18+ instalado
- MySQL configurado
- Firebase configurado

## Passo 1: Preparar Servidor
## Passo 2: Clonar Código
## Passo 3: Instalar Dependências
## Passo 4: Configurar Variáveis de Ambiente
## Passo 5: Executar Migrações
## Passo 6: Iniciar Servidor
## Passo 7: Configurar Domínio
## Passo 8: Configurar SSL
## Passo 9: Testar Funcionalidades
## Passo 10: Monitorar e Manter
```

---

## 📋 TAREFAS SECUNDÁRIAS (Quando Tiver Mais Créditos)

### TAREFA 4: Adicionar Edição no Dashboard

**Prioridade:** 🟢 MÉDIA  
**Tempo Estimado:** 4-6 horas  
**Créditos Necessários:** ~150-200

Permitir editar campos faltantes de formulários já existentes na coleção `users`.

**Arquivos a criar:**
- `client/src/components/FormularioEditForm.tsx` - Formulário de edição
- Procedure `formularios.update` em `server/routers.ts`
- Função `updateFormularioInFirebase` em `server/firebase.ts`

---

## 🔄 FLUXO DE TRABALHO RECOMENDADO

```
SEMANA 1:
├── Tarefa 1: Modificar Site (2-3h)
├── Validação: Novo formulário no dashboard (1h)
└── Tarefa 2: Finalizar PDF Esclarecimentos (1-2h)

SEMANA 2:
├── Tarefa 3: Criar Documentação Deploy (1-2h)
├── Tarefa 4: Adicionar Edição Dashboard (4-6h)
└── Testes Finais (2-3h)

SEMANA 3:
├── Deploy em Produção (2-4h)
├── Testes com Pagamentos Reais (2-3h)
└── Monitoramento e Ajustes (1-2h)
```

---

## 🧪 TESTES A REALIZAR

### Após Tarefa 1 (Modificar Site)

```
✅ Novo formulário preenchido no site
✅ Dados salvos em Firebase (coleção: formularios)
✅ Dashboard sincroniza automaticamente
✅ Todos os 30+ campos aparecem no dashboard
✅ PDF Planilha RT gera sem erros
✅ PDF Esclarecimentos gera sem erros
✅ Valores nos PDFs estão corretos
```

### Após Tarefa 2 (Finalizar PDF)

```
✅ Sublinhados visíveis nos títulos
✅ Valores em negrito
✅ Espaçamentos corretos
✅ Logo IR360 com linha grossa
✅ PDF 100% idêntico ao documento perfeito
```

### Após Tarefa 3 (Deploy)

```
✅ Dashboard acessível via domínio customizado
✅ SSL/TLS configurado
✅ Pagamentos ASAAS funcionando
✅ Emails SendGrid sendo enviados
✅ Firebase sincronizando em tempo real
✅ Sem erros nos logs
```

---

## 📊 ESTIMATIVA DE CRÉDITOS

| Tarefa | Créditos | Status |
|--------|----------|--------|
| Tarefa 1: Modificar Site | 100-150 | 🔴 Pendente |
| Tarefa 2: Finalizar PDF | 50-100 | 🔴 Pendente |
| Tarefa 3: Deploy | 50 | 🔴 Pendente |
| Tarefa 4: Edição Dashboard | 150-200 | 🟢 Opcional |
| **Total Crítico** | **200-250** | |
| **Total com Opcional** | **350-450** | |
| **Créditos Restantes** | **~500** | ✅ Suficiente |

---

## 🎯 CHECKLIST FINAL

Antes de considerar o projeto completo:

- [ ] Tarefa 1 concluída e validada
- [ ] Tarefa 2 concluída e validada
- [ ] Tarefa 3 concluída e validada
- [ ] Todos os testes passando (13/13)
- [ ] Documentação atualizada
- [ ] Checkpoint criado
- [ ] Deploy em produção realizado
- [ ] Pagamentos reais testados
- [ ] Emails sendo enviados corretamente
- [ ] Sem erros nos logs

---

## 📞 COMO RETOMAR

Quando voltar para continuar, use este comando:

```
"Retomar projeto e-Restituição Dashboard a partir do checkpoint d808fa64. 
Vamos começar pela Tarefa 1: modificar App.jsx do site para coletar dados 
completos conforme PROXIMOS-PASSOS-COMPLETO.md"
```

---

## 📁 ARQUIVOS IMPORTANTES

**Documentação:**
- `GUIA-MASTER-TRANSFERENCIA.md` - Guia completo de transferência
- `CHECKLIST-TRANSFERENCIA.md` - Checklist de transferência
- `PROXIMOS-PASSOS-COMPLETO.md` - Detalhes técnicos das modificações
- `PROXIMOS-PASSOS-CONSOLIDADO.md` - Este arquivo

**Código:**
- `client/src/lib/pdf-generator.ts` - Geração de PDFs
- `server/firebase.ts` - Integração Firebase
- `server/routers.ts` - API tRPC
- `drizzle/schema.ts` - Schema do banco de dados

**Referência:**
- `/home/ubuntu/upload/0-EsclarecimentosJoseRamos.pdf` - Documento perfeito
- `/home/ubuntu/upload/0-EsclarecimentosJoseRamos(1).docx` - Documento Word

---

**Autor:** Manus AI  
**Última Atualização:** 26/12/2025  
**Versão:** 1.0

Boa sorte! 🚀

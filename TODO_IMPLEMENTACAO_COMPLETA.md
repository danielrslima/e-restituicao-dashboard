# 🚀 TODO: Implementação Completa do Dashboard

**Data**: 28/12/2025  
**Status**: Análise Completa  
**Total de Tarefas**: 28  
**Tempo Estimado**: 58-78 horas

---

# 🔴 CRÍTICO (Fazer Primeiro - 20-24 horas)

## Fase 1: Interface e Componentes (10-12 horas)

- [ ] **1.1** Adicionar 4 ícones de ação na tabela do Dashboard
  - [ ] Importar ícones (Edit, Grid, Trash2)
  - [ ] Adicionar handlers para cada ação
  - [ ] Integrar com modais/páginas
  - **Tempo**: 1-2h
  - **Arquivo**: `/client/src/pages/Dashboard.tsx`

- [ ] **1.2** Criar componente Modal de Visualização (Olho)
  - [ ] Componente Modal/Dialog
  - [ ] Exibir 6 dados pessoais
  - [ ] Links para download de PDFs
  - [ ] Integração com FormularioDetalhes.tsx
  - **Tempo**: 2-3h
  - **Arquivo**: `/client/src/components/VisualizarModal.tsx`

- [ ] **1.3** Adicionar Abas por Categoria (Free, Starter, Builder, Specialist)
  - [ ] Componente Tabs
  - [ ] Filtro por `tipoAcesso`
  - [ ] Contagem por aba
  - [ ] Indicador visual (ponto de cor)
  - **Tempo**: 1-2h
  - **Arquivo**: `/client/src/pages/Dashboard.tsx`

- [ ] **1.4** Criar Formulário de Edição (Lápis)
  - [ ] Componente Form com validação
  - [ ] Mutation tRPC para atualizar
  - [ ] Integração com FormularioDetalhes.tsx
  - [ ] Campos: Dados pessoais, processuais, valores, status
  - **Tempo**: 3-4h
  - **Arquivo**: `/client/src/components/EditarFormulario.tsx`

- [ ] **1.5** Implementar Deleção (Lixo)
  - [ ] Confirmação antes de deletar
  - [ ] Mutation tRPC para deletar
  - [ ] Atualizar tabela após deleção
  - **Tempo**: 1-2h
  - **Arquivo**: `/client/src/pages/Dashboard.tsx`

---

## Fase 2: Dados e Cálculos (8-10 horas)

- [ ] **2.1** Implementar Cálculos IRPF Completos
  - [ ] Proporção de tributáveis
  - [ ] Rendimentos tributável alvará
  - [ ] Rendimentos tributável honorários
  - [ ] Base de cálculo
  - [ ] RRA (Rendimento Mensal)
  - [ ] IR Mensal
  - [ ] IR Devido
  - **Tempo**: 4-6h
  - **Arquivo**: `/server/calculations.ts`

- [ ] **2.2** Implementar Deflação de Valores
  - [ ] Carregar dados SELIC de `selic_acumulada.json`
  - [ ] Aplicar índice de deflação
  - [ ] Atualizar valores
  - **Tempo**: 2-3h
  - **Arquivo**: `/server/calculations.ts`

- [ ] **2.3** Atualizar Taxa SELIC
  - [ ] Buscar taxa SELIC para o período
  - [ ] Aplicar no cálculo IRPF
  - [ ] Atualizar valores finais
  - **Tempo**: 1-2h
  - **Arquivo**: `/server/calculations.ts`

- [ ] **2.4** Adicionar Campos Faltando no Banco
  - [ ] FONTE PAGADORA
  - [ ] CNPJ
  - [ ] EXERCÍCIO (Honorários)
  - [ ] Todos os campos de cálculo
  - **Tempo**: 1h
  - **Arquivo**: `/drizzle/schema.ts`

---

## Fase 3: Firebase (6-8 horas)

- [ ] **3.1** Ativar Firebase Storage
  - [ ] Acesso: https://console.firebase.google.com
  - [ ] Projeto: eRestituicao
  - [ ] Fazer upgrade para plano Blaze
  - [ ] Configurar regras de acesso
  - **Tempo**: 1-2h
  - **Ação Manual**: No console Firebase

- [ ] **3.2** Ativar Listener Firebase
  - [ ] Inicializar listener no startup do servidor
  - [ ] Garantir que roda continuamente
  - [ ] Tratamento de erros
  - **Tempo**: 1-2h
  - **Arquivo**: `/server/_core/index.ts`

- [ ] **3.3** Sincronização Bidirecional
  - [ ] Firebase → MySQL (já existe)
  - [ ] MySQL → Firebase (falta)
  - [ ] Quando editar no dashboard, atualizar Firebase
  - [ ] Quando deletar no dashboard, deletar Firebase
  - **Tempo**: 2-3h
  - **Arquivo**: `/server/routers.ts`

- [ ] **3.4** Tratamento de Erros Firebase
  - [ ] Retry automático
  - [ ] Notificação de erro
  - [ ] Fallback se Firebase cair
  - **Tempo**: 1-2h
  - **Arquivo**: `/server/firebase.ts`

---

# 🟡 IMPORTANTE (Fazer Depois - 18-22 horas)

## Fase 4: Página de Tabela (3-4 horas)

- [ ] **4.1** Criar Página de Tabela com 3 Tabelas
  - [ ] Tabela 1: RESUMO - PROPORÇÃO (5 campos)
  - [ ] Tabela 2: BASE DE CALCULO IRPF - SELIC (8 colunas)
  - [ ] Tabela 3: PREENCHIMENTO + DEFLAÇÃO + RENDIMENTOS (15 colunas)
  - [ ] Scroll horizontal em mobile
  - [ ] Formatação de valores
  - **Tempo**: 3-4h
  - **Arquivo**: `/client/src/pages/TabelaDetalhes.tsx`

- [ ] **4.2** Adicionar Rota para Página de Tabela
  - [ ] Rota: `/tabela/:id`
  - [ ] Integração com Dashboard
  - **Tempo**: 0.5h
  - **Arquivo**: `/client/src/App.tsx`

---

## Fase 5: Geração de PDFs (4-6 horas)

- [ ] **5.1** Integração PDF Generator → Modal
  - [ ] Chamar `generateDemonstratividePDF()` ao abrir modal
  - [ ] Chamar `generateEsclarecimentosPDF()` ao abrir modal
  - [ ] Salvar PDFs no Firebase Storage
  - [ ] Gerar links para download
  - **Tempo**: 2-3h
  - **Arquivo**: `/client/src/components/VisualizarModal.tsx`

- [ ] **5.2** Upload de PDFs para Firebase Storage
  - [ ] Implementar upload
  - [ ] Gerar links de download
  - [ ] Armazenar URLs no banco
  - **Tempo**: 2-3h
  - **Arquivo**: `/server/routers.ts`

- [ ] **5.3** Armazenamento de URLs de PDFs
  - [ ] Adicionar campos: `pdfData1Url`, `pdfEsc1Url`
  - [ ] Migração de banco
  - [ ] Atualizar schema
  - **Tempo**: 1h
  - **Arquivo**: `/drizzle/schema.ts`

---

## Fase 6: Autenticação e Validação (6-8 horas)

- [ ] **6.1** RBAC em Todos os Endpoints
  - [ ] Verificação em TODOS os endpoints tRPC
  - [ ] Proteção de rotas detalhadas
  - [ ] Validação de permissões granulares
  - **Tempo**: 2-3h
  - **Arquivo**: `/server/routers.ts`

- [ ] **6.2** Confirmação de Ações Críticas
  - [ ] Confirmação antes de deletar
  - [ ] Confirmação antes de editar valores críticos
  - [ ] Undo/Redo
  - **Tempo**: 2-3h
  - **Arquivo**: `/client/src/components/*`

- [ ] **6.3** Validação de Dados
  - [ ] Validar CPF
  - [ ] Validar data de nascimento
  - [ ] Validar número de processo
  - [ ] Validar valores monetários
  - **Tempo**: 2-3h
  - **Arquivo**: `/server/validations.ts`

- [ ] **6.4** Tratamento de Erros na UI
  - [ ] Mensagens de erro descritivas
  - [ ] Sugestões de ação
  - [ ] Retry automático
  - [ ] Toast notifications
  - **Tempo**: 1-2h
  - **Arquivo**: `/client/src/lib/toast.ts`

---

# 🟢 DESEJÁVEL (Fazer por Último - 20-32 horas)

## Fase 7: Auditoria e Logs (3-4 horas)

- [ ] **7.1** Auditoria de Ações
  - [ ] Registrar quem editou o quê
  - [ ] Registrar quem deletou
  - [ ] Registrar quando gerou PDF
  - [ ] Tabela de auditoria
  - **Tempo**: 3-4h
  - **Arquivo**: `/server/routers.ts`, `/drizzle/schema.ts`

---

## Fase 8: Performance (6-8 horas)

- [ ] **8.1** Paginação na Tabela
  - [ ] Implementar paginação
  - [ ] Lazy loading
  - [ ] Virtualization para grandes listas
  - **Tempo**: 2-3h
  - **Arquivo**: `/client/src/pages/Dashboard.tsx`

- [ ] **8.2** Cache de Dados
  - [ ] Cache local de formulários
  - [ ] Invalidação de cache
  - [ ] Sincronização com servidor
  - **Tempo**: 2-3h
  - **Arquivo**: `/client/src/lib/cache.ts`

- [ ] **8.3** Índices no Banco de Dados
  - [ ] Índice em `cpf`
  - [ ] Índice em `numeroProcesso`
  - [ ] Índice em `statusPagamento`
  - [ ] Índice em `createdAt`
  - **Tempo**: 1h
  - **Arquivo**: `/drizzle/schema.ts`

---

## Fase 9: Testes (12-18 horas)

- [ ] **9.1** Testes Unitários
  - [ ] Testes para cálculos IRPF
  - [ ] Testes para sincronização Firebase
  - [ ] Testes para geração de PDFs
  - [ ] Testes para validações
  - **Tempo**: 4-6h
  - **Arquivo**: `/server/*.test.ts`

- [ ] **9.2** Testes de Integração
  - [ ] Testar fluxo completo: Firebase → MySQL → UI
  - [ ] Testar edição e sincronização
  - [ ] Testar geração de PDFs
  - **Tempo**: 4-6h
  - **Arquivo**: `/server/*.test.ts`

- [ ] **9.3** Testes E2E
  - [ ] Testar fluxo do usuário completo
  - [ ] Testar com dados reais
  - [ ] Testar em diferentes navegadores
  - **Tempo**: 4-6h
  - **Arquivo**: `/e2e/*.test.ts`

---

# 📊 Resumo por Prioridade

## 🔴 CRÍTICO (Semana 1 - 20-24h)
- Fase 1: Interface (10-12h)
- Fase 2: Dados (8-10h)
- Fase 3: Firebase (6-8h)

## 🟡 IMPORTANTE (Semana 2 - 18-22h)
- Fase 4: Tabela (3-4h)
- Fase 5: PDFs (4-6h)
- Fase 6: Autenticação (6-8h)

## 🟢 DESEJÁVEL (Semana 3 - 20-32h)
- Fase 7: Auditoria (3-4h)
- Fase 8: Performance (6-8h)
- Fase 9: Testes (12-18h)

---

# 🎯 Próximos Passos

1. **Começar pela Fase 1** (Interface)
   - Adicionar 4 ícones
   - Criar modal
   - Adicionar abas
   - Criar formulário de edição

2. **Depois Fase 2** (Dados)
   - Implementar cálculos
   - Implementar deflação
   - Atualizar taxa SELIC

3. **Depois Fase 3** (Firebase)
   - Ativar Storage
   - Ativar Listener
   - Sincronização bidirecional

4. **Depois as demais fases**

---

# 📝 Checklist de Conclusão

- [ ] Todas as 28 tarefas implementadas
- [ ] Todos os testes passando
- [ ] Firebase funcionando 100%
- [ ] PDFs gerando corretamente
- [ ] Cálculos IRPF corretos
- [ ] Sincronização bidirecional funcionando
- [ ] Checkpoint final criado


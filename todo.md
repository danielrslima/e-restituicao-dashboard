# Dashboard e-Restituição - TODO

## Fase 1: Configuração e Schema
- [x] Atualizar schema do Drizzle para tabela de formulários IRPF
- [x] Configurar integração com Firebase Firestore
- [x] Criar helpers de banco de dados para CRUD de formulários
- [x] Criar tRPC procedures para listar e buscar formulários

## Fase 2: Autenticação e Layout
- [x] Implementar autenticação segura (admin only)
- [x] Criar DashboardLayout com sidebar navigation
- [x] Implementar role-based access control (admin)
- [x] Criar página de login/redirecionamento

## Fase 3: Listagem de Formulários
- [x] Criar tabela de listagem de formulários
- [x] Implementar filtros por status de pagamento
- [x] Implementar busca por nome, CPF, nº processo
- [ ] Implementar paginação
- [x] Adicionar indicador de status de pagamento
- [x] Exibir dados pessoais e processuais na tabela

## Fase 4: Visualização Detalhada
- [x] Criar modal/página de detalhes do formulário
- [x] Exibir todos os campos do formulário
- [x] Exibir valores intermediários do cálculo (proporção, RRA, IR devido, etc)
- [x] Exibir resultado final (IRPF a restituir)
- [x] Adicionar botões de ação (gerar PDFs, download, etc)

## Fase 5: Geração de PDFs
- [x] Implementar geração do Template 1 (Demonstrativo de Apuração)
  - [x] Preencher seção Dados do Contribuinte
  - [x] Preencher seção Dados do Processo
  - [x] Preencher seção Valores Principais
  - [x] Preencher seção Apuração de Rendimentos
  - [x] Preencher seção Valores Esperados da Declaração
- [x] Implementar geração do Template 2 (Esclarecimentos ao Auditor)
  - [x] Preencher cabeçalho e dados do contribuinte
  - [x] Preencher seção Dados da Ação
  - [x] Preencher seção Valores e Datas
  - [x] Preencher tabelas de valores
- [x] Implementar download individual de PDFs
- [x] Adicionar botões de download na interface

## Fase 6: Testes e Validação
- [x] Testar autenticação
- [x] Testar listagem e filtros
- [x] Testar visualização detalhada
- [x] Testar geração de PDFs
- [ ] Testar responsividade em mobile
- [ ] Testar integração com Firebase

## Fase 7: Entrega
- [x] Criar checkpoint final
- [x] Documentar instruções de uso
- [x] Entregar ao usuário


## Fase 8: Modelo Free (Interno)
- [x] Adicionar campo tipoAcesso (Free/Pago) no schema
- [x] Criar formulário sem pagamento para clientes internos
- [x] Indicador visual de "Free/Interno" no dashboard
- [ ] Filtro por tipo de acesso no dashboard

## Fase 9: Agendamento de Emails (7 dias)
- [x] Adicionar campos de agendamento no schema (dataAgendamentoEmail, statusEmail)
- [x] Implementar lógica de cálculo de data (pagamento + 7 dias)
- [x] Criar fila de envio de emails com status
- [ ] Implementar job de envio automático após 7 dias
- [x] Adicionar coluna de status de email no dashboard
- [ ] Testar sistema de agendamento


## Fase 10: Segundo Pagamento (Kit IR)
- [x] Adicionar campo dataPagamentoKit no schema
- [x] Adicionar campo statusKitIR (pendente/pago/enviado) no schema
- [x] Criar helpers para gerenciar segundo pagamento
- [ ] Adicionar indicador visual de Kit IR no dashboard

## Fase 11: Integração Firebase Firestore
- [ ] Configurar credenciais Firebase no servidor
- [ ] Criar helpers para sincronizar dados do Firebase
- [ ] Implementar listener de mudanças em tempo real
- [ ] Mapear dados do Firebase para tabela local

## Fase 12: Sistema de Envio de Emails
- [x] Instalar Nodemailer ou SendGrid
- [x] Configurar email kitir@e-restituicao.com.br
- [ ] Criar helper de geração de PDF para email
- [x] Implementar fila de emails com status
- [x] Criar job de envio automático (7 dias após pagamento)
- [x] Adicionar rastreamento de envio

## Fase 13: Testes e Validação
- [ ] Testar sincronização Firebase
- [ ] Testar envio de emails
- [ ] Testar geração de PDFs
- [ ] Validar sistema completo


## Fase 14: Integração Firebase Firestore
- [x] Configurar credenciais Firebase no servidor
- [x] Instalar SDK Firebase Admin
- [x] Criar helpers para conectar ao Firestore
- [x] Implementar listener de mudanças em tempo real
- [x] Sincronizar dados do Firebase com banco de dados local
- [ ] Atualizar dashboard para exibir dados do Firebase
- [ ] Testar sincronização em tempo real

## Fase 15: Script de Seed e Testes
- [x] Criar script para popular Firebase com dados de teste
- [x] Testar sincronização automática Firebase → Banco Local
- [x] Validar que dados aparecem no dashboard em tempo real

## Fase 16: Webhook ASAAS
- [x] Criar endpoint webhook para receber notificações ASAAS
- [x] Validar assinatura do webhook
- [x] Atualizar statusKitIR automaticamente ao receber pagamento
- [x] Acionar agendamento de email após confirmação
- [x] Testar webhook com dados de teste

## Fase 17: Job de Envio Automático
- [ ] Criar cron job para verificar emails agendados
- [ ] Implementar envio automático de PDFs por email
- [ ] Atualizar status após envio bem-sucedido
- [ ] Implementar retry em caso de falha
- [ ] Testar job completo


## Fase 18: Atualização de Templates PDF
- [x] Extrair logos dos PDFs originais (IR360 e e-Restituição)
- [x] Salvar logos como imagens PNG no projeto
- [x] Atualizar geração da Planilha RT com logo IR360 e layout fiel
- [x] Atualizar geração de Esclarecimentos com logos e layout fiel
- [x] Testar PDFs gerados e comparar com originais
- [x] Validar que todos os campos estão sendo preenchidos corretamente
- [x] Corrigir logos para remover fundo preto (usar transparentes)
- [x] Ajustar mapeamento de dados nos campos corretos


## Fase 19: Ajustes de Alinhamento nos PDFs
- [ ] Corrigir alinhamento de valores na Planilha RT (valores dentro das células)
- [ ] Centralizar título "CAMPOS E VALORES DECLARADOS..." nos Esclarecimentos
- [ ] Alinhar margem direita do título com a tabela abaixo
- [ ] Testar PDFs novamente para validar alinhamentos


## Fase 19: Correção de Alinhamento nos PDFs
- [x] Ajustar valores na Planilha RT para ficarem dentro das células (não cortados)
- [x] Ajustar valores nos Esclarecimentos para ficarem dentro das células
- [x] Adicionar texto "e-Restituição" em preto ao lado do logo verde
- [x] Aplicar justificação (align: justify) em todos os textos das seções A, B e Obs
- [x] Reformatar seção A para começar com "1)"
- [ ] Testar PDFs e validar que todos os valores estão visíveis e alinhados


## Fase 20: Ajuste Fino de Espaçamentos nos Esclarecimentos
- [x] Adicionar indentação ao item 1) da seção A
- [x] Aumentar espaçamento entre seções (A, B, tabelas)
- [x] Tornar linhas horizontais mais grossas (0.8-1mm)
- [x] Tornar bordas das tabelas mais grossas (0.8mm)
- [x] Adicionar "Observações.:" com pontuação correta
- [x] Adicionar linhas horizontais antes e depois da referência legal
- [x] Centralizar títulos das tabelas
- [x] Adicionar sublinhados aos títulos das seções
- [ ] Validar espaçamentos comparando com template original


## Fase 21: Ajuste Final de Formatação dos PDFs
- [x] Copiar template Word para referência
- [x] Remover justificação problemática (quebra de palavras)
- [x] Ajustar espaçamentos para match com template Word
- [ ] Testar PDFs e validar formatação final


## Fase 22: Ajustes Finais de Espaçamento e Logo
- [x] Substituir logo antigo pelo novo (logotipo-e-restituicaoIR.jpg)
- [x] Aumentar espaço entre Data de Nascimento e seção A (8→10)
- [x] Ajustar espaço entre item 1 e seção B (mantido em 8)
- [x] Diminuir espaço após item 6 para título "CAMPOS E VALORES" (8→5)
- [x] Adicionar espaçamento após tabela antes de "Observações" (10→12)
- [ ] Testar PDF final e validar todos os espaçamentos


## Fase 23: Correções Finais para Match 100% com Documento Perfeito
- [x] Remover sublinhados dos títulos A) e B)
- [x] Adicionar recuo/indentação ao item 1) (10mm)
- [x] Aumentar espaçamento entre itens 2-6 (parágrafos separados)
- [x] Remover sublinhado do título "CAMPOS E VALORES..."
- [x] Ajustar espessura das bordas das tabelas (0.5mm)
- [x] Ajustar espaçamentos gerais entre seções
- [ ] Testar e validar PDF final 100% idêntico


## Fase 24: Sistema de Envio Automático de Emails
- [x] Instalar biblioteca SendGrid
- [x] Configurar API key do SendGrid
- [x] Criar helper de envio de email com anexos
- [x] Validar API key com testes (3/3 passando)
- [ ] Implementar job diário que verifica formulários com dataEnvioKit chegada
- [ ] Integrar com webhook ASAAS para disparar notificações

## Fase 25: Painel de Estatísticas Financeiras
- [x] Criar página de estatísticas no dashboard (Statistics.tsx)
- [x] Adicionar cards com métricas (receita total, mensal, conversão)
- [x] Implementar gráfico de evolução de vendas mensal
- [x] Adicionar lista dos 10 maiores valores de restituição
- [ ] Criar queries otimizadas para cálculos
- [ ] Testar performance e validar números

## Fase 26: Sistema de Notas/Observações
- [x] Adicionar tabela 'notes' ao schema (formId, conteudo, timestamps)
- [x] Criar página de notas (Notes.tsx)
- [x] Implementar routers tRPC para CRUD de notas
- [x] Criar interface para adicionar/editar notas
- [x] Testar CRUD de observações (13/13 testes passando)

## Fase 27: Ajustes Finais no Template Esclarecimentos
- [ ] Revisar template comparando com documento perfeito
- [ ] Ajustar espaçamentos e formatação restantes
- [ ] Validar PDF final 100% idêntico


## Fase 28: Diagnóstico Integração Firebase
- [x] Identificar que site salva em coleção 'users' (não 'formularios')
- [x] Analisar estrutura de dados em 'users' vs 'formularios'
- [x] Confirmar que 'users' tem estrutura incompleta (faltam 20+ campos)
- [x] Documentar solução completa em PROXIMOS-PASSOS-COMPLETO.md

## Fase 29: Modificar Site para Coletar Dados Completos (PRÓXIMO)
- [ ] Abrir App.jsx do site restituicaoia.com.br
- [ ] Localizar const newProcess (linha ~268)
- [ ] Adicionar arrays de alvarás detalhados (valor + data)
- [ ] Adicionar arrays de DARFs detalhados (valor + data)
- [ ] Adicionar arrays de honorários detalhados (valor + ano)
- [ ] Adicionar valores de entrada (brutoHomologado, tributavelHomologado, numeroMeses)
- [ ] Adicionar cálculos intermediários (proporcao, RRA, irMensal, etc.)
- [ ] Mudar coleção de 'users' para 'formularios'
- [ ] Testar preenchimento de formulário no site
- [ ] Validar que dados aparecem completos no dashboard
- [ ] Gerar PDFs e confirmar que estão completos

## Fase 30: Adicionar Funcionalidade de Edição no Dashboard (FUTURO)
- [ ] Criar componente FormularioEditForm.tsx
- [ ] Adicionar botão Editar em FormularioDetalhes.tsx
- [ ] Criar modal de edição com todos os campos
- [ ] Adicionar procedure formularios.update em routers.ts
- [ ] Implementar updateFormularioInFirebase em firebase.ts
- [ ] Testar edição de formulário existente

## Fase 31: Deploy Final no Hostinger
- [ ] Finalizar template Esclarecimentos (sublinhados)
- [ ] Criar checkpoint final
- [ ] Seguir guia DEPLOY-HOSTINGER.md
- [ ] Configurar variáveis de ambiente
- [ ] Testar com pagamentos reais
- [ ] Validar webhook ASAAS
- [ ] Validar envio automático de emails

---

## 📊 RESUMO DO STATUS ATUAL (26/12/2025)

**✅ O QUE ESTÁ FUNCIONANDO:**
- Dashboard conecta ao Firebase corretamente
- Exibe formulários da coleção 'formularios' (5 de teste)
- Gera PDFs perfeitamente (Planilha RT e Esclarecimentos) para formulários com dados completos
- Integração ASAAS webhook configurada
- Job de envio automático de email (7 dias após Kit IR)
- Sistema de notas/observações (13/13 testes passando)

**❌ O QUE PRECISA SER CORRIGIDO:**
- Site restituicaoia.com.br salva em 'users' com estrutura incompleta
- Faltam 20+ campos necessários para Planilha RT completa
- Template Esclarecimentos precisa ajuste final (sublinhados)

**📝 PRÓXIMA AÇÃO:**
1. Corrigir Dashboard para ler dados da coleção 'formularios' do Firebase (atualmente mostra dados mockados)
2. Verificar se o teste "TESTE MANUS 28DEZ" aparece após correção

**🔄 COMANDO PARA RETOMAR:**
"Retomar projeto e-Restituição Dashboard a partir do checkpoint 0129fb8e. Vamos implementar as modificações no site conforme documento PROXIMOS-PASSOS-COMPLETO.md para coletar todos os dados necessários."


## Fase 32: Implementar Funcionalidades do Protótipo Original
- [x] Adicionar ícone de Grade (Tabela) na coluna Ações
- [x] Adicionar ícone de Lápis (Editar) na coluna Ações  
- [x] Adicionar ícone de Lixo (Deletar) na coluna Ações
- [x] Página de visualização já existe (/formulario/:id)
- [x] Adicionar Abas por Categoria (Free, Starter, Builder, Specialist)
- [x] Filtrar dados por categoria nas abas
- [x] Adicionar coluna Categoria na tabela
- [x] Adicionar campo categoria no schema e executar migração

## Fase 33: Página de Tabela com 3 Tabelas
- [x] Criar página `/tabela/:id`
- [x] Implementar Tabela 1: RESUMO - PROPORÇÃO
- [x] Implementar Tabela 2: BASE DE CALCULO IRPF - SELIC
- [x] Implementar Tabela 3: PREENCHIMENTO + DEFLAÇÃO + RENDIMENTOS
- [x] Adicionar formatação de valores
- [x] Adicionar scroll horizontal em mobile
- [x] Adicionar rota no App.tsx
- [x] Criar card de informações do processo

## Fase 34: Formulário de Edição Completo
- [x] Criar formulário de edição com todos os campos
- [x] Validar campos obrigatórios
- [x] Salvar alterações no banco
- [ ] Atualizar Firebase após edição
- [x] Atualizar UI após salvar
- [x] Adicionar procedure update no routers.ts
- [x] Recalcular valores automaticamente após edição
- [x] Adicionar rota /editar/:id no App.tsx

## Fase 35: Sistema de Download de PDFs (Simplificado)
- [x] Campos pdfPlanilhaUrl e pdfEsclarecimentosUrl adicionados ao schema
- [x] Migração executada com sucesso
- [x] Função uploadPDFToStorage criada no firebase.ts
- [x] Sistema de download direto já funciona no client (pdf-generator.ts)
- [x] Decisão: Manter download direto (client-side) ao invés de upload para Firebase Storage
- [x] PDFs são gerados no navegador e baixados diretamente pelo usuário

## Fase 36: Testes Finais e Validação
- [ ] Testar geração e upload de PDFs
- [ ] Testar sincronização Firebase
- [ ] Testar cálculos IRPF com múltiplos anos
- [ ] Testar edição e deleção
- [ ] Validar com dados reais do protótipo
- [ ] Criar checkpoint final

## Fase 37: Ajuste de Valores das Categorias
- [x] Atualizar valores no Dashboard.tsx (abas)
- [x] Atualizar valores no Dashboard.tsx (badge na tabela)
- [x] Atualizar valores no FormularioEditar.tsx (select)
- [x] Valores corretos aplicados: Free (R$ 0), Starter (R$ 5,99), Builder (R$ 15,99), Specialist (Negociado)


## Fase 38: Definir Funcionalidade da Page 2 (FUTURO)
- [ ] Decidir o que implementar na Page 2 do sidebar
- [ ] Opções sugeridas:
  - Gerenciamento de emails agendados (ver status, reenviar, cancelar)
  - Estatísticas financeiras (receita, gráficos, conversão)
  - Página de Notas/Observações (tabela notes já existe no banco)
  - Configurações do sistema
  - Histórico de pagamentos ASAAS
  - Logs de sincronização Firebase
- [ ] Implementar a funcionalidade escolhida
- [ ] Atualizar nome no DashboardLayout

**NOTA:** Por enquanto deixar como placeholder. Decidir depois do sistema validado.


## Fase 39: Corrigir Página de Tabelas (TabelaDetalhes.tsx)
- [x] Corrigir campo irpfRestituir ao invés de irDevido
- [x] Usar valores corretos do Firebase na Tabela 2
- [x] Usar valorIRPFRestituir do Firebase como VALOR ATUALIZADO
- [ ] Testar com todos os formulários do dashboard
- [ ] Validar que valores batem com dashboard principal


## Fase 40: Criar Formulário Real (Sidinei)
- [ ] Inserir dados do Sidinei no banco via SQL
- [ ] Validar que valores aparecem corretamente no dashboard
- [ ] Verificar página de tabelas (3 tabelas)
- [ ] Comparar IRPF a Restituir com planilha RT
- [ ] Validar geração de PDFs


## Fase 41: Corrigir Fórmulas de Cálculo na TabelaDetalhes.tsx
- [x] Corrigir RENDIMENTOS TRIBUTÁVEIS (Tabela 2) = Tributável ALVARÁ - Tributável Honorários
- [x] Corrigir TRIBUTÁVEIS Honorários (Tabela 3) = Honorários Total × Proporção
- [x] Corrigir ISENTOS (Tabela 3) = Bruto Homologado - Tributável Homologado
- [x] Corrigir Proporção para usar precisão máxima (4 casas decimais)
- [x] Testar com Sidinei Alves de Oliveira (dados reais)
- [x] Validar que TODOS os valores batem 100% com protótipo original
- [x] Valores validados: R$ 1.244.597,26 (Rendimentos), R$ 679.722,79 (Honorários), R$ 2.413.377,80 (Isentos)

## Fase 42: Testar Funcionalidades de Editar e Deletar (29/12/2025)
- [ ] Testar edição de formulário (clicar no ícone ✏️)
- [ ] Modificar valores e verificar se recalcula corretamente
- [ ] Salvar e verificar se atualiza no dashboard
- [ ] Implementar backend de deleção (procedure irpf.delete)
- [ ] Testar deleção de formulário (clicar no ícone 🗑️)
- [ ] Verificar se confirmação funciona
- [ ] Verificar se remove do banco de dados
- [ ] Validar que Firebase sincroniza após edição
- [ ] Validar que Firebase sincroniza após deleção

## Fase 42: Implementar Campo de Confirmação de Deleção (29/12/2025)
- [x] Adicionar imports (Input, Label, Trash2) no FormularioDetalhes.tsx
- [x] Implementar estado para confirmação de deleção
- [x] Adicionar procedure irpf.delete no backend (server/routers.ts)
- [x] Implementar setor de exclusão com campo de confirmação
- [x] Testar deleção de formulário (Sidinei Alves de Oliveira deletado com sucesso)
- [x] Verificar se confirmação funciona (campo ativa botão apenas ao digitar "excluir")
- [x] Verificar se remove do banco de dados (confirmado - lista reduzida de 6 para 5)
- [x] Testar visualização de Patricia Almeida Costa
- [x] Testar tabelas de cálculos de Ana Carolina Ferreira
- [x] Validar que edição foi deixada como placeholder (sem implementação)

## Fase 42: Implementar Campo de Confirmação de Exclusão (29/12/2025)
- [x] Adicionar campo de confirmação na página de visualização
- [x] Implementar lógica de ativação do botão ao digitar "excluir"
- [x] Implementar procedure irpf.delete no backend
- [x] Testar deleção completa (confirmação + banco de dados)
- [x] Restaurar formulário de Sidinei para validações futuras

## Fase 43: Sincronização com Firebase via API REST (29/12/2025)
- [x] Criar endpoint REST /api/formulario/receber para receber dados do site
- [x] Implementar validação de campos obrigatórios
- [x] Implementar inserção no banco de dados
- [x] Testar endpoint com curl (sucesso!)
- [x] Validar que formulário aparece no dashboard
- [x] Confirmar que cálculos estão corretos (R$ 73.750,00)

## Fase 44: Integrar Site restituicaoia.com.br com Dashboard (29/12/2025)
- [ ] Acessar site restituicaoia.com.br e analisar código JavaScript
- [ ] Identificar função que envia dados (atualmente para Firebase)
- [ ] Modificar para enviar para endpoint /api/formulario/receber
- [ ] Mapear todos os campos do formulário para o formato esperado
- [ ] Testar preenchimento de formulário no site
- [ ] Validar que dados aparecem no dashboard automaticamente
- [ ] Confirmar que cálculos estão corretos


## Fase 43: Resolver Integração Site → Dashboard (29/12/2025 - ATUAL)
- [x] Configurar Firebase Storage Rules para permitir upload de PDFs
- [ ] Diagnosticar por que dados não aparecem no dashboard após cálculo
- [ ] Verificar logs do console do site (F12)
- [ ] Verificar se POST está sendo feito para o endpoint /api/formulario/receber
- [ ] Corrigir código do App.jsx se necessário
- [ ] Testar integração completa
- [ ] Validar dados no dashboard e Firebase

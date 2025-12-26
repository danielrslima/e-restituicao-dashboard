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
- [x] Analisar diferenças entre PDF gerado e documento perfeito
- [x] Corrigir espaçamentos entre itens da seção B (2-6) - adicionado espaço de 4mm
- [x] Verificar alinhamento de textos (nenhum justificado - todos à esquerda)
- [x] Ajustar bordas das tabelas (espessura 0.5mm)
- [x] Corrigir posicionamento de logos e rodapé
- [x] Código atualizado com todas as correções das tentativas anteriores
- [ ] Validar PDF gerado visualmente com documento perfeito

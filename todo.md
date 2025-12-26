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


## Fase 14: Integração Firebase Firestore (Em Progresso)
- [x] Configurar credenciais Firebase no servidor
- [x] Instalar SDK Firebase Admin
- [x] Criar helpers para conectar ao Firestore
- [x] Implementar listener de mudanças em tempo real
- [x] Sincronizar dados do Firebase com banco de dados local
- [ ] Atualizar dashboard para exibir dados do Firebase
- [ ] Testar sincronização em tempo real

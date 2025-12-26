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

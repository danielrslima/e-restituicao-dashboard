# ✅ CHECKLIST DE TRANSFERÊNCIA - e-Restituição

**Data:** 26/12/2025  
**Checkpoint:** d808fa64

---

## 📦 ARQUIVOS A TRANSFERIR

### Dashboard (Manus - e-restituicao-dashboard)

#### Código-Fonte Completo

- [x] `client/` - Frontend React
- [x] `server/` - Backend Express + tRPC
- [x] `drizzle/` - Schema e migrações
- [x] `shared/` - Constantes compartilhadas
- [x] `storage/` - Helpers S3
- [x] `package.json` - Dependências
- [x] `tsconfig.json` - Configuração TypeScript
- [x] `vite.config.ts` - Configuração Vite

#### Documentação

- [x] `todo.md` - Tarefas pendentes
- [x] `PROXIMOS-PASSOS-COMPLETO.md` - Guia de próximos passos
- [x] `DEPLOY-HOSTINGER.md` - Guia de deploy
- [x] `RETOMADA-PROJETO.md` - Status geral
- [x] `GUIA-MASTER-TRANSFERENCIA.md` - Este guia
- [x] `CHECKLIST-TRANSFERENCIA.md` - Este checklist

#### Arquivos Estáticos

- [x] `client/public/logotipo-e-restituicaoIR.jpg` - Logo e-Restituição
- [x] `client/public/ir360-logo.png` - Logo IR360

#### Testes

- [x] `server/auth.logout.test.ts` - Exemplo de teste
- [x] Configuração Vitest

### Site (Hostinger - restituicaoia.com.br)

#### Código-Fonte

- [ ] `static/js/App.jsx` - **ARQUIVO CRÍTICO** (precisa modificação)
- [ ] `static/js/firebase-config.js` - Configuração Firebase
- [ ] `static/js/index.js` - Entrada do app
- [ ] `static/js/main.eff037b6.js` - Build do app
- [ ] `static/css/` - Estilos
- [ ] `index.html` - HTML principal
- [ ] Configurações do servidor (`.htaccess`, `nginx.conf`, etc.)

#### Dados

- [ ] Backup do banco de dados local (se houver)
- [ ] Arquivos de upload (se houver)

---

## 🔐 CREDENCIAIS E CONFIGURAÇÕES

### Firebase

**Status:** ✅ Configurado

**O que transferir:**
- [ ] `firebase-credentials.json` (do servidor Manus)
- [ ] `firebase-config.js` (do site Hostinger)

**Checklist:**
- [ ] Projeto Firebase: `erestituicao-ffa5c`
- [ ] Coleção `formularios`: Contém 5 documentos de teste
- [ ] Coleção `users`: Contém 1 documento (estrutura incompleta)
- [ ] Firestore Rules: Configuradas para acesso público (REVISAR EM PRODUÇÃO)

### ASAAS (Pagamentos)

**Status:** ✅ Configurado

**O que transferir:**
- [ ] API Key ASAAS (em variáveis de ambiente)
- [ ] Webhook Secret ASAAS (em variáveis de ambiente)
- [ ] URL do webhook: `https://seu-dominio.com/api/webhooks/asaas`

**Checklist:**
- [ ] Conta ASAAS criada
- [ ] API key gerada
- [ ] Webhook configurado
- [ ] Testes de pagamento realizados

### SendGrid (Emails)

**Status:** ✅ Configurado

**O que transferir:**
- [ ] API Key SendGrid (em variáveis de ambiente)
- [ ] Email de origem: `kitir@e-restituicao.com.br`

**Checklist:**
- [ ] Conta SendGrid criada
- [ ] API key gerada
- [ ] Domínio verificado
- [ ] Template de email configurado

### Manus OAuth

**Status:** ✅ Configurado automaticamente

**O que transferir:**
- [ ] `VITE_APP_ID` (fornecido pelo Manus)
- [ ] `JWT_SECRET` (gerar novo)
- [ ] `OAUTH_SERVER_URL` (padrão: https://api.manus.im)

### Banco de Dados MySQL

**Status:** ✅ Configurado no Manus

**O que transferir:**
- [ ] `DATABASE_URL` (conexão MySQL)
- [ ] Schema das tabelas (em `drizzle/schema.ts`)

**Checklist:**
- [ ] Banco de dados criado
- [ ] Usuário com permissões criado
- [ ] Migrações executadas (`pnpm db:push`)

---

## 🚀 PASSOS DE TRANSFERÊNCIA

### 1. Preparar Novo Projeto Manus

- [ ] Criar nova conta ou usar conta existente
- [ ] Criar novo projeto
- [ ] Selecionar template: "Web App (tRPC + Manus Auth + Database)"
- [ ] Configurar nome: "e-restituicao-dashboard"

### 2. Clonar Código do Dashboard

- [ ] Clonar repositório do checkpoint d808fa64
- [ ] Ou fazer upload manual dos arquivos
- [ ] Instalar dependências: `npm install`

### 3. Configurar Variáveis de Ambiente

No Manus (Settings → Secrets), adicionar:

```
DATABASE_URL=mysql://...
JWT_SECRET=seu-novo-secret
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=seu-portal-url
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=seu-nome
SENDGRID_API_KEY=SG.xxxxx
ASAAS_API_KEY=sk_live_xxxxx
ASAAS_WEBHOOK_SECRET=xxxxx
VITE_ANALYTICS_ENDPOINT=seu-endpoint
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
VITE_APP_LOGO=/logotipo-e-restituicaoIR.jpg
VITE_APP_TITLE=e-Restituição Dashboard
```

- [ ] Todas as variáveis configuradas
- [ ] Servidor reiniciado

### 4. Configurar Firebase

- [ ] Criar novo projeto Firebase ou usar existente
- [ ] Copiar `firebase-credentials.json` para servidor Manus
- [ ] Atualizar `firebase-config.js` no site Hostinger
- [ ] Testar conexão

### 5. Transferir Site do Hostinger

- [ ] Acessar Hostinger via FTP/SSH
- [ ] Copiar pasta `/home/usuario/restituicaoia.com.br/` completa
- [ ] Ou fazer git clone se houver repositório
- [ ] Verificar que `App.jsx` está presente

### 6. Modificar Site (PRIORITÁRIO)

- [ ] Abrir `App.jsx` do site
- [ ] Seguir `PROXIMOS-PASSOS-COMPLETO.md`
- [ ] Fazer todas as modificações necessárias
- [ ] Testar localmente
- [ ] Fazer upload para Hostinger

### 7. Sincronizar Dados

- [ ] Executar `pnpm db:push` no dashboard
- [ ] Executar script de seed (se houver)
- [ ] Verificar que dados aparecem no dashboard

### 8. Testar Integrações

- [ ] Testar Firebase (sincronização em tempo real)
- [ ] Testar ASAAS (webhook de pagamento)
- [ ] Testar SendGrid (envio de emails)
- [ ] Testar geração de PDFs

### 9. Fazer Checkpoint

- [ ] Criar checkpoint no Manus
- [ ] Documentar versão
- [ ] Testar acesso ao checkpoint

### 10. Deploy em Produção

- [ ] Seguir `DEPLOY-HOSTINGER.md`
- [ ] Configurar domínio customizado
- [ ] Configurar SSL/TLS
- [ ] Testar com pagamentos reais

---

## 📊 DADOS A SINCRONIZAR

### Firebase → MySQL

**Coleção `formularios`:**
- [ ] 5 formulários de teste
- [ ] Todos os campos mapeados
- [ ] Status de sincronização verificado

**Coleção `users`:**
- [ ] 1 formulário (DANIEL LIMA)
- [ ] Estrutura incompleta (PRECISA CORREÇÃO)
- [ ] Será preenchido após modificar site

### Backup de Dados

- [ ] Backup do Firebase (exportar JSON)
- [ ] Backup do MySQL (mysqldump)
- [ ] Armazenar em local seguro

---

## 🧪 TESTES DE VALIDAÇÃO

### Testes Funcionais

- [ ] Dashboard carrega sem erros
- [ ] Listagem de formulários exibe dados corretos
- [ ] Visualização detalhada funciona
- [ ] Geração de Planilha RT funciona
- [ ] Geração de Esclarecimentos funciona
- [ ] Download de PDFs funciona
- [ ] Botão de edição funciona (se implementado)
- [ ] Sistema de notas funciona

### Testes de Integração

- [ ] Firebase sincroniza em tempo real
- [ ] Novo formulário no site aparece no dashboard
- [ ] Pagamento ASAAS atualiza status
- [ ] Email é agendado corretamente
- [ ] Email é enviado após 7 dias

### Testes de Performance

- [ ] Dashboard carrega em < 3 segundos
- [ ] PDF é gerado em < 5 segundos
- [ ] Sincronização Firebase é < 1 segundo
- [ ] Sem erros de memória ou CPU

### Testes de Segurança

- [ ] Apenas admin pode acessar dashboard
- [ ] Credenciais não estão expostas no código
- [ ] Firebase rules estão configuradas corretamente
- [ ] Webhook ASAAS valida assinatura
- [ ] Emails são enviados apenas para destinatário correto

---

## 📋 PRÓXIMOS PASSOS APÓS TRANSFERÊNCIA

### Fase 1: Modificar Site (IMEDIATO)

**Prioridade:** 🔴 CRÍTICA

- [ ] Modificar `App.jsx` conforme `PROXIMOS-PASSOS-COMPLETO.md`
- [ ] Testar preenchimento de novo formulário
- [ ] Validar que dados aparecem no dashboard
- [ ] Gerar PDFs e confirmar que estão completos

**Tempo estimado:** 2-3 horas

### Fase 2: Finalizar Template Esclarecimentos

**Prioridade:** 🟡 ALTA

- [ ] Validar sublinhados nos títulos
- [ ] Ajustar se necessário
- [ ] Testar PDF final

**Tempo estimado:** 1-2 horas

### Fase 3: Adicionar Edição no Dashboard

**Prioridade:** 🟢 MÉDIA

- [ ] Criar componente de edição
- [ ] Implementar procedure de atualização
- [ ] Testar edição de formulário

**Tempo estimado:** 4-6 horas

### Fase 4: Deploy em Produção

**Prioridade:** 🔴 CRÍTICA

- [ ] Seguir `DEPLOY-HOSTINGER.md`
- [ ] Configurar domínio customizado
- [ ] Testar com pagamentos reais
- [ ] Monitorar logs

**Tempo estimado:** 2-4 horas

---

## 🔍 VERIFICAÇÃO FINAL

Antes de considerar a transferência completa:

- [ ] Todos os arquivos foram copiados
- [ ] Todas as credenciais foram configuradas
- [ ] Banco de dados foi sincronizado
- [ ] Testes funcionais passaram
- [ ] Testes de integração passaram
- [ ] Testes de performance passaram
- [ ] Testes de segurança passaram
- [ ] Documentação foi atualizada
- [ ] Checkpoint foi criado
- [ ] Próximos passos foram planejados

---

## 📞 SUPORTE

Se encontrar problemas durante a transferência:

1. Consulte `GUIA-MASTER-TRANSFERENCIA.md`
2. Verifique `PROXIMOS-PASSOS-COMPLETO.md`
3. Consulte `DEPLOY-HOSTINGER.md`
4. Verifique logs do servidor
5. Teste cada componente isoladamente

---

**Autor:** Manus AI  
**Última Atualização:** 26/12/2025  
**Versão:** 1.0

Boa sorte com a transferência! 🚀

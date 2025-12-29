# 🚀 GUIA DE COMANDOS PARA MIGRAÇÃO ASSERTIVA

**Data:** 26/12/2025  
**Checkpoint Atual:** d808fa64  
**Versão:** 1.0

---

## 📋 RESUMO EXECUTIVO

Este guia fornece os **comandos exatos** para migrar o projeto e-Restituição Dashboard de forma segura e assertiva para outra conta/servidor.

---

## 🔄 FASE 1: PREPARAÇÃO (Na Conta Atual)

### 1.1 Criar Checkpoint Final

```bash
# Executar no dashboard Manus
# Ir para Management UI → Publish → Create Checkpoint

# Ou via CLI (se disponível)
manus checkpoint create --message "Migração: Pacote completo pronto para transferência"
```

**Resultado esperado:** Novo checkpoint criado com ID único

### 1.2 Exportar Dados do Firebase

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Fazer login
firebase login

# Exportar dados do projeto erestituicao-ffa5c
firebase firestore:export gs://erestituicao-ffa5c.appspot.com/backup-$(date +%Y%m%d-%H%M%S)

# Ou exportar para arquivo local
firebase firestore:export ./firebase-backup-$(date +%Y%m%d)
```

**Resultado esperado:** Backup do Firebase criado

### 1.3 Exportar Banco de Dados MySQL

```bash
# Se estiver usando Manus MySQL
# Conectar ao banco e fazer backup

# Comando geral (ajustar credenciais)
mysqldump -h localhost -u usuario -p database_name > backup-mysql-$(date +%Y%m%d).sql

# Ou via Manus UI
# Management UI → Database → Export
```

**Resultado esperado:** Backup do MySQL criado

### 1.4 Clonar Repositório

```bash
# Clonar o código do dashboard
git clone <seu-repositorio-manus> e-restituicao-dashboard-backup
cd e-restituicao-dashboard-backup

# Verificar checkpoint
git log --oneline | head -5
```

**Resultado esperado:** Código clonado com histórico completo

---

## 🔐 FASE 2: PREPARAR CREDENCIAIS (Na Conta Atual)

### 2.1 Exportar Variáveis de Ambiente

```bash
# No Manus, ir para Settings → Secrets
# Copiar TODAS as variáveis de ambiente

# Criar arquivo .env.backup com as credenciais
cat > .env.backup << 'EOF'
DATABASE_URL=mysql://...
JWT_SECRET=...
VITE_APP_ID=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...
OWNER_OPEN_ID=...
OWNER_NAME=...
SENDGRID_API_KEY=SG.xxxxx
ASAAS_API_KEY=sk_live_xxxxx
ASAAS_WEBHOOK_SECRET=xxxxx
VITE_ANALYTICS_ENDPOINT=...
VITE_ANALYTICS_WEBSITE_ID=...
VITE_APP_LOGO=/logotipo-e-restituicaoIR.jpg
VITE_APP_TITLE=e-Restituição Dashboard
EOF

# Guardar arquivo em local seguro (NÃO commitar)
chmod 600 .env.backup
```

**Resultado esperado:** Arquivo `.env.backup` criado com todas as credenciais

### 2.2 Exportar firebase-credentials.json

```bash
# Localizar arquivo no servidor Manus
find /home/ubuntu -name "firebase-credentials.json" 2>/dev/null

# Copiar para local seguro
cp /home/ubuntu/e-restituicao-dashboard/firebase-credentials.json ./firebase-credentials.backup.json

# Verificar conteúdo (não expor em público)
cat firebase-credentials.backup.json | head -5
```

**Resultado esperado:** `firebase-credentials.backup.json` criado

---

## 📦 FASE 3: TRANSFERÊNCIA PARA NOVA CONTA

### 3.1 Criar Novo Projeto Manus

```bash
# Acessar https://manus.im
# Criar nova conta ou usar conta existente
# Criar novo projeto com template: "Web App (tRPC + Manus Auth + Database)"

# Nome do projeto: e-restituicao-dashboard
# Descrição: Dashboard para gestão de cálculos de IRPF
```

**Resultado esperado:** Novo projeto criado em Manus

### 3.2 Clonar Código para Novo Projeto

```bash
# Opção A: Via Git (recomendado)
cd /home/ubuntu
git clone <seu-repositorio-backup> e-restituicao-dashboard-novo
cd e-restituicao-dashboard-novo

# Opção B: Via Upload Manual
# Fazer upload dos arquivos via Manus UI
# Management UI → Code → Upload Files
```

**Resultado esperado:** Código disponível no novo projeto

### 3.3 Instalar Dependências

```bash
# No diretório do novo projeto
cd /home/ubuntu/e-restituicao-dashboard-novo

# Instalar dependências
npm install
# ou
pnpm install
# ou
yarn install

# Verificar instalação
npm list | head -20
```

**Resultado esperado:** Todas as dependências instaladas sem erros

### 3.4 Configurar Variáveis de Ambiente

```bash
# No Manus, ir para Settings → Secrets
# Adicionar cada variável do arquivo .env.backup

# Via CLI (se disponível)
# Para cada linha em .env.backup:
manus secret set DATABASE_URL "mysql://..."
manus secret set JWT_SECRET "seu-novo-secret"
manus secret set VITE_APP_ID "seu-app-id"
# ... etc

# Ou adicionar manualmente na UI
```

**Resultado esperado:** Todas as variáveis configuradas

### 3.5 Copiar firebase-credentials.json

```bash
# Copiar arquivo para novo servidor
cp firebase-credentials.backup.json /home/ubuntu/e-restituicao-dashboard-novo/firebase-credentials.json

# Verificar permissões
ls -la /home/ubuntu/e-restituicao-dashboard-novo/firebase-credentials.json
```

**Resultado esperado:** Arquivo copiado com permissões corretas

---

## 🗄️ FASE 4: SINCRONIZAR BANCO DE DADOS

### 4.1 Executar Migrações Drizzle

```bash
# No novo projeto
cd /home/ubuntu/e-restituicao-dashboard-novo

# Gerar migrações
pnpm drizzle-kit generate

# Executar migrações
pnpm db:push

# Verificar status
pnpm db:check
```

**Resultado esperado:** Todas as tabelas criadas no MySQL

### 4.2 Restaurar Dados do Backup (Opcional)

```bash
# Se tiver backup MySQL anterior
mysql -h localhost -u usuario -p database_name < backup-mysql-20251226.sql

# Ou via Manus UI
# Management UI → Database → Import
```

**Resultado esperado:** Dados restaurados no MySQL

### 4.3 Sincronizar Firebase

```bash
# O dashboard sincroniza automaticamente ao iniciar
# Mas você pode forçar sincronização:

# Abrir arquivo server/firebase.ts
# Executar função de sincronização manual

# Ou via tRPC (se houver endpoint)
# curl http://localhost:3000/api/trpc/sync.firebaseSync
```

**Resultado esperado:** Dados sincronizados do Firebase

---

## 🧪 FASE 5: TESTES E VALIDAÇÃO

### 5.1 Iniciar Servidor de Desenvolvimento

```bash
# No novo projeto
cd /home/ubuntu/e-restituicao-dashboard-novo

# Iniciar servidor
pnpm dev

# Verificar logs
# Deve mostrar: "Server running on http://localhost:3000"
```

**Resultado esperado:** Servidor iniciando sem erros

### 5.2 Testar Autenticação

```bash
# Acessar http://localhost:3000
# Clicar em "Login"
# Fazer login com credenciais Manus
# Deve redirecionar para dashboard

# Verificar console para erros
```

**Resultado esperado:** Login funcionando, redirecionamento para dashboard

### 5.3 Testar Listagem de Formulários

```bash
# No dashboard, deve exibir formulários do Firebase
# Verificar que aparecem os 5+ formulários de teste

# Abrir console do navegador (F12)
# Verificar se há erros de conexão com Firebase
```

**Resultado esperado:** Formulários aparecem na listagem

### 5.4 Testar Geração de PDFs

```bash
# Clicar em um formulário
# Clicar em "Gerar PDF - Planilha RT"
# Verificar que PDF é gerado e baixado

# Clicar em "Gerar PDF - Esclarecimentos"
# Verificar que PDF é gerado e baixado

# Abrir PDFs e validar conteúdo
```

**Resultado esperado:** PDFs gerados corretamente

### 5.5 Testar Integração Firebase

```bash
# Adicionar novo documento no Firebase (via console)
# Verificar que aparece no dashboard em tempo real

# Ou preencher novo formulário no site
# Verificar que aparece no dashboard em < 10 segundos
```

**Resultado esperado:** Sincronização em tempo real funcionando

### 5.6 Executar Testes Automatizados

```bash
# No novo projeto
cd /home/ubuntu/e-restituicao-dashboard-novo

# Executar todos os testes
pnpm test

# Deve mostrar: "13/13 tests passed"
```

**Resultado esperado:** Todos os 13 testes passando

---

## 🚀 FASE 6: DEPLOY EM PRODUÇÃO

### 6.1 Criar Checkpoint Final

```bash
# No Manus, Management UI → Publish
# Clicar em "Create Checkpoint"
# Adicionar mensagem: "Migração completa: Dashboard funcional em nova conta"

# Verificar que checkpoint foi criado
```

**Resultado esperado:** Checkpoint criado com sucesso

### 6.2 Publicar Projeto

```bash
# No Manus, Management UI → Publish
# Clicar em "Publish"
# Selecionar checkpoint mais recente
# Clicar em "Deploy"

# Aguardar deploy completar (~2-5 minutos)
```

**Resultado esperado:** Projeto publicado em produção

### 6.3 Configurar Domínio Customizado

```bash
# No Manus, Management UI → Settings → Domains
# Adicionar domínio customizado (ex: dashboard.restituicaoia.com.br)
# Ou usar domínio auto-gerado (xxx.manus.space)

# Configurar DNS se usando domínio próprio
```

**Resultado esperado:** Domínio configurado e acessível

### 6.4 Testar em Produção

```bash
# Acessar https://seu-dominio.com
# Fazer login
# Testar listagem de formulários
# Testar geração de PDFs
# Testar sincronização Firebase

# Verificar logs de produção
```

**Resultado esperado:** Tudo funcionando em produção

---

## 🔧 FASE 7: MODIFICAR SITE (Hostinger)

### 7.1 Acessar Servidor Hostinger

```bash
# Via SSH
ssh usuario@restituicaoia.com.br

# Ou via FTP
ftp restituicaoia.com.br
# Usuário: usuario
# Senha: [sua-senha]
```

**Resultado esperado:** Conectado ao servidor Hostinger

### 7.2 Fazer Backup do Site

```bash
# Criar backup antes de modificar
cd /home/usuario/restituicaoia.com.br
tar -czf backup-site-$(date +%Y%m%d).tar.gz static/ index.html

# Verificar backup
ls -lh backup-site-*.tar.gz
```

**Resultado esperado:** Backup criado

### 7.3 Modificar App.jsx

```bash
# Abrir arquivo
nano static/js/App.jsx

# Localizar linha ~268: const newProcess = { ... }
# Substituir pela estrutura completa conforme PROXIMOS-PASSOS-COMPLETO.md

# Salvar arquivo (Ctrl+O, Enter, Ctrl+X)
```

**Resultado esperado:** App.jsx modificado com estrutura completa

### 7.4 Testar Modificações

```bash
# Preencher novo formulário no site
# Verificar no Firebase Console que dados foram salvos em 'formularios'
# Verificar que TODOS os campos aparecem (30+)

# Ir para dashboard
# Verificar que novo formulário aparece com todos os dados
# Gerar PDFs e validar que estão completos
```

**Resultado esperado:** Site coletando dados completos

---

## ✅ CHECKLIST DE MIGRAÇÃO ASSERTIVA

### Preparação
- [ ] Checkpoint final criado
- [ ] Firebase exportado
- [ ] MySQL exportado
- [ ] Repositório clonado
- [ ] Variáveis de ambiente exportadas
- [ ] firebase-credentials.json exportado

### Transferência
- [ ] Novo projeto Manus criado
- [ ] Código clonado para novo projeto
- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] firebase-credentials.json copiado

### Sincronização
- [ ] Migrações Drizzle executadas
- [ ] Dados MySQL restaurados
- [ ] Firebase sincronizado
- [ ] Banco de dados verificado

### Testes
- [ ] Servidor iniciando sem erros
- [ ] Autenticação funcionando
- [ ] Formulários aparecem na listagem
- [ ] PDFs gerando corretamente
- [ ] Firebase sincronizando em tempo real
- [ ] 13/13 testes passando

### Deploy
- [ ] Checkpoint final criado
- [ ] Projeto publicado em produção
- [ ] Domínio configurado
- [ ] Tudo funcionando em produção

### Site
- [ ] Backup do site criado
- [ ] App.jsx modificado
- [ ] Novo formulário testado
- [ ] Dados completos no Firebase
- [ ] PDFs gerados corretamente

---

## 🆘 TROUBLESHOOTING

### Erro: "Cannot connect to Firebase"

```bash
# Verificar firebase-credentials.json
cat firebase-credentials.json | grep project_id

# Verificar que arquivo está no diretório correto
ls -la firebase-credentials.json

# Reiniciar servidor
pnpm dev
```

### Erro: "Database connection failed"

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão MySQL
mysql -h localhost -u usuario -p -e "SELECT 1"

# Verificar migrações
pnpm db:check
```

### Erro: "VITE_APP_ID not found"

```bash
# Verificar variáveis de ambiente
env | grep VITE_

# Adicionar em Manus Settings → Secrets
# Reiniciar servidor
```

### Erro: "PDF generation failed"

```bash
# Verificar logs
tail -f /var/log/app.log

# Testar com formulário de teste
# Verificar que todos os campos estão preenchidos
```

---

## 📞 COMANDOS RÁPIDOS DE REFERÊNCIA

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Executar testes
pnpm test

# Executar migrações
pnpm db:push

# Verificar status do banco
pnpm db:check

# Gerar migrações
pnpm drizzle-kit generate

# Fazer build para produção
pnpm build

# Iniciar servidor de produção
pnpm start

# Limpar cache
pnpm clean

# Atualizar dependências
pnpm update
```

---

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

```
1. Fase 1: Preparação (30 min)
   └─ Criar checkpoint, exportar dados, clonar repositório

2. Fase 2: Credenciais (15 min)
   └─ Exportar variáveis de ambiente e firebase-credentials.json

3. Fase 3: Transferência (20 min)
   └─ Criar novo projeto, clonar código, instalar dependências

4. Fase 4: Sincronização (15 min)
   └─ Executar migrações, restaurar dados, sincronizar Firebase

5. Fase 5: Testes (30 min)
   └─ Testar autenticação, formulários, PDFs, Firebase

6. Fase 6: Deploy (30 min)
   └─ Criar checkpoint, publicar, configurar domínio

7. Fase 7: Site (1-2 horas)
   └─ Modificar App.jsx, testar, validar

TOTAL: ~3-4 horas
```

---

## 📊 VALIDAÇÃO FINAL

Após completar todas as fases, verificar:

| Item | Status | Comando para Verificar |
|------|--------|----------------------|
| Servidor rodando | ✅ | `curl http://localhost:3000` |
| Autenticação | ✅ | Fazer login no dashboard |
| Formulários | ✅ | Verificar listagem |
| Firebase | ✅ | Verificar sincronização |
| PDFs | ✅ | Gerar e abrir PDF |
| Testes | ✅ | `pnpm test` |
| Produção | ✅ | Acessar domínio |
| Site | ✅ | Preencher formulário |

---

**Autor:** Manus AI  
**Última Atualização:** 26/12/2025  
**Versão:** 1.0

Boa sorte com a migração! 🚀

# Deploy no Hostinger - e-Restituição Dashboard

## 📋 Pré-requisitos

1. **Conta Hostinger** com acesso a:
   - Node.js hosting
   - MySQL/TiDB database
   - Variáveis de ambiente

2. **Credenciais necessárias:**
   - Firebase Admin SDK (arquivo `firebase-credentials.json`)
   - SendGrid API Key
   - ASAAS Webhook Secret
   - JWT Secret

---

## 🚀 Passos para Deploy

### 1. Preparar o Projeto

```bash
# Fazer build do projeto
cd /home/ubuntu/e-restituicao-dashboard
pnpm install
pnpm build
```

### 2. Configurar Variáveis de Ambiente no Hostinger

Adicionar as seguintes variáveis no painel do Hostinger:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# JWT
JWT_SECRET=seu_jwt_secret_aqui

# Firebase
# Copiar conteúdo do firebase-credentials.json como string JSON

# SendGrid
SENDGRID_API_KEY=seu_sendgrid_api_key

# ASAAS
ASAAS_WEBHOOK_SECRET=seu_webhook_secret

# OAuth (Manus)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=seu_app_id

# Owner
OWNER_OPEN_ID=seu_open_id
OWNER_NAME=Seu Nome

# URLs
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_api_key
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_api_key
```

### 3. Upload dos Arquivos

**Opção A: Via FTP/SFTP**
```bash
# Fazer upload da pasta dist/ para o servidor
# Fazer upload do package.json
# Fazer upload do firebase-credentials.json
```

**Opção B: Via Git**
```bash
# Conectar repositório Git no Hostinger
# Push para branch main
git push hostinger main
```

### 4. Instalar Dependências no Servidor

```bash
# SSH no servidor Hostinger
ssh usuario@seu-servidor.hostinger.com

# Navegar para pasta do projeto
cd /home/usuario/public_html/dashboard

# Instalar dependências
npm install --production
```

### 5. Configurar Banco de Dados

```bash
# Executar migrations
npx drizzle-kit push:mysql
```

### 6. Iniciar Aplicação

```bash
# Iniciar servidor Node.js
npm start

# Ou usar PM2 para manter rodando
pm2 start server/_core/index.ts --name e-restituicao-dashboard
pm2 save
pm2 startup
```

---

## 🔧 Configurações Adicionais

### Webhook ASAAS

Configurar URL do webhook no painel ASAAS:
```
https://seu-dominio.com/api/webhook/asaas
```

### Cron Job para Envio de Emails

Adicionar no crontab do Hostinger:
```bash
# Executar diariamente às 9h
0 9 * * * cd /home/usuario/public_html/dashboard && node scripts/send-scheduled-emails.js
```

---

## ✅ Validação Pós-Deploy

1. **Testar Dashboard:**
   - Acessar https://seu-dominio.com/dashboard
   - Fazer login
   - Verificar se formulários aparecem

2. **Testar Geração de PDFs:**
   - Clicar em um formulário
   - Gerar Demonstrativo e Esclarecimentos
   - Validar que PDFs são gerados corretamente

3. **Testar Webhook:**
   - Fazer um pagamento teste no ASAAS
   - Verificar se status é atualizado no dashboard

4. **Testar Envio de Email:**
   - Aguardar 7 dias após pagamento Kit IR
   - Ou executar job manualmente para teste

---

## 🐛 Troubleshooting

### Erro: Firebase não conecta
- Verificar se `firebase-credentials.json` está no servidor
- Verificar permissões do arquivo
- Verificar se variáveis de ambiente estão corretas

### Erro: PDFs não geram
- Verificar se logos estão na pasta `client/public/`
- Verificar logs do servidor para erros de jsPDF

### Erro: Emails não enviam
- Verificar API key do SendGrid
- Verificar se domínio está verificado no SendGrid
- Verificar logs de erro

---

## 📞 Suporte

Para problemas técnicos:
- Email: financeiro@ir360.com.br
- Telefone: (11) 94113-9391

# 📦 GUIA MASTER DE TRANSFERÊNCIA - e-Restituição Dashboard

**Versão:** 1.0  
**Data:** 26/12/2025  
**Checkpoint Atual:** d808fa64  
**Créditos Utilizados:** ~1500 de 2000

---

## 🎯 O QUE É ESTE PROJETO?

O **e-Restituição Dashboard** é um sistema completo de gestão de cálculos de IRPF para restituição de impostos. O sistema funciona em três camadas integradas:

### Camada 1: Site de Coleta (restituicaoia.com.br)

O site público onde contribuintes preenchem um formulário com dados pessoais, processuais e financeiros. O site realiza cálculos complexos de IRPF e salva os dados no Firebase.

**Localização:** Hostinger (servidor compartilhado)  
**Tecnologia:** React + Firebase  
**Função:** Coletar dados → Calcular IRPF → Salvar no Firebase

### Camada 2: Dashboard de Gestão (Manus)

O painel administrativo que sincroniza dados do Firebase em tempo real, permite visualizar formulários, gerar PDFs, agendar emails e gerenciar pagamentos.

**Localização:** Manus (plataforma de hospedagem)  
**Tecnologia:** React + tRPC + Express + Firebase + MySQL  
**Função:** Sincronizar → Visualizar → Gerar PDFs → Agendar Emails

### Camada 3: Integrações Externas

Serviços terceirizados que automatizam processos:

- **Firebase Firestore:** Banco de dados em nuvem (sincronização em tempo real)
- **ASAAS:** Processamento de pagamentos (PIX, cartão, boleto)
- **SendGrid:** Envio automático de emails com PDFs anexados

---

## 📊 FLUXO COMPLETO DO SISTEMA

```
CONTRIBUINTE PREENCHE FORMULÁRIO
         ↓
   (restituicaoia.com.br)
         ↓
   CALCULA IRPF
         ↓
   SALVA NO FIREBASE (coleção: formularios)
         ↓
   DASHBOARD SINCRONIZA EM TEMPO REAL
         ↓
   CONTRIBUINTE PAGA (ASAAS)
         ↓
   WEBHOOK ASAAS ATUALIZA STATUS
         ↓
   AGENDAMENTO DE EMAIL (7 DIAS)
         ↓
   JOB AUTOMÁTICO ENVIA PDF + EMAIL
         ↓
   CONTRIBUINTE RECEBE DOCUMENTOS
```

---

## 🔧 ARQUITETURA TÉCNICA

### Banco de Dados Firebase

**Projeto:** `erestituicao-ffa5c`

**Coleções:**

| Coleção | Documentos | Função |
|---------|-----------|--------|
| `formularios` | 5+ | Formulários completos com todos os dados de cálculo |
| `users` | 1+ | Formulários do site (estrutura incompleta - PRECISA CORREÇÃO) |

**Estrutura de um Formulário Completo (formularios):**

```json
{
  "nomeCompleto": "João Pedro Oliveira",
  "cpf": "123.456.789-00",
  "dataNascimento": "15/05/1980",
  "email": "joao@example.com",
  "telefone": "(11) 98765-4321",
  "numeroProcesso": "0001234-56.2020.5.15.0001",
  "vara": "15ª Vara do Trabalho",
  "comarca": "São Paulo/SP",
  "fontePagadora": "Empresa XYZ LTDA",
  "cnpj": "12.345.678/0001-90",
  "brutoHomologado": 500000.00,
  "tributavelHomologado": 450000.00,
  "numeroMeses": 24,
  "alvaras": [
    { "valor": 150000.50, "data": "15/03/2020" },
    { "valor": 144601.13, "data": "20/06/2021" }
  ],
  "darfs": [
    { "valor": 10000.00, "data": "25/03/2020" },
    { "valor": 12059.73, "data": "30/06/2021" }
  ],
  "honorarios": [
    { "valor": 50000.00, "ano": 2020 },
    { "valor": 60000.00, "ano": 2021 }
  ],
  "proporcao": 0.85,
  "rendimentosTributavelAlvara": 250000.00,
  "rendimentosTributavelHonorarios": 51000.00,
  "baseCalculo": 301000.00,
  "rra": 12,
  "irMensal": 1500.00,
  "irDevido": 18000.00,
  "irpfRestituir": 32753.21,
  "tipoAcesso": "Builder",
  "statusPagamento": "pago",
  "statusKitIR": "pendente",
  "statusEmail": "pendente",
  "dataPagamento": "2025-12-19T02:35:02.856Z",
  "createdAt": "2025-12-19T02:35:02.856Z"
}
```

### Banco de Dados MySQL (Dashboard)

**Tabelas Principais:**

- `formularios` - Cópia local sincronizada do Firebase
- `notes` - Notas/observações sobre cada formulário
- `users` - Usuários administrativos (autenticação Manus OAuth)

### APIs e Webhooks

**ASAAS Webhook:** `POST /api/webhooks/asaas`

Recebe notificações de pagamento e atualiza status automaticamente.

**SendGrid:** Envio de emails com PDFs anexados

Agendado para 7 dias após confirmação do pagamento Kit IR.

---

## 📁 ESTRUTURA DE ARQUIVOS

### Site (Hostinger - restituicaoia.com.br)

```
/home/usuario/restituicaoia.com.br/
├── static/
│   ├── js/
│   │   ├── App.jsx                 ← ARQUIVO PRINCIPAL (precisa modificação)
│   │   ├── firebase-config.js      ← Configuração Firebase
│   │   ├── index.js
│   │   └── main.eff037b6.js
│   ├── css/
│   │   └── (estilos)
│   └── (outros arquivos estáticos)
├── index.html
└── (configurações do servidor)
```

**Arquivo Crítico:** `App.jsx` (linha ~268)

Este arquivo contém a lógica de coleta de dados e salvamento no Firebase. **PRECISA SER MODIFICADO** conforme documento `PROXIMOS-PASSOS-COMPLETO.md`.

### Dashboard (Manus - e-restituicao-dashboard)

```
/home/ubuntu/e-restituicao-dashboard/
├── client/                         ← Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx       ← Listagem de formulários
│   │   │   ├── FormularioDetalhes.tsx ← Visualização detalhada
│   │   │   ├── Statistics.tsx      ← Estatísticas
│   │   │   └── Notes.tsx           ← Notas/observações
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx ← Layout principal
│   │   │   └── (componentes UI)
│   │   ├── lib/
│   │   │   ├── trpc.ts            ← Cliente tRPC
│   │   │   └── pdf-generator.ts   ← Geração de PDFs
│   │   └── App.tsx
│   ├── public/
│   │   ├── logotipo-e-restituicaoIR.jpg
│   │   └── ir360-logo.png
│   └── index.html
├── server/                         ← Backend Express + tRPC
│   ├── routers.ts                 ← Procedures tRPC
│   ├── db.ts                      ← Helpers de banco de dados
│   ├── firebase.ts                ← Integração Firebase
│   ├── storage.ts                 ← Integração S3
│   ├── _core/
│   │   ├── context.ts             ← Contexto de autenticação
│   │   ├── env.ts                 ← Variáveis de ambiente
│   │   ├── llm.ts                 ← Integração com LLM
│   │   ├── notification.ts        ← Sistema de notificações
│   │   ├── voiceTranscription.ts  ← Transcrição de áudio
│   │   └── imageGeneration.ts     ← Geração de imagens
│   └── (outros arquivos)
├── drizzle/
│   └── schema.ts                  ← Schema do banco de dados
├── shared/
│   └── constants.ts               ← Constantes globais
├── firebase-credentials.json      ← CREDENCIAIS (CONFIDENCIAL)
├── todo.md                        ← Tarefas pendentes
├── PROXIMOS-PASSOS-COMPLETO.md   ← Guia de próximos passos
└── (outros arquivos)
```

---

## 🔐 CREDENCIAIS E CONFIGURAÇÕES

### Firebase

**Arquivo:** `firebase-credentials.json` (no servidor Manus)

```json
{
  "type": "service_account",
  "project_id": "erestituicao-ffa5c",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "firebase-adminsdk-...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

**Configuração no Site (firebase-config.js):**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDsUP7_nLQEY_I_dLR-g1btemk8vEyD6AU",
  authDomain: "erestituicao-ffa5c.firebaseapp.com",
  projectId: "erestituicao-ffa5c",
  storageBucket: "erestituicao-ffa5c.firebasestorage.app",
  messagingSenderId: "46142652690",
  appId: "1:46142652690:web:ec56e882b3d446d65933cb"
};
```

### ASAAS (Pagamentos)

**Webhook URL:** `https://seu-dominio.com/api/webhooks/asaas`

**Credenciais:** Armazenadas em variáveis de ambiente do Manus

```
ASAAS_API_KEY=sk_live_...
ASAAS_WEBHOOK_SECRET=...
```

### SendGrid (Emails)

**Credenciais:** Armazenadas em variáveis de ambiente do Manus

```
SENDGRID_API_KEY=SG.xxxxx...
SENDGRID_FROM_EMAIL=kitir@e-restituicao.com.br
```

### Manus OAuth

**Credenciais:** Configuradas automaticamente pelo Manus

```
VITE_APP_ID=...
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=...
JWT_SECRET=...
```

---

## 🚀 COMO TRANSFERIR PARA OUTRA CONTA

### Passo 1: Clonar o Código do Dashboard

```bash
# No Manus, criar novo projeto
# Selecionar template: Web App (tRPC + Manus Auth + Database)

# Depois, clonar o código do checkpoint atual
git clone <seu-repositorio>
cd e-restituicao-dashboard
```

### Passo 2: Configurar Variáveis de Ambiente

Adicionar no Manus (Settings → Secrets):

```
DATABASE_URL=mysql://user:pass@host/db
JWT_SECRET=seu-jwt-secret-aqui
VITE_APP_ID=seu-app-id-manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=seu-portal-url
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=seu-nome
SENDGRID_API_KEY=SG.xxxxx
VITE_ANALYTICS_ENDPOINT=seu-endpoint
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
VITE_APP_LOGO=/logotipo-e-restituicaoIR.jpg
VITE_APP_TITLE=e-Restituição Dashboard
```

### Passo 3: Configurar Firebase

1. Criar novo projeto Firebase (ou usar existente)
2. Copiar `firebase-credentials.json` para o servidor
3. Atualizar `firebase-config.js` no site

### Passo 4: Transferir Site do Hostinger

```bash
# Via FTP/SSH do Hostinger
# Copiar pasta /home/usuario/restituicaoia.com.br/ completa
# Ou fazer git clone do repositório do site
```

### Passo 5: Configurar Integrações

- **ASAAS:** Criar conta, gerar API key, configurar webhook
- **SendGrid:** Criar conta, gerar API key, verificar domínio de email

### Passo 6: Sincronizar Dados

```bash
# No dashboard, executar script de sincronização
npm run db:push
npm run seed  # Se houver dados de teste
```

---

## 📋 PRÓXIMOS PASSOS A COMPLETAR

### Fase 1: Modificar Site (PRIORITÁRIO)

**Arquivo:** `App.jsx` do site (linha ~268)

**O que fazer:** Seguir documento `PROXIMOS-PASSOS-COMPLETO.md`

**Resumo:**
1. Adicionar arrays de alvarás detalhados (valor + data)
2. Adicionar arrays de DARFs detalhados (valor + data)
3. Adicionar arrays de honorários detalhados (valor + ano)
4. Adicionar valores de entrada (brutoHomologado, tributavelHomologado, numeroMeses)
5. Adicionar cálculos intermediários (proporção, RRA, IR Mensal, etc.)
6. Mudar coleção de `'users'` para `'formularios'`

**Resultado esperado:** Novo formulário preenchido no site aparecerá no dashboard com TODOS os dados necessários para gerar PDFs completos.

### Fase 2: Finalizar Template Esclarecimentos

**Arquivo:** `client/src/lib/pdf-generator.ts`

**O que fazer:**
1. Validar que sublinhados nos títulos A), B) e "NA OPÇÃO DE TRIBUTAÇÃO" estão visíveis
2. Ajustar se necessário

**Resultado esperado:** PDF de Esclarecimentos 100% idêntico ao documento perfeito.

### Fase 3: Adicionar Edição no Dashboard (OPCIONAL)

**Arquivos a criar:**
- `client/src/components/FormularioEditForm.tsx`
- Procedure `formularios.update` em `server/routers.ts`

**O que fazer:** Permitir editar campos faltantes de formulários já existentes.

### Fase 4: Deploy no Hostinger

**Quando:** Após completar Fases 1-2

**Como:** Seguir documento `DEPLOY-HOSTINGER.md`

---

## 🔍 FÓRMULAS DE CÁLCULO DE IRPF

### Conceitos Principais

**Bruto Homologado:** Valor total da sentença de homologação

**Tributável Homologado:** Valor sujeito a tributação (após deduções legais)

**Alvarás:** Valores pagos ao longo do processo (tributáveis)

**DARFs:** Impostos já pagos (podem ser compensados)

**Honorários:** Valores pagos a advogados (tributáveis)

### Fórmula Simplificada

```
Base de Cálculo = (Tributável Homologado × Proporção) + Rendimentos Tributáveis

IR Devido = Base de Cálculo × Alíquota Progressiva

IRPF a Restituir = IR Devido - DARFs Pagos - IR Retido
```

**Nota:** As fórmulas completas estão implementadas no site `restituicaoia.com.br` e no arquivo `pdf-generator.ts` do dashboard.

---

## 📊 STATUS ATUAL DO PROJETO

### ✅ O QUE ESTÁ FUNCIONANDO

- Dashboard sincroniza Firebase em tempo real
- Exibe 5 formulários de teste com dados completos
- Gera PDFs perfeitamente (Planilha RT e Esclarecimentos)
- Integração ASAAS webhook configurada
- Job de envio automático de email (7 dias após Kit IR)
- Sistema de notas/observações (13/13 testes passando)
- Painel de estatísticas financeiras
- Autenticação segura (admin only)

### ❌ O QUE PRECISA SER CORRIGIDO

- Site salva em coleção `'users'` com estrutura incompleta
- Faltam 20+ campos necessários para Planilha RT completa
- Template Esclarecimentos precisa ajuste final (sublinhados)

### 📈 MÉTRICAS DE DESENVOLVIMENTO

| Métrica | Valor |
|---------|-------|
| Fases Completadas | 27 |
| Testes Passando | 13/13 |
| Créditos Utilizados | ~1500 |
| Checkpoint Atual | d808fa64 |
| Tempo Total | ~26 dias |

---

## 📞 SUPORTE E REFERÊNCIAS

### Documentos Importantes

1. **PROXIMOS-PASSOS-COMPLETO.md** - Guia detalhado de modificações no site
2. **DEPLOY-HOSTINGER.md** - Guia de deploy em produção
3. **RETOMADA-PROJETO.md** - Status geral do projeto
4. **todo.md** - Lista de tarefas pendentes

### Tecnologias Utilizadas

- **Frontend:** React 19, Tailwind CSS 4, shadcn/ui
- **Backend:** Express 4, tRPC 11, Node.js
- **Banco de Dados:** MySQL, Firebase Firestore
- **Pagamentos:** ASAAS
- **Emails:** SendGrid
- **PDF:** jsPDF
- **Autenticação:** Manus OAuth

### Contatos Importantes

- **Firebase Console:** https://console.firebase.google.com/
- **ASAAS Dashboard:** https://app.asaas.com/
- **SendGrid Dashboard:** https://app.sendgrid.com/
- **Manus Dashboard:** https://manus.im/

---

## 🎓 COMO CONTINUAR DESENVOLVENDO

### Para Modificar o Site

1. Acessar Hostinger via FTP/SSH
2. Editar `App.jsx` conforme `PROXIMOS-PASSOS-COMPLETO.md`
3. Testar localmente
4. Fazer upload para Hostinger
5. Testar em produção

### Para Modificar o Dashboard

1. Clonar o repositório
2. Instalar dependências: `npm install`
3. Iniciar servidor de desenvolvimento: `npm run dev`
4. Fazer alterações
5. Testar localmente
6. Fazer commit e push
7. Criar checkpoint no Manus
8. Publicar

### Para Adicionar Novas Funcionalidades

1. Atualizar schema em `drizzle/schema.ts`
2. Executar `pnpm db:push`
3. Adicionar helpers em `server/db.ts`
4. Adicionar procedures em `server/routers.ts`
5. Criar UI em `client/src/pages/`
6. Escrever testes em `server/*.test.ts`
7. Executar `pnpm test`

---

## ⚠️ AVISOS IMPORTANTES

1. **Credenciais:** Nunca commitar `firebase-credentials.json` ou variáveis de ambiente no Git
2. **Backup:** Fazer backup regular do Firebase e banco de dados MySQL
3. **Testes:** Sempre testar em ambiente de desenvolvimento antes de produção
4. **Documentação:** Manter documentação atualizada conforme mudanças
5. **Créditos Manus:** Monitorar uso de créditos para não exceder limite

---

**Autor:** Manus AI  
**Última Atualização:** 26/12/2025  
**Versão:** 1.0

Para dúvidas ou problemas, consulte os documentos de referência listados acima.

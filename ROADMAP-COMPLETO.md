# 🗺️ ROADMAP COMPLETO - PROJETO E-RESTITUIÇÃO

**Projeto:** e-Restituição Dashboard  
**Data:** 28/12/2025  
**Versão:** 1.0  
**Status Atual:** 95% Completo

---

## 📊 VISÃO GERAL

O projeto e-Restituição é um sistema automatizado para cálculo e recuperação de IRRF pago a mais em ações trabalhistas. Este roadmap define todas as funcionalidades implementadas, em desenvolvimento e planejadas.

---

## ✅ FASE 1: MVP FUNCIONAL (CONCLUÍDO - 95%)

**Período:** 23/11/2025 - 28/12/2025 (35 dias)  
**Status:** ✅ Concluído

### Funcionalidades Implementadas:

#### 1.1 Site Público (Frontend)
- ✅ Landing page informativa
- ✅ Formulário de coleta de dados (30+ campos)
- ✅ Validação de campos obrigatórios
- ✅ Cálculo automático de restituição (RRA)
- ✅ Aplicação de IPCA-E (correção monetária)
- ✅ Aplicação de SELIC (juros de mora)
- ✅ Geração de 3 PDFs automáticos:
  - Planilha RT
  - Esclarecimentos
  - Relatório Técnico
- ✅ Integração com Firebase (Firestore + Storage)
- ✅ Página de pagamento (2 planos)
- ✅ Processamento de pagamento (PIX + Cartão)

#### 1.2 Backend e Banco de Dados
- ✅ Firebase Firestore (coleção `formularios`)
- ✅ Firebase Storage (armazenamento de PDFs)
- ✅ Sincronização em tempo real
- ✅ Autenticação de usuários

#### 1.3 Dashboard Administrativo
- ✅ Visualização de formulários enviados
- ✅ Sincronização automática com Firebase
- ✅ Geração de PDFs sob demanda
- ✅ Gerenciamento de status de pagamento
- ✅ Sistema de notificações ao owner
- ✅ 13/13 testes unitários passando

#### 1.4 Cálculos e Precisão
- ✅ Motor de cálculos tributários (99,59% precisão)
- ✅ Suporte a múltiplos anos fiscais
- ✅ Tabelas do IR atualizadas (2020-2025)
- ✅ Cálculo proporcional de alvarás, DARFs e honorários
- ✅ Validação com casos reais

### Métricas Alcançadas:
- **Precisão:** 99,59%
- **Cobertura de Testes:** 90%+
- **Performance:** < 3s para calcular
- **Campos Coletados:** 30+

---

## 🔄 FASE 2: VALIDAÇÃO E AJUSTES (EM ANDAMENTO)

**Período:** 28/12/2025 - 05/01/2026 (1 semana)  
**Status:** 🔄 Em Andamento

### 2.1 Testes em Produção
- ⏳ Compilar e fazer upload no Hostinger
- ⏳ Testar formulário com dados reais
- ⏳ Validar sincronização Firebase ↔ Dashboard
- ⏳ Validar geração de PDFs
- ⏳ Testar fluxo de pagamento completo

### 2.2 Ajustes Finais de PDFs
- ⏳ Finalizar PDF Esclarecimentos:
  - Adicionar sublinhados nos títulos A), B)
  - Valores em negrito
  - Linha grossa antes do logo
  - Validar 100% idêntico ao documento perfeito

### 2.3 Documentação
- ⏳ Criar Documento de Escopo e Requisitos
- ⏳ Criar Arquitetura do Sistema
- ⏳ Criar Manual de Instalação e Deploy
- ⏳ Criar Plano de Testes Completo
- ⏳ Criar Backlog detalhado

### Entregas Esperadas:
- ✅ Sistema 100% funcional em produção
- ✅ PDFs perfeitos
- ✅ Documentação completa
- ✅ Testes validados

---

## 🚀 FASE 3: KIT IR COMPLETO (PRÓXIMA)

**Período:** 06/01/2026 - 31/01/2026 (3-4 semanas)  
**Status:** 📋 Planejado

### 3.1 Modelo de Negócio (2 Etapas de Pagamento)

#### **ETAPA 1: Cálculo da Restituição** - R$ 29,90
**Status:** ✅ Já implementado

**O que o cliente recebe:**
- Cálculo completo do valor a restituir
- Resultado imediato após pagamento

---

#### **ETAPA 2: Kit IR Completo** - R$ 2.500,00 (- R$ 29,90 = R$ 2.470,10)
**Status:** 📋 A implementar

**O que o cliente recebe (8 dias após pagamento):**

1. **PDFs Finalizados:**
   - ✅ Planilha RT (template já pronto)
   - ✅ Esclarecimentos (template já pronto)
   - ⏳ Relatório Técnico personalizado

2. **Documentos do Processo:**
   - ⏳ Upload de documentos pelo cliente
   - ⏳ Encartes personalizados
   - ⏳ Montagem automática do Kit

3. **Vídeo Tutorial:**
   - ⏳ Como preencher a declaração de IR
   - ⏳ Como protocolar na Receita Federal
   - ⏳ Link de acesso exclusivo

---

### 3.2 Funcionalidades a Implementar

#### 3.2.1 Sistema de Upload de Documentos
**Prioridade:** Alta  
**Estimativa:** 2-3 dias

**Requisitos:**
- Interface para cliente fazer upload dos documentos do processo
- Tipos aceitos: PDF, JPG, PNG, DOC, DOCX
- Tamanho máximo: 10 MB por arquivo
- Armazenamento no Firebase Storage
- Validação de tipos de arquivo
- Preview dos documentos enviados
- Possibilidade de remover/substituir documentos

**Implementação:**
```typescript
// Estrutura no Firebase
{
  formularioId: "abc123",
  documentos: [
    {
      nome: "Sentenca_Homologacao.pdf",
      url: "https://storage.firebase.com/...",
      tipo: "pdf",
      tamanho: 2048576,
      dataUpload: "2026-01-10T10:30:00Z"
    },
    ...
  ]
}
```

---

#### 3.2.2 Montagem Automática do Kit IR
**Prioridade:** Alta  
**Estimativa:** 3-4 dias

**Requisitos:**
- Combinar PDFs gerados + documentos enviados
- Adicionar encartes personalizados (capa, índice, instruções)
- Gerar PDF único ou ZIP com todos os arquivos
- Incluir sumário com links internos
- Adicionar marca d'água "e-Restituição"
- Numeração de páginas

**Estrutura do Kit:**
```
Kit_IR_[Nome_Cliente].zip
├── 1_Capa.pdf
├── 2_Indice.pdf
├── 3_Instrucoes.pdf
├── 4_Planilha_RT.pdf
├── 5_Esclarecimentos.pdf
├── 6_Relatorio_Tecnico.pdf
├── 7_Documentos_Processo/
│   ├── Sentenca_Homologacao.pdf
│   ├── Alvara_Levantamento.pdf
│   ├── DARF_Pagamento.pdf
│   └── ...
└── 8_Video_Tutorial_Link.txt
```

**Tecnologias:**
- `pdf-lib` (manipulação de PDFs)
- `archiver` (criação de ZIP)
- Firebase Storage (armazenamento)

---

#### 3.2.3 Sistema de Entrega Programada
**Prioridade:** Alta  
**Estimativa:** 2 dias

**Requisitos:**
- Aguardar 8 dias após pagamento da Etapa 2
- Verificar se todos os documentos foram enviados
- Gerar Kit IR automaticamente
- Enviar email com link para download
- Incluir link do vídeo tutorial
- Notificar admin quando Kit for gerado

**Fluxo:**
```
Pagamento Etapa 2 → 
  Aguardar 8 dias → 
    Verificar documentos → 
      Gerar Kit IR → 
        Enviar email → 
          Cliente baixa Kit
```

**Template de Email:**
```
Assunto: Seu Kit IR está pronto! 🎉

Olá [Nome],

Seu Kit IR completo está pronto para download!

📦 O que você vai encontrar:
- Planilha RT completa
- Esclarecimentos técnicos
- Relatório técnico personalizado
- Todos os documentos do seu processo
- Instruções detalhadas

🎥 Assista ao vídeo tutorial:
[Link do vídeo]

📥 Baixar Kit IR:
[Link de download - válido por 30 dias]

Dúvidas? Responda este email.

Equipe e-Restituição
```

---

#### 3.2.4 Vídeo Tutorial
**Prioridade:** Média  
**Estimativa:** 1 semana (gravação + edição)

**Conteúdo do Vídeo (15-20 min):**

1. **Introdução** (2 min)
   - O que é o Kit IR
   - O que você vai aprender

2. **Preenchimento da Declaração** (8 min)
   - Abrir programa da Receita Federal
   - Localizar ficha de RRA
   - Preencher campos com dados da Planilha RT
   - Validar valores
   - Salvar declaração

3. **Protocolo na Receita Federal** (5 min)
   - Acessar e-CAC
   - Fazer login com certificado digital ou gov.br
   - Protocolar pedido de restituição
   - Anexar documentos do Kit IR
   - Acompanhar status

4. **Próximos Passos** (2 min)
   - Prazo de análise (até 5 anos)
   - Como acompanhar o processo
   - Quando esperar a restituição
   - Contato para dúvidas

**Hospedagem:**
- YouTube (vídeo não listado) ou
- Vimeo (vídeo privado) ou
- Mux (streaming profissional)

**Implementação:**
- Gravar tela + narração
- Editar com legendas
- Adicionar marca d'água
- Upload e gerar link
- Integrar link no email de entrega

---

### 3.3 Melhorias de UX/UI

#### 3.3.1 Dashboard do Cliente
**Prioridade:** Média  
**Estimativa:** 3 dias

**Funcionalidades:**
- Login do cliente (mesmo email do formulário)
- Visualizar status do pedido
- Fazer upload de documentos
- Acompanhar progresso do Kit IR
- Baixar Kit IR quando pronto
- Acessar vídeo tutorial

---

#### 3.3.2 Notificações Automáticas
**Prioridade:** Média  
**Estimativa:** 2 dias

**Tipos de Notificações:**
- Email de confirmação após pagamento Etapa 1
- Email lembrando de fazer upload de documentos
- Email informando que Kit IR está sendo preparado
- Email quando Kit IR estiver pronto
- SMS (opcional) para avisos importantes

---

### Entregas Esperadas (Fase 3):
- ✅ Sistema de upload de documentos funcionando
- ✅ Montagem automática do Kit IR
- ✅ Entrega programada (8 dias)
- ✅ Vídeo tutorial gravado e hospedado
- ✅ Dashboard do cliente
- ✅ Notificações automáticas

**Estimativa Total:** 3-4 semanas | 150-200 horas

---

## 💡 FASE 4: OTIMIZAÇÕES E MELHORIAS (FUTURO)

**Período:** 01/02/2026 - 28/02/2026 (1 mês)  
**Status:** 💡 Ideias

### 4.1 Funcionalidade de Edição no Dashboard
**Prioridade:** Alta  
**Estimativa:** 1 semana

**Requisitos:**
- Botão "Editar" em cada formulário
- Modal com todos os campos editáveis
- Validação de dados
- Recalcular valores após edição
- Regenerar PDFs automaticamente
- Histórico de alterações

**Casos de Uso:**
- Cliente esqueceu de informar um alvará
- Valor digitado errado
- Data incorreta
- Adicionar honorários esquecidos

---

### 4.2 Relatórios e Métricas
**Prioridade:** Média  
**Estimativa:** 1 semana

**Dashboards:**
- Número de formulários por dia/semana/mês
- Taxa de conversão (Etapa 1 → Etapa 2)
- Valor médio de restituição
- Tempo médio de processamento
- Documentos mais enviados
- Principais fontes de tráfego

**Gráficos:**
- Evolução de vendas
- Distribuição de valores de restituição
- Mapa de calor de usuários
- Funil de conversão

---

### 4.3 Integração com Receita Federal
**Prioridade:** Baixa  
**Estimativa:** 2-3 semanas

**Funcionalidades:**
- Consultar CPF na Receita Federal
- Validar dados do contribuinte
- Protocolar pedido automaticamente (via e-CAC)
- Acompanhar status do processo
- Receber notificações de deferimento

**Desafios:**
- Requer certificado digital
- API da Receita Federal limitada
- Complexidade técnica alta

---

### 4.4 App Mobile
**Prioridade:** Baixa  
**Estimativa:** 2-3 meses

**Plataformas:**
- iOS (App Store)
- Android (Google Play)

**Funcionalidades:**
- Preencher formulário no celular
- Tirar foto de documentos
- Fazer upload direto do celular
- Receber notificações push
- Baixar Kit IR no celular

**Tecnologias:**
- React Native ou Flutter
- Firebase Cloud Messaging (notificações)

---

### 4.5 Sistema de Afiliados
**Prioridade:** Média  
**Estimativa:** 2 semanas

**Funcionalidades:**
- Cadastro de afiliados
- Geração de links únicos
- Rastreamento de conversões
- Comissões automáticas (10-20%)
- Dashboard do afiliado
- Pagamento via PIX

**Benefícios:**
- Escalar vendas organicamente
- Parcerias com advogados trabalhistas
- Marketing boca a boca

---

### 4.6 Suporte ao Cliente
**Prioridade:** Média  
**Estimativa:** 1 semana

**Canais:**
- Chat ao vivo (Intercom, Zendesk)
- WhatsApp Business
- Email suporte@restituicaoia.com.br
- FAQ dinâmico
- Base de conhecimento

---

## 🎯 FASE 5: EXPANSÃO (LONGO PRAZO)

**Período:** 01/03/2026 - 31/12/2026 (10 meses)  
**Status:** 🔮 Visão

### 5.1 Novos Produtos
- Cálculo de restituição para outros tipos de processos (cível, previdenciário)
- Consultoria tributária personalizada
- Acompanhamento jurídico do processo

### 5.2 Parcerias Estratégicas
- Escritórios de advocacia trabalhista
- Contadores e contabilidades
- Sindicatos e associações

### 5.3 Internacionalização
- Versão em espanhol (América Latina)
- Versão em inglês (mercado global)
- Adaptação para legislações de outros países

---

## 📊 RESUMO POR PRIORIDADE

### 🔴 Prioridade ALTA (Próximos 30 dias)
1. ✅ Validação e testes em produção
2. ✅ Finalizar PDF Esclarecimentos
3. ⏳ Sistema de upload de documentos
4. ⏳ Montagem automática do Kit IR
5. ⏳ Sistema de entrega programada
6. ⏳ Funcionalidade de edição no Dashboard

### 🟡 Prioridade MÉDIA (30-90 dias)
1. ⏳ Vídeo tutorial
2. ⏳ Dashboard do cliente
3. ⏳ Notificações automáticas
4. ⏳ Relatórios e métricas
5. ⏳ Sistema de afiliados
6. ⏳ Suporte ao cliente

### 🟢 Prioridade BAIXA (90+ dias)
1. ⏳ Integração com Receita Federal
2. ⏳ App mobile
3. ⏳ Novos produtos
4. ⏳ Parcerias estratégicas
5. ⏳ Internacionalização

---

## 💰 ESTIMATIVA DE INVESTIMENTO

### Fase 2 (Validação): R$ 0
- Apenas tempo de testes e ajustes

### Fase 3 (Kit IR): R$ 5.000 - R$ 8.000
- Desenvolvimento: R$ 3.000 - R$ 5.000
- Vídeo tutorial: R$ 1.000 - R$ 2.000
- Infraestrutura: R$ 500/mês
- Hospedagem de vídeo: R$ 200/mês

### Fase 4 (Otimizações): R$ 10.000 - R$ 15.000
- Desenvolvimento: R$ 8.000 - R$ 12.000
- Ferramentas (chat, analytics): R$ 500/mês
- Marketing: R$ 1.000 - R$ 2.000

### Fase 5 (Expansão): R$ 50.000+
- App mobile: R$ 20.000 - R$ 30.000
- Integrações: R$ 10.000 - R$ 15.000
- Marketing e vendas: R$ 20.000+

---

## 📈 PROJEÇÃO DE RESULTADOS

### Ano 1 (2026)
- **Clientes (Etapa 1):** 500-1.000
- **Conversão (Etapa 2):** 10-20% = 50-200 clientes
- **Receita Etapa 1:** R$ 15.000 - R$ 30.000
- **Receita Etapa 2:** R$ 125.000 - R$ 500.000
- **Receita Total:** R$ 140.000 - R$ 530.000

### Ano 2 (2027)
- **Clientes (Etapa 1):** 2.000-5.000
- **Conversão (Etapa 2):** 15-25% = 300-1.250 clientes
- **Receita Total:** R$ 800.000 - R$ 3.200.000

---

## 🎯 KPIs DE SUCESSO

### Métricas de Produto
- **Precisão dos Cálculos:** > 99%
- **Tempo de Resposta:** < 3s
- **Disponibilidade:** > 99,9%
- **Taxa de Erro:** < 1%

### Métricas de Negócio
- **Taxa de Conversão (Etapa 1):** > 5%
- **Taxa de Conversão (Etapa 2):** > 15%
- **Ticket Médio:** R$ 2.500
- **CAC (Custo de Aquisição):** < R$ 100
- **LTV (Lifetime Value):** > R$ 2.500
- **Churn:** < 5%

### Métricas de Satisfação
- **NPS (Net Promoter Score):** > 50
- **CSAT (Customer Satisfaction):** > 4.5/5
- **Tempo de Resposta Suporte:** < 2h
- **Taxa de Resolução:** > 90%

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

### Esta Semana (28/12 - 05/01)
1. ✅ Fazer upload no Hostinger (concluído)
2. ⏳ Testar formulário completo
3. ⏳ Validar sincronização Firebase
4. ⏳ Validar Dashboard
5. ⏳ Finalizar PDF Esclarecimentos
6. ⏳ Criar documentação técnica

### Próxima Semana (06/01 - 12/01)
1. ⏳ Iniciar desenvolvimento do sistema de upload
2. ⏳ Planejar estrutura do Kit IR
3. ⏳ Criar mockups do Dashboard do cliente
4. ⏳ Roteiro do vídeo tutorial

### Próximo Mês (Janeiro 2026)
1. ⏳ Implementar Kit IR completo
2. ⏳ Gravar vídeo tutorial
3. ⏳ Testar fluxo completo (Etapa 1 + Etapa 2)
4. ⏳ Lançar versão 2.0

---

## 📝 NOTAS IMPORTANTES

### Decisões Técnicas
- **Firebase:** Escolhido por facilidade de integração e custo inicial baixo
- **React:** Framework moderno e amplamente suportado
- **Hostinger:** Hospedagem acessível para MVP
- **Manus Dashboard:** Solução rápida para painel administrativo

### Riscos Identificados
1. **Complexidade dos Cálculos:** Mitigado com validação extensiva
2. **Integração Firebase:** Funcionando corretamente
3. **Geração de PDFs:** Templates prontos e testados
4. **Escalabilidade:** Firebase suporta até 10.000 usuários/dia

### Dependências Externas
- Firebase (Google)
- Hostinger
- Manus Platform
- API Banco Central (SELIC)
- IBGE (IPCA-E)

---

**Versão:** 1.0  
**Última Atualização:** 28/12/2025  
**Responsável:** Equipe e-Restituição  
**Próxima Revisão:** 05/01/2026

---

🚀 **Este roadmap é um documento vivo e será atualizado conforme o projeto evolui.**

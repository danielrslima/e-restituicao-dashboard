# Webhook ASAAS - Documentação

## 📋 Visão Geral

O webhook ASAAS permite que o sistema receba notificações automáticas quando um pagamento é confirmado. Isso elimina a necessidade de atualização manual do status de pagamento.

## 🔗 URL do Webhook

```
https://SEU_DOMINIO.com/api/webhook/asaas
```

**Exemplo (desenvolvimento):**
```
https://3000-i2r1x5q9skx44agan426j-8549611e.manusvm.computer/api/webhook/asaas
```

## ⚙️ Configuração no ASAAS

1. Acesse o painel do ASAAS: https://www.asaas.com
2. Vá em **Configurações** → **Webhooks**
3. Clique em **Adicionar Webhook**
4. Configure:
   - **URL**: `https://SEU_DOMINIO.com/api/webhook/asaas`
   - **Eventos**:
     - ✅ `PAYMENT_RECEIVED` (Pagamento recebido)
     - ✅ `PAYMENT_CONFIRMED` (Pagamento confirmado - cartão)
   - **Token de Acesso** (opcional): Adicione um token para segurança
5. Salve a configuração

## 🔐 Segurança (Opcional)

Para adicionar validação de token:

1. No painel ASAAS, copie o **Token de Acesso** do webhook
2. Adicione como variável de ambiente no projeto:
   ```
   ASAAS_WEBHOOK_TOKEN=seu_token_aqui
   ```

## 📦 Payload do Webhook

O ASAAS envia um JSON com a seguinte estrutura:

```json
{
  "event": "PAYMENT_RECEIVED",
  "payment": {
    "id": "pay_123456789",
    "customer": "cus_987654321",
    "value": 99.90,
    "netValue": 95.90,
    "status": "RECEIVED",
    "billingType": "PIX",
    "description": "Kit IR Completo",
    "externalReference": "123",
    "confirmedDate": "2024-12-26",
    "paymentDate": "2024-12-26"
  }
}
```

## 🔄 Fluxo de Processamento

### Pagamento Inicial (Cálculo - R$ 5,99 ou R$ 15,99)

1. Cliente paga no ASAAS
2. ASAAS envia webhook para `/api/webhook/asaas`
3. Sistema identifica como pagamento inicial (valor < R$ 20)
4. Atualiza:
   - `statusPagamento` → `"pago"`
   - `dataPagamento` → data atual
   - `asaasPaymentId` → ID do pagamento
   - `asaasStatus` → status do ASAAS

### Pagamento Kit IR (R$ 99,90 ou similar)

1. Cliente paga Kit IR no ASAAS
2. ASAAS envia webhook para `/api/webhook/asaas`
3. Sistema identifica como Kit IR (valor > R$ 20)
4. Atualiza:
   - `statusKitIR` → `"pago"`
   - `dataPagamentoKit` → data do pagamento
   - `asaasPaymentIdKit` → ID do pagamento
   - `statusEnvioKit` → `"agendado"`
   - `dataEnvioKit` → data do pagamento + 7 dias
   - `statusEmail` → `"agendado"`
   - `dataAgendamentoEmail` → data do pagamento + 7 dias

## 🧪 Testando o Webhook

### Opção 1: Usar ASAAS Sandbox

1. Crie uma conta sandbox no ASAAS
2. Configure o webhook apontando para sua URL
3. Crie um pagamento de teste
4. Confirme o pagamento manualmente no painel
5. Verifique os logs do servidor

### Opção 2: Simular com cURL

```bash
curl -X POST https://SEU_DOMINIO.com/api/webhook/asaas \
  -H "Content-Type: application/json" \
  -H "asaas-access-token: SEU_TOKEN" \
  -d '{
    "event": "PAYMENT_RECEIVED",
    "payment": {
      "id": "pay_test_123",
      "customer": "cus_test_456",
      "value": 99.90,
      "netValue": 95.90,
      "status": "RECEIVED",
      "billingType": "PIX",
      "description": "Kit IR Completo",
      "externalReference": "1",
      "confirmedDate": "2024-12-26T10:00:00Z",
      "paymentDate": "2024-12-26T10:00:00Z"
    }
  }'
```

### Opção 3: Usar Postman/Insomnia

1. Crie uma requisição POST
2. URL: `https://SEU_DOMINIO.com/api/webhook/asaas`
3. Headers:
   - `Content-Type: application/json`
   - `asaas-access-token: SEU_TOKEN` (se configurado)
4. Body (JSON): Use o exemplo acima
5. Envie a requisição

## 📊 Logs

O webhook gera logs detalhados no console do servidor:

```
[Webhook ASAAS] Evento recebido: PAYMENT_RECEIVED
[Webhook ASAAS] Payment ID: pay_123456789
[Webhook ASAAS] Pagamento de Kit IR confirmado
[Webhook ASAAS] Kit IR atualizado para formulário 1
[Webhook ASAAS] Envio agendado para: 2025-01-02T10:00:00Z
```

## ⚠️ Troubleshooting

### Webhook não está sendo recebido

1. Verifique se a URL está correta e acessível publicamente
2. Teste a URL manualmente com cURL
3. Verifique os logs do ASAAS para ver se há erros
4. Confirme que os eventos corretos estão selecionados

### Token inválido

1. Verifique se `ASAAS_WEBHOOK_TOKEN` está configurado corretamente
2. Confirme que o token no ASAAS é o mesmo da variável de ambiente
3. Se não quiser usar token, remova a variável de ambiente

### Formulário não encontrado

1. Verifique se o `externalReference` no pagamento ASAAS corresponde ao ID do formulário
2. Ou certifique-se de que o `asaasPaymentIdKit` está sendo salvo corretamente

## 🔗 Links Úteis

- [Documentação oficial ASAAS Webhooks](https://docs.asaas.com/reference/webhooks)
- [Painel ASAAS](https://www.asaas.com)
- [ASAAS Sandbox](https://sandbox.asaas.com)

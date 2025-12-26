#!/bin/bash

# Script para testar o webhook ASAAS localmente

echo "🧪 Testando Webhook ASAAS..."
echo ""

# URL do webhook
WEBHOOK_URL="http://localhost:3000/api/webhook/asaas"

# Teste 1: Pagamento de Kit IR
echo "📦 Teste 1: Pagamento de Kit IR (R$ 99,90)"
echo "-------------------------------------------"

curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "event": "PAYMENT_RECEIVED",
    "payment": {
      "id": "pay_test_kitir_001",
      "customer": "cus_test_001",
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

echo ""
echo ""

# Teste 2: Pagamento Inicial
echo "💰 Teste 2: Pagamento Inicial (R$ 15,99)"
echo "-------------------------------------------"

curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "event": "PAYMENT_CONFIRMED",
    "payment": {
      "id": "pay_test_inicial_001",
      "customer": "cus_test_002",
      "value": 15.99,
      "netValue": 15.19,
      "status": "CONFIRMED",
      "billingType": "CREDIT_CARD",
      "description": "Cálculo IRPF Builder",
      "externalReference": "4",
      "confirmedDate": "2024-12-26T11:00:00Z",
      "paymentDate": "2024-12-26T11:00:00Z"
    }
  }'

echo ""
echo ""
echo "✅ Testes concluídos!"
echo ""
echo "💡 Verifique:"
echo "   1. Logs do servidor para ver se os eventos foram processados"
echo "   2. Dashboard para ver se os status foram atualizados"
echo "   3. Banco de dados para confirmar as mudanças"

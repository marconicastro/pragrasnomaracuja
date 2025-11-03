# 🧪 Criar Lead de Teste Completo com fbc Válido

## 🎯 Objetivo

Criar um Lead novo automaticamente com `fbc` válido para testar o webhook melhorado.

---

## 📋 Método 1: Via API (Recomendado)

### **Passo 1: Criar Lead via API**

Acesse no navegador ou use curl:

```
https://maracujazeropragas.com/api/create-test-lead
```

**Método:** `POST`  
**Body (JSON):**
```json
{
  "email": "teste.webhook.fbc@maracujazeropragas.com",
  "phone": "77998877666",
  "firstName": "Teste",
  "lastName": "Webhook FBC",
  "city": "Salvador",
  "state": "BA",
  "zip": "40000"
}
```

**Ou usar curl:**
```bash
curl -X POST https://maracujazeropragas.com/api/create-test-lead \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste.webhook.fbc@maracujazeropragas.com",
    "phone": "77998877666",
    "firstName": "Teste",
    "lastName": "Webhook FBC",
    "city": "Salvador",
    "state": "BA",
    "zip": "40000"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Lead de teste criado com fbc válido",
  "data": {
    "email": "teste.webhook.fbc@maracujazeropragas.com",
    "phone": "77998877666",
    "fbc": "fb.1.1762196000.abc123def456",
    "fbcValid": true,
    "createdAt": "2025-11-03T18:30:00.000Z"
  }
}
```

---

### **Passo 2: Testar Webhook com Novo Lead**

Agora use os dados do Lead criado no ReqBin:

**Payload atualizado:**
```json
{
  "secret": "12f4848f-35e9-41a8-8da4-1032642e3e89",
  "event": "purchase_approved",
  "data": {
    "id": "TEST52522",
    "refId": "TEST52522",
    "customer": {
      "name": "Teste Webhook FBC",
      "birthDate": null,
      "email": "teste.webhook.fbc@maracujazeropragas.com",
      "phone": "77998877666",
      "docNumber": null
    },
    "affiliate": null,
    "offer": {
      "id": "hacr962",
      "name": "Sistema 4 Fases - Ebook Trips",
      "price": 39.9
    },
    "offer_type": "digital",
    "product": {
      "name": "Sistema 4 Fases - Ebook Trips",
      "id": "hacr962",
      "short_id": "hacr962",
      "supportEmail": "suporte@maracujazeropragas.com",
      "type": "digital_product",
      "invoiceDescription": "Sistema 4 Fases - Ebook Trips"
    },
    "parent_order": null,
    "checkoutUrl": null,
    "status": "paid",
    "baseAmount": 39.9,
    "discount": null,
    "amount": 39.9,
    "fees": 0,
    "paymentMethod": "credit_card",
    "paymentMethodName": "Cartão de Crédito",
    "installments": 1,
    "utm_source": null,
    "utm_medium": null,
    "utm_campaign": null,
    "sck": null,
    "fbc": null,
    "fbp": null,
    "paidAt": "2025-11-03T18:35:00.000Z",
    "createdAt": "2025-11-03T18:33:00.000Z"
  }
}
```

---

## 🔍 O Que Vai Acontecer

1. **API cria Lead** com `fbc` válido (< 24h)
2. **Webhook recebe Purchase**
3. **Webhook busca Lead** por email: `teste.webhook.fbc@maracujazeropragas.com`
4. **Webhook encontra Lead** mais recente com `fbc` válido
5. **Webhook valida fbc** (< 24h) ✅
6. **Webhook envia Purchase** com `fbc` válido (+16% EQM!)

---

## 📊 Resultado Esperado nos Logs

```
✅ User data encontrado por EMAIL: teste.webhook.fbc@maracujazeropragas.com
✅ User data encontrado no Vercel KV: {
  hasFbp: true,
  hasFbc: true,  ← ✅ AGORA TEM!
  fbcValid: true,  ← ✅ VÁLIDO!
  createdAt: '2025-11-03T18:30:00.000Z'
}
✅ fbc do KV válido e dentro da janela de 24h
📊 Purchase Data Quality Score: 92  ← ✅ MELHORADO (era 85)
```

---

## ✅ Vantagens Desta Solução

1. ✅ **Automático** - Uma chamada de API cria tudo
2. ✅ **fbc Válido** - Gerado automaticamente (válido por 24h)
3. ✅ **Dados Completos** - Inclui todos os campos necessários
4. ✅ **Teste Completo** - Pronto para usar no ReqBin imediatamente

---

## 🎯 Próximos Passos

1. Chamar `/api/create-test-lead` para criar Lead
2. Copiar dados do Lead criado
3. Atualizar payload do ReqBin com novo email/telefone
4. Enviar webhook no ReqBin
5. Verificar logs do Vercel (deve mostrar `fbc` válido!)

---

**Pronto para testar!** 🚀


# 🧪 GUIA: Testar Webhook Purchase no ReqBin

**Objetivo:** Testar se o webhook está enviando Purchase para GTM Server-Side corretamente

---

## 📋 CONFIGURAÇÃO NO REQBIN

### **1. URL:**
```
https://www.maracujazeropragas.com/api/webhook-cakto
```

### **2. Método:**
```
POST
```

### **3. Headers:**
```
Content-Type: application/json
```

---

## 📦 PAYLOAD PARA TESTE

### **Payload completo (JSON):**

```json
{
  "secret": "SEU_SECRET_AQUI",
  "event": "purchase_approved",
  "data": {
    "id": "test_order_123",
    "refId": "TEST_ORDER_123",
    "customer": {
      "name": "João Silva",
      "birthDate": null,
      "email": "joao.silva@email.com",
      "phone": "11999999999",
      "docNumber": null
    },
    "affiliate": null,
    "offer": {
      "id": "offer_123",
      "name": "Sistema 4 Fases - Ebook Trips",
      "price": 39.9
    },
    "offer_type": "digital",
    "product": {
      "name": "Sistema 4 Fases - Ebook Trips",
      "id": "hacr962",
      "short_id": "hacr962",
      "supportEmail": "suporte@email.com",
      "type": "ebook",
      "invoiceDescription": "Ebook Sistema 4 Fases"
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
    "paidAt": "2024-11-04T10:30:00.000Z",
    "createdAt": "2024-11-04T10:29:00.000Z"
  }
}
```

---

## 🔧 SUBSTITUIR VALORES

### **1. Secret:**
```json
"secret": "SEU_CAKTO_WEBHOOK_SECRET"
```
**Substituir por:** Valor da variável `CAKTO_WEBHOOK_SECRET` do `.env`

### **2. Email:**
```json
"email": "joao.silva@email.com"
```
**Usar:** Email que tenha dados salvos no KV (para testar com fbp/fbc)

### **3. Order ID:**
```json
"refId": "TEST_ORDER_123"
```
**Pode usar:** Qualquer ID único para teste (ex: `TEST_${Date.now()}`)

---

## 📊 ESTRUTURA DO PAYLOAD

### **Campos obrigatórios:**
- ✅ `secret` - Secret do webhook (deve corresponder ao `.env`)
- ✅ `event` - Deve ser `"purchase_approved"`
- ✅ `data.status` - Deve ser `"paid"`
- ✅ `data.refId` - Order ID
- ✅ `data.customer.email` - Email do cliente
- ✅ `data.customer.name` - Nome do cliente
- ✅ `data.amount` - Valor da compra

### **Campos opcionais:**
- `data.customer.phone` - Telefone (recomendado)
- `data.paidAt` - Data do pagamento (ISO 8601)
- `data.fbp` - Facebook Pixel ID (se disponível)
- `data.fbc` - Facebook Click ID (se disponível)

---

## 🧪 PASSOS PARA TESTAR

### **1. Preparar payload:**
1. Copiar o payload JSON acima
2. Substituir `"SEU_SECRET_AQUI"` pelo secret real
3. Ajustar email (usar um que tenha dados no KV se possível)
4. Ajustar order ID (usar um único para cada teste)

### **2. Configurar no ReqBin:**
1. Acessar: https://reqbin.com/
2. Método: `POST`
3. URL: `https://www.maracujazeropragas.com/api/webhook-cakto`
4. Headers: `Content-Type: application/json`
5. Body: Colar o JSON completo

### **3. Enviar requisição:**
1. Clicar em "Send"
2. Verificar resposta (deve ser 200 OK)
3. Verificar logs no console do servidor

---

## ✅ RESPOSTA ESPERADA

### **Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Purchase enviado para GTM Server-Side - Order ID: TEST_ORDER_123",
  "processedIn": "150ms"
}
```

### **Erro (400/401/500):**
```json
{
  "success": false,
  "error": "Mensagem de erro",
  "processedIn": "50ms"
}
```

---

## 🔍 VERIFICAÇÕES

### **1. Logs do servidor (Vercel):**
Procurar por:
- ✅ `📨 Webhook Cakto recebido:`
- ✅ `📤 Enviando Purchase para GTM Server-Side:`
- ✅ `✅ Purchase enviado para GTM Server-Side com sucesso:`

### **2. GTM Server-Side Preview Mode:**
1. Abrir GTM Server-Side Preview Mode
2. Verificar se evento `purchase` aparece
3. Verificar se tags FB - Purchase e GA4 - All Events disparam

### **3. Meta Events Manager:**
1. Abrir Meta Events Manager
2. Ir em "Test Events"
3. Verificar se Purchase aparece

### **4. GA4 Real-Time:**
1. Abrir GA4
2. Ir em "Real-time"
3. Verificar se Purchase aparece

---

## 🐛 TROUBLESHOOTING

### **Erro: "Invalid webhook signature" (401)**
- ✅ Verificar se `secret` está correto
- ✅ Verificar variável `CAKTO_WEBHOOK_SECRET` no `.env`

### **Erro: "GTM Server-Side error"**
- ✅ Verificar se URL do GTM está correta
- ✅ Verificar se GTM Server-Side está acessível
- ✅ Verificar logs do GTM Server-Side

### **Purchase não aparece no GTM:**
- ✅ Verificar se formato do payload está correto
- ✅ Verificar se `event: 'purchase'` está presente
- ✅ Verificar se trigger `ce - purchase` está configurado

### **Purchase não aparece no Meta:**
- ✅ Verificar se tag "FB - Purchase" está configurada
- ✅ Verificar se mapeamento de campos está correto
- ✅ Verificar se Meta Pixel ID está correto

---

## 📝 EXEMPLO DE PAYLOAD SIMPLIFICADO

**Versão mínima para teste:**
```json
{
  "secret": "SEU_SECRET",
  "event": "purchase_approved",
  "data": {
    "refId": "TEST_123",
    "customer": {
      "email": "teste@email.com",
      "phone": "11999999999",
      "name": "Teste Teste"
    },
    "amount": 39.9,
    "status": "paid"
  }
}
```

---

## 🎯 CHECKLIST DE TESTE

- [ ] Payload preparado com secret correto
- [ ] Requisição enviada via ReqBin
- [ ] Resposta 200 OK recebida
- [ ] Logs do servidor mostram sucesso
- [ ] GTM Server-Side Preview Mode mostra evento
- [ ] Tags FB - Purchase e GA4 disparam
- [ ] Meta Events Manager mostra Purchase
- [ ] GA4 Real-Time mostra Purchase

---

## 📊 RESULTADO ESPERADO

**Após o teste bem-sucedido:**
1. ✅ Webhook recebe e valida payload
2. ✅ Busca dados do KV (fbp/fbc/user data)
3. ✅ Formata no formato DataLayer
4. ✅ Envia para GTM Server-Side
5. ✅ GTM processa e dispara tags
6. ✅ Purchase aparece no Meta e GA4

---

## 🔗 LINKS ÚTEIS

- **ReqBin:** https://reqbin.com/
- **GTM Server-Side Preview:** https://tagassistant.google.com/
- **Meta Events Manager:** https://business.facebook.com/events_manager2/
- **GA4 Real-Time:** https://analytics.google.com/





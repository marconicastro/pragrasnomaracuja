# 🔧 CORREÇÃO: Formato do Payload para GTM Server-Side

**Problema:** Tags não disparam porque formato do payload está incorreto

---

## ❌ PROBLEMA IDENTIFICADO

### **Formato incorreto:**
```javascript
// ❌ ENVIANDO OBJETO ÚNICO
body: JSON.stringify(eventData)
```

### **Formato correto:**
```javascript
// ✅ GTM Server-Side espera ARRAY de eventos
body: JSON.stringify([eventData])
```

---

## ✅ CORREÇÕES APLICADAS

### **1. Adicionar Client Name na URL:**
```typescript
const gtmEndpoint = `${gtmServerUrl}/data?client_name=Data Client`;
```

**Por quê:**
- GTM Server-Side precisa saber qual Client processa o evento
- `Data Client` é o Client padrão que processa eventos do webhook
- Sem Client Name, o evento não é processado por nenhum Client

### **2. Enviar array de eventos:**
```typescript
body: JSON.stringify([eventData])  // Array ao invés de objeto único
```

**Por quê:**
- GTM Server-Side espera array de eventos (mesmo formato do browser)
- Mesmo que seja um único evento, deve estar em array

### **3. Adicionar User-Agent header:**
```typescript
headers: {
  'Content-Type': 'application/json',
  'User-Agent': userData.client_user_agent || 'GTM-Server-Side-Webhook'
}
```

**Por quê:**
- Alguns servidores GTM Server-Side podem requerer User-Agent
- Melhor prática para identificação

---

## 📊 FORMATO CORRETO DO PAYLOAD

### **URL:**
```
https://event.maracujazeropragas.com/data?client_name=Data Client
```

### **Headers:**
```
Content-Type: application/json
User-Agent: GTM-Server-Side-Webhook (ou client_user_agent se disponível)
```

### **Body (JSON):**
```json
[
  {
    "event": "purchase",
    "ecommerce": {
      "transaction_id": "TEST_ORDER_123",
      "value": 39.9,
      "currency": "BRL",
      "items": [...]
    },
    "content_ids": ["hacr962"],
    "content_name": "Sistema 4 Fases - Ebook Trips",
    "content_type": "product",
    "num_items": 1,
    "user_data": {
      "user_id": "sess_...",
      "email_address": "...",
      ...
    },
    "event_id": "...",
    "event_source_url": "https://www.maracujazeropragas.com/obrigado"
  }
]
```

---

## 🎯 RESULTADO ESPERADO

**Após correção:**
1. ✅ Evento chega no GTM Server-Side
2. ✅ Data Client processa o evento
3. ✅ Trigger `ce - purchase` detecta evento
4. ✅ Tags FB - Purchase e GA4 - All Events disparam
5. ✅ Purchase aparece no Meta Events Manager e GA4

---

## 📋 VERIFICAÇÃO

### **No GTM Server-Side Preview Mode:**
- ✅ Evento `purchase` deve aparecer no stream
- ✅ Client Name deve ser "Data Client"
- ✅ Tags devem disparar

### **Nos logs:**
- ✅ `📤 Enviando Purchase para GTM Server-Side` (já está aparecendo)
- ✅ `✅ Purchase enviado para GTM Server-Side com sucesso` (já está aparecendo)
- ✅ Tags devem disparar agora

---

## ⚠️ IMPORTANTE

**Client Name:**
- Deve corresponder ao nome do Client configurado no GTM Server-Side
- Geralmente é "Data Client" para eventos server-side
- Verificar no GTM Server-Side qual é o nome correto do Client

**Formato Array:**
- Sempre enviar array de eventos `[eventData]`
- Mesmo que seja um único evento
- GTM Server-Side espera este formato


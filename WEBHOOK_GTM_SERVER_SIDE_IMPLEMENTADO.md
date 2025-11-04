# ✅ WEBHOOK → GTM SERVER-SIDE IMPLEMENTADO

**Status:** ✅ **Implementado e Pronto**

---

## 🎯 O QUE FOI FEITO

### **1. Criada função `sendPurchaseToGTM()`**

**Arquivo:** `src/lib/offlineConversions.ts`

**Função:** Envia Purchase para GTM Server-Side no formato DataLayer

**Formato do payload:**
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'order_123',
    value: 39.9,
    currency: 'BRL',
    items: [...]
  },
  content_ids: ['hacr962'],
  contents: [...],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  num_items: 1,
  user_data: {
    user_id: 'sess_...',  // external_id do KV
    email_address: '...',
    phone_number: '...',
    // ... outros campos
  },
  event_id: 'order_123_timestamp',
  event_source_url: 'https://www.maracujazeropragas.com/obrigado'
}
```

---

### **2. Modificado `/api/webhook-cakto`**

**Antes:**
```typescript
await sendOfflinePurchase(purchaseData, enrichedUserData || {});
```

**Depois:**
```typescript
await sendPurchaseToGTM(purchaseData, enrichedUserData || {});
```

---

## 🔄 FLUXO ATUAL

### **Novo fluxo do Purchase:**
```
Cakto Webhook 
  ↓
/api/webhook-cakto 
  ↓
sendPurchaseToGTM() 
  ↓
GTM Server-Side (/data endpoint)
  ↓
GTM Server-Side processa
  ↓
Tags disparam: FB - Purchase, GA4 - All Events
  ↓
Meta CAPI + GA4
```

---

## ✅ FUNCIONALIDADES

### **1. Formato DataLayer:**
- ✅ Mesmo formato do browser
- ✅ Compatível com GTM Server-Side
- ✅ Todos os campos necessários

### **2. Fallback:**
- ✅ Se GTM Server-Side falhar → tenta Meta CAPI direto
- ✅ Garante que Purchase sempre será enviado

### **3. User Data:**
- ✅ `external_id` do KV
- ✅ Email, telefone, nome
- ✅ Geolocalização (city, state, zip)
- ✅ IP e User Agent (se disponível)

---

## 📋 CONFIGURAÇÃO NECESSÁRIA

### **Variável de Ambiente:**
```env
GTM_SERVER_URL=https://event.maracujazeropragas.com
```

**Se não configurado, usa o padrão:** `https://event.maracujazeropragas.com`

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Código implementado** - `sendPurchaseToGTM()` criada
2. ✅ **Webhook atualizado** - Usa nova função
3. ⏳ **Testar webhook** - Verificar se GTM Server-Side recebe
4. ⏳ **Verificar no GTM Preview Mode** - Confirmar que Purchase aparece
5. ⏳ **Verificar no Meta Events Manager** - Confirmar que Purchase chega ao Meta

---

## 📊 VANTAGENS

1. **Centralização:** Todos os eventos passam pelo GTM Server-Side
2. **Flexibilidade:** Fácil adicionar novos destinos (GA4, outros pixels)
3. **Manutenção:** Uma única configuração no GTM
4. **Debug:** Preview Mode do GTM Server-Side para debug
5. **Fallback:** Se GTM falhar, ainda envia via Meta CAPI direto

---

## ⚠️ IMPORTANTE

### **Endpoint GTM Server-Side:**
- URL: `https://event.maracujazeropragas.com/data`
- Método: `POST`
- Content-Type: `application/json`
- Formato: DataLayer event (mesmo do browser)

### **Fallback:**
- Se GTM Server-Side retornar erro → tenta Meta CAPI direto
- Garante que Purchase sempre será enviado

---

## 🧪 TESTE

### **1. Testar webhook:**
```bash
POST /api/webhook-cakto
{
  "secret": "...",
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

### **2. Verificar logs:**
- ✅ `📤 Enviando Purchase para GTM Server-Side:`
- ✅ `✅ Purchase enviado para GTM Server-Side com sucesso:`

### **3. Verificar no GTM Server-Side Preview Mode:**
- ✅ Evento `purchase` deve aparecer
- ✅ Tags FB - Purchase e GA4 - All Events devem disparar

---

## 📝 RESUMO

✅ **Webhook agora envia Purchase para GTM Server-Side**
✅ **Formato DataLayer (mesmo do browser)**
✅ **Fallback para Meta CAPI direto se necessário**
✅ **Todos os dados do KV incluídos (external_id, fbp, fbc, etc.)**


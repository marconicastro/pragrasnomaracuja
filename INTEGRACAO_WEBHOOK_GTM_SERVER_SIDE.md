# 🔄 INTEGRAÇÃO: Webhook → GTM Server-Side (Purchase)

**Objetivo:** Modificar o webhook para enviar Purchase para GTM Server-Side ao invés de Meta CAPI direto

---

## 📊 SITUAÇÃO ATUAL

### **Fluxo atual:**
```
Cakto Webhook → /api/webhook-cakto → sendOfflinePurchase() → Meta CAPI direto
```

### **Fluxo desejado:**
```
Cakto Webhook → /api/webhook-cakto → sendPurchaseToGTM() → GTM Server-Side → Meta CAPI + GA4
```

---

## 🔧 IMPLEMENTAÇÃO

### **1. Criar função `sendPurchaseToGTM()`**

**Nova função que:**
- Recebe `purchaseData` e `userData`
- Formata no formato DataLayer
- Envia para GTM Server-Side endpoint

**Formato do payload para GTM Server-Side:**
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'order_123',
    value: 39.9,
    currency: 'BRL',
    items: [{
      item_id: 'hacr962',
      item_name: 'Sistema 4 Fases - Ebook Trips',
      price: 39.9,
      quantity: 1
    }]
  },
  content_ids: ['hacr962'],
  contents: [{...}],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  num_items: 1,
  user_data: {
    user_id: 'sess_...',  // external_id do KV
    email_address: '...',
    phone_number: '...',
    first_name: '...',
    last_name: '...',
    city: '...',
    region: '...',
    postal_code: '...',
    country: 'BR'
  },
  // Metadata adicional
  event_id: 'unique_event_id',
  event_source_url: 'https://www.maracujazeropragas.com/obrigado',
  client_ip_address: '...',
  client_user_agent: '...'
}
```

---

### **2. Modificar `/api/webhook-cakto`**

**Antes:**
```typescript
await sendOfflinePurchase(purchaseData, enrichedUserData || {});
```

**Depois:**
```typescript
await sendPurchaseToGTM(purchaseData, enrichedUserData || {});
```

---

### **3. GTM Server-Side**

**O GTM Server-Side já está configurado para:**
- Receber eventos do Data Client
- Processar evento `purchase`
- Enviar para Meta CAPI (tag FB - Purchase)
- Enviar para GA4 (tag GA4 - All Events)

---

## 📋 CHECKLIST

### **Código:**
- [ ] Criar função `sendPurchaseToGTM()` em `offlineConversions.ts`
- [ ] Formatar payload no formato DataLayer
- [ ] Enviar para GTM Server-Side endpoint
- [ ] Modificar `/api/webhook-cakto` para usar nova função
- [ ] Manter `sendOfflinePurchase()` como fallback (opcional)

### **GTM Server-Side:**
- [ ] Verificar se endpoint está acessível
- [ ] Verificar se trigger `ce - purchase` está configurado
- [ ] Verificar se tag "FB - Purchase" está configurada
- [ ] Verificar se mapeamento de campos está correto

---

## 🎯 VANTAGENS

1. **Centralização:** Todos os eventos passam pelo GTM Server-Side
2. **Flexibilidade:** Fácil adicionar novos destinos (GA4, outros pixels)
3. **Manutenção:** Uma única configuração no GTM
4. **Debug:** Preview Mode do GTM Server-Side para debug

---

## ⚠️ CONSIDERAÇÕES

- **Endpoint GTM Server-Side:** Precisa ser configurado (ex: `https://event.maracujazeropragas.com/data`)
- **Autenticação:** GTM Server-Side pode requerer autenticação
- **Formato:** Payload deve seguir formato DataLayer exato
- **Fallback:** Manter `sendOfflinePurchase()` como backup se necessário





# ✅ INTEGRAÇÃO: Purchase Completo via GTM

**Status:** ✅ **CORRIGIDO E INTEGRADO**

---

## ✅ CORREÇÕES APLICADAS

### **1. Valores dinâmicos no Purchase**

**Antes:**
```typescript
pushPurchase(orderId, 39.9, 'BRL', 1, userDataForGTM);  // ❌ Valor fixo
```

**Depois:**
```typescript
// Extrair valores dinâmicos do customParams
const purchaseValue = customParams.value || 39.9;
const purchaseCurrency = customParams.currency || 'BRL';
const purchaseQuantity = customParams.num_items || 1;

pushPurchase(orderId, purchaseValue, purchaseCurrency, purchaseQuantity, userDataForGTM);  // ✅ Valor dinâmico
```

---

## 📊 ESTRUTURA DO DATALAYER PARA PURCHASE

### **Dados enviados:**
```javascript
{
  event: 'purchase',  // ✅ Nome específico para trigger 'ce - purchase' no GTM
  ecommerce: {
    transaction_id: 'order_123',  // ✅ Order ID
    value: 39.9,                  // ✅ Valor dinâmico
    currency: 'BRL',              // ✅ Moeda
    items: [{
      item_id: 'hacr962',
      item_name: 'Sistema 4 Fases - Ebook Trips',
      price: 39.9,
      quantity: 1
    }]
  },
  content_ids: ['hacr962'],       // ✅ Content IDs
  contents: [{...}],              // ✅ Contents array
  content_name: 'Sistema 4 Fases - Ebook Trips',  // ✅ Content name
  content_type: 'product',                        // ✅ Content type
  num_items: 1,                  // ✅ Quantidade
  user_data: {
    user_id: 'sess_1761312196590_bookidhkx',  // ✅ External ID
    email_address: '...',
    phone_number: '...',
    first_name: '...',
    last_name: '...',
    city: '...',
    region: '...',
    postal_code: '...',
    country: 'BR'
  }
}
```

---

## 🎯 FLUXO COMPLETO DO PURCHASE

### **1. Página `/obrigado`:**
- ✅ Extrai dados da URL (order_id, email, value, etc.)
- ✅ Busca dados do localStorage (fallback)
- ✅ Busca dados do KV via API (se necessário)
- ✅ Chama `trackPurchaseElite()` com valores dinâmicos

### **2. `trackPurchaseElite()`:**
- ✅ Salva user data (se fornecido)
- ✅ Prepara `user_data` para DataLayer
- ✅ Extrai valores dinâmicos de `customParams`
- ✅ Chama `pushPurchase()` com valores corretos
- ✅ Chama `trackEliteEvent()` para Meta (via GTM Server-Side)

### **3. `pushPurchase()`:**
- ✅ Envia evento `'purchase'` para DataLayer
- ✅ Inclui `ecommerce.transaction_id`
- ✅ Inclui `ecommerce.value` (dinâmico)
- ✅ Inclui `ecommerce.currency` (dinâmico)
- ✅ Inclui `content_name` e `content_type`
- ✅ Inclui `user_data` completo

### **4. GTM Web Container:**
- ✅ Trigger `ce - purchase` detecta evento
- ✅ Tags disparam: FB - Purchase, DT - purchase, GA4 - purchase

### **5. GTM Server-Side Container:**
- ✅ Trigger `ce - purchase` detecta evento
- ✅ Tag "FB - Purchase" envia para Meta CAPI
- ✅ Tag "GA4 - All Events" envia para GA4

---

## ✅ VERIFICAÇÃO NO GTM

### **GTM Web Container:**
- [ ] Trigger `ce - purchase` configurado (Event Name: `purchase`)
- [ ] Tag "FB - Purchase" configurada
- [ ] Tag "DT - purchase" configurada
- [ ] Tag "GA4 - purchase" configurada

### **GTM Server-Side Container:**
- [ ] Trigger `ce - purchase` configurado (Event Name: `purchase`)
- [ ] Tag "FB - Purchase" configurada
- [ ] User Data: External ID mapeado (`{{dlv - user_data.user_id}}` ou `{{ed - user_id}}`)
- [ ] Custom Data: `order_id` mapeado (`{{dlv - ecommerce.transaction_id}}`)
- [ ] Custom Data: `content_name` mapeado (`{{ed - content_name}}`)
- [ ] Custom Data: `content_type` mapeado (`{{ed - content_type}}`)

---

## 🧪 TESTE

### **1. Teste na página `/obrigado`:**
```
URL: /obrigado?order_id=TEST_123&email=teste@email.com&value=39.9
```

**Resultado esperado:**
- ✅ Purchase disparado no DataLayer
- ✅ Valor = 39.9 (dinâmico)
- ✅ Transaction ID = 'TEST_123'
- ✅ User data completo

### **2. Teste no GTM Preview Mode:**
- ✅ Verificar se evento `purchase` aparece
- ✅ Verificar se `ecommerce.transaction_id` está presente
- ✅ Verificar se `ecommerce.value` está correto
- ✅ Verificar se `user_data.user_id` está presente
- ✅ Verificar se tags FB, DT, GA4 disparam

### **3. Teste no Meta Events Manager:**
- ✅ Verificar se Purchase aparece em Test Events
- ✅ Verificar se `external_id` está presente
- ✅ Verificar se `order_id` está presente
- ✅ Verificar se `content_name` e `content_type` estão presentes

---

## 📝 RESUMO

✅ **Correções aplicadas:**
- Valores dinâmicos implementados em `trackPurchaseElite()`
- `value`, `currency` e `num_items` agora usam `customParams`
- DataLayer completo com todos os campos necessários

✅ **Próximo passo:**
- Testar na página `/obrigado` e verificar no GTM Preview Mode
- Verificar se todas as tags estão configuradas corretamente no GTM


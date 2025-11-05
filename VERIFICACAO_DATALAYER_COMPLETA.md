# ✅ VERIFICAÇÃO: DataLayer - external_id e transaction_id

**Status:** ✅ **CORRIGIDO**

---

## 🔍 PROBLEMA IDENTIFICADO

### **1. ❌ external_id estava undefined**

**Causa:** `saveAdvancedUserData()` não estava atribuindo `external_id`

**Correção aplicada:**
```typescript
// Agora external_id é atribuído:
external_id: userData.external_id || existingData?.external_id || sessionId,
```

**Resultado:**
- ✅ `external_id` sempre será preenchido (usa `sessionId` como fallback)
- ✅ `user_id` no DataLayer será preenchido corretamente

---

### **2. ✅ transaction_id está correto**

**Verificado no código:**
```typescript
pushPurchase(orderId, 39.9, 'BRL', 1, userDataForGTM);
// ↓
pushToDataLayer({
  event: 'purchase',
  ecommerce: {
    transaction_id: transactionId,  // ✅ Está sendo enviado
    // ...
  }
});
```

**Resultado:**
- ✅ `transaction_id` está sendo enviado corretamente no `ecommerce.transaction_id`
- ✅ GTM Server-Side deve conseguir acessar via `{{dlv - ecommerce.transaction_id}}`

---

## 📊 ESTRUTURA DO DATALAYER (CORRIGIDA)

### **Para InitiateCheckout (begin_checkout):**
```javascript
{
  event: 'begin_checkout',
  ecommerce: {
    value: 39.9,
    currency: 'BRL',
    items: [...]
  },
  content_ids: ['hacr962'],
  contents: [...],
  content_name: 'Sistema 4 Fases - Ebook Trips',  // ✅ Adicionado
  content_type: 'product',                        // ✅ Adicionado
  num_items: 1,
  user_data: {
    user_id: 'sess_1761312196590_bookidhkx',  // ✅ Agora será preenchido!
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

### **Para Purchase:**
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'order_123',  // ✅ Está sendo enviado
    value: 39.9,
    currency: 'BRL',
    items: [...]
  },
  content_ids: ['hacr962'],
  contents: [...],
  content_name: 'Sistema 4 Fases - Ebook Trips',  // ✅ Adicionado
  content_type: 'product',                        // ✅ Adicionado
  num_items: 1,
  user_data: {
    user_id: 'sess_1761312196590_bookidhkx',  // ✅ Agora será preenchido!
    // ... outros campos
  }
}
```

---

## ✅ VERIFICAÇÃO NO GTM SERVER-SIDE

### **Variáveis necessárias:**

1. **`dlv - user_data.user_id`** (ou `ed - user_data.user_id`)
   - Para acessar `external_id`
   - Tipo: Data Layer Variable ou Event Data Variable
   - Caminho: `user_data.user_id`

2. **`dlv - ecommerce.transaction_id`** (ou `ed - ecommerce.transaction_id`)
   - Para acessar `transaction_id` (Purchase)
   - Tipo: Data Layer Variable ou Event Data Variable
   - Caminho: `ecommerce.transaction_id`

3. **`ed - content_name`**
   - Para acessar `content_name`
   - Tipo: Event Data Variable
   - Caminho: `content_name`

4. **`ed - content_type`**
   - Para acessar `content_type`
   - Tipo: Event Data Variable
   - Caminho: `content_type`

---

## 🎯 MAPEAMENTO CORRETO NO GTM SERVER-SIDE

### **User Data:**
```
External ID: {{dlv - user_data.user_id}}  ✅
```

### **Custom Data:**
```
content_name: {{ed - content_name}}  ✅
content_type: {{ed - content_type}}  ✅
order_id: {{dlv - ecommerce.transaction_id}}  ✅ (apenas Purchase)
```

---

## ✅ TESTE

**Para verificar se está funcionando:**

1. **No Console do navegador:**
```javascript
// Ver user_data no DataLayer
const events = window.dataLayer.filter(e => e.user_data);
console.log('User Data:', events.map(e => e.user_data));

// Verificar se user_id está preenchido
events.forEach(e => {
  console.log('Event:', e.event, 'user_id:', e.user_data?.user_id);
});
```

2. **No GTM Preview Mode:**
   - Verificar se `{{ed - user_id}}` ou `{{dlv - user_data.user_id}}` retorna valor
   - Verificar se `{{ed - content_name}}` retorna valor
   - Verificar se `{{ed - content_type}}` retorna valor

---

## 📝 RESUMO

✅ **Correções aplicadas:**
- `external_id` agora é atribuído em `saveAdvancedUserData()` (usa `sessionId` como fallback)
- `content_name` e `content_type` adicionados a todos os eventos de ecommerce
- `transaction_id` já estava sendo enviado corretamente

✅ **DataLayer agora está completo:**
- `user_data.user_id` → sempre preenchido
- `ecommerce.transaction_id` → preenchido no Purchase
- `content_name` → presente em todos os eventos de ecommerce
- `content_type` → presente em todos os eventos de ecommerce





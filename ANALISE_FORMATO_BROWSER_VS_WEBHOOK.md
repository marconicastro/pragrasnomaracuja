# 🔍 ANÁLISE: Formato Browser vs Webhook

**Pergunta:** Se corrigir as variáveis Event Data, vai quebrar os outros eventos do browser?

---

## 📊 COMPARAÇÃO DOS FORMATOS

### **Browser Events (DataLayer):**

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
    user_id: '...',
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

**Variáveis usadas:** `{{dlv - *}}` (Data Layer Variables)
- `{{dlv - ecommerce.value}}`
- `{{dlv - ecommerce.currency}}`
- `{{dlv - user_data.email_address}}`
- etc.

---

### **Webhook Events (Server-Side):**

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
    user_id: '...',
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

**Variáveis usadas:** `{{ed - *}}` (Event Data Variables)
- `{{ed - ecommerce.value}}` ✅ (correto)
- `{{ed - ecommerce.currency}}` ✅ (correto)
- `{{ed - user_data.email_address}}` ✅ (correto)
- etc.

---

## ✅ CONCLUSÃO

### **1. O formato é o MESMO para todos os eventos!**

- ✅ Browser (PageView, ViewContent, AddToCart, Lead, InitiateCheckout, Purchase)
- ✅ Webhook (Purchase)

**Todos usam a mesma estrutura:**
- `ecommerce.value`
- `ecommerce.currency`
- `user_data.email_address`
- etc.

---

### **2. As variáveis são DIFERENTES, mas os paths são os MESMOS!**

#### **Browser Events:**
- Tipo: **Data Layer Variables** (`{{dlv - *}}`)
- Acessam: `window.dataLayer` do browser
- Paths: `ecommerce.value`, `user_data.email_address`, etc.

#### **Webhook Events:**
- Tipo: **Event Data Variables** (`{{ed - *}}`)
- Acessam: Payload direto do evento
- Paths: `ecommerce.value`, `user_data.email_address`, etc. ← **MESMOS PATHS!**

---

### **3. Pode corrigir SEM MEDO!**

**Por quê?**
- ✅ Variáveis do browser (`{{dlv - *}}`) são diferentes das do webhook (`{{ed - *}}`)
- ✅ São tipos de variáveis diferentes no GTM Server-Side
- ✅ Os paths são os mesmos porque o formato é o mesmo
- ✅ Corrigir `{{ed - value}}` → `{{ed - ecommerce.value}}` não afeta `{{dlv - ecommerce.value}}`

---

## 🎯 RESPOSTA DIRETA

### **Pode corrigir as variáveis Event Data?**
✅ **SIM! Pode corrigir sem medo!**

### **Vai quebrar eventos do browser?**
❌ **NÃO!** Porque:
- Variáveis do browser usam `{{dlv - *}}` (Data Layer Variables)
- Variáveis do webhook usam `{{ed - *}}` (Event Data Variables)
- São tipos diferentes, não se interferem

### **O formato é correto para todos?**
✅ **SIM!** O formato com `ecommerce.value`, `user_data.email_address` é o padrão para:
- ✅ Browser events (PageView, ViewContent, AddToCart, Lead, InitiateCheckout, Purchase)
- ✅ Webhook events (Purchase)

---

## 📋 RECOMENDAÇÃO

**Corrigir as variáveis Event Data para usar os paths corretos:**
- `{{ed - ecommerce.value}}` (ao invés de `{{ed - value}}`)
- `{{ed - ecommerce.currency}}` (ao invés de `{{ed - currency}}`)
- `{{ed - user_data.email_address}}` (ao invés de `{{ed - email_address}}`)
- etc.

**Isso vai:**
- ✅ Corrigir o webhook (Purchase)
- ✅ Não afetar eventos do browser (já usam `{{dlv - *}}`)
- ✅ Padronizar o formato para todos os eventos

---

## ✅ CHECKLIST

### **Variáveis Event Data a Corrigir:**
- [ ] `ed - ecommerce.value` (Path: `ecommerce.value`)
- [ ] `ed - ecommerce.currency` (Path: `ecommerce.currency`)
- [ ] `ed - ecommerce.transaction_id` (Path: `ecommerce.transaction_id`)
- [ ] `ed - user_data.email_address` (Path: `user_data.email_address`)
- [ ] `ed - user_data.first_name` (Path: `user_data.first_name`)
- [ ] `ed - user_data.last_name` (Path: `user_data.last_name`)
- [ ] `ed - user_data.phone_number` (Path: `user_data.phone_number`)
- [ ] `ed - user_data.city` (Path: `user_data.city`)
- [ ] `ed - user_data.region` (Path: `user_data.region`)
- [ ] `ed - user_data.postal_code` (Path: `user_data.postal_code`)
- [ ] `ed - user_data.country` (Path: `user_data.country`)

### **Tag "FB - Purchase" a Atualizar:**
- [ ] Custom Data: usar `{{ed - ecommerce.value}}`, `{{ed - ecommerce.currency}}`, etc.
- [ ] User Data: usar `{{ed - user_data.email_address}}`, `{{ed - user_data.first_name}}`, etc.

---

## 🎉 RESULTADO

**Após corrigir:**
- ✅ Webhook Purchase funcionará corretamente
- ✅ Eventos do browser continuarão funcionando (usam `{{dlv - *}}`)
- ✅ Formato padronizado para todos os eventos

**Pode corrigir sem medo!** 🚀




# ✅ DATALAYER ATUALIZADO COM TODOS OS PARÂMETROS DO GTM

**Data:** 04/11/2024  
**Status:** ✅ Implementado

---

## 🎯 O QUE FOI FEITO

### **1. Criado Helper de DataLayer (`src/lib/gtmDataLayer.ts`)**

Novo arquivo com funções para enviar eventos para o DataLayer do GTM no formato correto:

- ✅ `pushPageView()` - Evento `page_view`
- ✅ `pushViewItem()` - Evento `view_item` (view_content)
- ✅ `pushAddToCart()` - Evento `add_to_cart`
- ✅ `pushBeginCheckout()` - Evento `begin_checkout`
- ✅ `pushPurchase()` - Evento `purchase`
- ✅ `pushGenerateLead()` - Evento `generate_lead`

---

## 📊 ESTRUTURA DO DATALAYER

### **Todos os eventos seguem o formato:**

```javascript
{
  event: 'nome_do_evento',
  ecommerce: {
    transaction_id: '...',  // Apenas para purchase
    value: 39.9,
    currency: 'BRL',
    items: [
      {
        item_id: 'hacr962',
        item_name: 'Sistema 4 Fases - Ebook Trips',
        price: 39.9,
        quantity: 1,
        item_category: 'digital_product',
        item_brand: 'Ebook Trips'
      }
    ]
  },
  content_ids: ['hacr962'],
  contents: [
    {
      id: 'hacr962',
      quantity: 1,
      item_price: 39.9
    }
  ],
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

---

## 🔄 INTEGRAÇÃO COM EVENTOS EXISTENTES

### **Todos os eventos Elite agora enviam para o DataLayer:**

1. ✅ **`trackPageViewElite()`** → Envia `page_view` para DataLayer
2. ✅ **`trackViewContentElite()`** → Envia `view_item` para DataLayer
3. ✅ **`trackAddToCartElite()`** → Envia `add_to_cart` para DataLayer
4. ✅ **`trackBeginCheckoutElite()`** → Envia `begin_checkout` para DataLayer
5. ✅ **`trackLeadElite()`** → Envia `generate_lead` para DataLayer
6. ✅ **`trackPurchaseElite()`** → Envia `purchase` para DataLayer

---

## 📋 PARÂMETROS INCLUÍDOS

### **Ecommerce (para eventos de ecommerce):**
- ✅ `transaction_id` (apenas purchase)
- ✅ `value`
- ✅ `currency`
- ✅ `items[]` (completo: item_id, item_name, price, quantity, item_category, item_brand)

### **Content (para Meta/GTM):**
- ✅ `content_ids[]` (array com IDs dos produtos)
- ✅ `contents[]` (array com objetos completos: id, quantity, item_price)
- ✅ `num_items` (quantidade total de itens)

### **User Data (para GTM):**
- ✅ `user_id`
- ✅ `email_address`
- ✅ `phone_number`
- ✅ `first_name`
- ✅ `last_name`
- ✅ `city`
- ✅ `region` (state)
- ✅ `postal_code` (zip)
- ✅ `country`

---

## 🎯 CONFIGURAÇÃO DO PRODUTO

### **Produto configurado:**
```typescript
const PRODUCT_CONFIG = {
  item_id: 'hacr962',
  item_name: 'Sistema 4 Fases - Ebook Trips',
  price: 39.9,
  currency: 'BRL',
  category: 'digital_product',
  content_type: 'product'
};
```

**✅ Usa `content_ids: ['hacr962']` conforme solicitado!**

---

## 🔗 COMPATIBILIDADE COM GTM

### **GTM Web Container espera:**

**Variáveis:**
- `{{dlv - ecommerce.transaction_id}}` ✅
- `{{dlv - ecommerce.value}}` ✅
- `{{dlv - ecommerce.currency}}` ✅
- `{{dlv - ecommerce.items}}` ✅
- `{{ucv - content_ids}}` ✅
- `{{ucv - contents}}` ✅
- `{{ucv - num_items}}` ✅
- `{{dlv - user_data.*}}` ✅

**Triggers:**
- `ce - page_view` ✅
- `ce - view_item` ✅
- `ce - add_to_cart` ✅
- `ce - begin_checkout` ✅
- `ce - purchase` ✅
- `ce - generate_lead` ✅

**✅ Todos os eventos estão compatíveis!**

---

## 🚀 COMO FUNCIONA

### **Fluxo:**

1. **Evento disparado** (ex: `trackPurchaseElite()`)
2. **Prepara user_data** do localStorage/advancedDataPersistence
3. **Envia para DataLayer** via `pushPurchase()` (ou outra função)
4. **DataLayer.push()** é chamado automaticamente
5. **GTM captura** o evento via triggers
6. **Tags GA4/FB/DT** são disparadas com todos os parâmetros

---

## ✅ TESTE

### **Para testar:**

1. Abrir DevTools → Console
2. Verificar `window.dataLayer` após cada evento
3. Verificar se os eventos aparecem com todos os parâmetros

**Exemplo:**
```javascript
// Após disparar um Purchase
window.dataLayer
// Deve mostrar:
[
  {
    event: 'purchase',
    ecommerce: {
      transaction_id: '...',
      value: 39.9,
      currency: 'BRL',
      items: [...]
    },
    content_ids: ['hacr962'],
    contents: [...],
    user_data: {...}
  }
]
```

---

## 📝 PRÓXIMOS PASSOS

1. ✅ **DataLayer configurado** - Todos os eventos enviam para GTM
2. ✅ **Parâmetros completos** - Todos os campos necessários incluídos
3. ✅ **User data** - Dados do usuário incluídos automaticamente
4. ✅ **Produto configurado** - Usa `hacr962` conforme estrutura atual

**✅ Pronto para uso!** O GTM agora recebe todos os eventos com todos os parâmetros necessários. 🚀


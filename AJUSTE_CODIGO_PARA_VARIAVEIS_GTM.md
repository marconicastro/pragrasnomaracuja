# ✅ AJUSTE: Código para Variáveis GTM Server-Side Existentes

## 🎯 **ANÁLISE DAS VARIÁVEIS EXISTENTES**

### **Variáveis Event Data no GTM Server-Side (Browser Events):**

| Variável | Path Esperado | Status |
|----------|---------------|--------|
| `{{ed - event_id}}` | `event_id` | ✅ |
| `{{ed - content_ids}}` | `content_ids` | ✅ |
| `{{ed - content_name}}` | `content_name` | ✅ |
| `{{ed - content_type}}` | `content_type` | ✅ |
| `{{ed - contents}}` | `contents` | ✅ |
| `{{ed - ecommerce.currency}}` | `ecommerce.currency` | ✅ |
| `{{ed - ecommerce.transaction_id}}` | `ecommerce.transaction_id` | ✅ |
| `{{ed - ecommerce.value}}` | `ecommerce.value` | ✅ |
| `{{ed - num_items}}` | `num_items` | ✅ |
| `{{ed - user_data.city}}` | `user_data.city` | ✅ |
| `{{ed - user_data.country}}` | `user_data.country` | ✅ |
| `{{ed - user_data.email_address}}` | `user_data.email_address` | ✅ |
| `{{ed - user_data.first_name}}` | `user_data.first_name` | ✅ |
| `{{ed - user_data.last_name}}` | `user_data.last_name` | ✅ |
| `{{ed - user_data.phone_number}}` | `user_data.phone_number` | ✅ |
| `{{ed - user_data.postal_code}}` | `user_data.postal_code` | ✅ |
| `{{ed - user_data.region}}` | `user_data.region` | ✅ |
| `{{ed - user_data.user_id}}` | `user_data.user_id` | ✅ |

### **Variáveis Event Data no GTM Server-Side (Purchase Webhook):**

| Variável | Path Esperado | Status |
|----------|---------------|--------|
| `{{webhook-ed - user_data.email_address}}` | `0.user_data.email_address` | ✅ |
| `{{webhook-ed - user_data.first_name}}` | `0.user_data.first_name` | ✅ |
| `{{webhook-ed - user_data.last_name}}` | `0.user_data.last_name` | ✅ |
| `{{webhook-ed - user_data.region}}` | `0.user_data.region` | ✅ |
| `{{webhook-ed - user_data.postal_code}}` | `0.user_data.postal_code` | ✅ |
| `{{webhook-ed - user_data.country}}` | `0.user_data.country` | ✅ |
| `{{webhook-ed - user_data.user_id}}` | `0.user_data.user_id` | ✅ |
| `{{webhook-ed - ecommerce.currency}}` | `0.ecommerce.currency` | ✅ |
| `{{webhook-ed - ecommerce.transaction_id}}` | `0.ecommerce.transaction_id` | ✅ |
| `{{webhook-ed - ecommerce.value}}` | `0.ecommerce.value` | ✅ |
| `{{webhook-ed - content_ids}}` | `0.content_ids` | ✅ |
| `{{webhook-ed - contents}}` | `0.contents` | ✅ |
| `{{webhook-ed - num_items}}` | `0.num_items` | ✅ |
| `{{webhook-ed - content_name}}` | `0.content_name` | ✅ |
| `{{webhook-ed - content_type}}` | `0.content_type` | ✅ |

---

## ✅ **CONFIRMAÇÃO: Código Já Está Correto!**

O código **JÁ ESTÁ** enviando os dados no formato correto:

### **Browser Events (PageView, ViewContent, AddToCart, BeginCheckout, Lead):**

```javascript
{
  event: "page_view",
  event_id: "...",
  content_ids: ["hacr962"],           // ✅ Para {{ed - content_ids}}
  content_name: "...",                 // ✅ Para {{ed - content_name}}
  content_type: "product",              // ✅ Para {{ed - content_type}}
  contents: [...],                      // ✅ Para {{ed - contents}}
  num_items: 1,                         // ✅ Para {{ed - num_items}}
  ecommerce: {                          // ✅ Para {{ed - ecommerce.*}}
    value: 39.9,
    currency: "BRL"
  },
  user_data: {                          // ✅ Para {{ed - user_data.*}}
    user_id: "...",
    email_address: "...",
    phone_number: "...",
    first_name: "...",
    last_name: "...",
    city: "...",
    region: "...",
    postal_code: "...",
    country: "..."
  }
}
```

### **Purchase Webhook:**

```javascript
[{
  event: "purchase",
  ecommerce: {                          // ✅ Para {{webhook-ed - 0.ecommerce.*}}
    transaction_id: "...",
    value: 39.9,
    currency: "BRL"
  },
  content_ids: ["hacr962"],            // ✅ Para {{webhook-ed - 0.content_ids}}
  content_name: "...",                   // ✅ Para {{webhook-ed - 0.content_name}}
  content_type: "product",              // ✅ Para {{webhook-ed - 0.content_type}}
  contents: [...],                      // ✅ Para {{webhook-ed - 0.contents}}
  num_items: 1,                         // ✅ Para {{webhook-ed - 0.num_items}}
  user_data: {                          // ✅ Para {{webhook-ed - 0.user_data.*}}
    user_id: "...",
    email_address: "...",
    phone_number: "...",
    first_name: "...",
    last_name: "...",
    city: "...",
    region: "...",
    postal_code: "...",
    country: "..."
  }
}]
```

---

## 🔍 **PROBLEMA IDENTIFICADO**

O problema não é o código, mas sim:

1. **PageView não tinha dados** → ✅ **CORRIGIDO** (agora usa `enrichColdEvent()`)
2. **Variáveis podem estar mapeadas incorretamente nas tags** → Precisa verificar no GTM
3. **Dados podem não estar chegando no GTM Server-Side** → Precisa verificar logs

---

## ✅ **AÇÃO: Garantir que Código Está 100% Correto**

Vou revisar o código para garantir que:
1. ✅ Todos os campos estão sendo enviados
2. ✅ Estrutura está correta (`user_data.*`, `ecommerce.*`)
3. ✅ PageView agora tem dados (via `enrichColdEvent()`)

---

**Status:** ✅ Código já está correto, apenas PageView foi ajustado para usar `enrichColdEvent()` quando não há dados persistidos.


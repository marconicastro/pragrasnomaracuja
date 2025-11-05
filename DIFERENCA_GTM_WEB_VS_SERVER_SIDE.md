# 🔍 DIFERENÇA: GTM Web vs GTM Server-Side (Webhook)

**Problema:** Variáveis no GTM Web já estão configuradas, mas webhook precisa de variáveis diferentes.

---

## 📊 ANÁLISE

### **GTM Web (Browser Events):**
- **Fonte:** DataLayer do browser (`window.dataLayer`)
- **Tipo de Variável:** Data Layer Variable (`{{dlv - *}}`)
- **Path:** `ecommerce.value`, `ecommerce.currency`, etc.
- **Exemplo:** `{{dlv - ecommerce.value}}`

### **GTM Server-Side (Webhook Events):**
- **Fonte:** Payload direto do evento (via `/data` endpoint)
- **Tipo de Variável:** Event Data Variable (`{{ed - *}}`)
- **Path:** `ecommerce.value`, `ecommerce.currency`, etc. (mesmo path!)
- **Exemplo:** `{{ed - ecommerce.value}}`

---

## ✅ SOLUÇÃO

**Os paths são os MESMOS, apenas o tipo de variável muda!**

### **Para Webhook (Purchase):**
- Criar variáveis **Event Data Variable** (`{{ed - *}}`)
- Usar os **mesmos paths** que já existem no GTM Web
- Mapear na tag "FB - Purchase" (que já está configurada)

---

## 📋 COMPARAÇÃO

### **GTM Web (já configurado):**
```
Variável: dlv - ecommerce.value
Tipo: Data Layer Variable
Path: ecommerce.value
Uso: PageView, ViewContent, AddToCart, Lead, InitiateCheckout (browser)
```

### **GTM Server-Side (precisa criar):**
```
Variável: ed - ecommerce.value
Tipo: Event Data Variable
Path: ecommerce.value  ← MESMO PATH!
Uso: Purchase (webhook)
```

---

## 🎯 AÇÃO

**Criar variáveis Event Data (`{{ed - *}}`) com os mesmos paths do GTM Web:**

1. `ed - ecommerce.currency` (Path: `ecommerce.currency`)
2. `ed - ecommerce.value` (Path: `ecommerce.value`)
3. `ed - ecommerce.transaction_id` (Path: `ecommerce.transaction_id`)
4. `ed - content_name` (Path: `content_name`)
5. `ed - content_type` (Path: `content_type`)
6. `ed - content_ids` (Path: `content_ids`)
7. `ed - contents` (Path: `contents`)
8. `ed - num_items` (Path: `num_items`)
9. `ed - user_data.user_id` (Path: `user_data.user_id`)
10. `ed - user_data.email_address` (Path: `user_data.email_address`)
11. `ed - user_data.phone_number` (Path: `user_data.phone_number`)
12. ... (e todas as outras)

**Mapear na tag "FB - Purchase" usando `{{ed - *}}` ao invés de `{{dlv - *}}`**

---

## ✅ CONCLUSÃO

**Você está correto!** Precisamos criar variáveis Event Data (`{{ed - *}}`) para acessar os dados do webhook, mesmo que os paths sejam os mesmos do GTM Web.

**Por que?**
- GTM Web usa Data Layer Variables (acessam `window.dataLayer`)
- GTM Server-Side (webhook) usa Event Data Variables (acessam payload do evento)

**Mas os paths são os mesmos porque o formato do payload é o mesmo!** ✅




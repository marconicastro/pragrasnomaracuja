# 📋 RESUMO: Variáveis Content - Já Estão Corretas!

---

## ✅ VARIÁVEIS QUE JÁ ESTÃO CORRETAS (NÃO MEXER)

### **Content (nível raiz):**
- ✅ `{{ed - content_ids}}` → Path: `content_ids` ✅
- ✅ `{{ed - contents}}` → Path: `contents` ✅
- ✅ `{{ed - num_items}}` → Path: `num_items` ✅
- ✅ `{{ed - content_name}}` → Path: `content_name` ✅
- ✅ `{{ed - content_type}}` → Path: `content_type` ✅

### **Metadata (nível raiz):**
- ✅ `{{ed - event_id}}` → Path: `event_id` ✅

---

## ❌ VARIÁVEIS QUE PRECISAM CORREÇÃO (aninhadas)

### **Ecommerce (dentro de `ecommerce`):**
- ❌ `{{ed - value}}` → ✅ `{{ed - ecommerce.value}}`
- ❌ `{{ed - currency}}` → ✅ `{{ed - ecommerce.currency}}`
- ❌ `{{ed - transaction_id}}` → ✅ `{{ed - ecommerce.transaction_id}}`

### **User Data (dentro de `user_data`):**
- ❌ `{{ed - email_address}}` → ✅ `{{ed - user_data.email_address}}`
- ❌ `{{ed - first_name}}` → ✅ `{{ed - user_data.first_name}}`
- ❌ `{{ed - last_name}}` → ✅ `{{ed - user_data.last_name}}`
- ❌ `{{ed - phone_number}}` → ✅ `{{ed - user_data.phone_number}}`
- ❌ `{{ed - city}}` → ✅ `{{ed - user_data.city}}`
- ❌ `{{ed - region}}` → ✅ `{{ed - user_data.region}}`
- ❌ `{{ed - postal_code}}` → ✅ `{{ed - user_data.postal_code}}`
- ❌ `{{ed - country}}` → ✅ `{{ed - user_data.country}}`

---

## 🎯 AÇÃO

### **NÃO mexer nas variáveis de Content:**
- `content_ids`, `contents`, `num_items`, `content_name`, `content_type` → **JÁ ESTÃO CORRETAS** ✅

### **Corrigir apenas as variáveis aninhadas:**
- `ecommerce.value`, `ecommerce.currency`, `ecommerce.transaction_id` → **CORRIGIR** 🔧
- `user_data.email_address`, `user_data.first_name`, etc. → **CORRIGIR** 🔧

---

## 📊 ESTRUTURA DO PAYLOAD

```
{
  event: 'purchase',
  ecommerce: {              ← NÍVEL ANINHADO (precisa path completo)
    value: 39.9,
    currency: 'BRL',
    transaction_id: '...'
  },
  content_ids: [...],      ← NÍVEL RAIZ (path simples)
  contents: [...],         ← NÍVEL RAIZ (path simples)
  num_items: 1,           ← NÍVEL RAIZ (path simples)
  content_name: '...',     ← NÍVEL RAIZ (path simples)
  content_type: 'product', ← NÍVEL RAIZ (path simples)
  user_data: {            ← NÍVEL ANINHADO (precisa path completo)
    email_address: '...',
    first_name: '...',
    ...
  },
  event_id: '...'         ← NÍVEL RAIZ (path simples)
}
```

---

## ✅ CONCLUSÃO

**Variáveis Content:** ✅ **Já estão corretas, não precisa mexer!**

**Variáveis Ecommerce e User Data:** 🔧 **Precisam correção (paths aninhados)**




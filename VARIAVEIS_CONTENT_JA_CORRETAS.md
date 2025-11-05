# ✅ VARIÁVEIS CONTENT: Já Estão Corretas!

**Análise:** `content_ids`, `contents`, `num_items`, `content_name`, `content_type` estão no nível raiz do payload.

---

## 📊 ESTRUTURA DO PAYLOAD

### **Webhook (Purchase):**
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: '...',
    value: 39.9,
    currency: 'BRL'
  },
  content_ids: ['hacr962'],        // ← NÍVEL RAIZ ✅
  contents: [...],                 // ← NÍVEL RAIZ ✅
  content_name: '...',             // ← NÍVEL RAIZ ✅
  content_type: 'product',         // ← NÍVEL RAIZ ✅
  num_items: 1,                    // ← NÍVEL RAIZ ✅
  user_data: {
    email_address: '...',
    ...
  }
}
```

### **Browser (ViewContent, AddToCart, etc.):**
```javascript
{
  event: 'view_item',
  ecommerce: {
    value: 39.9,
    currency: 'BRL'
  },
  content_ids: ['hacr962'],        // ← NÍVEL RAIZ ✅
  contents: [...],                 // ← NÍVEL RAIZ ✅
  content_name: '...',             // ← NÍVEL RAIZ ✅
  content_type: 'product',         // ← NÍVEL RAIZ ✅
  num_items: 1,                    // ← NÍVEL RAIZ ✅
  user_data: {
    email_address: '...',
    ...
  }
}
```

---

## ✅ VARIÁVEIS JÁ CORRETAS

### **Essas variáveis NÃO precisam ser corrigidas:**

1. **`{{ed - content_ids}}`** ✅
   - Path: `content_ids`
   - Status: **JÁ ESTÁ CORRETO** (nível raiz)

2. **`{{ed - contents}}`** ✅
   - Path: `contents`
   - Status: **JÁ ESTÁ CORRETO** (nível raiz)

3. **`{{ed - num_items}}`** ✅
   - Path: `num_items`
   - Status: **JÁ ESTÁ CORRETO** (nível raiz)

4. **`{{ed - content_name}}`** ✅
   - Path: `content_name`
   - Status: **JÁ ESTÁ CORRETO** (nível raiz)

5. **`{{ed - content_type}}`** ✅
   - Path: `content_type`
   - Status: **JÁ ESTÁ CORRETO** (nível raiz)

---

## 🔍 COMPARAÇÃO

### **Campos que PRECISAM correção (aninhados):**
- ❌ `{{ed - value}}` → ✅ `{{ed - ecommerce.value}}`
- ❌ `{{ed - currency}}` → ✅ `{{ed - ecommerce.currency}}`
- ❌ `{{ed - transaction_id}}` → ✅ `{{ed - ecommerce.transaction_id}}`
- ❌ `{{ed - email_address}}` → ✅ `{{ed - user_data.email_address}}`
- ❌ `{{ed - first_name}}` → ✅ `{{ed - user_data.first_name}}`
- etc.

### **Campos que JÁ ESTÃO CORRETOS (nível raiz):**
- ✅ `{{ed - content_ids}}` → Path: `content_ids` (correto)
- ✅ `{{ed - contents}}` → Path: `contents` (correto)
- ✅ `{{ed - num_items}}` → Path: `num_items` (correto)
- ✅ `{{ed - content_name}}` → Path: `content_name` (correto)
- ✅ `{{ed - content_type}}` → Path: `content_type` (correto)
- ✅ `{{ed - event_id}}` → Path: `event_id` (correto)

---

## 📋 RESUMO COMPLETO

### **Variáveis que PRECISAM ser criadas/corrigidas (11 variáveis):**

#### **Custom Data (3 variáveis):**
1. `ed - ecommerce.value` (Path: `ecommerce.value`)
2. `ed - ecommerce.currency` (Path: `ecommerce.currency`)
3. `ed - ecommerce.transaction_id` (Path: `ecommerce.transaction_id`)

#### **User Data (8 variáveis):**
4. `ed - user_data.email_address` (Path: `user_data.email_address`)
5. `ed - user_data.first_name` (Path: `user_data.first_name`)
6. `ed - user_data.last_name` (Path: `user_data.last_name`)
7. `ed - user_data.phone_number` (Path: `user_data.phone_number`)
8. `ed - user_data.city` (Path: `user_data.city`)
9. `ed - user_data.region` (Path: `user_data.region`)
10. `ed - user_data.postal_code` (Path: `user_data.postal_code`)
11. `ed - user_data.country` (Path: `user_data.country`)

---

### **Variáveis que JÁ ESTÃO CORRETAS (6 variáveis):**

#### **Content (5 variáveis):**
1. ✅ `ed - content_ids` (Path: `content_ids`) - **JÁ ESTÁ CORRETO**
2. ✅ `ed - contents` (Path: `contents`) - **JÁ ESTÁ CORRETO**
3. ✅ `ed - num_items` (Path: `num_items`) - **JÁ ESTÁ CORRETO**
4. ✅ `ed - content_name` (Path: `content_name`) - **JÁ ESTÁ CORRETO**
5. ✅ `ed - content_type` (Path: `content_type`) - **JÁ ESTÁ CORRETO**

#### **Metadata (1 variável):**
6. ✅ `ed - event_id` (Path: `event_id`) - **JÁ ESTÁ CORRETO**

---

## 🎯 AÇÃO

### **O que fazer:**

1. **NÃO mexer** nas variáveis de Content:
   - `{{ed - content_ids}}` ✅
   - `{{ed - contents}}` ✅
   - `{{ed - num_items}}` ✅
   - `{{ed - content_name}}` ✅
   - `{{ed - content_type}}` ✅

2. **Corrigir apenas** as variáveis de Ecommerce e User Data:
   - `{{ed - ecommerce.value}}`
   - `{{ed - ecommerce.currency}}`
   - `{{ed - ecommerce.transaction_id}}`
   - `{{ed - user_data.email_address}}`
   - etc.

---

## ✅ CHECKLIST FINAL

### **Variáveis a Criar/Corrigir (11 variáveis):**
- [ ] `ed - ecommerce.value`
- [ ] `ed - ecommerce.currency`
- [ ] `ed - ecommerce.transaction_id`
- [ ] `ed - user_data.email_address`
- [ ] `ed - user_data.first_name`
- [ ] `ed - user_data.last_name`
- [ ] `ed - user_data.phone_number`
- [ ] `ed - user_data.city`
- [ ] `ed - user_data.region`
- [ ] `ed - user_data.postal_code`
- [ ] `ed - user_data.country`

### **Variáveis que JÁ ESTÃO CORRETAS (não mexer):**
- [x] `ed - content_ids` ✅
- [x] `ed - contents` ✅
- [x] `ed - num_items` ✅
- [x] `ed - content_name` ✅
- [x] `ed - content_type` ✅
- [x] `ed - event_id` ✅

---

## 🎉 CONCLUSÃO

**As variáveis de Content (`content_ids`, `contents`, `num_items`, `content_name`, `content_type`) já estão corretas!**

**Não precisa mexer nelas.** ✅

**Apenas corrigir as variáveis de Ecommerce e User Data que estão aninhadas.** 🔧




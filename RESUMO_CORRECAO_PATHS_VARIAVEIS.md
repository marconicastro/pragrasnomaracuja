# 🎯 RESUMO: Corrigir Paths das Variáveis Event Data

**Problema:** Variáveis Event Data retornam `undefined` porque os paths estão incorretos.

**Solução:** Corrigir os paths das variáveis para acessar os dados corretos do payload.

---

## 🔍 DIAGNÓSTICO

### **Tag "FB - Purchase" já está mapeada ✅**
### **Variáveis Event Data já existem ✅**
### **MAS os paths estão errados ❌**

---

## ❌ PATHS INCORRETOS (ATUAL)

### **Custom Data:**
- `{{ed - value}}` → Path: `value` ❌
- `{{ed - currency}}` → Path: `currency` ❌
- `{{ed - transaction_id}}` → Path: `transaction_id` ❌

### **User Data:**
- `{{ed - email_address}}` → Path: `email_address` ❌
- `{{ed - first_name}}` → Path: `first_name` ❌
- `{{ed - last_name}}` → Path: `last_name` ❌
- `{{ed - phone_number}}` → Path: `phone_number` ❌
- `{{ed - city}}` → Path: `city` ❌
- `{{ed - region}}` → Path: `region` ❌
- `{{ed - postal_code}}` → Path: `postal_code` ❌
- `{{ed - country}}` → Path: `country` ❌

---

## ✅ PATHS CORRETOS (CORRIGIR)

### **Custom Data - Ecommerce (aninhados):**
- `{{ed - ecommerce.value}}` → Path: `ecommerce.value` ✅
- `{{ed - ecommerce.currency}}` → Path: `ecommerce.currency` ✅
- `{{ed - ecommerce.transaction_id}}` → Path: `ecommerce.transaction_id` ✅

### **Custom Data - Content (nível raiz - JÁ ESTÃO CORRETAS):**
- `{{ed - content_ids}}` → Path: `content_ids` ✅ **JÁ ESTÁ CORRETO**
- `{{ed - contents}}` → Path: `contents` ✅ **JÁ ESTÁ CORRETO**
- `{{ed - num_items}}` → Path: `num_items` ✅ **JÁ ESTÁ CORRETO**
- `{{ed - content_name}}` → Path: `content_name` ✅ **JÁ ESTÁ CORRETO**
- `{{ed - content_type}}` → Path: `content_type` ✅ **JÁ ESTÁ CORRETO**

### **User Data (aninhados):**
- `{{ed - user_data.email_address}}` → Path: `user_data.email_address` ✅
- `{{ed - user_data.first_name}}` → Path: `user_data.first_name` ✅
- `{{ed - user_data.last_name}}` → Path: `user_data.last_name` ✅
- `{{ed - user_data.phone_number}}` → Path: `user_data.phone_number` ✅
- `{{ed - user_data.city}}` → Path: `user_data.city` ✅
- `{{ed - user_data.region}}` → Path: `user_data.region` ✅
- `{{ed - user_data.postal_code}}` → Path: `user_data.postal_code` ✅
- `{{ed - user_data.country}}` → Path: `user_data.country` ✅

### **Metadata (nível raiz - JÁ ESTÁ CORRETO):**
- `{{ed - event_id}}` → Path: `event_id` ✅ **JÁ ESTÁ CORRETO**

---

## 🔧 CORREÇÕES NECESSÁRIAS

### **1. Criar/Corrigir Variáveis Event Data (11 variáveis):**

#### **Custom Data (3 variáveis):**
1. **`ed - ecommerce.value`**
   - Tipo: Event Data Variable
   - Path: `ecommerce.value`

2. **`ed - ecommerce.currency`**
   - Tipo: Event Data Variable
   - Path: `ecommerce.currency`

3. **`ed - ecommerce.transaction_id`**
   - Tipo: Event Data Variable
   - Path: `ecommerce.transaction_id`

#### **User Data (8 variáveis):**
4. **`ed - user_data.email_address`**
   - Tipo: Event Data Variable
   - Path: `user_data.email_address`

5. **`ed - user_data.first_name`**
   - Tipo: Event Data Variable
   - Path: `user_data.first_name`

6. **`ed - user_data.last_name`**
   - Tipo: Event Data Variable
   - Path: `user_data.last_name`

7. **`ed - user_data.phone_number`**
   - Tipo: Event Data Variable
   - Path: `user_data.phone_number`

8. **`ed - user_data.city`**
   - Tipo: Event Data Variable
   - Path: `user_data.city`

9. **`ed - user_data.region`**
   - Tipo: Event Data Variable
   - Path: `user_data.region`

10. **`ed - user_data.postal_code`**
    - Tipo: Event Data Variable
    - Path: `user_data.postal_code`

11. **`ed - user_data.country`**
    - Tipo: Event Data Variable
    - Path: `user_data.country`

---

### **2. Atualizar Tag "FB - Purchase":**

#### **Custom Data:**
- `value` → `{{ed - ecommerce.value}}` (ao invés de `{{ed - value}}`)
- `currency` → `{{ed - ecommerce.currency}}` (ao invés de `{{ed - currency}}`)
- `order_id` → `{{ed - ecommerce.transaction_id}}` (ao invés de `{{ed - transaction_id}}`)

#### **User Data:**
- `Email` → `{{ed - user_data.email_address}}` (ao invés de `{{ed - email_address}}`)
- `First Name` → `{{ed - user_data.first_name}}` (ao invés de `{{ed - first_name}}`)
- `Last Name` → `{{ed - user_data.last_name}}` (ao invés de `{{ed - last_name}}`)
- `Phone` → `{{ed - user_data.phone_number}}` (ao invés de `{{ed - phone_number}}`)
- `City` → `{{ed - user_data.city}}` (ao invés de `{{ed - city}}`)
- `State` → `{{ed - user_data.region}}` (ao invés de `{{ed - region}}`)
- `Zip` → `{{ed - user_data.postal_code}}` (ao invés de `{{ed - postal_code}}`)
- `Country` → `{{ed - user_data.country}}` (ao invés de `{{ed - country}}`)

---

## 📋 CHECKLIST RÁPIDO

### **Variáveis a Criar/Corrigir:**
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

### **Variáveis que JÁ ESTÃO CORRETAS (não mexer):**
- [x] `ed - content_ids` ✅ (Path: `content_ids` - nível raiz)
- [x] `ed - contents` ✅ (Path: `contents` - nível raiz)
- [x] `ed - num_items` ✅ (Path: `num_items` - nível raiz)
- [x] `ed - content_name` ✅ (Path: `content_name` - nível raiz)
- [x] `ed - content_type` ✅ (Path: `content_type` - nível raiz)
- [x] `ed - event_id` ✅ (Path: `event_id` - nível raiz)

### **Tag a Atualizar:**
- [ ] Tag "FB - Purchase" → Custom Data (3 campos: value, currency, order_id)
- [ ] Tag "FB - Purchase" → User Data (8 campos: email, first_name, etc.)
- [x] Tag "FB - Purchase" → Custom Data (5 campos de Content já estão corretos) ✅

---

## ✅ RESULTADO ESPERADO

Após corrigir:
- ✅ Variáveis retornam valores (não mais `undefined`)
- ✅ Tag "FB - Purchase" dispara com dados corretos
- ✅ Payload enviado ao Meta tem `custom_data` completo
- ✅ Payload enviado ao Meta tem `user_data` completo
- ✅ Meta aceita evento sem erro

---

## 🎯 RESUMO EM 1 FRASE

**Corrigir paths das variáveis Event Data de `value` → `ecommerce.value`, `email_address` → `user_data.email_address`, etc.**


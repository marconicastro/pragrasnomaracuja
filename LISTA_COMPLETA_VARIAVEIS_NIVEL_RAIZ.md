# 📋 LISTA COMPLETA: Variáveis do Nível Raiz Necessárias

## 🎯 **ANÁLISE DOS DADOS REAIS**

Baseado nos dados do evento `begin_checkout` que você enviou, os dados que **CHEGAM** no GTM Server-Side são:

### **✅ Dados que CHEGAM no Nível Raiz:**
- ✅ `currency: "BRL"`
- ✅ `value: 39.9`
- ✅ `content_ids: ["hacr962"]`
- ✅ `contents: [{id: "hacr962", quantity: 1, item_price: 39.9}]`
- ✅ `num_items: 1`
- ✅ `email_address: "ana.silva@email.com"`
- ✅ `phone_number: "11999999888"`
- ✅ `first_name: "Ana"`
- ✅ `last_name: "Silva"`
- ✅ `city: "caculé"`
- ✅ `region: "ba"`
- ✅ `country: "BR"`
- ✅ `postal_code: "46300"`
- ✅ `user_id: "sess_1762031294521_e5kv5ly8b"`

### **❌ Dados que NÃO CHEGAM:**
- ❌ `content_name` (não aparece nos dados)
- ❌ `content_type` (não aparece nos dados)
- ❌ `ecommerce.value` (só tem `value` no nível raiz)
- ❌ `ecommerce.currency` (só tem `currency` no nível raiz)
- ❌ `user_data.city` (Stape.io transformou para `user_data.address.city`)

---

## ✅ **VARIÁVEIS A CRIAR (Nível Raiz)**

### **1. Custom Data (para resolver erro 400):**
- [ ] **`ed - currency`** → Path: `currency` ⚠️ **URGENTE**
- [ ] **`ed - value`** → Path: `value`

### **2. User Data (nível raiz - funcionam!):**
- [ ] **`ed - email_address`** → Path: `email_address`
- [ ] **`ed - phone_number`** → Path: `phone_number`
- [ ] **`ed - first_name`** → Path: `first_name`
- [ ] **`ed - last_name`** → Path: `last_name`
- [ ] **`ed - city`** → Path: `city`
- [ ] **`ed - region`** → Path: `region`
- [ ] **`ed - postal_code`** → Path: `postal_code`
- [ ] **`ed - country`** → Path: `country`
- [ ] **`ed - user_id`** → Path: `user_id`

### **3. User Data (Stape.io transforma para address.*):**
- [ ] **`ed - user_data.address.city`** → Path: `user_data.address.city`
- [ ] **`ed - user_data.address.region`** → Path: `user_data.address.region`
- [ ] **`ed - user_data.address.country`** → Path: `user_data.address.country`
- [ ] **`ed - user_data.address.postal_code`** → Path: `user_data.address.postal_code`
- [ ] **`ed - user_data.address.first_name`** → Path: `user_data.address.first_name`
- [ ] **`ed - user_data.address.last_name`** → Path: `user_data.address.last_name`

### **4. User Data (dentro de user_data - funcionam!):**
- [ ] **`ed - user_data.email_address`** → Path: `user_data.email_address`
- [ ] **`ed - user_data.phone_number`** → Path: `user_data.phone_number`

---

## 🎯 **ATUALIZAR TODAS AS TAGS**

### **FB - ViewContent, FB - AddToCart, FB - InitiateCheckout:**

**Custom Data:**
- `currency`: `{{ed - currency}}` ✅
- `value`: `{{ed - value}}` ✅

**User Data:**
- `Email`: `{{ed - email_address}}` ✅ (nível raiz funciona!)
- `Phone`: `{{ed - phone_number}}` ✅ (nível raiz funciona!)
- `First Name`: `{{ed - first_name}}` ✅ (nível raiz funciona!)
- `Last Name`: `{{ed - last_name}}` ✅ (nível raiz funciona!)
- `City`: `{{ed - city}}` ✅ (nível raiz funciona!) OU `{{ed - user_data.address.city}}` (fallback)
- `State`: `{{ed - region}}` ✅ (nível raiz funciona!) OU `{{ed - user_data.address.region}}` (fallback)
- `Country`: `{{ed - country}}` ✅ (nível raiz funciona!) OU `{{ed - user_data.address.country}}` (fallback)
- `Zip`: `{{ed - postal_code}}` ✅ (nível raiz funciona!) OU `{{ed - user_data.address.postal_code}}` (fallback)
- `External ID`: `{{ed - user_id}}` ✅ (nível raiz funciona!)

---

## 📋 **TOTAL DE VARIÁVEIS A CRIAR**

**Total: 18 variáveis**

### **Prioridade 1 (Resolver erro 400):**
1. `ed - currency` ⚠️ **URGENTE**
2. `ed - value`

### **Prioridade 2 (User Data nível raiz):**
3. `ed - email_address`
4. `ed - phone_number`
5. `ed - first_name`
6. `ed - last_name`
7. `ed - city`
8. `ed - region`
9. `ed - postal_code`
10. `ed - country`
11. `ed - user_id`

### **Prioridade 3 (User Data address.* - fallback):**
12. `ed - user_data.address.city`
13. `ed - user_data.address.region`
14. `ed - user_data.address.country`
15. `ed - user_data.address.postal_code`
16. `ed - user_data.address.first_name`
17. `ed - user_data.address.last_name`

### **Prioridade 4 (User Data direto):**
18. `ed - user_data.email_address` (já existe, verificar se funciona)
19. `ed - user_data.phone_number` (já existe, verificar se funciona)

---

## ⚠️ **PROBLEMA: content_name e content_type**

Esses campos **NÃO CHEGAM** no GTM Server-Side, mesmo o código enviando.

**Possíveis soluções:**
1. Verificar se Stape.io está filtrando esses campos
2. Usar valores fixos nas tags (não ideal)
3. Investigar por que não chegam (pode ser configuração do Stape.io)

---

**Status:** ⚠️ **CRIAR 18 VARIÁVEIS E ATUALIZAR 3 TAGS**


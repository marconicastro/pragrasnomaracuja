# ✅ SOLUÇÃO DEFINITIVA: Usar Variáveis do Nível Raiz

## 🎯 **PROBLEMA IDENTIFICADO**

Os dados **CHEGAM** no GTM Server-Side no nível raiz:
- ✅ `currency: "BRL"` (nível raiz)
- ✅ `value: 39.9` (nível raiz)
- ✅ `email_address: "ana.silva@email.com"` (nível raiz)
- ✅ `first_name: "Ana"` (nível raiz)
- ✅ `city: "caculé"` (nível raiz)

Mas as variáveis Event Data estão configuradas para paths que não funcionam:
- ❌ `{{ed - ecommerce.currency}}` → `ecommerce.currency` (não existe nos dados!)
- ❌ `{{ed - user_data.city}}` → `user_data.city` (dados estão em `user_data.address.city`)

---

## ✅ **SOLUÇÃO: Criar Variáveis do Nível Raiz**

### **Variáveis a Criar (TODAS no nível raiz):**

1. **`ed - currency`** → Path: `currency`
2. **`ed - value`** → Path: `value`
3. **`ed - email_address`** → Path: `email_address`
4. **`ed - phone_number`** → Path: `phone_number`
5. **`ed - first_name`** → Path: `first_name`
6. **`ed - last_name`** → Path: `last_name`
7. **`ed - city`** → Path: `city`
8. **`ed - region`** → Path: `region`
9. **`ed - postal_code`** → Path: `postal_code`
10. **`ed - country`** → Path: `country`

### **Variáveis para user_data.address.* (Stape.io transforma):**

11. **`ed - user_data.address.city`** → Path: `user_data.address.city`
12. **`ed - user_data.address.region`** → Path: `user_data.address.region`
13. **`ed - user_data.address.country`** → Path: `user_data.address.country`
14. **`ed - user_data.address.postal_code`** → Path: `user_data.address.postal_code`
15. **`ed - user_data.address.first_name`** → Path: `user_data.address.first_name`
16. **`ed - user_data.address.last_name`** → Path: `user_data.address.last_name`

---

## 🎯 **ATUALIZAR TODAS AS TAGS**

### **FB - ViewContent, FB - AddToCart, FB - InitiateCheckout:**

**Custom Data:**
- `currency`: `{{ed - currency}}` ✅
- `value`: `{{ed - value}}` ✅

**User Data:**
- `Email`: `{{ed - email_address}}` ✅
- `Phone`: `{{ed - phone_number}}` ✅
- `First Name`: `{{ed - first_name}}` ✅
- `Last Name`: `{{ed - last_name}}` ✅
- `City`: `{{ed - city}}` ✅ (ou `{{ed - user_data.address.city}}` como fallback)
- `State`: `{{ed - region}}` ✅ (ou `{{ed - user_data.address.region}}` como fallback)
- `Country`: `{{ed - country}}` ✅ (ou `{{ed - user_data.address.country}}` como fallback)
- `Zip`: `{{ed - postal_code}}` ✅ (ou `{{ed - user_data.address.postal_code}}` como fallback)

---

## 📋 **CHECKLIST COMPLETO**

### **Criar 16 Variáveis:**
- [ ] `ed - currency`
- [ ] `ed - value`
- [ ] `ed - email_address`
- [ ] `ed - phone_number`
- [ ] `ed - first_name`
- [ ] `ed - last_name`
- [ ] `ed - city`
- [ ] `ed - region`
- [ ] `ed - postal_code`
- [ ] `ed - country`
- [ ] `ed - user_data.address.city`
- [ ] `ed - user_data.address.region`
- [ ] `ed - user_data.address.country`
- [ ] `ed - user_data.address.postal_code`
- [ ] `ed - user_data.address.first_name`
- [ ] `ed - user_data.address.last_name`

### **Atualizar 3 Tags:**
- [ ] FB - ViewContent
- [ ] FB - AddToCart
- [ ] FB - InitiateCheckout

---

**Status:** ⚠️ **CRIAR 16 VARIÁVEIS E ATUALIZAR 3 TAGS**


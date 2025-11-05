# 🔧 CORREÇÃO: Paths das Variáveis Event Data

**Problema:** Variáveis Event Data estão retornando `undefined` porque os paths estão incorretos.

**Causa:** O payload do webhook tem estrutura aninhada (`ecommerce.value`, `user_data.email_address`), mas as variáveis estão acessando no nível raiz (`value`, `email_address`).

---

## ❌ PATHS INCORRETOS (ATUAL)

### **Custom Data:**
- `{{ed - value}}` → ❌ **ERRADO** (deveria ser `ecommerce.value`)
- `{{ed - currency}}` → ❌ **ERRADO** (deveria ser `ecommerce.currency`)
- `{{ed - transaction_id}}` → ❌ **ERRADO** (deveria ser `ecommerce.transaction_id`)

### **User Data:**
- `{{ed - email_address}}` → ❌ **ERRADO** (deveria ser `user_data.email_address`)
- `{{ed - first_name}}` → ❌ **ERRADO** (deveria ser `user_data.first_name`)
- `{{ed - last_name}}` → ❌ **ERRADO** (deveria ser `user_data.last_name`)
- `{{ed - phone_number}}` → ❌ **ERRADO** (deveria ser `user_data.phone_number`)
- `{{ed - city}}` → ❌ **ERRADO** (deveria ser `user_data.city`)
- `{{ed - region}}` → ❌ **ERRADO** (deveria ser `user_data.region`)
- `{{ed - postal_code}}` → ❌ **ERRADO** (deveria ser `user_data.postal_code`)
- `{{ed - country}}` → ❌ **ERRADO** (deveria ser `user_data.country`)

---

## ✅ PATHS CORRETOS (CORRIGIR)

### **Estrutura do Payload Enviado:**
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: '...',
    value: 39.9,
    currency: 'BRL'
  },
  content_ids: ['hacr962'],
  contents: [...],
  content_name: '...',
  content_type: 'product',
  num_items: 1,
  user_data: {
    email_address: '...',
    first_name: '...',
    last_name: '...',
    phone_number: '...',
    city: '...',
    region: '...',
    postal_code: '...',
    country: 'BR'
  },
  event_id: '...'
}
```

---

## 🔧 CORREÇÕES NECESSÁRIAS

### **1. Criar/Corrigir Variáveis Event Data:**

#### **Custom Data:**
1. **`ed - ecommerce.value`**
   - Path: `ecommerce.value`
   - Usar na tag: `{{ed - ecommerce.value}}`

2. **`ed - ecommerce.currency`**
   - Path: `ecommerce.currency`
   - Usar na tag: `{{ed - ecommerce.currency}}`

3. **`ed - ecommerce.transaction_id`**
   - Path: `ecommerce.transaction_id`
   - Usar na tag: `{{ed - ecommerce.transaction_id}}`

4. **`ed - content_ids`** ✅ (já está correto - nível raiz)
   - Path: `content_ids`
   - Usar na tag: `{{ed - content_ids}}`

5. **`ed - contents`** ✅ (já está correto - nível raiz)
   - Path: `contents`
   - Usar na tag: `{{ed - contents}}`

6. **`ed - num_items`** ✅ (já está correto - nível raiz)
   - Path: `num_items`
   - Usar na tag: `{{ed - num_items}}`

#### **User Data:**
7. **`ed - user_data.email_address`**
   - Path: `user_data.email_address`
   - Usar na tag: `{{ed - user_data.email_address}}`

8. **`ed - user_data.first_name`**
   - Path: `user_data.first_name`
   - Usar na tag: `{{ed - user_data.first_name}}`

9. **`ed - user_data.last_name`**
   - Path: `user_data.last_name`
   - Usar na tag: `{{ed - user_data.last_name}}`

10. **`ed - user_data.phone_number`**
    - Path: `user_data.phone_number`
    - Usar na tag: `{{ed - user_data.phone_number}}`

11. **`ed - user_data.city`**
    - Path: `user_data.city`
    - Usar na tag: `{{ed - user_data.city}}`

12. **`ed - user_data.region`**
    - Path: `user_data.region`
    - Usar na tag: `{{ed - user_data.region}}`

13. **`ed - user_data.postal_code`**
    - Path: `user_data.postal_code`
    - Usar na tag: `{{ed - user_data.postal_code}}`

14. **`ed - user_data.country`**
    - Path: `user_data.country`
    - Usar na tag: `{{ed - user_data.country}}`

#### **Metadata:**
15. **`ed - event_id`** ✅ (já está correto - nível raiz)
    - Path: `event_id`
    - Usar na tag: `{{ed - event_id}}`

---

## 📋 CHECKLIST DE CORREÇÃO

### **Passo 1: Criar/Corrigir Variáveis Event Data**

No GTM Server-Side → **Variáveis** → **Nova** (ou editar existentes):

#### **Custom Data (3 variáveis):**
- [ ] `ed - ecommerce.value` (Path: `ecommerce.value`)
- [ ] `ed - ecommerce.currency` (Path: `ecommerce.currency`)
- [ ] `ed - ecommerce.transaction_id` (Path: `ecommerce.transaction_id`)

#### **User Data (8 variáveis):**
- [ ] `ed - user_data.email_address` (Path: `user_data.email_address`)
- [ ] `ed - user_data.first_name` (Path: `user_data.first_name`)
- [ ] `ed - user_data.last_name` (Path: `user_data.last_name`)
- [ ] `ed - user_data.phone_number` (Path: `user_data.phone_number`)
- [ ] `ed - user_data.city` (Path: `user_data.city`)
- [ ] `ed - user_data.region` (Path: `user_data.region`)
- [ ] `ed - user_data.postal_code` (Path: `user_data.postal_code`)
- [ ] `ed - user_data.country` (Path: `user_data.country`)

### **Passo 2: Atualizar Tag "FB - Purchase"**

Na tag **FB - Purchase**, substituir:

#### **Custom Data:**
- [ ] `value` → `{{ed - ecommerce.value}}` (ao invés de `{{ed - value}}`)
- [ ] `currency` → `{{ed - ecommerce.currency}}` (ao invés de `{{ed - currency}}`)
- [ ] `order_id` → `{{ed - ecommerce.transaction_id}}` (ao invés de `{{ed - transaction_id}}`)
- [ ] `content_ids` → `{{ed - content_ids}}` ✅ (já está correto)
- [ ] `contents` → `{{ed - contents}}` ✅ (já está correto)
- [ ] `num_items` → `{{ed - num_items}}` ✅ (já está correto)

#### **User Data:**
- [ ] `Email` → `{{ed - user_data.email_address}}` (ao invés de `{{ed - email_address}}`)
- [ ] `First Name` → `{{ed - user_data.first_name}}` (ao invés de `{{ed - first_name}}`)
- [ ] `Last Name` → `{{ed - user_data.last_name}}` (ao invés de `{{ed - last_name}}`)
- [ ] `Phone` → `{{ed - user_data.phone_number}}` (ao invés de `{{ed - phone_number}}`)
- [ ] `City` → `{{ed - user_data.city}}` (ao invés de `{{ed - city}}`)
- [ ] `State` → `{{ed - user_data.region}}` (ao invés de `{{ed - region}}`)
- [ ] `Zip` → `{{ed - user_data.postal_code}}` (ao invés de `{{ed - postal_code}}`)
- [ ] `Country` → `{{ed - user_data.country}}` (ao invés de `{{ed - country}}`)

#### **Event Metadata:**
- [ ] `Event ID` → `{{ed - event_id}}` ✅ (já está correto)

---

## ✅ VALIDAÇÃO

Após corrigir:

1. **Enviar evento via webhook (ReqBin)**
2. **Verificar no Preview Mode:**
   - ✅ Variáveis Event Data têm valores (não mais `undefined`)
   - ✅ Tag "FB - Purchase" dispara
   - ✅ Payload enviado ao Meta tem `custom_data` completo
   - ✅ Payload enviado ao Meta tem `user_data` completo

---

## 🎯 RESUMO

**Problema:** Variáveis estão acessando `value`, `currency`, `email_address` no nível raiz, mas os dados estão em `ecommerce.value`, `ecommerce.currency`, `user_data.email_address`.

**Solução:** Criar/corrigir variáveis Event Data com paths corretos:
- `ecommerce.value` ao invés de `value`
- `ecommerce.currency` ao invés de `currency`
- `user_data.email_address` ao invés de `email_address`
- etc.

**Resultado:** Variáveis retornarão valores corretos e o payload será enviado ao Meta com todos os dados! ✅




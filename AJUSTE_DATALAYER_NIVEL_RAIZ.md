# ✅ AJUSTE: DataLayer - Campos no Nível Raiz

## 🎯 **PROBLEMA IDENTIFICADO**

As tags do GTM Server-Side esperam acessar campos no **nível raiz** do evento:
- `{{ed - email_address}}` (não só `{{ed - user_data.email_address}}`)
- `{{ed - first_name}}` (não só `{{ed - user_data.first_name}}`)
- `{{ed - value}}` (não só `{{ed - ecommerce.value}}`)
- `{{ed - currency}}` (não só `{{ed - ecommerce.currency}}`)

---

## ✅ **SOLUÇÃO APLICADA**

**Ajustados TODOS os eventos para enviar campos também no nível raiz:**

### **1. PageView**
- ✅ Campos `email_address`, `phone_number`, `first_name`, `last_name`, `city`, `region`, `postal_code`, `country` no nível raiz
- ✅ Campos também dentro de `user_data` (para compatibilidade)

### **2. ViewContent**
- ✅ Campos `value`, `currency` no nível raiz
- ✅ Campos `email_address`, `phone_number`, `first_name`, `last_name`, `city`, `region`, `postal_code`, `country` no nível raiz
- ✅ Campos também dentro de `ecommerce` e `user_data` (para compatibilidade)

### **3. AddToCart**
- ✅ Campos `value`, `currency` no nível raiz
- ✅ Campos `email_address`, `phone_number`, `first_name`, `last_name`, `city`, `region`, `postal_code`, `country` no nível raiz
- ✅ Campos também dentro de `ecommerce` e `user_data` (para compatibilidade)

### **4. BeginCheckout (InitiateCheckout)**
- ✅ Campos `value`, `currency` no nível raiz
- ✅ Campos `email_address`, `phone_number`, `first_name`, `last_name`, `city`, `region`, `postal_code`, `country` no nível raiz
- ✅ Campos também dentro de `ecommerce` e `user_data` (para compatibilidade)

### **5. GenerateLead**
- ✅ Campos `email_address`, `phone_number`, `first_name`, `last_name`, `city`, `region`, `postal_code`, `country` no nível raiz
- ✅ Campos também dentro de `user_data` (para compatibilidade)

---

## 📊 **FORMATO ANTES vs DEPOIS**

### **ANTES (apenas dentro de objetos):**
```javascript
{
  event: 'begin_checkout',
  ecommerce: {
    value: 39.9,
    currency: 'BRL'
  },
  user_data: {
    email_address: 'joao@email.com',
    first_name: 'João'
  }
}
```

**Problema:** Tags precisavam usar `{{ed - ecommerce.value}}` e `{{ed - user_data.email_address}}`

---

### **DEPOIS (também no nível raiz):**
```javascript
{
  event: 'begin_checkout',
  ecommerce: {
    value: 39.9,
    currency: 'BRL'
  },
  // ✅ Campos no nível raiz (para acesso direto)
  value: 39.9,
  currency: 'BRL',
  email_address: 'joao@email.com',
  first_name: 'João',
  // ✅ Campos também dentro de objetos (para compatibilidade)
  user_data: {
    email_address: 'joao@email.com',
    first_name: 'João'
  }
}
```

**Solução:** Tags podem usar `{{ed - value}}`, `{{ed - currency}}`, `{{ed - email_address}}`, `{{ed - first_name}}`

---

## ✅ **VARIÁVEIS QUE FUNCIONAM AGORA**

### **Custom Data (Meta):**
- `{{ed - value}}` → Acesso direto (nível raiz)
- `{{ed - currency}}` → Acesso direto (nível raiz)
- `{{ed - content_ids}}` → Acesso direto (nível raiz)
- `{{ed - content_name}}` → Acesso direto (nível raiz)
- `{{ed - content_type}}` → Acesso direto (nível raiz)
- `{{ed - num_items}}` → Acesso direto (nível raiz)
- `{{ed - contents}}` → Acesso direto (nível raiz)

### **User Data (Meta):**
- `{{ed - email_address}}` → Acesso direto (nível raiz)
- `{{ed - phone_number}}` → Acesso direto (nível raiz)
- `{{ed - first_name}}` → Acesso direto (nível raiz)
- `{{ed - last_name}}` → Acesso direto (nível raiz)
- `{{ed - city}}` → Acesso direto (nível raiz)
- `{{ed - region}}` → Acesso direto (nível raiz)
- `{{ed - postal_code}}` → Acesso direto (nível raiz)
- `{{ed - country}}` → Acesso direto (nível raiz)

**⚠️ IMPORTANTE:** Essas variáveis funcionam para eventos via GTM Web (DataLayer). Para Purchase via webhook, use variáveis com prefixo `0.` (ex: `{{ed - purchase.value}}`).

---

## 🎯 **EVENTOS AJUSTADOS**

| Evento | Função | Status |
|--------|--------|--------|
| PageView | `pushPageView()` | ✅ Campos no nível raiz |
| ViewContent | `pushViewItem()` | ✅ Campos no nível raiz |
| AddToCart | `pushAddToCart()` | ✅ Campos no nível raiz |
| BeginCheckout | `pushBeginCheckout()` | ✅ Campos no nível raiz |
| GenerateLead | `pushGenerateLead()` | ✅ Campos no nível raiz |
| Purchase | `pushPurchase()` | ⚠️ Mantém padrão (via webhook usa `0.`) |

---

## 📋 **COMPATIBILIDADE**

**✅ Mantida compatibilidade:**
- Campos ainda estão dentro de `ecommerce` e `user_data` (para uso legado)
- Campos agora também estão no nível raiz (para acesso direto)

**✅ Funciona em ambos os formatos:**
- `{{ed - value}}` → Nível raiz (novo)
- `{{ed - ecommerce.value}}` → Dentro de ecommerce (legado)

---

## ✅ **CONFIRMAÇÃO**

**Agora as tags do GTM Server-Side podem usar variáveis diretas:**
- `{{ed - email_address}}` ✅
- `{{ed - first_name}}` ✅
- `{{ed - value}}` ✅
- `{{ed - currency}}` ✅

**Sem necessidade de caminhos longos:**
- `{{ed - user_data.email_address}}` → Funciona, mas não é mais necessário
- `{{ed - ecommerce.value}}` → Funciona, mas não é mais necessário

---

**Última atualização**: 2025-01-05
**Versão**: 1.0
**Status**: ✅ IMPLEMENTADO


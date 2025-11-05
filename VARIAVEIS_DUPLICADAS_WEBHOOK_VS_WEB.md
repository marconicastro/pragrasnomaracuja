# ✅ VARIÁVEIS DUPLICADAS: Webhook vs GTM Web

## 🎯 **PROBLEMA IDENTIFICADO**

**Eventos têm formatos diferentes no GTM Server-Side:**

1. **Purchase via Webhook** → Enviado como **array** `[eventData]` → GTM coloca em `[0]`
2. **Outros eventos via GTM Web** → Enviado como **objeto direto** → Sem índice

**Resultado:** Variáveis precisam ter paths diferentes!

---

## 📊 **FORMATOS DOS EVENTOS**

### **1. Purchase via Webhook (Server-Side)**

**Formato enviado:**
```json
[
  {
    "event": "purchase",
    "ecommerce": { "currency": "BRL", ... },
    "user_data": { "email_address": "...", ... }
  }
]
```

**Como GTM Server-Side processa:**
```
0: {
  event: "purchase",
  ecommerce: { currency: "BRL", ... },
  user_data: { email_address: "...", ... }
}
```

**Paths necessários:** `0.ecommerce.currency`, `0.user_data.email_address`

---

### **2. Outros Eventos via GTM Web (DataLayer)**

**Formato enviado (via `window.dataLayer.push()`):**
```json
{
  "event": "generate_lead",
  "email_address": "joao.silva@email.com",
  "user_data": {
    "email_address": "joao.silva@email.com",
    "address": {
      "city": "caculé",
      "region": "ba"
    }
  }
}
```

**Como GTM Server-Side processa:**
```
event: "generate_lead",
email_address: "joao.silva@email.com",
user_data: {
  email_address: "joao.silva@email.com",
  address: {
    city: "caculé",
    region: "ba"
  }
}
```

**Paths necessários:** `email_address`, `user_data.email_address`, `user_data.address.city`

---

## ✅ **SOLUÇÃO: VARIÁVEIS DUPLICADAS**

### **Estratégia:**

1. **Variáveis COM prefixo `0.`** → Para evento **Purchase** (via webhook)
2. **Variáveis SEM prefixo `0.`** → Para outros eventos (via GTM Web)

---

## 📋 **LISTA COMPLETA DE VARIÁVEIS**

### **GRUPO 1: Purchase (via Webhook) - COM prefixo `0.`**

| Variável | Path | Tipo | Uso |
|----------|------|------|-----|
| `{{ed - purchase.ecommerce.currency}}` | `0.ecommerce.currency` | Texto | Purchase |
| `{{ed - purchase.ecommerce.value}}` | `0.ecommerce.value` | Número | Purchase |
| `{{ed - purchase.ecommerce.transaction_id}}` | `0.ecommerce.transaction_id` | Texto | Purchase |
| `{{ed - purchase.content_ids}}` | `0.content_ids` | Array | Purchase |
| `{{ed - purchase.content_name}}` | `0.content_name` | Texto | Purchase |
| `{{ed - purchase.content_type}}` | `0.content_type` | Texto | Purchase |
| `{{ed - purchase.num_items}}` | `0.num_items` | Número | Purchase |
| `{{ed - purchase.user_data.email_address}}` | `0.user_data.email_address` | Texto | Purchase |
| `{{ed - purchase.user_data.phone_number}}` | `0.user_data.phone_number` | Texto | Purchase |
| `{{ed - purchase.user_data.first_name}}` | `0.user_data.first_name` | Texto | Purchase |
| `{{ed - purchase.user_data.last_name}}` | `0.user_data.last_name` | Texto | Purchase |
| `{{ed - purchase.user_data.city}}` | `0.user_data.city` | Texto | Purchase |
| `{{ed - purchase.user_data.region}}` | `0.user_data.region` | Texto | Purchase |
| `{{ed - purchase.user_data.postal_code}}` | `0.user_data.postal_code` | Texto | Purchase |
| `{{ed - purchase.user_data.country}}` | `0.user_data.country` | Texto | Purchase |

---

### **GRUPO 2: Outros Eventos (GTM Web) - SEM prefixo `0.`**

| Variável | Path | Tipo | Uso |
|----------|------|------|-----|
| `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto | ViewContent, AddToCart |
| `{{ed - ecommerce.value}}` | `ecommerce.value` | Número | ViewContent, AddToCart |
| `{{ed - content_ids}}` | `content_ids` | Array | ViewContent, AddToCart, Lead |
| `{{ed - content_name}}` | `content_name` | Texto | ViewContent, AddToCart |
| `{{ed - content_type}}` | `content_type` | Texto | ViewContent, AddToCart |
| `{{ed - num_items}}` | `num_items` | Número | ViewContent, AddToCart |
| `{{ed - email_address}}` | `email_address` | Texto | Lead, PageView |
| `{{ed - phone_number}}` | `phone_number` | Texto | Lead |
| `{{ed - first_name}}` | `first_name` | Texto | Lead |
| `{{ed - last_name}}` | `last_name` | Texto | Lead |
| `{{ed - city}}` | `city` | Texto | Lead |
| `{{ed - region}}` | `region` | Texto | Lead |
| `{{ed - postal_code}}` | `postal_code` | Texto | Lead |
| `{{ed - country}}` | `country` | Texto | Lead |
| `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto | PageView, ViewContent, AddToCart |
| `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto | PageView, ViewContent, AddToCart |
| `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto | PageView, ViewContent, AddToCart |
| `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto | PageView, ViewContent, AddToCart |
| `{{ed - user_data.address.city}}` | `user_data.address.city` | Texto | Lead |
| `{{ed - user_data.address.region}}` | `user_data.address.region` | Texto | Lead |
| `{{ed - user_data.address.country}}` | `user_data.address.country` | Texto | Lead |
| `{{ed - user_data.address.postal_code}}` | `user_data.address.postal_code` | Texto | Lead |

---

## 🔧 **COMO CRIAR AS VARIÁVEIS NO GTM**

### **Passo 1: Criar variáveis para Purchase (com prefixo `0.`)**

**Exemplo: `{{ed - purchase.ecommerce.currency}}`**

```
Nome da variável: ed - purchase.ecommerce.currency
Tipo de variável: Event Data
Nome do campo de evento: 0.ecommerce.currency
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** Todas começam com `0.`!

---

### **Passo 2: Criar variáveis para outros eventos (sem prefixo `0.`)**

**Exemplo: `{{ed - ecommerce.currency}}`**

```
Nome da variável: ed - ecommerce.currency
Tipo de variável: Event Data
Nome do campo de evento: ecommerce.currency
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** NÃO começar com `0.`!

---

## 📊 **MAPEAMENTO NAS TAGS**

### **Tag "FB - Purchase" (Purchase via Webhook)**

**Custom Data:**
- `currency` → `{{ed - purchase.ecommerce.currency}}` (COM `0.`)
- `value` → `{{ed - purchase.ecommerce.value}}` (COM `0.`)
- `content_ids` → `{{ed - purchase.content_ids}}` (COM `0.`)

**User Data:**
- `email_address` → `{{ed - purchase.user_data.email_address}}` (COM `0.`)
- `phone_number` → `{{ed - purchase.user_data.phone_number}}` (COM `0.`)
- `first_name` → `{{ed - purchase.user_data.first_name}}` (COM `0.`)
- `last_name` → `{{ed - purchase.user_data.last_name}}` (COM `0.`)
- `city` → `{{ed - purchase.user_data.city}}` (COM `0.`)
- `region` → `{{ed - purchase.user_data.region}}` (COM `0.`)
- `postal_code` → `{{ed - purchase.user_data.postal_code}}` (COM `0.`)
- `country` → `{{ed - purchase.user_data.country}}` (COM `0.`)

---

### **Tag "FB - Lead" (Lead via GTM Web)**

**User Data:**
- `email_address` → `{{ed - email_address}}` (SEM `0.`) OU `{{ed - user_data.email_address}}` (SEM `0.`)
- `phone_number` → `{{ed - phone_number}}` (SEM `0.`) OU `{{ed - user_data.phone_number}}` (SEM `0.`)
- `first_name` → `{{ed - first_name}}` (SEM `0.`) OU `{{ed - user_data.first_name}}` (SEM `0.`)
- `last_name` → `{{ed - last_name}}` (SEM `0.`) OU `{{ed - user_data.last_name}}` (SEM `0.`)
- `city` → `{{ed - city}}` (SEM `0.`) OU `{{ed - user_data.address.city}}` (SEM `0.`)
- `region` → `{{ed - region}}` (SEM `0.`) OU `{{ed - user_data.address.region}}` (SEM `0.`)
- `postal_code` → `{{ed - postal_code}}` (SEM `0.`) OU `{{ed - user_data.address.postal_code}}` (SEM `0.`)
- `country` → `{{ed - country}}` (SEM `0.`) OU `{{ed - user_data.address.country}}` (SEM `0.`)

---

### **Tag "FB - ViewContent" (ViewContent via GTM Web)**

**Custom Data:**
- `currency` → `{{ed - ecommerce.currency}}` (SEM `0.`)
- `value` → `{{ed - ecommerce.value}}` (SEM `0.`)
- `content_ids` → `{{ed - content_ids}}` (SEM `0.`)

**User Data:**
- `email_address` → `{{ed - user_data.email_address}}` (SEM `0.`)
- `phone_number` → `{{ed - user_data.phone_number}}` (SEM `0.`)
- `first_name` → `{{ed - user_data.first_name}}` (SEM `0.`)
- `last_name` → `{{ed - user_data.last_name}}` (SEM `0.`)

---

## ✅ **CHECKLIST**

### **Variáveis Purchase (com `0.`):**
- [ ] `ed - purchase.ecommerce.currency`
- [ ] `ed - purchase.ecommerce.value`
- [ ] `ed - purchase.ecommerce.transaction_id`
- [ ] `ed - purchase.content_ids`
- [ ] `ed - purchase.content_name`
- [ ] `ed - purchase.content_type`
- [ ] `ed - purchase.num_items`
- [ ] `ed - purchase.user_data.email_address`
- [ ] `ed - purchase.user_data.phone_number`
- [ ] `ed - purchase.user_data.first_name`
- [ ] `ed - purchase.user_data.last_name`
- [ ] `ed - purchase.user_data.city`
- [ ] `ed - purchase.user_data.region`
- [ ] `ed - purchase.user_data.postal_code`
- [ ] `ed - purchase.user_data.country`

### **Variáveis Outros Eventos (sem `0.`):**
- [ ] `ed - ecommerce.currency`
- [ ] `ed - ecommerce.value`
- [ ] `ed - content_ids`
- [ ] `ed - content_name`
- [ ] `ed - content_type`
- [ ] `ed - num_items`
- [ ] `ed - email_address`
- [ ] `ed - phone_number`
- [ ] `ed - first_name`
- [ ] `ed - last_name`
- [ ] `ed - city`
- [ ] `ed - region`
- [ ] `ed - postal_code`
- [ ] `ed - country`
- [ ] `ed - user_data.email_address`
- [ ] `ed - user_data.phone_number`
- [ ] `ed - user_data.first_name`
- [ ] `ed - user_data.last_name`
- [ ] `ed - user_data.address.city`
- [ ] `ed - user_data.address.region`
- [ ] `ed - user_data.address.postal_code`
- [ ] `ed - user_data.address.country`

---

## 🚨 **RESUMO**

**SIM, você precisa duplicar as variáveis!**

- ✅ **Variáveis COM `0.`** → Para Purchase (via webhook)
- ✅ **Variáveis SEM `0.`** → Para outros eventos (via GTM Web)

**Não há como evitar isso porque os formatos são diferentes!**

---

**Última atualização**: 2025-01-05
**Versão**: 1.0
**Status**: ✅ CONFIRMADO - DUPLICAÇÃO NECESSÁRIA


# 🔍 ANÁLISE: Variáveis GTM Real vs Código

## 📊 **ESTRUTURA REAL DO GTM**

### **GTM Server-Side (GTM-W4PGS3LR_workspace40.json):**

#### **Variáveis Event Data para Purchase (Webhook) - COM prefixo `0.`:**
| Variável | Path Real | Status |
|----------|-----------|--------|
| `{{ed - user_data.email_address}}` | `0.user_data.email_address` | ✅ Para Purchase |
| `{{ed - user_data.phone_number}}` | `0.user_data.phone_number` | ✅ Para Purchase |
| `{{ed - user_data.first_name}}` | `0.user_data.first_name` | ✅ Para Purchase |
| `{{ed - user_data.last_name}}` | `0.user_data.last_name` | ✅ Para Purchase |
| `{{ed - user_data.city}}` | `0.user_data.city` | ✅ Para Purchase |
| `{{ed - user_data.region}}` | `0.user_data.region` | ✅ Para Purchase |
| `{{ed - user_data.postal_code}}` | `0.user_data.postal_code` | ✅ Para Purchase |
| `{{ed - user_data.country}}` | `0.user_data.country` | ✅ Para Purchase |
| `{{ed - user_data.user_id}}` | `0.user_data.user_id` | ✅ Para Purchase |
| `{{ed - ecommerce.currency}}` | `0.ecommerce.currency` | ✅ Para Purchase |
| `{{ed - ecommerce.value}}` | `0.ecommerce.value` | ✅ Para Purchase |
| `{{ed - ecommerce.transaction_id}}` | `0.ecommerce.transaction_id` | ✅ Para Purchase |
| `{{ed - content_ids}}` | `0.content_ids` | ✅ Para Purchase |
| `{{ed - content_name}}` | `0.content_name` | ✅ Para Purchase |
| `{{ed - content_type}}` | `0.content_type` | ✅ Para Purchase |
| `{{ed - contents}}` | `0.contents` | ✅ Para Purchase |
| `{{ed - num_items}}` | `0.num_items` | ✅ Para Purchase |
| `{{ed - user_data.fbp}}` | `0.user_data.fbp` | ✅ Para Purchase |
| `{{ed - user_data.fbc}}` | `0.user_data.fbc` | ✅ Para Purchase |
| `{{ed - event_id}}` | `event_id` | ⚠️ SEM `0.` |

#### **Variáveis Event Data para Eventos do Browser - SEM prefixo `0.`:**
| Variável | Path Real | Status |
|----------|-----------|--------|
| `{{ed - user_data.email_address}}` | `user_data.email_address` | ⚠️ Para Browser |
| `{{ed - user_data.phone_number}}` | `user_data.phone_number` | ⚠️ Para Browser |
| `{{ed - user_data.first_name}}` | `user_data.first_name` | ⚠️ Para Browser |
| `{{ed - user_data.last_name}}` | `user_data.last_name` | ⚠️ Para Browser |
| `{{ed - user_data.city}}` | `user_data.city` | ⚠️ Para Browser |
| `{{ed - user_data.region}}` | `user_data.region` | ⚠️ Para Browser |
| `{{ed - user_data.postal_code}}` | `user_data.postal_code` | ⚠️ Para Browser |
| `{{ed - user_data.country}}` | `user_data.country` | ⚠️ Para Browser |
| `{{ed - ecommerce.currency}}` | `ecommerce.currency` | ⚠️ Para Browser |
| `{{ed - ecommerce.value}}` | `ecommerce.value` | ⚠️ Para Browser |
| `{{ed - content_ids}}` | `content_ids` | ⚠️ Para Browser |
| `{{ed - content_name}}` | `content_name` | ⚠️ Para Browser |
| `{{ed - content_type}}` | `content_type` | ⚠️ Para Browser |
| `{{ed - contents}}` | `contents` | ⚠️ Para Browser |
| `{{ed - num_items}}` | `num_items` | ⚠️ Para Browser |

---

### **GTM Web (GTM-WCDP2ZLH_workspace19.json):**

#### **Variáveis Data Layer (Browser):**
| Variável | Path Real | Status |
|----------|-----------|--------|
| `{{dlv - user_data.email_address}}` | `user_data.email_address` | ✅ |
| `{{dlv - user_data.phone_number}}` | `user_data.phone_number` | ✅ |
| `{{dlv - user_data.first_name}}` | `user_data.first_name` | ✅ |
| `{{dlv - user_data.last_name}}` | `user_data.last_name` | ✅ |
| `{{dlv - user_data.city}}` | `user_data.city` | ✅ |
| `{{dlv - user_data.region}}` | `user_data.region` | ✅ |
| `{{dlv - user_data.postal_code}}` | `user_data.postal_code` | ✅ |
| `{{dlv - user_data.country}}` | `user_data.country` | ✅ |
| `{{dlv - user_data.user_id}}` | `user_data.user_id` | ✅ |
| `{{dlv - ecommerce.currency}}` | `ecommerce.currency` | ✅ |
| `{{dlv - ecommerce.value}}` | `ecommerce.value` | ✅ |
| `{{dlv - ecommerce.transaction_id}}` | `ecommerce.transaction_id` | ✅ |
| `{{dlv - ecommerce.items}}` | `ecommerce.items` | ✅ |

---

## 🚨 **PROBLEMA IDENTIFICADO**

### **1. Variáveis Event Data para Browser estão usando paths dentro de `user_data`:**

**Problema:** As variáveis Event Data no GTM Server-Side para eventos do browser estão configuradas para acessar `user_data.email_address`, mas o código também envia `email_address` no nível raiz.

**Código envia:**
```javascript
{
  event: 'view_item',
  email_address: 'user@example.com',  // ✅ Nível raiz
  first_name: 'John',                  // ✅ Nível raiz
  content_name: 'Sistema 4 Fases...', // ✅ Nível raiz
  content_type: 'product',             // ✅ Nível raiz
  value: 39.9,                         // ✅ Nível raiz
  currency: 'BRL',                     // ✅ Nível raiz
  user_data: {                         // ✅ Também dentro de user_data
    email_address: 'user@example.com',
    ...
  },
  ecommerce: {                         // ✅ Também dentro de ecommerce
    value: 39.9,
    currency: 'BRL'
  }
}
```

**Variáveis no GTM Server-Side estão configuradas para:**
- `user_data.email_address` → Mas também existe `email_address` no nível raiz!
- `ecommerce.value` → Mas também existe `value` no nível raiz!
- `content_name` → ✅ Correto (nível raiz)

---

## ✅ **SOLUÇÃO: Criar Variáveis no Nível Raiz**

### **Variáveis que FALTAM no GTM Server-Side (nível raiz):**

| Variável | Path | Por quê? |
|----------|------|----------|
| `{{ed - email_address}}` | `email_address` | Código envia no nível raiz |
| `{{ed - phone_number}}` | `phone_number` | Código envia no nível raiz |
| `{{ed - first_name}}` | `first_name` | Código envia no nível raiz |
| `{{ed - last_name}}` | `last_name` | Código envia no nível raiz |
| `{{ed - city}}` | `city` | Código envia no nível raiz |
| `{{ed - region}}` | `region` | Código envia no nível raiz |
| `{{ed - postal_code}}` | `postal_code` | Código envia no nível raiz |
| `{{ed - country}}` | `country` | Código envia no nível raiz |
| `{{ed - value}}` | `value` | Código envia no nível raiz |
| `{{ed - currency}}` | `currency` | Código envia no nível raiz |

---

## 🔧 **CORREÇÃO NECESSÁRIA**

### **Opção 1: Criar Variáveis no Nível Raiz (Recomendado)**

Criar variáveis Event Data que acessam campos no nível raiz:
- `{{ed - email_address}}` → Path: `email_address`
- `{{ed - first_name}}` → Path: `first_name`
- `{{ed - value}}` → Path: `value`
- `{{ed - currency}}` → Path: `currency`

**Vantagem:** Funciona para eventos do browser que enviam campos no nível raiz.

### **Opção 2: Manter Variáveis em `user_data.*` e `ecommerce.*`**

Manter variáveis como estão:
- `{{ed - user_data.email_address}}` → Path: `user_data.email_address`
- `{{ed - ecommerce.value}}` → Path: `ecommerce.value`

**Vantagem:** Segue padrão oficial do Facebook.

**Desvantagem:** Se campos não estiverem dentro de `user_data`/`ecommerce`, retornam `undefined`.

---

## 🎯 **RECOMENDAÇÃO FINAL**

**Criar AMBAS as opções:**
1. ✅ Variáveis no nível raiz: `{{ed - email_address}}`, `{{ed - value}}`, etc.
2. ✅ Variáveis dentro de objetos: `{{ed - user_data.email_address}}`, `{{ed - ecommerce.value}}`, etc.

**Nas tags Facebook, usar:**
- **User Data:** `{{ed - email_address}}` (nível raiz) OU `{{ed - user_data.email_address}}` (dentro de user_data)
- **Custom Data:** `{{ed - value}}` (nível raiz) OU `{{ed - ecommerce.value}}` (dentro de ecommerce)

Isso garante que funcione independente de onde o campo esteja!

---

**Última atualização**: 2025-01-05  
**Versão**: 1.0  
**Status**: ✅ ANÁLISE COMPLETA - PRONTO PARA CORRIGIR


# 🔧 CORREÇÃO DEFINITIVA: Variáveis GTM Server-Side

## 🚨 **PROBLEMA IDENTIFICADO**

Analisando os arquivos JSON reais do GTM:

### **GTM Server-Side (GTM-W4PGS3LR_workspace40.json):**

**Variáveis Event Data existentes:**
- ✅ `{{ed - user_data.email_address}}` → Path: `user_data.email_address` (SEM `0.`)
- ✅ `{{ed - ecommerce.value}}` → Path: `ecommerce.value` (SEM `0.`)
- ✅ `{{ed - content_name}}` → Path: `content_name` (nível raiz)
- ✅ `{{ed - content_type}}` → Path: `content_type` (nível raiz)

**Variáveis Event Data para Purchase (com `0.`):**
- ✅ `{{ed - user_data.email_address}}` → Path: `0.user_data.email_address` (COM `0.`)
- ✅ `{{ed - ecommerce.value}}` → Path: `0.ecommerce.value` (COM `0.`)

**❌ PROBLEMA:** Não há variáveis no nível raiz para eventos do browser!

---

## 📊 **O QUE O CÓDIGO ENVIA**

### **ViewContent (view_item):**
```javascript
{
  event: 'view_item',
  // ✅ Nível raiz
  email_address: 'user@example.com',
  first_name: 'John',
  value: 39.9,
  currency: 'BRL',
  content_name: 'Sistema 4 Fases...',
  content_type: 'product',
  // ✅ Também dentro de user_data
  user_data: {
    email_address: 'user@example.com',
    first_name: 'John',
    ...
  },
  // ✅ Também dentro de ecommerce
  ecommerce: {
    value: 39.9,
    currency: 'BRL'
  }
}
```

### **PageView:**
```javascript
{
  event: 'page_view',
  // ✅ Nível raiz
  email_address: 'user@example.com',
  first_name: 'John',
  // ✅ Também dentro de user_data
  user_data: {
    email_address: 'user@example.com',
    first_name: 'John',
    ...
  }
}
```

---

## ✅ **SOLUÇÃO: Criar Variáveis no Nível Raiz**

### **Variáveis que FALTAM no GTM Server-Side:**

#### **1. User Data - Nível Raiz:**
| Variável | Path | Criar? |
|----------|------|--------|
| `{{ed - email_address}}` | `email_address` | ✅ **CRIAR** |
| `{{ed - phone_number}}` | `phone_number` | ✅ **CRIAR** |
| `{{ed - first_name}}` | `first_name` | ✅ **CRIAR** |
| `{{ed - last_name}}` | `last_name` | ✅ **CRIAR** |
| `{{ed - city}}` | `city` | ✅ **CRIAR** |
| `{{ed - region}}` | `region` | ✅ **CRIAR** |
| `{{ed - postal_code}}` | `postal_code` | ✅ **CRIAR** |
| `{{ed - country}}` | `country` | ✅ **CRIAR** |

#### **2. Ecommerce - Nível Raiz:**
| Variável | Path | Criar? |
|----------|------|--------|
| `{{ed - value}}` | `value` | ✅ **CRIAR** |
| `{{ed - currency}}` | `currency` | ✅ **CRIAR** |

#### **3. Content - Já Existem:**
| Variável | Path | Status |
|----------|------|--------|
| `{{ed - content_name}}` | `content_name` | ✅ **JÁ EXISTE** |
| `{{ed - content_type}}` | `content_type` | ✅ **JÁ EXISTE** |
| `{{ed - content_ids}}` | `content_ids` | ✅ **JÁ EXISTE** |
| `{{ed - contents}}` | `contents` | ✅ **JÁ EXISTE** |
| `{{ed - num_items}}` | `num_items` | ✅ **JÁ EXISTE** |

---

## 🔧 **COMO CRIAR NO GTM SERVER-SIDE**

### **Exemplo: Criar `{{ed - email_address}}`**

```
Nome da variável: ed - email_address
Tipo de variável: Event Data
Nome do campo de evento: email_address
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** 
- **NÃO usar prefixo `0.`** (isso é só para Purchase via webhook)
- Usar **exatamente** o path do nível raiz: `email_address`

---

## 📋 **CHECKLIST DE VARIÁVEIS A CRIAR**

### **Fase 1: User Data - Nível Raiz (8 variáveis)**
- [ ] `{{ed - email_address}}` → Path: `email_address`
- [ ] `{{ed - phone_number}}` → Path: `phone_number`
- [ ] `{{ed - first_name}}` → Path: `first_name`
- [ ] `{{ed - last_name}}` → Path: `last_name`
- [ ] `{{ed - city}}` → Path: `city`
- [ ] `{{ed - region}}` → Path: `region`
- [ ] `{{ed - postal_code}}` → Path: `postal_code`
- [ ] `{{ed - country}}` → Path: `country`

### **Fase 2: Ecommerce - Nível Raiz (2 variáveis)**
- [ ] `{{ed - value}}` → Path: `value`
- [ ] `{{ed - currency}}` → Path: `currency`

---

## 🎯 **MAPEAMENTO NAS TAGS FACEBOOK**

### **Tag "FB - ViewContent":**

**User Data:**
- `email_address` → `{{ed - email_address}}` (nível raiz) OU `{{ed - user_data.email_address}}` (dentro de user_data)
- `phone_number` → `{{ed - phone_number}}` (nível raiz) OU `{{ed - user_data.phone_number}}` (dentro de user_data)
- `first_name` → `{{ed - first_name}}` (nível raiz) OU `{{ed - user_data.first_name}}` (dentro de user_data)
- `last_name` → `{{ed - last_name}}` (nível raiz) OU `{{ed - user_data.last_name}}` (dentro de user_data)
- `city` → `{{ed - city}}` (nível raiz) OU `{{ed - user_data.city}}` (dentro de user_data)
- `region` → `{{ed - region}}` (nível raiz) OU `{{ed - user_data.region}}` (dentro de user_data)
- `postal_code` → `{{ed - postal_code}}` (nível raiz) OU `{{ed - user_data.postal_code}}` (dentro de user_data)
- `country` → `{{ed - country}}` (nível raiz) OU `{{ed - user_data.country}}` (dentro de user_data)

**Custom Data:**
- `value` → `{{ed - value}}` (nível raiz) OU `{{ed - ecommerce.value}}` (dentro de ecommerce)
- `currency` → `{{ed - currency}}` (nível raiz) OU `{{ed - ecommerce.currency}}` (dentro de ecommerce)
- `content_name` → `{{ed - content_name}}` (nível raiz) ✅
- `content_type` → `{{ed - content_type}}` (nível raiz) ✅
- `content_ids` → `{{ed - content_ids}}` (nível raiz) ✅
- `contents` → `{{ed - contents}}` (nível raiz) ✅
- `num_items` → `{{ed - num_items}}` (nível raiz) ✅

---

## ✅ **RESUMO**

**Problema:** Variáveis Event Data no GTM Server-Side estão configuradas para acessar `user_data.email_address`, mas o código também envia `email_address` no nível raiz.

**Solução:** Criar variáveis Event Data no nível raiz:
- `{{ed - email_address}}` → Path: `email_address`
- `{{ed - value}}` → Path: `value`
- `{{ed - currency}}` → Path: `currency`
- etc.

**Total de variáveis a criar:** 10 variáveis (8 user data + 2 ecommerce)

---

**Última atualização**: 2025-01-05  
**Versão**: 1.0  
**Status**: ✅ ANÁLISE COMPLETA - PRONTO PARA CRIAR VARIÁVEIS


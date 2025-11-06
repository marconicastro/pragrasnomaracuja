# 🔍 ANÁLISE COMPLETA: Variáveis GTM Web vs Server-Side

## 🎯 **OBJETIVO**

Criar variáveis Event Data no GTM Server-Side usando **EXATAMENTE os mesmos paths** das variáveis Data Layer do GTM Web.

---

## 📊 **ESTRUTURA DOS EVENTOS NO CÓDIGO**

### **1. PageView (`pushPageView`)**

**Código envia:**
```javascript
{
  event: 'page_view',
  email_address: '...',        // ✅ Nível raiz
  phone_number: '...',         // ✅ Nível raiz
  first_name: '...',           // ✅ Nível raiz
  last_name: '...',            // ✅ Nível raiz
  city: '...',                 // ✅ Nível raiz
  region: '...',               // ✅ Nível raiz
  postal_code: '...',          // ✅ Nível raiz
  country: '...',              // ✅ Nível raiz
  event_id: '...',             // ✅ Nível raiz
  user_data: {                 // ✅ Também dentro de user_data
    email_address: '...',
    phone_number: '...',
    first_name: '...',
    last_name: '...',
    city: '...',
    region: '...',
    postal_code: '...',
    country: '...'
  }
}
```

**Variáveis Event Data necessárias (GTM Server-Side):**
| Variável | Path | Tipo |
|----------|------|------|
| `{{ed - email_address}}` | `email_address` | Texto |
| `{{ed - phone_number}}` | `phone_number` | Texto |
| `{{ed - first_name}}` | `first_name` | Texto |
| `{{ed - last_name}}` | `last_name` | Texto |
| `{{ed - city}}` | `city` | Texto |
| `{{ed - region}}` | `region` | Texto |
| `{{ed - postal_code}}` | `postal_code` | Texto |
| `{{ed - country}}` | `country` | Texto |
| `{{ed - event_id}}` | `event_id` | Texto |
| `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto |
| `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto |
| `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto |
| `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto |
| `{{ed - user_data.city}}` | `user_data.city` | Texto |
| `{{ed - user_data.region}}` | `user_data.region` | Texto |
| `{{ed - user_data.postal_code}}` | `user_data.postal_code` | Texto |
| `{{ed - user_data.country}}` | `user_data.country` | Texto |

---

### **2. ViewContent (`pushViewItem`)**

**Código envia:**
```javascript
{
  event: 'view_item',
  ecommerce: {
    value: 39.9,
    currency: 'BRL',
    items: [...]
  },
  content_ids: ['hacr962'],           // ✅ Nível raiz
  contents: [{id: 'hacr962', ...}],  // ✅ Nível raiz
  content_name: 'Sistema 4 Fases...', // ✅ Nível raiz
  content_type: 'product',            // ✅ Nível raiz
  value: 39.9,                        // ✅ Nível raiz
  currency: 'BRL',                    // ✅ Nível raiz
  email_address: '...',               // ✅ Nível raiz
  phone_number: '...',                // ✅ Nível raiz
  first_name: '...',                  // ✅ Nível raiz
  last_name: '...',                   // ✅ Nível raiz
  city: '...',                        // ✅ Nível raiz
  region: '...',                      // ✅ Nível raiz
  postal_code: '...',                 // ✅ Nível raiz
  country: '...',                     // ✅ Nível raiz
  event_id: '...',                    // ✅ Nível raiz
  user_data: {                        // ✅ Também dentro de user_data
    email_address: '...',
    ...
  }
}
```

**Variáveis Event Data necessárias (GTM Server-Side):**
| Variável | Path | Tipo |
|----------|------|------|
| `{{ed - value}}` | `value` | Número |
| `{{ed - currency}}` | `currency` | Texto |
| `{{ed - ecommerce.value}}` | `ecommerce.value` | Número |
| `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto |
| `{{ed - content_ids}}` | `content_ids` | Array |
| `{{ed - content_name}}` | `content_name` | Texto |
| `{{ed - content_type}}` | `content_type` | Texto |
| `{{ed - contents}}` | `contents` | Array |
| `{{ed - email_address}}` | `email_address` | Texto |
| `{{ed - phone_number}}` | `phone_number` | Texto |
| `{{ed - first_name}}` | `first_name` | Texto |
| `{{ed - last_name}}` | `last_name` | Texto |
| `{{ed - city}}` | `city` | Texto |
| `{{ed - region}}` | `region` | Texto |
| `{{ed - postal_code}}` | `postal_code` | Texto |
| `{{ed - country}}` | `country` | Texto |
| `{{ed - event_id}}` | `event_id` | Texto |
| `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto |
| `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto |
| `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto |
| `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto |

---

### **3. AddToCart (`pushAddToCart`)**

**Código envia:**
```javascript
{
  event: 'add_to_cart',
  ecommerce: {
    value: 39.9,
    currency: 'BRL',
    items: [...]
  },
  content_ids: ['hacr962'],
  contents: [{id: 'hacr962', ...}],
  content_name: 'Sistema 4 Fases...',  // ✅ Nível raiz
  content_type: 'product',            // ✅ Nível raiz
  num_items: 1,                       // ✅ Nível raiz
  value: 39.9,                        // ✅ Nível raiz
  currency: 'BRL',                    // ✅ Nível raiz
  email_address: '...',
  phone_number: '...',
  first_name: '...',
  last_name: '...',
  city: '...',
  region: '...',
  postal_code: '...',
  country: '...',
  event_id: '...',
  user_data: {...}
}
```

**Variáveis Event Data necessárias (GTM Server-Side):**
| Variável | Path | Tipo |
|----------|------|------|
| `{{ed - value}}` | `value` | Número |
| `{{ed - currency}}` | `currency` | Texto |
| `{{ed - ecommerce.value}}` | `ecommerce.value` | Número |
| `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto |
| `{{ed - content_ids}}` | `content_ids` | Array |
| `{{ed - content_name}}` | `content_name` | Texto |
| `{{ed - content_type}}` | `content_type` | Texto |
| `{{ed - contents}}` | `contents` | Array |
| `{{ed - num_items}}` | `num_items` | Número |
| `{{ed - email_address}}` | `email_address` | Texto |
| `{{ed - phone_number}}` | `phone_number` | Texto |
| `{{ed - first_name}}` | `first_name` | Texto |
| `{{ed - last_name}}` | `last_name` | Texto |
| `{{ed - city}}` | `city` | Texto |
| `{{ed - region}}` | `region` | Texto |
| `{{ed - postal_code}}` | `postal_code` | Texto |
| `{{ed - country}}` | `country` | Texto |
| `{{ed - event_id}}` | `event_id` | Texto |
| `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto |
| `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto |
| `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto |
| `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto |

---

### **4. BeginCheckout (`pushBeginCheckout`)**

**Código envia:**
```javascript
{
  event: 'begin_checkout',
  ecommerce: {
    value: 39.9,
    currency: 'BRL',
    items: [...]
  },
  content_ids: ['hacr962'],
  contents: [{id: 'hacr962', ...}],
  content_name: 'Sistema 4 Fases...',  // ✅ Nível raiz
  content_type: 'product',            // ✅ Nível raiz
  num_items: 1,
  value: 39.9,
  currency: 'BRL',
  email_address: '...',
  phone_number: '...',
  first_name: '...',
  last_name: '...',
  city: '...',
  region: '...',
  postal_code: '...',
  country: '...',
  event_id: '...',
  user_data: {...}
}
```

**Variáveis Event Data necessárias (GTM Server-Side):**
| Variável | Path | Tipo |
|----------|------|------|
| `{{ed - value}}` | `value` | Número |
| `{{ed - currency}}` | `currency` | Texto |
| `{{ed - ecommerce.value}}` | `ecommerce.value` | Número |
| `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto |
| `{{ed - content_ids}}` | `content_ids` | Array |
| `{{ed - content_name}}` | `content_name` | Texto |
| `{{ed - content_type}}` | `content_type` | Texto |
| `{{ed - contents}}` | `contents` | Array |
| `{{ed - num_items}}` | `num_items` | Número |
| `{{ed - email_address}}` | `email_address` | Texto |
| `{{ed - phone_number}}` | `phone_number` | Texto |
| `{{ed - first_name}}` | `first_name` | Texto |
| `{{ed - last_name}}` | `last_name` | Texto |
| `{{ed - city}}` | `city` | Texto |
| `{{ed - region}}` | `region` | Texto |
| `{{ed - postal_code}}` | `postal_code` | Texto |
| `{{ed - country}}` | `country` | Texto |
| `{{ed - event_id}}` | `event_id` | Texto |
| `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto |
| `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto |
| `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto |
| `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto |

---

### **5. GenerateLead (`pushGenerateLead`)**

**Código envia:**
```javascript
{
  event: 'generate_lead',
  ecommerce: {                    // ⚠️ SÓ SE value FOR FORNECIDO
    value: 39.9,
    currency: 'BRL'
  },
  content_ids: ['hacr962'],
  contents: [{id: 'hacr962', ...}],
  email_address: '...',           // ✅ Nível raiz
  phone_number: '...',             // ✅ Nível raiz
  first_name: '...',               // ✅ Nível raiz
  last_name: '...',                // ✅ Nível raiz
  city: '...',                     // ✅ Nível raiz
  region: '...',                   // ✅ Nível raiz
  postal_code: '...',              // ✅ Nível raiz
  country: '...',                  // ✅ Nível raiz
  event_id: '...',                 // ✅ Nível raiz
  user_data: {                     // ✅ Também dentro de user_data
    email_address: '...',
    ...
  }
}
```

**Variáveis Event Data necessárias (GTM Server-Side):**
| Variável | Path | Tipo |
|----------|------|------|
| `{{ed - email_address}}` | `email_address` | Texto |
| `{{ed - phone_number}}` | `phone_number` | Texto |
| `{{ed - first_name}}` | `first_name` | Texto |
| `{{ed - last_name}}` | `last_name` | Texto |
| `{{ed - city}}` | `city` | Texto |
| `{{ed - region}}` | `region` | Texto |
| `{{ed - postal_code}}` | `postal_code` | Texto |
| `{{ed - country}}` | `country` | Texto |
| `{{ed - event_id}}` | `event_id` | Texto |
| `{{ed - content_ids}}` | `content_ids` | Array |
| `{{ed - contents}}` | `contents` | Array |
| `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto |
| `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto |
| `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto |
| `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto |
| `{{ed - ecommerce.value}}` | `ecommerce.value` | Número (opcional - só se value for fornecido) |
| `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto (opcional - só se value for fornecido) |

---

## 🚨 **PROBLEMAS IDENTIFICADOS**

### **1. GenerateLead - Ecommerce Indefinido**

**Problema:** `ecommerce.value` e `ecommerce.currency` retornam `undefined`

**Causa:** O código só adiciona `ecommerce` se `value` for fornecido:
```typescript
...(value && {
  ecommerce: {
    value: value,
    currency: PRODUCT_CONFIG.currency
  }
}),
```

**Solução:** Se `value` não for fornecido, `ecommerce` não existe. Isso é **correto** - Lead pode não ter valor.

---

### **2. ViewContent/BeginCheckout - content_name e content_type Indefinidos**

**Problema:** `content_name` e `content_type` retornam `undefined`

**Causa:** As variáveis Event Data podem não estar criadas ou com path incorreto.

**Solução:** Criar variáveis:
- `{{ed - content_name}}` → Path: `content_name`
- `{{ed - content_type}}` → Path: `content_type`

---

### **3. PageView - 100% Indefinido**

**Problema:** Todas as variáveis retornam `undefined`

**Causa:** As variáveis Event Data não foram criadas ou estão com paths incorretos.

**Solução:** Criar todas as variáveis listadas acima para PageView.

---

## ✅ **CHECKLIST DE VARIÁVEIS A CRIAR**

### **Variáveis Comuns (Todos os Eventos):**
- [ ] `{{ed - email_address}}` → Path: `email_address`
- [ ] `{{ed - phone_number}}` → Path: `phone_number`
- [ ] `{{ed - first_name}}` → Path: `first_name`
- [ ] `{{ed - last_name}}` → Path: `last_name`
- [ ] `{{ed - city}}` → Path: `city`
- [ ] `{{ed - region}}` → Path: `region`
- [ ] `{{ed - postal_code}}` → Path: `postal_code`
- [ ] `{{ed - country}}` → Path: `country`
- [ ] `{{ed - event_id}}` → Path: `event_id`
- [ ] `{{ed - user_data.email_address}}` → Path: `user_data.email_address`
- [ ] `{{ed - user_data.phone_number}}` → Path: `user_data.phone_number`
- [ ] `{{ed - user_data.first_name}}` → Path: `user_data.first_name`
- [ ] `{{ed - user_data.last_name}}` → Path: `user_data.last_name`
- [ ] `{{ed - user_data.city}}` → Path: `user_data.city`
- [ ] `{{ed - user_data.region}}` → Path: `user_data.region`
- [ ] `{{ed - user_data.postal_code}}` → Path: `user_data.postal_code`
- [ ] `{{ed - user_data.country}}` → Path: `user_data.country`

### **Variáveis Ecommerce (ViewContent, AddToCart, BeginCheckout):**
- [ ] `{{ed - value}}` → Path: `value`
- [ ] `{{ed - currency}}` → Path: `currency`
- [ ] `{{ed - ecommerce.value}}` → Path: `ecommerce.value`
- [ ] `{{ed - ecommerce.currency}}` → Path: `ecommerce.currency`
- [ ] `{{ed - content_ids}}` → Path: `content_ids`
- [ ] `{{ed - content_name}}` → Path: `content_name` ⚠️ **CRÍTICO**
- [ ] `{{ed - content_type}}` → Path: `content_type` ⚠️ **CRÍTICO**
- [ ] `{{ed - contents}}` → Path: `contents`
- [ ] `{{ed - num_items}}` → Path: `num_items` (AddToCart, BeginCheckout)

---

## 📋 **COMO CRIAR NO GTM SERVER-SIDE**

### **Exemplo: Criar `{{ed - content_name}}`**

```
Nome da variável: ed - content_name
Tipo de variável: Event Data
Nome do campo de evento: content_name
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** 
- **NÃO** usar prefixo `0.` (isso é só para Purchase via webhook)
- Usar **exatamente** o mesmo path que está no código
- Se no código é `content_name`, o path é `content_name` (não `0.content_name`)

---

## 🎯 **RESUMO**

**O padrão é simples:**
1. Verificar o que o código envia (estrutura do objeto)
2. Criar variáveis Event Data com **exatamente os mesmos paths**
3. **NÃO usar prefixo `0.`** para eventos do browser (só Purchase via webhook usa `0.`)

**Se no código é:**
```javascript
{
  content_name: 'Sistema 4 Fases...',
  content_type: 'product'
}
```

**A variável Event Data deve ser:**
- `{{ed - content_name}}` → Path: `content_name`
- `{{ed - content_type}}` → Path: `content_type`

---

**Última atualização**: 2025-01-05  
**Versão**: 1.0  
**Status**: ✅ ANÁLISE COMPLETA - PRONTO PARA CRIAR VARIÁVEIS


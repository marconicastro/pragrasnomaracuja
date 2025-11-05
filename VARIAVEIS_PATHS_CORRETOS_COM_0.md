# ✅ Variáveis Event Data - Paths Corretos Confirmados (COM `0.`)

## 🎯 **ESTRUTURA CONFIRMADA**

Baseado no Preview Mode, os dados estão em `0: {...}`:

```
Dados do evento:
Nome          Valor
0             { event: "purchase", ecommerce: {...}, user_data: {...} }
```

**✅ TODAS as variáveis Event Data precisam usar prefixo `0.` nos paths!**

---

## ✅ **LISTA COMPLETA DE VARIÁVEIS (PATHS CORRETOS COM `0.`)**

### **Custom Data (Meta Conversion API) - PRIORIDADE 1**

| # | Nome da Variável | Path CORRETO | Tipo | Valor Exemplo |
|---|------------------|--------------|------|---------------|
| 1 | `{{ed - ecommerce.currency}}` | `0.ecommerce.currency` | Texto | `"BRL"` |
| 2 | `{{ed - ecommerce.value}}` | `0.ecommerce.value` | Número | `39.9` |
| 3 | `{{ed - content_ids}}` | `0.content_ids` | Texto | `["hacr962"]` |
| 4 | `{{ed - content_name}}` | `0.content_name` | Texto | `"Sistema 4 Fases - Ebook Trips"` |
| 5 | `{{ed - content_type}}` | `0.content_type` | Texto | `"product"` |
| 6 | `{{ed - num_items}}` | `0.num_items` | Número | `1` |
| 7 | `{{ed - ecommerce.transaction_id}}` | `0.ecommerce.transaction_id` | Texto | `"TEST_ORDER_123"` |

---

### **User Data (Meta Conversion API) - PRIORIDADE 2**

| # | Nome da Variável | Path CORRETO | Tipo | Valor Exemplo |
|---|------------------|--------------|------|---------------|
| 8 | `{{ed - user_data.email_address}}` | `0.user_data.email_address` | Texto | `"joao.silva@email.com"` |
| 9 | `{{ed - user_data.phone_number}}` | `0.user_data.phone_number` | Texto | `"11999999999"` |
| 10 | `{{ed - user_data.first_name}}` | `0.user_data.first_name` | Texto | `"João"` |
| 11 | `{{ed - user_data.last_name}}` | `0.user_data.last_name` | Texto | `"Silva"` |
| 12 | `{{ed - user_data.user_id}}` | `0.user_data.user_id` | Texto | `"sess_1762031294521_e5kv5ly8b"` |
| 13 | `{{ed - user_data.city}}` | `0.user_data.city` | Texto | `"caculé"` |
| 14 | `{{ed - user_data.region}}` | `0.user_data.region` | Texto | `"ba"` |
| 15 | `{{ed - user_data.postal_code}}` | `0.user_data.postal_code` | Texto | `"46300"` |
| 16 | `{{ed - user_data.country}}` | `0.user_data.country` | Texto | `"BR"` |

---

### **Metadata do Evento - PRIORIDADE 3**

| # | Nome da Variável | Path CORRETO | Tipo | Valor Exemplo |
|---|------------------|--------------|------|---------------|
| 17 | `{{ed - event}}` | `0.event` | Texto | `"purchase"` |
| 18 | `{{ed - event_id}}` | `0.event_id` | Texto | `"TEST_ORDER_123_1730716200000"` |
| 19 | `{{ed - event_source_url}}` | `0.event_source_url` | Texto | `"https://www.maracujazeropragas.com/obrigado"` |
| 20 | `{{ed - client_ip_address}}` | `0.client_ip_address` | Texto | `"177.38.244.180"` |
| 21 | `{{ed - client_user_agent}}` | `0.client_user_agent` | Texto | `"Mozilla/5.0..."` |

---

## 📋 **Como Criar no GTM Server-Side**

### **Exemplo: Criar `{{ed - ecommerce.currency}}`**

```
Nome da variável: ed - ecommerce.currency
Tipo de variável: Event Data
Nome do campo de evento: 0.ecommerce.currency
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** O path é `0.ecommerce.currency` (COM o `0.` no início!)

### **Exemplo: Criar `{{ed - ecommerce.value}}`**

```
Nome da variável: ed - ecommerce.value
Tipo de variável: Event Data
Nome do campo de evento: 0.ecommerce.value
Tipo de valor: Número
Valor padrão: (deixar vazio)
```

### **Exemplo: Criar `{{ed - user_data.email_address}}`**

```
Nome da variável: ed - user_data.email_address
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.email_address
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

---

## 🎯 **Mapeamento na Tag "FB - Purchase"**

### **Custom Data List:**

| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `currency` | `{{ed - ecommerce.currency}}` | `0.ecommerce.currency` |
| `value` | `{{ed - ecommerce.value}}` | `0.ecommerce.value` |
| `content_ids` | `{{ed - content_ids}}` | `0.content_ids` |
| `content_name` | `{{ed - content_name}}` | `0.content_name` |
| `content_type` | `{{ed - content_type}}` | `0.content_type` |
| `num_items` | `{{ed - num_items}}` | `0.num_items` |
| `order_id` | `{{ed - ecommerce.transaction_id}}` | `0.ecommerce.transaction_id` |

### **User Data List:**

| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `email_address` | `{{ed - user_data.email_address}}` | `0.user_data.email_address` |
| `phone_number` | `{{ed - user_data.phone_number}}` | `0.user_data.phone_number` |
| `first_name` | `{{ed - user_data.first_name}}` | `0.user_data.first_name` |
| `last_name` | `{{ed - user_data.last_name}}` | `0.user_data.last_name` |
| `external_id` | `{{ed - user_data.user_id}}` | `0.user_data.user_id` |
| `city` | `{{ed - user_data.city}}` | `0.user_data.city` |
| `region` | `{{ed - user_data.region}}` | `0.user_data.region` |
| `postal_code` | `{{ed - user_data.postal_code}}` | `0.user_data.postal_code` |
| `country` | `{{ed - user_data.country}}` | `0.user_data.country` |

### **Server Event Data List:**

| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `event_id` | `{{ed - event_id}}` | `0.event_id` |

---

## ✅ **Checklist de Criação/Correção**

### **Fase 1: Variáveis Críticas (5 variáveis) - Resolve erro 400**

- [ ] `{{ed - ecommerce.currency}}` → Path: `0.ecommerce.currency` ⚠️ **COM `0.`**
- [ ] `{{ed - ecommerce.value}}` → Path: `0.ecommerce.value` ⚠️ **COM `0.`**
- [ ] `{{ed - content_ids}}` → Path: `0.content_ids` ⚠️ **COM `0.`**
- [ ] `{{ed - content_name}}` → Path: `0.content_name` ⚠️ **COM `0.`**
- [ ] `{{ed - content_type}}` → Path: `0.content_type` ⚠️ **COM `0.`**

### **Fase 2: User Data Essencial (4 variáveis) - Melhora matching**

- [ ] `{{ed - user_data.email_address}}` → Path: `0.user_data.email_address` ⚠️ **COM `0.`**
- [ ] `{{ed - user_data.phone_number}}` → Path: `0.user_data.phone_number` ⚠️ **COM `0.`**
- [ ] `{{ed - user_data.first_name}}` → Path: `0.user_data.first_name` ⚠️ **COM `0.`**
- [ ] `{{ed - user_data.user_id}}` → Path: `0.user_data.user_id` ⚠️ **COM `0.`**

### **Fase 3: Metadata (3 variáveis) - Identificação**

- [ ] `{{ed - event}}` → Path: `0.event` ⚠️ **COM `0.`**
- [ ] `{{ed - event_id}}` → Path: `0.event_id` ⚠️ **COM `0.`**
- [ ] `{{ed - ecommerce.transaction_id}}` → Path: `0.ecommerce.transaction_id` ⚠️ **COM `0.`**

---

## 🚨 **IMPORTANTE**

**Todos os paths devem começar com `0.` porque os dados estão em `0: {...}`!**

- ❌ **NÃO usar:** `ecommerce.currency` (sem `0.`)
- ✅ **USAR:** `0.ecommerce.currency` (com `0.`)

- ❌ **NÃO usar:** `user_data.email_address` (sem `0.`)
- ✅ **USAR:** `0.user_data.email_address` (com `0.`)

---

## 🎉 **Resultado Esperado**

Após criar/corrigir todas as variáveis com paths começando com `0.`:

1. ✅ Variáveis retornam valores (não mais `undefined`)
2. ✅ Tag "FB - Purchase" dispara corretamente
3. ✅ Meta recebe `custom_data` completo
4. ✅ Meta recebe `user_data` completo
5. ✅ Meta retorna **200 OK** (não mais 400)
6. ✅ Evento aparece no Meta Events Manager

---

**Última atualização**: 2025-01-05
**Versão**: 1.0 - CONFIRMADO: Dados estão em `0: {...}`



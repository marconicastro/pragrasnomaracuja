# ✅ Variáveis Event Data - Paths Confirmados (Baseado na Estrutura Real)

## 🎯 **ESTRUTURA CONFIRMADA**

Baseado no Preview Mode, os dados estão no **nível raiz** (sem `0:`):

```
Dados do evento:
Nome          Valor
ecommerce     { transaction_id: "...", value: 39.9, currency: "BRL", items: [...] }
user_data     { user_id: "...", email_address: "...", phone_number: "..." }
content_ids   ["hacr962"]
content_name  "Sistema 4 Fases - Ebook Trips"
content_type  "product"
event         "purchase"
```

---

## ✅ **LISTA COMPLETA DE VARIÁVEIS (PATHS CORRETOS)**

### **Custom Data (Meta Conversion API) - PRIORIDADE 1**

| # | Nome da Variável | Path | Tipo | Valor Exemplo |
|---|------------------|------|------|---------------|
| 1 | `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto | `"BRL"` |
| 2 | `{{ed - ecommerce.value}}` | `ecommerce.value` | Número | `39.9` |
| 3 | `{{ed - content_ids}}` | `content_ids` | Texto | `["hacr962"]` |
| 4 | `{{ed - content_name}}` | `content_name` | Texto | `"Sistema 4 Fases - Ebook Trips"` |
| 5 | `{{ed - content_type}}` | `content_type` | Texto | `"product"` |
| 6 | `{{ed - num_items}}` | `num_items` | Número | `1` |
| 7 | `{{ed - ecommerce.transaction_id}}` | `ecommerce.transaction_id` | Texto | `"TEST_ORDER_123"` |

---

### **User Data (Meta Conversion API) - PRIORIDADE 2**

| # | Nome da Variável | Path | Tipo | Valor Exemplo |
|---|------------------|------|------|---------------|
| 8 | `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto | `"joao.silva@email.com"` |
| 9 | `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto | `"11999999999"` |
| 10 | `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto | `"João"` |
| 11 | `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto | `"Silva"` |
| 12 | `{{ed - user_data.user_id}}` | `user_data.user_id` | Texto | `"sess_1762031294521_e5kv5ly8b"` |
| 13 | `{{ed - user_data.city}}` | `user_data.city` | Texto | `"caculé"` |
| 14 | `{{ed - user_data.region}}` | `user_data.region` | Texto | `"ba"` |
| 15 | `{{ed - user_data.postal_code}}` | `user_data.postal_code` | Texto | `"46300"` |
| 16 | `{{ed - user_data.country}}` | `user_data.country` | Texto | `"BR"` |

---

### **Metadata do Evento - PRIORIDADE 3**

| # | Nome da Variável | Path | Tipo | Valor Exemplo |
|---|------------------|------|------|---------------|
| 17 | `{{ed - event}}` | `event` | Texto | `"purchase"` |
| 18 | `{{ed - event_id}}` | `event_id` | Texto | `"TEST_ORDER_123_1730716200000"` |
| 19 | `{{ed - event_source_url}}` | `event_source_url` | Texto | `"https://www.maracujazeropragas.com/obrigado"` |
| 20 | `{{ed - client_ip_address}}` | `client_ip_address` | Texto | `"177.38.244.180"` |
| 21 | `{{ed - client_user_agent}}` | `client_user_agent` | Texto | `"Mozilla/5.0..."` |

---

## 📋 **Como Criar no GTM Server-Side**

### **Exemplo: Criar `{{ed - ecommerce.currency}}`**

```
Nome da variável: ed - ecommerce.currency
Tipo de variável: Event Data
Nome do campo de evento: ecommerce.currency
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

### **Exemplo: Criar `{{ed - ecommerce.value}}`**

```
Nome da variável: ed - ecommerce.value
Tipo de variável: Event Data
Nome do campo de evento: ecommerce.value
Tipo de valor: Número
Valor padrão: (deixar vazio)
```

### **Exemplo: Criar `{{ed - user_data.email_address}}`**

```
Nome da variável: ed - user_data.email_address
Tipo de variável: Event Data
Nome do campo de evento: user_data.email_address
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

---

## 🎯 **Mapeamento na Tag "FB - Purchase"**

### **Custom Data List:**

| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `currency` | `{{ed - ecommerce.currency}}` | `ecommerce.currency` |
| `value` | `{{ed - ecommerce.value}}` | `ecommerce.value` |
| `content_ids` | `{{ed - content_ids}}` | `content_ids` |
| `content_name` | `{{ed - content_name}}` | `content_name` |
| `content_type` | `{{ed - content_type}}` | `content_type` |
| `num_items` | `{{ed - num_items}}` | `num_items` |
| `order_id` | `{{ed - ecommerce.transaction_id}}` | `ecommerce.transaction_id` |

### **User Data List:**

| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `email_address` | `{{ed - user_data.email_address}}` | `user_data.email_address` |
| `phone_number` | `{{ed - user_data.phone_number}}` | `user_data.phone_number` |
| `first_name` | `{{ed - user_data.first_name}}` | `user_data.first_name` |
| `last_name` | `{{ed - user_data.last_name}}` | `user_data.last_name` |
| `external_id` | `{{ed - user_data.user_id}}` | `user_data.user_id` |
| `city` | `{{ed - user_data.city}}` | `user_data.city` |
| `region` | `{{ed - user_data.region}}` | `user_data.region` |
| `postal_code` | `{{ed - user_data.postal_code}}` | `user_data.postal_code` |
| `country` | `{{ed - user_data.country}}` | `user_data.country` |

### **Server Event Data List:**

| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `event_id` | `{{ed - event_id}}` | `event_id` |

---

## ✅ **Checklist de Criação**

### **Fase 1: Variáveis Críticas (5 variáveis) - Resolve erro 400**

- [ ] `{{ed - ecommerce.currency}}` → Path: `ecommerce.currency`
- [ ] `{{ed - ecommerce.value}}` → Path: `ecommerce.value`
- [ ] `{{ed - content_ids}}` → Path: `content_ids`
- [ ] `{{ed - content_name}}` → Path: `content_name`
- [ ] `{{ed - content_type}}` → Path: `content_type`

### **Fase 2: User Data Essencial (4 variáveis) - Melhora matching**

- [ ] `{{ed - user_data.email_address}}` → Path: `user_data.email_address`
- [ ] `{{ed - user_data.phone_number}}` → Path: `user_data.phone_number`
- [ ] `{{ed - user_data.first_name}}` → Path: `user_data.first_name`
- [ ] `{{ed - user_data.user_id}}` → Path: `user_data.user_id`

### **Fase 3: Metadata (3 variáveis) - Identificação**

- [ ] `{{ed - event}}` → Path: `event`
- [ ] `{{ed - event_id}}` → Path: `event_id`
- [ ] `{{ed - ecommerce.transaction_id}}` → Path: `ecommerce.transaction_id`

### **Fase 4: User Data Opcional (5 variáveis) - Melhora DQS**

- [ ] `{{ed - user_data.last_name}}` → Path: `user_data.last_name`
- [ ] `{{ed - user_data.city}}` → Path: `user_data.city`
- [ ] `{{ed - user_data.region}}` → Path: `user_data.region`
- [ ] `{{ed - user_data.postal_code}}` → Path: `user_data.postal_code`
- [ ] `{{ed - user_data.country}}` → Path: `user_data.country`

---

## 🎉 **Resultado Esperado**

Após criar todas as variáveis com estes paths:

1. ✅ Variáveis retornam valores (não mais `undefined`)
2. ✅ Tag "FB - Purchase" dispara corretamente
3. ✅ Meta recebe `custom_data` completo
4. ✅ Meta recebe `user_data` completo
5. ✅ Meta retorna **200 OK** (não mais 400)
6. ✅ Evento aparece no Meta Events Manager

---

## 🚨 **IMPORTANTE**

**Os paths estão confirmados baseado na estrutura REAL do Preview Mode!**

- ✅ **NÃO** usar `0.ecommerce.currency` (não tem `0:` na estrutura)
- ✅ **NÃO** usar `data.customer.email` (não tem `data:` na estrutura)
- ✅ **USAR** `ecommerce.currency` (nível raiz)
- ✅ **USAR** `user_data.email_address` (nível raiz)

---

**Última atualização**: 2025-01-05
**Versão**: 1.0 - CONFIRMADO BASEADO NA ESTRUTURA REAL


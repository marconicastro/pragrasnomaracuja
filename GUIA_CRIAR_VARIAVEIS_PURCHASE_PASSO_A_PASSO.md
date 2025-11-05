# 🎯 Guia Passo a Passo: Criar Variáveis Event Data para Purchase

## 📋 **Resumo Rápido**

Você precisa criar **30 variáveis Event Data** no GTM Server-Side para o evento Purchase funcionar corretamente.

**Tempo estimado**: 15-20 minutos

---

## 🚀 **FASE 1: Variáveis Críticas (5 variáveis)**

Estas são **obrigatórias** - sem elas o Meta retorna erro 400.

### **1.1. {{ed - ecommerce.currency}}**

```
Nome da variável: ed - ecommerce.currency
Tipo de variável: Event Data
Nome do campo de evento: ecommerce.currency
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `"BRL"`

---

### **1.2. {{ed - ecommerce.value}}**

```
Nome da variável: ed - ecommerce.value
Tipo de variável: Event Data
Nome do campo de evento: ecommerce.value
Tipo de valor: Número
Valor padrão: (deixar vazio)
```

**Valor esperado**: `39.9` (ou valor do produto)

---

### **1.3. {{ed - content_ids}}**

```
Nome da variável: ed - content_ids
Tipo de variável: Event Data
Nome do campo de evento: content_ids
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `["hacr962"]` (array como string)

**Nota**: Se retornar como objeto, pode precisar usar `content_ids.0` ao invés

---

### **1.4. {{ed - content_name}}**

```
Nome da variável: ed - content_name
Tipo de variável: Event Data
Nome do campo de evento: content_name
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `"Sistema 4 Fases - Ebook Trips"`

---

### **1.5. {{ed - content_type}}**

```
Nome da variável: ed - content_type
Tipo de variável: Event Data
Nome do campo de evento: content_type
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `"product"`

---

## 🚀 **FASE 2: User Data Essencial (4 variáveis)**

### **2.1. {{ed - user_data.email_address}}**

```
Nome da variável: ed - user_data.email_address
Tipo de variável: Event Data
Nome do campo de evento: user_data.email_address
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `"Example@Example.com"`

---

### **2.2. {{ed - user_data.phone_number}}**

```
Nome da variável: ed - user_data.phone_number
Tipo de variável: Event Data
Nome do campo de evento: user_data.phone_number
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `"34999999999"`

---

### **2.3. {{ed - user_data.first_name}}**

```
Nome da variável: ed - user_data.first_name
Tipo de variável: Event Data
Nome do campo de evento: user_data.first_name
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `"Example"`

---

### **2.4. {{ed - user_data.user_id}}**

```
Nome da variável: ed - user_data.user_id
Tipo de variável: Event Data
Nome do campo de evento: user_data.user_id
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `"sess_1762031294521_e5kv5ly8b"` (external_id)

---

## 🚀 **FASE 3: Metadata do Evento (3 variáveis)**

### **3.1. {{ed - event}}**

```
Nome da variável: ed - event
Tipo de variável: Event Data
Nome do campo de evento: event
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `"purchase"`

---

### **3.2. {{ed - event_id}}**

```
Nome da variável: ed - event_id
Tipo de variável: Event Data
Nome do campo de evento: event_id
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `"AUAe5xK_1730716200000"`

---

### **3.3. {{ed - ecommerce.transaction_id}}**

```
Nome da variável: ed - ecommerce.transaction_id
Tipo de variável: Event Data
Nome do campo de evento: ecommerce.transaction_id
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Valor esperado**: `"AUAe5xK"` (refId do webhook Cakto)

---

## 📊 **Mapeamento Webhook Cakto → Variáveis**

### **Como os dados do webhook chegam nas variáveis:**

| Dado do Webhook | Path no DataLayer | Variável GTM |
|-----------------|-------------------|--------------|
| `data.customer.email` | `user_data.email_address` | `{{ed - user_data.email_address}}` |
| `data.customer.phone` | `user_data.phone_number` | `{{ed - user_data.phone_number}}` |
| `data.customer.name` | `user_data.first_name` | `{{ed - user_data.first_name}}` |
| `data.refId` | `ecommerce.transaction_id` | `{{ed - ecommerce.transaction_id}}` |
| `data.amount` | `ecommerce.value` | `{{ed - ecommerce.value}}` |
| `data.offer.name` | `content_name` | `{{ed - content_name}}` |
| `data.product.id` | `content_ids[0]` | `{{ed - content_ids}}` |

---

## ✅ **Checklist de Validação**

Após criar todas as variáveis, verificar no Preview Mode:

- [ ] `{{ed - ecommerce.currency}}` = `"BRL"` ✅
- [ ] `{{ed - ecommerce.value}}` = `39.9` (número) ✅
- [ ] `{{ed - content_ids}}` = `["hacr962"]` ✅
- [ ] `{{ed - content_name}}` = `"Sistema 4 Fases - Ebook Trips"` ✅
- [ ] `{{ed - content_type}}` = `"product"` ✅
- [ ] `{{ed - user_data.email_address}}` = `"Example@Example.com"` ✅
- [ ] `{{ed - user_data.phone_number}}` = `"34999999999"` ✅
- [ ] `{{ed - user_data.first_name}}` = `"Example"` ✅
- [ ] `{{ed - user_data.user_id}}` = `"sess_xxx"` ✅
- [ ] `{{ed - event}}` = `"purchase"` ✅
- [ ] `{{ed - event_id}}` = `"AUAe5xK_xxx"` ✅
- [ ] `{{ed - ecommerce.transaction_id}}` = `"AUAe5xK"` ✅

---

## 🚨 **Problema Comum: Variável Retorna `undefined`**

### **Solução Passo a Passo:**

1. **No Preview Mode**, clique em **Dados do evento**
2. **Procure** o campo que você precisa (ex: `ecommerce.currency`)
3. **Verifique o caminho exato** (pode ser `0.ecommerce.currency` se estiver em array)
4. **Ajuste o path** na variável para corresponder exatamente

### **Exemplo:**

Se no Preview você vê:
```
Dados do evento:
  0: {
    ecommerce: {
      currency: "BRL"
    }
  }
```

Então o path deve ser: `0.ecommerce.currency`

---

## 🎯 **Ordem de Prioridade para Mapear na Tag FB - Purchase**

### **1. Custom Data (Mapear primeiro!)**

```
currency → {{ed - ecommerce.currency}}
value → {{ed - ecommerce.value}}
content_ids → {{ed - content_ids}}
content_name → {{ed - content_name}}
content_type → {{ed - content_type}}
num_items → {{ed - num_items}} (ou usar valor fixo: 1)
```

### **2. User Data (Mapear segundo!)**

```
email_address → {{ed - user_data.email_address}}
phone_number → {{ed - user_data.phone_number}}
first_name → {{ed - user_data.first_name}}
external_id → {{ed - user_data.user_id}}
```

### **3. Event Metadata (Mapear terceiro!)**

```
event_id → {{ed - event_id}}
```

---

## 📝 **Todas as Variáveis (Lista Completa)**

### **Custom Data (5 variáveis)**
1. `{{ed - ecommerce.currency}}`
2. `{{ed - ecommerce.value}}`
3. `{{ed - content_ids}}`
4. `{{ed - content_name}}`
5. `{{ed - content_type}}`

### **User Data (4 variáveis essenciais)**
6. `{{ed - user_data.email_address}}`
7. `{{ed - user_data.phone_number}}`
8. `{{ed - user_data.first_name}}`
9. `{{ed - user_data.user_id}}`

### **Metadata (3 variáveis)**
10. `{{ed - event}}`
11. `{{ed - event_id}}`
12. `{{ed - ecommerce.transaction_id}}`

### **Opcional (para melhor matching)**
13. `{{ed - user_data.last_name}}`
14. `{{ed - user_data.city}}`
15. `{{ed - user_data.region}}`
16. `{{ed - user_data.postal_code}}`
17. `{{ed - user_data.country}}`
18. `{{ed - num_items}}`
19. `{{ed - event_source_url}}`
20. `{{ed - client_ip_address}}`
21. `{{ed - client_user_agent}}`

---

## 🎉 **Resultado Final Esperado**

Após criar e mapear todas as variáveis:

1. ✅ Tag "FB - Purchase" dispara
2. ✅ Meta retorna **200 OK** (não mais 400)
3. ✅ `custom_data` completo enviado
4. ✅ `user_data` completo enviado
5. ✅ Evento aparece no Meta Events Manager
6. ✅ Evento aparece no GA4 Real-Time

---

**Última atualização**: 2025-01-05
**Versão**: 1.0



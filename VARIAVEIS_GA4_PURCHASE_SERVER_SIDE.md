# ✅ VARIÁVEIS GA4 - Purchase Event (Server-Side)

## 🎯 **EVENTO: Purchase via Webhook**

**Formato:** Purchase vem via webhook como **array** `[eventData]` → GTM coloca em `[0]`

**Paths necessários:** **COM prefixo `0.`**

---

## 📋 **VARIÁVEIS NECESSÁRIAS PARA GA4 PURCHASE**

### **Event Parameters (Parâmetros do Evento)**

| Parâmetro GA4 | Variável GTM | Path | Tipo | Exemplo |
|---------------|--------------|------|------|---------|
| `transaction_id` | `{{ed - purchase.transaction_id}}` | `0.ecommerce.transaction_id` | Texto | `"TEST_ORDER_123"` |
| `value` | `{{ed - purchase.value}}` | `0.ecommerce.value` | Número | `39.9` |
| `currency` | `{{ed - purchase.currency}}` | `0.ecommerce.currency` | Texto | `"BRL"` |
| `items` | `{{ed - purchase.items}}` | `0.ecommerce.items` | Array | `[{item_id: "hacr962", ...}]` |

---

## 🔧 **COMO CRIAR AS VARIÁVEIS NO GTM**

### **1. Variável: `{{ed - purchase.transaction_id}}`**

```
Nome da variável: ed - purchase.transaction_id
Tipo de variável: Event Data
Nome do campo de evento: 0.ecommerce.transaction_id
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

---

### **2. Variável: `{{ed - purchase.value}}`**

```
Nome da variável: ed - purchase.value
Tipo de variável: Event Data
Nome do campo de evento: 0.ecommerce.value
Tipo de valor: Número
Valor padrão: (deixar vazio)
```

---

### **3. Variável: `{{ed - purchase.currency}}`**

```
Nome da variável: ed - purchase.currency
Tipo de variável: Event Data
Nome do campo de evento: 0.ecommerce.currency
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

---

### **4. Variável: `{{ed - purchase.items}}`**

```
Nome da variável: ed - purchase.items
Tipo de variável: Event Data
Nome do campo de evento: 0.ecommerce.items
Tipo de valor: Array
Valor padrão: (deixar vazio)
```

---

## 📊 **CONFIGURAÇÃO DA TAG GA4 - Purchase**

### **Tag: "GA4 - Purchase" (ou "GA4 - All Events")**

**Tipo:** Google Analytics: GA4 Event

**Measurement ID:** `{{const - ga4 measurement id}}`

**Event Name:** `purchase` (fixo)

---

### **Event Parameters (Parâmetros do Evento):**

| Nome do Parâmetro | Valor (Variável) |
|-------------------|------------------|
| `transaction_id` | `{{ed - purchase.transaction_id}}` |
| `value` | `{{ed - purchase.value}}` |
| `currency` | `{{ed - purchase.currency}}` |
| `items` | `{{ed - purchase.items}}` |

---

### **User Properties (Propriedades do Usuário) - OPCIONAL:**

| Nome da Propriedade | Valor (Variável) |
|---------------------|------------------|
| `user_id` | `{{ed - purchase.user_data.user_id}}` |
| `email` | `{{ed - purchase.user_data.email_address}}` |
| `phone` | `{{ed - purchase.user_data.phone_number}}` |
| `city` | `{{ed - purchase.user_data.city}}` |
| `region` | `{{ed - purchase.user_data.region}}` |
| `country` | `{{ed - purchase.user_data.country}}` |

---

## ✅ **VARIÁVEIS ADICIONAIS (User Properties)**

Se quiser enviar User Properties também, use:

| Variável | Path |
|----------|------|
| `{{ed - purchase.user_data.user_id}}` | `0.user_data.user_id` |
| `{{ed - purchase.user_data.email_address}}` | `0.user_data.email_address` |
| `{{ed - purchase.user_data.phone_number}}` | `0.user_data.phone_number` |
| `{{ed - purchase.user_data.first_name}}` | `0.user_data.first_name` |
| `{{ed - purchase.user_data.last_name}}` | `0.user_data.last_name` |
| `{{ed - purchase.user_data.city}}` | `0.user_data.city` |
| `{{ed - purchase.user_data.region}}` | `0.user_data.region` |
| `{{ed - purchase.user_data.postal_code}}` | `0.user_data.postal_code` |
| `{{ed - purchase.user_data.country}}` | `0.user_data.country` |

**⚠️ IMPORTANTE:** User Properties são **opcionais** no GA4. Os parâmetros principais (`transaction_id`, `value`, `currency`, `items`) são **obrigatórios**.

---

## 📋 **CHECKLIST COMPLETO**

### **Variáveis Obrigatórias (Event Parameters):**
- [ ] `ed - purchase.transaction_id` → `0.ecommerce.transaction_id`
- [ ] `ed - purchase.value` → `0.ecommerce.value`
- [ ] `ed - purchase.currency` → `0.ecommerce.currency`
- [ ] `ed - purchase.items` → `0.ecommerce.items`

### **Variáveis Opcionais (User Properties):**
- [ ] `ed - purchase.user_data.user_id` → `0.user_data.user_id`
- [ ] `ed - purchase.user_data.email_address` → `0.user_data.email_address`
- [ ] `ed - purchase.user_data.phone_number` → `0.user_data.phone_number`
- [ ] `ed - purchase.user_data.city` → `0.user_data.city`
- [ ] `ed - purchase.user_data.region` → `0.user_data.region`
- [ ] `ed - purchase.user_data.country` → `0.user_data.country`

---

## 🎯 **RESUMO RÁPIDO**

### **Mínimo Necessário (Event Parameters):**
```
transaction_id: {{ed - purchase.transaction_id}}
value: {{ed - purchase.value}}
currency: {{ed - purchase.currency}}
items: {{ed - purchase.items}}
```

### **Completo (Event Parameters + User Properties):**
```
transaction_id: {{ed - purchase.transaction_id}}
value: {{ed - purchase.value}}
currency: {{ed - purchase.currency}}
items: {{ed - purchase.items}}

user_id: {{ed - purchase.user_data.user_id}}
email: {{ed - purchase.user_data.email_address}}
phone: {{ed - purchase.user_data.phone_number}}
city: {{ed - purchase.user_data.city}}
region: {{ed - purchase.user_data.region}}
country: {{ed - purchase.user_data.country}}
```

---

## ⚠️ **IMPORTANTE**

1. **Todas as variáveis começam com `0.`** porque Purchase vem via webhook como array
2. **Use `ed - purchase.*`** para diferenciar das variáveis de outros eventos (sem `0.`)
3. **Event Parameters são obrigatórios** para Purchase no GA4
4. **User Properties são opcionais** mas recomendados para melhor segmentação

---

**Última atualização**: 2025-01-05
**Versão**: 1.0
**Status**: ✅ CONFIGURAÇÃO COMPLETA


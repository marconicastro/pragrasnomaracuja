# 📋 Variáveis Event Data com Prefixo `0.` (Se dados estão em `0: {...}`)

## 🎯 **QUANDO USAR**

Use estes paths se no Preview Mode você vê:

```
Dados do evento:
Nome          Valor
0             { event: "purchase", ecommerce: {...}, user_data: {...} }
```

---

## ✅ **LISTA COMPLETA DE VARIÁVEIS**

### **Custom Data (Meta):**

| Variável | Path | Tipo | Valor Exemplo |
|----------|------|------|---------------|
| `{{ed - ecommerce.currency}}` | `0.ecommerce.currency` | Texto | `"BRL"` |
| `{{ed - ecommerce.value}}` | `0.ecommerce.value` | Número | `39.9` |
| `{{ed - content_ids}}` | `0.content_ids` | Texto | `["hacr962"]` |
| `{{ed - content_name}}` | `0.content_name` | Texto | `"Sistema 4 Fases - Ebook Trips"` |
| `{{ed - content_type}}` | `0.content_type` | Texto | `"product"` |
| `{{ed - num_items}}` | `0.num_items` | Número | `1` |
| `{{ed - ecommerce.transaction_id}}` | `0.ecommerce.transaction_id` | Texto | `"AUAe5xK"` |

### **User Data (Meta):**

| Variável | Path | Tipo | Valor Exemplo |
|----------|------|------|---------------|
| `{{ed - user_data.email_address}}` | `0.user_data.email_address` | Texto | `"Example@Example.com"` |
| `{{ed - user_data.phone_number}}` | `0.user_data.phone_number` | Texto | `"34999999999"` |
| `{{ed - user_data.first_name}}` | `0.user_data.first_name` | Texto | `"Example"` |
| `{{ed - user_data.last_name}}` | `0.user_data.last_name` | Texto | `""` |
| `{{ed - user_data.user_id}}` | `0.user_data.user_id` | Texto | `"sess_xxx"` |
| `{{ed - user_data.city}}` | `0.user_data.city` | Texto | `"caculé"` |
| `{{ed - user_data.region}}` | `0.user_data.region` | Texto | `"ba"` |
| `{{ed - user_data.postal_code}}` | `0.user_data.postal_code` | Texto | `"46300"` |
| `{{ed - user_data.country}}` | `0.user_data.country` | Texto | `"BR"` |

### **Metadata:**

| Variável | Path | Tipo | Valor Exemplo |
|----------|------|------|---------------|
| `{{ed - event}}` | `0.event` | Texto | `"purchase"` |
| `{{ed - event_id}}` | `0.event_id` | Texto | `"AUAe5xK_1730716200000"` |
| `{{ed - event_source_url}}` | `0.event_source_url` | Texto | `"https://www.maracujazeropragas.com/obrigado"` |
| `{{ed - client_ip_address}}` | `0.client_ip_address` | Texto | `"177.38.244.180"` |
| `{{ed - client_user_agent}}` | `0.client_user_agent` | Texto | `"Mozilla/5.0..."` |

---

## 📋 **Como Criar (Passo a Passo)**

### **Exemplo: Criar `{{ed - ecommerce.currency}}`**

```
Nome da variável: ed - ecommerce.currency
Tipo de variável: Event Data
Nome do campo de evento: 0.ecommerce.currency
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** O path é `0.ecommerce.currency` (COM o `0.` no início!)

---

## ✅ **Checklist**

- [ ] `{{ed - ecommerce.currency}}` → Path: `0.ecommerce.currency`
- [ ] `{{ed - ecommerce.value}}` → Path: `0.ecommerce.value`
- [ ] `{{ed - content_ids}}` → Path: `0.content_ids`
- [ ] `{{ed - content_name}}` → Path: `0.content_name`
- [ ] `{{ed - content_type}}` → Path: `0.content_type`
- [ ] `{{ed - user_data.email_address}}` → Path: `0.user_data.email_address`
- [ ] `{{ed - user_data.phone_number}}` → Path: `0.user_data.phone_number`
- [ ] `{{ed - user_data.first_name}}` → Path: `0.user_data.first_name`
- [ ] `{{ed - user_data.user_id}}` → Path: `0.user_data.user_id`
- [ ] `{{ed - event}}` → Path: `0.event`
- [ ] `{{ed - event_id}}` → Path: `0.event_id`
- [ ] `{{ed - ecommerce.transaction_id}}` → Path: `0.ecommerce.transaction_id`

---

## 🔍 **Como Verificar se Precisa Usar `0.`**

1. Abrir Preview Mode
2. Enviar evento de teste
3. Clicar em **Dados do evento**
4. **Se você vê `0: {...}`, use paths com `0.`**
5. **Se você vê `event: {...}` direto, use paths sem `0.`**

---

**Última atualização**: 2025-01-05
**Versão**: 1.0


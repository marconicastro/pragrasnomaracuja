# 📊 Resumo Executivo: Variáveis Event Data para Purchase

## 🎯 **Tabela Completa de Variáveis**

### **Custom Data (Meta Conversion API)**

| # | Nome da Variável | Path | Tipo | Valor Exemplo |
|---|------------------|------|------|---------------|
| 1 | `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto | `"BRL"` |
| 2 | `{{ed - ecommerce.value}}` | `ecommerce.value` | Número | `39.9` |
| 3 | `{{ed - content_ids}}` | `content_ids` | Texto | `["hacr962"]` |
| 4 | `{{ed - content_name}}` | `content_name` | Texto | `"Sistema 4 Fases - Ebook Trips"` |
| 5 | `{{ed - content_type}}` | `content_type` | Texto | `"product"` |
| 6 | `{{ed - num_items}}` | `num_items` | Número | `1` |
| 7 | `{{ed - ecommerce.transaction_id}}` | `ecommerce.transaction_id` | Texto | `"AUAe5xK"` |

---

### **User Data (Meta Conversion API)**

| # | Nome da Variável | Path | Tipo | Valor Exemplo |
|---|------------------|------|------|---------------|
| 8 | `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto | `"Example@Example.com"` |
| 9 | `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto | `"34999999999"` |
| 10 | `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto | `"Example"` |
| 11 | `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto | `""` |
| 12 | `{{ed - user_data.user_id}}` | `user_data.user_id` | Texto | `"sess_xxx"` |
| 13 | `{{ed - user_data.city}}` | `user_data.city` | Texto | `"caculé"` |
| 14 | `{{ed - user_data.region}}` | `user_data.region` | Texto | `"ba"` |
| 15 | `{{ed - user_data.postal_code}}` | `user_data.postal_code` | Texto | `"46300"` |
| 16 | `{{ed - user_data.country}}` | `user_data.country` | Texto | `"BR"` |

---

### **Metadata do Evento**

| # | Nome da Variável | Path | Tipo | Valor Exemplo |
|---|------------------|------|------|---------------|
| 17 | `{{ed - event}}` | `event` | Texto | `"purchase"` |
| 18 | `{{ed - event_id}}` | `event_id` | Texto | `"AUAe5xK_1730716200000"` |
| 19 | `{{ed - event_source_url}}` | `event_source_url` | Texto | `"https://www.maracujazeropragas.com/obrigado"` |
| 20 | `{{ed - client_ip_address}}` | `client_ip_address` | Texto | `"177.38.244.180"` |
| 21 | `{{ed - client_user_agent}}` | `client_user_agent` | Texto | `"Mozilla/5.0..."` |

---

## 📋 **Mapeamento: Webhook Cakto → Variáveis**

| Campo Webhook Cakto | Path Event Data | Variável GTM |
|---------------------|-----------------|--------------|
| `data.customer.email` | `user_data.email_address` | `{{ed - user_data.email_address}}` |
| `data.customer.phone` | `user_data.phone_number` | `{{ed - user_data.phone_number}}` |
| `data.customer.name` | `user_data.first_name` | `{{ed - user_data.first_name}}` |
| `data.refId` | `ecommerce.transaction_id` | `{{ed - ecommerce.transaction_id}}` |
| `data.amount` | `ecommerce.value` | `{{ed - ecommerce.value}}` |
| `data.offer.name` | `content_name` | `{{ed - content_name}}` |
| `data.product.id` | `content_ids[0]` | `{{ed - content_ids}}` |

---

## 🎯 **Mapeamento na Tag "FB - Purchase"**

### **Custom Data List**

| Campo Meta | Variável GTM |
|------------|--------------|
| `currency` | `{{ed - ecommerce.currency}}` |
| `value` | `{{ed - ecommerce.value}}` |
| `content_ids` | `{{ed - content_ids}}` |
| `content_name` | `{{ed - content_name}}` |
| `content_type` | `{{ed - content_type}}` |
| `num_items` | `{{ed - num_items}}` |
| `order_id` | `{{ed - ecommerce.transaction_id}}` |

### **User Data List**

| Campo Meta | Variável GTM |
|------------|--------------|
| `email_address` | `{{ed - user_data.email_address}}` |
| `phone_number` | `{{ed - user_data.phone_number}}` |
| `first_name` | `{{ed - user_data.first_name}}` |
| `last_name` | `{{ed - user_data.last_name}}` |
| `external_id` | `{{ed - user_data.user_id}}` |
| `city` | `{{ed - user_data.city}}` |
| `region` | `{{ed - user_data.region}}` |
| `postal_code` | `{{ed - user_data.postal_code}}` |
| `country` | `{{ed - user_data.country}}` |

### **Server Event Data List**

| Campo Meta | Variável GTM |
|------------|--------------|
| `event_id` | `{{ed - event_id}}` |

---

## ✅ **Checklist Rápido**

### **Variáveis Críticas (Criar Primeiro)**
- [ ] `{{ed - ecommerce.currency}}`
- [ ] `{{ed - ecommerce.value}}`
- [ ] `{{ed - content_ids}}`
- [ ] `{{ed - content_name}}`
- [ ] `{{ed - content_type}}`

### **User Data Essencial**
- [ ] `{{ed - user_data.email_address}}`
- [ ] `{{ed - user_data.phone_number}}`
- [ ] `{{ed - user_data.first_name}}`
- [ ] `{{ed - user_data.user_id}}`

### **Metadata**
- [ ] `{{ed - event}}`
- [ ] `{{ed - event_id}}`
- [ ] `{{ed - ecommerce.transaction_id}}`

---

## 🚀 **Ordem de Criação Recomendada**

1. **Fase 1**: Variáveis críticas (5 variáveis) - Resolve erro 400
2. **Fase 2**: User Data essencial (4 variáveis) - Melhora matching
3. **Fase 3**: Metadata (3 variáveis) - Identificação do evento
4. **Fase 4**: User Data opcional (5 variáveis) - Melhora DQS
5. **Fase 5**: Metadata opcional (2 variáveis) - Melhora EQM

---

**Última atualização**: 2025-01-05
**Versão**: 1.0


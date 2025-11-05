# 📋 Variáveis Event Data - Purchase Event (Webhook Cakto)

## ✅ Lista Completa de Variáveis Necessárias

### 🎯 **PRIORIDADE 1: Custom Data (Meta Conversion API)**

Estas variáveis são **obrigatórias** para o evento Purchase funcionar corretamente no Meta.

| # | Nome da Variável | Tipo | Path | Exemplo | Uso |
|---|------------------|------|------|---------|-----|
| 1 | `{{ed - ecommerce.currency}}` | Event Data | `ecommerce.currency` | `"BRL"` | Meta custom_data.currency |
| 2 | `{{ed - ecommerce.value}}` | Event Data | `ecommerce.value` | `39.9` | Meta custom_data.value |
| 3 | `{{ed - content_ids}}` | Event Data | `content_ids` | `["hacr962"]` | Meta custom_data.content_ids |
| 4 | `{{ed - content_name}}` | Event Data | `content_name` | `"Sistema 4 Fases - Ebook Trips"` | Meta custom_data.content_name |
| 5 | `{{ed - content_type}}` | Event Data | `content_type` | `"product"` | Meta custom_data.content_type |
| 6 | `{{ed - num_items}}` | Event Data | `num_items` | `1` | Meta custom_data.num_items |
| 7 | `{{ed - ecommerce.transaction_id}}` | Event Data | `ecommerce.transaction_id` | `"AUAe5xK"` | Meta custom_data.order_id |

---

### 🎯 **PRIORIDADE 2: User Data (Meta Conversion API)**

Estas variáveis são **obrigatórias** para matching e atribuição correta no Meta.

| # | Nome da Variável | Tipo | Path | Exemplo | Uso |
|---|------------------|------|------|---------|-----|
| 8 | `{{ed - user_data.email_address}}` | Event Data | `user_data.email_address` | `"Example@Example.com"` | Meta user_data.em (hasheado) |
| 9 | `{{ed - user_data.phone_number}}` | Event Data | `user_data.phone_number` | `"34999999999"` | Meta user_data.ph (hasheado) |
| 10 | `{{ed - user_data.first_name}}` | Event Data | `user_data.first_name` | `"Example"` | Meta user_data.fn (hasheado) |
| 11 | `{{ed - user_data.last_name}}` | Event Data | `user_data.last_name` | `""` | Meta user_data.ln (hasheado) |
| 12 | `{{ed - user_data.user_id}}` | Event Data | `user_data.user_id` | `"sess_xxx"` | Meta user_data.external_id |
| 13 | `{{ed - user_data.city}}` | Event Data | `user_data.city` | `"caculé"` | Meta user_data.ct (hasheado) |
| 14 | `{{ed - user_data.region}}` | Event Data | `user_data.region` | `"ba"` | Meta user_data.st (hasheado) |
| 15 | `{{ed - user_data.postal_code}}` | Event Data | `user_data.postal_code` | `"46300"` | Meta user_data.zp (hasheado) |
| 16 | `{{ed - user_data.country}}` | Event Data | `user_data.country` | `"BR"` | Meta user_data.country (hasheado) |

---

### 🎯 **PRIORIDADE 3: Metadata do Evento**

Estas variáveis são usadas para identificação e rastreamento do evento.

| # | Nome da Variável | Tipo | Path | Exemplo | Uso |
|---|------------------|------|------|---------|-----|
| 17 | `{{ed - event}}` | Event Data | `event` | `"purchase"` | Trigger, GA4 event_name |
| 18 | `{{ed - event_id}}` | Event Data | `event_id` | `"AUAe5xK_1730716200000"` | Meta event_id, GA4 event_id |
| 19 | `{{ed - event_source_url}}` | Event Data | `event_source_url` | `"https://www.maracujazeropragas.com/obrigado"` | Meta event_source_url |
| 20 | `{{ed - client_ip_address}}` | Event Data | `client_ip_address` | `"177.38.244.180"` | Meta user_data.client_ip_address |
| 21 | `{{ed - client_user_agent}}` | Event Data | `client_user_agent` | `"Mozilla/5.0..."` | Meta user_data.client_user_agent |

---

### 🎯 **PRIORIDADE 4: Ecommerce Details (GA4)**

Estas variáveis são usadas para enviar dados completos ao GA4.

| # | Nome da Variável | Tipo | Path | Exemplo | Uso |
|---|------------------|------|------|---------|-----|
| 22 | `{{ed - ecommerce.items.0.item_id}}` | Event Data | `ecommerce.items.0.item_id` | `"hacr962"` | GA4 item_id |
| 23 | `{{ed - ecommerce.items.0.item_name}}` | Event Data | `ecommerce.items.0.item_name` | `"Sistema 4 Fases - Ebook Trips"` | GA4 item_name |
| 24 | `{{ed - ecommerce.items.0.price}}` | Event Data | `ecommerce.items.0.price` | `39.9` | GA4 price |
| 25 | `{{ed - ecommerce.items.0.quantity}}` | Event Data | `ecommerce.items.0.quantity` | `1` | GA4 quantity |
| 26 | `{{ed - ecommerce.items.0.item_category}}` | Event Data | `ecommerce.items.0.item_category` | `"digital_product"` | GA4 item_category |
| 27 | `{{ed - ecommerce.items.0.item_brand}}` | Event Data | `ecommerce.items.0.item_brand` | `"Ebook Trips"` | GA4 item_brand |

---

### 🎯 **PRIORIDADE 5: Contents Array (Meta)**

Estas variáveis são usadas para o array `contents` no Meta custom_data.

| # | Nome da Variável | Tipo | Path | Exemplo | Uso |
|---|------------------|------|------|---------|-----|
| 28 | `{{ed - contents.0.id}}` | Event Data | `contents.0.id` | `"hacr962"` | Meta custom_data.contents[0].id |
| 29 | `{{ed - contents.0.quantity}}` | Event Data | `contents.0.quantity` | `1` | Meta custom_data.contents[0].quantity |
| 30 | `{{ed - contents.0.item_price}}` | Event Data | `contents.0.item_price` | `39.9` | Meta custom_data.contents[0].item_price |

---

## 📊 **Mapeamento: Webhook Cakto → Variáveis Event Data**

### **Dados do Cliente (Cakto → DataLayer)**

| Campo Cakto | Path Event Data | Variável GTM | Valor Exemplo |
|-------------|-----------------|--------------|---------------|
| `data.customer.name` | `user_data.first_name` + `user_data.last_name` | `{{ed - user_data.first_name}}` | `"Example"` |
| `data.customer.email` | `user_data.email_address` | `{{ed - user_data.email_address}}` | `"Example@Example.com"` |
| `data.customer.phone` | `user_data.phone_number` | `{{ed - user_data.phone_number}}` | `"34999999999"` |
| `data.refId` | `ecommerce.transaction_id` | `{{ed - ecommerce.transaction_id}}` | `"AUAe5xK"` |
| `data.amount` | `ecommerce.value` | `{{ed - ecommerce.value}}` | `5.55` |
| `data.offer.name` | `content_name` | `{{ed - content_name}}` | `"Offer Example"` |
| `data.product.id` | `content_ids[0]` | `{{ed - content_ids}}` | `["cd287b31-d4b7-4e94-858a-96e05ce2f4a2"]` |

---

## 🔧 **Como Criar as Variáveis no GTM Server-Side**

### **Passo 1: Acessar Variáveis**

1. No GTM Server-Side, vá em **Variáveis**
2. Clique em **Nova** → **Variável**
3. Escolha **Event Data**

### **Passo 2: Configurar Variável**

Para cada variável:

1. **Nome da variável**: Exemplo: `ed - ecommerce.currency`
2. **Tipo de variável**: `Event Data`
3. **Nome do campo de evento**: `ecommerce.currency` (o PATH, sem `{{ed - }}`)
4. **Tipo de valor**: `Texto` (para strings) ou `Número` (para números)

### **Passo 3: Exemplo Prático**

**Variável: `{{ed - ecommerce.currency}}`**

```
Nome da variável: ed - ecommerce.currency
Tipo de variável: Event Data
Nome do campo de evento: ecommerce.currency
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Variável: `{{ed - ecommerce.value}}`**

```
Nome da variável: ed - ecommerce.value
Tipo de variável: Event Data
Nome do campo de evento: ecommerce.value
Tipo de valor: Número
Valor padrão: (deixar vazio)
```

**Variável: `{{ed - user_data.email_address}}`**

```
Nome da variável: ed - user_data.email_address
Tipo de variável: Event Data
Nome do campo de evento: user_data.email_address
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

---

## 🎯 **Ordem de Criação Recomendada**

### **Fase 1: Variáveis Críticas (Erro 400 sem elas)**
1. `{{ed - ecommerce.currency}}` ← **CRÍTICO** (erro 400 sem isso!)
2. `{{ed - ecommerce.value}}` ← **CRÍTICO**
3. `{{ed - content_ids}}` ← **CRÍTICO**
4. `{{ed - content_name}}` ← **CRÍTICO**
5. `{{ed - content_type}}` ← **CRÍTICO**

### **Fase 2: User Data (Matching no Meta)**
6. `{{ed - user_data.email_address}}`
7. `{{ed - user_data.phone_number}}`
8. `{{ed - user_data.first_name}}`
9. `{{ed - user_data.user_id}}` (external_id)

### **Fase 3: Geolocalização (Melhora EQM)**
10. `{{ed - user_data.city}}`
11. `{{ed - user_data.region}}`
12. `{{ed - user_data.postal_code}}`
13. `{{ed - user_data.country}`

### **Fase 4: Metadata**
14. `{{ed - event}}`
15. `{{ed - event_id}}`
16. `{{ed - event_source_url}}`
17. `{{ed - client_ip_address}}`
18. `{{ed - client_user_agent}}`

### **Fase 5: Ecommerce Details (GA4)**
19-27. Variáveis de `ecommerce.items.0.*`

---

## ✅ **Validação: Verificar se Variáveis Estão Funcionando**

### **No Preview Mode do GTM Server-Side:**

1. Enviar evento de teste via ReqBin
2. No Preview Mode, verificar:
   - **Variáveis** → Cada variável deve mostrar o valor correto
   - Se aparecer `undefined`, o path está incorreto

### **Exemplo de Validação:**

```
Variável: {{ed - ecommerce.currency}}
Valor esperado: "BRL"
Valor encontrado: "BRL" ✅

Variável: {{ed - ecommerce.value}}
Valor esperado: 39.9
Valor encontrado: 39.9 ✅

Variável: {{ed - user_data.email_address}}
Valor esperado: "Example@Example.com"
Valor encontrado: "Example@Example.com" ✅
```

---

## 🚨 **Problemas Comuns e Soluções**

### **Problema 1: Variável retorna `undefined`**

**Causa**: Path incorreto ou dados não estão no payload

**Solução**: 
1. Verificar no Preview Mode → **Dados do evento** → Ver estrutura completa
2. Ajustar o path na variável para corresponder exatamente à estrutura

### **Problema 2: Array retorna como objeto**

**Causa**: `content_ids` é um array, mas variável está tentando acessar como string

**Solução**: 
- Para `content_ids`, criar variável com path `content_ids` (retorna array completo)
- Para acessar primeiro item: `content_ids.0` (mas melhor usar array completo)

### **Problema 3: Número retorna como string**

**Causa**: Tipo de valor configurado como "Texto" ao invés de "Número"

**Solução**: Alterar **Tipo de valor** para **Número** na configuração da variável

---

## 📝 **Checklist Final**

- [ ] Todas as variáveis PRIORIDADE 1 criadas
- [ ] Todas as variáveis PRIORIDADE 2 criadas
- [ ] Todas as variáveis PRIORIDADE 3 criadas
- [ ] Variáveis testadas no Preview Mode
- [ ] Nenhuma variável retornando `undefined`
- [ ] Tag "FB - Purchase" mapeada com todas as variáveis
- [ ] Tag GA4 mapeada com variáveis de ecommerce

---

## 🎉 **Resultado Esperado**

Após criar todas as variáveis:

1. ✅ Tag "FB - Purchase" dispara corretamente
2. ✅ Meta recebe `custom_data` completo (currency, value, content_ids, etc)
3. ✅ Meta recebe `user_data` completo (email, phone, city, etc)
4. ✅ Erro 400 "Moeda ausente" **NÃO** aparece mais
5. ✅ Status 200 OK do Meta
6. ✅ Eventos aparecem no Meta Events Manager
7. ✅ Eventos aparecem no GA4 Real-Time

---

**Última atualização**: 2025-01-05
**Versão**: 1.0



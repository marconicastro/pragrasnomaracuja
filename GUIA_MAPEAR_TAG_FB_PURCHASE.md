# 🎯 GUIA: Mapear Variáveis na Tag "FB - Purchase"

**Objetivo:** Configurar a tag "FB - Purchase" para usar as variáveis Event Data criadas.

---

## 📍 LOCALIZAÇÃO

1. Abrir GTM Server-Side
2. Ir em **Tags**
3. Abrir tag **FB - Purchase**

---

## 🔧 CONFIGURAÇÃO: CUSTOM DATA

### **1. Acessar Custom Data**

Na tag "FB - Purchase":
1. Rolando até **Custom Data**
2. Expandir seção **Custom Data**

---

### **2. Mapear Campos Obrigatórios**

**Campos críticos (resolvem o erro atual):**

#### **`currency`**
- **Campo:** `currency`
- **Valor:** `{{ed - ecommerce.currency}}`
- **Prioridade:** 🔴 **CRÍTICA**

#### **`value`**
- **Campo:** `value`
- **Valor:** `{{ed - ecommerce.value}}`
- **Prioridade:** 🔴 **CRÍTICA**

#### **`order_id`**
- **Campo:** `order_id`
- **Valor:** `{{ed - ecommerce.transaction_id}}`
- **Prioridade:** 🔴 **CRÍTICA**

---

### **3. Mapear Campos Importantes**

#### **`content_name`**
- **Campo:** `content_name`
- **Valor:** `{{ed - content_name}}`

#### **`content_type`**
- **Campo:** `content_type`
- **Valor:** `{{ed - content_type}}`

#### **`content_ids`**
- **Campo:** `content_ids`
- **Valor:** `{{ed - content_ids}}`

#### **`contents`**
- **Campo:** `contents`
- **Valor:** `{{ed - contents}}`

#### **`num_items`**
- **Campo:** `num_items`
- **Valor:** `{{ed - num_items}}`

---

## 👤 CONFIGURAÇÃO: USER DATA

### **1. Acessar User Data**

Na tag "FB - Purchase":
1. Rolando até **User Data**
2. Expandir seção **User Data**

---

### **2. Mapear Campos Importantes**

#### **`external_id`**
- **Campo:** `external_id`
- **Valor:** `{{ed - user_data.user_id}}`
- **Prioridade:** 🟡 **IMPORTANTE** (para atribuição)

#### **`email_address`**
- **Campo:** `email_address`
- **Valor:** `{{ed - user_data.email_address}}`
- **Nota:** Será hasheado automaticamente pelo GTM

#### **`phone_number`**
- **Campo:** `phone_number`
- **Valor:** `{{ed - user_data.phone_number}}`
- **Nota:** Será hasheado automaticamente pelo GTM

#### **`first_name`**
- **Campo:** `first_name`
- **Valor:** `{{ed - user_data.first_name}}`
- **Nota:** Será hasheado automaticamente pelo GTM

#### **`last_name`**
- **Campo:** `last_name`
- **Valor:** `{{ed - user_data.last_name}}`
- **Nota:** Será hasheado automaticamente pelo GTM

#### **`city`**
- **Campo:** `city`
- **Valor:** `{{ed - user_data.city}}`
- **Nota:** Será hasheado automaticamente pelo GTM

#### **`state`**
- **Campo:** `state`
- **Valor:** `{{ed - user_data.region}}`
- **Nota:** Será hasheado automaticamente pelo GTM

#### **`zip`**
- **Campo:** `zip`
- **Valor:** `{{ed - user_data.postal_code}}`
- **Nota:** Será hasheado automaticamente pelo GTM

#### **`country`**
- **Campo:** `country`
- **Valor:** `{{ed - user_data.country}}`
- **Nota:** Será hasheado automaticamente pelo GTM

#### **`client_ip_address`** (se disponível)
- **Campo:** `client_ip_address`
- **Valor:** `{{ed - client_ip_address}}`
- **Nota:** Não é hasheado (IP é enviado em texto)

#### **`client_user_agent`** (se disponível)
- **Campo:** `client_user_agent`
- **Valor:** `{{ed - client_user_agent}}`
- **Nota:** Não é hasheado (User Agent é enviado em texto)

---

## 📋 CONFIGURAÇÃO: EVENT METADATA

### **1. Acessar Event Metadata**

Na tag "FB - Purchase":
1. Rolando até **Event Metadata**
2. Expandir seção **Event Metadata**

---

### **2. Mapear Campos**

#### **`Event ID`**
- **Campo:** `Event ID`
- **Valor:** `{{ed - event_id}}`

#### **`Event Source URL`**
- **Campo:** `Event Source URL`
- **Valor:** `{{ed - event_source_url}}`

---

## ✅ CHECKLIST DE MAPEAMENTO

### **Custom Data:**
- [ ] `currency` = `{{ed - ecommerce.currency}}`
- [ ] `value` = `{{ed - ecommerce.value}}`
- [ ] `order_id` = `{{ed - ecommerce.transaction_id}}`
- [ ] `content_name` = `{{ed - content_name}}`
- [ ] `content_type` = `{{ed - content_type}}`
- [ ] `content_ids` = `{{ed - content_ids}}`
- [ ] `contents` = `{{ed - contents}}`
- [ ] `num_items` = `{{ed - num_items}}`

### **User Data:**
- [ ] `external_id` = `{{ed - user_data.user_id}}`
- [ ] `email_address` = `{{ed - user_data.email_address}}`
- [ ] `phone_number` = `{{ed - user_data.phone_number}}`
- [ ] `first_name` = `{{ed - user_data.first_name}}`
- [ ] `last_name` = `{{ed - user_data.last_name}}`
- [ ] `city` = `{{ed - user_data.city}}`
- [ ] `state` = `{{ed - user_data.region}}`
- [ ] `zip` = `{{ed - user_data.postal_code}}`
- [ ] `country` = `{{ed - user_data.country}}`
- [ ] `client_ip_address` = `{{ed - client_ip_address}}` (opcional)
- [ ] `client_user_agent` = `{{ed - client_user_agent}}` (opcional)

### **Event Metadata:**
- [ ] `Event ID` = `{{ed - event_id}}`
- [ ] `Event Source URL` = `{{ed - event_source_url}}`

---

## 🎯 ORDEM DE PRIORIDADE

### **FASE 1: Resolver Erro (CRÍTICO)**
1. ✅ Mapear `currency` = `{{ed - ecommerce.currency}}`
2. ✅ Mapear `value` = `{{ed - ecommerce.value}}`
3. ✅ Mapear `order_id` = `{{ed - ecommerce.transaction_id}}`

**Testar:** Verificar se erro do Meta desaparece.

---

### **FASE 2: Melhorar Qualidade (IMPORTANTE)**
4. ✅ Mapear `content_name` = `{{ed - content_name}}`
5. ✅ Mapear `content_type` = `{{ed - content_type}}`
6. ✅ Mapear `content_ids` = `{{ed - content_ids}}`
7. ✅ Mapear `num_items` = `{{ed - num_items}}`

---

### **FASE 3: Atribuição (RECOMENDADO)**
8. ✅ Mapear `external_id` = `{{ed - user_data.user_id}}`
9. ✅ Mapear `email_address` = `{{ed - user_data.email_address}}`
10. ✅ Mapear `phone_number` = `{{ed - user_data.phone_number}}`
11. ✅ Mapear campos de geolocalização (city, state, zip, country)

---

## 🔍 VALIDAÇÃO

Após mapear, testar:

1. **Enviar evento de teste via ReqBin**
2. **Verificar no Preview Mode:**
   - ✅ Evento aparece no stream
   - ✅ Variáveis têm valores corretos
   - ✅ Tag "FB - Purchase" dispara

3. **Verificar payload enviado ao Meta:**
   - ✅ `custom_data.currency` presente e correto
   - ✅ `custom_data.value` presente e correto
   - ✅ `custom_data.order_id` presente e correto
   - ✅ Outros campos mapeados também presentes

4. **Verificar resposta do Meta:**
   - ✅ Status 200 (sem erro)
   - ✅ Sem mensagem de erro sobre moeda

---

## 📊 EXEMPLO DE PAYLOAD ESPERADO

**Antes (❌ Erro):**
```json
{
  "custom_data": {},
  ...
}
```

**Depois (✅ Correto):**
```json
{
  "custom_data": {
    "value": 39.9,
    "currency": "BRL",
    "order_id": "TEST_ORDER_123",
    "content_name": "Sistema 4 Fases - Ebook Trips",
    "content_type": "product",
    "content_ids": ["hacr962"],
    "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
    "num_items": 1
  },
  "user_data": {
    "external_id": "...",
    "em": "***",  // hasheado automaticamente
    "ph": "***",  // hasheado automaticamente
    ...
  }
}
```

---

## 🎉 SUCESSO

Quando o payload estiver correto, o Meta aceitará o evento sem erro!

**Status esperado:** ✅ **200 OK** (sem erro)




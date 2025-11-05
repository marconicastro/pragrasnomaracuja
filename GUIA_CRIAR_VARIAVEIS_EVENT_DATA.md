# 📋 GUIA: Criar Variáveis Event Data para Purchase

**Objetivo:** Criar todas as variáveis Event Data (`{{ed - *}}`) necessárias para capturar os dados do evento `purchase` e mapeá-las na tag "FB - Purchase".

---

## ❌ PROBLEMA ATUAL

O payload enviado ao Meta está com `custom_data` vazio:
```json
{
  "custom_data": {},
  ...
}
```

**Erro do Meta:**
```
"error_user_msg":"Seu evento de compra não inclui um parâmetro de moeda. Insira um parâmetro de moeda. Por exemplo: USD"
```

**Causa:** A tag "FB - Purchase" não está mapeando os campos do evento para o `custom_data`.

---

## ✅ SOLUÇÃO

Criar variáveis Event Data (`{{ed - *}}`) e mapeá-las na tag "FB - Purchase".

---

## 📝 VARIÁVEIS A CRIAR

### **1. Variáveis de Ecommerce (Custom Data - Obrigatórias)**

#### **`ed - ecommerce.value`**
- **Tipo:** Event Data Variable
- **Path:** `ecommerce.value`
- **Uso:** Mapear em `Custom Data → value` na tag FB - Purchase

#### **`ed - ecommerce.currency`**
- **Tipo:** Event Data Variable
- **Path:** `ecommerce.currency`
- **Uso:** Mapear em `Custom Data → currency` na tag FB - Purchase

#### **`ed - ecommerce.transaction_id`**
- **Tipo:** Event Data Variable
- **Path:** `ecommerce.transaction_id`
- **Uso:** Mapear em `Custom Data → order_id` na tag FB - Purchase (ou usar diretamente como `transaction_id`)

---

### **2. Variáveis de Content (Custom Data - Importantes)**

#### **`ed - content_name`**
- **Tipo:** Event Data Variable
- **Path:** `content_name`
- **Uso:** Mapear em `Custom Data → content_name` na tag FB - Purchase

#### **`ed - content_type`**
- **Tipo:** Event Data Variable
- **Path:** `content_type`
- **Uso:** Mapear em `Custom Data → content_type` na tag FB - Purchase

#### **`ed - content_ids`**
- **Tipo:** Event Data Variable
- **Path:** `content_ids`
- **Uso:** Mapear em `Custom Data → content_ids` na tag FB - Purchase

#### **`ed - contents`**
- **Tipo:** Event Data Variable
- **Path:** `contents`
- **Uso:** Mapear em `Custom Data → contents` na tag FB - Purchase

#### **`ed - num_items`**
- **Tipo:** Event Data Variable
- **Path:** `num_items`
- **Uso:** Mapear em `Custom Data → num_items` na tag FB - Purchase

---

### **3. Variáveis de User Data (User Data - Importantes)**

#### **`ed - user_data.user_id`**
- **Tipo:** Event Data Variable
- **Path:** `user_data.user_id`
- **Uso:** Mapear em `User Data → external_id` na tag FB - Purchase

#### **`ed - user_data.email_address`**
- **Tipo:** Event Data Variable
- **Path:** `user_data.email_address`
- **Uso:** Mapear em `User Data → email_address` na tag FB - Purchase (hashear depois)

#### **`ed - user_data.phone_number`**
- **Tipo:** Event Data Variable
- **Path:** `user_data.phone_number`
- **Uso:** Mapear em `User Data → phone_number` na tag FB - Purchase (hashear depois)

#### **`ed - user_data.first_name`**
- **Tipo:** Event Data Variable
- **Path:** `user_data.first_name`
- **Uso:** Mapear em `User Data → first_name` na tag FB - Purchase (hashear depois)

#### **`ed - user_data.last_name`**
- **Tipo:** Event Data Variable
- **Path:** `user_data.last_name`
- **Uso:** Mapear em `User Data → last_name` na tag FB - Purchase (hashear depois)

#### **`ed - user_data.city`**
- **Tipo:** Event Data Variable
- **Path:** `user_data.city`
- **Uso:** Mapear em `User Data → city` na tag FB - Purchase (hashear depois)

#### **`ed - user_data.region`**
- **Tipo:** Event Data Variable
- **Path:** `user_data.region`
- **Uso:** Mapear em `User Data → state` na tag FB - Purchase (hashear depois)

#### **`ed - user_data.postal_code`**
- **Tipo:** Event Data Variable
- **Path:** `user_data.postal_code`
- **Uso:** Mapear em `User Data → zip` na tag FB - Purchase (hashear depois)

#### **`ed - user_data.country`**
- **Tipo:** Event Data Variable
- **Path:** `user_data.country`
- **Uso:** Mapear em `User Data → country` na tag FB - Purchase (hashear depois)

---

### **4. Variáveis de Metadata (Event Metadata - Importantes)**

#### **`ed - event_id`**
- **Tipo:** Event Data Variable
- **Path:** `event_id`
- **Uso:** Mapear em `Event ID` na tag FB - Purchase

#### **`ed - event_source_url`**
- **Tipo:** Event Data Variable
- **Path:** `event_source_url`
- **Uso:** Mapear em `Event Source URL` na tag FB - Purchase

#### **`ed - client_ip_address`**
- **Tipo:** Event Data Variable
- **Path:** `client_ip_address`
- **Uso:** Mapear em `User Data → client_ip_address` na tag FB - Purchase (se disponível)

#### **`ed - client_user_agent`**
- **Tipo:** Event Data Variable
- **Path:** `client_user_agent`
- **Uso:** Mapear em `User Data → client_user_agent` na tag FB - Purchase (se disponível)

---

## 🔧 PASSO A PASSO: CRIAR VARIÁVEIS

### **1. Acessar GTM Server-Side**

1. Abrir GTM Server-Side
2. Ir em **Variáveis** (lateral esquerda)
3. Clicar em **Nova** (botão vermelho)

---

### **2. Criar Variável Event Data**

Para cada variável:

1. **Tipo de Variável:** Escolher **Event Data Variable**
2. **Nome da Variável:** Ex: `ed - ecommerce.value`
3. **Path do Event Data:** Ex: `ecommerce.value`
4. **Salvar**

---

### **3. Exemplo: Criar `ed - ecommerce.value`**

```
Nome: ed - ecommerce.value
Tipo: Event Data Variable
Path: ecommerce.value
```

**Screenshot esperado:**
```
┌─────────────────────────────────────┐
│ Nome da Variável                    │
│ ed - ecommerce.value                │
├─────────────────────────────────────┤
│ Tipo de Variável                    │
│ Event Data Variable                 │
├─────────────────────────────────────┤
│ Path do Event Data                  │
│ ecommerce.value                     │
└─────────────────────────────────────┘
```

---

## 📋 CHECKLIST DE VARIÁVEIS

### **Custom Data (Obrigatórias):**
- [ ] `ed - ecommerce.value`
- [ ] `ed - ecommerce.currency`
- [ ] `ed - ecommerce.transaction_id`
- [ ] `ed - content_name`
- [ ] `ed - content_type`
- [ ] `ed - content_ids`
- [ ] `ed - contents`
- [ ] `ed - num_items`

### **User Data (Importantes):**
- [ ] `ed - user_data.user_id` (para external_id)
- [ ] `ed - user_data.email_address`
- [ ] `ed - user_data.phone_number`
- [ ] `ed - user_data.first_name`
- [ ] `ed - user_data.last_name`
- [ ] `ed - user_data.city`
- [ ] `ed - user_data.region` (para state)
- [ ] `ed - user_data.postal_code`
- [ ] `ed - user_data.country`

### **Metadata:**
- [ ] `ed - event_id`
- [ ] `ed - event_source_url`
- [ ] `ed - client_ip_address` (opcional)
- [ ] `ed - client_user_agent` (opcional)

---

## 🎯 PRÓXIMO PASSO

Após criar todas as variáveis, **mapear na tag "FB - Purchase"**:

1. Abrir tag **FB - Purchase**
2. Ir em **Custom Data**
3. Mapear cada campo usando as variáveis criadas:
   - `value` → `{{ed - ecommerce.value}}`
   - `currency` → `{{ed - ecommerce.currency}}`
   - `order_id` → `{{ed - ecommerce.transaction_id}}`
   - `content_name` → `{{ed - content_name}}`
   - `content_type` → `{{ed - content_type}}`
   - `content_ids` → `{{ed - content_ids}}`
   - `contents` → `{{ed - contents}}`
   - `num_items` → `{{ed - num_items}}`

4. Ir em **User Data**
5. Mapear cada campo:
   - `external_id` → `{{ed - user_data.user_id}}`
   - `email_address` → `{{ed - user_data.email_address}}` (será hasheado automaticamente)
   - `phone_number` → `{{ed - user_data.phone_number}}` (será hasheado automaticamente)
   - `first_name` → `{{ed - user_data.first_name}}` (será hasheado automaticamente)
   - `last_name` → `{{ed - user_data.last_name}}` (será hasheado automaticamente)
   - `city` → `{{ed - user_data.city}}` (será hasheado automaticamente)
   - `state` → `{{ed - user_data.region}}` (será hasheado automaticamente)
   - `zip` → `{{ed - user_data.postal_code}}` (será hasheado automaticamente)
   - `country` → `{{ed - user_data.country}}` (será hasheado automaticamente)
   - `client_ip_address` → `{{ed - client_ip_address}}` (se disponível)
   - `client_user_agent` → `{{ed - client_user_agent}}` (se disponível)

6. Ir em **Event Metadata**
7. Mapear:
   - `Event ID` → `{{ed - event_id}}`
   - `Event Source URL` → `{{ed - event_source_url}}`

---

## ✅ VALIDAÇÃO

Após mapear, testar novamente:

1. Enviar evento de teste via ReqBin
2. Verificar no Preview Mode do GTM Server-Side:
   - ✅ Evento aparece no stream
   - ✅ Tag "FB - Purchase" dispara
   - ✅ Variáveis têm valores corretos
3. Verificar na tag "FB - Purchase":
   - ✅ Payload enviado ao Meta tem `custom_data` preenchido
   - ✅ `currency` está presente
   - ✅ `value` está presente
   - ✅ `content_name` e `content_type` estão presentes

---

## 📊 FORMATO ESPERADO DO PAYLOAD

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
    "em": "***",  // hasheado
    "ph": "***",  // hasheado
    ...
  }
}
```

---

## 🎉 SUCESSO

Quando o payload estiver correto, o Meta aceitará o evento sem erro!




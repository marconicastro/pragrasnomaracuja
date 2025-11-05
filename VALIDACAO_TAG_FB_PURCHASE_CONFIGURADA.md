# ✅ VALIDAÇÃO: Tag "FB - Purchase" Configurada Corretamente

**Status:** ✅ **TODAS AS VARIÁVEIS CORRETAS**

---

## ✅ USER DATA (Todos Corretos)

| Campo | Variável | Status |
|-------|----------|--------|
| First Name | `{{ed - user_data.first_name}}` | ✅ Correto |
| Last Name | `{{ed - user_data.last_name}}` | ✅ Correto |
| Email | `{{ed - user_data.email_address}}` | ✅ Correto |
| Country | `{{ed - user_data.country}}` | ✅ Correto |
| City | `{{ed - user_data.city}}` | ✅ Correto |
| Zip | `{{ed - user_data.postal_code}}` | ✅ Correto |
| Phone | `{{ed - user_data.phone_number}}` | ✅ Correto |
| State | `{{ed - user_data.region}}` | ✅ Correto |
| External ID | `{{cs - x-stape-user-id}}` | ✅ Correto (Client-Side Variable) |

---

## ✅ CUSTOM DATA (Todos Corretos)

| Campo | Variável | Status |
|-------|----------|--------|
| content_ids | `{{ed - content_ids}}` | ✅ Correto (nível raiz) |
| contents | `{{ed - contents}}` | ✅ Correto (nível raiz) |
| value | `{{ed - ecommerce.value}}` | ✅ **CORRIGIDO** |
| currency | `{{ed - ecommerce.currency}}` | ✅ **CORRIGIDO** |
| order_id | `{{ed - ecommerce.transaction_id}}` | ✅ **CORRIGIDO** |
| num_items | `{{ed - num_items}}` | ✅ Correto (nível raiz) |
| content_name | `{{ed - content_name}}` | ✅ Correto (nível raiz) |
| content_type | `{{ed - content_type}}` | ✅ Correto (nível raiz) |

---

## ✅ EVENT METADATA

| Campo | Variável | Status |
|-------|----------|--------|
| Event ID | `{{ed - event_id}}` | ✅ Correto (nível raiz) |

---

## 📊 RESUMO

### **Variáveis Corrigidas (3):**
1. ✅ `{{ed - ecommerce.value}}` (era `{{ed - value}}`)
2. ✅ `{{ed - ecommerce.currency}}` (era `{{ed - currency}}`)
3. ✅ `{{ed - ecommerce.transaction_id}}` (era `{{ed - transaction_id}}`)

### **Variáveis User Data Corrigidas (8):**
1. ✅ `{{ed - user_data.first_name}}`
2. ✅ `{{ed - user_data.last_name}}`
3. ✅ `{{ed - user_data.email_address}}`
4. ✅ `{{ed - user_data.country}}`
5. ✅ `{{ed - user_data.city}}`
6. ✅ `{{ed - user_data.postal_code}}`
7. ✅ `{{ed - user_data.phone_number}}`
8. ✅ `{{ed - user_data.region}}`

### **Variáveis que Já Estavam Corretas (6):**
1. ✅ `{{ed - content_ids}}`
2. ✅ `{{ed - contents}}`
3. ✅ `{{ed - num_items}}`
4. ✅ `{{ed - content_name}}`
5. ✅ `{{ed - content_type}}`
6. ✅ `{{ed - event_id}}`

---

## 🎯 PRÓXIMO PASSO: TESTAR

### **1. Enviar Evento de Teste via Webhook (ReqBin)**

### **2. Verificar no Preview Mode do GTM Server-Side:**
- ✅ Evento aparece no stream
- ✅ Variáveis Event Data têm valores (não mais `undefined`)
- ✅ Tag "FB - Purchase" dispara

### **3. Verificar Payload Enviado ao Meta:**
- ✅ `custom_data.value` presente e correto
- ✅ `custom_data.currency` presente e correto
- ✅ `custom_data.order_id` presente e correto
- ✅ `custom_data.content_ids` presente
- ✅ `custom_data.contents` presente
- ✅ `custom_data.num_items` presente
- ✅ `custom_data.content_name` presente
- ✅ `custom_data.content_type` presente
- ✅ `user_data.em` presente (email hasheado)
- ✅ `user_data.ph` presente (phone hasheado)
- ✅ `user_data.fn` presente (first_name hasheado)
- ✅ `user_data.ln` presente (last_name hasheado)
- ✅ `user_data.ct` presente (city hasheado)
- ✅ `user_data.st` presente (state hasheado)
- ✅ `user_data.zp` presente (zip hasheado)
- ✅ `user_data.country` presente (country hasheado)
- ✅ `user_data.external_id` presente

### **4. Verificar Resposta do Meta:**
- ✅ Status 200 OK (sem erro)
- ✅ Sem mensagem de erro sobre moeda
- ✅ Evento aceito pelo Meta

---

## ✅ RESULTADO ESPERADO

**Antes (❌ Erro):**
```json
{
  "custom_data": {},
  "error": "Moeda ausente para o evento de compra"
}
```

**Depois (✅ Correto):**
```json
{
  "custom_data": {
    "value": 39.9,
    "currency": "BRL",
    "order_id": "TEST_ORDER_123",
    "content_ids": ["hacr962"],
    "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
    "num_items": 1,
    "content_name": "Sistema 4 Fases - Ebook Trips",
    "content_type": "product"
  },
  "user_data": {
    "external_id": "...",
    "em": "***",  // hasheado
    "ph": "***",  // hasheado
    "fn": "***",  // hasheado
    "ln": "***",  // hasheado
    "ct": "***",  // hasheado
    "st": "***",  // hasheado
    "zp": "***",  // hasheado
    "country": "***"  // hasheado
  }
}
```

---

## 🎉 CONCLUSÃO

**Tag "FB - Purchase" está 100% configurada corretamente!**

**Todas as variáveis estão usando os paths corretos:**
- ✅ Ecommerce: `ecommerce.value`, `ecommerce.currency`, `ecommerce.transaction_id`
- ✅ User Data: `user_data.*` (todos os campos)
- ✅ Content: `content_ids`, `contents`, `num_items`, `content_name`, `content_type`
- ✅ Metadata: `event_id`

**Agora é só testar e verificar se o evento é aceito pelo Meta sem erros!** 🚀




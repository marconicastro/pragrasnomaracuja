# 🎯 Como Mapear Variáveis na Tag "FB - Purchase"

## 📋 **Pré-requisitos**

✅ Todas as variáveis Event Data criadas (ver `GUIA_CRIAR_VARIAVEIS_PURCHASE_PASSO_A_PASSO.md`)
✅ Tag "FB - Purchase" criada no GTM Server-Side
✅ Trigger configurado (Event Name = "Data" + Filtro `{{ed - event}} = purchase`)

---

## 🔧 **Passo 1: Acessar a Tag "FB - Purchase"**

1. No GTM Server-Side, vá em **Tags**
2. Clique em **FB - Purchase**
3. Role até a seção **Custom Data** e **User Data**

---

## 📊 **Passo 2: Mapear Custom Data**

### **2.1. Configuração de Custom Data**

Na tag "FB - Purchase", encontre a seção **Custom Data** (ou `customDataList`).

**Adicionar os seguintes campos:**

| Campo | Variável | Tipo |
|-------|----------|------|
| `currency` | `{{ed - ecommerce.currency}}` | Texto |
| `value` | `{{ed - ecommerce.value}}` | Número |
| `content_ids` | `{{ed - content_ids}}` | Texto |
| `content_name` | `{{ed - content_name}}` | Texto |
| `content_type` | `{{ed - content_type}}` | Texto |
| `num_items` | `{{ed - num_items}}` | Número (ou valor fixo: `1`) |
| `order_id` | `{{ed - ecommerce.transaction_id}}` | Texto |

### **2.2. Exemplo de Configuração (Stape)**

Se estiver usando Stape Facebook Conversion API tag:

```
Custom Data List:
  ┌─────────────────┬──────────────────────────────┐
  │ Name            │ Value                        │
  ├─────────────────┼──────────────────────────────┤
  │ currency        │ {{ed - ecommerce.currency}}  │
  │ value           │ {{ed - ecommerce.value}}     │
  │ content_ids     │ {{ed - content_ids}}        │
  │ content_name    │ {{ed - content_name}}        │
  │ content_type    │ {{ed - content_type}}       │
  │ num_items       │ {{ed - num_items}}           │
  │ order_id        │ {{ed - ecommerce.transaction_id}} │
  └─────────────────┴──────────────────────────────┘
```

---

## 👤 **Passo 3: Mapear User Data**

### **3.1. Configuração de User Data**

Na tag "FB - Purchase", encontre a seção **User Data** (ou `userDataList`).

**Adicionar os seguintes campos:**

| Campo | Variável | Tipo | Observação |
|-------|----------|------|------------|
| `email_address` | `{{ed - user_data.email_address}}` | Texto | Será hasheado automaticamente pela tag |
| `phone_number` | `{{ed - user_data.phone_number}}` | Texto | Será hasheado automaticamente pela tag |
| `first_name` | `{{ed - user_data.first_name}}` | Texto | Será hasheado automaticamente pela tag |
| `last_name` | `{{ed - user_data.last_name}}` | Texto | Será hasheado automaticamente pela tag |
| `external_id` | `{{ed - user_data.user_id}}` | Texto | **NÃO** será hasheado (conforme Meta) |
| `city` | `{{ed - user_data.city}}` | Texto | Será hasheado automaticamente pela tag |
| `region` | `{{ed - user_data.region}}` | Texto | Será hasheado automaticamente pela tag |
| `postal_code` | `{{ed - user_data.postal_code}}` | Texto | Será hasheado automaticamente pela tag |
| `country` | `{{ed - user_data.country}}` | Texto | Será hasheado automaticamente pela tag |

### **3.2. Exemplo de Configuração (Stape)**

```
User Data List:
  ┌─────────────────┬──────────────────────────────┐
  │ Name            │ Value                        │
  ├─────────────────┼──────────────────────────────┤
  │ email_address   │ {{ed - user_data.email_address}} │
  │ phone_number    │ {{ed - user_data.phone_number}}  │
  │ first_name      │ {{ed - user_data.first_name}}    │
  │ last_name       │ {{ed - user_data.last_name}}     │
  │ external_id     │ {{ed - user_data.user_id}}       │
  │ city            │ {{ed - user_data.city}}           │
  │ region          │ {{ed - user_data.region}}        │
  │ postal_code     │ {{ed - user_data.postal_code}}   │
  │ country         │ {{ed - user_data.country}}        │
  └─────────────────┴──────────────────────────────┘
```

---

## 🔑 **Passo 4: Mapear Server Event Data (Opcional)**

### **4.1. Configuração de Server Event Data**

Na tag "FB - Purchase", encontre a seção **Server Event Data** (ou `serverEventDataList`).

**Adicionar:**

| Campo | Variável | Tipo |
|-------|----------|------|
| `event_id` | `{{ed - event_id}}` | Texto |

### **4.2. Exemplo de Configuração (Stape)**

```
Server Event Data List:
  ┌─────────────────┬──────────────────────────────┐
  │ Name            │ Value                        │
  ├─────────────────┼──────────────────────────────┤
  │ event_id        │ {{ed - event_id}}            │
  └─────────────────┴──────────────────────────────┘
```

---

## ✅ **Checklist de Mapeamento**

### **Custom Data (7 campos)**
- [ ] `currency` → `{{ed - ecommerce.currency}}`
- [ ] `value` → `{{ed - ecommerce.value}}`
- [ ] `content_ids` → `{{ed - content_ids}}`
- [ ] `content_name` → `{{ed - content_name}}`
- [ ] `content_type` → `{{ed - content_type}}`
- [ ] `num_items` → `{{ed - num_items}}` (ou valor fixo: `1`)
- [ ] `order_id` → `{{ed - ecommerce.transaction_id}}`

### **User Data (9 campos)**
- [ ] `email_address` → `{{ed - user_data.email_address}}`
- [ ] `phone_number` → `{{ed - user_data.phone_number}}`
- [ ] `first_name` → `{{ed - user_data.first_name}}`
- [ ] `last_name` → `{{ed - user_data.last_name}}`
- [ ] `external_id` → `{{ed - user_data.user_id}}`
- [ ] `city` → `{{ed - user_data.city}}`
- [ ] `region` → `{{ed - user_data.region}}`
- [ ] `postal_code` → `{{ed - user_data.postal_code}}`
- [ ] `country` → `{{ed - user_data.country}}`

### **Server Event Data (1 campo)**
- [ ] `event_id` → `{{ed - event_id}}`

---

## 🚨 **Problemas Comuns**

### **Problema 1: Campo retorna `undefined` na tag**

**Causa**: Variável não criada ou path incorreto

**Solução**:
1. Verificar se variável existe em **Variáveis**
2. Testar variável no Preview Mode
3. Verificar se path está correto

### **Problema 2: Meta retorna erro 400 "Moeda ausente"**

**Causa**: Campo `currency` não está sendo enviado corretamente

**Solução**:
1. Verificar se `{{ed - ecommerce.currency}}` está mapeado
2. Verificar se variável retorna `"BRL"` no Preview Mode
3. Verificar se o campo está no `customDataList` (não em `userDataList`)

### **Problema 3: User Data não está sendo hasheado**

**Causa**: Tag não está configurada para hashear automaticamente

**Solução**:
1. Verificar configuração da tag: **Use App Secret Proof** deve estar desabilitado
2. Verificar se tag está usando modo correto (Stape Facebook Conversion API tag já hashea automaticamente)

---

## 🔍 **Validação no Preview Mode**

### **Passo 1: Enviar Evento de Teste**

1. Enviar evento via ReqBin (webhook)
2. Abrir Preview Mode do GTM Server-Side

### **Passo 2: Verificar Tag "FB - Purchase"**

1. No Preview Mode, clique no evento **Data**
2. Clique na tag **FB - Purchase**
3. Verificar seção **Variáveis**:
   - Todas as variáveis devem mostrar valores (não `undefined`)
   - `{{ed - ecommerce.currency}}` = `"BRL"`
   - `{{ed - ecommerce.value}}` = `39.9`
   - `{{ed - user_data.email_address}}` = `"Example@Example.com"`

### **Passo 3: Verificar Payload Enviado ao Meta**

1. Na tag **FB - Purchase**, role até **Solicitações HTTP enviadas do servidor**
2. Clique na requisição para `graph.facebook.com`
3. Verificar **Corpo da solicitação**:
   ```json
   {
     "data": [{
       "event_name": "Purchase",
       "custom_data": {
         "currency": "BRL",  ✅
         "value": 39.9,      ✅
         "content_ids": ["hacr962"],  ✅
         "content_name": "Sistema 4 Fases - Ebook Trips",  ✅
         "content_type": "product",  ✅
         "num_items": 1  ✅
       },
       "user_data": {
         "em": "hash_do_email",  ✅
         "ph": "hash_do_telefone",  ✅
         "fn": "hash_do_first_name",  ✅
         "external_id": "sess_xxx"  ✅
       }
     }]
   }
   ```

---

## 🎯 **Resultado Esperado**

Após mapear todas as variáveis:

1. ✅ Tag "FB - Purchase" dispara corretamente
2. ✅ Payload enviado ao Meta contém todos os campos
3. ✅ Meta retorna **200 OK** (não mais 400)
4. ✅ Evento aparece no Meta Events Manager
5. ✅ Event Match Quality (EQM) melhorado
6. ✅ Data Quality Score (DQS) alto

---

## 📝 **Notas Importantes**

### **Hashing Automático**

A tag Stape Facebook Conversion API **hashea automaticamente** os seguintes campos:
- `email_address` → `em`
- `phone_number` → `ph`
- `first_name` → `fn`
- `last_name` → `ln`
- `city` → `ct`
- `region` → `st`
- `postal_code` → `zp`
- `country` → `country`

**NÃO hashea**:
- `external_id` (enviado como está)
- `fbp` (enviado como está)
- `fbc` (enviado como está)

### **Campos Opcionais vs Obrigatórios**

**Obrigatórios (erro 400 sem eles)**:
- `currency` (custom_data)
- `value` (custom_data)

**Altamente Recomendados (melhora EQM)**:
- `content_ids` (custom_data)
- `content_name` (custom_data)
- `content_type` (custom_data)
- `email_address` (user_data)
- `phone_number` (user_data)
- `external_id` (user_data)

**Opcionais (melhora DQS)**:
- `first_name` (user_data)
- `last_name` (user_data)
- `city` (user_data)
- `region` (user_data)
- `postal_code` (user_data)
- `country` (user_data)

---

**Última atualização**: 2025-01-05
**Versão**: 1.0


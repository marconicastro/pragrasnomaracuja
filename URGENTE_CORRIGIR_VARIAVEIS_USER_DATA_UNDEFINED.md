# 🚨 URGENTE: Corrigir Variáveis User Data - Todas Undefined

## ❌ **PROBLEMA IDENTIFICADO**

Todas as variáveis de `user_data` estão retornando `undefined`:
- `{{ed - user_data.email_address}}` → `undefined` ❌
- `{{ed - user_data.phone_number}}` → `undefined` ❌
- `{{ed - user_data.first_name}}` → `undefined` ❌
- etc.

**Causa:** As variáveis estão usando paths sem o prefixo `0.`!

---

## ✅ **SOLUÇÃO: Criar/Corrigir Variáveis User Data com Prefixo `0.`**

### **Passo 1: Criar Variáveis Event Data (9 variáveis user_data)**

#### **1. {{ed - user_data.email_address}}**

```
Nome da variável: ed - user_data.email_address
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.email_address
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** Path é `0.user_data.email_address` (COM `0.` no início!)

#### **2. {{ed - user_data.phone_number}}**

```
Nome da variável: ed - user_data.phone_number
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.phone_number
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

#### **3. {{ed - user_data.first_name}}**

```
Nome da variável: ed - user_data.first_name
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.first_name
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

#### **4. {{ed - user_data.last_name}}**

```
Nome da variável: ed - user_data.last_name
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.last_name
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

#### **5. {{ed - user_data.user_id}}**

```
Nome da variável: ed - user_data.user_id
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.user_id
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

#### **6. {{ed - user_data.city}}**

```
Nome da variável: ed - user_data.city
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.city
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

#### **7. {{ed - user_data.region}}**

```
Nome da variável: ed - user_data.region
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.region
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

#### **8. {{ed - user_data.postal_code}}**

```
Nome da variável: ed - user_data.postal_code
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.postal_code
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

#### **9. {{ed - user_data.country}}**

```
Nome da variável: ed - user_data.country
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.country
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

---

### **Passo 2: Mapear na Tag "FB - Purchase"**

Na tag "FB - Purchase", vá em **User Data** e mapeie:

| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `email_address` | `{{ed - user_data.email_address}}` | `0.user_data.email_address` |
| `phone_number` | `{{ed - user_data.phone_number}}` | `0.user_data.phone_number` |
| `first_name` | `{{ed - user_data.first_name}}` | `0.user_data.first_name` |
| `last_name` | `{{ed - user_data.last_name}}` | `0.user_data.last_name` |
| `external_id` | `{{ed - user_data.user_id}}` | `0.user_data.user_id` |
| `city` | `{{ed - user_data.city}}` | `0.user_data.city` |
| `region` | `{{ed - user_data.region}}` | `0.user_data.region` |
| `postal_code` | `{{ed - user_data.postal_code}}` | `0.user_data.postal_code` |
| `country` | `{{ed - user_data.country}}` | `0.user_data.country` |

---

## 🔍 **Verificação no Preview Mode**

Após criar as variáveis, teste no Preview Mode:

1. Enviar evento de teste via ReqBin
2. No Preview Mode, clicar na tag **FB - Purchase**
3. Verificar seção **Variáveis**:
   - `{{ed - user_data.email_address}}` deve mostrar `"joao.silva@email.com"` ✅
   - `{{ed - user_data.phone_number}}` deve mostrar `"11999999999"` ✅
   - `{{ed - user_data.first_name}}` deve mostrar `"João"` ✅
   - **NÃO** deve mostrar `undefined` ❌

4. Verificar seção **Solicitações HTTP enviadas do servidor**:
   - Clicar na requisição para `graph.facebook.com`
   - Verificar **Corpo da solicitação**:
   ```json
   {
     "data": [{
       "event_name": "Purchase",
       "user_data": {
         "em": "hash_do_email",  ✅ DEVE APARECER!
         "ph": "hash_do_telefone",  ✅ DEVE APARECER!
         "fn": "hash_do_first_name",  ✅ DEVE APARECER!
         "external_id": "sess_xxx"  ✅ DEVE APARECER!
       }
     }]
   }
   ```

---

## ✅ **Checklist Urgente**

### **Variáveis User Data (9 variáveis):**

- [ ] Criar variável `{{ed - user_data.email_address}}` → Path: `0.user_data.email_address`
- [ ] Criar variável `{{ed - user_data.phone_number}}` → Path: `0.user_data.phone_number`
- [ ] Criar variável `{{ed - user_data.first_name}}` → Path: `0.user_data.first_name`
- [ ] Criar variável `{{ed - user_data.last_name}}` → Path: `0.user_data.last_name`
- [ ] Criar variável `{{ed - user_data.user_id}}` → Path: `0.user_data.user_id`
- [ ] Criar variável `{{ed - user_data.city}}` → Path: `0.user_data.city`
- [ ] Criar variável `{{ed - user_data.region}}` → Path: `0.user_data.region`
- [ ] Criar variável `{{ed - user_data.postal_code}}` → Path: `0.user_data.postal_code`
- [ ] Criar variável `{{ed - user_data.country}}` → Path: `0.user_data.country`

### **Mapeamento na Tag:**

- [ ] Mapear todas na tag "FB - Purchase" → User Data
- [ ] Testar no Preview Mode
- [ ] Verificar se variáveis retornam valores (não mais `undefined`)
- [ ] Verificar se `user_data` não está mais vazio no payload

---

## 🚨 **IMPORTANTE**

**Todos os paths de user_data também devem começar com `0.`!**

- ❌ **Path errado:** `user_data.email_address` (sem `0.`)
- ✅ **Path correto:** `0.user_data.email_address` (com `0.`)

**Mesmo padrão que funcionou para custom_data!**

---

## 🎯 **Resultado Esperado**

Após corrigir:

No Preview Mode, variáveis devem mostrar:
- `{{ed - user_data.email_address}}` = `"joao.silva@email.com"` ✅
- `{{ed - user_data.phone_number}}` = `"11999999999"` ✅
- `{{ed - user_data.first_name}}` = `"João"` ✅
- **NÃO** mais `undefined` ❌

No payload enviado ao Meta:
```json
"user_data": {
  "em": "hash_do_email",  ✅
  "ph": "hash_do_telefone",  ✅
  "fn": "hash_do_first_name",  ✅
  "external_id": "sess_xxx"  ✅
}
```

---

**Última atualização**: 2025-01-05
**Versão**: 1.0 - URGENTE


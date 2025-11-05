# 🚨 URGENTE: Corrigir Variáveis Event Data - custom_data Vazio

## ❌ **PROBLEMA IDENTIFICADO**

O Meta está retornando erro 400: **"Moeda ausente para o evento de compra"**

**Causa:** `custom_data` está chegando vazio no Meta:
```json
"custom_data":{}  // ❌ VAZIO!
```

**Isso significa que as variáveis Event Data não estão sendo capturadas corretamente!**

---

## ✅ **SOLUÇÃO: Criar/Corrigir Variáveis com Prefixo `0.`**

### **Passo 1: Criar Variáveis Event Data (5 variáveis críticas)**

#### **1. {{ed - ecommerce.currency}}**

```
Nome da variável: ed - ecommerce.currency
Tipo de variável: Event Data
Nome do campo de evento: 0.ecommerce.currency
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** Path é `0.ecommerce.currency` (COM `0.` no início!)

#### **2. {{ed - ecommerce.value}}**

```
Nome da variável: ed - ecommerce.value
Tipo de variável: Event Data
Nome do campo de evento: 0.ecommerce.value
Tipo de valor: Número
Valor padrão: (deixar vazio)
```

#### **3. {{ed - content_ids}}**

```
Nome da variável: ed - content_ids
Tipo de variável: Event Data
Nome do campo de evento: 0.content_ids
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

#### **4. {{ed - content_name}}**

```
Nome da variável: ed - content_name
Tipo de variável: Event Data
Nome do campo de evento: 0.content_name
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

#### **5. {{ed - content_type}}**

```
Nome da variável: ed - content_type
Tipo de variável: Event Data
Nome do campo de evento: 0.content_type
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

---

### **Passo 2: Mapear na Tag "FB - Purchase"**

Na tag "FB - Purchase", vá em **Custom Data** e mapeie:

| Campo Meta | Variável GTM |
|------------|--------------|
| `currency` | `{{ed - ecommerce.currency}}` |
| `value` | `{{ed - ecommerce.value}}` |
| `content_ids` | `{{ed - content_ids}}` |
| `content_name` | `{{ed - content_name}}` |
| `content_type` | `{{ed - content_type}}` |
| `num_items` | `1` (valor fixo) ou `{{ed - num_items}}` |
| `order_id` | `{{ed - ecommerce.transaction_id}}` |

---

## 🔍 **Verificação no Preview Mode**

Após criar as variáveis, teste no Preview Mode:

1. Enviar evento de teste via ReqBin
2. No Preview Mode, clicar na tag **FB - Purchase**
3. Verificar seção **Variáveis**:
   - `{{ed - ecommerce.currency}}` deve mostrar `"BRL"` ✅
   - `{{ed - ecommerce.value}}` deve mostrar `39.9` ✅
   - `{{ed - content_ids}}` deve mostrar `["hacr962"]` ✅

4. Verificar seção **Solicitações HTTP enviadas do servidor**:
   - Clicar na requisição para `graph.facebook.com`
   - Verificar **Corpo da solicitação**:
   ```json
   {
     "data": [{
       "event_name": "Purchase",
       "custom_data": {
         "currency": "BRL",  ✅ DEVE APARECER!
         "value": 39.9,      ✅ DEVE APARECER!
         "content_ids": ["hacr962"],  ✅ DEVE APARECER!
         "content_name": "Sistema 4 Fases - Ebook Trips",  ✅ DEVE APARECER!
         "content_type": "product"  ✅ DEVE APARECER!
       }
     }]
   }
   ```

---

## ✅ **Checklist Urgente**

- [ ] Criar variável `{{ed - ecommerce.currency}}` → Path: `0.ecommerce.currency`
- [ ] Criar variável `{{ed - ecommerce.value}}` → Path: `0.ecommerce.value`
- [ ] Criar variável `{{ed - content_ids}}` → Path: `0.content_ids`
- [ ] Criar variável `{{ed - content_name}}` → Path: `0.content_name`
- [ ] Criar variável `{{ed - content_type}}` → Path: `0.content_type`
- [ ] Mapear todas na tag "FB - Purchase" → Custom Data
- [ ] Testar no Preview Mode
- [ ] Verificar se `custom_data` não está mais vazio
- [ ] Verificar se Meta retorna 200 OK (não mais 400)

---

## 🚨 **IMPORTANTE**

**Todos os paths devem começar com `0.` porque os dados estão em `0: {...}`!**

- ❌ **Path errado:** `ecommerce.currency` (sem `0.`)
- ✅ **Path correto:** `0.ecommerce.currency` (com `0.`)

---

## 🎯 **Resultado Esperado**

Após corrigir:

```json
"custom_data": {
  "currency": "BRL",  ✅
  "value": 39.9,      ✅
  "content_ids": ["hacr962"],  ✅
  "content_name": "Sistema 4 Fases - Ebook Trips",  ✅
  "content_type": "product"  ✅
}
```

Meta deve retornar **200 OK** ao invés de **400**.

---

**Última atualização**: 2025-01-05
**Versão**: 1.0 - URGENTE



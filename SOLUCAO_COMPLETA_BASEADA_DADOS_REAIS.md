# ✅ SOLUÇÃO COMPLETA: Baseada nos Dados Reais do GTM Server-Side

## 🔍 **ANÁLISE DOS DADOS REAIS**

Baseado nos dados do evento que você enviou, identifiquei:

### **✅ Campos que CHEGAM no GTM Server-Side:**
- `currency`: "BRL" ✅
- `value`: 39.9 ✅
- `content_ids`: ["hacr962"] ✅
- `contents`: [{id: "hacr962", quantity: 1, item_price: 39.9}] ✅
- `num_items`: 1 ✅
- `email_address`: "ana.silva@email.com" ✅
- `phone_number`: "11999999888" ✅
- `first_name`: "Ana" ✅
- `last_name`: "Silva" ✅
- `city`: "caculé" ✅
- `region`: "ba" ✅
- `country`: "BR" ✅
- `postal_code`: "46300" ✅
- `user_id`: "sess_1762031294521_e5kv5ly8b" ✅

### **❌ Campos que NÃO CHEGAM:**
- `content_name`: ❌ Não aparece nos dados
- `content_type`: ❌ Não aparece nos dados
- `ecommerce.value`: ❌ Não aparece (só `value` no nível raiz)
- `ecommerce.currency`: ❌ Não aparece (só `currency` no nível raiz)

### **⚠️ Estrutura Transformada:**
- `user_data.address.*`: Stape.io transforma `user_data.city` → `user_data.address.city`

---

## ✅ **SOLUÇÃO DEFINITIVA**

### **1. Criar Variáveis Faltantes no GTM Server-Side:**

#### **Variáveis do Nível Raiz (FUNCIONAM):**
| Variável | Path | Status |
|----------|------|--------|
| `ed - currency` | `currency` | ❌ **CRIAR** |
| `ed - value` | `value` | ❌ **CRIAR** |
| `ed - content_name` | `content_name` | ✅ Existe, mas campo não chega |
| `ed - content_type` | `content_type` | ✅ Existe, mas campo não chega |

#### **Variáveis para user_data.address.* (NECESSÁRIAS):**
| Variável | Path | Status |
|----------|------|--------|
| `ed - user_data.address.city` | `user_data.address.city` | ❌ **CRIAR** |
| `ed - user_data.address.region` | `user_data.address.region` | ❌ **CRIAR** |
| `ed - user_data.address.country` | `user_data.address.country` | ❌ **CRIAR** |
| `ed - user_data.address.postal_code` | `user_data.address.postal_code` | ❌ **CRIAR** |
| `ed - user_data.address.first_name` | `user_data.address.first_name` | ❌ **CRIAR** |
| `ed - user_data.address.last_name` | `user_data.address.last_name` | ❌ **CRIAR** |

---

## 🎯 **AÇÃO IMEDIATA NO GTM SERVER-SIDE**

### **PASSO 1: Criar Variáveis do Nível Raiz**

1. **Criar `ed - currency`:**
   - Tipo: Event Data Variable
   - Nome do campo de evento: `currency`
   - Tipo de valor: Texto

2. **Criar `ed - value`:**
   - Tipo: Event Data Variable
   - Nome do campo de evento: `value`
   - Tipo de valor: Número

### **PASSO 2: Criar Variáveis para user_data.address.***

Criar 6 variáveis Event Data:
- `ed - user_data.address.city` → Path: `user_data.address.city`
- `ed - user_data.address.region` → Path: `user_data.address.region`
- `ed - user_data.address.country` → Path: `user_data.address.country`
- `ed - user_data.address.postal_code` → Path: `user_data.address.postal_code`
- `ed - user_data.address.first_name` → Path: `user_data.address.first_name`
- `ed - user_data.address.last_name` → Path: `user_data.address.last_name`

### **PASSO 3: Atualizar Tags**

**FB - ViewContent, FB - AddToCart, FB - InitiateCheckout, FB - Lead:**

**Custom Data:**
- `currency`: `{{ed - currency}}` ✅
- `value`: `{{ed - value}}` ✅

**User Data:**
- `City`: `{{ed - user_data.address.city}}` ✅
- `State`: `{{ed - user_data.address.region}}` ✅
- `Country`: `{{ed - user_data.address.country}}` ✅
- `Zip`: `{{ed - user_data.address.postal_code}}` ✅
- `First Name`: `{{ed - user_data.address.first_name}}` ✅
- `Last Name`: `{{ed - user_data.address.last_name}}` ✅

---

## ⚠️ **PROBLEMA: content_name e content_type**

Os dados mostram que `content_name` e `content_type` **NÃO ESTÃO CHEGANDO** no GTM Server-Side, mesmo o código enviando.

**Possíveis causas:**
1. Stape.io está filtrando esses campos
2. GTM Server-Side está removendo campos não reconhecidos
3. Há algum problema na transmissão do DataLayer

**Solução temporária:**
- Usar valores fixos nas tags do Facebook (não ideal, mas funciona)
- Ou verificar se há alguma configuração no Stape.io que está filtrando

**Solução definitiva:**
- Investigar por que Stape.io não está passando esses campos
- Pode ser necessário enviar de forma diferente ou configurar no Stape.io

---

## ✅ **RESUMO**

**Variáveis a criar:**
1. ✅ `ed - currency` (nível raiz)
2. ✅ `ed - value` (nível raiz)
3. ✅ `ed - user_data.address.city`
4. ✅ `ed - user_data.address.region`
5. ✅ `ed - user_data.address.country`
6. ✅ `ed - user_data.address.postal_code`
7. ✅ `ed - user_data.address.first_name`
8. ✅ `ed - user_data.address.last_name`

**Tags a atualizar:**
- FB - ViewContent
- FB - AddToCart
- FB - InitiateCheckout
- FB - Lead

**Problema pendente:**
- `content_name` e `content_type` não estão chegando (investigar Stape.io)

---

**Status:** ⚠️ **AÇÃO IMEDIATA NO GTM SERVER-SIDE**


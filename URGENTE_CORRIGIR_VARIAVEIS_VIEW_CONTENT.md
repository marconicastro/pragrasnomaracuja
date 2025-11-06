# 🚨 URGENTE: Corrigir Variáveis Event Data para ViewContent

## ❌ **PROBLEMA IDENTIFICADO**

**Evento:** `view_content`  
**Sintoma:** Variáveis Event Data retornando `undefined` no GTM Server-Side

---

## 🔍 **ANÁLISE DO PROBLEMA**

### **Situação Atual:**

No Preview Mode do GTM Server-Side, o evento `view_content` mostra:
- ✅ Algumas variáveis funcionam: `event_id`, `num_items`, `value`
- ❌ Muitas variáveis retornam `undefined`: `email_address`, `first_name`, `content_ids`, etc.

### **Possíveis Causas:**

1. **Paths incorretos nas variáveis Event Data**
   - Variáveis podem estar configuradas sem o prefixo `0.`
   - Ou podem estar usando paths incorretos

2. **Formato do evento no GTM Server-Side**
   - Eventos do browser podem também estar sendo processados como array
   - GTM Server-Side pode colocar dados em `0: {...}` mesmo para eventos do browser

3. **Campos não estão sendo enviados corretamente**
   - Campos podem não estar no nível raiz como esperado
   - Estrutura do evento pode estar diferente

---

## ✅ **SOLUÇÃO: VERIFICAR ESTRUTURA DO EVENTO**

### **Passo 1: Verificar Estrutura no Preview Mode**

No GTM Server-Side Preview Mode, ao clicar no evento `view_content`:

1. **Aba "Dados do evento"** → Verificar estrutura exata:
   ```
   Se aparecer:
   0: { event: "view_content", ... }
   → Precisa usar paths com `0.`
   
   Se aparecer:
   event: "view_content", ...
   → Usar paths sem `0.`
   ```

2. **Verificar campos disponíveis:**
   - `email_address` está no nível raiz?
   - `user_data.email_address` existe?
   - `content_ids` está no nível raiz?
   - `ecommerce.value` existe?

---

## 🔧 **SOLUÇÃO 1: Se Evento Está em `0: {...}` (Como Purchase)**

### **Variáveis Event Data - COM prefixo `0.`**

| Variável | Path CORRETO | Tipo |
|----------|--------------|------|
| `{{ed - email_address}}` | `0.email_address` | Texto |
| `{{ed - phone_number}}` | `0.phone_number` | Texto |
| `{{ed - first_name}}` | `0.first_name` | Texto |
| `{{ed - last_name}}` | `0.last_name` | Texto |
| `{{ed - city}}` | `0.city` | Texto |
| `{{ed - region}}` | `0.region` | Texto |
| `{{ed - postal_code}}` | `0.postal_code` | Texto |
| `{{ed - country}}` | `0.country` | Texto |
| `{{ed - value}}` | `0.value` | Número |
| `{{ed - currency}}` | `0.currency` | Texto |
| `{{ed - content_ids}}` | `0.content_ids` | Array |
| `{{ed - content_name}}` | `0.content_name` | Texto |
| `{{ed - content_type}}` | `0.content_type` | Texto |
| `{{ed - num_items}}` | `0.num_items` | Número |
| `{{ed - contents}}` | `0.contents` | Array |
| `{{ed - event_id}}` | `0.event_id` | Texto |
| `{{ed - user_data.email_address}}` | `0.user_data.email_address` | Texto |
| `{{ed - user_data.phone_number}}` | `0.user_data.phone_number` | Texto |
| `{{ed - user_data.first_name}}` | `0.user_data.first_name` | Texto |
| `{{ed - user_data.last_name}}` | `0.user_data.last_name` | Texto |
| `{{ed - ecommerce.value}}` | `0.ecommerce.value` | Número |
| `{{ed - ecommerce.currency}}` | `0.ecommerce.currency` | Texto |

---

## 🔧 **SOLUÇÃO 2: Se Evento Está no Nível Raiz (Sem `0.`)**

### **Variáveis Event Data - SEM prefixo `0.`**

| Variável | Path CORRETO | Tipo |
|----------|--------------|------|
| `{{ed - email_address}}` | `email_address` | Texto |
| `{{ed - phone_number}}` | `phone_number` | Texto |
| `{{ed - first_name}}` | `first_name` | Texto |
| `{{ed - last_name}}` | `last_name` | Texto |
| `{{ed - city}}` | `city` | Texto |
| `{{ed - region}}` | `region` | Texto |
| `{{ed - postal_code}}` | `postal_code` | Texto |
| `{{ed - country}}` | `country` | Texto |
| `{{ed - value}}` | `value` | Número |
| `{{ed - currency}}` | `currency` | Texto |
| `{{ed - content_ids}}` | `content_ids` | Array |
| `{{ed - content_name}}` | `content_name` | Texto |
| `{{ed - content_type}}` | `content_type` | Texto |
| `{{ed - num_items}}` | `num_items` | Número |
| `{{ed - contents}}` | `contents` | Array |
| `{{ed - event_id}}` | `event_id` | Texto |
| `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto |
| `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto |
| `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto |
| `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto |
| `{{ed - ecommerce.value}}` | `ecommerce.value` | Número |
| `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto |

---

## 📋 **COMO VERIFICAR QUAL SOLUÇÃO USAR**

### **No GTM Server-Side Preview Mode:**

1. **Clique no evento `view_content`**
2. **Vá na aba "Dados do evento"**
3. **Procure pela estrutura:**

**Se aparecer assim:**
```
Nome          Valor
0             { event: "view_content", email_address: "...", ... }
```
→ **Use SOLUÇÃO 1 (COM `0.`)**

**Se aparecer assim:**
```
Nome          Valor
event         "view_content"
email_address "joao.silva@email.com"
value         39.9
...
```
→ **Use SOLUÇÃO 2 (SEM `0.`)**

---

## 🎯 **MAPEAMENTO NA TAG "FB - ViewContent"**

### **Se usar SOLUÇÃO 1 (COM `0.`):**

**Custom Data:**
- `currency` → `{{ed - currency}}` (path: `0.currency`)
- `value` → `{{ed - value}}` (path: `0.value`)
- `content_ids` → `{{ed - content_ids}}` (path: `0.content_ids`)
- `content_name` → `{{ed - content_name}}` (path: `0.content_name`)
- `content_type` → `{{ed - content_type}}` (path: `0.content_type`)
- `num_items` → `{{ed - num_items}}` (path: `0.num_items`)

**User Data:**
- `email_address` → `{{ed - email_address}}` (path: `0.email_address`) OU `{{ed - user_data.email_address}}` (path: `0.user_data.email_address`)
- `phone_number` → `{{ed - phone_number}}` (path: `0.phone_number`) OU `{{ed - user_data.phone_number}}` (path: `0.user_data.phone_number`)
- `first_name` → `{{ed - first_name}}` (path: `0.first_name`) OU `{{ed - user_data.first_name}}` (path: `0.user_data.first_name`)
- `last_name` → `{{ed - last_name}}` (path: `0.last_name`) OU `{{ed - user_data.last_name}}` (path: `0.user_data.last_name`)
- `city` → `{{ed - city}}` (path: `0.city`)
- `region` → `{{ed - region}}` (path: `0.region`)
- `postal_code` → `{{ed - postal_code}}` (path: `0.postal_code`)
- `country` → `{{ed - country}}` (path: `0.country`)

**Event ID:**
- `event_id` → `{{ed - event_id}}` (path: `0.event_id`)

---

### **Se usar SOLUÇÃO 2 (SEM `0.`):**

**Custom Data:**
- `currency` → `{{ed - currency}}` (path: `currency`) OU `{{ed - ecommerce.currency}}` (path: `ecommerce.currency`)
- `value` → `{{ed - value}}` (path: `value`) OU `{{ed - ecommerce.value}}` (path: `ecommerce.value`)
- `content_ids` → `{{ed - content_ids}}` (path: `content_ids`)
- `content_name` → `{{ed - content_name}}` (path: `content_name`)
- `content_type` → `{{ed - content_type}}` (path: `content_type`)
- `num_items` → `{{ed - num_items}}` (path: `num_items`)

**User Data:**
- `email_address` → `{{ed - email_address}}` (path: `email_address`) OU `{{ed - user_data.email_address}}` (path: `user_data.email_address`)
- `phone_number` → `{{ed - phone_number}}` (path: `phone_number`) OU `{{ed - user_data.phone_number}}` (path: `user_data.phone_number`)
- `first_name` → `{{ed - first_name}}` (path: `first_name`) OU `{{ed - user_data.first_name}}` (path: `user_data.first_name`)
- `last_name` → `{{ed - last_name}}` (path: `last_name`) OU `{{ed - user_data.last_name}}` (path: `user_data.last_name`)
- `city` → `{{ed - city}}` (path: `city`)
- `region` → `{{ed - region}}` (path: `region`)
- `postal_code` → `{{ed - postal_code}}` (path: `postal_code`)
- `country` → `{{ed - country}}` (path: `country`)

**Event ID:**
- `event_id` → `{{ed - event_id}}` (path: `event_id`)

---

## ✅ **CHECKLIST DE CORREÇÃO**

### **1. Verificar Estrutura do Evento:**
- [ ] Abrir GTM Server-Side Preview Mode
- [ ] Clicar no evento `view_content`
- [ ] Verificar estrutura na aba "Dados do evento"
- [ ] Determinar se precisa de `0.` ou não

### **2. Criar/Corrigir Variáveis Event Data:**
- [ ] Criar variáveis com paths corretos (COM ou SEM `0.`)
- [ ] Testar cada variável no Preview Mode
- [ ] Verificar se retornam valores (não mais `undefined`)

### **3. Atualizar Tag "FB - ViewContent":**
- [ ] Mapear variáveis corretas na tag
- [ ] Testar no Preview Mode
- [ ] Verificar se tag dispara corretamente
- [ ] Verificar se Meta recebe dados completos

---

## 🚨 **IMPORTANTE**

**O padrão pode ser diferente para cada tipo de evento:**

- ✅ **Purchase (via Webhook)** → **SEMPRE** usa `0.` (confirmado)
- ❓ **ViewContent (via Browser)** → **VERIFICAR** se usa `0.` ou não
- ❓ **Outros eventos (via Browser)** → **VERIFICAR** se usam `0.` ou não

**A única forma de ter certeza é verificando no Preview Mode do GTM Server-Side!**

---

**Última atualização**: 2025-01-05  
**Versão**: 1.0  
**Status**: ⚠️ AGUARDANDO VERIFICAÇÃO DA ESTRUTURA DO EVENTO


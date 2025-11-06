# 🚨 URGENTE: Diagnóstico Variáveis Undefined

## ❌ **PROBLEMA IDENTIFICADO**

Muitas variáveis Event Data estão retornando `undefined` no GTM Server-Side:

### **begin_checkout:**
- ✅ `content_ids`: ["hacr962"]
- ✅ `contents`: [{id: "hacr962", quantity: 1, item_price: 39.9}]
- ✅ `num_items`: 1
- ✅ `email_address`: "ana.silva@email.com"
- ✅ `phone_number`: "11999999888"
- ✅ `event_id`: "1762265997000_17624349661739"
- ❌ `content_name`: undefined
- ❌ `content_type`: undefined
- ❌ `currency`: undefined
- ❌ `value`: undefined
- ❌ `ecommerce.value`: undefined
- ❌ `ecommerce.currency`: undefined
- ❌ `user_data.*`: undefined (todos)

### **view_item:**
- ✅ `content_ids`: ["hacr962"]
- ✅ `contents`: [{id: "hacr962", quantity: 1, item_price: 39.9}]
- ✅ `email_address`: "ana.silva@email.com"
- ✅ `phone_number`: "11999999888"
- ❌ `content_name`: undefined
- ❌ `content_type`: undefined
- ❌ `currency`: undefined
- ❌ `value`: undefined

### **add_to_cart:**
- Similar ao view_item

### **generate_lead:**
- ✅ `num_items`: 1
- ❌ `contents`: "[object Object]" (errado!)
- ❌ Quase tudo undefined

### **page_view:**
- ❌ Quase tudo undefined

---

## 🔍 **INFORMAÇÕES NECESSÁRIAS**

Preciso que você me envie:

### **1. Estrutura Real do Payload no GTM Server-Side**

No GTM Preview Mode, quando disparar um evento (ex: begin_checkout):

1. Ir em **"Dados do evento"** (não em "Variáveis")
2. **Copiar TODA a estrutura JSON** que aparece
3. Me enviar

Isso vai mostrar exatamente como os dados estão chegando no GTM Server-Side.

### **2. Configuração das Variáveis Event Data**

No GTM Server-Side → Variáveis:

1. Abrir variável `ed - content_name`
2. Me dizer qual é o **"Nome do campo de evento"** (path)
3. Repetir para:
   - `ed - content_type`
   - `ed - currency`
   - `ed - value`
   - `ed - ecommerce.currency`
   - `ed - ecommerce.value`
   - `ed - user_data.email_address`

### **3. Estrutura do DataLayer no Browser**

No Console do navegador (F12), quando disparar um evento:

1. Digitar: `window.dataLayer`
2. Procurar o último evento (ex: begin_checkout)
3. **Copiar a estrutura completa** e me enviar

---

## 🎯 **HIPÓTESE**

O problema pode ser:

1. **Código não está enviando os campos** → Mas vemos que alguns campos chegam (content_ids, contents)
2. **Variáveis estão com paths errados** → Provável causa
3. **Estrutura do payload está diferente do esperado** → Preciso ver a estrutura real

---

## ✅ **AÇÃO IMEDIATA**

**Envie essas 3 informações e eu resolvo AGORA:**

1. ✅ Estrutura completa do "Dados do evento" no GTM Preview Mode
2. ✅ Paths das variáveis Event Data no GTM
3. ✅ Estrutura do `window.dataLayer` no Console do navegador

Com essas informações, vou identificar exatamente onde está o problema e corrigir!


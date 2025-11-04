# 🔍 ANÁLISE CORRETA: Payload enviado ao Facebook

**Problema identificado:** Faltando campos importantes no payload!

---

## ❌ O QUE ESTÁ FALTANDO

Comparando o payload enviado com os requisitos do Meta Conversions API:

### **1. ❌ EXTERNAL_ID está FALTANDO!**

**No payload enviado:**
```json
"user_data": {
  "em": "...",  // email
  "ph": "...",  // phone
  "fn": "...",  // first_name
  "ln": "...",  // last_name
  "ct": "...",  // city
  "st": "...",  // state
  "zp": "...",  // zip
  "country": "...",
  // ❌ FALTA: "external_id"
}
```

**Deveria ter:**
```json
"user_data": {
  // ... campos existentes
  "external_id": "sess_1761312196590_bookidhkx"  // ❌ FALTANDO!
}
```

**Impacto:** 
- ❌ Perda de +0.22% conversões (Meta recomenda external_id)
- ❌ EQM pode ser menor sem external_id

---

### **2. ❌ CONTENT_NAME está FALTANDO no custom_data!**

**No payload enviado:**
```json
"custom_data": {
  "value": 39.9,
  "currency": "BRL",
  "content_ids": ["hacr962"],
  "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
  "num_items": 1
  // ❌ FALTA: "content_name"
}
```

**Deveria ter:**
```json
"custom_data": {
  // ... campos existentes
  "content_name": "Sistema 4 Fases - Ebook Trips",  // ❌ FALTANDO!
  "content_type": "product",  // ❌ FALTANDO!
  "content_category": "digital_product"  // Opcional, mas recomendado
}
```

**Impacto:**
- ❌ Menos contexto para o Meta Analytics
- ❌ Menos dados para segmentação

---

### **3. ❌ CAMPOS OPCIONAIS MAS RECOMENDADOS**

**Poderia ter (mas não obrigatório):**
- `order_id` (para InitiateCheckout, não é obrigatório)
- `content_category` (recomendado para ecommerce)

---

## ✅ O QUE ESTÁ CORRETO

- ✅ Event name: `InitiateCheckout`
- ✅ Action source: `website`
- ✅ Event time: Unix timestamp
- ✅ Event ID: Para deduplicação
- ✅ Advanced Matching: 8 campos (em, ph, fn, ln, ct, st, zp, country)
- ✅ FBP e FBC: Presentes
- ✅ Client IP e User Agent: Presentes
- ✅ URLs: Presentes

---

## 🎯 CORREÇÕES NECESSÁRIAS

### **1. Adicionar external_id ao user_data**

O `external_id` deve ser incluído no `prepareAdvancedMatching()` e enviado para o GTM Server-Side.

**Código atual:**
```typescript
if (userData?.external_id) matching.external_id = userData.external_id;
```

**Problema:** O external_id não está sendo passado corretamente ou não está sendo incluído no DataLayer.

---

### **2. Adicionar content_name e content_type ao custom_data**

Estes campos devem estar no `custom_data` do evento.

**Código atual:**
```typescript
return trackEliteEvent('InitiateCheckout', {
  value: finalValue,
  currency: 'BRL',
  content_ids: orderDetails?.items || ['hacr962'],
  content_type: 'product',  // ✅ Está sendo enviado
  content_name: 'Sistema 4 Fases - Ebook Trips',  // ✅ Está sendo enviado
  num_items: quantity,
  ...customParams
}, 'standard');
```

**Problema:** Estes campos podem não estar chegando no GTM Server-Side ou não estão sendo mapeados corretamente para o Meta.

---

## 🔧 PRÓXIMOS PASSOS

1. Verificar se `external_id` está sendo incluído no `prepareAdvancedMatching()`
2. Verificar se `content_name` e `content_type` estão sendo enviados no DataLayer
3. Verificar se o GTM Server-Side está mapeando corretamente estes campos para o Meta


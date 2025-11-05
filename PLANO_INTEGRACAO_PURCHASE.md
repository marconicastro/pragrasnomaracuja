# 🎯 PLANO: Integração Completa do Purchase

**Status:** ✅ **Análise e Plano de Integração**

---

## 📊 SITUAÇÃO ATUAL

### **O que já está funcionando:**
- ✅ Purchase disparado na página `/obrigado` via `trackPurchaseElite()`
- ✅ Purchase enviado para DataLayer via `pushPurchase()`
- ✅ Purchase enviado via webhook (backup server-side)
- ✅ `transaction_id` sendo enviado corretamente
- ✅ `user_data` sendo enviado corretamente

### **O que precisa ser ajustado:**
- ⚠️ Valor está fixo em `39.9` (não usa valor dinâmico da URL/parâmetros)
- ⚠️ Valor do `customParams` não está sendo usado no `pushPurchase()`

---

## 🔧 AJUSTES NECESSÁRIOS

### **1. Ajustar `trackPurchaseElite()` para usar valor dinâmico**

**Problema atual:**
```typescript
pushPurchase(orderId, 39.9, 'BRL', 1, userDataForGTM);  // ❌ Valor fixo
```

**Correção:**
```typescript
// Usar valor do customParams se fornecido
const purchaseValue = customParams.value || 39.9;
const purchaseCurrency = customParams.currency || 'BRL';
const purchaseQuantity = customParams.num_items || 1;

pushPurchase(orderId, purchaseValue, purchaseCurrency, purchaseQuantity, userDataForGTM);
```

---

### **2. Verificar se todos os campos estão sendo enviados**

**Campos necessários no DataLayer para Purchase:**
- ✅ `event: 'purchase'`
- ✅ `ecommerce.transaction_id`
- ✅ `ecommerce.value`
- ✅ `ecommerce.currency`
- ✅ `ecommerce.items`
- ✅ `content_ids`
- ✅ `contents`
- ✅ `content_name` (já adicionado)
- ✅ `content_type` (já adicionado)
- ✅ `num_items`
- ✅ `user_data` (com `user_id`)

---

## 📋 CHECKLIST DE INTEGRAÇÃO

### **1. Código (DataLayer):**
- [ ] Ajustar `trackPurchaseElite()` para usar valor dinâmico
- [ ] Verificar se `pushPurchase()` está recebendo todos os parâmetros
- [ ] Testar se `user_id` está sendo enviado corretamente

### **2. GTM Web Container:**
- [ ] Verificar se trigger `ce - purchase` está configurado
- [ ] Verificar se tag "FB - Purchase" está configurada
- [ ] Verificar se tag "DT - purchase" está configurada
- [ ] Verificar se tag "GA4 - purchase" está configurada

### **3. GTM Server-Side Container:**
- [ ] Verificar se tag "FB - Purchase" está configurada
- [ ] Verificar se `external_id` está mapeado (`{{ed - user_id}}` ou `{{dlv - user_data.user_id}}`)
- [ ] Verificar se `transaction_id` está mapeado (`{{dlv - ecommerce.transaction_id}}`)
- [ ] Verificar se `content_name` e `content_type` estão no Custom Data

### **4. Teste:**
- [ ] Testar Purchase na página `/obrigado`
- [ ] Verificar no GTM Preview Mode se tags disparam
- [ ] Verificar payload do Meta no GTM Server-Side
- [ ] Verificar no Meta Events Manager

---

## 🎯 PRÓXIMOS PASSOS

1. Ajustar código para usar valor dinâmico
2. Verificar configuração do GTM
3. Testar e validar





# 📋 CONFIGURAÇÃO: Tags para Webhook no GTM Server-Side

**Objetivo:** Configurar tags para que eventos do webhook disparem corretamente

---

## 🎯 TAGS NECESSÁRIAS

### **1. FB - Purchase (Facebook Conversion API)**

**Tag já deve existir, mas precisa verificar:**
- ✅ Tag "FB - Purchase" configurada?
- ✅ Trigger: `ce - purchase` (Custom Event)
- ✅ Client: Deve disparar para eventos do "Webhook Client"

**Verificar configuração:**
1. GTM Server-Side → Tags → FB - Purchase
2. Trigger: Deve ser `ce - purchase`
3. Verificar se dispara para eventos do "Webhook Client"

---

### **2. GA4 - All Events (Google Analytics 4)**

**Tag já deve existir, mas precisa verificar:**
- ✅ Tag "GA4 - All Events" configurada?
- ✅ Trigger: `All Events` ou `ce - purchase`
- ✅ Client: Deve disparar para eventos do "Webhook Client"

**Verificar configuração:**
1. GTM Server-Side → Tags → GA4 - All Events
2. Trigger: Deve capturar evento `purchase`
3. Verificar se dispara para eventos do "Webhook Client"

---

## 🔧 CONFIGURAÇÃO DOS TRIGGERS

### **Trigger para Purchase:**

**Nome:** `ce - purchase`
**Tipo:** Custom Event
**Event Name:** `purchase`

**Filtros (opcional):**
- Client Name contém: `Webhook Client` (para garantir que só dispara para webhook)
- Ou deixar vazio para disparar para todos os Clients

---

## ✅ VERIFICAÇÃO

### **Tags que devem disparar:**
1. ✅ **FB - Purchase** → Envia para Meta CAPI
2. ✅ **GA4 - All Events** → Envia para GA4

### **Triggers necessários:**
1. ✅ **ce - purchase** → Para evento `purchase`
2. ✅ Ou **All Events** → Para capturar todos os eventos

---

## 📊 FLUXO COMPLETO

```
Webhook → sendPurchaseToGTM()
  ↓
GTM Server-Side → Webhook Client recebe
  ↓
Webhook Client processa evento 'purchase'
  ↓
Trigger 'ce - purchase' detecta
  ↓
Tags disparam:
  - FB - Purchase → Meta CAPI
  - GA4 - All Events → GA4
  ↓
Meta e GA4 recebem Purchase ✅
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Criar Client "Webhook Client"** (já feito)
2. ✅ **Atualizar código** para usar "Webhook Client" (já feito)
3. ⏳ **Verificar tags FB - Purchase e GA4 - All Events**
4. ⏳ **Verificar triggers** estão configurados
5. ⏳ **Testar webhook novamente**

---

## 📝 NOTA IMPORTANTE

**As tags já devem existir!** Mas precisam estar configuradas para:
- ✅ Disparar para eventos do "Webhook Client"
- ✅ Usar trigger `ce - purchase` (ou `All Events`)
- ✅ Estar ativas/publicadas

Se as tags não existirem, precisamos criá-las. Mas geralmente elas já existem e só precisam estar configuradas corretamente.


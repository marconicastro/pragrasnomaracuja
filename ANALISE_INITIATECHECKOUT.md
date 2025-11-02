# 🚨 PROBLEMA CRÍTICO: InitiateCheckout não enviado pelo CAPIG

**Status:** 1 recebido, 0 enviado (REJEITADO!)  
**Gravidade:** 🔴 ALTA (evento crítico para otimização)

---

## 🔍 CAUSAS POSSÍVEIS:

### **1. Parâmetros extras que CAPIG rejeita:**

InitiateCheckout tem MUITOS parâmetros custom:
- status, registration_method, lead_source, lead_type
- predicted_ltv
- Esses podem não ser válidos para InitiateCheckout!

**Meta eventos padrão** só aceitam parâmetros oficiais:
- value, currency, content_ids, content_type, content_name, num_items

**Parâmetros custom** devem ir em custom events (trackCustom)!

---

### **2. user_data muito grande:**

Se user_data tiver campos inválidos ou muitos campos, CAPIG pode rejeitar.

---

### **3. Configuração no Stape Dashboard:**

CAPIG pode ter filtro ou validação que rejeita InitiateCheckout.

---

## ✅ SOLUÇÃO 1: Simplificar InitiateCheckout

### **Remover parâmetros não-oficiais:**

**ANTES (pode estar rejeitado):**
```typescript
trackEliteEvent('InitiateCheckout', {
  value: 39.9,
  currency: 'BRL',
  content_ids: ['hacr962'],
  content_type: 'product',
  content_name: 'Sistema 4 Fases',
  num_items: 1,
  // Esses podem estar causando rejeição:
  status: 'completed',              // ❌ Não oficial
  registration_method: 'form',      // ❌ Não oficial
  lead_source: 'landing',           // ❌ Não oficial
  predicted_ltv: 180                // ❌ Não oficial
})
```

**DEPOIS (somente oficiais):**
```typescript
trackEliteEvent('InitiateCheckout', {
  value: 39.9,                      // ✅ Oficial
  currency: 'BRL',                  // ✅ Oficial
  content_ids: ['hacr962'],         // ✅ Oficial
  content_type: 'product',          // ✅ Oficial
  content_name: 'Sistema 4 Fases',  // ✅ Oficial
  num_items: 1                      // ✅ Oficial
  // REMOVER: Parâmetros custom (só em Lead!)
})
```

---

## 🧪 TESTE:

Após correção, verificar Stape Dashboard:
- InitiateCheckout: 1 recebido, 1 enviado ✅

---

**Investigando código agora...**

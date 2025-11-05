# ✅ AJUSTE: Eventos DataLayer para Triggers Específicos do GTM

**Status:** ✅ Ajustado

---

## 🎯 EVENTOS AJUSTADOS

### **1. Purchase**
- **Nome do evento no DataLayer:** `purchase`
- **Trigger GTM:** `ce - purchase` (Custom Event com nome específico "purchase")
- **Função:** `pushPurchase()`

### **2. Generate Lead**
- **Nome do evento no DataLayer:** `generate_lead`
- **Trigger GTM:** `ce - generate_lead` (Custom Event com nome específico "generate_lead")
- **Função:** `pushGenerateLead()`

---

## 📊 ESTRUTURA DO DATALAYER

### **Purchase Event:**
```javascript
{
  event: 'purchase', // Nome específico para trigger 'ce - purchase'
  ecommerce: {
    transaction_id: '...',
    value: 39.9,
    currency: 'BRL',
    items: [...]
  },
  content_ids: ['hacr962'],
  contents: [...],
  num_items: 1,
  user_data: {...}
}
```

### **Generate Lead Event:**
```javascript
{
  event: 'generate_lead', // Nome específico para trigger 'ce - generate_lead'
  ecommerce: {
    value: 15.0,
    currency: 'BRL'
  },
  content_ids: ['hacr962'],
  contents: [...],
  user_data: {...}
}
```

---

## ✅ CONFIGURAÇÃO DOS TRIGGERS NO GTM

### **Trigger: ce - purchase**
- **Tipo:** Custom Event
- **Nome do evento:** `purchase` (exatamente)
- **Filtros:** Client Name contém "Data Client" (se aplicável)

### **Trigger: ce - generate_lead**
- **Tipo:** Custom Event
- **Nome do evento:** `generate_lead` (exatamente)
- **Filtros:** Client Name contém "Data Client" (se aplicável)

---

## 🔗 CORRESPONDÊNCIA DATALAYER ↔ GTM

| DataLayer Event | GTM Trigger | Tags Disparadas |
|----------------|-------------|-----------------|
| `event: 'purchase'` | `ce - purchase` | FB - Purchase, DT - purchase, GA4 - purchase |
| `event: 'generate_lead'` | `ce - generate_lead` | FB - Lead, DT - generate_lead, GA4 - generate_lead |

---

## ✅ VERIFICAÇÃO

### **Para testar:**

1. **Purchase:**
   - Disparar `pushPurchase(transactionId, ...)`
   - Verificar no GTM Preview Mode se `ce - purchase` dispara
   - Verificar se tags `FB - Purchase`, `DT - purchase`, `GA4 - purchase` disparam

2. **Generate Lead:**
   - Disparar `pushGenerateLead(userData, ...)`
   - Verificar no GTM Preview Mode se `ce - generate_lead` dispara
   - Verificar se tags `FB - Lead`, `DT - generate_lead`, `GA4 - generate_lead` disparam

---

## 📝 RESUMO

✅ **Eventos ajustados:**
- `purchase` → corresponde ao trigger `ce - purchase`
- `generate_lead` → corresponde ao trigger `ce - generate_lead`

✅ **Nomes estão corretos e correspondem aos triggers específicos do GTM!**






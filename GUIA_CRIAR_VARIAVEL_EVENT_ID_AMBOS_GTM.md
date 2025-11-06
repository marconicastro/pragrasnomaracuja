# 📋 GUIA: Criar Variável event_id nos Dois GTM

**Resposta:** Sim, precisa criar nos dois containers, mas de forma diferente!

---

## 🎯 ONDE CRIAR?

### **1. GTM Server-Side Container** ✅ **OBRIGATÓRIO**
- **Variável:** `ed - event_id` (Event Data Variable)
- **Onde usar:** Tags do Facebook Conversion API (server-side)
- **Por quê:** Tags server-side precisam do `event_id` para deduplicação

### **2. GTM Web Container** ⚠️ **OPCIONAL** (depende da configuração)
- **Variável:** `dlv - event_id` (Data Layer Variable) OU `ed - event_id` (Event Data Variable)
- **Onde usar:** Tags do Meta Pixel (browser) - se estiverem usando `event_id`
- **Por quê:** Meta Pixel geralmente gera `event_id` automaticamente, mas pode usar o do DataLayer

---

## 📊 ANÁLISE DAS TAGS

### **GTM Web Container:**
- Tags: `FB - PageView`, `FB - ViewContent`, etc. (Meta Pixel - browser)
- **Meta Pixel geralmente gera `event_id` automaticamente**
- **Se as tags não estão usando `event_id` do DataLayer, não precisa criar variável**

### **GTM Server-Side Container:**
- Tags: `FB - PageView`, `FB - ViewContent`, etc. (Facebook Conversion API - server)
- **Essas tags PRECISAM de `event_id` para deduplicação**
- **OBRIGATÓRIO criar variável `ed - event_id`**

---

## ✅ SOLUÇÃO RECOMENDADA

### **1. GTM Server-Side Container (OBRIGATÓRIO):**

**Criar variável:**
```
GTM Server-Side → Variables → New
├─ Variable Type: Event Data Variable
├─ Variable Name: ed - event_id
├─ Event Data Parameter Name: event_id
└─ Save
```

**Atualizar tags:**
- FB - PageView → Event ID: `{{ed - event_id}}`
- FB - ViewContent → Event ID: `{{ed - event_id}}`
- FB - AddToCart → Event ID: `{{ed - event_id}}`
- FB - InitiateCheckout → Event ID: `{{ed - event_id}}`
- FB - Lead → Event ID: `{{ed - event_id}}`
- FB - Purchase → Event ID: `{{ed - event_id}}`

---

### **2. GTM Web Container (OPCIONAL):**

**Verificar primeiro:**
1. Abrir GTM Web → Tags → FB - PageView (ou qualquer tag FB)
2. Verificar se há campo "Event ID" ou similar
3. Se NÃO tiver campo para `event_id` → **NÃO precisa criar variável** ✅
4. Se TIVER campo para `event_id` → Criar variável

**Se precisar criar:**
```
GTM Web → Variables → New
├─ Variable Type: Data Layer Variable
├─ Variable Name: dlv - event_id
├─ Data Layer Variable Name: event_id
├─ Data Layer Version: 2
└─ Save
```

**OU (se preferir Event Data Variable):**
```
GTM Web → Variables → New
├─ Variable Type: Event Data Variable
├─ Variable Name: ed - event_id
├─ Event Data Parameter Name: event_id
└─ Save
```

---

## 🎯 RESUMO

| Container | Variável | Tipo | Obrigatório? | Onde Usar |
|-----------|----------|------|--------------|-----------|
| **GTM Server-Side** | `ed - event_id` | Event Data Variable | ✅ **SIM** | Tags Facebook Conversion API |
| **GTM Web** | `dlv - event_id` ou `ed - event_id` | Data Layer Variable ou Event Data Variable | ⚠️ **OPCIONAL** | Tags Meta Pixel (se usarem event_id) |

---

## 📝 CHECKLIST

### **GTM Server-Side (OBRIGATÓRIO):**
- [ ] Criar variável `ed - event_id` (Event Data Variable)
- [ ] Atualizar todas as tags FB para usar `{{ed - event_id}}`

### **GTM Web (OPCIONAL):**
- [ ] Verificar se tags Meta Pixel usam `event_id`
- [ ] Se usarem, criar variável `dlv - event_id` ou `ed - event_id`
- [ ] Atualizar tags para usar a variável

---

## 🎯 CONCLUSÃO

**Resposta direta:**
- ✅ **GTM Server-Side:** **SIM, criar `ed - event_id`** (obrigatório)
- ⚠️ **GTM Web:** **Verificar primeiro** - geralmente não precisa porque Meta Pixel gera automaticamente

**Prioridade:**
1. **Primeiro:** Criar no GTM Server-Side (mais importante para deduplicação)
2. **Depois:** Verificar GTM Web (pode não precisar)


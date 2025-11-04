# 🔧 CORREÇÃO: Adicionar content_name e content_type ao Custom Data

**Problema:** `content_name` e `content_type` estão faltando no Custom Data da tag Facebook Conversion API

---

## ✅ O QUE JÁ ESTÁ CORRETO

### **Facebook Pixel (Web Container):**
- ✅ External ID: `{{dlv - user_data.user_id}}` ✅
- ✅ Advanced Matching completo ✅

### **Facebook Conversion API (Server-Side Container):**
- ✅ External ID: `{{ed - user_id}}` ✅
- ✅ Advanced Matching completo ✅
- ✅ Custom Data: value, currency, contents, content_ids, num_items ✅

---

## ❌ O QUE ESTÁ FALTANDO

### **Custom Data da tag Facebook Conversion API (Server-Side):**

**Atualmente:**
```
Property Name          Property Value
content_ids           {{ed - content_ids}}
contents              {{ed - contents}}
value                 {{ed - value}}
currency              {{ed - currency}}
num_items             {{ed - num_items}}
```

**Falta adicionar:**
```
content_name          {{ed - content_name}}     ❌ FALTANDO
content_type          {{ed - content_type}}     ❌ FALTANDO
```

---

## 🔧 CORREÇÃO NECESSÁRIA

### **1. Criar Variáveis no GTM Server-Side (se não existirem)**

**No GTM Server-Side → Variáveis:**

1. **Criar variável: `ed - content_name`**
   - Tipo: **Event Data Variable**
   - Event Data Parameter Name: `content_name`
   - Pasta: Event Data (ou mesma pasta das outras variáveis `ed - *`)

2. **Criar variável: `ed - content_type`**
   - Tipo: **Event Data Variable**
   - Event Data Parameter Name: `content_type`
   - Pasta: Event Data (ou mesma pasta das outras variáveis `ed - *`)

---

### **2. Adicionar ao Custom Data da tag Facebook Conversion API**

**No GTM Server-Side → Tags → FB - InitiateCheckout (ou outras tags FB):**

**Na seção "Custom Data", adicionar:**

```
Property Name          Property Value
content_name          {{ed - content_name}}     ✅ ADICIONAR
content_type          {{ed - content_type}}     ✅ ADICIONAR
```

**Ordem completa do Custom Data:**
```
Property Name          Property Value
value                 {{ed - value}}
currency              {{ed - currency}}
content_ids           {{ed - content_ids}}
contents              {{ed - contents}}
content_name          {{ed - content_name}}     ✅ NOVO
content_type          {{ed - content_type}}     ✅ NOVO
num_items             {{ed - num_items}}
```

---

## 📋 CHECKLIST DE CORREÇÃO

### **No GTM Server-Side:**

- [ ] Criar variável `ed - content_name` (Event Data Variable)
- [ ] Criar variável `ed - content_type` (Event Data Variable)
- [ ] Adicionar `content_name` ao Custom Data da tag "FB - InitiateCheckout"
- [ ] Adicionar `content_type` ao Custom Data da tag "FB - InitiateCheckout"
- [ ] Adicionar aos outros eventos FB (FB - AddToCart, FB - Purchase, etc.)

---

## 🎯 EVENTOS QUE PRECISAM DA CORREÇÃO

Adicionar `content_name` e `content_type` ao Custom Data de:

1. ✅ **FB - InitiateCheckout**
2. ✅ **FB - AddToCart**
3. ✅ **FB - ViewContent**
4. ✅ **FB - Purchase** (quando configurar)

---

## ✅ RESULTADO ESPERADO

### **Após a correção, o Custom Data terá:**

```json
"custom_data": {
  "value": 39.9,
  "currency": "BRL",
  "content_ids": ["hacr962"],
  "contents": [...],
  "content_name": "Sistema 4 Fases - Ebook Trips",  // ✅ ADICIONADO
  "content_type": "product",                        // ✅ ADICIONADO
  "num_items": 1
}
```

---

## 📝 RESUMO

✅ **Código corrigido:** `content_name` e `content_type` já estão sendo enviados no DataLayer

🔧 **Ação no GTM Server-Side:**
1. Criar variáveis `ed - content_name` e `ed - content_type`
2. Adicionar ao Custom Data de todas as tags FB

✅ **External ID:** Já está configurado corretamente (`{{ed - user_id}}`)


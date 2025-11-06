# ✅ RESUMO SIMPLES: O Que Fazer Agora

## 🎯 **VOCÊ JÁ TEM TUDO!**

Você já criou todas as variáveis. Agora só precisa **MAPEAR nas tags**.

---

## 📋 **PASSO A PASSO**

### **1. FB - ViewContent, AddToCart, InitiateCheckout**

#### **Custom Data:**
```
currency    → {{ed - currency}}
value       → {{ed - value}}
content_ids → {{ed - content_ids}}
contents    → {{ed - contents}}
num_items   → {{ed - num_items}}
```

#### **User Data:**
```
Email       → {{ed - email_address}}
Phone       → {{ed - phone_number}}
First Name  → {{ed - first_name}}
Last Name   → {{ed - last_name}}
City        → {{ed - city}}
State       → {{ed - region}}
Country     → {{ed - country}}
Zip         → {{ed - postal_code}}
External ID → {{ed - user_id}}
```

#### **Event ID:**
```
Event ID    → {{ed - event_id}}
```

---

### **2. FB - PageView**

#### **User Data (mesmo que acima):**
```
Email       → {{ed - email_address}}
Phone       → {{ed - phone_number}}
First Name  → {{ed - first_name}}
Last Name   → {{ed - last_name}}
City        → {{ed - city}}
State       → {{ed - region}}
Country     → {{ed - country}}
Zip         → {{ed - postal_code}}
External ID → {{ed - user_id}}
```

#### **Event ID:**
```
Event ID    → {{ed - event_id}}
```

---

## ⚠️ **IMPORTANTE: NÃO USE**

❌ `{{ed - ecommerce.currency}}` → Use `{{ed - currency}}`
❌ `{{ed - ecommerce.value}}` → Use `{{ed - value}}`
❌ `{{ed - user_data.email_address}}` → Use `{{ed - email_address}}`
❌ `{{ed - user_data.first_name}}` → Use `{{ed - first_name}}`
❌ `{{ed - user_data.city}}` → Use `{{ed - city}}`

---

## ✅ **POR QUÊ?**

Os dados chegam no **nível raiz** do evento, não dentro de `ecommerce` ou `user_data`.

**Exemplo do que chega:**
```json
{
  "currency": "BRL",           ← Nível raiz ✅
  "value": 39.9,               ← Nível raiz ✅
  "email_address": "ana@...",  ← Nível raiz ✅
  "first_name": "Ana",         ← Nível raiz ✅
  "city": "caculé"             ← Nível raiz ✅
}
```

**NÃO chega assim:**
```json
{
  "ecommerce": {
    "currency": "BRL"  ← Não chega assim ❌
  },
  "user_data": {
    "email_address": "ana@..."  ← Não chega assim ❌
  }
}
```

---

## 🎯 **AÇÃO**

1. Abra cada tag (FB - ViewContent, AddToCart, InitiateCheckout, PageView)
2. Substitua as variáveis antigas pelas novas do nível raiz
3. Salve e teste

**Pronto!** 🚀


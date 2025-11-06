# ✅ CONFIRMAÇÃO: Mapeamento das Tags

## 🎯 **SEU MAPEAMENTO - ANÁLISE**

### **✅ User Data - CORRETO:**
- ✅ First Name → `{{ed - first_name}}`
- ✅ Last Name → `{{ed - last_name}}`
- ✅ Email → `{{ed - email_address}}`
- ✅ Phone → `{{ed - phone_number}}`
- ⚠️ External ID → `{{cs - x-stape-user-id}}` (funciona, mas `{{ed - user_id}}` seria mais consistente)
- ✅ City → `{{ed - city}}`
- ✅ Country → `{{ed - country}}`
- ✅ State → `{{ed - region}}`
- ✅ Zip → `{{ed - postal_code}}`

### **✅ Custom Data - QUASE CORRETO:**
- ✅ content_ids → `{{ed - content_ids}}`
- ✅ contents → `{{ed - contents}}`
- ✅ value → `{{ed - value}}`
- ✅ currency → `{{ed - currency}}`
- ✅ content_name → `{{ed - content_name}}` (pode não chegar, mas ok tentar)
- ❌ **ERRO DE DIGITAÇÃO:** `contet_type` → deve ser `content_type`
- ⚠️ **FALTA:** `num_items` → `{{ed - num_items}}` (importante para alguns eventos)

---

## 🔧 **CORREÇÕES NECESSÁRIAS**

### **1. Corrigir digitação:**
```
❌ contet_type
✅ content_type
```

### **2. Adicionar num_items:**
```
Property Name: num_items
Property Value: {{ed - num_items}}
```

### **3. Adicionar Event ID (na seção Event ID):**
```
Property Name: Event ID
Property Value: {{ed - event_id}}
```

---

## 📋 **MAPEAMENTO FINAL CORRETO**

### **User Data:**
```
First Name    → {{ed - first_name}}
Last Name     → {{ed - last_name}}
Email         → {{ed - email_address}}
Phone         → {{ed - phone_number}}
External ID   → {{cs - x-stape-user-id}} (ou {{ed - user_id}})
City          → {{ed - city}}
Country       → {{ed - country}}
State         → {{ed - region}}
Zip           → {{ed - postal_code}}
```

### **Custom Data:**
```
content_ids   → {{ed - content_ids}}
contents      → {{ed - contents}}
value         → {{ed - value}}
currency      → {{ed - currency}}
content_name  → {{ed - content_name}}
content_type  → {{ed - content_type}}  ← CORRIGIR DIGITAÇÃO
num_items     → {{ed - num_items}}     ← ADICIONAR
```

### **Event ID (seção separada):**
```
Event ID      → {{ed - event_id}}      ← ADICIONAR
```

---

## ⚠️ **NOTA SOBRE External ID**

Você está usando `{{cs - x-stape-user-id}}` (Client-Side variable).

**Opções:**
1. **Manter** `{{cs - x-stape-user-id}}` se já funciona ✅
2. **Trocar** por `{{ed - user_id}}` para ser mais consistente (Event Data)

**Recomendação:** Se `{{cs - x-stape-user-id}}` já funciona, mantenha. Se não, use `{{ed - user_id}}`.

---

## ✅ **RESUMO**

**O que está CORRETO:** ✅ 95% do mapeamento

**O que precisa CORRIGIR:**
1. ❌ `contet_type` → `content_type` (erro de digitação)
2. ⚠️ Adicionar `num_items` no Custom Data
3. ⚠️ Adicionar `Event ID` na seção Event ID

**Status:** 🟡 **QUASE PERFEITO - SÓ 3 AJUSTES**


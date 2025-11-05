# 📋 GUIA: Variáveis GTM Web vs GTM Server-Side

**Objetivo:** Entender a diferença entre variáveis do browser e do webhook.

---

## 🔍 DIFERENÇA FUNDAMENTAL

### **GTM Web (Browser Events):**
- **Fonte:** `window.dataLayer` do browser
- **Tipo:** Data Layer Variable (`{{dlv - *}}`)
- **Acesso:** Via DataLayer do GTM Web Container

### **GTM Server-Side (Webhook Events):**
- **Fonte:** Payload direto do evento (via `/data` endpoint)
- **Tipo:** Event Data Variable (`{{ed - *}}`)
- **Acesso:** Via Event Data do GTM Server-Side

---

## 📊 COMPARAÇÃO PRÁTICA

### **Exemplo: `ecommerce.value`**

#### **GTM Web (Browser):**
```
Variável: dlv - ecommerce.value
Tipo: Data Layer Variable
Path: ecommerce.value
Acesso: window.dataLayer[].ecommerce.value
Uso: PageView, ViewContent, AddToCart, Lead, InitiateCheckout
```

#### **GTM Server-Side (Webhook):**
```
Variável: ed - ecommerce.value
Tipo: Event Data Variable
Path: ecommerce.value  ← MESMO PATH!
Acesso: eventData.ecommerce.value (do payload)
Uso: Purchase (webhook)
```

---

## ✅ SOLUÇÃO

### **Criar Variáveis Event Data para Webhook:**

1. **Mesmos paths** que já existem no GTM Web
2. **Tipo diferente:** Event Data Variable ao invés de Data Layer Variable
3. **Mesma estrutura:** `ecommerce.value`, `ecommerce.currency`, etc.

### **Mapear na Tag "FB - Purchase":**

**Opção 1: Substituir Data Layer Variables por Event Data Variables**
- Remover `{{dlv - *}}`
- Adicionar `{{ed - *}}`
- ⚠️ **Atenção:** Isso pode quebrar eventos do browser se eles também usam essa tag

**Opção 2: Criar Tag Separada (Recomendado)**
- Tag "FB - Purchase (Browser)" → Usa `{{dlv - *}}`
- Tag "FB - Purchase (Webhook)" → Usa `{{ed - *}}`
- Trigger separado para cada uma

**Opção 3: Usar Ambas (Mais Complexo)**
- Criar variáveis que tentam Event Data primeiro, depois Data Layer
- Usar Custom JavaScript Variable com fallback

---

## 🎯 RECOMENDAÇÃO

### **Para Webhook (Purchase):**

1. **Criar variáveis Event Data** (`{{ed - *}}`) com os mesmos paths
2. **Mapear na tag "FB - Purchase"** usando `{{ed - *}}`
3. **Verificar se eventos do browser ainda funcionam:**
   - Se sim → ✅ Perfeito!
   - Se não → Criar tag separada ou usar variáveis com fallback

---

## 📋 CHECKLIST

### **Variáveis a Criar (Event Data):**
- [ ] `ed - ecommerce.currency` (Path: `ecommerce.currency`)
- [ ] `ed - ecommerce.value` (Path: `ecommerce.value`)
- [ ] `ed - ecommerce.transaction_id` (Path: `ecommerce.transaction_id`)
- [ ] `ed - content_name` (Path: `content_name`)
- [ ] `ed - content_type` (Path: `content_type`)
- [ ] `ed - content_ids` (Path: `content_ids`)
- [ ] `ed - contents` (Path: `contents`)
- [ ] `ed - num_items` (Path: `num_items`)
- [ ] `ed - user_data.user_id` (Path: `user_data.user_id`)
- [ ] `ed - user_data.email_address` (Path: `user_data.email_address`)
- [ ] `ed - user_data.phone_number` (Path: `user_data.phone_number`)
- [ ] ... (e todas as outras)

### **Mapeamento na Tag:**
- [ ] Verificar tag "FB - Purchase" atual
- [ ] Substituir `{{dlv - *}}` por `{{ed - *}}` OU criar tag separada
- [ ] Testar webhook (Purchase)
- [ ] Testar browser (se aplicável)

---

## 🔍 VALIDAÇÃO

### **Após criar variáveis Event Data:**

1. **Enviar evento via webhook (ReqBin)**
2. **Verificar no Preview Mode:**
   - ✅ Variáveis Event Data têm valores?
   - ✅ Tag "FB - Purchase" dispara?
   - ✅ Payload enviado ao Meta tem `custom_data` completo?

### **Verificar se eventos do browser ainda funcionam:**

1. **Testar evento Purchase do browser** (se houver)
2. **Verificar se tag ainda dispara:**
   - ✅ Se sim → Variáveis Event Data funcionam para ambos
   - ❌ Se não → Criar tag separada ou usar fallback

---

## ✅ CONCLUSÃO

**Você está correto!** Precisamos criar variáveis **Event Data** (`{{ed - *}}`) para webhook, mesmo que os paths sejam os mesmos do GTM Web.

**Por que?**
- GTM Web usa Data Layer Variables (acessam `window.dataLayer`)
- GTM Server-Side (webhook) usa Event Data Variables (acessam payload do evento)
- **Mas os paths são os mesmos porque o formato do payload é o mesmo!** ✅




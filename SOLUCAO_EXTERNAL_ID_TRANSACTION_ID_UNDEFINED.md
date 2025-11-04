# 🔧 SOLUÇÃO: external_id e transaction_id undefined

**Problema:** `{{ed - user_id}}` e `{{ed - transaction_id}}` estão retornando "undefined" no GTM Server-Side

---

## 🔍 DIAGNÓSTICO

### **Como os dados estão sendo enviados no DataLayer:**

**Para `user_id`:**
```javascript
{
  event: 'begin_checkout',
  user_data: {
    user_id: 'sess_1761312196590_bookidhkx',  // ✅ Está aqui
    email_address: '...',
    // ...
  }
}
```

**Para `transaction_id`:**
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'order_123',  // ✅ Está aqui
    value: 39.9,
    // ...
  }
}
```

---

## ❌ PROBLEMA

**No GTM Server-Side:**
- Variável: `{{ed - user_id}}` → **undefined** ❌
- Variável: `{{ed - transaction_id}}` → **undefined** ❌

**Por quê?**
- `{{ed - user_id}}` procura por `event.user_id` (não existe!)
- O valor real está em `event.user_data.user_id`
- `{{ed - transaction_id}}` procura por `event.transaction_id` (não existe!)
- O valor real está em `event.ecommerce.transaction_id`

---

## ✅ SOLUÇÃO

### **1. Para EXTERNAL_ID (user_id):**

**Opção A: Usar Data Layer Variable (dlv -)**
- Criar variável: `dlv - user_data.user_id`
- Tipo: **Data Layer Variable**
- Data Layer Variable Name: `user_data.user_id`
- Usar no User Data: `{{dlv - user_data.user_id}}`

**Opção B: Criar Event Data Variable com caminho correto**
- Criar variável: `ed - user_data.user_id`
- Tipo: **Event Data Variable**
- Event Data Parameter Name: `user_data.user_id`
- Usar no User Data: `{{ed - user_data.user_id}}`

**Recomendado:** Usar **Opção A** (Data Layer Variable) porque é mais confiável.

---

### **2. Para TRANSACTION_ID:**

**Opção A: Usar Data Layer Variable (dlv -)**
- Criar variável: `dlv - ecommerce.transaction_id`
- Tipo: **Data Layer Variable**
- Data Layer Variable Name: `ecommerce.transaction_id`
- Usar no Custom Data: `{{dlv - ecommerce.transaction_id}}`

**Opção B: Criar Event Data Variable com caminho correto**
- Criar variável: `ed - ecommerce.transaction_id`
- Tipo: **Event Data Variable**
- Event Data Parameter Name: `ecommerce.transaction_id`
- Usar no Custom Data: `{{ed - ecommerce.transaction_id}}`

**Recomendado:** Usar **Opção A** (Data Layer Variable) porque é mais confiável.

---

## 🔧 PASSOS PARA CORRIGIR

### **Passo 1: Criar Variáveis no GTM Server-Side**

**No GTM Server-Side → Variáveis:**

1. **Criar variável: `dlv - user_data.user_id`**
   - Tipo: **Data Layer Variable**
   - Data Layer Variable Name: `user_data.user_id`
   - Versão: 2
   - Pasta: Data Layer Variables (ou mesma pasta das outras `dlv - *`)

2. **Criar variável: `dlv - ecommerce.transaction_id`**
   - Tipo: **Data Layer Variable**
   - Data Layer Variable Name: `ecommerce.transaction_id`
   - Versão: 2
   - Pasta: Data Layer Variables (ou mesma pasta das outras `dlv - *`)

---

### **Passo 2: Atualizar a Tag Facebook Conversion API**

**Na tag "FB - InitiateCheckout" (Server-Side):**

**User Data:**
```
Property Name          Property Value
External ID           {{dlv - user_data.user_id}}    ✅ ALTERAR DE {{ed - user_id}}
```

**Custom Data (para Purchase):**
```
Property Name          Property Value
order_id              {{dlv - ecommerce.transaction_id}}    ✅ ADICIONAR (se não tiver)
```

---

## 📋 CHECKLIST DE CORREÇÃO

### **No GTM Server-Side:**

- [ ] Criar variável `dlv - user_data.user_id` (Data Layer Variable)
- [ ] Criar variável `dlv - ecommerce.transaction_id` (Data Layer Variable)
- [ ] Atualizar tag "FB - InitiateCheckout": External ID → `{{dlv - user_data.user_id}}`
- [ ] Atualizar tag "FB - Purchase" (quando criar): order_id → `{{dlv - ecommerce.transaction_id}}`
- [ ] Atualizar outras tags FB que usam `{{ed - user_id}}`

---

## 🎯 DIFERENÇA ENTRE `ed -` E `dlv -`

### **Event Data Variable (`ed -`):**
- Acessa dados do evento que chega no GTM Server-Side
- Exemplo: `{{ed - event_name}}` → `"begin_checkout"`
- **NÃO funciona bem com objetos aninhados** como `user_data.user_id`

### **Data Layer Variable (`dlv -`):**
- Acessa dados do DataLayer original (do browser)
- Exemplo: `{{dlv - user_data.user_id}}` → `"sess_1761312196590_bookidhkx"`
- **FUNCIONA com objetos aninhados** usando notação de ponto

---

## ✅ RESULTADO ESPERADO

**Após a correção:**

**User Data:**
```
External ID           {{dlv - user_data.user_id}}    ✅ Funciona!
```

**Custom Data (Purchase):**
```
order_id              {{dlv - ecommerce.transaction_id}}    ✅ Funciona!
```

---

## 📝 RESUMO

✅ **Problema identificado:**
- `{{ed - user_id}}` não encontra `user_data.user_id`
- `{{ed - transaction_id}}` não encontra `ecommerce.transaction_id`

✅ **Solução:**
- Usar **Data Layer Variables** (`dlv -`) com caminho completo
- `{{dlv - user_data.user_id}}` para external_id
- `{{dlv - ecommerce.transaction_id}}` para transaction_id


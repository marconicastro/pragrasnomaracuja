# ✅ SOLUÇÃO DEFINITIVA: Estrutura user_data

## 🔍 **PROBLEMA IDENTIFICADO**

O GTM Server-Side (Stape.io) está transformando a estrutura `user_data`:

### **Código envia:**
```javascript
user_data: {
  email_address: "ana.silva@email.com",
  phone_number: "11999999888",
  city: "caculé",
  region: "ba",
  country: "BR",
  first_name: "Ana",
  last_name: "Silva",
  postal_code: "46300"
}
```

### **GTM Server-Side recebe:**
```javascript
user_data: {
  email_address: "ana.silva@email.com",
  phone_number: "11999999888",
  address: {
    city: "caculé",
    region: "ba",
    country: "BR",
    first_name: "Ana",
    last_name: "Silva",
    postal_code: "46300"
  }
}
```

**Resultado:** Variáveis `{{ed - user_data.city}}` retornam `undefined` porque os dados estão em `user_data.address.city`

---

## ✅ **SOLUÇÃO**

### **Opção 1: Criar variáveis para `user_data.address.*` (RECOMENDADO)**

Criar variáveis Event Data com paths:
- `user_data.address.city` → `{{ed - user_data.address.city}}`
- `user_data.address.region` → `{{ed - user_data.address.region}}`
- `user_data.address.country` → `{{ed - user_data.address.country}}`
- `user_data.address.postal_code` → `{{ed - user_data.address.postal_code}}`
- `user_data.address.first_name` → `{{ed - user_data.address.first_name}}`
- `user_data.address.last_name` → `{{ed - user_data.address.last_name}}`

### **Opção 2: Ajustar código para enviar no formato que Stape.io espera**

Ajustar o código para enviar `user_data` sem campos de endereço no nível raiz, deixando o Stape.io transformar.

---

## 🎯 **AÇÃO IMEDIATA**

### **1. Criar Variáveis para `user_data.address.*`:**

No GTM Server-Side → Variáveis:

1. **Criar `ed - user_data.address.city`:**
   - Tipo: Event Data Variable
   - Nome do campo de evento: `user_data.address.city`
   - Tipo de valor: Texto

2. **Criar `ed - user_data.address.region`:**
   - Tipo: Event Data Variable
   - Nome do campo de evento: `user_data.address.region`
   - Tipo de valor: Texto

3. **Criar `ed - user_data.address.country`:**
   - Tipo: Event Data Variable
   - Nome do campo de evento: `user_data.address.country`
   - Tipo de valor: Texto

4. **Criar `ed - user_data.address.postal_code`:**
   - Tipo: Event Data Variable
   - Nome do campo de evento: `user_data.address.postal_code`
   - Tipo de valor: Texto

5. **Criar `ed - user_data.address.first_name`:**
   - Tipo: Event Data Variable
   - Nome do campo de evento: `user_data.address.first_name`
   - Tipo de valor: Texto

6. **Criar `ed - user_data.address.last_name`:**
   - Tipo: Event Data Variable
   - Nome do campo de evento: `user_data.address.last_name`
   - Tipo de valor: Texto

### **2. Atualizar Tags para usar as novas variáveis:**

Nas tags FB - ViewContent, FB - AddToCart, FB - InitiateCheckout, FB - Lead:

**User Data:**
- `City`: `{{ed - user_data.address.city}}` (ao invés de `{{ed - user_data.city}}`)
- `State`: `{{ed - user_data.address.region}}` (ao invés de `{{ed - user_data.region}}`)
- `Country`: `{{ed - user_data.address.country}}` (ao invés de `{{ed - user_data.country}}`)
- `Zip`: `{{ed - user_data.address.postal_code}}` (ao invés de `{{ed - user_data.postal_code}}`)
- `First Name`: `{{ed - user_data.address.first_name}}` (ao invés de `{{ed - user_data.first_name}}`)
- `Last Name`: `{{ed - user_data.address.last_name}}` (ao invés de `{{ed - user_data.last_name}}`)

---

## 📋 **PROBLEMA 2: content_name e content_type**

Os dados mostram que `content_name` e `content_type` **NÃO ESTÃO CHEGANDO** no GTM Server-Side, mesmo o código enviando.

**Possíveis causas:**
1. GTM Server-Side está filtrando esses campos
2. Stape.io está removendo campos não reconhecidos
3. Há algum problema na transmissão

**Solução:** Verificar se os campos estão sendo enviados no DataLayer do browser antes de chegar no GTM Server-Side.

---

**Status:** ⚠️ **AÇÃO IMEDIATA NECESSÁRIA NO GTM SERVER-SIDE**


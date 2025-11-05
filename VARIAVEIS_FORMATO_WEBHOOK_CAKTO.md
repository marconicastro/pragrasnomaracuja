# 📋 Variáveis Event Data - Formato Webhook Cakto Original

## 🎯 **QUANDO USAR**

Use estes paths se no Preview Mode você vê a estrutura ORIGINAL do webhook Cakto:

```
Dados do evento:
Nome          Valor
data          { customer: { email: "...", phone: "..." }, refId: "...", amount: 5.55 }
```

---

## ✅ **LISTA COMPLETA DE VARIÁVEIS**

### **Custom Data (Meta):**

| Variável | Path | Tipo | Valor Exemplo | Mapear na Tag FB |
|----------|------|------|---------------|------------------|
| `{{ed - amount}}` | `data.amount` | Número | `5.55` | `value` |
| `{{ed - currency}}` | `data.currency` ou fixo `"BRL"` | Texto | `"BRL"` | `currency` |
| `{{ed - refId}}` | `data.refId` | Texto | `"AUAe5xK"` | `order_id` |
| `{{ed - offer.name}}` | `data.offer.name` | Texto | `"Offer Example"` | `content_name` |
| `{{ed - product.id}}` | `data.product.id` | Texto | `"cd287b31-d4b7-4e94-858a-96e05ce2f4a2"` | `content_ids` (array) |
| `{{ed - product.type}}` | `data.product.type` | Texto | `"unique"` | `content_type` |

### **User Data (Meta):**

| Variável | Path | Tipo | Valor Exemplo | Mapear na Tag FB |
|----------|------|------|---------------|------------------|
| `{{ed - customer.email}}` | `data.customer.email` | Texto | `"Example@Example.com"` | `email_address` |
| `{{ed - customer.phone}}` | `data.customer.phone` | Texto | `"34999999999"` | `phone_number` |
| `{{ed - customer.name}}` | `data.customer.name` | Texto | `"Example"` | `first_name` (split) |

---

## 📋 **Como Criar (Passo a Passo)**

### **Exemplo: Criar `{{ed - customer.email}}`**

```
Nome da variável: ed - customer.email
Tipo de variável: Event Data
Nome do campo de evento: data.customer.email
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** O path é `data.customer.email` (formato webhook Cakto original!)

---

## 🔧 **Variáveis Customizadas Necessárias**

Algumas variáveis precisam ser criadas como **Custom JavaScript Variables** porque o formato webhook é diferente do formato Meta:

### **1. Content IDs (Array)**

Criar variável Custom JavaScript:

```javascript
function() {
  var productId = {{ed - product.id}};
  if (productId) {
    return [productId];
  }
  return [];
}
```

**Nome:** `content_ids_array`

---

### **2. Content Name**

Usar diretamente: `{{ed - offer.name}}`

---

### **3. Content Type**

Criar variável Custom JavaScript:

```javascript
function() {
  var productType = {{ed - product.type}};
  if (productType === 'unique') {
    return 'product';
  }
  return 'product'; // Default
}
```

**Nome:** `content_type_fixed`

---

### **4. First Name e Last Name (Split do Name)**

Criar variável Custom JavaScript para First Name:

```javascript
function() {
  var fullName = {{ed - customer.name}};
  if (fullName) {
    var parts = fullName.split(' ');
    return parts[0] || '';
  }
  return '';
}
```

**Nome:** `first_name_split`

Criar variável Custom JavaScript para Last Name:

```javascript
function() {
  var fullName = {{ed - customer.name}};
  if (fullName) {
    var parts = fullName.split(' ');
    if (parts.length > 1) {
      return parts.slice(1).join(' ');
    }
  }
  return '';
}
```

**Nome:** `last_name_split`

---

## 📊 **Mapeamento na Tag "FB - Purchase"**

### **Custom Data:**

| Campo Meta | Variável GTM |
|------------|--------------|
| `currency` | `"BRL"` (valor fixo) ou `{{ed - currency}}` |
| `value` | `{{ed - amount}}` |
| `content_ids` | `{{content_ids_array}}` (Custom JS) |
| `content_name` | `{{ed - offer.name}}` |
| `content_type` | `{{content_type_fixed}}` (Custom JS) ou `"product"` (fixo) |
| `num_items` | `1` (valor fixo) |
| `order_id` | `{{ed - refId}}` |

### **User Data:**

| Campo Meta | Variável GTM |
|------------|--------------|
| `email_address` | `{{ed - customer.email}}` |
| `phone_number` | `{{ed - customer.phone}}` |
| `first_name` | `{{first_name_split}}` (Custom JS) |
| `last_name` | `{{last_name_split}}` (Custom JS) |
| `external_id` | `{{ed - user_data.user_id}}` (se disponível) ou gerar |

---

## ✅ **Checklist**

### **Variáveis Event Data:**
- [ ] `{{ed - amount}}` → Path: `data.amount`
- [ ] `{{ed - refId}}` → Path: `data.refId`
- [ ] `{{ed - customer.email}}` → Path: `data.customer.email`
- [ ] `{{ed - customer.phone}}` → Path: `data.customer.phone`
- [ ] `{{ed - customer.name}}` → Path: `data.customer.name`
- [ ] `{{ed - offer.name}}` → Path: `data.offer.name`
- [ ] `{{ed - product.id}}` → Path: `data.product.id`
- [ ] `{{ed - product.type}}` → Path: `data.product.type`

### **Variáveis Custom JavaScript:**
- [ ] `{{content_ids_array}}` → Array com `product.id`
- [ ] `{{content_type_fixed}}` → Retorna `"product"`
- [ ] `{{first_name_split}}` → Primeiro nome do `customer.name`
- [ ] `{{last_name_split}}` → Resto do nome do `customer.name`

---

## 🔍 **Como Verificar se Precisa Usar Este Formato**

1. Abrir Preview Mode
2. Enviar evento de teste
3. Clicar em **Dados do evento**
4. **Se você vê `data: { customer: {...} }`, use paths com `data.`**
5. **Se você vê `ecommerce: {...}`, use paths com `ecommerce.`**

---

## 🚨 **IMPORTANTE**

**Este formato só deve ser usado se o GTM estiver recebendo o payload ORIGINAL do webhook Cakto!**

Se o código já está transformando para formato DataLayer (`ecommerce.currency`, `user_data.email_address`), use os paths do formato DataLayer.

---

**Última atualização**: 2025-01-05
**Versão**: 1.0



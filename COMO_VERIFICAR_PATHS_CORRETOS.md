# 🔍 Como Verificar os Paths Corretos das Variáveis Event Data

## 🎯 **PROBLEMA**

Variáveis Event Data retornam `undefined` porque o path está incorreto.

---

## ✅ **SOLUÇÃO: Verificar no Preview Mode**

### **Passo 1: Abrir Preview Mode**

1. No GTM Server-Side, clique em **Preview**
2. Enviar evento de teste via ReqBin (webhook)
3. Clique no evento **Data** que apareceu

### **Passo 2: Ver Estrutura dos Dados**

No Preview Mode, vá em **Dados do evento** e veja a estrutura:

#### **CENÁRIO A: Dados estão no nível raiz**

```
Dados do evento:
Nome          Valor
event         "purchase"
ecommerce     { transaction_id: "...", value: 39.9, currency: "BRL" }
user_data     { email_address: "...", phone_number: "..." }
```

**✅ Paths corretos:**
- `ecommerce.currency`
- `ecommerce.value`
- `user_data.email_address`
- `user_data.phone_number`

---

#### **CENÁRIO B: Dados estão dentro de `0: {...}`**

```
Dados do evento:
Nome          Valor
0             { event: "purchase", ecommerce: {...}, user_data: {...} }
```

**✅ Paths corretos (COM `0.` no início):**
- `0.ecommerce.currency`
- `0.ecommerce.value`
- `0.user_data.email_address`
- `0.user_data.phone_number`

---

#### **CENÁRIO C: Dados estão no formato ORIGINAL do webhook Cakto**

```
Dados do evento:
Nome          Valor
data          { customer: { email: "...", phone: "..." }, refId: "...", amount: 5.55 }
```

**✅ Paths corretos (formato webhook Cakto):**
- `data.customer.email`
- `data.customer.phone`
- `data.customer.name`
- `data.refId`
- `data.amount`
- `data.offer.name`

---

## 🔧 **Como Criar as Variáveis Corretas**

### **Opção 1: Se dados estão em `0: {...}`**

Criar variáveis com paths começando com `0.`:

```
Nome da variável: ed - ecommerce.currency
Path: 0.ecommerce.currency

Nome da variável: ed - user_data.email_address
Path: 0.user_data.email_address
```

### **Opção 2: Se dados estão no formato webhook Cakto**

Criar variáveis com paths do formato webhook:

```
Nome da variável: ed - customer.email
Path: data.customer.email

Nome da variável: ed - customer.phone
Path: data.customer.phone

Nome da variável: ed - refId
Path: data.refId

Nome da variável: ed - amount
Path: data.amount
```

---

## 📋 **Lista Completa de Variáveis (Formato Webhook Cakto)**

Se o GTM está recebendo o formato ORIGINAL do webhook, use estes paths:

### **Custom Data (Meta):**

| Variável | Path | Valor Exemplo |
|----------|------|---------------|
| `{{ed - amount}}` | `data.amount` | `5.55` |
| `{{ed - currency}}` | `data.currency` ou fixo `"BRL"` | `"BRL"` |
| `{{ed - refId}}` | `data.refId` | `"AUAe5xK"` |
| `{{ed - offer.name}}` | `data.offer.name` | `"Offer Example"` |
| `{{ed - product.id}}` | `data.product.id` | `"cd287b31-d4b7-4e94-858a-96e05ce2f4a2"` |

### **User Data (Meta):**

| Variável | Path | Valor Exemplo |
|----------|------|---------------|
| `{{ed - customer.email}}` | `data.customer.email` | `"Example@Example.com"` |
| `{{ed - customer.phone}}` | `data.customer.phone` | `"34999999999"` |
| `{{ed - customer.name}}` | `data.customer.name` | `"Example"` |

---

## 🔍 **Verificação no Preview Mode**

### **Teste 1: Verificar estrutura**

1. Abrir Preview Mode
2. Enviar evento via ReqBin
3. Clicar em **Dados do evento**
4. **Anotar a estrutura exata**

### **Teste 2: Criar variável de teste**

1. Criar variável: `ed - teste`
2. Path: `data` (ou `0.data` se estiver em `0`)
3. Verificar se retorna objeto

### **Teste 3: Acessar campo específico**

1. Criar variável: `ed - teste.email`
2. Path: `data.customer.email` (ou `0.data.customer.email`)
3. Verificar se retorna valor

---

## 🚨 **IMPORTANTE**

**O path depende de como o GTM Server-Side está recebendo os dados!**

- Se está recebendo formato DataLayer processado → usar `ecommerce.currency`
- Se está recebendo formato webhook original → usar `data.customer.email`
- Se está colocando em array `0` → usar `0.ecommerce.currency`

---

## ✅ **Ação Imediata**

1. Abrir Preview Mode
2. Ver estrutura exata dos dados
3. Criar variáveis com paths baseados na estrutura REAL
4. Testar cada variável
5. Mapear na tag "FB - Purchase"

---

**Última atualização**: 2025-01-05
**Versão**: 1.0



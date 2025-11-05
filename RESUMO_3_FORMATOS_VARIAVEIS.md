# 🎯 RESUMO: 3 Formatos de Variáveis Event Data

## ❓ **Qual Formato Usar?**

Depende de como os dados aparecem no **Preview Mode** do GTM Server-Side.

---

## 📊 **FORMATO 1: Nível Raiz (Sem `0.`)**

### **Quando usar:**
Se no Preview Mode você vê:

```
Dados do evento:
Nome          Valor
event         "purchase"
ecommerce     { transaction_id: "...", value: 39.9, currency: "BRL" }
user_data     { email_address: "...", phone_number: "..." }
```

### **Paths corretos:**
- `ecommerce.currency`
- `ecommerce.value`
- `user_data.email_address`
- `user_data.phone_number`

### **Documentação:**
Ver `VARIAVEIS_EVENT_DATA_PURCHASE_COMPLETA.md`

---

## 📊 **FORMATO 2: Com Prefixo `0.`**

### **Quando usar:**
Se no Preview Mode você vê:

```
Dados do evento:
Nome          Valor
0             { event: "purchase", ecommerce: {...}, user_data: {...} }
```

### **Paths corretos:**
- `0.ecommerce.currency`
- `0.ecommerce.value`
- `0.user_data.email_address`
- `0.user_data.phone_number`

### **Documentação:**
Ver `VARIAVEIS_COM_PREFIXO_0.md`

---

## 📊 **FORMATO 3: Webhook Cakto Original**

### **Quando usar:**
Se no Preview Mode você vê:

```
Dados do evento:
Nome          Valor
data          { customer: { email: "...", phone: "..." }, refId: "...", amount: 5.55 }
```

### **Paths corretos:**
- `data.customer.email`
- `data.customer.phone`
- `data.refId`
- `data.amount`

### **Documentação:**
Ver `VARIAVEIS_FORMATO_WEBHOOK_CAKTO.md`

---

## 🔍 **Como Identificar Qual Usar**

### **Passo 1: Abrir Preview Mode**
1. No GTM Server-Side, clique em **Preview**
2. Enviar evento de teste via ReqBin

### **Passo 2: Ver Estrutura**
1. Clicar no evento **Data**
2. Ir em **Dados do evento**
3. **Anotar a estrutura exata**

### **Passo 3: Escolher Formato**
- **Se vê `ecommerce: {...}` direto** → Usar **FORMATO 1**
- **Se vê `0: { ecommerce: {...} }`** → Usar **FORMATO 2**
- **Se vê `data: { customer: {...} }`** → Usar **FORMATO 3**

---

## ✅ **Ação Imediata**

1. ✅ Abrir Preview Mode
2. ✅ Ver estrutura exata dos dados
3. ✅ Escolher formato baseado na estrutura
4. ✅ Criar variáveis com paths corretos
5. ✅ Mapear na tag "FB - Purchase"
6. ✅ Testar no Preview Mode

---

## 📋 **Documentos de Referência**

1. **COMO_VERIFICAR_PATHS_CORRETOS.md** - Guia passo a passo
2. **VARIAVEIS_EVENT_DATA_PURCHASE_COMPLETA.md** - Formato 1 (nível raiz)
3. **VARIAVEIS_COM_PREFIXO_0.md** - Formato 2 (com `0.`)
4. **VARIAVEIS_FORMATO_WEBHOOK_CAKTO.md** - Formato 3 (webhook original)

---

**Última atualização**: 2025-01-05
**Versão**: 1.0


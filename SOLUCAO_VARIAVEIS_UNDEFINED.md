# 🔧 SOLUÇÃO: Todas as Variáveis `undefined`

**Problema:** Todas as variáveis Event Data retornam `undefined`, causando erro 400 no Facebook.

**Causa:** Os dados podem não estar chegando no formato esperado ou as variáveis não estão acessando os dados corretos.

---

## 🔍 DIAGNÓSTICO

### **No Preview Mode → Dados do evento:**

Verificar a estrutura completa dos dados do evento que chegam no GTM Server-Side.

**Pergunta:** Os dados estão assim?

```javascript
{
  0: {
    event: 'purchase',
    ecommerce: {
      value: 39.9,
      currency: 'BRL',
      transaction_id: '...'
    },
    user_data: {
      email_address: '...',
      first_name: '...',
      ...
    },
    content_ids: [...],
    ...
  }
}
```

**OU estão assim?**

```javascript
{
  event: 'purchase',
  ecommerce: {
    value: 39.9,
    currency: 'BRL',
    transaction_id: '...'
  },
  user_data: {
    email_address: '...',
    first_name: '...',
    ...
  },
  content_ids: [...],
  ...
}
```

---

## ✅ SOLUÇÕES POSSÍVEIS

### **Solução 1: Dados estão no índice `[0]`**

Se os dados estão em `0: { event: 'purchase', ... }`, os paths das variáveis precisam acessar `[0]` primeiro.

**Exemplo:**
- Path atual: `ecommerce.value`
- Path correto: `0.ecommerce.value` ou ajustar estrutura

### **Solução 2: Verificar se variáveis foram criadas**

No GTM Server-Side → **Variáveis**, verificar se todas as variáveis Event Data foram criadas:

- [ ] `ed - ecommerce.value` existe?
- [ ] `ed - ecommerce.currency` existe?
- [ ] `ed - ecommerce.transaction_id` existe?
- [ ] `ed - user_data.email_address` existe?
- [ ] etc.

### **Solução 3: Verificar estrutura do payload**

O payload pode estar sendo enviado em formato diferente. Verificar no código:

**Arquivo:** `src/lib/offlineConversions.ts`
**Função:** `sendPurchaseToGTM()`

O payload está sendo enviado como array `[eventData]`, mas o GTM Server-Side pode estar processando diferente.

---

## 🔧 CORREÇÃO IMEDIATA

### **Passo 1: Verificar Estrutura dos Dados**

No Preview Mode → **Dados do evento**, copiar a estrutura completa e verificar:

1. Os dados estão no nível raiz ou dentro de um índice?
2. A estrutura está exatamente como esperado?

### **Passo 2: Ajustar Paths das Variáveis**

Se os dados estão em `0: { ... }`, ajustar paths:

**Antes:**
- Path: `ecommerce.value`

**Depois:**
- Path: `0.ecommerce.value` (se necessário)

### **Passo 3: Verificar se Variáveis Existem**

No GTM Server-Side → **Variáveis**, verificar se todas as variáveis Event Data foram criadas corretamente.

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### **1. Estrutura dos Dados:**
- [ ] Verificar estrutura completa no Preview Mode → **Dados do evento**
- [ ] Copiar estrutura e comparar com o esperado

### **2. Variáveis:**
- [ ] Todas as variáveis Event Data foram criadas?
- [ ] Paths estão corretos?
- [ ] Variáveis estão linkadas na tag "FB - Purchase"?

### **3. Payload:**
- [ ] Payload está sendo enviado como array `[eventData]`?
- [ ] Estrutura do `eventData` está correta?

---

## 🎯 PRÓXIMO PASSO

**Por favor, envie:**

1. **Screenshot ou texto completo** de "Dados do evento" no Preview Mode
2. **Lista de variáveis** criadas no GTM Server-Side (screenshot ou texto)
3. **Confirmação** se o payload está sendo enviado como array `[eventData]`

Com essas informações, posso identificar exatamente o problema e corrigir.

---

## 💡 DICA RÁPIDA

Se todas as variáveis estão `undefined`, o problema provavelmente é:

1. **Variáveis não foram criadas** → Criar todas as variáveis Event Data
2. **Paths incorretos** → Ajustar paths baseado na estrutura real dos dados
3. **Estrutura diferente** → Verificar estrutura real no Preview Mode

**Ação imediata:** Verificar "Dados do evento" no Preview Mode e comparar com os paths das variáveis.




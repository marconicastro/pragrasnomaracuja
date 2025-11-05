# 🚨 SOLUÇÃO URGENTE: Variáveis `undefined` - Erro 400

**Problema:** Todas as variáveis Event Data retornam `undefined`, causando erro 400 no Facebook.

**Causa provável:** O GTM Server-Side recebe o payload como array `[eventData]`, então os dados podem estar em `0: { ... }`.

---

## 🔍 DIAGNÓSTICO RÁPIDO

### **No Preview Mode → Dados do evento:**

Verificar se os dados estão assim:

```javascript
{
  0: {                          // ← ÍNDICE [0]
    event: 'purchase',
    ecommerce: {
      value: 39.9,
      currency: 'BRL',
      transaction_id: '...'
    },
    user_data: {
      email_address: '...',
      ...
    }
  }
}
```

**Se sim, os paths precisam acessar `[0]` primeiro!**

---

## ✅ SOLUÇÃO RÁPIDA

### **Opção 1: Ajustar Paths das Variáveis (Se dados estão em `[0]`)**

Se os dados estão em `0: { ... }`, ajustar paths:

**Antes:**
- Path: `ecommerce.value`
- Path: `user_data.email_address`

**Depois:**
- Path: `0.ecommerce.value`
- Path: `0.user_data.email_address`

---

### **Opção 2: Ajustar Código para Enviar Objeto Direto (Recomendado)**

Modificar o código para enviar objeto direto ao invés de array:

**Arquivo:** `src/lib/offlineConversions.ts`
**Função:** `sendPurchaseToGTM()`

**Antes:**
```typescript
const payload = [eventData];
body: JSON.stringify(payload)
```

**Depois:**
```typescript
const payload = eventData;  // Objeto direto, não array
body: JSON.stringify(payload)
```

**OU** verificar se o GTM Server-Side aceita array e ajustar paths.

---

## 🔧 CORREÇÃO IMEDIATA

### **Passo 1: Verificar Estrutura Real**

No Preview Mode → **Dados do evento**, copiar a estrutura completa.

**Pergunta:** Os dados começam com `0: { ... }` ou `event: 'purchase'` diretamente?

### **Passo 2: Ajustar Paths OU Código**

**Se dados estão em `[0]`:**
- Ajustar paths das variáveis para `0.ecommerce.value`, etc.

**Se dados estão no nível raiz:**
- Verificar se variáveis foram criadas corretamente
- Verificar se paths estão exatos

### **Passo 3: Testar**

Após ajustar, testar novamente e verificar se variáveis têm valores.

---

## 📋 CHECKLIST RÁPIDO

### **Verificação Imediata:**
- [ ] No Preview Mode → **Dados do evento** → Copiar estrutura completa
- [ ] Verificar se dados estão em `0: { ... }` ou nível raiz
- [ ] Verificar se todas as variáveis Event Data foram criadas
- [ ] Verificar paths das variáveis

### **Ação:**
- [ ] Se dados em `[0]` → Ajustar paths para `0.ecommerce.value`, etc.
- [ ] Se dados no nível raiz → Verificar criação das variáveis
- [ ] Testar novamente

---

## 🎯 PRÓXIMO PASSO

**Envie a estrutura completa de "Dados do evento" do Preview Mode.**

Com isso, posso:
1. Identificar exatamente onde os dados estão
2. Ajustar os paths corretamente
3. Ou ajustar o código para enviar no formato correto

---

## 💡 HYPOTHESIS

**Provável causa:** O GTM Server-Side está processando o array `[eventData]` e colocando os dados em `0: { ... }`, então os paths precisam ser `0.ecommerce.value` ao invés de `ecommerce.value`.

**Solução rápida:** Verificar estrutura real e ajustar paths OU ajustar código para enviar objeto direto.




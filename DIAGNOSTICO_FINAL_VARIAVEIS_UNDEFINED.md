# 🔍 DIAGNÓSTICO FINAL: Por que Variáveis Retornam Undefined

## 🎯 **PROBLEMA REAL**

Os dados **CHEGAM** no GTM Server-Side (confirmado pelos "Dados do evento"), mas as variáveis Event Data retornam `undefined`.

### **Dados que CHEGAM:**
- ✅ `currency: "BRL"` (nível raiz)
- ✅ `value: 39.9` (nível raiz)
- ✅ `content_ids: ["hacr962"]` (nível raiz)
- ✅ `email_address: "ana.silva@email.com"` (nível raiz)
- ✅ `user_data.address.city` (dentro de user_data.address)

### **Variáveis que retornam undefined:**
- ❌ `{{ed - currency}}` → path: `currency` (mas dados chegam!)
- ❌ `{{ed - value}}` → path: `value` (mas dados chegam!)
- ❌ `{{ed - content_name}}` → path: `content_name` (dados NÃO chegam)
- ❌ `{{ed - user_data.city}}` → path: `user_data.city` (mas dados estão em `user_data.address.city`)

---

## 🔍 **HIPÓTESE: GTM Server-Side Processa Dados Diferente**

O GTM Server-Side pode estar:
1. **Transformando a estrutura** antes de processar variáveis
2. **Filtrando campos** não reconhecidos
3. **Processando em momento diferente** (antes dos dados chegarem)

---

## ✅ **SOLUÇÃO ALTERNATIVA: Usar Data Layer Variables**

Se Event Data Variables não funcionam, podemos usar **Data Layer Variables** que leem diretamente do DataLayer do browser.

### **Criar Variáveis Data Layer (GTM Server-Side):**

1. **Criar `dlv - currency`:**
   - Tipo: **Data Layer Variable**
   - Nome da variável do Data Layer: `currency`
   - Tipo de valor: Texto

2. **Criar `dlv - value`:**
   - Tipo: **Data Layer Variable**
   - Nome da variável do Data Layer: `value`
   - Tipo de valor: Número

3. **Criar `dlv - content_name`:**
   - Tipo: **Data Layer Variable**
   - Nome da variável do Data Layer: `content_name`
   - Tipo de valor: Texto

4. **Criar `dlv - content_type`:**
   - Tipo: **Data Layer Variable**
   - Nome da variável do Data Layer: `content_type`
   - Tipo de valor: Texto

5. **Criar `dlv - user_data.address.city`:**
   - Tipo: **Data Layer Variable**
   - Nome da variável do Data Layer: `user_data.address.city`
   - Tipo de valor: Texto

**E assim por diante...**

---

## 🎯 **AÇÃO IMEDIATA**

**Teste esta solução:**

1. Criar variável Data Layer `dlv - currency` com path `currency`
2. Atualizar tag FB - InitiateCheckout para usar `{{dlv - currency}}` ao invés de `{{ed - currency}}`
3. Testar se funciona

**Se funcionar:** Criar todas as variáveis como Data Layer Variables ao invés de Event Data Variables.

**Se não funcionar:** O problema é mais profundo e precisa investigar como o Stape.io processa os dados.

---

**Status:** 🔍 **TESTANDO SOLUÇÃO ALTERNATIVA**


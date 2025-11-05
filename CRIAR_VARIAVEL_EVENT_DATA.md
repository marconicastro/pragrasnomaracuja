# ✅ CRIAR: Variável Event Data para Acessar `event`

**Problema:** Variáveis "Dados do evento" aparecem como `undefined` porque não há variável configurada para acessar o campo `event`.

---

## 📋 PASSO A PASSO

### **1. Criar Variável Event Data**

1. **GTM Server-Side → Variáveis → Novo**
2. **Configurar:**
   - **Nome:** `ed - event`
   - **Tipo:** Event Data Variable
   - **Variable Name:** `event`
   - **Salvar**

---

### **2. Verificar no Stream**

Após criar a variável:
1. **Abrir evento no stream**
2. **Ir em "Variáveis"**
3. **Procurar por `{{ed - event}}`**
4. **Deve aparecer com valor `"purchase"`**

---

### **3. Ajustar Trigger**

1. **GTM Server-Side → Triggers → "dc - purchase"**
2. **Verificar configuração:**
   - Nome do evento: `Data` ✅
   - Filtro:
     - Campo: `{{ed - event}}` (Event Data Variable)
     - Operador: `igual a`
     - Valor: `purchase`
3. **Salvar**

---

### **4. Verificar Tags**

1. **GTM Server-Side → Tags → "FB - Purchase"**
2. **Verificar se trigger está vinculado**
3. **Verificar se tag está ativa**

---

## 🔍 VERIFICAÇÃO

### **No Stream:**
- ✅ Evento aparece
- ✅ Client Name = "Data Client"
- ✅ `event: "purchase"` nos dados
- ⏳ Variável `{{ed - event}}` deve aparecer com valor `"purchase"` (após criar)

---

## ⚠️ IMPORTANTE

**Use Event Data Variable, NÃO Data Layer Variable:**
- ✅ Event Data Variable (`ed - event`) → Acessa dados do evento diretamente
- ❌ Data Layer Variable (`dlv - event`) → Acessa `window.dataLayer` (não funciona para webhooks)

---

**Status**: Criar variável Event Data `ed - event` e ajustar trigger





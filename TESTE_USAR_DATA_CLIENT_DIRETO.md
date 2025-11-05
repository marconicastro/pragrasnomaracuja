# 🧪 TESTE: Usar Data Client Direto

**Objetivo:** Excluir "Webhook Client" e usar apenas "Data Client" para processar webhooks.

---

## 📋 PASSO A PASSO

### **1. Excluir "Webhook Client"**

1. **GTM Server-Side → Clients**
2. **Abrir "Webhook Client"**
3. **Deletar** (ou desativar)
4. **Salvar**

---

### **2. Verificar "Data Client"**

1. **GTM Server-Side → Clients → "Data Client"**
2. **Verificar "Accepted Path Settings":**
   - Deve ter apenas `/data` (ou vazio)
   - **Remover `/webhook` se ainda estiver lá**
3. **Salvar**

---

### **3. Verificar Trigger**

1. **GTM Server-Side → Triggers → "dc - purchase"**
2. **Verificar configuração:**
   - Nome do evento: `Data` ✅
   - Filtro: `Event Name = purchase` ✅
   - **Filtro Client Name:** Remover ou deixar como está
3. **Salvar**

---

### **4. Código Atualizado**

**Código já foi atualizado para:**
- Endpoint: `/data` (ao invés de `/webhook`)
- Client Name: `Data Client` (ao invés de `Webhook Client`)

---

### **5. Publicar e Testar**

1. **Publicar workspace no GTM**
2. **Testar webhook via ReqBin**
3. **Verificar no stream:**
   - Client Name deve ser `Data Client`
   - Evento deve aparecer
   - Tags devem disparar

---

## 🔍 VANTAGENS

- ✅ **Mais simples:** Usa apenas um Client
- ✅ **Sem conflito:** Data Client processa tudo
- ✅ **Menos configuração:** Não precisa gerenciar dois Clients

---

## ⚠️ OBSERVAÇÕES

- Se o "Data Client" não aceitar eventos server-side, pode não funcionar
- Mas vale testar para ver se funciona

---

**Status**: Código atualizado, aguardando exclusão do "Webhook Client" e teste





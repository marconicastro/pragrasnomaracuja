# 🔧 SOLUÇÃO: Data Client Reivindicando /webhook

**Problema:** O "Data Client" também tem `/webhook` em "Accepted Path Settings", causando conflito.

---

## ⚠️ PROBLEMA IDENTIFICADO

### **Situação Atual:**
- ❌ "Data Client" tem `/webhook` em "Accepted Path Settings"
- ❌ Evento está sendo processado pelo "Data Client" (não pelo "Webhook Client")
- ❌ Tags não disparam porque triggers não estão configurados para "Data Client"

---

## ✅ SOLUÇÃO

### **Opção 1: Remover /webhook do Data Client (RECOMENDADO)**

1. **No GTM Server-Side, abrir "Data Client"**
2. **Ir em Configurações → "Accepted Path Settings"**
3. **Remover `/webhook`** (deixar apenas `/data`)
4. **Salvar e publicar**

### **Opção 2: Usar Path Mais Específico**

Se o "Data Client" precisa manter `/webhook` por algum motivo, usar um path mais específico:

1. **No "Webhook Client", usar path:** `/webhook/purchase` ou `/webhook/cakto`
2. **Atualizar código para usar esse path**
3. **Configurar "Webhook Client" com esse path específico**

### **Opção 3: Aumentar Prioridade do Webhook Client**

1. **No "Webhook Client", aumentar Prioridade para valor maior que "Data Client"**
2. **Exemplo:** Se "Data Client" tem prioridade 0, colocar "Webhook Client" com prioridade 1 ou maior

---

## 🎯 RECOMENDAÇÃO

**Opção 1 é a melhor solução:**
- Remove conflito completamente
- Mantém separação clara entre browser events (`/data`) e webhook events (`/webhook`)
- Não depende de prioridade

---

## 📝 PASSOS PARA CORRIGIR

1. ✅ **Abrir "Data Client" no GTM Server-Side**
2. ✅ **Remover `/webhook` de "Accepted Path Settings"** (deixar apenas `/data`)
3. ✅ **Salvar e publicar**
4. ✅ **Verificar "Webhook Client" tem `/webhook` configurado**
5. ✅ **Testar webhook novamente**

---

## 🔍 VERIFICAÇÃO

Após corrigir:
- Evento deve ser processado por **"Webhook Client"** (não "Data Client")
- Client Name deve ser **"Webhook Client"**
- Tags devem disparar

---

**Status**: Aguardando remoção de `/webhook` do "Data Client"





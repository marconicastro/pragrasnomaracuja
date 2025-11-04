# 🔍 DIAGNÓSTICO: Evento Roteado para Data Client

**Situação:** Evento chegou ao GTM Server-Side, mas foi roteado para "Data Client" ao invés de "Webhook Client", e nenhuma tag disparou.

---

## 📊 O QUE ESTÁ ACONTECENDO

### **✅ Evento Recebido:**
- ✅ Evento `purchase` chegou ao GTM Server-Side
- ✅ Dados completos e corretos
- ✅ `client_name = "Webhook Client"` (nos dados do evento)

### **⚠️ Problema Identificado:**
- ⚠️ Evento foi roteado para **"Data Client"** (não para "Webhook Client")
- ⚠️ `event_name = "Data"` (não "purchase")
- ⚠️ **Nenhuma tag disparou** (0 solicitações HTTP)

---

## 🔍 POR QUE FOI PARA "DATA CLIENT"?

### **Causa Provável:**
O endpoint `/data` está sendo reivindicado pelo "Data Client" porque:
1. **Prioridade**: "Data Client" pode ter prioridade maior que "Webhook Client"
2. **Path Matching**: Ambos os clients têm `/data` em "Accepted Path Settings"
3. **Roteamento**: GTM Server-Side roteou para o primeiro client que corresponde ao path

---

## 🔧 SOLUÇÕES

### **Solução 1: Aumentar Prioridade do "Webhook Client" (RECOMENDADO)**

1. No GTM Server-Side, abra o **"Webhook Client"**
2. Vá em **Configurações**
3. Aumente a **Prioridade** para um valor maior que o "Data Client"
   - Exemplo: Se "Data Client" tem prioridade 0, coloque "Webhook Client" com prioridade **1 ou maior**
4. Salve e publique

### **Solução 2: Usar Path Específico para Webhook**

1. No "Webhook Client", adicione um path específico:
   - Exemplo: `/webhook` ou `/webhook/data`
2. Atualizar o código para usar esse path:
   ```typescript
   const gtmEndpoint = `${gtmServerUrl}/webhook/data?client_name=${encodeURIComponent(clientName)}`;
   ```

### **Solução 3: Ajustar Triggers para Aceitar "Data Client" (TEMPORÁRIO)**

Se o evento está sendo roteado para "Data Client", podemos ajustar os triggers para aceitar eventos do "Data Client" também:

1. **Trigger "FB - Purchase":**
   - Atualizar filtro: "Client Name contém Data Client OU Webhook Client"

2. **Trigger "GA4 - All Events":**
   - Atualizar filtro: "Client Name contém Data Client OU Webhook Client"

---

## 🎯 RECOMENDAÇÃO

### **Opção A: Aumentar Prioridade (MELHOR)**
- Aumentar prioridade do "Webhook Client" para garantir que ele processe eventos do webhook
- Manter separação clara entre browser events (Data Client) e webhook events (Webhook Client)

### **Opção B: Ajustar Triggers (TEMPORÁRIO)**
- Ajustar triggers para aceitar eventos do "Data Client" também
- Funciona, mas mistura browser events com webhook events

---

## 📝 PRÓXIMOS PASSOS

1. **Aumentar prioridade do "Webhook Client"** (recomendado)
2. **OU ajustar triggers** para aceitar "Data Client" também (temporário)
3. **Testar webhook novamente**
4. **Verificar se tags disparam**

---

**Status**: Evento chegou, mas precisa ajustar roteamento ou triggers


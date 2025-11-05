# ✅ CORREÇÃO: Filtro de Client Name no Trigger

**Problema identificado:**
- ✅ Trigger configurado com `event_name = "Data"` ✅
- ✅ Filtro `Event Name = "purchase"` ✅
- ❌ **Filtro "Client Name contém Data Client"** → BLOQUEANDO!
- ❌ Evento vem com `Client Name = "Webhook Client"` → não passa no filtro!

---

## 🔍 PROBLEMA

### **Configuração atual do trigger:**
- Nome do evento: `Data` ✅
- Filtro 1: `Client Name contém Data Client` ❌ **ERRADO!**
- Filtro 2: `Event Name = purchase` ✅

### **O que acontece:**
- Evento chega com `Client Name = "Webhook Client"`
- Filtro verifica: `Client Name contém Data Client` → ❌ FALHA!
- Trigger não dispara → Tags não disparam!

---

## ✅ SOLUÇÃO

### **Ajustar filtro de Client Name:**

**Opção 1: Remover filtro de Client Name (RECOMENDADO)**
- Remover o filtro "Client Name contém Data Client"
- Deixar apenas o filtro "Event Name = purchase"
- Assim, dispara para qualquer Client que tenha evento `purchase`

**Opção 2: Mudar filtro para "Webhook Client"**
- Mudar filtro para: `Client Name contém Webhook Client`
- Mas isso limita apenas a webhook (pode ser o desejado)

**Opção 3: Aceitar ambos os Clients**
- Mudar filtro para: `Client Name contém Data Client OU Webhook Client`
- Ou usar regex: `(Data Client|Webhook Client)`

---

## 🎯 RECOMENDAÇÃO

**Opção 1 é a melhor:**
- Remove o bloqueio
- Funciona para browser events (Data Client) e webhook (Webhook Client)
- Mais flexível

---

## 📝 PASSOS PARA CORRIGIR

1. ✅ **Abrir GTM Server-Side → Triggers → "dc - purchase"**
2. ✅ **Remover filtro:**
   - `Client Name contém Data Client` → **DELETAR**
3. ✅ **Manter filtro:**
   - `Event Name = purchase` ✅
4. ✅ **Salvar e publicar**
5. ✅ **Testar webhook novamente**

---

## 🔍 VERIFICAÇÃO APÓS CORRIGIR

Após remover o filtro de Client Name:
1. ✅ Testar webhook via ReqBin
2. ✅ Verificar no stream:
   - `event_name = "Data"` ✅
   - `event = "purchase"` ✅
   - `Client Name = "Webhook Client"` ✅
3. ✅ Verificar se tags disparam:
   - FB - Purchase deve disparar ✅
   - GA4 - All Events deve disparar ✅

---

**Status**: Problema identificado! Remover filtro "Client Name contém Data Client"





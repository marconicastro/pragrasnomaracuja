# ✅ Atualização: Path do Webhook Alterado para /webhook

**Alteração:** Endpoint do webhook mudou de `/data` para `/webhook` para evitar conflito com Data Client.

---

## 📝 O QUE FOI ALTERADO

### **Código Atualizado:**
- **Arquivo:** `src/lib/offlineConversions.ts`
- **Função:** `sendPurchaseToGTM()`
- **Endpoint antigo:** `https://event.maracujazeropragas.com/data?client_name=Webhook%20Client`
- **Endpoint novo:** `https://event.maracujazeropragas.com/webhook?client_name=Webhook%20Client`

---

## ⚙️ CONFIGURAÇÃO NO GTM SERVER-SIDE

### **Configurar "Webhook Client":**
1. Abrir "Webhook Client" no GTM Server-Side
2. Ir em **Configurações**
3. Em **"Accepted Path Settings"**, adicionar:
   - `/webhook`
4. **Remover** `/data` (se estiver lá)
5. Salvar e publicar

---

## ✅ VANTAGENS

- ✅ **Sem conflito**: Data Client processa `/data`, Webhook Client processa `/webhook`
- ✅ **Separação clara**: Browser events vs Webhook events
- ✅ **Prioridade não importa**: Cada client tem seu próprio path

---

## 🧪 TESTE

Após configurar o path `/webhook` no "Webhook Client":
1. Testar webhook novamente via ReqBin
2. Verificar se evento aparece no stream com Client Name = "Webhook Client"
3. Verificar se tags disparam

---

**Status**: ✅ Código atualizado, aguardando configuração no GTM Server-Side


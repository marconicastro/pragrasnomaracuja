# 🚨 Problema Crítico: CAPIG Recebe Eventos Mas Não Envia para Meta

**Data:** $(date)  
**Status:** ❌ Eventos recebidos (7 tipos) mas 0 enviados

---

## 🔍 ANÁLISE DO PROBLEMA

### **Status Atual:**
- ✅ CAPIG recebe eventos: **7 tipos detectados**
- ❌ CAPIG envia eventos: **0 enviados para Meta**
- ❌ Resultado: Eventos chegam na CAPIG mas não são publicados

### **Causa Provável:**
A CAPIG está recebendo os eventos do browser (server_event_uri funcionando), mas **não está conseguindo enviar para Meta** porque:

1. **Pixel ID não está conectado na CAPIG**
2. **Access Token ausente ou incorreto na CAPIG**
3. **Connection não configurada no Stape Dashboard**
4. **URL pode precisar de path `/events`**

---

## ✅ SOLUÇÃO 1: Verificar Conexão no Stape Dashboard

### **Passo a Passo:**

1. **Acessar Stape Dashboard:**
   ```
   https://tagmanager.stape.io
   ```

2. **Ir para seu Container:**
   - Containers → Seu container (nome do CAPIG)

3. **Verificar Connections:**
   - Settings → Connections
   - Deve ter: **Facebook Pixel** ou **Meta Pixel**
   - Status: **Connected** ✅

4. **Se NÃO tiver conexão:**
   ```
   1. Add Connection
   2. Facebook Pixel (ou Meta Pixel)
   3. OAuth (recomendado) ou Access Token
   4. Autorizar com Meta Business Manager
   5. Selecionar Pixel: 1403975024017865
   6. Save
   ```

5. **Verificar Access Token:**
   - Deve estar configurado na conexão
   - Token: `EAAUsqHMv8GcBPZBd4a9KcWdYkRKSxcyIHYCKAoN6Xw8OCnXVe2t87dIyqminQxQk8uDya87G5eNd2SvvPgmha3OZC9TlMWAODOL4PiV5FZAtng4bANQMOPBnXWwfwR1WdNHVPH0rN8hlf43zB5ErnnLmmzm4MU6ls8ZAgBuKMEHBEcIV9Xxp4HbUGuszOgZDZD`

---

## ✅ SOLUÇÃO 2: Verificar URL da CAPIG

### **Possíveis Formatos:**

A URL pode precisar terminar com `/events`:

**Opção 1 (Atual):**
```
https://capigateway.maracujazeropragas.com
```

**Opção 2 (Com path):**
```
https://capigateway.maracujazeropragas.com/events
```

**Como verificar:**
1. No Stape Dashboard → Container Settings
2. Ver qual é a URL exata do endpoint
3. Atualizar no código se necessário

---

## ✅ SOLUÇÃO 3: Verificar Configuração no Código

### **URL pode precisar ser ajustada:**

Se a URL no Stape Dashboard termina com `/events`, atualize:

```typescript
stapeContainerUrl = 'https://capigateway.maracujazeropragas.com/events'
```

---

## 🧪 DIAGNÓSTICO COMPLETO

### **1. Verificar Console do Navegador:**

```javascript
// Verificar configuração:
_fbq.getState().pixels['1403975024017865']

// Deveria mostrar:
// {
//   server_event_uri: "https://capigateway.maracujazeropragas.com",
//   agent: "stape",
//   autoConfig: false
// }
```

### **2. Verificar Network Tab:**

Filtrar por: `capigateway`

Deveria ver requests para:
- `https://capigateway.maracujazeropragas.com/events` (ou sem /events)
- Status: 200 OK

### **3. Verificar Stape Dashboard:**

- **Events Tab:** Deve mostrar eventos recebidos
- **Connections:** Deve ter Facebook Pixel conectado
- **Pixel ID:** Deve ser `1403975024017865`
- **Status:** Deve estar "Active" ou "Connected"

---

## ⚠️ POSSÍVEIS PROBLEMAS

### **1. Pixel ID Incorreto na CAPIG**
- ❌ CAPIG configurado com pixel antigo
- ✅ Deve ser: `1403975024017865`

### **2. Access Token Ausente/Inválido**
- ❌ Token não configurado na CAPIG
- ✅ Token deve estar na connection do Stape

### **3. URL Incorreta**
- ❌ URL sem path `/events`
- ✅ Pode precisar terminar com `/events`

### **4. Connection Não Autorizada**
- ❌ Connection sem OAuth/autorização
- ✅ Deve autorizar com Meta Business Manager

---

## 🔧 AÇÕES IMEDIATAS

### **PRIORIDADE ALTA:**

1. ✅ **Verificar Stape Dashboard:**
   - Connections → Facebook Pixel existe?
   - Pixel ID: `1403975024017865`?
   - Status: Connected?

2. ✅ **Verificar URL no Stape:**
   - Qual é a URL exata do endpoint?
   - Precisa `/events` no final?

3. ✅ **Testar no Console:**
   - Ver se `server_event_uri` está configurado
   - Ver requests no Network tab

---

## 📊 FLUXO ESPERADO

```
1. Browser → window.fbq() dispara evento
   ↓
2. Meta Pixel → Envia via browser
   ↓
3. CAPIG → Intercepta via server_event_uri ✅ (FUNCIONANDO - eventos chegam)
   ↓
4. CAPIG → Verifica Connection (Pixel + Token) ❌ (PROBLEMA AQUI)
   ↓
5. CAPIG → Envia para Meta CAPI ❌ (NÃO ENVIA - 0 sent)
```

---

## ✅ CHECKLIST DE RESOLUÇÃO

- [ ] Verificar Stape Dashboard - Connections
- [ ] Verificar Pixel ID na CAPIG (deve ser 1403975024017865)
- [ ] Verificar Access Token na CAPIG
- [ ] Verificar URL do endpoint (pode precisar /events)
- [ ] Testar no console do navegador
- [ ] Verificar Network tab (requests para CAPIG)
- [ ] Aguardar 10-15 minutos após correção
- [ ] Verificar novamente no Meta Events Manager

---

**AÇÃO IMEDIATA: Verificar Stape Dashboard - Connections é o mais crítico!**


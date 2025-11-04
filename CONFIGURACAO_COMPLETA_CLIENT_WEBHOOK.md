# ✅ CONFIGURAÇÃO COMPLETA: Client para Webhook no GTM Server-Side

**Objetivo:** Criar Client específico para processar eventos de webhook com path correto

---

## 📋 PASSO A PASSO COMPLETO

### **1. Criar Client no GTM Server-Side**

1. **Acessar GTM Server-Side:**
   - Abrir GTM Server-Side Container
   - Ir em **Clients** (menu lateral)

2. **Criar Novo Client:**
   - Clicar em **"New"** ou **"+"**
   - **Nome:** `Webhook Client`
   - **Tipo:** `Custom Client` (ou `HTTP Client`)

---

### **2. Configurar Accepted Path Settings**

**IMPORTANTE:** Esta é a configuração crítica!

1. **Ir em "Accepted Path Settings"**
2. **Adicionar path:**
   - **Path:** `/data`
   - **Tipo:** `Additional paths` (ou "Additional paths that will be claimed by this client")
3. **Salvar**

**Exemplo:**
```
Accepted Path Settings
Type additional paths that will be claimed by this client

Path: /data
```

---

### **3. Configurar Ingestion Settings**

- **Ingestion Method:** `HTTP POST`
- **Accept Server-Side Events:** ✅ Sim
- **Content-Type:** `application/json`

---

### **4. Configurar Processamento**

- **Process Events:** ✅ Sim
- **Variables:** Habilitar Event Data Variables (`ed - *`)
- **Pass to Data Client:** Opcional

---

### **5. Salvar e Publicar**

- Salvar Client
- Publicar container (ou testar em Preview Mode)

---

## 🔧 CONFIGURAÇÃO NO CÓDIGO

### **Código já está configurado:**
```typescript
const clientName = process.env.GTM_WEBHOOK_CLIENT_NAME || 'Data Client';
const gtmEndpoint = `${gtmServerUrl}/data?client_name=${encodeURIComponent(clientName)}`;
```

**Endpoint:** `https://event.maracujazeropragas.com/data?client_name=Webhook Client`

---

## ✅ VERIFICAÇÃO

### **Após configurar:**
1. ✅ Client criado com nome "Webhook Client"
2. ✅ Path `/data` adicionado em "Accepted Path Settings"
3. ✅ Ingestion configurado para aceitar server-side events
4. ✅ Testar webhook via ReqBin
5. ✅ Verificar no GTM Preview Mode se evento aparece no stream
6. ✅ Verificar se tags disparam

---

## 📊 ESTRUTURA FINAL

### **URL do Endpoint:**
```
https://event.maracujazeropragas.com/data?client_name=Webhook Client
```

### **Formato do Payload:**
```json
[
  {
    "event": "purchase",
    "ecommerce": {...},
    "user_data": {...}
  }
]
```

---

## 🎯 RESULTADO ESPERADO

**Após configurar corretamente:**
1. ✅ Webhook envia para `/data?client_name=Webhook Client`
2. ✅ GTM Server-Side recebe no Client "Webhook Client"
3. ✅ Client processa evento
4. ✅ Trigger `ce - purchase` detecta
5. ✅ Tags FB - Purchase e GA4 - All Events disparam
6. ✅ Purchase aparece no Meta e GA4

---

## ⚠️ IMPORTANTE

**Se o path não estiver configurado:**
- ❌ GTM Server-Side não aceita requisições no path `/data`
- ❌ Evento não é processado
- ❌ Tags não disparam

**Solução:**
- ✅ Adicionar `/data` em "Accepted Path Settings" do Client
- ✅ Ou usar outro path e ajustar código

---

## 📝 NOTA

**Múltiplos Clients:**
- Cada Client pode ter paths diferentes
- Webhook Client deve ter path `/data`
- Data Client pode ter path padrão (geralmente não precisa configurar)


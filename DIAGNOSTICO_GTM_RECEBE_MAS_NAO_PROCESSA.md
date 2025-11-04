# 🔍 DIAGNÓSTICO: GTM Server-Side recebe evento mas não processa

**Situação:** Evento envia com sucesso (200 OK + unique_event_id), mas não aparece no stream e tags não disparam

---

## 📊 ANÁLISE DOS LOGS

### **✅ O que está funcionando:**
- ✅ Webhook recebe payload
- ✅ Envia para GTM Server-Side
- ✅ GTM Server-Side responde 200 OK
- ✅ GTM Server-Side retorna `unique_event_id` (confirma recebimento)

### **❌ O que não está funcionando:**
- ❌ Evento não aparece no stream do GTM Server-Side
- ❌ Tags não disparam
- ❌ Meta não recebe Purchase

---

## 🔍 PROBLEMA IDENTIFICADO

**O GTM Server-Side está recebendo o evento, mas não está processando!**

### **Possíveis causas:**

1. **Client "Data Client" não aceita eventos server-side diretos**
   - Data Client é para eventos do browser (via Data Tags)
   - Pode não aceitar POST direto em `/data` de fontes externas

2. **Client Name pode estar incorreto**
   - Está usando "Data Client" (padrão para browser)
   - Pode precisar de Client específico para webhook

3. **Formato pode estar correto, mas Client não processa**
   - GTM Server-Side recebe (200 OK)
   - Mas Client não roteia para tags

---

## ✅ SOLUÇÃO

### **Opção 1: Criar Client "Webhook Client" (Recomendado)**

**Criar Client específico para webhook:**
1. GTM Server-Side → Clients → New
2. Nome: `Webhook Client`
3. Tipo: Custom Client (ou HTTP Client)
4. Accepted Path Settings: Adicionar `/data`
5. Accept Server-Side Events: ✅ Sim

**Atualizar código:**
```typescript
const clientName = process.env.GTM_WEBHOOK_CLIENT_NAME || 'Webhook Client';
```

### **Opção 2: Verificar se Data Client aceita server-side**

**Verificar configuração do Data Client:**
- Ir em Data Client → Ingestion Settings
- Verificar se aceita "Server-Side Events"
- Se não aceitar, criar Client específico

### **Opção 3: Usar formato diferente**

**Pode precisar de formato específico para server-side:**
- Verificar documentação do GTM Server-Side
- Pode precisar de headers específicos
- Pode precisar de autenticação

---

## 📋 PRÓXIMOS PASSOS

1. ✅ **Verificar configuração do Data Client** - Aceita server-side events?
2. ⏳ **Criar Client "Webhook Client"** se Data Client não aceitar
3. ⏳ **Atualizar código** para usar "Webhook Client"
4. ⏳ **Testar novamente**
5. ⏳ **Verificar se evento aparece no stream**

---

## 🎯 RESULTADO ESPERADO

**Após criar Client específico:**
- ✅ Evento aparece no stream do GTM Server-Side
- ✅ Client "Webhook Client" processa evento
- ✅ Trigger `ce - purchase` detecta
- ✅ Tags FB - Purchase e GA4 - All Events disparam
- ✅ Purchase aparece no Meta

---

## 📝 CONCLUSÃO

**O problema é que:**
- GTM Server-Side **recebe** o evento (200 OK)
- Mas **não processa** porque Data Client pode não aceitar server-side events
- **Solução:** Criar Client específico "Webhook Client" para processar eventos do webhook


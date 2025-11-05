# 🔍 SOLUÇÃO: Webhook não aparece no Tag Assistant do Servidor

**Problema:** Evento enviado com sucesso (200 OK), mas não aparece no Tag Assistant do servidor quando testa via ReqBin.

---

## ⚠️ LIMITAÇÃO DO TAG ASSISTANT PARA WEBHOOKS

### **Por que não aparece no Tag Assistant?**
O **Tag Assistant (Preview Mode) do GTM Server-Side** funciona principalmente para eventos que vêm de um **browser** com sessão de preview ativa.

**Eventos de webhook server-side diretos:**
- ❌ Não têm sessão de preview ativa
- ❌ Não vêm de um browser
- ❌ Podem não aparecer no stream do Preview Mode

**Isso é NORMAL e não significa que o evento não está funcionando!**

---

## ✅ COMO VALIDAR SE ESTÁ FUNCIONANDO (SEM PREVIEW MODE)

### **1. Verificar Logs do Servidor (Vercel)**
Os logs já mostram que está funcionando:
- ✅ Resposta 200 OK
- ✅ `unique_event_id` retornado: `1762286394771_360199937`
- ✅ Isso indica que o GTM **recebeu e processou** o evento

### **2. Verificar no Meta Events Manager**
1. Acesse: https://business.facebook.com/events_manager2/
2. Vá em **Test Events** ou **Events Manager**
3. Procure por evento **Purchase** com `transaction_id = "TEST_ORDER_123"`
4. Se aparecer → **Tags dispararam!** ✅

### **3. Verificar no GA4 DebugView**
1. Acesse: https://analytics.google.com/
2. Vá em **Admin** → **DebugView**
3. Procure por evento **purchase** com `transaction_id = "TEST_ORDER_123"`
4. Se aparecer → **Tags dispararam!** ✅

### **4. Verificar Logs do GTM Server-Side (Stape)**
Se você tem acesso aos logs do Stape:
- Verificar se há requisições para Meta CAPI
- Verificar se há requisições para GA4
- Se houver → **Tags dispararam!** ✅

---

## 🔧 SOLUÇÃO: Usar Preview Mode com URL Específica

### **Opção 1: Ativar Preview Mode ANTES de enviar webhook**

1. **Abrir Tag Assistant do Server-Side:**
   - Acesse: https://tagassistant.google.com/
   - Conecte ao container Server-Side: `GTM-W4PGS3LR`
   - Anote o **Preview ID** (ex: `preview_id=1234567890`)

2. **Enviar webhook com Preview ID na URL:**
   ```
   https://event.maracujazeropragas.com/data?client_name=Webhook%20Client&preview_id=1234567890
   ```

3. **Verificar no stream:**
   - Evento deve aparecer agora no stream

### **Opção 2: Usar URL de Preview Específica**

Se o Tag Assistant fornecer uma URL de preview específica para server-side, use essa URL ao invés da URL padrão.

---

## 🎯 VALIDAÇÃO PRÁTICA (RECOMENDADO)

### **Teste 1: Verificar no Meta Events Manager**
```bash
# Enviar webhook via ReqBin
# Aguardar 1-2 minutos
# Verificar no Meta Events Manager se Purchase aparece
```

### **Teste 2: Verificar no GA4 DebugView**
```bash
# Enviar webhook via ReqBin
# Aguardar 1-2 minutos
# Verificar no GA4 DebugView se purchase aparece
```

### **Teste 3: Verificar Tags Disparadas (Logs do Stape)**
Se você tem acesso aos logs do Stape/GTM Server-Side:
- Verificar se há requisições HTTP para:
  - Meta CAPI (`graph.facebook.com`)
  - GA4 (`www.google-analytics.com`)

---

## 📊 STATUS ATUAL (Baseado nos Logs)

### **✅ O que está funcionando:**
- ✅ Webhook recebido e validado
- ✅ User data encontrado no Vercel KV
- ✅ Payload enviado para GTM Server-Side
- ✅ Resposta 200 OK do GTM Server-Side
- ✅ `unique_event_id` retornado (indica que foi processado)

### **❓ O que precisa ser validado:**
- ❓ Tags dispararam? → Verificar no Meta Events Manager
- ❓ Tags dispararam? → Verificar no GA4 DebugView
- ❓ Evento aparece no stream? → Pode não aparecer (normal para webhooks)

---

## 🔧 PRÓXIMOS PASSOS

### **1. Validar no Meta Events Manager (PRIMEIRO)**
- Enviar webhook
- Aguardar 1-2 minutos
- Verificar se Purchase aparece

### **2. Se não aparecer no Meta:**
- Verificar se a tag "FB - Purchase" está ativa
- Verificar se o trigger `ce - purchase` está correto
- Verificar se as variáveis estão mapeadas corretamente

### **3. Validar no GA4 DebugView**
- Enviar webhook
- Aguardar 1-2 minutos
- Verificar se purchase aparece

### **4. Se não aparecer no GA4:**
- Verificar se a tag "GA4 - All Events" está ativa
- Verificar se o trigger está correto
- Verificar se as variáveis estão mapeadas corretamente

---

## 📝 CONCLUSÃO

**O evento está sendo enviado corretamente!** 

O fato de não aparecer no Tag Assistant do servidor é uma **limitação do Preview Mode para webhooks server-side**, não um problema do código.

**Validação recomendada:**
1. ✅ Verificar no Meta Events Manager
2. ✅ Verificar no GA4 DebugView
3. ✅ Verificar logs do Stape (se disponível)

Se aparecer no Meta ou GA4 → **Está funcionando perfeitamente!** ✅

---

**Última atualização**: 2025-11-04 20:00:00
**Status**: ✅ Webhook funcionando, aguardando validação no Meta/GA4





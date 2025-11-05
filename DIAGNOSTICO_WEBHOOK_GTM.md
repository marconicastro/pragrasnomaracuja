# 🔍 DIAGNÓSTICO: Webhook não está usando GTM Server-Side

**Problema:** Logs mostram que está usando `sendOfflinePurchase()` (Meta CAPI direto) ao invés de `sendPurchaseToGTM()` (GTM Server-Side)

---

## 📊 ANÁLISE DOS LOGS

### **Logs atuais mostram:**
```
📤 Enviando Purchase via Meta CAPI direto (CAPIG não suporta server-side events)
✅ SUCCESS: Purchase enviado via Meta CAPI direto (funcionando 100%!)
```

**Isso indica que:**
- ❌ `sendPurchaseToGTM()` não está sendo chamada, OU
- ❌ `sendPurchaseToGTM()` está falhando e caindo no fallback

---

## ✅ VERIFICAÇÕES NECESSÁRIAS

### **1. Verificar se código foi deployado:**
- ✅ Código local está correto (chama `sendPurchaseToGTM()`)
- ⚠️ **Verificar se foi deployado na Vercel**

### **2. Verificar se função está sendo chamada:**
Adicionar log no início de `sendPurchaseToGTM()`:
```typescript
console.log('🚀 sendPurchaseToGTM() chamada!');
```

### **3. Verificar se GTM Server-Side está acessível:**
- URL: `https://event.maracujazeropragas.com/data`
- Verificar se endpoint está funcionando

---

## 🔧 SOLUÇÃO

### **Opção 1: Verificar deploy**
1. Fazer commit das mudanças
2. Push para o repositório
3. Verificar se Vercel fez deploy automático

### **Opção 2: Verificar logs**
Adicionar logs mais detalhados em `sendPurchaseToGTM()`:
```typescript
console.log('🚀 sendPurchaseToGTM() INICIADA');
console.log('📍 Endpoint:', gtmEndpoint);
console.log('📦 Event Data:', JSON.stringify(eventData, null, 2));
```

### **Opção 3: Verificar variável de ambiente**
- Verificar se `GTM_SERVER_URL` está configurada no `.env` da Vercel

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Verificar deploy** - Código foi deployado na Vercel?
2. ✅ **Adicionar logs** - Ver se `sendPurchaseToGTM()` está sendo chamada
3. ✅ **Testar endpoint** - Verificar se GTM Server-Side está acessível
4. ✅ **Verificar erro** - Se estiver falhando, ver qual é o erro

---

## 📝 LOGS ESPERADOS (quando funcionar)

```
📤 Enviando Purchase para GTM Server-Side: {
  endpoint: 'https://event.maracujazeropragas.com/data',
  orderId: 'TEST_ORDER_123',
  ...
}
✅ Purchase enviado para GTM Server-Side com sucesso: {
  orderId: 'TEST_ORDER_123',
  ...
}
```

**Se aparecer `🔄 Tentando fallback`**, significa que GTM Server-Side falhou.





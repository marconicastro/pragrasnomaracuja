# ✅ CORREÇÃO: Enviar Objeto Direto ao Invés de Array

**Problema:** Todas as variáveis Event Data retornavam `undefined` porque o GTM Server-Side processava o array `[eventData]` e colocava os dados em `0: { ... }`.

**Solução:** Modificar código para enviar objeto direto ao invés de array.

---

## 🔧 CORREÇÃO APLICADA

### **Arquivo:** `src/lib/offlineConversions.ts`
### **Função:** `sendPurchaseToGTM()`

### **Antes:**
```typescript
const payload = [eventData];  // Array
body: JSON.stringify(payload)
```

### **Depois:**
```typescript
const payload = eventData;  // Objeto direto
body: JSON.stringify(payload)
```

---

## 🎯 POR QUE ISSO RESOLVE

### **Problema:**
Quando o GTM Server-Side recebe um array `[eventData]`, ele processa e coloca os dados em:
```javascript
{
  0: {
    event: 'purchase',
    ecommerce: { ... },
    user_data: { ... }
  }
}
```

**Resultado:** Variáveis Event Data com path `ecommerce.value` não encontram os dados porque estão em `0.ecommerce.value`.

### **Solução:**
Enviando objeto direto `eventData`, os dados ficam no nível raiz:
```javascript
{
  event: 'purchase',
  ecommerce: { ... },
  user_data: { ... }
}
```

**Resultado:** Variáveis Event Data com path `ecommerce.value` encontram os dados corretamente! ✅

---

## 📋 PRÓXIMOS PASSOS

### **1. Fazer Deploy:**
```bash
git add src/lib/offlineConversions.ts
git commit -m "fix: enviar objeto direto ao invés de array para GTM Server-Side"
git push
```

### **2. Aguardar Deploy:**
- Aguardar deploy no Vercel
- Aguardar alguns minutos para propagação

### **3. Testar Novamente:**
1. Enviar evento via ReqBin (webhook)
2. Verificar no Preview Mode:
   - ✅ Variáveis Event Data têm valores (não mais `undefined`)
   - ✅ Tag "FB - Purchase" dispara
   - ✅ Payload enviado ao Meta tem todos os dados
   - ✅ Resposta do Meta é 200 OK (sem erro)

---

## ✅ RESULTADO ESPERADO

### **Antes:**
- ❌ Variáveis: `undefined`
- ❌ Erro: 400 no Facebook
- ❌ Payload: `custom_data` vazio

### **Depois:**
- ✅ Variáveis: valores corretos
- ✅ Status: 200 OK no Facebook
- ✅ Payload: `custom_data` completo com todos os dados

---

## 🎉 CONCLUSÃO

**Correção aplicada!** Agora o código envia objeto direto, permitindo que as variáveis Event Data acessem os dados corretamente no nível raiz.

**Próximo passo:** Fazer deploy e testar novamente! 🚀




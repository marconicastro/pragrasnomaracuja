# 🔍 PROBLEMA: Evento não aparece no stream do GTM Server-Side

**Sintoma:** Webhook envia com sucesso (200 OK), mas evento não aparece no stream e tags não disparam

---

## 🔍 POSSÍVEIS CAUSAS

### **1. Formato do payload incorreto**
- GTM Server-Side pode não estar reconhecendo o formato
- Pode precisar de formato específico para eventos server-side

### **2. Client Name incorreto**
- O Client Name pode não estar sendo processado corretamente
- Pode precisar estar no payload, não na URL

### **3. Endpoint incorreto**
- `/data` pode não aceitar eventos server-side diretos
- Pode precisar usar outro endpoint

### **4. Headers faltando**
- Pode precisar de headers específicos
- Pode precisar de autenticação

---

## ✅ VERIFICAÇÕES NECESSÁRIAS

### **1. Verificar no GTM Server-Side Preview Mode:**
- O evento aparece no stream?
- Qual é o formato do evento que aparece?
- Quais variáveis estão disponíveis?

### **2. Verificar logs do servidor:**
- O payload está sendo enviado corretamente?
- Qual é a resposta do GTM Server-Side?

### **3. Verificar formato do browser:**
- Como o browser envia eventos para o GTM Server-Side?
- Qual é a diferença entre eventos do browser e server-side?

---

## 🔧 SOLUÇÕES A TESTAR

### **Solução 1: Remover client_name da URL**
```typescript
// ❌ ANTES:
const gtmEndpoint = `${gtmServerUrl}/data?client_name=Data Client`;

// ✅ DEPOIS:
const gtmEndpoint = `${gtmServerUrl}/data`;
```

### **Solução 2: Adicionar client_name no payload**
```typescript
const eventData = {
  event: 'purchase',
  client_name: 'Data Client',  // Adicionar no payload
  // ... resto dos dados
};
```

### **Solução 3: Verificar se precisa de ID do container**
```typescript
const gtmEndpoint = `${gtmServerUrl}/data?id=GTM-W4PGS3LR`;
```

### **Solução 4: Usar formato Measurement Protocol**
GTM Server-Side pode precisar do formato GA4 Measurement Protocol para eventos server-side.

---

## 📋 PRÓXIMOS PASSOS

1. ✅ **Remover client_name da URL** (já corrigido)
2. ⏳ **Adicionar logs detalhados** do payload sendo enviado
3. ⏳ **Testar novamente** e verificar logs
4. ⏳ **Verificar no GTM Preview Mode** se evento aparece
5. ⏳ **Se não aparecer**, tentar outras soluções

---

## 🎯 DIAGNÓSTICO

**Para diagnosticar melhor:**
1. Verificar se o payload está sendo enviado corretamente (logs)
2. Verificar resposta do GTM Server-Side (status code, body)
3. Verificar se há erros no GTM Server-Side logs
4. Comparar com formato do browser

---

## 📝 NOTA

**GTM Server-Side pode ter limitações:**
- Eventos server-side diretos podem precisar de formato específico
- Pode precisar passar pelo Data Client de forma diferente
- Pode ser necessário usar outro método (ex: Custom Client)





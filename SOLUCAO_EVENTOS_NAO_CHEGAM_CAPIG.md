# 🔧 Solução: Eventos Não Chegam na CAPIG

**Data:** $(date)  
**Problema:** Eventos testados no Meta Events Manager não aparecem na CAPIG

---

## 🔍 PROBLEMA IDENTIFICADO

### **Status Anterior:**
- ❌ CAPIG estava **DESABILITADO** no `EliteMetaPixel.tsx`
- ❌ Linhas de configuração estavam comentadas
- ❌ Eventos iam direto para Meta Pixel (não passavam pela CAPIG)
- ❌ Resultado: 0 eventos recebidos na CAPIG

---

## ✅ SOLUÇÃO IMPLEMENTADA

### **1. CAPIG Habilitado no `EliteMetaPixel.tsx`**

**ANTES (desabilitado):**
```typescript
// window.fbq('set', 'autoConfig', false, pixelId);
// window.fbq('set', 'agent', 'stape');
// window.fbq('set', 'server_event_uri', stapeContainerUrl);
```

**AGORA (habilitado):**
```typescript
window.fbq('set', 'autoConfig', false, pixelId);
window.fbq('set', 'agent', 'stape', pixelId);
window.fbq('set', 'server_event_uri', stapeContainerUrl, pixelId);
```

### **2. Configuração Completa:**

```typescript
// ✅ CONFIGURAÇÃO STAPE CAPIG GATEWAY (HABILITADO)
// CRÍTICO: Passar pixelId em TODOS os 'set' commands!
window.fbq('set', 'autoConfig', false, pixelId);
window.fbq('set', 'agent', 'stape', pixelId);
window.fbq('set', 'server_event_uri', stapeContainerUrl, pixelId);
```

---

## 📋 CONFIGURAÇÃO CAPIG

### **URL Configurada:**
```
https://capigateway.maracujazeropragas.com
```

### **Pixel ID:**
```
1403975024017865
```

### **Verificar se URL está correta:**
- A URL deve apontar para o endpoint da CAPIG
- Verifique no Stape Dashboard qual é a URL correta
- Pode precisar terminar com `/events` ou apenas o domínio

---

## 🧪 COMO TESTAR

### **1. Verificar no Console do Navegador:**

Abra o console (F12) e execute:

```javascript
// Verificar se CAPIG está configurado:
_fbq.getState().pixels['1403975024017865']

// Deveria mostrar:
// {
//   server_event_uri: "https://capigateway.maracujazeropragas.com",
//   agent: "stape",
//   autoConfig: false
// }
```

### **2. Verificar Network Tab (F12):**

Após carregar a página, filtre por:
```
capigateway
```

Deveria ver requests para:
- ✅ `https://capigateway.maracujazeropragas.com/events`
- ✅ Status: 200 OK

### **3. Verificar Stape Dashboard:**

1. Acesse: `https://tagmanager.stape.io`
2. Containers → `nova_capig_maracuja` (ou nome do seu container)
3. Events (aba)
4. Deveria ver eventos chegando:
   - PageView
   - ViewContent
   - AddToCart
   - Lead
   - InitiateCheckout

---

## ⚠️ POSSÍVEIS PROBLEMAS

### **1. URL Incorreta**

Se a URL estiver errada, eventos não chegarão na CAPIG.

**Verificar no Stape Dashboard:**
- Qual é a URL exata do seu container?
- Precisa terminar com `/events`?

**Solução:**
Atualizar `stapeContainerUrl` no código se necessário.

### **2. CORS ou DNS**

Se houver problemas de CORS ou DNS:
- Verificar se domínio está configurado no Stape
- Verificar se DNS está apontando corretamente

### **3. Pixel ID Incorreto na CAPIG**

Verificar no Stape Dashboard:
- Connections → Facebook Pixel
- Pixel ID configurado: `1403975024017865`?

---

## 📊 FLUXO CORRETO

### **Com CAPIG Habilitado:**

```
1. Browser dispara evento (window.fbq)
   ↓
2. Meta Pixel envia via browser (tradicional)
   ↓
3. CAPIG intercepta (via server_event_uri)
   ↓
4. CAPIG envia para Meta CAPI
   ↓
5. Meta deduplica usando event_id
```

### **Resultado Esperado:**

- ✅ Eventos aparecem no Meta Events Manager
- ✅ Eventos aparecem na CAPIG Dashboard
- ✅ Total events received > 0 na CAPIG
- ✅ Total events sent > 0 na CAPIG

---

## ✅ CHECKLIST DE VERIFICAÇÃO

- [x] CAPIG habilitado no código
- [x] server_event_uri configurado
- [x] Pixel ID correto (1403975024017865)
- [ ] Verificar URL no console do navegador
- [ ] Verificar requests no Network tab
- [ ] Verificar Stape Dashboard
- [ ] Testar eventos novamente no Meta Events Manager

---

## 🔄 PRÓXIMOS PASSOS

1. **Fazer deploy** do código atualizado
2. **Aguardar 2-5 minutos** para propagação
3. **Testar eventos** novamente
4. **Verificar CAPIG Dashboard** se eventos estão chegando
5. **Verificar console do navegador** se server_event_uri está configurado

---

**FIM DO DOCUMENTO**


# 🐛 Debug: Eventos Não Chegam na CAPIG

**Data:** $(date)  
**Problema:** Eventos detectados (7 tipos) mas 0 enviados para Meta

---

## 🔍 ANÁLISE DO PROBLEMA

### **Status:**
- ✅ CAPIG recebe eventos: **7 tipos detectados**
- ❌ CAPIG envia eventos: **0 enviados**
- ✅ Stape Dashboard: Pixel ativo, tudo OK

### **Causa Provável:**
Problema no código que impede eventos de serem enviados pela CAPIG para Meta.

---

## ✅ CORREÇÕES APLICADAS

### **1. Estrutura Igual ao MetaPixelStape (que funciona)**

Código agora usa exatamente a mesma estrutura do `MetaPixelStape.tsx`:

```typescript
window.fbq('init', pixelId);
window.fbq('set', 'autoConfig', false, pixelId);
window.fbq('set', 'agent', 'stape', pixelId);
window.fbq('set', 'server_event_uri', stapeContainerUrl, pixelId);
```

### **2. Ordem dos Comandos Corrigida**

A ordem é **CRÍTICA**:
1. `init` primeiro
2. `autoConfig: false` antes de agent
3. `agent: stape` antes de server_event_uri
4. `server_event_uri` por último

### **3. URL Sem /events**

URL configurada **SEM** `/events` no final:
```
https://capigateway.maracujazeropragas.com
```

Stape adiciona `/events` automaticamente quando necessário.

---

## 🧪 COMO VERIFICAR SE ESTÁ FUNCIONANDO

### **1. Console do Navegador (F12):**

```javascript
// Verificar configuração:
_fbq.getState().pixels['1403975024017865']

// Deveria mostrar:
// {
//   server_event_uri: "https://capigateway.maracujazeropragas.com",
//   agent: "stape",
//   autoConfig: false,
//   loaded: true
// }
```

### **2. Network Tab (F12):**

Filtrar por: `capigateway`

Deveria ver requests para:
- ✅ `https://capigateway.maracujazeropragas.com/events`
- ✅ Status: 200 OK
- ✅ Método: POST

### **3. Verificar Logs no Console:**

Deveria ver:
```
✅ ELITE Meta Pixel inicializado
📊 Tracking Mode: Dual (Browser + CAPIG)
📡 CAPIG URL: https://capigateway.maracujazeropragas.com
```

---

## ⚠️ POSSÍVEIS PROBLEMAS RESTANTES

### **1. Consentimento Bloqueando**

Se o consentimento não foi dado, eventos não são disparados.

**Verificar:**
- ConsentBanner foi aceito?
- `hasConsent('analytics')` retorna true?

### **2. Timing**

Se Meta Pixel não carregou a tempo, configuração pode falhar.

**Solução:** Código agora verifica `window.fbq.loaded` antes de configurar.

### **3. URL Incorreta**

Se Stape espera URL diferente.

**Verificar no Stape Dashboard:**
- Qual é a URL exata do endpoint?
- Precisa terminar com `/events`?

---

## 🔧 PRÓXIMOS PASSOS

1. **Fazer deploy** do código atualizado
2. **Aguardar 2-5 minutos** para propagação
3. **Testar no navegador:**
   - Abrir console (F12)
   - Verificar `_fbq.getState().pixels`
   - Verificar Network tab
4. **Aguardar 10-15 minutos**
5. **Verificar Meta Events Manager:**
   - Events received deve aumentar
   - Events sent deve aumentar

---

## ✅ CHECKLIST DE VERIFICAÇÃO

- [x] Código corrigido (estrutura igual ao MetaPixelStape)
- [x] Ordem dos comandos corretos
- [x] URL configurada corretamente
- [ ] Deploy realizado
- [ ] Console do navegador verificado
- [ ] Network tab verificado (requests para CAPIG)
- [ ] Aguardar 10-15 minutos
- [ ] Verificar Meta Events Manager

---

**FIM DO DOCUMENTO**


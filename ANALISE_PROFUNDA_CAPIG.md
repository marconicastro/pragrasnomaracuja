# 🔍 ANÁLISE PROFUNDA - FLUXO CAPIG COMPLETO

**Preocupação do cliente:** "CAPIG é o coração da operação!"  
**Análise:** LINHA POR LINHA de toda a cadeia

---

## 🧪 VERIFICAÇÃO: EliteMetaPixel.tsx

### **Código atual (linhas 92-115):**
```typescript
// Configurar Meta Pixel com Stape CAPIG
if (window.fbq) {
  window.fbq('init', pixelId);
  
  // CONFIGURAÇÃO STAPE CAPIG GATEWAY
  window.fbq('set', 'autoConfig', false, pixelId);
  window.fbq('set', 'agent', 'stape');
  window.fbq('set', 'server_event_uri', stapeContainerUrl);
  
  // Disparar PageView Elite
  trackPageViewElite();
}
```

### **⚠️ PROBLEMA POTENCIAL ENCONTRADO:**

**Ordem das configurações pode estar ERRADA!**

**Documentação oficial Meta Pixel + Stape:**
```typescript
// ORDEM CORRETA:
window.fbq('init', pixelId);
window.fbq('set', 'autoConfig', false, pixelId);  // ANTES de agent!
window.fbq('set', 'agent', 'stape', pixelId);     // ← PRECISA pixelId!
```

**Código atual:**
```typescript
window.fbq('set', 'agent', 'stape');              // ❌ SEM pixelId!
window.fbq('set', 'server_event_uri', stapeContainerUrl);  // ❌ SEM pixelId!
```

**Isso pode fazer CAPIG não interceptar eventos!**

---

## 🔍 VERIFICAÇÃO: trackEliteEvent

### **Código atual (linha 311):**
```typescript
window.fbq('track', eventName, finalParams, { eventID });
```

**Status:** ✅ CORRETO!

**MAS:** Se configuração CAPIG não foi aplicada, eventos vão direto para Meta (sem CAPIG)!

---

## 🚨 DIAGNÓSTICO:

### **Fluxo atual (SUSPEITO DE QUEBRADO):**
```
Browser → Meta Pixel inicializado
          ↓
          set('agent', 'stape') SEM pixelId ❌
          ↓
          Configuração pode NÃO aplicar!
          ↓
          Eventos disparam via window.fbq
          ↓
          ❌ CAPIG NÃO intercepta (config errada!)
          ↓
          ✅ Meta direto (funciona - mas sem CAPIG!)
```

### **Fluxo correto (ESPERADO):**
```
Browser → Meta Pixel inicializado
          ↓
          set('agent', 'stape', pixelId) ✅
          ↓
          Configuração aplicada!
          ↓
          Eventos disparam via window.fbq
          ↓
          ✅ CAPIG intercepta!
          ↓
          ✅ Dual tracking (browser + server)
          ↓
          ✅ IP/UA automáticos
```

---

## ✅ SOLUÇÃO PROPOSTA:

### **Corrigir EliteMetaPixel.tsx (linhas 92-100):**

**ANTES (atual - pode estar quebrado):**
```typescript
window.fbq('init', pixelId);
window.fbq('set', 'autoConfig', false, pixelId);
window.fbq('set', 'agent', 'stape');                          // ❌
window.fbq('set', 'server_event_uri', stapeContainerUrl);     // ❌
```

**DEPOIS (correto - documentação oficial):**
```typescript
window.fbq('init', pixelId);
window.fbq('set', 'autoConfig', false, pixelId);
window.fbq('set', 'agent', 'stape', pixelId);                 // ✅
window.fbq('set', 'server_event_uri', stapeContainerUrl, pixelId);  // ✅
```

---

## 🧪 TESTE PARA CONFIRMAR:

### **No browser (F12 → Console):**

```javascript
// Verificar configuração aplicada:
window._fbq.getState().pixels['642933108377475']

// Deveria retornar:
// {
//   agent: "stape",
//   autoConfig: false,
//   server_event_uri: "https://capigateway..."
// }

// Se NÃO tiver agent: "stape" → CONFIG QUEBRADA!
```

---

## 📋 OUTRAS VERIFICAÇÕES:

### **1. Layout.tsx usa EliteMetaPixel?**
Preciso verificar se está sendo carregado!

### **2. ConsentBanner bloqueando?**
Preciso verificar se consent está OK!

### **3. UTM tracking interferindo?**
Verificar se initUTMTracking não quebrou pixel!

---

**Aguarde análise completa...**

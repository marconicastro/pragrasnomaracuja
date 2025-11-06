# 🔍 DIAGNÓSTICO: Por que `fbc` não aparece no Purchase?

## ✅ **VERIFICAÇÃO: Código está correto!**

### **1. `fbc` é salvo quando Lead é gerado:**
```typescript
// src/app/api/save-tracking/route.ts (linha 75)
await saveUserTracking({
  email: normalizedEmail,
  fbp: metaCookies.fbp,
  fbc: metaCookies.fbc,  // ✅ Salvo aqui
  ...
});
```

### **2. `fbc` é buscado do KV quando Purchase acontece:**
```typescript
// src/lib/offlineConversions.ts (linha 287)
return {
  fbp: kvData.fbp,
  fbc: kvData.fbc,  // ✅ Buscado aqui
  ...
};
```

### **3. `fbc` é enviado no Purchase:**
```typescript
// src/lib/offlineConversions.ts (linha 475-509)
if (userData.fbc) {
  const sanitizedFbc = sanitizeFbc(userData.fbc);
  if (sanitizedFbc) {
    const fbcValidation = validateFbc(sanitizedFbc);
    if (fbcValidation.valid) {
      user_data.fbc = sanitizedFbc;  // ✅ Enviado aqui
    }
  }
}
```

---

## 🚨 **POSSÍVEIS CAUSAS**

### **Causa 1: `fbc` não foi capturado quando Lead foi gerado**

**Como verificar:**
1. Abrir console do navegador quando gerar Lead
2. Verificar se `metaCookies.fbc` existe:
```javascript
// No console do navegador
console.log('fbc:', document.cookie.match(/_fbc=([^;]+)/)?.[1]);
```

**Se `fbc` não existe:**
- Usuário não clicou em anúncio do Facebook
- Cookie `_fbc` não foi criado
- Cookie foi bloqueado (privacy settings)

---

### **Causa 2: `fbc` foi salvo mas não está no KV**

**Como verificar:**
1. Verificar logs quando Lead é gerado:
```
✅ User tracking salvo no Vercel KV: {
  email: 'user@example.com',
  hasFbp: true,
  hasFbc: false,  // ⚠️ Se false, fbc não foi salvo
  ...
}
```

**Se `hasFbc: false`:**
- `metaCookies.fbc` estava `undefined` quando Lead foi gerado
- Cookie não estava disponível no momento do Lead

---

### **Causa 3: `fbc` está expirado (validade de 24h)**

**Como verificar:**
1. Verificar logs quando Purchase acontece:
```
⚠️ fbc inválido detectado: fbc expired (outside 24h window)
🔍 DEBUG fbc: {
  fbcTimestamp: 1234567890,
  nowTimestamp: 1234567890,
  diffSeconds: 86401,  // ⚠️ Mais de 24h (86400 segundos)
  diffHours: '24.00h',
  fbcAge: '24.00h atrás',
  isValidWindow: false
}
```

**Se `fbc` está expirado:**
- Lead foi gerado há mais de 24h
- Purchase aconteceu depois da janela de validade
- Meta rejeita `fbc` expirado (não é enviado)

---

### **Causa 4: Email/Telefone não bate (normalização)**

**Como verificar:**
1. Verificar logs quando Purchase acontece:
```
⚠️ User data NÃO encontrado no KV: {
  email: 'USER@EXAMPLE.COM',  // ⚠️ Email diferente (case)
  phone: '11999999999'
}
```

**Se email não bate:**
- Email do Lead: `user@example.com` (lowercase)
- Email do Purchase: `USER@EXAMPLE.COM` (uppercase)
- Normalização pode não estar funcionando

**Solução:** Verificar se normalização está funcionando:
```typescript
// src/app/api/webhook-cakto/route.ts (linha 109)
const normalizedEmail = normalizeEmail(payload.data.customer.email);
// Deve converter para lowercase
```

---

## 🔧 **COMO DEBUGAR**

### **Passo 1: Verificar se `fbc` foi salvo no Lead**

**No console do navegador, quando gerar Lead:**
```javascript
// Verificar se fbc existe nos cookies
const fbc = document.cookie.match(/_fbc=([^;]+)/)?.[1];
console.log('fbc no cookie:', fbc);

// Verificar se foi enviado para /api/save-tracking
// Abrir Network tab → POST /api/save-tracking → Request Payload
// Verificar se "fbc" está no payload
```

---

### **Passo 2: Verificar se `fbc` está no KV**

**Adicionar log temporário em `getUserTracking`:**
```typescript
// src/lib/userTrackingStore.ts (linha 130)
if (userData) {
  console.log('✅ User data encontrado por EMAIL:', email);
  console.log('🔍 DEBUG fbc:', {
    hasFbc: !!userData.fbc,
    fbc: userData.fbc ? userData.fbc.substring(0, 40) + '...' : 'undefined',
    fbcLength: userData.fbc?.length || 0
  });
  return userData;
}
```

---

### **Passo 3: Verificar se `fbc` está sendo enviado no Purchase**

**Verificar logs quando Purchase acontece:**
```
✅ User data encontrado no Vercel KV: {
  email: 'user@example.com',
  hasFbp: true,
  hasFbc: true,  // ✅ Deve ser true
  ...
}
```

**Se `hasFbc: true` mas não aparece no payload:**
- Verificar validação do `fbc`:
```
✅ fbc válido, preservado exatamente e dentro da janela de 24h
🔍 fbc preview: fb.1.1234567890.IwAR2eX8Z7Y...
```

**Se aparecer:**
```
⚠️ fbc inválido detectado: fbc expired (outside 24h window)
```
→ `fbc` está expirado (mais de 24h)

---

## ✅ **SOLUÇÃO RÁPIDA**

### **1. Verificar se `fbc` existe quando Lead é gerado:**

**No frontend (`src/app/page.tsx`):**
```typescript
// Linha 340
fbc: metaCookies.fbc,  // Verificar se não está undefined
```

**Adicionar log:**
```typescript
console.log('🔍 DEBUG fbc antes de salvar:', {
  hasFbc: !!metaCookies.fbc,
  fbc: metaCookies.fbc ? metaCookies.fbc.substring(0, 40) + '...' : 'undefined'
});
```

---

### **2. Verificar se `fbc` está sendo recuperado do KV:**

**Adicionar log em `getUserDataFromKVOrPrisma`:**
```typescript
// src/lib/offlineConversions.ts (linha 270)
console.log('✅ User data encontrado no Vercel KV:', {
  email: kvData.email,
  hasFbp: !!kvData.fbp,
  hasFbc: !!kvData.fbc,  // ⚠️ Verificar se é true
  fbc: kvData.fbc ? kvData.fbc.substring(0, 40) + '...' : 'undefined',  // NOVO
  fbcLength: kvData.fbc?.length || 0  // NOVO
});
```

---

### **3. Verificar validação do `fbc`:**

**Se `fbc` está sendo rejeitado:**
- Verificar se está dentro da janela de 24h
- Verificar formato: `fb.1.[timestamp].[fbclid]`

**Adicionar log em `sendPurchaseToGTM`:**
```typescript
// src/lib/offlineConversions.ts (linha 475)
if (userData.fbc) {
  console.log('🔍 DEBUG fbc antes de validar:', {
    fbc: userData.fbc.substring(0, 40) + '...',
    fbcLength: userData.fbc.length
  });
  
  const sanitizedFbc = sanitizeFbc(userData.fbc);
  console.log('🔍 DEBUG fbc após sanitizar:', {
    sanitized: sanitizedFbc ? sanitizedFbc.substring(0, 40) + '...' : 'null',
    isValid: !!sanitizedFbc
  });
  
  if (sanitizedFbc) {
    const fbcValidation = validateFbc(sanitizedFbc);
    console.log('🔍 DEBUG fbc validação:', fbcValidation);
    // ...
  }
}
```

---

## 📋 **CHECKLIST DE VERIFICAÇÃO**

- [ ] **Lead gerado:** Verificar se `fbc` existe nos cookies quando Lead é gerado
- [ ] **Salvo no KV:** Verificar logs `✅ User tracking salvo no Vercel KV` → `hasFbc: true`
- [ ] **Buscado do KV:** Verificar logs `✅ User data encontrado no Vercel KV` → `hasFbc: true`
- [ ] **Validação:** Verificar se `fbc` passa na validação (formato + 24h)
- [ ] **Enviado:** Verificar se `fbc` aparece no payload final enviado ao Meta

---

## 🎯 **RESUMO**

**O código está correto!** O problema provavelmente é:

1. **`fbc` não foi capturado** quando Lead foi gerado (usuário não clicou em anúncio)
2. **`fbc` está expirado** (mais de 24h entre Lead e Purchase)
3. **Email não bate** (normalização não funcionou)

**Próximos passos:**
1. Adicionar logs de debug (conforme acima)
2. Gerar novo Lead e verificar se `fbc` é salvo
3. Fazer Purchase imediatamente (dentro de 24h) e verificar se `fbc` aparece

---

**Última atualização**: 2025-01-05  
**Versão**: 1.0  
**Status**: ✅ CÓDIGO CORRETO - AGUARDANDO DEBUG


# 🔍 Problema: fbc Antigo em Lead Novo

## 🎯 Problema Identificado

**Situação:**
- Lead NOVO criado hoje (primeira vez)
- Mas fbc tem timestamp de 2.24 dias atrás
- fbc não corresponde ao Lead novo

**Causa:**
O fbc está sendo capturado do cookie `_fbc` do navegador no momento do Lead. Se o cookie está antigo (não foi atualizado), o Lead novo salva o fbc antigo.

---

## 🔍 Como Funciona Atualmente

### Fluxo Atual:

1. **Usuário preenche formulário** (Lead)
2. **Frontend captura fbc:**
   ```typescript
   const metaCookies = getMetaCookies(); // Pega do cookie _fbc
   fbc: metaCookies.fbc  // ← Pode estar antigo!
   ```
3. **Salva no KV:**
   ```typescript
   await fetch('/api/save-tracking', {
     body: JSON.stringify({
       fbc: metaCookies.fbc  // ← Salva fbc antigo
     })
   });
   ```
4. **Purchase busca:**
   ```typescript
   const userData = await getUserTracking(email); // Busca por email
   // Retorna fbc antigo que foi salvo no Lead novo
   ```

---

## ⚠️ Por Que o Cookie `_fbc` Pode Estar Antigo?

### O cookie `_fbc` só é atualizado quando:

1. **Usuário clica em anúncio do Facebook** (com `fbclid` na URL)
2. **Meta Pixel cria/atualiza o cookie** automaticamente

### Se o usuário:

- **Não clicou em anúncio recente** → Cookie `_fbc` está antigo
- **Acessou direto** (sem anúncio) → Pode não ter cookie `_fbc`
- **Clicou em anúncio há 2+ dias** → Cookie `_fbc` está antigo

---

## ✅ Soluções Possíveis

### Solução 1: Validar fbc Antes de Salvar (Recomendado)

**Validar se fbc é recente (< 24h) antes de salvar:**

```typescript
// No /api/save-tracking
const { validateFbc } = await import('@/lib/utils/fbcValidator');

if (fbc) {
  const validation = validateFbc(fbc);
  
  if (validation.valid) {
    // fbc válido (< 24h) → Salvar
    await saveUserTracking({ fbc, ... });
  } else {
    // fbc expirado (> 24h) → NÃO salvar (ou salvar como undefined)
    console.warn('⚠️ fbc expirado, não salvando no Lead');
    await saveUserTracking({ fbc: undefined, ... });
  }
}
```

**Vantagem:** Não salva fbc antigo no Lead novo

**Desvantagem:** Se não tiver fbc válido, não salva nada

---

### Solução 2: Sempre Usar fbc Mais Recente (Melhor)

**Buscar fbc mais recente disponível:**

```typescript
// No /api/save-tracking
const { validateFbc } = await import('@/lib/utils/fbcValidator');

// 1. Verificar fbc do cookie atual
let fbcToSave = fbc;

if (fbc) {
  const validation = validateFbc(fbc);
  
  if (!validation.valid) {
    // fbc expirado → Verificar se tem fbc mais recente salvo
    const existingData = await getUserTracking(email);
    
    if (existingData?.fbc) {
      const existingValidation = validateFbc(existingData.fbc);
      
      if (existingValidation.valid) {
        // fbc existente é mais recente → Usar ele
        fbcToSave = existingData.fbc;
        console.log('✅ Usando fbc mais recente do Lead anterior');
      } else {
        // Ambos expirados → Não salvar
        fbcToSave = undefined;
      }
    } else {
      // Não tem fbc existente → Não salvar
      fbcToSave = undefined;
    }
  }
}

await saveUserTracking({ fbc: fbcToSave, ... });
```

**Vantagem:** Sempre usa o fbc mais recente disponível

**Desvantagem:** Mais complexo

---

### Solução 3: Não Salvar fbc Se Expirado (Simples)

**Simplesmente não salvar fbc se expirado:**

```typescript
// No /api/save-tracking
const { validateFbc } = await import('@/lib/utils/fbcValidator');

const fbcToSave = fbc && validateFbc(fbc).valid ? fbc : undefined;

await saveUserTracking({ fbc: fbcToSave, ... });
```

**Vantagem:** Simples, não salva fbc antigo

**Desvantagem:** Se não tiver fbc válido, não salva nada

---

## 🎯 Recomendação

**Usar Solução 3 (mais simples):**

- Não salvar fbc se expirado (> 24h)
- Se não tiver fbc válido, não salvar (ou salvar como `undefined`)
- No Purchase, se não tiver fbc, não enviar (já está assim)

**Por quê?**
- Simples de implementar
- Evita salvar fbc antigo
- Meta não usa fbc expirado mesmo assim

---

## 📝 Implementação

### Onde Modificar:

**Arquivo:** `src/app/api/save-tracking/route.ts`

**Antes:**
```typescript
const success = await saveUserTracking({
  email: normalizedEmail,
  fbp,
  fbc,  // ← Pode estar antigo!
  ...
});
```

**Depois:**
```typescript
// Validar fbc antes de salvar
const { validateFbc } = await import('@/lib/utils/fbcValidator');
const fbcToSave = fbc && validateFbc(fbc).valid ? fbc : undefined;

const success = await saveUserTracking({
  email: normalizedEmail,
  fbp,
  fbc: fbcToSave,  // ← Só salva se válido (< 24h)
  ...
});
```

---

## 🔍 Como Verificar

### Teste 1: Verificar Cookie `_fbc` no Navegador

1. Abra o console do navegador
2. Digite: `document.cookie.split(';').find(c => c.includes('_fbc'))`
3. Veja o timestamp do fbc
4. Se for antigo (> 24h), o problema está confirmado

### Teste 2: Verificar Logs do Lead

**Procure por:**
```
📍 IP capturado do request: ...
✅ User tracking salvo no Vercel KV: {
  hasFbc: true,
  fbc: 'fb.1.1762611837789...'  // ← Verificar timestamp
}
```

**Se o timestamp for antigo (> 24h), o problema está confirmado**

---

## ✅ Resposta à Sua Pergunta

### "Para cada lead é gerado o fbc diferente? Sim né?"

**Resposta:**
- ✅ **Sim, cada Lead DEVERIA ter um fbc diferente** (se vier de anúncios diferentes)
- ⚠️ **Mas o problema é:** O fbc vem do cookie `_fbc` do navegador
- ⚠️ **Se o cookie está antigo, o Lead novo salva o fbc antigo**

### "Esse fbc que está sendo gerado é fake, não é o correspondente ao lead que foi criado agora"

**Resposta:**
- ❌ **Não é fake** (veio do cookie real do Facebook)
- ⚠️ **Mas está antigo** (cookie não foi atualizado)
- ✅ **Solução:** Validar fbc antes de salvar (não salvar se expirado)

---

**Última atualização:** 2025-01-08


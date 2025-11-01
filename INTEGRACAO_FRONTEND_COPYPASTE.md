# ?? INTEGRA??O FRONTEND - Copy & Paste

## ?? O Que Fazer

Adicionar **1 bloco de c?digo** no arquivo `src/app/page.tsx` para salvar fbp/fbc no banco quando usu?rio preenche formul?rio.

---

## ?? ONDE ADICIONAR

**Arquivo:** `src/app/page.tsx`  
**Localiza??o:** Depois da linha que tem `await trackLeadElite(trackingUserData);`  
**Linha aproximada:** ~232

---

## ?? PASSO A PASSO

### 1. Abra o arquivo

```bash
src/app/page.tsx
```

### 2. Procure este trecho (linha ~230-235):

```typescript
// Disparar evento Lead (ELITE - com advanced matching)
await trackLeadElite(trackingUserData);

// Disparar evento InitiateCheckout (ELITE - com attribution)
await trackInitiateCheckoutElite(trackingUserData);
```

### 3. Adicione este c?digo ENTRE as duas linhas:

```typescript
// Disparar evento Lead (ELITE - com advanced matching)
await trackLeadElite(trackingUserData);

// ?? ADICIONE ESTE BLOCO AQUI ???

// Salvar fbp/fbc no banco para Offline Conversions
try {
  const { getMetaCookies } = await import('@/lib/advancedDataPersistence');
  const metaCookies = getMetaCookies();
  
  await fetch('/api/save-tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.email,
      fbp: metaCookies.fbp,
      fbc: metaCookies.fbc,
      firstName: trackingUserData.firstName,
      lastName: trackingUserData.lastName,
      phone: trackingUserData.phone,
      city: trackingUserData.city,
      state: trackingUserData.state,
      zip: trackingUserData.zip
    })
  });
  
  console.log('? fbp/fbc salvos no banco');
} catch (error) {
  console.error('?? Erro ao salvar tracking:', error);
  // N?o bloqueia o fluxo se falhar
}

// ?? AT? AQUI ???

// Disparar evento InitiateCheckout (ELITE - com attribution)
await trackInitiateCheckoutElite(trackingUserData);
```

---

## ? C?digo Completo (Copy & Paste)

**Cole isto EXATAMENTE entre as duas linhas:**

```typescript
// Salvar fbp/fbc no banco para Offline Conversions
try {
  const { getMetaCookies } = await import('@/lib/advancedDataPersistence');
  const metaCookies = getMetaCookies();
  
  await fetch('/api/save-tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.email,
      fbp: metaCookies.fbp,
      fbc: metaCookies.fbc,
      firstName: trackingUserData.firstName,
      lastName: trackingUserData.lastName,
      phone: trackingUserData.phone,
      city: trackingUserData.city,
      state: trackingUserData.state,
      zip: trackingUserData.zip
    })
  });
  
  console.log('? fbp/fbc salvos no banco');
} catch (error) {
  console.error('?? Erro ao salvar tracking:', error);
}
```

---

## ?? Como Ficar?

### Antes:

```typescript
// Linha ~230
await trackLeadElite(trackingUserData);

// Linha ~235
await trackInitiateCheckoutElite(trackingUserData);
```

### Depois:

```typescript
// Linha ~230
await trackLeadElite(trackingUserData);

// ?? NOVO BLOCO (25 linhas)
try {
  const { getMetaCookies } = await import('@/lib/advancedDataPersistence');
  const metaCookies = getMetaCookies();
  
  await fetch('/api/save-tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.email,
      fbp: metaCookies.fbp,
      fbc: metaCookies.fbc,
      firstName: trackingUserData.firstName,
      lastName: trackingUserData.lastName,
      phone: trackingUserData.phone,
      city: trackingUserData.city,
      state: trackingUserData.state,
      zip: trackingUserData.zip
    })
  });
  
  console.log('? fbp/fbc salvos no banco');
} catch (error) {
  console.error('?? Erro ao salvar tracking:', error);
}

// Linha ~260
await trackInitiateCheckoutElite(trackingUserData);
```

---

## ? Pronto!

Isso ? tudo que voc? precisa fazer no frontend! ??

**O que esse c?digo faz:**
1. Pega os cookies fbp/fbc do Facebook
2. Envia para `/api/save-tracking` junto com dados do formul?rio
3. Salva no Vercel KV (Redis na nuvem)
4. Quando webhook Cakto chegar, busca esses dados
5. Envia Purchase com fbp/fbc corretos

**Tempo:** 2 minutos ??

---

## ?? Como Testar Depois

### Console do Browser (F12):

```
Ap?s submeter formul?rio, deve ver:
? fbp/fbc salvos no banco
```

Se aparecer erro, ? normal (Vercel KV ainda n?o configurado).  
Funcionar? ap?s deploy na Vercel!

---

**Pr?ximo:** Configurar vari?veis na Vercel! ??

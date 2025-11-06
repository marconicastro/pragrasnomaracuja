# ⚠️ PROBLEMA: Preço Fixo em ViewContent

## 🎯 **ALERTA DO FACEBOOK**

```
Corrija as informações de preço para eventos de ViewContent da web

Todos os seus eventos de ViewContent da web estão enviando as mesmas 
informações de preço. Corrija esse problema para melhorar o desempenho 
dos anúncios.

Possível resultado: Retorno sobre o investimento em publicidade (ROAS) 5% mais alto
```

**Detectado em:** 4 de nov de 2025

---

## 🔍 **CAUSA RAIZ**

O código está usando **valores fixos** para todos os eventos ViewContent:

### **1. Configuração Fixa:**
```typescript
// src/lib/gtmDataLayer.ts
const PRODUCT_CONFIG = {
  item_id: 'hacr962',
  item_name: 'Sistema 4 Fases - Ebook Trips',
  price: 39.9,  // ❌ FIXO
  currency: 'BRL',
  category: 'digital_product',
  content_type: 'product'
};
```

### **2. Uso Fixo em ViewContent:**
```typescript
// src/lib/eliteMetaPixelTracking.ts
export async function trackViewContentElite(customParams: Record<string, any> = {}) {
  // ...
  pushViewItem(39.9, 'BRL', userDataForGTM, eventID);  // ❌ FIXO 39.9
  
  return trackEliteEvent('ViewContent', {
    value: 39.9,  // ❌ FIXO 39.9
    currency: 'BRL',
    // ...
  });
}
```

---

## ✅ **SOLUÇÕES POSSÍVEIS**

### **Opção 1: Permitir Preço Dinâmico via customParams (RECOMENDADO)**

Permitir que o preço seja passado dinamicamente:

```typescript
export async function trackViewContentElite(customParams: Record<string, any> = {}) {
  // ✅ Permitir preço dinâmico via customParams
  const value = customParams.value || PRODUCT_CONFIG.price;
  const currency = customParams.currency || PRODUCT_CONFIG.currency;
  
  // ...
  pushViewItem(value, currency, userDataForGTM, eventID);
  
  return trackEliteEvent('ViewContent', {
    value: value,  // ✅ Dinâmico
    currency: currency,
    // ...
    ...customParams
  });
}
```

**Vantagens:**
- ✅ Permite diferentes preços por produto/página
- ✅ Mantém compatibilidade (usa 39.9 como padrão)
- ✅ Não quebra código existente

---

### **Opção 2: Remover Preço quando Não Aplicável**

Se ViewContent não for de um produto específico, não enviar `value` e `item_price`:

```typescript
export async function trackViewContentElite(customParams: Record<string, any> = {}) {
  const hasProduct = customParams.content_ids && customParams.content_ids.length > 0;
  
  if (hasProduct) {
    // ✅ Enviar com preço
    pushViewItem(customParams.value || 39.9, 'BRL', userDataForGTM, eventID);
  } else {
    // ✅ Enviar sem preço (apenas content_ids, content_type, etc.)
    pushViewItemWithoutPrice(userDataForGTM, eventID);
  }
}
```

**Vantagens:**
- ✅ Não envia preço quando não há produto
- ✅ Mais preciso para o Facebook

**Desvantagens:**
- ⚠️ Requer criar nova função `pushViewItemWithoutPrice()`

---

### **Opção 3: Usar Preço do DataLayer (Mais Avançado)**

Se o preço estiver disponível no DataLayer ou em variáveis do GTM:

```typescript
// No código, não enviar value fixo
// Deixar o GTM Server-Side buscar o preço de uma variável
```

**Vantagens:**
- ✅ Totalmente dinâmico
- ✅ Pode vir de diferentes fontes (CMS, API, etc.)

**Desvantagens:**
- ⚠️ Requer configuração no GTM
- ⚠️ Pode retornar `undefined` se não configurado

---

## 🎯 **RECOMENDAÇÃO**

**Implementar Opção 1** (Preço Dinâmico via customParams):

1. ✅ Permite flexibilidade
2. ✅ Mantém compatibilidade
3. ✅ Fácil de implementar
4. ✅ Resolve o problema do Facebook

---

## 📋 **IMPLEMENTAÇÃO**

### **1. Atualizar `trackViewContentElite()`:**

```typescript
export async function trackViewContentElite(customParams: Record<string, any> = {}) {
  // ✅ Permitir preço dinâmico
  const value = customParams.value ?? PRODUCT_CONFIG.price;
  const currency = customParams.currency || PRODUCT_CONFIG.currency;
  const contentIds = customParams.content_ids || [PRODUCT_CONFIG.item_id];
  const contentName = customParams.content_name || PRODUCT_CONFIG.item_name;
  const contentType = customParams.content_type || PRODUCT_CONFIG.content_type;
  
  // Obter user data para DataLayer
  const userData = getAdvancedUserData();
  const userDataForGTM = userData ? {
    user_id: userData.external_id,
    email_address: userData.email,
    phone_number: userData.phone,
    first_name: userData.firstName,
    last_name: userData.lastName,
    city: userData.city,
    region: userData.state,
    postal_code: userData.zip,
    country: userData.country
  } : undefined;
  
  // Gerar event_id antes de enviar para DataLayer
  const { generateEventId } = await import('./utils/eventId');
  const eventID = generateEventId('ViewContent');
  
  // ✅ Enviar para DataLayer com preço dinâmico
  pushViewItem(value, currency, userDataForGTM, eventID);
  
  return trackEliteEvent('ViewContent', {
    value: value,  // ✅ Dinâmico
    currency: currency,
    content_ids: contentIds,
    content_type: contentType,
    content_name: contentName,
    content_category: customParams.content_category || PRODUCT_CONFIG.category,
    ...customParams
  }, 'standard', { isColdEvent: true });
}
```

### **2. Uso no Código:**

```typescript
// ✅ Com preço específico
trackViewContentElite({
  value: 49.9,  // Preço diferente
  content_ids: ['produto-123']
});

// ✅ Sem preço (usa padrão 39.9)
trackViewContentElite({
  content_ids: ['hacr962']
});
```

---

## ⚠️ **NOTA IMPORTANTE**

Se o site tem **apenas um produto**, o problema pode ser que estamos disparando ViewContent em **todas as páginas**, não apenas na página do produto.

**Solução:** Disparar ViewContent apenas na página do produto específico.

---

**Status:** 🔧 **AGUARDANDO IMPLEMENTAÇÃO**


# ✅ CORREÇÃO: PageView - Variáveis Undefined

## 🎯 **PROBLEMA IDENTIFICADO**

O evento `page_view` está chegando no GTM Server-Side **sem dados no nível raiz**, causando variáveis `undefined`:

- ❌ `{{ed - email_address}}` → `undefined`
- ❌ `{{ed - first_name}}` → `undefined`
- ❌ `{{ed - city}}` → `undefined`
- ❌ Todas as variáveis de user_data → `undefined`

**Mas o Facebook está recebendo dados hasheados corretamente!** ✅

---

## 🔍 **CAUSA RAIZ**

1. **`trackPageViewElite()`** chama `enrichColdEvent()` para obter dados
2. **`enrichColdEvent()`** retorna dados no formato Meta abreviado (`em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`)
3. **`convertEnrichedToGTMFormat()`** converte para formato GTM completo (`email_address`, `phone_number`, etc.)
4. **PROBLEMA:** Se `convertEnrichedToGTMFormat()` retornar `undefined` (quando não há dados suficientes), `pushPageView()` não adiciona nada no nível raiz

---

## ✅ **SOLUÇÃO IMPLEMENTADA**

### **1. Garantir que `userDataForGTM` sempre seja um objeto:**

```typescript
if (!userDataForGTM) {
  userDataForGTM = {};
}
```

### **2. Adicionar `user_id` se disponível:**

```typescript
if (enriched.user_data.external_id && !userDataForGTM.user_id) {
  userDataForGTM.user_id = enriched.user_data.external_id;
}
```

---

## 📊 **O QUE MUDOU**

### **ANTES:**
```typescript
const enriched = await enrichColdEvent();
userDataForGTM = convertEnrichedToGTMFormat(enriched.user_data);
// ❌ Se retornar undefined, pushPageView() não adiciona nada
pushPageView(userDataForGTM, eventID);
```

### **DEPOIS:**
```typescript
const enriched = await enrichColdEvent();
userDataForGTM = convertEnrichedToGTMFormat(enriched.user_data);

// ✅ Garantir que sempre temos um objeto
if (!userDataForGTM) {
  userDataForGTM = {};
}

// ✅ Adicionar user_id se disponível
if (enriched.user_data.external_id && !userDataForGTM.user_id) {
  userDataForGTM.user_id = enriched.user_data.external_id;
}

pushPageView(userDataForGTM, eventID);
```

---

## 🎯 **RESULTADO ESPERADO**

Agora o `pushPageView()` sempre receberá um objeto (mesmo que vazio), e os campos que existirem serão adicionados no nível raiz do DataLayer:

```javascript
{
  event: 'page_view',
  email_address: '...',  // ✅ Se disponível
  first_name: '...',      // ✅ Se disponível
  city: '...',            // ✅ Se disponível
  // ... outros campos
  user_data: { ... }      // ✅ Também dentro de user_data
}
```

---

## ⚠️ **NOTA IMPORTANTE**

O `enrichColdEvent()` pode não retornar todos os campos se:
- Não houver dados persistidos
- A API de geolocation falhar
- Não houver cookies Meta (fbp/fbc)

**Mas agora, mesmo que alguns campos estejam ausentes, os que existirem serão enviados corretamente para o DataLayer!**

---

**Status:** ✅ **CORRIGIDO - Aguardando teste**


# ✅ SOLUÇÃO: Erro Currency Faltando no Custom Data

## 🎯 **PROBLEMA**

Facebook retorna erro 400:
```
"Parâmetro de preço do item sem moeda"
"Você está enviando um parâmetro de preço do item dentro do seu parâmetro de conteúdos, mas não está enviando um parâmetro de moeda."
```

**Eventos afetados:**
- ❌ ViewContent
- ❌ AddToCart  
- ❌ InitiateCheckout

**Eventos OK:**
- ✅ PageView (não tem `contents` com `item_price`)
- ✅ Lead (não tem `contents` com `item_price`)

---

## 🔍 **CAUSA RAIZ**

As tags do GTM Server-Side estão usando:
- `{{ed - ecommerce.currency}}` no `custom_data`

Mas essa variável está retornando `undefined`, então o Facebook não recebe `currency` no `custom_data`.

---

## ✅ **SOLUÇÃO NO GTM SERVER-SIDE**

### **Opção 1: Usar variável do nível raiz (RECOMENDADO)**

**Nas tags FB - ViewContent, FB - AddToCart, FB - InitiateCheckout:**

1. Abrir tag no GTM Server-Side
2. Ir em **Custom Data**
3. Encontrar campo `currency`
4. **Alterar** de `{{ed - ecommerce.currency}}` para `{{ed - currency}}`

**Por quê?**
- O código envia `currency` no nível raiz ✅
- A variável `{{ed - currency}}` vai funcionar ✅
- Não precisa alterar código ✅

### **Opção 2: Criar variável `{{ed - currency}}` (se não existir)**

1. Criar variável Event Data:
   - Nome: `ed - currency`
   - Path: `currency`
   - Tipo: Texto

2. Usar `{{ed - currency}}` no `custom_data` das tags

---

## 📋 **VERIFICAÇÃO**

### **Código já envia corretamente:**

```typescript
pushToDataLayer({
  event: 'view_item',
  ecommerce: {
    value: 39.9,
    currency: 'BRL',  // ✅ Dentro de ecommerce
  },
  currency: 'BRL',    // ✅ No nível raiz (para {{ed - currency}})
  // ...
});
```

### **GTM precisa usar:**

**ANTES (não funciona):**
```
currency: {{ed - ecommerce.currency}}  // ❌ Retorna undefined
```

**DEPOIS (funciona):**
```
currency: {{ed - currency}}  // ✅ Retorna "BRL"
```

---

## 🎯 **AÇÃO IMEDIATA**

**No GTM Server-Side, alterar nas tags:**

1. **FB - ViewContent** → Custom Data → `currency` → `{{ed - currency}}`
2. **FB - AddToCart** → Custom Data → `currency` → `{{ed - currency}}`
3. **FB - InitiateCheckout** → Custom Data → `currency` → `{{ed - currency}}`

**OU** criar variável `{{ed - currency}}` se não existir e usar ela.

---

## ✅ **RESULTADO ESPERADO**

Após a correção, o payload enviado ao Facebook será:

```json
{
  "custom_data": {
    "content_ids": ["hacr962"],
    "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
    "currency": "BRL"  // ✅ Agora será enviado!
  }
}
```

E o erro 400 será resolvido! ✅

---

**Status:** ⚠️ Requer alteração no GTM Server-Side (não no código)


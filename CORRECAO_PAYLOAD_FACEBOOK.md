# 🔧 CORREÇÃO: Campos Faltantes no Payload do Facebook

**Problema identificado:** 2 campos importantes estão faltando no payload enviado ao Meta!

---

## ❌ CAMPOS FALTANDO

### **1. ❌ EXTERNAL_ID não está no user_data**

**No payload atual:**
```json
"user_data": {
  "em": "...",
  "ph": "...",
  // ... outros campos
  // ❌ FALTA: "external_id"
}
```

**Por que está faltando:**
- O `external_id` está sendo incluído no `prepareAdvancedMatching()` (linha 130)
- Mas o GTM Server-Side precisa mapear `user_id` do DataLayer para `external_id` do Meta
- O `user_id` está sendo enviado no DataLayer, mas pode não estar sendo mapeado corretamente

**Correção necessária:**
- Verificar se o GTM Server-Side está mapeando `{{dlv - user_data.user_id}}` → `external_id` no user_data do Meta

---

### **2. ❌ CONTENT_NAME e CONTENT_TYPE não estão no custom_data**

**No payload atual:**
```json
"custom_data": {
  "value": 39.9,
  "currency": "BRL",
  "content_ids": ["hacr962"],
  "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
  "num_items": 1
  // ❌ FALTA: "content_name"
  // ❌ FALTA: "content_type"
}
```

**Por que está faltando:**
- `content_name` e `content_type` são enviados no `trackEliteEvent()` como parâmetros do evento
- Mas não estão sendo incluídos no `custom_data` do DataLayer
- O GTM Server-Side precisa mapear esses campos para o `custom_data` do Meta

**Correção necessária:**
- Adicionar `content_name` e `content_type` ao DataLayer quando o evento é enviado
- Ou configurar o GTM Server-Side para mapear esses campos do evento para o custom_data

---

## 🔧 SOLUÇÕES

### **Solução 1: Adicionar campos ao DataLayer**

**Modificar `pushBeginCheckout()` para incluir:**
```typescript
export function pushBeginCheckout(
  value: number = PRODUCT_CONFIG.price,
  currency: string = PRODUCT_CONFIG.currency,
  quantity: number = 1,
  userData?: Partial<UserData>
): void {
  const contentData = prepareContentData([PRODUCT_CONFIG.item_id], quantity);
  
  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      value: value,
      currency: currency,
      items: [prepareEcommerceItem(...)]
    },
    ...contentData,
    content_name: PRODUCT_CONFIG.item_name,  // ✅ ADICIONAR
    content_type: 'product',                  // ✅ ADICIONAR
    num_items: quantity,
    user_data: prepareUserData(userData)
  });
}
```

### **Solução 2: Verificar mapeamento no GTM Server-Side**

**No GTM Server-Side, verificar se:**
1. `{{dlv - user_data.user_id}}` está sendo mapeado para `external_id` no user_data do Meta
2. `{{dlv - content_name}}` ou `{{ed - content_name}}` está sendo mapeado para `content_name` no custom_data
3. `{{dlv - content_type}}` ou `{{ed - content_type}}` está sendo mapeado para `content_type` no custom_data

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Verificar se `user_id` está sendo enviado no DataLayer (`user_data.user_id`)
- [ ] Verificar se o GTM Server-Side está mapeando `user_id` → `external_id`
- [ ] Verificar se `content_name` está sendo enviado no DataLayer
- [ ] Verificar se `content_type` está sendo enviado no DataLayer
- [ ] Verificar se o GTM Server-Side está mapeando esses campos para o custom_data do Meta

---

## 🎯 IMPACTO

**Sem external_id:**
- ❌ Perda de +0.22% conversões (Meta recomenda)
- ❌ EQM pode ser menor

**Sem content_name e content_type:**
- ❌ Menos contexto para o Meta Analytics
- ❌ Menos dados para segmentação de campanhas

---

## ✅ PRÓXIMOS PASSOS

1. Verificar o mapeamento no GTM Server-Side
2. Adicionar campos faltantes ao DataLayer se necessário
3. Testar e verificar se os campos aparecem no payload final


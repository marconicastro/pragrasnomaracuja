# 🔍 ANÁLISE: Eventos Duplicados no GTM Server-Side

**Problema:** Eventos aparecem duas vezes no stream do GTM Server-Side Preview Mode

---

## 📊 O QUE ESTÁ ACONTECENDO

Na imagem do GTM Preview Mode, vejo que cada evento aparece **duplicado** no stream:

```
10 begin_checkout
9 begin_checkout
8 generate_lead
7 generate_lead
6 add_to_cart
5 add_to_cart
4 view_content
3 page_view
2 view_item
1 page_view
```

**Isso NÃO é normal!** Cada evento deveria aparecer apenas **1 vez** no stream.

---

## 🔍 POSSÍVEIS CAUSAS

### **Causa 1: Evento sendo enviado 2x para o DataLayer (MUITO PROVÁVEL)**

**Como verificar:**
1. Abra o Console do navegador (F12)
2. Procure por mensagens `📊 DataLayer push:`
3. Teste um evento (ex: clicar em "COMPRAR AGORA")
4. **Conte quantas vezes aparece** `📊 DataLayer push: {event: 'add_to_cart', ...}`

**Se aparecer 2x →** O evento está sendo enviado duas vezes do lado do cliente.

**Solução:**
- Verificar se `pushAddToCart()` está sendo chamada duas vezes
- Verificar se há múltiplas chamadas de `trackAddToCartElite()`

---

### **Causa 2: GTM Server-Side processando o mesmo evento duas vezes**

**Como verificar:**
1. No Console do navegador, execute:
```javascript
console.log('DataLayer length:', window.dataLayer.length);
console.log('DataLayer events:', window.dataLayer.filter(e => e.event));
```

2. Verifique se cada evento aparece apenas 1x no array

**Se aparecer 1x no DataLayer mas 2x no GTM →** Problema na configuração do GTM Server-Side.

**Solução:**
- Verificar se há triggers duplicados no GTM Server-Side
- Verificar se a tag "GA4 - All Events" está configurada corretamente

---

### **Causa 3: React Strict Mode (em desenvolvimento)**

**Como verificar:**
- No Next.js, o React Strict Mode pode causar dupla execução de useEffect
- Isso só acontece em desenvolvimento (`NODE_ENV === 'development'`)

**Solução:**
- Verificar se está em produção ou desenvolvimento
- Em produção, o Strict Mode não deve causar duplicação

---

### **Causa 4: Múltiplas instâncias do GTM**

**Como verificar:**
No Console do navegador, execute:
```javascript
console.log('GTM Instances:', Object.keys(window.google_tag_manager || {}));
console.log('DataLayer:', window.dataLayer);
```

**Se houver múltiplas instâncias →** Problema na configuração do GTM.

---

## 📋 CHECKLIST DE DIAGNÓSTICO

Para identificar a causa exata, preciso:

1. **Console logs do navegador:**
   - Quantas vezes aparece `📊 DataLayer push:` para cada evento?
   - Copie os logs quando testar um evento específico

2. **Verificar DataLayer:**
   - Execute no console: `console.log(window.dataLayer.filter(e => e.event))`
   - Conte quantas vezes cada evento aparece

3. **Network tab:**
   - Abra Network tab (F12)
   - Filtre por "gtm" ou "event.maracujazeropragas.com"
   - Teste um evento e veja quantas requisições são feitas

---

## 🎯 PRÓXIMOS PASSOS

Envie:
1. ✅ Console logs mostrando `📊 DataLayer push:` (quantas vezes?)
2. ✅ Resultado de `console.log(window.dataLayer.filter(e => e.event))`
3. ✅ Screenshot do Network tab mostrando requisições para o GTM Server-Side

Com essas informações, vou identificar a causa exata e corrigir!





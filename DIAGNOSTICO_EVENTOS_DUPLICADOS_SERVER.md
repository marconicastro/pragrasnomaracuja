# 🔍 DIAGNÓSTICO: Eventos Duplicados no GTM Server-Side

**Problema:** Eventos aparecem **duplicados** no stream do GTM Server-Side Preview Mode

---

## ❌ NÃO É NORMAL!

Cada evento deveria aparecer apenas **1 vez** no stream. Se aparecer 2x, há um problema.

---

## 🔍 POSSÍVEIS CAUSAS

### **Causa 1: Evento sendo enviado 2x para o DataLayer (MAIS PROVÁVEL)**

**Como verificar:**
1. Abra o Console do navegador (F12)
2. Limpe o console
3. Teste um evento (ex: clicar em "COMPRAR AGORA")
4. Procure por: `📊 DataLayer push:`
5. **Conte quantas vezes aparece** para o mesmo evento

**Exemplo:**
```
📊 DataLayer push: {event: 'add_to_cart', ...}
📊 DataLayer push: {event: 'add_to_cart', ...}  // DUPLICADO?
```

**Se aparecer 2x →** O evento está sendo enviado duas vezes do código.

---

### **Causa 2: Verificar DataLayer diretamente**

**No Console do navegador, execute:**
```javascript
// Ver todos os eventos no DataLayer
const events = window.dataLayer.filter(e => e.event);
console.log('Total de eventos:', events.length);
console.log('Eventos únicos:', [...new Set(events.map(e => e.event))]);
console.log('Eventos duplicados:', events.map(e => e.event).filter((e, i, arr) => arr.indexOf(e) !== i));
```

**Se houver duplicados →** O problema está no código que envia para o DataLayer.

**Se NÃO houver duplicados →** O problema está no GTM Server-Side.

---

### **Causa 3: React Strict Mode (apenas em desenvolvimento)**

**Como verificar:**
- O React Strict Mode pode causar dupla execução de `useEffect` em desenvolvimento
- Isso só acontece em `NODE_ENV === 'development'`

**Solução:**
- Verificar se está em produção ou desenvolvimento
- Em produção, isso não deve acontecer

---

### **Causa 4: Múltiplas chamadas da mesma função**

**Verificar no código:**
- `trackAddToCartElite()` está sendo chamada apenas 1x?
- `trackLeadElite()` está sendo chamada apenas 1x?
- `trackInitiateCheckoutElite()` está sendo chamada apenas 1x?

---

## 📋 INFORMAÇÕES NECESSÁRIAS

Para identificar a causa exata, preciso:

1. **Console logs:**
   - Quantas vezes aparece `📊 DataLayer push:` para cada evento?
   - Copie os logs quando testar um evento específico

2. **Verificar DataLayer:**
   - Execute: `console.log(window.dataLayer.filter(e => e.event))`
   - Conte quantas vezes cada evento aparece

3. **Network tab:**
   - Abra Network (F12)
   - Filtre por "gtm" ou "event.maracujazeropragas.com"
   - Teste um evento e veja quantas requisições são feitas

---

## 🎯 PRÓXIMOS PASSOS

Envie:
1. ✅ Console logs mostrando `📊 DataLayer push:` (quantas vezes?)
2. ✅ Resultado de `console.log(window.dataLayer.filter(e => e.event))`
3. ✅ Quantas requisições aparecem no Network tab para o GTM Server-Side

Com essas informações, vou identificar a causa exata e corrigir!





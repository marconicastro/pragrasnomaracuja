# 🔍 Script de Debug - DataLayer

## Execute no Console do Navegador (F12)

### **1. Verificar se eventos estão no DataLayer:**

```javascript
// Ver todos os eventos no DataLayer
console.log('📊 DataLayer completo:', window.dataLayer);

// Filtrar apenas eventos de tracking
const trackingEvents = window.dataLayer.filter(e => 
  e.event && ['page_view', 'view_item', 'add_to_cart', 'begin_checkout', 'generate_lead'].includes(e.event)
);

console.log('📊 Eventos de Tracking:', trackingEvents);

// Verificar cada evento individualmente
trackingEvents.forEach((event, index) => {
  console.log(`\n📌 Evento ${index + 1}: ${event.event}`, {
    event_id: event.event_id || '❌ AUSENTE',
    action_source: event.action_source || '❌ AUSENTE',
    has_user_data: !!event.user_data,
    user_data_keys: event.user_data ? Object.keys(event.user_data) : [],
    user_data: event.user_data,
    timestamp: new Date().toISOString()
  });
});
```

### **2. Verificar se event_id está presente:**

```javascript
// Verificar event_id em todos os eventos
const eventsWithId = window.dataLayer.filter(e => e.event_id);
const eventsWithoutId = window.dataLayer.filter(e => e.event && !e.event_id);

console.log('✅ Eventos COM event_id:', eventsWithId.length);
console.log('❌ Eventos SEM event_id:', eventsWithoutId.length);

if (eventsWithoutId.length > 0) {
  console.warn('⚠️ Eventos SEM event_id:', eventsWithoutId);
}
```

### **3. Verificar InitiateCheckout especificamente:**

```javascript
// Procurar por InitiateCheckout
const initiateCheckout = window.dataLayer.find(e => e.event === 'begin_checkout');

if (initiateCheckout) {
  console.log('🔍 InitiateCheckout encontrado:', {
    event_id: initiateCheckout.event_id || '❌ AUSENTE',
    action_source: initiateCheckout.action_source || '❌ AUSENTE',
    user_data: initiateCheckout.user_data,
    user_data_keys: initiateCheckout.user_data ? Object.keys(initiateCheckout.user_data) : [],
    value: initiateCheckout.value,
    currency: initiateCheckout.currency,
    content_ids: initiateCheckout.content_ids
  });
} else {
  console.warn('⚠️ InitiateCheckout NÃO encontrado no DataLayer!');
}
```

### **4. Verificar Lead especificamente:**

```javascript
// Procurar por Lead
const lead = window.dataLayer.find(e => e.event === 'generate_lead');

if (lead) {
  console.log('🔍 Lead encontrado:', {
    event_id: lead.event_id || '❌ AUSENTE',
    action_source: lead.action_source || '❌ AUSENTE',
    user_data: lead.user_data,
    user_data_keys: lead.user_data ? Object.keys(lead.user_data) : [],
    value: lead.value,
    currency: lead.currency
  });
} else {
  console.warn('⚠️ Lead NÃO encontrado no DataLayer!');
}
```

### **5. Comparar event_id entre eventos:**

```javascript
// Verificar se event_id é único
const eventIds = window.dataLayer
  .filter(e => e.event_id)
  .map(e => e.event_id);

const uniqueIds = [...new Set(eventIds)];

console.log('📊 Total de event_ids:', eventIds.length);
console.log('📊 event_ids únicos:', uniqueIds.length);

if (eventIds.length !== uniqueIds.length) {
  console.warn('⚠️ Eventos DUPLICADOS encontrados!');
  const duplicates = eventIds.filter((id, index) => eventIds.indexOf(id) !== index);
  console.warn('⚠️ event_ids duplicados:', duplicates);
}
```

### **6. Verificar localStorage (debug data):**

```javascript
// Ver eventos salvos no localStorage
const debugKeys = Object.keys(localStorage).filter(k => k.startsWith('gtm_debug_'));

console.log('📊 Eventos salvos no localStorage:', debugKeys.length);

debugKeys.forEach(key => {
  const data = JSON.parse(localStorage.getItem(key));
  console.log(`📌 ${key}:`, {
    event: data.event,
    event_id: data.event_id,
    action_source: data.action_source,
    has_user_data: !!data.user_data,
    user_data_keys: data.user_data ? Object.keys(data.user_data) : []
  });
});
```

### **7. Monitorar novos eventos em tempo real:**

```javascript
// Interceptar novos eventos do DataLayer
const originalPush = window.dataLayer.push;
window.dataLayer.push = function(...args) {
  console.log('🔍 NOVO EVENTO NO DATALAYER:', args[0]);
  console.log('📌 Detalhes:', {
    event: args[0].event,
    event_id: args[0].event_id || '❌ AUSENTE',
    action_source: args[0].action_source || '❌ AUSENTE',
    has_user_data: !!args[0].user_data,
    user_data_keys: args[0].user_data ? Object.keys(args[0].user_data) : []
  });
  return originalPush.apply(this, args);
};

console.log('✅ Monitoramento ativado! Novos eventos serão logados automaticamente.');
```

---

## 🎯 O que verificar:

1. ✅ **event_id está presente?** - Deve aparecer em TODOS os eventos
2. ✅ **action_source está presente?** - Deve ser `'website'` em todos
3. ✅ **user_data está completo?** - Deve ter email, phone, fbp, fbc, user_id, etc
4. ✅ **event_id é único?** - Cada evento deve ter um event_id diferente
5. ✅ **InitiateCheckout tem event_id?** - Crítico para deduplicação

---

## 🚨 Se event_id estiver AUSENTE:

Isso significa que:
- `pushToDataLayer()` não está sendo chamado com `eventId`
- Ou `eventId` está `undefined` quando chega em `pushToDataLayer()`
- Ou há algum problema no código

**Próximo passo:** Verificar se as funções `push*` estão recebendo `eventId` corretamente.



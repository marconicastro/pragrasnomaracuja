# 🔍 PROBLEMA: 2 Eventos do Navegador com Mesmo event_id

**Situação:**
- ✅ Eventos estão chegando no Meta
- ✅ Deduplicação do servidor está CORRETA (esperado)
- ❌ **Problema real:** 2 eventos do navegador com mesmo `event_id`

**Exemplo:**
```
InitiateCheckout_1762451175975_u1uwkjifbo (Navegador) - Processado
InitiateCheckout_1762451175975_u1uwkjifbo (Navegador) - Processado  ← DUPLICADO!
InitiateCheckout_1762451175975_u1uwkjifbo (Servidor) - Desduplicado ✅ (CORRETO)
```

---

## 🔍 CAUSA PROVÁVEL

**Evento está sendo disparado 2 vezes no navegador:**
- Função sendo chamada 2 vezes
- Event listener duplicado
- React re-renderizando e chamando novamente
- GTM Web disparando 2 vezes

---

## ✅ SOLUÇÕES

### **Solução 1: Verificar se função está sendo chamada 2 vezes**

**Adicionar log para verificar:**
```typescript
export async function trackInitiateCheckoutElite(...) {
  console.log('🔍 trackInitiateCheckoutElite chamada - timestamp:', Date.now());
  // ... resto do código
}
```

**Verificar no console:**
- Se aparecer 2 vezes → Função está sendo chamada 2 vezes
- Se aparecer 1 vez → Problema pode ser no GTM Web

---

### **Solução 2: Adicionar debounce/prevenção de duplicação**

**Prevenir múltiplas chamadas:**
```typescript
let lastEventId: string | null = null;
let lastEventTime: number = 0;

export async function trackInitiateCheckoutElite(...) {
  const eventID = generateEventId('InitiateCheckout');
  
  // Prevenir duplicação (mesmo event_id em menos de 1 segundo)
  const now = Date.now();
  if (lastEventId === eventID && (now - lastEventTime) < 1000) {
    console.warn('⚠️ Evento duplicado ignorado:', eventID);
    return;
  }
  
  lastEventId = eventID;
  lastEventTime = now;
  
  // ... resto do código
}
```

---

### **Solução 3: Verificar se GTM Web está disparando 2 vezes**

**No GTM Web Preview:**
- Verificar se tags aparecem 2 vezes no stream
- Verificar se há triggers duplicados
- Verificar se há tags duplicadas

---

### **Solução 4: Verificar React re-renders**

**Se usando React:**
- Verificar se componente está re-renderizando
- Verificar se `useEffect` está sendo chamado múltiplas vezes
- Adicionar dependências corretas no `useEffect`

---

## 📋 CHECKLIST DE DIAGNÓSTICO

### **Console do Navegador:**
- [ ] Função aparece 2 vezes nos logs?
- [ ] Há erros no console?
- [ ] `dataLayer.push` é chamado 2 vezes?

### **GTM Web Preview:**
- [ ] Tags aparecem 2 vezes no stream?
- [ ] Há triggers duplicados?
- [ ] Há tags duplicadas?

### **Código:**
- [ ] Função está sendo chamada de 2 lugares diferentes?
- [ ] React está re-renderizando e chamando novamente?
- [ ] Event listener está duplicado?

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Adicionar logs para identificar onde está duplicando
2. ✅ Verificar GTM Web Preview
3. ✅ Verificar código React (se aplicável)
4. ✅ Implementar prevenção de duplicação

---

## ✅ NOTA IMPORTANTE

**Deduplicação do servidor está CORRETA:**
- Quando browser e server usam mesmo `event_id`, Meta deduplica ✅
- Isso é o comportamento esperado e desejado ✅
- O problema real é a duplicação no navegador ❌


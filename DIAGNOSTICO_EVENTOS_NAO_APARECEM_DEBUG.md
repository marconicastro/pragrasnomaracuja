# 🔍 DIAGNÓSTICO: Eventos não aparecem no Debug do Servidor

**Problema:** Eventos não aparecem no stream do GTM Server-Side Debug Mode

---

## 📊 POSSÍVEIS CAUSAS

### 1. **Eventos não estão sendo enviados para o DataLayer**
- Verificar console do navegador se há logs `📊 DataLayer push:`
- Verificar se `window.dataLayer` existe
- Verificar se `pushToDataLayer()` está sendo chamada

### 2. **GTM Server-Side não está recebendo eventos do DataLayer**
- Verificar se GTM Web Container está configurado
- Verificar se Data Tags estão encaminhando para GTM Server-Side
- Verificar se Data Client está processando eventos

### 3. **Problema com event_id duplicado**
- Verificar se `event_id` está sendo gerado corretamente
- Verificar se não há conflito entre `event_id` do DataLayer e do `trackEliteEvent`

### 4. **Problema com a última alteração (event_id)**
- Verificar se `trackEliteEvent()` está recebendo `eventId` corretamente
- Verificar se não há erro ao passar `eventId` para `trackEliteEvent`

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### **1. Console do Navegador:**
- [ ] Abrir DevTools → Console
- [ ] Procurar por logs `📊 DataLayer push:`
- [ ] Verificar se `window.dataLayer` existe
- [ ] Verificar se eventos estão sendo adicionados ao `dataLayer`

### **2. GTM Debug Mode:**
- [ ] Abrir GTM Server-Side → Preview/Debug
- [ ] Verificar se eventos aparecem no stream
- [ ] Verificar se Data Client está recebendo eventos
- [ ] Verificar se tags estão disparando

### **3. Código:**
- [ ] Verificar se `pushToDataLayer()` está sendo chamada
- [ ] Verificar se `event_id` está sendo passado corretamente
- [ ] Verificar se não há erro no `trackEliteEvent()`

---

## 🔧 TESTE RÁPIDO

### **Teste 1: Verificar se DataLayer está funcionando**
```javascript
// No console do navegador:
console.log('DataLayer:', window.dataLayer);
window.dataLayer.push({ event: 'test_event', test: true });
console.log('DataLayer após push:', window.dataLayer);
```

### **Teste 2: Verificar se eventos estão sendo enviados**
```javascript
// No console do navegador:
// Procurar por logs que começam com "📊 DataLayer push:"
```

### **Teste 3: Verificar GTM Debug Mode**
1. Abrir GTM Server-Side → Preview/Debug
2. Adicionar URL do site
3. Navegar no site
4. Verificar se eventos aparecem no stream

---

## 🚨 POSSÍVEL PROBLEMA IDENTIFICADO

### **Última alteração pode ter quebrado:**
- `trackEliteEvent()` agora aceita `eventId` opcional
- Mas `trackEliteEvent()` não envia para Meta Pixel (apenas prepara dados)
- O problema pode ser que os eventos não estão sendo enviados para o DataLayer corretamente

### **Verificar:**
1. Se `pushPageView()`, `pushViewItem()`, etc. estão sendo chamadas
2. Se `event_id` está sendo passado corretamente
3. Se não há erro ao gerar `event_id`

---

## 📋 PRÓXIMOS PASSOS

1. ✅ Verificar console do navegador
2. ✅ Verificar GTM Debug Mode
3. ✅ Testar envio manual de evento
4. ✅ Verificar se há erros no código


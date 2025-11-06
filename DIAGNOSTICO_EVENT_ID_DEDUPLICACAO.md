# 🔍 DIAGNÓSTICO: event_id e Deduplicação

## 🎯 PERGUNTA

**A deduplicação tem a ver com o "Unique Event ID" que foi desativado?**

---

## 🔍 ANÁLISE

### **Situação Atual:**

1. **Código envia:** `event_id` no DataLayer (ex: `ViewContent_1762455696732_s1obmtq1dc`)
2. **GTM Server-Side:** Usa `{{ed - event_id}}` nas tags
3. **Variável `ed - event_id`:** Existe e está configurada
4. **Resultado:** Todos os eventos do servidor chegam desduplicados

---

## 🔍 POSSÍVEIS CAUSAS

### **1. Stape está gerando event_id diferente**

**Se o Stape intercepta eventos:**
- Stape pode gerar seu próprio `event_id`
- Stape envia para Meta com esse `event_id`
- Servidor envia com `event_id` do DataLayer
- Se forem diferentes → Meta não deduplica (mas você disse que está desduplicando)
- Se forem iguais → Meta deduplica (mas qual chegou primeiro?)

---

### **2. Facebook está deduplicando por outros critérios**

**Facebook pode deduplicar por:**
- `event_id` (se igual)
- `event_time` + `user_data` (se muito próximos)
- `event_name` + `user_data` + timestamp (se muito próximos)

**Se não há `event_id`:**
- Facebook pode deduplicar baseado em timestamp + user_data
- Se dois eventos chegam muito próximos com mesmo user_data → Desduplicado

---

### **3. event_id não está chegando no GTM Server-Side**

**Se `{{ed - event_id}}` retorna `undefined`:**
- Tags enviam sem `event_id`
- Facebook deduplica por outros critérios
- Eventos chegam desduplicados

---

## ✅ VERIFICAÇÃO NECESSÁRIA

### **1. Verificar se event_id está sendo enviado:**

**No console do navegador:**
```javascript
window.dataLayer.forEach(e => {
  if (e.event_id) {
    console.log('Event:', e.event, 'event_id:', e.event_id);
  }
});
```

**Verificar:**
- ✅ `event_id` está presente no DataLayer?
- ✅ Formato está correto?

---

### **2. Verificar no GTM Server-Side Preview:**

**No GTM Server-Side Preview:**
1. Abrir Preview Mode
2. Disparar um evento
3. Verificar no stream:
   - Event Data → `event_id` → Qual é o valor?
   - Variável `{{ed - event_id}}` → Qual é o valor?

**Se `{{ed - event_id}}` retornar `undefined`:**
- Variável não está lendo corretamente
- Path pode estar errado

---

### **3. Verificar se Stape está gerando event_id:**

**No Network Tab:**
1. Filtrar por: `facebook.com` ou `fb.com`
2. Verificar requisições para Meta
3. Verificar payload:
   - Há `event_id` no payload?
   - Qual é o valor?
   - É o mesmo do DataLayer?

---

## ✅ SOLUÇÃO BASEADA NO RESULTADO

### **Se event_id não está chegando no servidor:**
- Verificar path da variável `ed - event_id`
- Verificar se `event_id` está no DataLayer
- Verificar se Data Tag está enviando `event_id`

### **Se Stape está gerando event_id diferente:**
- Desativar interceptação do Stape
- Remover script do Stape
- Deixar apenas servidor enviar

### **Se Facebook está deduplicando por outros critérios:**
- Garantir que `event_id` está sendo enviado
- Verificar se `event_id` é único para cada evento
- Verificar se não há eventos duplicados no código

---

## 🎯 CONCLUSÃO

**A deduplicação PODE ter a ver com event_id se:**
- ❌ `event_id` não está sendo enviado (retorna `undefined`)
- ❌ Stape está gerando `event_id` diferente
- ❌ Facebook está deduplicando por outros critérios (sem `event_id`)

**Verificar primeiro:**
1. ✅ Se `event_id` está no DataLayer
2. ✅ Se `{{ed - event_id}}` retorna valor no GTM Server-Side
3. ✅ Se Stape está gerando `event_id` diferente


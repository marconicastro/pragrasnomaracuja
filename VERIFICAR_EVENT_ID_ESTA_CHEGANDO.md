# ✅ VERIFICAÇÃO: event_id está chegando no servidor?

## 🔍 VERIFICAÇÃO RÁPIDA

### **1. No Console do Navegador:**

```javascript
// Verificar se event_id está no DataLayer
window.dataLayer.forEach(e => {
  if (e.event_id) {
    console.log('✅ Event:', e.event, 'event_id:', e.event_id);
  } else {
    console.log('❌ Event:', e.event, 'SEM event_id');
  }
});
```

---

### **2. No GTM Server-Side Preview:**

1. **Abrir Preview Mode**
2. **Disparar um evento** (ex: PageView)
3. **No stream, clicar no evento**
4. **Verificar:**
   - Event Data → `event_id` → Qual é o valor?
   - Variável `{{ed - event_id}}` → Qual é o valor?

**Se `{{ed - event_id}}` retornar `undefined`:**
- ❌ `event_id` não está chegando no servidor
- ❌ Variável não está lendo corretamente

---

### **3. Verificar se tag está usando event_id:**

**No GTM Server-Side:**
1. Abrir tag `FB - ViewContent`
2. Ir para "Server Event Data Override"
3. Verificar se há:
   - Property Name: `event_id`
   - Property Value: `{{ed - event_id}}`

**Se não houver:**
- ❌ Tag não está enviando `event_id`
- ❌ Facebook deduplica por outros critérios

---

## ✅ SE event_id NÃO ESTÁ CHEGANDO

**Causa:** `event_id` não está sendo enviado no DataLayer ou não está chegando no servidor.

**Solução:**
1. Verificar se código está enviando `event_id`
2. Verificar se Data Tag está enviando `event_id`
3. Verificar path da variável `ed - event_id`

---

## ✅ SE event_id ESTÁ CHEGANDO MAS AINDA DESDUPLICA

**Causa:** Há outro sistema enviando com mesmo `event_id` ANTES.

**Solução:**
1. Verificar Stape.io Dashboard
2. Desativar interceptação automática
3. Remover script do Stape

---

## 🎯 RESPOSTA DIRETA

**SIM, pode ter a ver com event_id se:**
- ❌ `event_id` não está chegando no servidor (`{{ed - event_id}}` = `undefined`)
- ❌ Tag não está usando `event_id` (não está no "Server Event Data Override")
- ❌ Stape está gerando `event_id` diferente

**Verificar primeiro:**
1. ✅ Se `event_id` está no DataLayer (console)
2. ✅ Se `{{ed - event_id}}` retorna valor (GTM Preview)
3. ✅ Se tag está usando `event_id` (configuração da tag)


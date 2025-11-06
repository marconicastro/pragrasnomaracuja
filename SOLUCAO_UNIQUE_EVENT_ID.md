# 🔧 SOLUÇÃO: Unique Event ID no GTM Server-Side

**Problema:** GTM Server-Side usa variável "Unique Event ID" que pode não estar usando o `event_id` que enviamos

---

## 🔍 DIAGNÓSTICO

### **Como funciona:**
1. **Código envia:** `event_id` no DataLayer
2. **GTM Server-Side:** Usa variável "Unique Event ID" nas tags
3. **Problema:** "Unique Event ID" pode estar gerando um novo ID ao invés de usar o `event_id` enviado

---

## ✅ SOLUÇÃO

### **Opção 1: Garantir que GTM use o `event_id` enviado**

A variável "Unique Event ID" do GTM geralmente:
- ✅ Lê `event_id` do DataLayer se existir
- ❌ Gera um novo ID se não existir

**Verificar:**
1. Se `event_id` está sendo enviado corretamente no DataLayer
2. Se a variável "Unique Event ID" está configurada para ler do DataLayer

### **Opção 2: Criar variável Event Data para `event_id`**

**Criar variável no GTM Server-Side:**
- Nome: `ed - event_id`
- Tipo: **Event Data Variable**
- Event Data Parameter Name: `event_id`
- Usar nas tags: `{{ed - event_id}}` ao invés de `{{Unique Event ID}}`

**Vantagem:**
- ✅ Garante que usa o `event_id` que enviamos
- ✅ Mesmo ID para browser e server (deduplicação funciona)

---

## 📋 VERIFICAÇÃO

### **1. Verificar se `event_id` está sendo enviado:**
```javascript
// No console do navegador:
window.dataLayer.forEach(e => {
  if (e.event_id) {
    console.log('Event:', e.event, 'event_id:', e.event_id);
  }
});
```

### **2. Verificar no GTM Debug Mode:**
- Abrir GTM Server-Side → Preview/Debug
- Verificar se `{{ed - event_id}}` retorna o valor correto
- Verificar se `{{Unique Event ID}}` retorna o mesmo valor

### **3. Se `{{Unique Event ID}}` retornar valor diferente:**
- Criar variável `ed - event_id` (Event Data Variable)
- Atualizar tags para usar `{{ed - event_id}}` ao invés de `{{Unique Event ID}}`

---

## 🎯 RECOMENDAÇÃO

**Usar `{{ed - event_id}}` ao invés de `{{Unique Event ID}}` nas tags:**
- ✅ Garante que usa o `event_id` que enviamos
- ✅ Mesmo ID para browser e server
- ✅ Deduplicação funciona corretamente

---

## 📝 PRÓXIMOS PASSOS

1. ✅ Verificar se `event_id` está sendo enviado no DataLayer
2. ✅ Criar variável `ed - event_id` no GTM Server-Side
3. ✅ Atualizar tags para usar `{{ed - event_id}}`
4. ✅ Testar deduplicação


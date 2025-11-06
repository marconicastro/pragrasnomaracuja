# 🔧 CORREÇÃO: Usar event_id do DataLayer ao invés de "Unique Event ID"

**Problema:** Variável "Unique Event ID" do GTM gera um novo ID ao invés de usar o `event_id` enviado

---

## 🔍 PROBLEMA IDENTIFICADO

### **Como funciona atualmente:**
1. **Código envia:** `event_id: "PageView_1234567890_abc123"` no DataLayer
2. **GTM Server-Side:** Usa variável "Unique Event ID" nas tags
3. **"Unique Event ID" gera:** `"1762265997000_17624410479915"` (novo ID diferente!)
4. **Resultado:** Browser e Server usam IDs diferentes → **não deduplica** ❌

### **Por quê acontece:**
- A variável "Unique Event ID" do Stape.io **gera um novo ID** baseado em:
  - `gtmBrowserId` (localStorage)
  - `gtmPageLoadId` (window)
  - `gtm.uniqueEventId` (DataLayer)
- **NÃO usa** o `event_id` que enviamos no DataLayer

---

## ✅ SOLUÇÃO

### **1. Criar variável Event Data para `event_id`**

**No GTM Server-Side:**
1. Ir em **Variables** → **New**
2. Nome: `ed - event_id`
3. Tipo: **Event Data Variable**
4. Event Data Parameter Name: `event_id`
5. Salvar

### **2. Atualizar todas as tags do Facebook**

**Substituir:**
- ❌ `{{Unique Event ID}}` 
- ✅ `{{ed - event_id}}`

**Tags a atualizar:**
- FB - PageView
- FB - ViewContent
- FB - AddToCart
- FB - InitiateCheckout
- FB - Lead
- FB - Purchase

**Onde atualizar:**
- Campo **Event ID** (ou `eventId`) nas tags do Facebook

---

## 📋 PASSO A PASSO

### **1. Criar variável `ed - event_id`:**

```
GTM Server-Side → Variables → New
├─ Variable Type: Event Data Variable
├─ Variable Name: ed - event_id
├─ Event Data Parameter Name: event_id
└─ Save
```

### **2. Atualizar cada tag do Facebook:**

**Exemplo para FB - PageView:**
```
Tag: FB - PageView
├─ Event ID: {{ed - event_id}}  ← Mudar de {{Unique Event ID}}
└─ Save
```

**Repetir para:**
- FB - ViewContent
- FB - AddToCart
- FB - InitiateCheckout
- FB - Lead
- FB - Purchase

---

## 🎯 RESULTADO ESPERADO

### **Antes (com problema):**
- Browser: `event_id: "PageView_1234567890_abc123"`
- Server: `{{Unique Event ID}}` → `"1762265997000_17624410479915"` ❌
- **Meta recebe 2 IDs diferentes → não deduplica**

### **Depois (corrigido):**
- Browser: `event_id: "PageView_1234567890_abc123"`
- Server: `{{ed - event_id}}` → `"PageView_1234567890_abc123"` ✅
- **Meta recebe mesmo ID → deduplica corretamente**

---

## ✅ VERIFICAÇÃO

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
- Deve retornar o mesmo `event_id` que foi enviado no DataLayer

### **3. Verificar no Meta Events Manager:**
- Eventos devem aparecer como "Desduplicado" quando browser e server usam mesmo `event_id`

---

## 📝 RESUMO

✅ **Solução:**
1. Criar variável `ed - event_id` (Event Data Variable)
2. Atualizar todas as tags do Facebook para usar `{{ed - event_id}}`
3. Garantir que browser e server usam o mesmo `event_id`

✅ **Resultado:**
- Browser e Server usam mesmo `event_id`
- Meta deduplica corretamente
- Eventos não aparecem duplicados


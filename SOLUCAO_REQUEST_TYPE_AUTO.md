# ✅ SOLUÇÃO: Request Type "Auto" Causando Deduplicação

## 🔍 PROBLEMA IDENTIFICADO

**"Request type" está como "Auto" nas Data Tags!**

**"Auto" faz:**
- ❌ Stape intercepta eventos do DataLayer
- ❌ Envia automaticamente para Meta ANTES do servidor processar
- ❌ Causa deduplicação

---

## ✅ SOLUÇÃO: Alterar para "POST"

### **No GTM Web Container:**

1. **Ir para Tags**
2. **Para cada Data Tag (`DT - *`):**
   - `DT - page_view`
   - `DT - view_item`
   - `DT - add_to_cart`
   - `DT - begin_checkout`
   - `DT - generate_lead`
   - `DT - purchase`

3. **Abrir cada Data Tag**
4. **Ir para Settings**
5. **"Request type" → Alterar de "Auto" para "POST"**
6. **Salvar**

7. **Repetir para todas as Data Tags**

8. **Publicar o container**

---

## 🎯 DIFERENÇA ENTRE AS OPÇÕES

### **"Auto":**
- ❌ Intercepta eventos do DataLayer
- ❌ Envia automaticamente para Meta
- ❌ Causa deduplicação

### **"POST":**
- ✅ Envia apenas para GTM Server-Side (via POST)
- ✅ NÃO intercepta eventos
- ✅ NÃO envia para Meta automaticamente
- ✅ Permite que servidor processe primeiro

### **"GET":**
- ✅ Envia apenas para GTM Server-Side (via GET)
- ✅ NÃO intercepta eventos
- ✅ NÃO envia para Meta automaticamente
- ⚠️ Menos comum, POST é preferível

---

## 🎯 RESULTADO ESPERADO

**Após alterar para "POST":**
- ✅ Data Tags apenas enviam para GTM Server-Side
- ✅ NÃO enviam automaticamente para Meta
- ✅ GTM Server-Side processa e envia para Meta
- ✅ Sem duplicação
- ✅ Eventos chegam como "Processado"

---

## ⚠️ IMPORTANTE

**Manter essas configurações:**
- ✅ Path: `/data`
- ✅ Protocol version: `2`
- ✅ Data Tag Script URL: `https://stapecdn.com/dtag/v8.js` (pode manter)
- ✅ Push event to DataLayer: Desmarcado (já está)
- ✅ Support rich command protocol: Desmarcado (já está)
- ✅ Use fetch instead of XMLHttpRequest: Desmarcado (já está)

**Alterar apenas:**
- ❌ Request type: "Auto" → ✅ "POST"

---

## ✅ CONCLUSÃO

**Problema:**
- ❌ Request type "Auto" intercepta e envia para Meta

**Solução:**
- ✅ Alterar para "POST" em todas as Data Tags
- ✅ Deixar apenas GTM Server-Side enviar para Meta

**Resultado:**
- ✅ Sem duplicação
- ✅ Eventos chegam como "Processado"


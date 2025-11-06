# ✅ SOLUCAO: "Send common data" Causando Deduplicação

## 🔍 PROBLEMA IDENTIFICADO

**"Send common data" está marcado nas Data Tags do Stape!**

Esta opção faz o Stape Data Tag enviar dados automaticamente para Meta ANTES do GTM Server-Side processar.

---

## ✅ SOLUÇÃO: DESMARCAR "Send common data"

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
4. **Procurar por: "Send common data" ou "Add common data"**
5. **DESMARCAR a caixa**
6. **Salvar**

7. **Repetir para todas as Data Tags**

8. **Publicar o container**

---

## 🎯 RESULTADO ESPERADO

**Após desmarcar "Send common data":**
- ✅ Data Tags apenas enviam para GTM Server-Side
- ✅ NÃO enviam automaticamente para Meta
- ✅ Apenas GTM Server-Side envia para Meta
- ✅ Sem duplicação
- ✅ Eventos chegam como "Processado"

---

## ⚠️ IMPORTANTE

**"Send common data" faz:**
- ❌ Enviar dados automaticamente para Meta
- ❌ Interceptar eventos do DataLayer
- ❌ Enviar antes do servidor processar

**Sem "Send common data":**
- ✅ Data Tags apenas enviam para GTM Server-Side
- ✅ GTM Server-Side processa e envia para Meta
- ✅ Sem duplicação

---

## ✅ CONCLUSÃO

**Problema:**
- ❌ "Send common data" está marcado
- ❌ Causa envio automático para Meta

**Solução:**
- ✅ Desmarcar "Send common data" em todas as Data Tags
- ✅ Deixar apenas GTM Server-Side enviar para Meta

**Resultado:**
- ✅ Sem duplicação
- ✅ Eventos chegam como "Processado"


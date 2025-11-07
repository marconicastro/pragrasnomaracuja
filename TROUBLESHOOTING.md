# 🆘 Troubleshooting - Problemas Comuns

## 🔴 **Eventos não aparecem no Facebook**

### **Sintoma:** Nenhum evento chega no Facebook Events Manager

**Checklist:**
1. ✅ GTM Server-Side está publicado?
2. ✅ Pixel ID correto nas tags?
3. ✅ Test Event Code configurado? (remover em produção)
4. ✅ Firewall/AdBlock bloqueando requisições?

**Solução:**
```bash
# 1. Verificar no GTM Server Preview
# 2. Ver se eventos chegam no servidor
# 3. Ver se tags disparam
# 4. Ver se há erros nas tags
```

---

## ⚠️ **Eventos duplicados**

### **Sintoma:** Mesmo evento aparece 2x no Facebook

**Causa:** Deduplicação não funcionando

**Checklist:**
1. ✅ `event_id` está sendo enviado?
2. ✅ `event_id` é o MESMO no navegador e servidor?
3. ✅ Variável `{{event_id}}` existe no GTM Web e Server?

**Solução:**
```typescript
// Verificar no console do navegador
window.dataLayer.forEach(e => {
  if (e.event_id) console.log(e.event, e.event_id);
});

// event_id deve ser único por evento
// Navegador e servidor devem usar o MESMO event_id
```

---

## 🐌 **Timeout ao enviar eventos**

### **Sintoma:** Tag do Facebook dá timeout no GTM Server

**Causa:** Payload muito grande ou campos undefined

**Checklist:**
1. ✅ `country` e `user_id` têm valores válidos?
2. ✅ Arrays não estão vazios?
3. ✅ Timeout da tag está em 5000ms+?

**Solução:**
```bash
# 1. Verificar payload no GTM Server Preview
# 2. Remover campos undefined
# 3. Aumentar timeout da tag (Advanced Settings)
```

---

## ❌ **"País" não aparece no navegador**

### **Sintoma:** Facebook mostra "País" no servidor, mas não no navegador

**Causa:** Advanced Matching não está recebendo `country`

**Checklist:**
1. ✅ Variável `{{dlv - user_data.country}}` existe no GTM Web?
2. ✅ Advanced Matching tem campo `cn` mapeado para `{{dlv - user_data.country}}`?
3. ✅ DataLayer está enviando `country` no nível raiz?

**Solução:**
```javascript
// Verificar no console
window.dataLayer.forEach(e => {
  if (e.event === 'begin_checkout') {
    console.log('country:', e.country);
    console.log('user_data:', e.user_data);
  }
});

// country deve estar presente e ser 'br' ou similar
```

---

## 🔧 **Variável `ed - items` não funciona**

### **Sintoma:** Items não aparecem no Facebook Server

**Causa:** keyPath da variável está errado

**Solução:**
```bash
# GTM Server-Side
# 1. Abrir variável "ed - items"
# 2. Verificar Key Path
# 3. Deve ser apenas: items
# 4. NÃO deve ser: [{"item_id":"..."}]

# ERRADO:
keyPath: "[{\"item_id\":\"hacr962\",...}]"

# CORRETO:
keyPath: "items"
```

---

## 🚨 **Purchase não chega via webhook**

### **Sintoma:** Evento Purchase não aparece após pagamento

**Checklist:**
1. ✅ Cakto está enviando webhook?
2. ✅ URL do webhook está correta?
3. ✅ Endpoint `/api/webhook-cakto` está funcionando?
4. ✅ Vercel KV está configurado?

**Debug:**
```bash
# 1. Ver logs da Vercel
# 2. Ver logs do Cakto
# 3. Testar webhook manualmente com Postman/Insomnia
# 4. Ver API route /api/webhook-cakto/route.ts
```

---

## 💡 **Dicas Gerais**

### **GTM Preview Mode**
- Sempre usar `?gtm_debug=1` ao testar
- Verificar AMBOS os containers (Web + Server)
- Ver quais tags disparam e quais não

### **Facebook Events Manager**
- Usar Test Event Code durante desenvolvimento
- Remover em produção
- Filtrar por event_id para acompanhar deduplicação

### **Browser Console**
```javascript
// Ver todos os eventos enviados
window.dataLayer

// Ver último evento
window.dataLayer[window.dataLayer.length - 1]

// Filtrar por tipo
window.dataLayer.filter(e => e.event === 'begin_checkout')
```

---

## 📞 **Suporte**

Se o problema persistir:
1. Ver logs da Vercel
2. Ver GTM Preview Mode
3. Ver Facebook Events Manager
4. Ver browser console

**Rollback rápido:**
```bash
git log --oneline -10  # Ver últimos commits
git revert <commit-hash>  # Reverter commit problemático
git push
```


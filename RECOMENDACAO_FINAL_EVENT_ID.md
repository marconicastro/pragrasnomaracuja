# ✅ RECOMENDAÇÃO FINAL: event_id no DataLayer

**Decisão:** Manter `event_id` no DataLayer e usar nas tags do Facebook

---

## 🎯 POR QUE MANTER `event_id` NO DATALAYER?

### **1. Deduplicação Funciona Corretamente**
- ✅ Browser e Server usam **mesmo** `event_id`
- ✅ Meta deduplica corretamente
- ✅ Eventos não aparecem duplicados

### **2. Prática Recomendada pelo Facebook**
- ✅ Facebook recomenda usar `event_id` para deduplicação
- ✅ Documentação oficial confirma isso
- ✅ Melhor EQM (Event Quality Match)

### **3. Simples de Implementar**
- ✅ Código já está enviando `event_id` corretamente
- ✅ Apenas criar 1 variável no GTM (`ed - event_id`)
- ✅ Atualizar tags para usar `{{ed - event_id}}`

---

## ❌ POR QUE NÃO DESATIVAR?

### **Problema com "Unique Event ID" do GTM:**
- ❌ Gera IDs diferentes para browser e server
- ❌ Quebra deduplicação
- ❌ Eventos aparecem duplicados no Meta

### **Exemplo do Problema:**
```
Browser:  event_id: "PageView_1234567890_abc123"
Server:   {{Unique Event ID}} → "1762265997000_17624410479915" (DIFERENTE!)
Resultado: Meta recebe 2 IDs diferentes → NÃO deduplica ❌
```

---

## ✅ SOLUÇÃO RECOMENDADA (SIMPLES)

### **Passo 1: Criar Variável no GTM Server-Side**
```
GTM Server-Side → Variables → New
├─ Variable Type: Event Data Variable
├─ Variable Name: ed - event_id
├─ Event Data Parameter Name: event_id
└─ Save
```

### **Passo 2: Atualizar Tags do Facebook**
```
Substituir em todas as tags:
❌ {{Unique Event ID}}
✅ {{ed - event_id}}
```

**Tags a atualizar:**
- FB - PageView
- FB - ViewContent
- FB - AddToCart
- FB - InitiateCheckout
- FB - Lead
- FB - Purchase

---

## 📊 COMPARAÇÃO

| Abordagem | Deduplicação | Complexidade | Recomendado |
|-----------|--------------|--------------|-------------|
| **Manter `event_id` no DataLayer** | ✅ Funciona | ⭐ Simples | ✅ **SIM** |
| Desativar `event_id` (usar Unique Event ID) | ❌ Não funciona | ⭐ Simples | ❌ Não |

---

## 🎯 CONCLUSÃO

**Recomendação:** Manter `event_id` no DataLayer e usar `{{ed - event_id}}` nas tags.

**Por quê:**
1. ✅ Deduplicação funciona corretamente
2. ✅ Prática recomendada pelo Facebook
3. ✅ Simples de implementar (1 variável + atualizar tags)
4. ✅ Código já está correto

**Tempo de implementação:** ~5 minutos
**Benefício:** Deduplicação correta + Melhor EQM

---

## 📝 PRÓXIMOS PASSOS

1. ✅ Criar variável `ed - event_id` no GTM Server-Side
2. ✅ Atualizar todas as tags do Facebook para usar `{{ed - event_id}}`
3. ✅ Testar deduplicação no Meta Events Manager
4. ✅ Verificar se eventos aparecem como "Desduplicado"


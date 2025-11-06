# ✅ PASSO A PASSO: Criar Variável `ed - event_id`

**Status:** Tags já estão configuradas corretamente! ✅  
**Falta apenas:** Criar a variável `ed - event_id` no GTM Server-Side

---

## 🎯 SITUAÇÃO ATUAL

### **✅ O que já está correto:**
- ✅ Todas as tags do Facebook já usam `{{ed - event_id}}` no campo "Event ID"
- ✅ Configuração das tags está perfeita
- ✅ Código está enviando `event_id` no DataLayer

### **❌ O que falta:**
- ❌ Variável `ed - event_id` não existe no GTM Server-Side
- ❌ Por isso `{{ed - event_id}}` retorna `undefined`

---

## ✅ SOLUÇÃO (2 MINUTOS)

### **Passo 1: Criar Variável no GTM Server-Side**

1. **Abrir GTM Server-Side Container**
   - Ir em: https://tagmanager.google.com
   - Selecionar container: **GTM Server-Side** (não o Web)

2. **Criar Nova Variável**
   - Clicar em: **Variables** (menu lateral esquerdo)
   - Clicar em: **New** (botão no topo)

3. **Configurar Variável**
   ```
   Variable Configuration:
   ├─ Variable Type: Event Data Variable
   ├─ Variable Name: ed - event_id
   ├─ Event Data Parameter Name: event_id
   └─ Save
   ```

4. **Salvar e Publicar**
   - Clicar em: **Save**
   - Clicar em: **Submit** (para publicar)
   - Adicionar descrição: "Event ID do DataLayer para deduplicação"

---

## 🎯 RESULTADO ESPERADO

### **Antes (com problema):**
- `{{ed - event_id}}` → `undefined` ❌
- Tags enviam sem `event_id` → Meta não deduplica

### **Depois (corrigido):**
- `{{ed - event_id}}` → `"PageView_1234567890_abc123"` ✅
- Tags enviam com `event_id` → Meta deduplica corretamente

---

## 📋 VERIFICAÇÃO

### **1. Verificar se variável foi criada:**
- GTM Server-Side → Variables
- Procurar por: `ed - event_id`
- Deve aparecer na lista ✅

### **2. Verificar no Debug Mode:**
- GTM Server-Side → Preview/Debug
- Disparar um evento (ex: PageView)
- Verificar se `{{ed - event_id}}` retorna valor (não `undefined`)

### **3. Verificar no Meta Events Manager:**
- Eventos devem aparecer como "Desduplicado" quando browser e server usam mesmo `event_id`

---

## ✅ CHECKLIST FINAL

- [ ] Criar variável `ed - event_id` no GTM Server-Side
- [ ] Publicar container
- [ ] Testar no Debug Mode
- [ ] Verificar se `{{ed - event_id}}` retorna valor
- [ ] Verificar deduplicação no Meta Events Manager

---

## 📝 RESUMO

**O que fazer:**
1. ✅ Criar variável `ed - event_id` (Event Data Variable)
2. ✅ Publicar container
3. ✅ Pronto! Tags já estão configuradas corretamente

**Tempo estimado:** 2 minutos  
**Dificuldade:** ⭐ Muito fácil

---

## 🎯 PRÓXIMOS PASSOS

Depois de criar a variável:
1. Testar um evento no Debug Mode
2. Verificar se `{{ed - event_id}}` retorna valor
3. Verificar deduplicação no Meta Events Manager
4. Se tudo funcionar → ✅ Problema resolvido!


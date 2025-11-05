# 🔧 SOLUÇÃO FINAL: Tag Não Dispara - Trigger Não Vinculado

**Problema identificado:** Tag "FB - Purchase" mostra "Nenhum acionador de disparo" → Trigger não está vinculado ou não está disparando.

---

## 🔍 ANÁLISE

### **O que está acontecendo:**
- ✅ Evento chega corretamente
- ✅ Variável Event Data criada (`ed - event`)
- ❌ **Tag não tem trigger vinculado** ou trigger não dispara
- ❌ Resultado: Tag não dispara

---

## ✅ SOLUÇÃO PASSO A PASSO

### **PASSO 1: Verificar se Variável Event Data Funciona**

1. **Abrir evento no stream do GTM**
2. **Ir em "Variáveis"**
3. **Procurar por `{{ed - event}}`**
4. **Verificar se tem valor `"purchase"`**

**Se não aparecer ou estiver `undefined`:**
- Variável pode estar com nome errado
- Verificar se Variable Name está como `event` (sem chaves, sem aspas)

---

### **PASSO 2: Criar Trigger Novo (SE NÃO FUNCIONAR)**

**Criar trigger do zero:**

1. **GTM Server-Side → Triggers → Novo**
2. **Nome:** `ce - purchase (test)`
3. **Tipo:** Evento personalizado
4. **Nome do evento:** `Data`
5. **Usar correspondência de regex:** ❌ NÃO marcar
6. **Filtros:**
   - Campo: `{{ed - event}}`
   - Operador: `igual a`
   - Valor: `purchase`
7. **Salvar**

---

### **PASSO 3: Vincular Trigger à Tag**

1. **GTM Server-Side → Tags → "FB - Purchase"**
2. **Ir em "Acionadores" (Triggers)**
3. **Adicionar trigger:**
   - Clicar em "Adicionar acionador"
   - Selecionar `ce - purchase (test)` (ou o trigger que você criou)
4. **Salvar tag**

---

### **PASSO 4: Verificar Outras Tags**

**Verificar tag "GA4 - All Events":**
1. **GTM Server-Side → Tags → "GA4 - All Events"**
2. **Verificar se tem trigger vinculado**
3. **Se não tiver, adicionar também**

---

## 🔍 TESTE ALTERNATIVO: Trigger Sem Filtros

**Se ainda não funcionar, criar trigger que aceita TODOS os eventos "Data":**

1. **GTM Server-Side → Triggers → Novo**
2. **Nome:** `ce - data (all)`
3. **Tipo:** Evento personalizado
4. **Nome do evento:** `Data`
5. **SEM FILTROS** (deixar vazio)
6. **Salvar**
7. **Vincular à tag "FB - Purchase"**

**Isso vai disparar para TODOS os eventos "Data", mas serve para testar se o problema é o filtro!**

---

## 📝 CHECKLIST COMPLETO

- [ ] Variável `ed - event` criada?
- [ ] Variável aparece no stream com valor `"purchase"`?
- [ ] Trigger criado?
- [ ] Trigger configurado com `event_name = "Data"`?
- [ ] Trigger tem filtro `{{ed - event}} = purchase`?
- [ ] Trigger está vinculado à tag "FB - Purchase"?
- [ ] Tag está ativa?
- [ ] Workspace publicado?

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Verificar se variável `{{ed - event}}` aparece no stream**
2. ✅ **Criar trigger novo se necessário**
3. ✅ **Vincular trigger à tag**
4. ✅ **Publicar workspace**
5. ✅ **Testar webhook novamente**

---

**Status**: Verificar variável, criar trigger e vincular à tag





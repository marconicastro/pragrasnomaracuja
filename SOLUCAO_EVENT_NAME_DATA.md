# ✅ SOLUÇÃO: Event Name = "Data" ao invés de "purchase"

**Problema identificado:** 
- ✅ Evento chega corretamente com `event: "purchase"` nos dados
- ❌ Mas `event_name` no GTM é `"Data"` (padrão para webhooks)
- ❌ Trigger "ce - purchase" procura por `event_name = "purchase"` → não encontra!

---

## 🔍 PROBLEMA

### **O que está acontecendo:**
- Evento chega via webhook → GTM Server-Side converte `event_name` para `"Data"` (padrão)
- Campo `event: "purchase"` fica nos **dados do evento** (não no `event_name`)
- Trigger procura `event_name = "purchase"` → não encontra → tags não disparam

### **Evidências:**
- `event_name = "Data"` ✅
- `event = "purchase"` (nos dados do evento) ✅
- Client Name = "Webhook Client" ✅

---

## ✅ SOLUÇÃO

### **Opção 1: Ajustar Trigger para "Data" + Filtro (RECOMENDADO)**

**Ajustar trigger "ce - purchase":**

1. **Abrir trigger "ce - purchase" no GTM Server-Side**
2. **Mudar "Nome do evento":**
   - De: `purchase`
   - Para: `Data`
3. **Adicionar filtro adicional:**
   - Campo: `event` (variável Data Layer)
   - Operador: `igual a`
   - Valor: `purchase`
4. **Salvar e publicar**

**Resultado:**
- Trigger procura `event_name = "Data"` ✅
- E verifica se `event = "purchase"` nos dados ✅
- Tags disparam! ✅

---

### **Opção 2: Criar Variável Customizada**

**Criar variável para pegar `event` dos dados:**

1. **GTM Server-Side → Variáveis → Nova**
2. **Nome:** `Event Name from Data`
3. **Tipo:** Data Layer Variable
4. **Data Layer Variable Name:** `event`
5. **Usar no trigger:**
   - Criar novo trigger ou ajustar existente
   - Event Name: Usar variável `{{Event Name from Data}}`
   - Ou usar como filtro: `{{Event Name from Data}} = purchase`

---

### **Opção 3: Criar Trigger Separado para Webhook**

**Criar trigger específico para webhook:**

1. **GTM Server-Side → Triggers → Novo**
2. **Nome:** `ce - purchase (webhook)`
3. **Tipo:** Evento personalizado
4. **Nome do evento:** `Data`
5. **Filtros:**
   - `event = purchase` (usando variável Data Layer `event`)
   - `client_name = Webhook Client` (opcional, para garantir)
6. **Vincular tag "FB - Purchase" a este trigger também**

---

## 🎯 RECOMENDAÇÃO

**Opção 1 é a mais simples e direta:**
- Ajustar trigger existente
- Não precisa criar novas variáveis ou triggers
- Funciona imediatamente

---

## 📝 PASSOS PARA CORRIGIR (OPÇÃO 1)

1. ✅ **Abrir GTM Server-Side → Triggers → "ce - purchase"**
2. ✅ **Mudar "Nome do evento":**
   - De: `purchase`
   - Para: `Data`
3. ✅ **Adicionar filtro:**
   - Tipo: Variável Data Layer
   - Nome da variável: `event`
   - Operador: `igual a`
   - Valor: `purchase`
4. ✅ **Salvar e publicar**
5. ✅ **Testar webhook novamente**

---

## 🔍 VERIFICAÇÃO APÓS CORRIGIR

Após ajustar o trigger:
1. ✅ Testar webhook via ReqBin
2. ✅ Verificar no stream:
   - `event_name = "Data"` ✅
   - `event = "purchase"` (nos dados) ✅
3. ✅ Verificar se tags disparam:
   - FB - Purchase deve disparar ✅
   - GA4 - All Events deve disparar ✅

---

**Status**: Problema identificado! Ajustar trigger para `event_name = "Data"` + filtro `event = "purchase"`





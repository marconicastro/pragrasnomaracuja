# 🔧 SOLUCAO: Variável Event Data Retorna Undefined

**Problema:** `{{ed - event}}` retorna `undefined`, então Event Data Variable não está acessando o campo `event`.

---

## 🔍 ANÁLISE

### **O que está acontecendo:**
- ✅ Evento chega com `event: "purchase"` nos dados
- ❌ `{{ed - event}}` retorna `undefined`
- ❌ Event Data Variable não está funcionando

### **Possíveis causas:**
1. Event Data Variable precisa de path específico
2. Campo `event` não está acessível via Event Data Variable
3. Precisa usar Data Layer Variable ao invés

---

## ✅ SOLUÇÕES

### **Solução 1: Usar Data Layer Variable (TESTAR AGORA)**

**Criar variável Data Layer:**

1. **GTM Server-Side → Variáveis → Novo**
2. **Nome:** `dlv - event`
3. **Tipo:** Data Layer Variable
4. **Data Layer Variable Name:** `event`
5. **Data Layer Version:** Versão 2
6. **Salvar**

**No trigger:**
- Campo: `{{dlv - event}}` (Data Layer Variable)
- Operador: `igual a`
- Valor: `purchase`

---

### **Solução 2: Criar Trigger SEM Filtro de Event**

**Criar trigger que aceita TODOS os eventos "Data":**

1. **GTM Server-Side → Triggers → Novo**
2. **Nome:** `ce - data (all)`
3. **Tipo:** Evento personalizado
4. **Nome do evento:** `Data`
5. **SEM FILTROS** (deixar completamente vazio)
6. **Salvar**

**Vincular à tag:**
- Tag "FB - Purchase" → Adicionar trigger `ce - data (all)`

**Isso vai disparar para TODOS os eventos "Data"!**

**Depois, podemos filtrar na própria tag ou criar lógica mais específica.**

---

### **Solução 3: Usar Filtro de Client Name**

**Se queremos apenas eventos do webhook:**

1. **Trigger:** `ce - data (all)`
2. **Filtro adicional:**
   - Campo: `{{Client Name}}`
   - Operador: `igual a`
   - Valor: `Data Client`
3. **Salvar**

---

## 🎯 RECOMENDAÇÃO IMEDIATA

**Solução 2 é a mais rápida:**
1. ✅ Criar trigger `ce - data (all)` sem filtros
2. ✅ Vincular à tag "FB - Purchase"
3. ✅ Testar
4. ✅ Se funcionar, depois podemos adicionar filtros mais específicos

---

## 📝 PASSOS PARA TESTAR

1. ✅ **Criar trigger `ce - data (all)` sem filtros**
2. ✅ **Vincular à tag "FB - Purchase"**
3. ✅ **Publicar workspace**
4. ✅ **Testar webhook**
5. ✅ **Verificar se tag dispara**

---

**Status**: Criar trigger sem filtros para testar


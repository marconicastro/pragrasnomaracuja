# 🔧 SOLUÇÃO: Trigger Simples para Testar

**Vamos criar um trigger completamente novo e simples para testar!**

---

## 🎯 SOLUÇÃO: Criar Trigger Novo e Simples

### **Passo 1: Criar Variável Data Layer para "event"**

1. **GTM Server-Side → Variáveis → Novo**
2. **Nome:** `dlv - event`
3. **Tipo:** Data Layer Variable
4. **Data Layer Variable Name:** `event`
5. **Salvar**

---

### **Passo 2: Criar Trigger Novo e Simples**

1. **GTM Server-Side → Triggers → Novo**
2. **Nome:** `ce - purchase (webhook test)`
3. **Tipo:** Evento personalizado
4. **Nome do evento:** `Data`
5. **Filtros:**
   - **Campo 1:** `{{dlv - event}}`
   - **Operador:** `igual a`
   - **Valor:** `purchase`
6. **Salvar**

---

### **Passo 3: Verificar se Tag está Vinculada**

1. **GTM Server-Side → Tags → "FB - Purchase"**
2. **Verificar Trigger:**
   - Deve estar vinculado ao trigger "ce - purchase" OU "ce - purchase (webhook test)"
3. **Se não estiver, adicionar:**
   - Adicionar trigger "ce - purchase (webhook test)" à tag

---

## 🔍 VERIFICAÇÃO ALTERNATIVA: Trigger Sem Filtros

### **Criar trigger ainda mais simples:**

1. **GTM Server-Side → Triggers → Novo**
2. **Nome:** `ce - data (all)`
3. **Tipo:** Evento personalizado
4. **Nome do evento:** `Data`
5. **SEM FILTROS** (aceita todos os eventos "Data")
6. **Salvar**

**Problema:** Isso vai disparar para TODOS os eventos "Data", não só purchase.

**Solução:** Criar trigger mais específico após testar.

---

## 📝 CHECKLIST COMPLETO

### **Verificar Variável:**
- [ ] Variável `dlv - event` criada?
- [ ] Data Layer Variable Name = `event`?

### **Verificar Trigger:**
- [ ] Trigger criado?
- [ ] Nome do evento = `Data`?
- [ ] Filtro `{{dlv - event}} = purchase`?
- [ ] Trigger está ativo?

### **Verificar Tag:**
- [ ] Tag "FB - Purchase" está ativa?
- [ ] Tag tem trigger vinculado?
- [ ] Tag está publicada?

---

## 🧪 TESTE AGORA

1. ✅ **Criar variável `dlv - event`**
2. ✅ **Criar trigger `ce - purchase (webhook test)`**
3. ✅ **Vincular tag "FB - Purchase" ao novo trigger**
4. ✅ **Publicar workspace**
5. ✅ **Testar webhook via ReqBin**
6. ✅ **Verificar se tag dispara**

---

## 🔍 SE AINDA NÃO FUNCIONAR

### **Verificar no Stream:**
1. Abrir evento no stream
2. Ir em "Variáveis"
3. Verificar se `{{dlv - event}}` tem valor `"purchase"`
4. Se não tiver, a variável não está pegando o valor

### **Verificar Formato dos Dados:**
O evento pode estar em formato diferente. Verificar:
- `event` está no nível raiz dos dados?
- Ou está dentro de algum objeto?

---

**Status**: Criar trigger novo e simples para testar





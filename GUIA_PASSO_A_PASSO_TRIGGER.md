# 🔧 GUIA PASSO A PASSO: Criar Trigger que Funciona

**Vamos fazer do zero, passo a passo!**

---

## 📋 PASSO 1: Criar Variável Data Layer

### **1.1. Abrir GTM Server-Side**
- Ir em: **Variáveis** → **Nova**

### **1.2. Configurar Variável:**
- **Nome:** `dlv - event`
- **Tipo:** Data Layer Variable
- **Data Layer Variable Name:** `event`
- **Data Layer Version:** Versão 2
- **Salvar**

---

## 📋 PASSO 2: Criar Trigger Novo

### **2.1. Abrir GTM Server-Side**
- Ir em: **Triggers** → **Novo**

### **2.2. Configurar Trigger:**
- **Nome:** `ce - purchase (webhook)`
- **Tipo:** Evento personalizado
- **Nome do evento:** `Data`
- **Usar correspondência de regex:** ❌ NÃO marcar

### **2.3. Adicionar Filtro:**
- Clicar em **"Adicionar condição"**
- **Campo:** `{{dlv - event}}` (variável criada no passo 1)
- **Operador:** `igual a`
- **Valor:** `purchase`
- **Salvar**

---

## 📋 PASSO 3: Vincular Tag ao Trigger

### **3.1. Abrir Tag "FB - Purchase"**
- Ir em: **Tags** → **FB - Purchase**

### **3.2. Verificar Triggers:**
- Ver se o trigger "ce - purchase (webhook)" está na lista
- Se não estiver, **adicionar** o trigger
- **Salvar**

---

## 📋 PASSO 4: Publicar e Testar

### **4.1. Publicar Workspace:**
- Ir em: **Versões** → **Publicar**

### **4.2. Testar Webhook:**
- Enviar webhook via ReqBin
- Verificar no stream se tag dispara

---

## 🔍 SE AINDA NÃO FUNCIONAR

### **Verificar no Stream:**
1. Abrir evento no stream
2. Ir em **"Variáveis"**
3. Procurar por `{{dlv - event}}`
4. Verificar se tem valor `"purchase"`

### **Se não tiver valor:**
- A variável não está pegando o campo `event`
- Pode ser que o campo esteja em outro lugar
- Verificar estrutura completa dos dados do evento

---

## 🧪 TESTE ALTERNATIVO: Trigger Sem Filtros

### **Criar trigger que aceita TODOS os eventos "Data":**

1. **GTM Server-Side → Triggers → Novo**
2. **Nome:** `ce - data (all)`
3. **Tipo:** Evento personalizado
4. **Nome do evento:** `Data`
5. **SEM FILTROS** (deixar vazio)
6. **Salvar**

**Atenção:** Isso vai disparar para TODOS os eventos "Data", não só purchase.

**Mas serve para testar se o problema é o filtro!**

---

## 📝 CHECKLIST

- [ ] Variável `dlv - event` criada?
- [ ] Trigger `ce - purchase (webhook)` criado?
- [ ] Nome do evento = `Data`?
- [ ] Filtro `{{dlv - event}} = purchase`?
- [ ] Tag "FB - Purchase" tem trigger vinculado?
- [ ] Workspace publicado?
- [ ] Webhook testado?

---

**Status**: Criar do zero, passo a passo





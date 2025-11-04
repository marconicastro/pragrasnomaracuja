# 🎯 TRIGGER GA4 ALL EVENTS: Client Name vs Event Name

**Pergunta:** Devo usar **Client Name** ou **Event Name** na configuração do trigger da tag "GA4 - All Events" no GTM Server-Side?

---

## ✅ RESPOSTA: USE CLIENT NAME

### **Para a tag "GA4 - All Events", use:**
- ✅ **Client Name** = `Data Client`
- ❌ **NÃO use Event Name** (isso limitaria a apenas um evento específico)

---

## 📊 DIFERENÇA ENTRE OS DOIS

### **1. Client Name (RECOMENDADO para All Events)**

**O que faz:**
- Captura **TODOS os eventos** vindos de um cliente específico
- Exemplo: `Client Name = "Data Client"` → captura purchase, view_item, add_to_cart, etc.

**Quando usar:**
- ✅ Tag "GA4 - All Events" (captura todos os eventos)
- ✅ Quando você quer processar todos os eventos de um cliente

**Estrutura do trigger:**
```
Tipo: Custom Event
Filter: 
  - Client Name contém "Data Client"
```

**Resultado:**
- ✅ `purchase` → capturado
- ✅ `view_item` → capturado
- ✅ `add_to_cart` → capturado
- ✅ `begin_checkout` → capturado
- ✅ `generate_lead` → capturado
- ✅ `page_view` → capturado
- ✅ **TODOS os eventos** → capturados

---

### **2. Event Name (NÃO recomendado para All Events)**

**O que faz:**
- Captura **APENAS um evento específico**
- Exemplo: `Event Name = "purchase"` → captura apenas purchase

**Quando usar:**
- ✅ Tags específicas (ex: "GA4 - Purchase" apenas para purchase)
- ❌ **NÃO use** para tag "All Events" (limitiria a apenas um evento)

**Estrutura do trigger:**
```
Tipo: Custom Event
Custom Event Filter:
  - Event Name = "purchase"
Filter:
  - Client Name contém "Data Client"
```

**Resultado:**
- ✅ `purchase` → capturado
- ❌ `view_item` → **NÃO capturado**
- ❌ `add_to_cart` → **NÃO capturado**
- ❌ Outros eventos → **NÃO capturados**

---

## 🎯 CONFIGURAÇÃO CORRETA PARA "GA4 - All Events"

### **Opção 1: Trigger "All Events" (Mais Simples)**

**Criar trigger:**
1. GTM Server → **Triggers** → **Nova**
2. **Nome:** `All Events - Data Client`
3. **Tipo:** Custom Event
4. **Filtros:**
   - **Client Name** contém `Data Client`
5. **Salvar**

**Resultado:**
- ✅ Captura **TODOS os eventos** do Data Client
- ✅ Simples e eficiente

---

### **Opção 2: Trigger "Always" (Atual)**

**Você já tem:**
- Trigger: `todos os eventos ga4` (ID: 70)
- Tipo: `ALWAYS`

**Este trigger:**
- ✅ Dispara para **TODOS os eventos** (sem filtro)
- ⚠️ Pode capturar eventos de outros clients também

**Recomendação:**
- Se você quer apenas eventos do Data Client, use **Opção 1** (com filtro Client Name)
- Se você quer todos os eventos de qualquer client, mantenha "Always"

---

## 📋 COMPARAÇÃO: SEUS TRIGGERS ATUAIS

### **Triggers Específicos (dc - purchase, dc - view_item, etc.):**
```
Trigger: dc - purchase
├── Custom Event Filter: Event Name = "purchase"
└── Filter: Client Name contém "Data Client"
```

**Uso:** Tags específicas (FB - Purchase, etc.)

---

### **Trigger All Events (todos os eventos ga4):**
```
Trigger: todos os eventos ga4
├── Tipo: ALWAYS
└── Sem filtros
```

**Uso:** Tag "GA4 - All Events"

---

## ✅ RECOMENDAÇÃO FINAL

### **Para a tag "GA4 - All Events":**

**Use um trigger que:**
1. ✅ Filtra por **Client Name = "Data Client"**
2. ✅ **NÃO filtra** por Event Name (para capturar todos)

**Como criar:**
1. GTM Server → **Triggers** → **Nova**
2. **Nome:** `All Events - Data Client`
3. **Tipo:** Custom Event
4. **Filtros:**
   - **Client Name** contém `Data Client`
5. **Salvar**
6. Atualizar tag "GA4 - All Events" para usar este trigger

---

## 🔍 VERIFICAÇÃO

### **Como verificar se está funcionando:**

1. **GTM Preview Mode:**
   - Disparar eventos (purchase, view_item, etc.)
   - Verificar se a tag "GA4 - All Events" dispara para TODOS

2. **GA4 DebugView:**
   - Verificar se todos os eventos estão chegando
   - Verificar se `{{Event Name}}` está dinâmico

3. **Console:**
   - Verificar `window.dataLayer` após cada evento
   - Confirmar que eventos estão sendo enviados

---

## 📝 RESUMO

| Pergunta | Resposta |
|----------|----------|
| **Client Name ou Event Name?** | ✅ **Client Name** (para All Events) |
| **Para capturar todos os eventos?** | ✅ Filtre por **Client Name = "Data Client"** |
| **Para capturar apenas um evento?** | ✅ Use **Event Name** (ex: "purchase") |
| **Trigger atual está correto?** | ⚠️ "Always" funciona, mas melhor usar filtro Client Name |

---

## 🎯 CONCLUSÃO

**Para a tag "GA4 - All Events":**
- ✅ Use trigger com **Client Name = "Data Client"**
- ❌ **NÃO use** Event Name (limitiria a apenas um evento)
- ✅ Isso garante que **TODOS os eventos** sejam capturados

**Sua tag já está usando `{{Event Name}}` dinamicamente**, então ela vai pegar o nome do evento automaticamente. O trigger só precisa garantir que **todos os eventos** sejam capturados, não qual é o nome específico.

🎯 **Resumo:** Use **CLIENT NAME** no trigger, não Event Name!


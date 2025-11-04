# ✅ AJUSTE: Trigger "All Events - Data Client"

**Status:** ⚠️ Precisa de ajuste

---

## 📊 CONFIGURAÇÃO ATUAL

```
Trigger: All Events - Data Client
├── Tipo: Evento personalizado
├── Nome do evento: All Events - Data Client
└── Filtro: Client Name contém "Data Client"
```

**Tag associada:** GA4 -AllEvents ✅

---

## ⚠️ PROBLEMA IDENTIFICADO

### **"Nome do evento" está errado!**

No GTM Server-Side, quando você cria um trigger do tipo **"Evento personalizado"**, o campo **"Nome do evento"** é usado para **filtrar eventos específicos**.

**O que está acontecendo:**
- Você colocou: `Nome do evento = "All Events - Data Client"`
- Isso significa que o trigger **SÓ vai disparar** para eventos com nome exatamente igual a "All Events - Data Client"
- Como seus eventos têm nomes diferentes (`purchase`, `view_item`, `add_to_cart`, etc.), o trigger **NÃO vai disparar**!

---

## ✅ SOLUÇÃO

### **Opção 1: Deixar "Nome do evento" VAZIO (Recomendado)**

**Como corrigir:**
1. No trigger "All Events - Data Client"
2. **Deixar o campo "Nome do evento" VAZIO** (ou não preencher)
3. Manter apenas o filtro: **Client Name contém "Data Client"**
4. Salvar

**Resultado:**
- ✅ Dispara para **TODOS os eventos** do Data Client
- ✅ `purchase` → dispara
- ✅ `view_item` → dispara
- ✅ `add_to_cart` → dispara
- ✅ Todos os eventos → disparam

---

### **Opção 2: Usar Trigger "All Events"**

**Como criar:**
1. GTM Server → **Triggers** → **Nova**
2. **Nome:** `All Events - Data Client`
3. **Tipo:** **All Events** (não "Evento personalizado")
4. **Filtros:**
   - **Client Name** contém `Data Client`
5. **Salvar**

**Vantagem:**
- ✅ Mais claro que é para todos os eventos
- ✅ Não precisa se preocupar com "Nome do evento"

---

## 🔍 CONFIGURAÇÃO CORRETA

### **Se usar "Evento personalizado":**

```
Trigger: All Events - Data Client
├── Tipo: Evento personalizado
├── Nome do evento: [VAZIO] ← IMPORTANTE!
└── Filtros:
    └── Client Name contém "Data Client"
```

### **Se usar "All Events":**

```
Trigger: All Events - Data Client
├── Tipo: All Events
└── Filtros:
    └── Client Name contém "Data Client"
```

---

## ✅ CHECKLIST DE CORREÇÃO

- [ ] Abrir trigger "All Events - Data Client"
- [ ] **Remover** "All Events - Data Client" do campo "Nome do evento"
- [ ] **Deixar vazio** ou usar tipo "All Events"
- [ ] Manter filtro: Client Name contém "Data Client"
- [ ] Salvar
- [ ] Testar no Preview Mode

---

## 🧪 COMO TESTAR

### **1. GTM Preview Mode:**
1. Abrir Preview Mode
2. Disparar eventos (purchase, view_item, etc.)
3. Verificar se a tag "GA4 -AllEvents" dispara para **TODOS**

### **2. Se não disparar:**
- Verificar se o filtro "Client Name" está correto
- Verificar se os eventos estão vindo do "Data Client"
- Verificar se o campo "Nome do evento" está vazio

---

## 📝 RESUMO

| Campo | Valor Atual | Valor Correto |
|-------|-------------|---------------|
| **Tipo** | Evento personalizado | ✅ OK (ou usar "All Events") |
| **Nome do evento** | "All Events - Data Client" | ❌ **VAZIO** |
| **Filtro Client Name** | "Data Client" | ✅ OK |

---

## 🎯 CONCLUSÃO

**O problema:** Campo "Nome do evento" está preenchido com "All Events - Data Client"

**A solução:** **Deixar o campo "Nome do evento" VAZIO**

**Resultado:** O trigger vai disparar para **TODOS os eventos** do Data Client, não apenas para um evento específico.

**A tag "GA4 -AllEvents" já usa `{{Event Name}}` dinamicamente**, então ela vai pegar o nome correto do evento automaticamente. O trigger só precisa garantir que **todos os eventos sejam capturados**.

✅ **Correção:** Deixe o campo "Nome do evento" **VAZIO** e mantenha apenas o filtro "Client Name contém Data Client"!


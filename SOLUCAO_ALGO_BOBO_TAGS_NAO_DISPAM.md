# 🔍 SOLUÇÃO: Algo Bobo - Tags Não Disparam

**Problema:** Evento chega, mas tags não disparam. Provavelmente algo simples que está faltando.

---

## 🔍 VERIFICAÇÕES SIMPLES (FAÇA AGORA)

### **1. Verificar Event Name no Stream**

**No GTM Server-Side Preview Mode:**
1. Abrir o evento `purchase` no stream
2. Ir na aba **"Dados do evento"** (Event Data)
3. Verificar:
   - `event_name` → Qual é? (`"purchase"` ou `"Data"`?)
   - `event` → Qual é? (`"purchase"` ou outro?)

---

### **2. Verificar Trigger "ce - purchase"**

**Abrir trigger no GTM Server-Side:**
1. GTM Server-Side → Triggers → "ce - purchase"
2. Verificar:
   - **"Nome do evento"** → Qual está configurado?
     - Se for `"purchase"` → OK ✅
     - Se for `"Data"` → ❌ PROBLEMA!
   - **"Client Name"** → Tem algum filtro?
     - Se tiver "Client Name contém Data Client" → ❌ PROBLEMA!
     - Se não tiver filtro → OK ✅
     - Se tiver "Client Name contém Webhook Client" → OK ✅

---

### **3. Verificar se Tag está Ativa**

**Abrir tag no GTM Server-Side:**
1. GTM Server-Side → Tags → "FB - Purchase"
2. Verificar:
   - Tag está **ativa** (checkmark verde)?
   - Tag está **publicada** (aparece em versões)?

---

## 🔧 PROBLEMAS COMUNS E SOLUÇÕES

### **Problema 1: Event Name = "Data" ao invés de "purchase"**

**Se no stream aparecer `event_name = "Data"`:**

**Solução:**
1. Criar novo trigger ou ajustar existente:
   - Nome: `ce - purchase (webhook)`
   - Tipo: Evento personalizado
   - **Nome do evento:** `Data` (ou o nome que aparecer no stream)
   - **Filtro adicional:** `event = purchase` (usando variável Event)

**OU ajustar trigger existente:**
- Mudar "Nome do evento" para `Data`
- Adicionar filtro: `event = purchase`

---

### **Problema 2: Trigger tem Filtro de Client Name**

**Se o trigger tiver filtro "Client Name contém Data Client":**

**Solução:**
1. Remover filtro de Client Name completamente
   - OU adicionar "Webhook Client" ao filtro
   - Exemplo: "Client Name contém Data Client OU Webhook Client"

---

### **Problema 3: Tag Não Está Ativa**

**Se a tag não estiver ativa:**

**Solução:**
1. Ativar a tag (clicar no checkmark)
2. Publicar workspace

---

## 📝 CHECKLIST RÁPIDO

### **No Stream do GTM:**
- [ ] Evento aparece no stream?
- [ ] Client Name = "Webhook Client"?
- [ ] `event_name` = ?
- [ ] `event` = `"purchase"`?

### **No Trigger:**
- [ ] "Nome do evento" = ?
- [ ] Filtro de Client Name = ?
- [ ] Trigger está ativo?

### **Na Tag:**
- [ ] Tag está ativa?
- [ ] Tag está publicada?
- [ ] Trigger está vinculado?

---

## 🎯 AÇÃO IMEDIATA

**Me informe:**
1. No stream, qual é o `event_name` do evento?
2. No trigger "ce - purchase", qual é o "Nome do evento" configurado?
3. No trigger, há filtro de Client Name?

Com essas informações, identifico exatamente o problema!

---

**Status**: Aguardando informações do stream e trigger para identificar o problema





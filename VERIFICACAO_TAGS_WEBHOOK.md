# ✅ VERIFICAÇÃO: Tags para Webhook

**Status:** As tags já existem, mas precisam estar configuradas corretamente

---

## ✅ CÓDIGO ATUALIZADO

**Mudança aplicada:**
```typescript
// ANTES:
const clientName = process.env.GTM_WEBHOOK_CLIENT_NAME || 'Data Client';

// DEPOIS:
const clientName = process.env.GTM_WEBHOOK_CLIENT_NAME || 'Webhook Client';
```

Agora o código usa "Webhook Client" por padrão.

---

## 📋 TAGS QUE DEVEM EXISTIR

### **1. FB - Purchase (Facebook Conversion API)**

**Verificar se existe:**
- GTM Server-Side → Tags → "FB - Purchase"

**Se não existir, criar:**
- Tipo: Facebook Conversion API
- Event Name: Purchase
- Trigger: `ce - purchase`
- Configurar mapeamento de campos

**Se existir, verificar:**
- ✅ Trigger está configurado: `ce - purchase`
- ✅ Trigger não tem filtro de Client Name (ou aceita "Webhook Client")
- ✅ Tags estão ativas/publicadas

---

### **2. GA4 - All Events (Google Analytics 4)**

**Verificar se existe:**
- GTM Server-Side → Tags → "GA4 - All Events"

**Se não existir, criar:**
- Tipo: Google Analytics: GA4 Event
- Measurement ID: `G-7DRG46JMBH`
- Event Name: `{{Event Name}}` (dinâmico)
- Trigger: `All Events` (ou `ce - purchase`)

**Se existir, verificar:**
- ✅ Trigger está configurado: `All Events` ou `ce - purchase`
- ✅ Trigger não tem filtro de Client Name (ou aceita "Webhook Client")
- ✅ Tags estão ativas/publicadas

---

## 🔧 CONFIGURAÇÃO DOS TRIGGERS

### **Trigger: ce - purchase**

**Verificar configuração:**
1. GTM Server-Side → Triggers → "ce - purchase"
2. Tipo: Custom Event
3. Event Name: `purchase`
4. **Filtros:**
   - ❌ **NÃO deve ter filtro de Client Name** (ou deve aceitar "Webhook Client")
   - ✅ Se tiver filtro "Client Name contém Data Client" → remover ou adicionar "Webhook Client"

**Se não existir, criar:**
- Nome: `ce - purchase`
- Tipo: Custom Event
- Event Name: `purchase`
- Sem filtros de Client Name (para aceitar de qualquer Client)

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### **Tags:**
- [ ] Tag "FB - Purchase" existe?
- [ ] Tag "GA4 - All Events" existe?
- [ ] Tags estão ativas/publicadas?

### **Triggers:**
- [ ] Trigger `ce - purchase` existe?
- [ ] Trigger não filtra por Client Name?
- [ ] Trigger aceita eventos do "Webhook Client"?

### **Client:**
- [ ] Client "Webhook Client" criado?
- [ ] Path `/data` configurado em "Accepted Path Settings"?
- [ ] "Accept Server-Side Events" habilitado?

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Código atualizado** - Usa "Webhook Client"
2. ⏳ **Verificar tags** - FB - Purchase e GA4 - All Events existem?
3. ⏳ **Verificar triggers** - `ce - purchase` aceita "Webhook Client"?
4. ⏳ **Testar webhook** novamente
5. ⏳ **Verificar se evento aparece no stream**
6. ⏳ **Verificar se tags disparam**

---

## 📝 NOTA

**As tags provavelmente já existem!** Mas podem estar configuradas apenas para eventos do "Data Client". 

Precisamos verificar se os triggers aceitam eventos do "Webhook Client" também. Se não aceitarem, precisamos:
- Remover filtro de Client Name do trigger, OU
- Adicionar "Webhook Client" ao filtro


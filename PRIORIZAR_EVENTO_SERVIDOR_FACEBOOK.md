# 🎯 PRIORIZAR: Evento do Servidor no Facebook

**Problema:** Facebook está desduplicando evento do servidor (que tem mais informações)

**Questão:** Facebook não deveria preservar o evento do servidor que está mais rico?

---

## 🔍 COMO O FACEBOOK DEDUPLICA

### **Regra do Facebook:**
Quando há 2 eventos com o mesmo `event_id`:
1. **Primeiro evento que chega** → Processado ✅
2. **Segundo evento que chega** → Desduplicado ❌

**Problema:** Se o browser chegar primeiro, o servidor (mais rico) é desduplicado!

---

## ✅ SOLUÇÕES

### **Solução 1: Garantir que Servidor chegue primeiro (Recomendado)**

**Estratégia:**
- Servidor envia imediatamente após evento do browser
- OU Servidor envia ANTES do browser (se possível)
- OU Adicionar delay no browser para garantir que servidor chegue primeiro

**Implementação:**
```typescript
// No código do browser, adicionar delay antes de enviar
await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
// Depois enviar evento
```

**Vantagem:**
- ✅ Servidor sempre chega primeiro
- ✅ Servidor é processado (mais rico)
- ✅ Browser é desduplicado (OK, tem menos dados)

---

### **Solução 2: Usar event_id diferente para servidor (NÃO recomendado)**

**Estratégia:**
- Browser: `InitiateCheckout_1234567890_abc123`
- Servidor: `InitiateCheckout_1234567890_abc123_server`

**Problema:**
- ❌ Quebra deduplicação (Facebook não deduplica)
- ❌ Eventos aparecem duplicados no Meta
- ❌ Não é a prática recomendada

---

### **Solução 3: Usar action_source para priorizar servidor**

**Estratégia:**
- Browser: `action_source: "website"` (padrão)
- Servidor: `action_source: "website"` + outros parâmetros que indicam servidor

**Problema:**
- ❌ Facebook não prioriza baseado em `action_source`
- ❌ Ainda usa ordem de chegada

---

### **Solução 4: Enviar apenas do servidor (Melhor prática)**

**Estratégia:**
- Browser: NÃO envia para Meta Pixel (apenas para GTM)
- Servidor: Envia para Meta CAPI (via GTM Server-Side)

**Vantagem:**
- ✅ Apenas servidor envia (mais rico)
- ✅ Sem duplicação
- ✅ Melhor EQM (Event Quality Match)

**Como fazer:**
- Remover tags do Meta Pixel do GTM Web
- Manter apenas Data Tags (enviam para Server-Side)
- Server-Side envia para Meta CAPI

---

## 🎯 RECOMENDAÇÃO FINAL

### **Opção A: Enviar apenas do servidor (MELHOR)**

**Vantagens:**
- ✅ Apenas servidor envia (mais rico)
- ✅ Sem duplicação
- ✅ Melhor EQM
- ✅ Menos requisições

**Como fazer:**
1. GTM Web → Desativar tags do Meta Pixel (FB - PageView, FB - ViewContent, etc.)
2. Manter apenas Data Tags (enviam para Server-Side)
3. Server-Side envia para Meta CAPI

---

### **Opção B: Garantir que servidor chegue primeiro**

**Vantagens:**
- ✅ Mantém browser e servidor
- ✅ Servidor é processado (mais rico)
- ✅ Browser é desduplicado (OK)

**Como fazer:**
- Adicionar delay no browser antes de enviar
- OU Enviar servidor imediatamente após browser

---

## 📋 COMPARAÇÃO

| Abordagem | Deduplicação | Qual Evento Preservado | EQM | Recomendado |
|-----------|--------------|------------------------|-----|-------------|
| **Apenas Servidor** | ✅ Sem duplicação | Servidor (rico) | ⭐⭐⭐⭐⭐ | ✅ **SIM** |
| **Servidor primeiro** | ✅ Deduplica browser | Servidor (rico) | ⭐⭐⭐⭐ | ✅ Sim |
| **Browser primeiro** | ✅ Deduplica servidor | Browser (pobre) | ⭐⭐⭐ | ❌ Não |
| **event_id diferente** | ❌ Sem deduplicação | Ambos (duplicados) | ⭐⭐ | ❌ Não |

---

## ✅ CONCLUSÃO

**Recomendação:** **Enviar apenas do servidor** (Opção A)

**Por quê:**
- Servidor tem mais dados (Advanced Matching completo, IP, User Agent, etc.)
- Sem duplicação
- Melhor EQM
- Prática recomendada pelo Facebook

**Como fazer:**
- Desativar tags do Meta Pixel no GTM Web
- Manter apenas Data Tags (enviam para Server-Side)
- Server-Side envia para Meta CAPI

---

## 📝 PRÓXIMOS PASSOS

1. ✅ Decidir qual abordagem usar
2. ✅ Se Opção A: Desativar tags Meta Pixel no GTM Web
3. ✅ Se Opção B: Adicionar delay no browser ou garantir servidor primeiro
4. ✅ Testar e verificar no Meta Events Manager


# 📊 Análise EQM 8.0 → 9.3 - Purchase Event

## 📈 Status Atual

**EQM Atual:** 8.0/10 ✅ (Bom, mas pode melhorar)  
**Meta:** 9.3/10 🎯

---

## ✅ O Que Está Funcionando (11 Campos - 100%)

| Campo | Cobertura | Hash | Status |
|-------|-----------|------|--------|
| Email | 100% | ✅ SHA-256 | ✅ Perfeito |
| Telefone | 100% | ✅ SHA-256 | ✅ Perfeito |
| Nome | 100% | ✅ SHA-256 | ✅ Perfeito |
| Sobrenome | 100% | ✅ SHA-256 | ✅ Perfeito |
| Cidade | 100% | ✅ SHA-256 | ✅ Perfeito |
| Estado | 100% | ✅ SHA-256 | ✅ Perfeito |
| Código postal | 100% | ✅ SHA-256 | ✅ Perfeito |
| País | 100% | ✅ SHA-256 | ✅ Perfeito |
| Endereço IP | 100% | ✅ Não hash | ✅ Perfeito |
| Identificação do navegador (fbp) | 100% | ✅ Não hash | ✅ Perfeito |
| Identificação externa | 100% | ✅ Não hash | ✅ Perfeito |

**Total:** ✅ **11/11 campos - 100% cobertura**

---

## ⚠️ O Que Está Faltando (Impacto no EQM)

### **1. Identificação de clique (fbc) - 16% de aumento possível**

**Situação:**
- Meta diz: "Seu servidor não está enviando Identificação de clique (fbc)"
- Log mostra: `⚠️ fbc inválido detectado: fbc timestamp outside valid window (24h)`

**Problema:**
- fbc expira após **24 horas**
- Se Lead foi feito há mais de 24h, fbc fica inválido
- Sistema **corretamente** não envia fbc inválido (evita erro)
- Meta não recebe fbc porque está expirado

**Solução:**
- ✅ Fazer Lead novamente antes de testar Purchase (dentro de 24h)
- ✅ Sistema já está funcionando corretamente (não envia fbc inválido)
- ⚠️ **Limitação:** fbc só é válido por 24h

**Impacto:** +16% EQM (de 8.0 → ~9.3)

---

### **2. Agente do usuário - 16% de aumento possível**

**Situação:**
- Meta diz: "Envie Endereço IP e Agente do usuário"
- Log mostra: `⚠️ User Agent ausente (impacto: -1.68% conversões)`

**Problema:**
- User Agent não está sendo capturado no webhook da Cakto
- Cakto não envia User Agent no payload do webhook
- **Limitação:** Não temos controle direto sobre isso

**Soluções Possíveis:**
1. **Capturar no Lead** e salvar no KV:
   - Quando Lead é feito, capturar `navigator.userAgent`
   - Salvar no KV junto com outros dados
   - Purchase buscará e enviará
   - ✅ **VIÁVEL - Vamos implementar!**

2. **Adicionar no checkout URL** (se Cakto aceitar):
   - Passar User Agent como parâmetro na URL do checkout
   - Webhook receberá e poderemos usar
   - ⚠️ Depende do Cakto aceitar

**Impacto:** +16% EQM (de 8.0 → ~9.5)

---

### **3. Identificação do login do Facebook (fb_login_id) - 9% de aumento**

**Situação:**
- Meta sugere enviar fb_login_id
- Você disse: "eu não utilizo Facebook Login"

**Solução:**
- ❌ **Não implementar** (você não usa)
- Não é necessário se não há Facebook Login no site

**Impacto:** N/A (não aplicável)

---

### **4. Data de nascimento - 8% de aumento**

**Situação:**
- Meta sugere enviar data de nascimento
- Atualmente não está sendo capturado

**Solução:**
- ⚠️ Opcional - pode adicionar no formulário
- ⚠️ Pode impactar conversão (mais campos = menos conversões)
- ⚠️ Não é crítico para EQM 9.3

**Impacto:** +8% EQM (opcional)

---

## 🎯 Plano de Ação para EQM 9.3

### **PRIORIDADE ALTA:**

#### **1. Capturar User Agent no Lead ✅**
**Impacto:** +16% EQM  
**Dificuldade:** Fácil  
**Risco:** Baixo

**Implementação:**
- Capturar `navigator.userAgent` quando Lead é feito
- Salvar no KV junto com outros dados
- Purchase buscará e enviará automaticamente

#### **2. Garantir fbc Válido ✅**
**Impacto:** +16% EQM  
**Dificuldade:** Já implementado  
**Risco:** Nenhum

**Implementação:**
- Sistema já detecta fbc inválido e não envia
- **Ação:** Fazer Lead dentro de 24h antes de Purchase
- ✅ **Já está funcionando corretamente!**

---

## 📊 Cálculo EQM Esperado

### **Cenário 1: Com User Agent (implementar)**
- Base: 8.0
- + fbc válido (Lead recente): +1.6 (16%)
- + User Agent (capturado no Lead): +1.6 (16%)
- **Total esperado:** **~9.2/10** ✅

### **Cenário 2: Sem User Agent (limitação)**
- Base: 8.0
- + fbc válido (Lead recente): +1.6 (16%)
- **Total esperado:** **~8.5/10**

---

## 🔧 Implementação Recomendada

### **1. Capturar User Agent no Lead (CRÍTICO)**

**Arquivo:** `src/app/page.tsx` - `handlePreCheckoutSubmit`

Adicionar:
```typescript
// Capturar User Agent no Lead
const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined;

// Incluir no save-tracking
await fetch('/api/save-tracking', {
  // ...
  body: JSON.stringify({
    // ... outros campos
    client_user_agent: userAgent, // ← Adicionar
  })
});
```

**Arquivo:** `src/app/api/save-tracking/route.ts`

Já está salvando `client_user_agent` ✅ (verificar se está funcionando)

**Arquivo:** `src/lib/offlineConversions.ts`

Já está buscando `client_user_agent` do KV ✅ (verificar se está chegando)

---

## 📝 Checklist

### **Para EQM 9.3, precisamos:**

- [x] **fbc válido** - Sistema já detecta e envia quando válido ✅
- [ ] **User Agent** - Precisa ser capturado no Lead e enviado no Purchase
- [ ] **Verificar se User Agent está sendo salvo** no KV corretamente
- [ ] **Verificar se User Agent está sendo buscado** do KV no Purchase

---

## ✅ O Que Já Está Funcionando

1. ✅ **11 campos de dados** - 100% cobertura
2. ✅ **fbc detection** - Sistema detecta e não envia inválido
3. ✅ **IP capturado** - 100%
4. ✅ **Todos PII hasheados** corretamente
5. ✅ **fbp presente** - 100%

---

## 🎯 Próximos Passos

1. **Verificar** se User Agent está sendo capturado no Lead
2. **Verificar** se User Agent está sendo salvo no KV
3. **Verificar** se User Agent está sendo enviado no Purchase
4. **Testar** com Lead recente (fbc válido) + User Agent
5. **Verificar** EQM no Meta após testes

---

**Status:** ✅ **EQM 8.0 é muito bom, mas podemos chegar a 9.3 com User Agent!**


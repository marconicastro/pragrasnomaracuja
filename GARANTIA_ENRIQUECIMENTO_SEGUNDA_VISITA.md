# ✅ GARANTIA: Enriquecimento Automático na Segunda Visita

## 🎯 **OBJETIVO**

**GARANTIR que eventos PageView, ViewContent e AddToCart sejam automaticamente enriquecidos com dados persistidos na segunda visita (quando o lead já foi gerado).**

---

## 📋 **EVENTOS COM ENRIQUECIMENTO AUTOMÁTICO**

### **1. PageView** (`trackPageViewElite`)
- ✅ **Enriquecimento**: Automático via `isColdEvent: true`
- ✅ **Dados**: Email, telefone, nome, cidade, estado, CEP, fbp/fbc
- ✅ **Fonte**: `getAdvancedUserData()` (localStorage persistido)

### **2. ViewContent** (`trackViewContentElite`)
- ✅ **Enriquecimento**: Automático via `isColdEvent: true`
- ✅ **Dados**: Email, telefone, nome, cidade, estado, CEP, fbp/fbc
- ✅ **Fonte**: `getAdvancedUserData()` (localStorage persistido)

### **3. AddToCart** (`trackAddToCartElite`)
- ✅ **Enriquecimento**: Automático via `isColdEvent: true`
- ✅ **Dados**: Email, telefone, nome, cidade, estado, CEP, fbp/fbc
- ✅ **Fonte**: `getAdvancedUserData()` (localStorage persistido)

---

## 🔧 **IMPLEMENTAÇÃO**

### **Função de Enriquecimento** (`enrichColdEvent()`)

**Localização**: `src/lib/coldEventsEnrichment.ts`

**Estratégia (em ordem de prioridade):**

1. **Dados Persistidos** (prioridade máxima - segunda visita!)
   - ✅ Email normalizado
   - ✅ Telefone normalizado
   - ✅ First/Last name normalizados
   - ✅ Cidade/Estado/CEP normalizados
   - ✅ External ID (session)

2. **Progressive Data** (usuário começou a preencher)
   - ✅ Email, telefone, nome capturados campo por campo
   - ✅ Usado apenas se dados persistidos não estiverem disponíveis

3. **Meta Cookies** (sempre)
   - ✅ `fbp` (Facebook Browser ID)
   - ✅ `fbc` (Facebook Click ID)

4. **IP Geolocation** (fallback)
   - ✅ Cidade/Estado/CEP via API IP (se disponível)

5. **Browser Fingerprint** (sempre)
   - ✅ Device type, browser, OS, language

---

## ✅ **NORMALIZAÇÃO APLICADA**

**TODOS os dados são normalizados usando funções centralizadas:**

- ✅ **Email**: `normalizeEmail()` → lowercase + trim
- ✅ **Telefone**: `normalizePhone()` → apenas dígitos + código país (55)
- ✅ **Nome**: `normalizeName()` → title case (primeira letra maiúscula)
- ✅ **Cidade/Estado**: `normalizeCity()` / `normalizeState()` → lowercase + trim
- ✅ **CEP**: `normalizeZip()` → apenas dígitos
- ✅ **País**: `normalizeCountry()` → lowercase + trim (padrão: 'br')

---

## 🔄 **FLUXO DE ENRIQUECIMENTO**

### **Primeira Visita (Sem Lead):**
```
1. PageView disparado
   └─ enrichColdEvent() executado
      ├─ Dados persistidos: ❌ Não disponível
      ├─ Progressive data: ❌ Não disponível
      ├─ Meta cookies: ✅ fbp/fbc
      ├─ IP Geolocation: ✅ Cidade/Estado (se API disponível)
      └─ Browser fingerprint: ✅ Device/OS/Browser
   
   Resultado: DQS ~40-60 (sem PII, apenas cookies + geo)
```

### **Segunda Visita (Com Lead Persistido):**
```
1. PageView disparado
   └─ enrichColdEvent() executado
      ├─ Dados persistidos: ✅ EMAIL, TELEFONE, NOME, CIDADE, ESTADO, CEP
      ├─ Progressive data: ⚠️ Não necessário (já tem persistido)
      ├─ Meta cookies: ✅ fbp/fbc
      ├─ IP Geolocation: ✅ Cidade/Estado (fallback)
      └─ Browser fingerprint: ✅ Device/OS/Browser
   
   Resultado: DQS ~85-98 (com PII completo!)
```

---

## 📊 **CHECKLIST DE GARANTIA**

### **PageView:**
- [x] Passa `isColdEvent: true` para `trackEliteEvent()`
- [x] `prepareAdvancedMatching()` chama `enrichColdEvent()`
- [x] Dados persistidos são buscados via `getAdvancedUserData()`
- [x] Todos os dados são normalizados antes de enviar
- [x] Log mostra `enrichmentSources: ['persisted_email', 'persisted_phone', ...]`

### **ViewContent:**
- [x] Passa `isColdEvent: true` para `trackEliteEvent()`
- [x] `prepareAdvancedMatching()` chama `enrichColdEvent()`
- [x] Dados persistidos são buscados via `getAdvancedUserData()`
- [x] Todos os dados são normalizados antes de enviar
- [x] Log mostra `enrichmentSources: ['persisted_email', 'persisted_phone', ...]`

### **AddToCart:**
- [x] Passa `isColdEvent: true` para `trackEliteEvent()`
- [x] `prepareAdvancedMatching()` chama `enrichColdEvent()`
- [x] Dados persistidos são buscados via `getAdvancedUserData()`
- [x] Todos os dados são normalizados antes de enviar
- [x] Log mostra `enrichmentSources: ['persisted_email', 'persisted_phone', ...]`

---

## 🚨 **GARANTIA FINAL**

**TODOS os eventos cold (PageView, ViewContent, AddToCart) são automaticamente enriquecidos com:**
1. ✅ Dados persistidos (quando disponível - segunda visita!)
2. ✅ Meta cookies (fbp/fbc) - sempre
3. ✅ IP Geolocation - quando disponível
4. ✅ Browser fingerprint - sempre
5. ✅ Normalização completa para padrão Facebook

**Nenhum evento cold é enviado sem enriquecimento!**

---

## 📈 **RESULTADO ESPERADO**

### **Primeira Visita:**
- DQS: ~40-60
- Campos: fbp, fbc, geo, fingerprint

### **Segunda Visita (Com Lead):**
- DQS: ~85-98
- Campos: email, telefone, nome, cidade, estado, CEP, fbp, fbc, geo, fingerprint

**Melhoria**: +45-58 pontos de DQS na segunda visita!

---

**Última atualização**: 2025-01-05
**Versão**: 1.0
**Status**: ✅ IMPLEMENTADO E GARANTIDO


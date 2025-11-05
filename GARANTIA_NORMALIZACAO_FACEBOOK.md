# ✅ GARANTIA DE NORMALIZAÇÃO PARA PADRÃO FACEBOOK

## 🎯 **OBJETIVO**

**GARANTIR que TODOS os dados sejam normalizados para o padrão Facebook antes de:**
- Hash SHA-256
- Envio para Meta CAPI
- Envio para GTM Server-Side
- Salvamento no KV/Prisma

---

## 📋 **PADRÃO FACEBOOK**

### **Email:**
- ✅ **lowercase** + **trim**
- Exemplo: `"JOAO@EMAIL.COM"` → `"joao@email.com"`

### **Nome (First/Last Name):**
- ✅ **Title Case** (primeira letra maiúscula, resto minúscula)
- Exemplo: `"JOAO SILVA"` → `"Joao Silva"`

### **Telefone:**
- ✅ Apenas dígitos
- ✅ Código do país (55 para Brasil)
- Exemplo: `"(11) 99999-9999"` → `"5511999999999"`

### **Cidade/Estado:**
- ✅ **lowercase** + **trim**
- Exemplo: `"SAO PAULO"` → `"sao paulo"`

### **CEP:**
- ✅ Apenas dígitos
- Exemplo: `"12345-678"` → `"12345678"`

### **País:**
- ✅ **lowercase** + **trim**
- Padrão: `"br"` para Brasil

---

## 🔧 **IMPLEMENTAÇÃO**

### **1. Funções Centralizadas** (`src/lib/utils/metaDataNormalizer.ts`)

Criadas funções para normalização:

```typescript
normalizeEmail(email: string): string
normalizeName(name: string): string
splitNormalizedName(fullName: string): { firstName, lastName }
normalizePhone(phone: string): string
normalizeCity(city: string): string
normalizeState(state: string): string
normalizeZip(zip: string): string
normalizeCountry(country?: string): string
normalizeUserData(userData): { email, firstName, lastName, ... }
logNormalization(original, normalized, context): void
```

### **2. Aplicação em Todos os Pontos**

#### ✅ **Webhook Cakto** (`src/app/api/webhook-cakto/route.ts`)
- Normaliza email, nome e telefone antes de buscar no KV
- Normaliza antes de criar `purchaseData`

#### ✅ **Send Purchase to GTM** (`src/lib/offlineConversions.ts` - `sendPurchaseToGTM`)
- Normaliza todos os campos de `user_data` antes de enviar para GTM

#### ✅ **Send Offline Purchase** (`src/lib/offlineConversions.ts` - `sendOfflinePurchase`)
- Normaliza email, nome, telefone antes de hash SHA-256
- Normaliza cidade, estado, CEP, país antes de hash SHA-256

#### ✅ **Save Tracking** (`src/app/api/save-tracking/route.ts`)
- Normaliza todos os dados antes de salvar no KV

#### ✅ **User Tracking Store** (`src/lib/userTrackingStore.ts`)
- Usa função centralizada de normalização de telefone

---

## ✅ **CHECKLIST DE GARANTIA**

### **Webhook Cakto (Purchase via Webhook):**
- [x] Email normalizado antes de buscar no KV
- [x] Email normalizado antes de criar `purchaseData`
- [x] Nome normalizado (title case) antes de extrair first/last
- [x] Telefone normalizado antes de buscar no KV
- [x] Telefone normalizado antes de criar `purchaseData`

### **Send Purchase to GTM:**
- [x] Email normalizado em `user_data.email_address`
- [x] Telefone normalizado em `user_data.phone_number`
- [x] First name normalizado em `user_data.first_name`
- [x] Last name normalizado em `user_data.last_name`
- [x] Cidade normalizada em `user_data.city`
- [x] Estado normalizado em `user_data.region`
- [x] CEP normalizado em `user_data.postal_code`
- [x] País normalizado em `user_data.country`

### **Send Offline Purchase (Meta CAPI):**
- [x] Email normalizado antes de hash SHA-256 (`em`)
- [x] First name normalizado antes de hash SHA-256 (`fn`)
- [x] Last name normalizado antes de hash SHA-256 (`ln`)
- [x] Telefone normalizado antes de hash SHA-256 (`ph`)
- [x] Cidade normalizada antes de hash SHA-256 (`ct`)
- [x] Estado normalizado antes de hash SHA-256 (`st`)
- [x] CEP normalizado antes de hash SHA-256 (`zp`)
- [x] País normalizado antes de hash SHA-256 (`country`)

### **Save Tracking (Lead):**
- [x] Email normalizado antes de salvar
- [x] First name normalizado antes de salvar
- [x] Last name normalizado antes de salvar
- [x] Telefone normalizado antes de salvar
- [x] Cidade normalizada antes de salvar
- [x] Estado normalizado antes de salvar
- [x] CEP normalizado antes de salvar

---

## 🚨 **GARANTIA FINAL**

**TODOS os dados são normalizados para o padrão Facebook em:**
1. ✅ Webhook Cakto (Purchase)
2. ✅ Send Purchase to GTM
3. ✅ Send Offline Purchase (Meta CAPI)
4. ✅ Save Tracking (Lead)

**Nenhum dado é enviado para Meta sem normalização!**

---

## 📊 **EXEMPLO DE NORMALIZAÇÃO**

### **Input (Webhook Cakto):**
```json
{
  "customer": {
    "email": "JOAO.SILVA@EMAIL.COM",
    "name": "JOAO DA SILVA",
    "phone": "(11) 99999-9999"
  }
}
```

### **Output Normalizado:**
```json
{
  "email": "joao.silva@email.com",
  "firstName": "Joao",
  "lastName": "Da Silva",
  "phone": "5511999999999"
}
```

### **Após Hash SHA-256 (para Meta CAPI):**
```json
{
  "user_data": {
    "em": "abc123...",  // hash de "joao.silva@email.com"
    "fn": "def456...",  // hash de "Joao"
    "ln": "ghi789...",  // hash de "Da Silva"
    "ph": "jkl012..."   // hash de "5511999999999"
  }
}
```

---

**Última atualização**: 2025-01-05
**Versão**: 1.0
**Status**: ✅ IMPLEMENTADO E GARANTIDO


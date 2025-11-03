# 🔐 Variáveis de Ambiente - Configuração Completa

**Data:** $(date)  
**Status:** ✅ Configurado com novo Pixel

---

## 📋 Meta Pixel - Novo

### **Novo Pixel ID:**
```
1403975024017865
```

### **Novo Access Token:**
```
EAAUsqHMv8GcBPZBd4a9KcWdYkRKSxcyIHYCKAoN6Xw8OCnXVe2t87dIyqminQxQk8uDya87G5eNd2SvvPgmha3OZC9TlMWAODOL4PiV5FZAtng4bANQMOPBnXWwfwR1WdNHVPH0rN8hlf43zB5ErnnLmmzm4MU6ls8ZAgBuKMEHBEcIV9Xxp4HbUGuszOgZDZD
```

---

## 🗑️ Pixel Antigo (REMOVIDO)

### **Pixel ID Antigo:**
```
642933108377475 (REMOVIDO)
```

---

## 🔧 Configuração no `.env`

Adicione estas variáveis ao seu arquivo `.env` ou `.env.local`:

```env
# ============================================
# META PIXEL & CONVERSIONS API (NOVO)
# ============================================

NEXT_PUBLIC_META_PIXEL_ID=1403975024017865
META_ACCESS_TOKEN=EAAUsqHMv8GcBPZBd4a9KcWdYkRKSxcyIHYCKAoN6Xw8OCnXVe2t87dIyqminQxQk8uDya87G5eNd2SvvPgmha3OZC9TlMWAODOL4PiV5FZAtng4bANQMOPBnXWwfwR1WdNHVPH0rN8hlf43zB5ErnnLmmzm4MU6ls8ZAgBuKMEHBEcIV9Xxp4HbUGuszOgZDZD

# Test Event Code (opcional - para debug no Meta Events Manager)
# META_TEST_EVENT_CODE=TEST12345

# ============================================
# CAPIG STAPE
# ============================================

NEXT_PUBLIC_STAPE_CONTAINER_URL=https://capigateway.maracujazeropragas.com
STAPE_CAPIG_IDENTIFIER=cfgzbpts
STAPE_CAPIG_API_KEY=eyJpIjoiY2ZnemJwdHMiLCJoIjoiY2FwaWcuc3RhcGUucG0iLCJrIjoiNTgwZmIyMjkwMDdlZGFjMWFmYTQwNTkyOTI1NWFkZDQ5YjhlMjc1ZWNmZ3picHRzIn0=

# ============================================
# CAKTO CHECKOUT
# ============================================

NEXT_PUBLIC_CAKTO_CHECKOUT_URL=https://pay.cakto.com.br/seu_checkout_id
CAKTO_WEBHOOK_SECRET=seu_webhook_secret_uuid

# ============================================
# VERCEL KV (Redis)
# ============================================

KV_REST_API_URL=sua_url_kv_aqui
KV_REST_API_TOKEN=seu_token_kv_aqui
```

---

## ✅ Arquivos Atualizados

### **1. `src/components/EliteMetaPixel.tsx`**
- ✅ Pixel ID padrão: `1403975024017865` (novo)
- ✅ Usa variável de ambiente `NEXT_PUBLIC_META_PIXEL_ID` se disponível
- ✅ Fallback para novo pixel se variável não estiver definida

### **2. `src/components/MetaPixelStape.tsx`**
- ✅ Pixel ID padrão: `1403975024017865` (novo)
- ✅ Usa variável de ambiente `NEXT_PUBLIC_META_PIXEL_ID` se disponível
- ✅ Fallback para novo pixel se variável não estiver definida

### **3. `src/lib/offlineConversions.ts`**
- ✅ Usa `process.env.NEXT_PUBLIC_META_PIXEL_ID` (deve ser configurado)
- ✅ Usa `process.env.META_ACCESS_TOKEN` (novo token)

---

## 🔍 Onde o Pixel ID é Usado

1. **Browser-side (Meta Pixel):**
   - `EliteMetaPixel.tsx` - Inicialização do pixel
   - `MetaPixelStape.tsx` - Inicialização com CAPIG

2. **Server-side (Meta CAPI):**
   - `offlineConversions.ts` - Purchase events via CAPI direto
   - Endpoint: `https://graph.facebook.com/v18.0/{pixelId}/events`

---

## ⚠️ IMPORTANTE

1. **Adicione as variáveis ao `.env`** antes de fazer deploy
2. **Remova o pixel antigo** (`642933108377475`) de qualquer configuração
3. **Use apenas o novo pixel** (`1403975024017865`)
4. **O novo token** já está configurado na CAPIG

---

## 📝 Checklist

- [x] Pixel ID atualizado em `EliteMetaPixel.tsx`
- [x] Pixel ID atualizado em `MetaPixelStape.tsx`
- [x] Documentação criada com novo token
- [ ] Adicionar variáveis ao `.env` (fazer manualmente)
- [ ] Verificar se CAPIG está usando o novo pixel
- [ ] Testar eventos no Meta Events Manager

---

**FIM DO DOCUMENTO**


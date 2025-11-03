# 🕹️ Configuração CAPIG (Stape)

**Data:** $(date)  
**Status:** ✅ Configurado

---

## 📋 Informações do CAPIG

### **Dados do Gateway:**

| Campo | Valor |
|-------|-------|
| **Name** | Capig |
| **URL (Padrão)** | `https://capigateway.maracujazeropragas.com` |
| **URL (Stape)** | `https://capig.stape.pm` |
| **Admin Email** | marconi.castro.mc@gmail.com |
| **CAPIG Identifier** | `cfgzbpts` |
| **CAPIG API Key** | `eyJpIjoiY2ZnemJwdHMiLCJoIjoiY2FwaWcuc3RhcGUucG0iLCJrIjoiNTgwZmIyMjkwMDdlZGFjMWFmYTQwNTkyOTI1NWFkZDQ5YjhlMjc1ZWNmZ3picHRzIn0=` |

---

## 🔧 Configuração no Código

### **1. Variáveis de Ambiente (`.env`)**

Adicione estas variáveis ao seu arquivo `.env` ou `.env.local`:

```env
# CAPIG Stape Configuration
NEXT_PUBLIC_STAPE_CONTAINER_URL=https://capigateway.maracujazeropragas.com
STAPE_CAPIG_IDENTIFIER=cfgzbpts
STAPE_CAPIG_API_KEY=eyJpIjoiY2ZnemJwdHMiLCJoIjoiY2FwaWcuc3RhcGUucG0iLCJrIjoiNTgwZmIyMjkwMDdlZGFjMWFmYTQwNTkyOTI1NWFkZDQ5YjhlMjc1ZWNmZ3picHRzIn0=
```

### **2. Arquivos Atualizados**

#### ✅ `src/components/EliteMetaPixel.tsx`
- URL padrão: `https://capigateway.maracujazeropragas.com`
- **Status:** CAPIG desabilitado (usando Meta CAPI direto)
- Pode ser reabilitado descomentando as linhas do Stape

#### ✅ `src/components/MetaPixelStape.tsx`
- URL padrão: `https://capigateway.maracujazeropragas.com`
- **Status:** Configurado para usar CAPIG

#### ✅ `src/lib/offlineConversions.ts`
- Usa `process.env.NEXT_PUBLIC_STAPE_CONTAINER_URL`
- **Status:** Usando Meta CAPI direto (CAPIG não usado para Purchase)

---

## 📊 Status Atual do CAPIG

### **Browser-Side Events (Meta Pixel)**
- ✅ CAPIG configurado mas **desabilitado**
- ✅ URLs padrão: `https://capigateway.maracujazeropragas.com`
- ⚠️ Sistema atual usa **Meta CAPI direto** (mais confiável)

### **Server-Side Events (Purchase)**
- ✅ **Meta CAPI direto** (não usa CAPIG)
- ✅ Endpoint: `https://graph.facebook.com/v18.0/{pixelId}/events`
- ✅ Funcionando perfeitamente (DQS 105)

---

## 🔄 Como Reabilitar CAPIG

Se quiser usar CAPIG novamente, faça:

### **1. Em `EliteMetaPixel.tsx`:**

```typescript
// Descomentar estas linhas:
window.fbq('set', 'autoConfig', false, pixelId);
window.fbq('set', 'agent', 'stape');
window.fbq('set', 'server_event_uri', stapeContainerUrl);
```

### **2. Em `offlineConversions.ts`:**

```typescript
// Trocar endpoint direto por CAPIG:
const stapeUrl = process.env.NEXT_PUBLIC_STAPE_CONTAINER_URL;
const endpoint = `${stapeUrl}/events`;
```

---

## 📝 Notas Importantes

1. **CAPIG está desabilitado** porque sistema funciona melhor com Meta CAPI direto
2. **URLs foram atualizadas** para nova configuração do Stape
3. **Variáveis de ambiente** estão documentadas acima
4. **Identifier e API Key** estão prontos para uso se necessário

---

## ✅ Checklist de Configuração

- [x] URLs hardcoded: `https://capigateway.maracujazeropragas.com`
- [x] Variáveis de ambiente documentadas
- [x] Identifier e API Key documentados
- [x] Documentação criada
- [ ] Adicionar variáveis ao `.env` (fazer manualmente)
- [ ] Testar CAPIG se decidir reabilitar

---

**FIM DO DOCUMENTO**


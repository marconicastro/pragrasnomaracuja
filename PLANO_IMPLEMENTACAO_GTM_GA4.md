# 🚀 PLANO DE IMPLEMENTAÇÃO - GTM SERVER-SIDE + GA4

**Data:** 04/11/2024  
**Objetivo:** Implementar GTM Server-Side completo com Meta + GA4  
**Status:** 📋 Plano de Ação

---

## 🎯 OBJETIVO

1. ✅ Migrar Purchase do webhook para GTM Server-Side
2. ✅ Adicionar GA4 no GTM Web Container
3. ✅ Adicionar GA4 no GTM Server-Side Container
4. ✅ Manter Vercel KV para enriquecimento de dados

---

## 📊 ARQUITETURA FINAL

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Cliente)                     │
│                                                           │
│  DataLayer.push({event: 'purchase', ...})               │
│                    │                                     │
│                    ▼                                     │
│  ┌──────────────────────────────────────────┐          │
│  │  GTM Web Container                       │          │
│  │  (GTM-WCDP2ZLH)                          │          │
│  │                                           │          │
│  │  • GA4 Configuration Tag                  │          │
│  │  • GA4 Event Tags (page_view, purchase...) │          │
│  │  • FB Pixel Tags (opcional)               │          │
│  │  • Data Tag → Server Container            │          │
│  └──────────────────────────────────────────┘          │
│                    │                                     │
│                    ├─→ Google Analytics 4 (Browser)     │
│                    │                                     │
│                    ▼                                     │
│  ┌──────────────────────────────────────────┐          │
│  │  GTM Server-Side Container               │          │
│  │  (event.maracujazeropragas.com)           │          │
│  │                                           │          │
│  │  • Data Client (recebe eventos)           │          │
│  │  • GA4 Client (opcional)                  │          │
│  │  • Enriquecimento com Vercel KV           │          │
│  │  • FB - Purchase Tag (Stape)             │          │
│  │  • GA4 Event Tag (única, dinâmica)       │          │
│  └──────────────────────────────────────────┘          │
│                    │                                     │
│                    ├─→ Meta Conversions API             │
│                    │                                     │
│                    ▼                                     │
│  ┌──────────────────────────────────────────┐          │
│  │  Google Analytics 4 (Measurement Protocol)│          │
│  │  (Server-Side)                            │          │
│  └──────────────────────────────────────────┘          │
│                                                           │
│  ┌──────────────────────────────────────────┐          │
│  │  Webhook Cakto → GTM Server-Side        │          │
│  │  (Purchase via webhook)                  │          │
│  └──────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 FASES DE IMPLEMENTAÇÃO

### **FASE 1: GTM Web Container - GA4** (1-2h)

#### **1.1. Criar GA4 Configuration Tag**

**Nome:** `GA4 - Configuration`  
**Tipo:** Google Analytics: GA4 Configuration  
**Measurement ID:** `G-XXXXXXXXXX` (seu ID do GA4)

**Configurações:**
- Measurement ID: `{{const - ga4 measurement id}}`
- Trigger: `All Pages` (ou `gtm.js`)

**Variável:**
- Criar `const - ga4 measurement id` = `G-XXXXXXXXXX`

---

#### **1.2. Criar GA4 Event Tags (uma por evento)**

**✅ RESPOSTA: Use as MESMAS variáveis das Data Tags (DT)!**

**Por quê:**
- Data Tags e GA4 Tags leem do **mesmo DataLayer**
- As variáveis Event Data (`{{ed - *}}`) já estão mapeadas
- Mantém consistência e facilita manutenção
- **NÃO use variáveis FB** (são específicas do formato Meta)

**Estrutura padrão:**
- `GA4 - page_view`
- `GA4 - view_item`
- `GA4 - add_to_cart`
- `GA4 - begin_checkout`
- `GA4 - purchase`
- `GA4 - generate_lead`

**Exemplo: `GA4 - purchase`**

**Nome:** `GA4 - purchase`  
**Tipo:** Google Analytics: GA4 Event  
**Measurement ID:** `{{const - ga4 measurement id}}`  
**Event Name:** `purchase`

**Event Parameters (usando variáveis DT):**
```
transaction_id: {{ed - transaction_id}}
value: {{ed - value}}
currency: {{ed - currency}}
items: {{ed - ecommerce.items}}
```

**User Properties (usando variáveis DT):**
```
user_id: {{ed - user_id}}
email: {{ed - email_address}}
phone: {{ed - phone_number}}
```

**⚠️ IMPORTANTE:** 
- Se as variáveis `{{ed - *}}` não existirem no Web Container, você pode:
  1. **Criar variáveis Event Data** (recomendado - mesma estrutura do Server)
  2. **OU usar variáveis built-in do GTM** como `{{ecommerce.transaction_id}}`, `{{ecommerce.value}}`, etc.

**Trigger:** `ce - purchase` (Custom Event "purchase")

---

#### **1.3. Manter Data Tags (já existem)**

✅ Já configuradas:
- `DT - page_view`
- `DT - view_item`
- `DT - add_to_cart`
- `DT - begin_checkout`
- `DT - purchase`
- `DT - generate_lead`

Essas tags já enviam eventos ao Server Container.

---

### **FASE 2: GTM Server-Side Container - GA4** (1h)

#### **2.1. Opção Recomendada: GA4 Event Tag ÚNICA (Dinâmica)**

**✅ VANTAGEM:** Uma única tag captura todos os eventos automaticamente!

**Nome:** `GA4 - All Events`  
**Tipo:** Google Analytics: GA4 Event  
**Measurement ID:** `{{const - ga4 measurement id}}`  
**Event Name:** `{{Event Name}}` (dinâmico - pega do evento)

**✅ RESPOSTA: Use as MESMAS variáveis Event Data ({{ed - *}}) que as tags FB usam!**

**Por quê:**
- As variáveis `{{ed - *}}` já estão mapeadas no Server Container
- Tanto FB tags quanto GA4 tag usam o mesmo Event Data
- Mantém consistência e facilita manutenção
- **NÃO use variáveis FB específicas** (user_data, custom_data - são formatos diferentes)

**Event Parameters (usando variáveis Event Data):**
```
transaction_id: {{ed - transaction_id}}
value: {{ed - value}}
currency: {{ed - currency}}
items: {{ed - ecommerce.items}}
```

**User Properties (usando variáveis Event Data):**
```
user_id: {{ed - user_id}}
email: {{ed - email_address}}
phone: {{ed - phone_number}}
city: {{ed - city}}
region: {{ed - region}}
country: {{ed - country}}
```

**⚠️ NOTA:** 
- As variáveis `{{ed - *}}` já existem no Server Container (já configuradas para FB tags)
- Você pode reutilizar **exatamente as mesmas variáveis** para GA4!

**Trigger:** `All Events` (ou triggers específicos se quiser filtrar)

**Como funciona:**
- Quando o Data Client recebe um evento (ex: `purchase`), o `Event Name` é automaticamente `purchase`
- A tag GA4 usa `{{Event Name}}` que é dinâmico
- **Resultado:** Uma única tag envia todos os eventos para GA4!

---

#### **2.2. Opção Alternativa: Tags Individuais (NÃO RECOMENDADO)**

Se preferir criar tags individuais (não necessário, mas possível):

- `GA4 Server - page_view`
- `GA4 Server - purchase`
- etc.

**Desvantagem:** Mais tags para manter, mais configuração.

---

#### **2.3. Configurar GA4 Client (opcional)**

**Nome:** `GA4 Client`  
**Tipo:** GA4 Client  
**Measurement ID:** `{{const - ga4 measurement id}}`

**Uso:** Opcional, mas recomendado para:
- Gerenciar cookies server-side
- Melhorar atribuição
- Reduzir bloqueios de ad blockers

---

### **FASE 3: Webhook → GTM Server-Side** (2-3h)

#### **3.1. Modificar `/api/webhook-cakto`**

**Antes:**
```typescript
// Enviava diretamente para Meta CAPI
await sendOfflinePurchase(purchaseData, userData);
```

**Depois:**
```typescript
// Envia para GTM Server-Side
const gtmServerUrl = process.env.GTM_SERVER_URL || 'https://event.maracujazeropragas.com';
const eventData = {
  event: 'purchase',
  ecommerce: {
    transaction_id: purchaseData.orderId,
    value: purchaseData.value,
    currency: purchaseData.currency,
    items: [/* items */]
  },
  user_data: {
    // ... dados do Vercel KV
  }
};

await fetch(`${gtmServerUrl}/data`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(eventData)
});
```

---

#### **3.2. Criar Custom Client/Tag para Enriquecimento KV**

**Opção A: Custom Client (Recomendado)**

Criar um Client customizado que:
1. Recebe evento do Data Client
2. Busca dados no Vercel KV (via API route)
3. Enriquece Event Data
4. Passa para tags (FB Purchase, GA4)

**Opção B: Custom Tag (Mais simples)**

Criar uma tag customizada que:
1. Recebe evento
2. Busca KV (via API route)
3. Enriquece e envia para Meta/GA4

---

#### **3.3. Criar API Route para Buscar KV**

**Rota:** `/api/gtm-enrich` (ou similar)

**Função:** Buscar dados do Vercel KV e retornar para GTM Server

```typescript
// GET /api/gtm-enrich?email=xxx&phone=xxx
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  const phone = request.nextUrl.searchParams.get('phone');
  
  const userData = await getUserDataFromKVOrPrisma(email, phone);
  
  return NextResponse.json(userData);
}
```

---

### **FASE 4: Testes** (1h)

#### **4.1. Testar GTM Web Container**

1. Abrir site
2. GTM Preview Mode
3. Disparar evento (ex: `purchase` no DataLayer)
4. Verificar:
   - ✅ GA4 tag dispara (browser)
   - ✅ Data Tag dispara (server)
   - ✅ Evento chega no Server Container

---

#### **4.2. Testar GTM Server-Side Container**

1. GTM Server-Side Preview Mode
2. Verificar eventos chegando:
   - ✅ Data Client recebe
   - ✅ FB Purchase tag dispara
   - ✅ GA4 Event tag dispara
3. Verificar logs:
   - ✅ Eventos enriquecidos com KV
   - ✅ Enviados para Meta/GA4

---

#### **4.3. Testar Webhook**

1. Usar ReqBin ou Postman
2. Enviar webhook simulado
3. Verificar:
   - ✅ Evento chega no GTM Server
   - ✅ Enriquece com KV
   - ✅ Envia para Meta/GA4
   - ✅ Aparece no Meta Events Manager
   - ✅ Aparece no GA4 Real-Time

---

## 📝 CHECKLIST COMPLETO

### **GTM Web Container**
- [ ] Criar variável `const - ga4 measurement id`
- [ ] Criar `GA4 - Configuration` tag
- [ ] Criar `GA4 - page_view` tag
- [ ] Criar `GA4 - view_item` tag
- [ ] Criar `GA4 - add_to_cart` tag
- [ ] Criar `GA4 - begin_checkout` tag
- [ ] Criar `GA4 - purchase` tag
- [ ] Criar `GA4 - generate_lead` tag
- [ ] Verificar Data Tags (já existem)
- [ ] Testar Preview Mode

---

### **GTM Server-Side Container**
- [ ] Criar variável `const - ga4 measurement id`
- [ ] Criar `GA4 - All Events` tag (única, dinâmica)
- [ ] Configurar triggers (All Events ou específicos)
- [ ] Criar API route `/api/gtm-enrich` (buscar KV)
- [ ] Criar Custom Client/Tag para enriquecimento (opcional)
- [ ] Testar Preview Mode

---

### **Webhook**
- [ ] Modificar `/api/webhook-cakto` para enviar ao GTM Server
- [ ] Criar função de preparação de Event Data
- [ ] Testar webhook com ReqBin
- [ ] Validar enriquecimento com KV
- [ ] Verificar eventos no Meta Events Manager
- [ ] Verificar eventos no GA4 Real-Time

---

### **Variáveis de Ambiente**
- [ ] `GTM_SERVER_URL` = `https://event.maracujazeropragas.com`
- [ ] `GA4_MEASUREMENT_ID` = `G-XXXXXXXXXX`
- [ ] `KV_REST_API_URL` (já existe)
- [ ] `KV_REST_API_TOKEN` (já existe)

---

## 🎯 RESPOSTA À SUA DÚVIDA

### **GA4 no Server-Side: Uma tag ou várias?**

**✅ RESPOSTA: UMA TAG ÚNICA (Recomendado)**

**Por quê:**
- GTM Server-Side usa `{{Event Name}}` dinâmico
- Uma única tag captura todos os eventos automaticamente
- Menos configuração, menos manutenção
- Mais eficiente

**Como funciona:**
```
Evento chega: {event: 'purchase', ...}
           ↓
GTM Server recebe: event_name = 'purchase'
           ↓
GA4 Tag usa: {{Event Name}} = 'purchase'
           ↓
GA4 recebe: evento 'purchase' ✅
```

**Exceção:** Se precisar de parâmetros diferentes por evento, pode criar tags individuais, mas geralmente **não é necessário**.

---

## 📊 ESTRUTURA FINAL

### **GTM Web Container**
```
Tags:
├── GA4 Configuration (All Pages)
├── GA4 - page_view (ce - page_view)
├── GA4 - view_item (ce - view_item)
├── GA4 - add_to_cart (ce - add_to_cart)
├── GA4 - begin_checkout (ce - begin_checkout)
├── GA4 - purchase (ce - purchase)
├── GA4 - generate_lead (ce - generate_lead)
├── DT - page_view → Server (ce - page_view)
├── DT - view_item → Server (ce - view_item)
├── DT - add_to_cart → Server (ce - add_to_cart)
├── DT - begin_checkout → Server (ce - begin_checkout)
├── DT - purchase → Server (ce - purchase)
└── DT - generate_lead → Server (ce - generate_lead)
```

### **GTM Server-Side Container**
```
Tags:
├── FB - Purchase (dc - purchase)
├── FB - ViewContent (dc - view_item)
├── FB - Lead (dc - generate_lead)
├── FB - PageView (dc - page_view)
├── FB - AddToCart (dc - add_to_cart)
├── FB - InitiateCheckout (dc - begin_checkout)
└── GA4 - All Events (All Events) ← UMA TAG ÚNICA!
```

---

## 🚀 PRÓXIMOS PASSOS

1. **Confirmar GA4 Measurement ID**
2. **Criar tags no GTM Web Container**
3. **Criar tag GA4 no GTM Server-Side Container**
4. **Modificar webhook**
5. **Testar tudo**

---

**Pronto para começar?** 🎯


# ?? Estrutura UTM Avan?ada - Elite Level

**Implementa??o:** 01/11/2025  
**Status:** ? Implementada e Integrada  

---

## ??? ARQUITETURA

### Sistema Completo de UTM Tracking

```
1. Captura Autom?tica (Page Load)
   ?
2. Persist?ncia (localStorage + sessionStorage)
   ?
3. First-Touch & Last-Touch Attribution
   ?
4. Hist?rico Completo (at? 50 touchpoints)
   ?
5. Integra??o com Meta Pixel
   ?
6. Salvar no Vercel KV (Lead)
   ?
7. Enviar no Purchase (Webhook)
```

---

## ?? PAR?METROS UTM CAPTURADOS

### UTM Parameters (Padr?o Google Analytics):
- ? `utm_source` - Origem (ex: google, facebook, newsletter)
- ? `utm_medium` - M?dia (ex: cpc, email, social, referral)
- ? `utm_campaign` - Campanha (ex: black_friday, lancamento_produto)
- ? `utm_content` - Conte?do (ex: banner_top, link_rodape)
- ? `utm_term` - Termo (ex: palavra-chave do Google Ads)
- ? `utm_id` - ID da Campanha

### Click IDs (Ads Platforms):
- ? `gclid` - Google Ads Click ID
- ? `fbclid` - Facebook Click ID (j? capturado pelo Meta)

### Dados Adicionais:
- ? `referrer` - URL de refer?ncia
- ? `landing_page` - P?gina de entrada
- ? `timestamp` - Quando foi capturado

---

## ?? DETEC??O AUTOM?TICA DE CANAL

Sistema detecta automaticamente o canal baseado em source/medium:

### Paid Channels:
- `google_ads` - utm_source=google + utm_medium=cpc/ppc/paid
- `facebook_ads` - utm_source=facebook/fb/meta + utm_medium=cpc/ppc/paid
- `instagram_ads` - utm_source=instagram/ig + utm_medium=cpc/ppc/paid
- `tiktok_ads` - utm_source=tiktok + utm_medium=cpc/ppc/paid
- `youtube_ads` - utm_source=youtube/yt + utm_medium=cpc/ppc/paid
- `paid_other` - outros + utm_medium=cpc/ppc/paid

### Organic Channels:
- `organic_search` - utm_source=google/bing + utm_medium=organic
- `social_organic` - utm_source=facebook/instagram/twitter + utm_medium=social
- `referral` - utm_medium=referral/link
- `email` - utm_medium=email ou utm_source=newsletter
- `direct` - sem UTM

### Fallback Referrer:
Se URL n?o tem UTMs, detecta do document.referrer:
- `google.com` ? utm_source=google, utm_medium=organic
- `facebook.com` ? utm_source=facebook, utm_medium=referral
- `instagram.com` ? utm_source=instagram, utm_medium=referral
- `youtube.com` ? utm_source=youtube, utm_medium=referral
- Outros ? utm_source=hostname, utm_medium=referral

---

## ?? PERSIST?NCIA DE DADOS

### localStorage (Permanente):
```javascript
elite_utm_first_touch    // First Touch (NUNCA sobrescreve)
elite_utm_last_touch     // Last Touch (sempre atualiza)
elite_utm_history        // Hist?rico completo (at? 50 entradas)
```

### sessionStorage (Sess?o Atual):
```javascript
elite_utm_session        // UTMs da sess?o atual
```

---

## ?? ATTRIBUTION MODEL

### First-Touch Attribution:
```javascript
{
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "black_friday_2025",
  utm_content: "banner_desktop",
  utm_term: "maracuja zero pragas",
  gclid: "EAIaIQ...",
  referrer: "https://www.google.com/search...",
  landing_page: "/",
  timestamp: 1762031282408
}
```

**Quando ? capturado:** Primeira visita do usu?rio  
**Persist?ncia:** Permanente (at? limpar localStorage)  
**Uso:** Saber qual foi a origem inicial do usu?rio  

---

### Last-Touch Attribution:
```javascript
{
  utm_source: "facebook",
  utm_medium: "cpc",
  utm_campaign: "retargeting_q4",
  utm_content: "carousel_produto",
  fbclid: "IwAR2eX8...",
  referrer: "https://www.facebook.com/",
  landing_page: "/",
  timestamp: 1762033350248
}
```

**Quando ? capturado:** Toda vez que usu?rio acessa com novos UTMs  
**Persist?ncia:** Atualiza sempre  
**Uso:** Saber qual foi a ?ltima origem antes da convers?o  

---

### Multi-Touch History:
```javascript
[
  { /* First Touch */ },
  { /* Segunda visita */ },
  { /* Terceira visita */ },
  { /* Last Touch */ }
]
```

**Quando ? capturado:** Cada visita com UTMs diferentes  
**Limite:** 50 entradas (remove mais antigas)  
**Uso:** An?lise completa da jornada do usu?rio  

---

## ?? INTEGRA??O COM META PIXEL

### Custom Parameters Enviados:

```javascript
{
  // First Touch
  utm_first_source: "google",
  utm_first_medium: "cpc",
  utm_first_campaign: "black_friday_2025",
  utm_first_channel: "google_ads",
  
  // Last Touch
  utm_last_source: "facebook",
  utm_last_medium: "cpc",
  utm_last_campaign: "retargeting_q4",
  utm_last_channel: "facebook_ads",
  
  // Metadata
  utm_touch_count: 4,
  utm_channels: "google_ads,direct,facebook_ads",
  
  // Click IDs
  gclid: "EAIaIQ..." // se houver
}
```

**Enviado em TODOS os eventos:**
- ? PageView
- ? ViewContent
- ? ScrollDepth
- ? AddToCart
- ? Lead
- ? InitiateCheckout
- ? Purchase

---

## ?? FLUXO COMPLETO

### 1?? Usu?rio Acessa o Site (Com UTM):

```
URL: https://maracujazeropragas.com/?utm_source=google&utm_medium=cpc&utm_campaign=black_friday
       ?
Sistema captura UTMs automaticamente
       ?
Salva First Touch (se primeiro acesso)
       ?
Salva Last Touch (sempre)
       ?
Adiciona ao hist?rico
       ?
PageView ? disparado COM UTMs
```

**Meta Events Manager:**
```
PageView
Par?metros: (20+)
- utm_first_source: google
- utm_first_medium: cpc
- utm_first_campaign: black_friday
- utm_last_source: google
- utm_last_medium: cpc
- utm_last_campaign: black_friday
- utm_touch_count: 1
- utm_channels: google_ads
```

---

### 2?? Usu?rio Retorna (Via Facebook):

```
URL: https://maracujazeropragas.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting
       ?
Sistema captura novos UTMs
       ?
First Touch: N?O muda (ainda ? Google)
       ?
Last Touch: Atualiza para Facebook
       ?
Adiciona ao hist?rico
       ?
PageView ? disparado COM UTMs atualizados
```

**Meta Events Manager:**
```
PageView
Par?metros: (20+)
- utm_first_source: google    ? Mant?m Google
- utm_first_medium: cpc
- utm_first_campaign: black_friday
- utm_last_source: facebook   ? Atualizado!
- utm_last_medium: cpc
- utm_last_campaign: retargeting
- utm_touch_count: 2
- utm_channels: google_ads,facebook_ads
```

---

### 3?? Usu?rio Converte (Lead):

```
User preenche formul?rio
       ?
Lead ? disparado COM UTMs
       ?
Dados salvos no Vercel KV:
  - Email, phone, nome
  - fbp, fbc
  - Attribution completa
  - UTMs (first + last + history)
```

**Vercel KV:**
```javascript
{
  email: "user@email.com",
  fbp: "fb.1.17610...",
  fbc: "fb.1.17614...",
  
  // Attribution
  firstTouchSource: "direct",
  lastTouchSource: "facebook",
  
  // UTMs (NOVO!)
  utmFirstSource: "google",
  utmFirstMedium: "cpc",
  utmFirstCampaign: "black_friday",
  utmLastSource: "facebook",
  utmLastMedium: "cpc",
  utmLastCampaign: "retargeting",
  utmTouchCount: 2,
  utmChannels: "google_ads,facebook_ads"
}
```

---

### 4?? Usu?rio Compra (Purchase):

```
Cakto envia webhook
       ?
Sistema busca user no Vercel KV
       ?
Purchase ? enviado COM UTMs do Lead
```

**Meta Events Manager:**
```
Purchase
Par?metros: (30+)
- value: 39.9
- currency: BRL
- order_id: ORDER_123

// Attribution
- fb_first_touch_source: direct
- fb_last_touch_source: facebook

// UTMs (do Lead!)
- utm_first_source: google
- utm_first_medium: cpc
- utm_first_campaign: black_friday
- utm_last_source: facebook
- utm_last_medium: cpc
- utm_last_campaign: retargeting
- utm_touch_count: 2
- utm_channels: google_ads,facebook_ads
```

---

## ?? FUN??ES DISPON?VEIS

### `initUTMTracking()`
Inicializa tracking (chamar no load da p?gina)
```typescript
const capturedUTMs = initUTMTracking();
// Retorna UTMs capturados ou null
```

### `getFirstTouchUTMs()`
Obt?m First Touch UTMs
```typescript
const firstTouch = getFirstTouchUTMs();
// { utm_source: "google", utm_medium: "cpc", ... }
```

### `getLastTouchUTMs()`
Obt?m Last Touch UTMs
```typescript
const lastTouch = getLastTouchUTMs();
// { utm_source: "facebook", utm_medium: "cpc", ... }
```

### `getCurrentSessionUTMs()`
Obt?m UTMs da sess?o atual
```typescript
const currentSession = getCurrentSessionUTMs();
// UTMs da visita atual
```

### `getUTMHistory()`
Obt?m hist?rico completo
```typescript
const history = getUTMHistory();
// [{ ... }, { ... }, { ... }] (at? 50)
```

### `getUTMAttribution()`
Obt?m atribui??o completa
```typescript
const attribution = getUTMAttribution();
// {
//   firstTouch: { ... },
//   lastTouch: { ... },
//   touchCount: 4,
//   history: [...],
//   channels: ["google_ads", "facebook_ads"]
// }
```

### `formatUTMsForMeta()`
Formata UTMs para enviar ao Meta
```typescript
const metaParams = formatUTMsForMeta();
// {
//   utm_first_source: "google",
//   utm_first_medium: "cpc",
//   ...
// }
```

### `clearUTMData()`
Limpa todos os dados de UTM
```typescript
clearUTMData();
// Remove tudo do localStorage/sessionStorage
```

### `getUTMDiagnostics()`
Diagn?stico completo (para debug)
```typescript
const diagnostics = getUTMDiagnostics();
// {
//   currentURL: "...",
//   hasUTMsInURL: true,
//   firstTouch: { ... },
//   lastTouch: { ... },
//   ...
// }
```

---

## ?? EXEMPLOS DE USO

### Exemplo 1: Campanha Google Ads

**URL:**
```
https://maracujazeropragas.com/?utm_source=google&utm_medium=cpc&utm_campaign=maracuja_zero_pragas&utm_term=maracuja+zero+pragas&gclid=EAIaIQ...
```

**Capturado:**
```javascript
{
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "maracuja_zero_pragas",
  utm_term: "maracuja+zero+pragas",
  gclid: "EAIaIQ...",
  utm_channel: "google_ads"
}
```

---

### Exemplo 2: Campanha Facebook Ads

**URL:**
```
https://maracujazeropragas.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting_q4&utm_content=carousel_produto&fbclid=IwAR2eX8...
```

**Capturado:**
```javascript
{
  utm_source: "facebook",
  utm_medium: "cpc",
  utm_campaign: "retargeting_q4",
  utm_content: "carousel_produto",
  fbclid: "IwAR2eX8...",
  utm_channel: "facebook_ads"
}
```

---

### Exemplo 3: Email Marketing

**URL:**
```
https://maracujazeropragas.com/?utm_source=newsletter&utm_medium=email&utm_campaign=lancamento_ebook
```

**Capturado:**
```javascript
{
  utm_source: "newsletter",
  utm_medium: "email",
  utm_campaign: "lancamento_ebook",
  utm_channel: "email"
}
```

---

### Exemplo 4: Tr?fego Org?nico (Sem UTM)

**URL:**
```
https://maracujazeropragas.com/
Referrer: https://www.google.com/search?q=maracuja+zero+pragas
```

**Capturado:**
```javascript
{
  utm_source: "google",
  utm_medium: "organic",
  referrer: "https://www.google.com/search?q=maracuja+zero+pragas",
  utm_channel: "organic_search"
}
```

---

## ?? AN?LISE DE JORNADA

### Cen?rio Real:

**Visita 1 (Google Ads):**
```
UTM: google / cpc / black_friday
A??o: PageView, ViewContent
Resultado: N?o converteu
```

**Visita 2 (Direct):**
```
UTM: direct / none
A??o: PageView
Resultado: N?o converteu
```

**Visita 3 (Facebook Ads):**
```
UTM: facebook / cpc / retargeting_q4
A??o: PageView, ViewContent, AddToCart
Resultado: N?o converteu
```

**Visita 4 (Email):**
```
UTM: newsletter / email / lancamento_ebook
A??o: PageView, Lead, Purchase
Resultado: CONVERTEU! ??
```

### Attribution no Purchase:

**First-Touch (Google Ads):**
- utm_first_source: google
- utm_first_medium: cpc
- utm_first_campaign: black_friday
- utm_first_channel: google_ads

**Last-Touch (Email):**
- utm_last_source: newsletter
- utm_last_medium: email
- utm_last_campaign: lancamento_ebook
- utm_last_channel: email

**Multi-Touch:**
- utm_touch_count: 4
- utm_channels: google_ads,direct,facebook_ads,email

**An?lise:**
- ? Google Ads trouxe o usu?rio pela primeira vez
- ? Facebook Ads reengajou o usu?rio
- ? Email converteu (last-touch)
- ? Jornada completa: 4 touchpoints, 3 canais pagos

---

## ? INTEGRA??O COMPLETA

### Arquivos Criados/Atualizados:

1. **`src/lib/utmTracking.ts`** ? NOVO!
   - Sistema completo de UTM tracking
   - 500+ linhas de c?digo
   
2. **`src/lib/eliteMetaPixelTracking.ts`**
   - Import formatUTMsForMeta()
   - Adicionar UTMs em TODOS os eventos

3. **`src/components/EliteMetaPixel.tsx`**
   - Inicializar UTM tracking no load

4. **`src/lib/userTrackingStore.ts`**
   - Adicionar campos UTM na interface

5. **`src/lib/offlineConversions.ts`**
   - Enviar UTMs no Purchase webhook

---

## ?? RESULTADO FINAL

### TODOS os Eventos Agora T?m:

? **Advanced Matching** (13/15 campos)  
? **Attribution Multi-Touch** (first/last touch)  
? **UTM Tracking Completo** (first/last/history)  
? **Channel Detection** (autom?tico)  
? **Click IDs** (gclid, fbclid)  
? **Data Quality Score** (98 pontos)  

### Exemplo de Evento Completo:

```javascript
Lead / Purchase
Par?metros: (40+)

// Produto
value: 39.9
currency: BRL
content_ids: ["hacr962"]

// User Data
em, ph, fn, ln, ct, st, zp, country
fbp, fbc

// Attribution
fb_first_touch_source: direct
fb_last_touch_source: facebook
fb_attribution_journey: {...}

// UTMs (NOVO!)
utm_first_source: google
utm_first_medium: cpc
utm_first_campaign: black_friday
utm_first_channel: google_ads
utm_last_source: newsletter
utm_last_medium: email
utm_last_campaign: lancamento_ebook
utm_last_channel: email
utm_touch_count: 4
utm_channels: google_ads,direct,facebook_ads,email
gclid: EAIaIQ...

// Metadata
fb_data_quality_score: 98
fb_tracking_version: 2.0_elite
```

---

## ?? DEPLOY

**Status:** ? Pronto para commit  
**Deploy Time:** 2 minutos  

---

**Sistema UTM Elite 100% Implementado!** ????

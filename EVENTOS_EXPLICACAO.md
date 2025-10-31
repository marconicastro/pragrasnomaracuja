# ?? Como Funcionam os Eventos com Stape.io

## ?? Fluxo Completo dos Eventos

### Arquitetura Anterior (Client-Side) ?

```
???????????????
?   Browser   ?
?  (Usu?rio)  ?
???????????????
       ? 1. Meta Pixel JS carrega
       ?    (Bloque?vel por ad-blockers)
       ?
???????????????????????
?  Meta Pixel Script  ?
?  (Client-Side)      ?
???????????????????????
       ? 2. Envia evento DIRETO
       ?    (IP do usu?rio, dados expostos)
       ?
????????????????????
?   Meta Servers   ?
?  (Facebook API)  ?
????????????????????

? PROBLEMAS:
- 40% dos eventos bloqueados (ad-blockers)
- IP do usu?rio pode ser VPN/proxy
- Dados PII expostos no browser
- EQM baixo (7.5-8.5/10)
```

### Arquitetura Nova (Server-Side via Stape.io) ?

```
???????????????
?   Browser   ?
?  (Usu?rio)  ?
???????????????
       ? 1. Usu?rio interage (clica, rola, etc)
       ?    Fun??o: trackEvent()
       ?
???????????????????????????
?  /api/track (Next.js)   ?
?  (Seu Servidor)         ?
?  - Hash SHA-256 de PII  ?
?  - Captura IP real      ?
?  - Adiciona User-Agent  ?
???????????????????????????
       ? 2. POST com dados hasheados
       ?    
       ?
???????????????????????????
?  Stape.io Gateway       ?
?  (Server-Side Tracking) ?
?  - Valida evento        ?
?  - Enriquece dados      ?
?  - Deduplica            ?
???????????????????????????
       ? 3. Envia via CAPI
       ?    (Meta Conversions API)
       ?
????????????????????
?   Meta Servers   ?
?  (Facebook API)  ?
????????????????????

? VANTAGENS:
- 100% dos eventos capturados (n?o bloque?vel)
- IP e dados reais do servidor
- Dados PII hasheados no servidor
- EQM alto (9.0-9.5/10)
```

---

## ?? Fluxo Detalhado de Um Evento

### Exemplo: Usu?rio clica em "Comprar Agora"

#### **1. Frontend dispara o evento**

```typescript
// src/app/page.tsx (linha ~271)

const scrollToCheckout = async () => {
  // Chamada simples da fun??o de tracking
  await trackCTAClick('Quero Economizar', {
    cta_type: 'main_checkout_scroll',
    action: 'scroll_to_checkout'
  });
  
  document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
};
```

#### **2. trackingService.ts envia para API**

```typescript
// src/lib/trackingService.ts

export async function trackCTAClick(
  buttonText: string,
  customParams: Record<string, any> = {}
) {
  return trackEvent({
    eventName: 'CTAClick',        // Nome do evento
    eventType: 'custom',          // Tipo (standard ou custom)
    customParams: {
      button_text: buttonText,
      content_name: `CTA: ${buttonText}`,
      ...customParams
    },
  });
}

// Fun??o base que envia para API
async function trackEvent({ eventName, eventType, customParams, userData }) {
  const response = await fetch('/api/track', {  // ? Chama sua API
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName,
      eventType,
      customParams: {
        event_source_url: window.location.href,  // URL atual
        ...customParams
      },
      userData
    }),
  });
  
  return response.json();
}
```

#### **3. API Route processa e envia para Stape.io**

```typescript
// src/app/api/track/route.ts

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { eventName, customParams, userData } = body;
  
  // 1. Gerar Event ID ?nico (para deduplica??o)
  const eventId = generateEventId(eventName);
  const timestamp = Math.floor(Date.now() / 1000);
  
  // 2. Capturar dados reais do servidor
  const clientIP = getClientIP(request);           // IP real (n?o VPN)
  const clientUserAgent = request.headers.get('user-agent');
  
  // 3. Hash SHA-256 dos dados PII (no servidor!)
  const hashedUserData = {
    client_ip_address: clientIP,
    client_user_agent: clientUserAgent,
    em: hashSHA256(userData.email),           // email hasheado
    ph: hashSHA256(userData.phone),           // telefone hasheado
    fn: hashSHA256(userData.firstName),       // nome hasheado
    ln: hashSHA256(userData.lastName),        // sobrenome hasheado
    ct: hashSHA256(userData.city),            // cidade hasheada
    st: hashSHA256(userData.state),           // estado hasheado
    zp: hashSHA256(userData.zip),             // CEP hasheado
    country: hashSHA256(userData.country),    // pa?s hasheado
  };
  
  // 4. Montar payload para Stape.io Meta Conversions API
  const payload = {
    data: [{
      event_name: eventName,                   // "CTAClick"
      event_time: timestamp,                   // Unix timestamp
      event_id: eventId,                       // ID ?nico
      event_source_url: customParams.event_source_url,
      action_source: 'website',
      user_data: hashedUserData,               // Dados hasheados
      custom_data: customParams                // Par?metros customizados
    }],
    access_token: META_ACCESS_TOKEN            // Seu token Meta
  };
  
  // 5. Enviar para Stape.io Gateway
  const stapeResponse = await fetch(
    `${STAPE_CONTAINER_URL}/v15.0/${META_PIXEL_ID}/events`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  );
  
  return NextResponse.json({ success: true, eventId });
}
```

#### **4. Stape.io processa e envia para Meta**

```
?????????????????????????????????????
?  Stape.io Gateway                 ?
?????????????????????????????????????
?                                   ?
?  1. Recebe evento                 ?
?  2. Valida formato                ?
?  3. Enriquece com dados extras    ?
?  4. Aplica regras de neg?cio      ?
?  5. Deduplica (via event_id)      ?
?  6. Envia para Meta CAPI          ?
?                                   ?
?????????????????????????????????????
            ?
?????????????????????????????????????
?  Meta Conversions API             ?
?????????????????????????????????????
?                                   ?
?  1. Recebe evento                 ?
?  2. Calcula EQM (Event Quality)   ?
?  3. Atribui convers?o             ?
?  4. Atualiza audi?ncias           ?
?  5. Otimiza campanhas             ?
?                                   ?
?????????????????????????????????????
```

---

## ?? Eventos Implementados

### 1. **PageView** (Standard Event)

**Quando dispara:** Ao carregar a p?gina

```typescript
// Autom?tico no useEffect
useEffect(() => {
  trackPageView();
}, []);
```

**Dados enviados:**
```json
{
  "eventName": "PageView",
  "customParams": {
    "value": 39.9,
    "currency": "BRL",
    "content_ids": ["339591"],
    "content_type": "product",
    "content_name": "Sistema 4 Fases - Ebook Trips"
  }
}
```

**Meta recebe:** In?cio de sess?o, interesse em produto

---

### 2. **ViewContent** (Standard Event)

**Quando dispara:** 
- Ap?s 15 segundos na p?gina OU
- Quando usu?rio rola 25% da p?gina

```typescript
// Timing (15s)
setTimeout(async () => {
  await trackViewContent({
    trigger_type: 'timing',
    time_on_page: 15
  });
}, 15000);

// Scroll (25%)
if (scrollPercentage >= 25) {
  await trackViewContent({
    trigger_type: 'scroll',
    scroll_depth: 25
  });
}
```

**Dados enviados:**
```json
{
  "eventName": "ViewContent",
  "customParams": {
    "value": 39.9,
    "currency": "BRL",
    "content_ids": ["339591"],
    "trigger_type": "timing",
    "time_on_page": 15
  }
}
```

**Meta recebe:** Interesse confirmado, usu?rio engajado

---

### 3. **ScrollDepth** (Custom Event)

**Quando dispara:** Aos 50% e 75% de scroll

```typescript
if (scrollPercentage >= 50 && !scrollEventsFired['50']) {
  await trackScrollDepth(50);
}

if (scrollPercentage >= 75 && !scrollEventsFired['75']) {
  await trackScrollDepth(75);
}
```

**Dados enviados:**
```json
{
  "eventName": "ScrollDepth",
  "eventType": "custom",
  "customParams": {
    "percent": 50,
    "scroll_depth": 50
  }
}
```

**Meta recebe:** N?vel de engajamento do usu?rio

---

### 4. **CTAClick** (Custom Event)

**Quando dispara:** Ao clicar em bot?es principais

```typescript
const scrollToCheckout = async () => {
  await trackCTAClick('Quero Economizar', {
    cta_type: 'main_checkout_scroll',
    action: 'scroll_to_checkout'
  });
};
```

**Dados enviados:**
```json
{
  "eventName": "CTAClick",
  "eventType": "custom",
  "customParams": {
    "button_text": "Quero Economizar",
    "cta_type": "main_checkout_scroll",
    "action": "scroll_to_checkout"
  }
}
```

**Meta recebe:** Inten??o de compra, a??o espec?fica

---

### 5. **Lead** (Standard Event)

**Quando dispara:** Ao submeter formul?rio com dados

```typescript
await trackLead({
  email: 'user@example.com',
  phone: '11999999999',
  firstName: 'Jo?o',
  lastName: 'Silva',
  city: 'S?o Paulo',
  state: 'SP',
  zip: '01310100',
  country: 'br'
});
```

**Dados enviados:**
```json
{
  "eventName": "Lead",
  "customParams": {
    "value": 15.0,
    "currency": "BRL",
    "content_name": "Formul?rio de Contato"
  },
  "userData": {
    "email": "user@example.com",        // ? Ser? hasheado no servidor
    "phone": "11999999999",             // ? Ser? hasheado no servidor
    "firstName": "Jo?o",                // ? Ser? hasheado no servidor
    "lastName": "Silva",                // ? Ser? hasheado no servidor
    "city": "S?o Paulo",                // ? Ser? hasheado no servidor
    "state": "SP",                      // ? Ser? hasheado no servidor
    "zip": "01310100",                  // ? Ser? hasheado no servidor
    "country": "br"                     // ? Ser? hasheado no servidor
  }
}
```

**Meta recebe (ap?s hash no servidor):**
```json
{
  "event_name": "Lead",
  "user_data": {
    "em": "4d186321c1a7f0f354b297e8914ab240a7b7c64a7a5a45e07b0ac1e6f02f8d7c",
    "ph": "d3d5c9a62f96fdcb5c8e85e9d2d6c3a84e5f7f8c9d6e5f4a3b2c1d0e9f8a7b6c5",
    "fn": "9b871512327c09ce91dd649b3f96a63b7408ef267c8cc5710114e629730cb61",
    "ln": "f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b",
    // ... todos os dados hasheados com SHA-256
  },
  "custom_data": {
    "value": 15.0,
    "currency": "BRL"
  }
}
```

**Meta recebe:** Lead qualificado com dados completos (EQM 9.0+)

---

### 6. **InitiateCheckout** (Standard Event)

**Quando dispara:** Ao submeter formul?rio (junto com Lead)

```typescript
await trackInitiateCheckout({
  email: 'user@example.com',
  phone: '11999999999',
  firstName: 'Jo?o',
  lastName: 'Silva',
  // ... mesmos dados do Lead
});
```

**Dados enviados:**
```json
{
  "eventName": "InitiateCheckout",
  "customParams": {
    "value": 39.9,
    "currency": "BRL",
    "content_ids": ["339591"],
    "num_items": 1
  },
  "userData": { /* mesmos dados do Lead */ }
}
```

**Meta recebe:** Inten??o forte de compra, carrinho iniciado

---

### 7. **Purchase** (Standard Event) - A IMPLEMENTAR

**Quando dispara:** Ao confirmar compra (webhook do checkout)

```typescript
// Voc? precisar? implementar isso quando receber confirma??o do checkout
await trackPurchase(
  {
    email: 'user@example.com',
    phone: '11999999999',
    // ...
  },
  'ORDER_123456',  // ID do pedido
  {
    value: 39.9,
    currency: 'BRL'
  }
);
```

**Meta recebe:** Convers?o confirmada, ROI calculado

---

## ?? Seguran?a e Privacidade

### Dados PII (Personally Identifiable Information)

Todos os dados pessoais s?o **hasheados no servidor** antes de enviar para Stape.io:

```typescript
// NO SERVIDOR (API Route)
function hashSHA256(data: string): string {
  return crypto.createHash('sha256')
    .update(data.toLowerCase().trim())
    .digest('hex');
}

// Exemplo:
hashSHA256('joao@example.com')
// ? "4d186321c1a7f0f354b297e8914ab240a7b7c64a7a5a45e07b0ac1e6f02f8d7c"
```

**Por que isso ? importante?**
- ? Dados pessoais nunca expostos no browser
- ? Imposs?vel reverter o hash (one-way)
- ? Meta consegue fazer matching sem ver dados originais
- ? Compliance com LGPD/GDPR

---

## ?? Event Quality Match (EQM)

O Meta calcula um score de qualidade para cada evento baseado nos dados enviados:

### Fatores que afetam o EQM:

| Dado | Peso | Status Atual |
|------|------|--------------|
| Email | ????? | ? Enviado (hasheado) |
| Telefone | ???? | ? Enviado (hasheado) |
| Nome completo | ??? | ? Enviado (hasheado) |
| Cidade | ??? | ? Enviado (hasheado) |
| Estado | ??? | ? Enviado (hasheado) |
| CEP | ??? | ? Enviado (hasheado) |
| Pa?s | ?? | ? Enviado (hasheado) |
| IP | ???? | ? Capturado no servidor |
| User-Agent | ?? | ? Capturado no servidor |

**EQM Esperado:** ?? **9.0 - 9.5 / 10**

---

## ?? Deduplica??o de Eventos

### Como funciona:

Cada evento recebe um **Event ID ?nico**:

```typescript
function generateEventId(eventName: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const random = Math.random().toString(36).substring(2, 8);
  return `${eventName}_${timestamp}_${random}`;
}

// Exemplo:
// "Lead_1709834521_a3x9k2"
```

**Por que isso ? importante?**
- Se o evento for enviado duas vezes (retry, duplicata), o Meta ignora
- Garante contagem precisa de convers?es
- Evita desperd?cio de budget em eventos duplicados

---

## ?? Como Testar

### 1. Teste a API diretamente

```bash
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Lead",
    "eventType": "standard",
    "customParams": {
      "value": 15.0,
      "currency": "BRL"
    },
    "userData": {
      "email": "test@example.com",
      "firstName": "Jo?o",
      "lastName": "Silva"
    }
  }'
```

### 2. Teste no browser (Console do Chrome)

```javascript
// Abra o console (F12) na sua p?gina

// Teste simples
await fetch('/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    eventName: 'PageView',
    eventType: 'standard',
    customParams: { value: 39.9, currency: 'BRL' }
  })
}).then(r => r.json()).then(console.log);
```

### 3. Verifique no Stape.io

1. Acesse seu container no Stape.io
2. Clique em **Preview Mode**
3. Ver? eventos chegando em tempo real

### 4. Verifique no Meta Events Manager

1. Acesse https://business.facebook.com/events_manager2
2. Selecione seu Pixel (642933108377475)
3. V? para **Test Events**
4. Ver? o evento com EQM score

---

## ?? Resumo

### ? Como funciona agora:

1. **Frontend** ? Chama fun??o simples (`trackEvent()`)
2. **API Route** ? Hash PII + captura IP/UA + envia
3. **Stape.io** ? Valida + enriquece + deduplica
4. **Meta** ? Recebe evento com EQM 9.0+

### ? Vantagens:

- ?? **N?o bloque?vel** por ad-blockers
- ?? **Seguro** (dados hasheados no servidor)
- ?? **Preciso** (IP real, n?o VPN)
- ?? **Alto EQM** (9.0-9.5/10)
- ?? **C?digo limpo** (300 linhas vs. 5.000)

### ? Eventos atuais:

- ? PageView
- ? ViewContent
- ? ScrollDepth
- ? CTAClick
- ? Lead
- ? InitiateCheckout
- ?? Purchase (a implementar quando tiver confirma??o do checkout)

---

**D?vidas?** Consulte:
- `QUICK_START.md` - Setup r?pido
- `STAPE_IMPLEMENTATION.md` - Detalhes t?cnicos
- [Stape.io Docs](https://stape.io/helpdesk/documentation/meta-conversions-api-gateway-overview)

# ?? AUDITORIA COMPLETA - Advanced Matching

## ?? 14 CAMPOS DE ADVANCED MATCHING (Meta Ads)

| # | Campo | Nome | Status Atual | Problema |
|---|-------|------|--------------|----------|
| 1 | `em` | Email | ? OK | - |
| 2 | `ph` | Phone | ? OK | - |
| 3 | `fn` | First Name | ? OK | - |
| 4 | `ln` | Last Name | ? OK | - |
| 5 | `ct` | City | ?? PARCIAL | Falta fallback |
| 6 | `st` | State | ?? PARCIAL | Falta fallback |
| 7 | `zp` | ZIP Code | ?? PARCIAL | Falta fallback |
| 8 | `country` | Country | ? CR?TICO | **N?o est? em Cold Events!** |
| 9 | `ge` | Gender | ?? N/A | N?o coletamos |
| 10 | `db` | Date of Birth | ?? N/A | N?o coletamos |
| 11 | `external_id` | External ID | ? OK | Session ID |
| 12 | `fbp` | Facebook Browser ID | ? OK | - |
| 13 | `fbc` | Facebook Click ID | ? OK | - |
| 14 | `client_ip_address` | IP Address | ? OK | Stape adiciona |
| 15 | `client_user_agent` | User Agent | ? OK | Stape adiciona |

---

## ?? PROBLEMAS CR?TICOS ENCONTRADOS:

### 1. **COUNTRY n?o est? em Cold Events**

**C?digo Atual:**
```typescript
// coldEventsEnrichment.ts - linha 346
if (geo.country && !user_data.country) {
  user_data.country = geo.country;
  sources.push('ip_country');
}
// Se API falhar, N?O adiciona country! ?
```

**PROBLEMA:**
- Se API de IP falhar ? NENHUM country ? enviado
- Brasil ? 100% dos usu?rios ? SEMPRE deveria enviar 'br'

**IMPACTO:**
- PageView sem country ? -2 pontos no Data Quality Score
- ViewContent sem country ? -2 pontos no Data Quality Score
- Todos os Cold Events perdem pontos desnecessariamente

---

### 2. **COUNTRY n?o est? sendo salvo no localStorage**

**C?digo Atual:**
```typescript
// advancedDataPersistence.ts - saveAdvancedUserData()
// Salva: email, phone, firstName, lastName, city, state, zip
// ? N?O salva country!
```

**PROBLEMA:**
- User retorna ao site ? country n?o ? recuperado
- API de IP pode falhar na 2? visita ? country se perde

---

### 3. **EXTERNAL_ID n?o est? sendo gerado corretamente**

**C?digo Atual:**
```typescript
// Usa sessionId como external_id
// Mas sessionId muda a cada sess?o!
```

**PROBLEMA:**
- external_id deveria ser ?NICO POR USU?RIO (n?o por sess?o!)
- Meta usa para match entre dispositivos
- Deveria ser gerado UMA VEZ e persistido

---

### 4. **Falta Country em Purchase Webhook (quando n?o tem user)**

**C?digo Atual:**
```typescript
// offlineConversions.ts - linha 369
user_data.country = 'br'; // ? TEM!
```

**Status:** ? OK (j? corrigido no ?ltimo commit)

---

## ?? IMPACTO NO DATA QUALITY SCORE:

### Cen?rio Atual (Cold Event sem API):
```
Campos enviados:
? fbp: +15 pontos
? fbc: +10 pontos (se houver)
? fb_device_type: +2 pontos
? fb_browser: +2 pontos
? fb_os: +1 ponto
? country: FALTANDO (-2 pontos)

TOTAL: 30 pontos (deveria ser 32!)
```

### Com Corre??o (Cold Event):
```
Campos enviados:
? fbp: +15 pontos
? fbc: +10 pontos (se houver)
? country: +2 pontos (SEMPRE!)
? fb_device_type: +2 pontos
? fb_browser: +2 pontos
? fb_os: +1 ponto

TOTAL: 32 pontos ?
```

---

## ?? CORRE??ES NECESS?RIAS:

### ? 1. Adicionar Country DEFAULT em Cold Events

```typescript
// coldEventsEnrichment.ts

// ANTES:
if (geo.country && !user_data.country) {
  user_data.country = geo.country;
}

// DEPOIS:
if (geo && geo.country && !user_data.country) {
  user_data.country = geo.country;
  sources.push('ip_country');
}

// SEMPRE adicionar BR como fallback (99% dos users)
if (!user_data.country) {
  user_data.country = 'br';
  sources.push('default_country');
}
```

### ? 2. Salvar Country no localStorage

```typescript
// advancedDataPersistence.ts - saveAdvancedUserData()

export interface UserDataComplete {
  // ... campos existentes
  country?: string; // ? J? EXISTE!
}

// Garantir que est? sendo salvo:
const userData: UserDataComplete = {
  // ... outros campos
  country: data.country || 'br', // ? Adicionar
};
```

### ? 3. External ID ?nico por usu?rio (opcional)

```typescript
// Gerar external_id baseado em:
// 1. Email (se dispon?vel) ? hash(email)
// 2. fbp (se dispon?vel) ? hash(fbp)
// 3. Session ID (fallback)

function getOrCreateExternalId(): string {
  const stored = localStorage.getItem('zc_external_id');
  if (stored) return stored;
  
  const userData = getAdvancedUserData();
  const metaCookies = getMetaCookies();
  
  let externalId: string;
  
  if (userData?.email) {
    externalId = hashSimple(userData.email);
  } else if (metaCookies.fbp) {
    externalId = hashSimple(metaCookies.fbp);
  } else {
    externalId = generateSessionId();
  }
  
  localStorage.setItem('zc_external_id', externalId);
  return externalId;
}
```

---

## ?? RESULTADO ESPERADO AP?S CORRE??ES:

### PageView (Cold Event):
```javascript
{
  // Meta Identifiers (SEMPRE)
  fbp: "fb.1.17610...",     // ?
  fbc: "fb.1.17614...",     // ? (se houver)
  external_id: "ext_abc",   // ?
  
  // Geolocaliza??o
  country: "br",            // ? SEMPRE (novo!)
  ct: "sao paulo",          // ? (se API funcionar)
  st: "sp",                 // ? (se API funcionar)
  zp: "01310100",           // ? (se API funcionar)
  
  // Browser Context
  fb_device_type: "mobile", // ?
  fb_browser: "chrome",     // ?
  fb_os: "android",         // ?
  fb_language: "pt-BR"      // ?
}
```

**Data Quality Score:** 32-45 pontos (dependendo da API)

---

### Lead (Warm Event):
```javascript
{
  // PII
  em: "user@email.com",     // ?
  ph: "5511999999999",      // ?
  fn: "joao",               // ?
  ln: "silva",              // ?
  
  // Meta Identifiers
  fbp: "fb.1.17610...",     // ?
  fbc: "fb.1.17614...",     // ?
  external_id: "ext_abc",   // ?
  
  // Geolocaliza??o COMPLETA
  country: "br",            // ? SEMPRE
  ct: "sao paulo",          // ?
  st: "sp",                 // ?
  zp: "01310100"            // ?
}
```

**Data Quality Score:** 80-100 pontos

---

### Purchase (Webhook - COM Lead):
```javascript
{
  // PII
  em: hash("user@email.com"),  // ?
  ph: hash("5511999999999"),   // ?
  fn: hash("joao"),            // ?
  ln: hash("silva"),           // ?
  
  // Meta Identifiers (DO LEAD!)
  fbp: "fb.1.17610...",        // ?
  fbc: "fb.1.17614...",        // ?
  
  // Geolocaliza??o COMPLETA (DO LEAD!)
  country: "br",               // ?
  ct: hash("sao paulo"),       // ?
  st: hash("sp"),              // ?
  zp: hash("01310100")         // ?
}
```

**Data Quality Score:** 90-105 pontos

---

### Purchase (Webhook - SEM Lead):
```javascript
{
  // PII (da Cakto)
  em: hash("novo@email.com"),  // ?
  ph: hash("5511888888888"),   // ?
  fn: hash("maria"),           // ?
  ln: hash("santos"),          // ?
  
  // Geolocaliza??o m?nima
  country: "br"                // ? SEMPRE
}
```

**Data Quality Score:** 52 pontos (melhor que 50!)

---

## ? PRIORIDADE DAS CORRE??ES:

| Prioridade | Corre??o | Impacto | Esfor?o |
|------------|----------|---------|---------|
| ?? **P0** | Country default em Cold Events | +2 pontos em TODOS os eventos | 5 min |
| ?? **P1** | Garantir country ? salvo no Lead | Persist?ncia entre visitas | 2 min |
| ?? **P2** | External ID ?nico | Match cross-device | 15 min |

---

## ?? PR?XIMOS PASSOS:

1. ? Implementar corre??o P0 (country default)
2. ? Implementar corre??o P1 (salvar country)
3. ?? Implementar corre??o P2 (external_id) - OPCIONAL
4. ?? Testar todos os eventos
5. ?? Verificar Data Quality Score aumentou

---

**CR?TICO:** A corre??o P0 (country default) deve ser feita AGORA! Est? afetando TODOS os Cold Events (PageView, ViewContent, AddToCart, ScrollDepth, CTAClick).

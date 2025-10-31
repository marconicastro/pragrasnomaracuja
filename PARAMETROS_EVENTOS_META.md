# ?? Par?metros Enviados para o Meta - Detalhamento Completo

## ?? Vis?o Geral

Cada evento envia **par?metros diferentes** dependendo do tipo e contexto. Vou detalhar **TODOS** os par?metros enviados para cada evento.

---

## ?? Estrutura de Um Evento

Todo evento enviado cont?m:

```javascript
{
  // Par?metros do evento (custom_data)
  value: 39.9,
  currency: 'BRL',
  // ...

  // Metadados (automaticamente adicionados)
  event_id: 'PageView_1730000000_abc12',  // Deduplica??o
  event_source_url: 'https://seu-site.com',
  client_ip_address: '187.123.45.67',     // Via Stape
  client_user_agent: 'Mozilla/5.0...',    // Via Stape
  
  // Dados do usu?rio (quando dispon?veis)
  user_data: {
    em: 'user@email.com',
    ph: '11999999999',
    // ...
  }
}
```

---

## 1?? PageView

**Quando dispara:** Automaticamente ao carregar a p?gina

### Par?metros Enviados:

```javascript
{
  // Custom Data (5 par?metros)
  value: 39.9,
  currency: 'BRL',
  content_ids: ['339591'],
  content_type: 'product',
  content_name: 'Sistema 4 Fases - Ebook Trips',
  
  // Metadados (autom?ticos via Meta Pixel + Stape)
  event_id: 'PageView_1730000000_abc12',
  event_source_url: 'https://seu-site.com',
  event_time: 1730000000,
  action_source: 'website',
  
  // Via Stape (server-side)
  client_ip_address: '187.123.45.67',
  client_user_agent: 'Mozilla/5.0...',
  
  // Cookies (autom?ticos via Meta Pixel)
  fbp: 'fb.1.1730000000.123456789',
  fbc: 'fb.1.1730000000.IwAR...'
}
```

**Total:** ~5 par?metros custom + ~8 metadados = **13 par?metros**

---

## 2?? ViewContent

**Quando dispara:** Ap?s 15 segundos na p?gina OU 25% de scroll

### Par?metros Enviados:

```javascript
{
  // Custom Data (6 par?metros base + 2 condicionais)
  value: 39.9,
  currency: 'BRL',
  content_ids: ['339591'],
  content_type: 'product',
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_category: 'digital_product',
  
  // Par?metros condicionais (dependendo do gatilho)
  trigger_type: 'timing',        // OU 'scroll'
  time_on_page: 15,              // Se timing
  scroll_depth: 25,              // Se scroll
  
  // Metadados (autom?ticos)
  event_id: 'ViewContent_1730000000_xyz34',
  event_source_url: 'https://seu-site.com',
  event_time: 1730000000,
  action_source: 'website',
  client_ip_address: '187.123.45.67',
  client_user_agent: 'Mozilla/5.0...',
  fbp: 'fb.1.1730000000.123456789',
  fbc: 'fb.1.1730000000.IwAR...'
}
```

**Total:** ~6-8 par?metros custom + ~8 metadados = **14-16 par?metros**

---

## 3?? ScrollDepth (Custom Event)

**Quando dispara:** Aos 50% e 75% de scroll

### Par?metros Enviados:

```javascript
{
  // Custom Data (2 par?metros)
  percent: 50,                   // OU 75
  scroll_depth: 50,              // OU 75
  
  // Metadados (autom?ticos)
  event_id: 'ScrollDepth_1730000000_def56',
  event_source_url: 'https://seu-site.com',
  event_time: 1730000000,
  action_source: 'website',
  client_ip_address: '187.123.45.67',
  client_user_agent: 'Mozilla/5.0...',
  fbp: 'fb.1.1730000000.123456789',
  fbc: 'fb.1.1730000000.IwAR...'
}
```

**Total:** ~2 par?metros custom + ~8 metadados = **10 par?metros**

---

## 4?? CTAClick (Custom Event)

**Quando dispara:** Ao clicar em bot?es principais

### Par?metros Enviados:

#### Exemplo 1: Bot?o "Quero Economizar"

```javascript
{
  // Custom Data (5 par?metros)
  button_text: 'Quero Economizar',
  content_name: 'CTA: Quero Economizar',
  cta_type: 'main_checkout_scroll',
  action: 'scroll_to_checkout',
  
  // Metadados (autom?ticos)
  event_id: 'CTAClick_1730000000_ghi78',
  event_source_url: 'https://seu-site.com',
  event_time: 1730000000,
  action_source: 'website',
  client_ip_address: '187.123.45.67',
  client_user_agent: 'Mozilla/5.0...',
  fbp: 'fb.1.1730000000.123456789',
  fbc: 'fb.1.1730000000.IwAR...'
}
```

#### Exemplo 2: Bot?o "Final Checkout"

```javascript
{
  // Custom Data (4 par?metros)
  button_text: 'Final Checkout',
  content_name: 'CTA: Final Checkout',
  cta_type: 'final_checkout_modal',
  action: 'open_modal',
  
  // Metadados (autom?ticos)
  event_id: 'CTAClick_1730000000_jkl90',
  event_source_url: 'https://seu-site.com',
  event_time: 1730000000,
  action_source: 'website',
  client_ip_address: '187.123.45.67',
  client_user_agent: 'Mozilla/5.0...',
  fbp: 'fb.1.1730000000.123456789',
  fbc: 'fb.1.1730000000.IwAR...'
}
```

**Total:** ~4-5 par?metros custom + ~8 metadados = **12-13 par?metros**

---

## 5?? Lead ? (Standard Event - MAIS IMPORTANTE)

**Quando dispara:** Ao submeter formul?rio com dados do usu?rio

### Par?metros Enviados:

```javascript
{
  // Custom Data (4 par?metros)
  value: 15.0,
  currency: 'BRL',
  content_name: 'Formul?rio de Contato - Sistema 4 Fases',
  content_category: 'lead_generation',
  
  // User Data (7 par?metros PII - hasheados automaticamente pelo Meta Pixel)
  user_data: {
    em: 'joao@email.com',           // Email
    ph: '11999999999',              // Telefone
    fn: 'Jo?o',                     // First name
    ln: 'Silva',                    // Last name
    ct: 'S?o Paulo',                // City
    st: 'SP',                       // State
    zp: '01310100'                  // ZIP/CEP
  },
  
  // Metadados (autom?ticos)
  event_id: 'Lead_1730000000_mno12',
  event_source_url: 'https://seu-site.com',
  event_time: 1730000000,
  action_source: 'website',
  client_ip_address: '187.123.45.67',
  client_user_agent: 'Mozilla/5.0...',
  fbp: 'fb.1.1730000000.123456789',
  fbc: 'fb.1.1730000000.IwAR...'
}
```

**Total:** ~4 par?metros custom + ~7 user_data + ~8 metadados = **19 par?metros** ??

**EQM Esperado:** 9.0-9.5/10 (todos os dados PII preenchidos)

---

## 6?? InitiateCheckout ? (Standard Event - MUITO IMPORTANTE)

**Quando dispara:** Ao submeter formul?rio (junto com Lead)

### Par?metros Enviados:

```javascript
{
  // Custom Data (6 par?metros)
  value: 39.9,
  currency: 'BRL',
  content_ids: ['339591'],
  content_type: 'product',
  content_name: 'Sistema 4 Fases - Ebook Trips',
  num_items: 1,
  
  // User Data (7 par?metros PII)
  user_data: {
    em: 'joao@email.com',           // Email
    ph: '11999999999',              // Telefone
    fn: 'Jo?o',                     // First name
    ln: 'Silva',                    // Last name
    ct: 'S?o Paulo',                // City
    st: 'SP',                       // State
    zp: '01310100'                  // ZIP/CEP
  },
  
  // Metadados (autom?ticos)
  event_id: 'InitiateCheckout_1730000000_pqr34',
  event_source_url: 'https://seu-site.com',
  event_time: 1730000000,
  action_source: 'website',
  client_ip_address: '187.123.45.67',
  client_user_agent: 'Mozilla/5.0...',
  fbp: 'fb.1.1730000000.123456789',
  fbc: 'fb.1.1730000000.IwAR...'
}
```

**Total:** ~6 par?metros custom + ~7 user_data + ~8 metadados = **21 par?metros** ??

**EQM Esperado:** 9.0-9.5/10 (todos os dados PII + produto)

---

## 7?? Purchase ?? (Standard Event - A IMPLEMENTAR)

**Quando dispara:** Ao confirmar compra (webhook do checkout externo)

### Par?metros Que Ser?o Enviados:

```javascript
{
  // Custom Data (7 par?metros)
  value: 39.9,
  currency: 'BRL',
  content_ids: ['339591'],
  content_type: 'product',
  content_name: 'Sistema 4 Fases - Ebook Trips',
  num_items: 1,
  transaction_id: 'ORDER_123456',    // ID ?nico do pedido
  
  // User Data (4 par?metros m?nimos)
  user_data: {
    em: 'joao@email.com',
    ph: '11999999999',
    fn: 'Jo?o',
    ln: 'Silva'
  },
  
  // Metadados (autom?ticos)
  event_id: 'Purchase_1730000000_stu56',
  event_source_url: 'https://seu-site.com',
  event_time: 1730000000,
  action_source: 'website',
  client_ip_address: '187.123.45.67',
  client_user_agent: 'Mozilla/5.0...',
  fbp: 'fb.1.1730000000.123456789',
  fbc: 'fb.1.1730000000.IwAR...'
}
```

**Total:** ~7 par?metros custom + ~4 user_data + ~8 metadados = **19 par?metros**

---

## ?? Resumo por Evento

| Evento | Custom Data | User Data | Metadados | **TOTAL** | EQM Esperado |
|--------|-------------|-----------|-----------|-----------|--------------|
| **PageView** | 5 | 0 | 8 | **13** | 7.0-8.0 |
| **ViewContent** | 6-8 | 0 | 8 | **14-16** | 7.5-8.5 |
| **ScrollDepth** | 2 | 0 | 8 | **10** | 6.0-7.0 |
| **CTAClick** | 4-5 | 0 | 8 | **12-13** | 6.5-7.5 |
| **Lead** ? | 4 | **7** | 8 | **19** | **9.0-9.5** |
| **InitiateCheckout** ? | 6 | **7** | 8 | **21** | **9.0-9.5** |
| **Purchase** ?? | 7 | **4** | 8 | **19** | **9.0-9.5** |

---

## ?? Detalhamento dos User Data (PII)

Os dados do usu?rio enviados em **Lead** e **InitiateCheckout**:

### Como S?o Enviados (Frontend):

```javascript
user_data: {
  em: 'joao@email.com',      // Email (texto plano)
  ph: '11999999999',         // Telefone (texto plano)
  fn: 'Jo?o',                // First name (texto plano)
  ln: 'Silva',               // Last name (texto plano)
  ct: 'S?o Paulo',           // City (texto plano)
  st: 'SP',                  // State (texto plano)
  zp: '01310100'             // ZIP/CEP (texto plano)
}
```

### Como Chegam no Meta (ap?s hash autom?tico):

```javascript
user_data: {
  em: 'a1b2c3d4...',         // SHA-256 hash
  ph: 'e5f6g7h8...',         // SHA-256 hash
  fn: 'i9j0k1l2...',         // SHA-256 hash
  ln: 'm3n4o5p6...',         // SHA-256 hash
  ct: 'q7r8s9t0...',         // SHA-256 hash
  st: 'u1v2w3x4...',         // SHA-256 hash
  zp: 'y5z6a7b8...'          // SHA-256 hash
}
```

**Processo:**
1. Voc? envia texto plano para `window.fbq()`
2. Meta Pixel hasheia automaticamente (browser)
3. Stape recebe hasheado e enriquece (server)
4. Meta recebe de 2 fontes (browser + server)
5. Deduplica usando `event_id`

---

## ?? Seguran?a dos Dados

### No Browser (antes de enviar):

```javascript
// Voc? chama assim (texto plano - NORMAL!)
trackLead({
  email: 'joao@email.com',
  phone: '11999999999',
  firstName: 'Jo?o',
  lastName: 'Silva'
});
```

### Meta Pixel processa:

```javascript
// Meta Pixel hasheia AUTOMATICAMENTE antes de enviar
{
  em: hashSHA256('joao@email.com'),
  ph: hashSHA256('11999999999'),
  fn: hashSHA256('jo?o'),
  ln: hashSHA256('silva')
}
```

### Stape recebe e enriquece:

```javascript
// Stape adiciona dados server-side
{
  ...dadosHasheados,
  client_ip_address: '187.123.45.67',  // IP real do servidor
  client_user_agent: 'Mozilla/5.0...'  // UA real do servidor
}
```

---

## ?? Impacto no EQM (Event Quality Match)

### Eventos SEM user_data (EQM 6.0-8.0):
- PageView, ViewContent, ScrollDepth, CTAClick
- Apenas cookies (fbp, fbc) e metadados
- Bom para tracking inicial

### Eventos COM user_data (EQM 9.0-9.5):
- Lead, InitiateCheckout, Purchase
- Dados PII completos + cookies + metadados
- **ESSENCIAL** para convers?es

---

## ?? Como Aumentar Par?metros (Se Quiser)

### Adicionar mais custom_data:

```javascript
// Exemplo: adicionar mais info no Lead
trackLead(userData, {
  lead_source: 'organic',
  landing_page: '/ebook-trips',
  referrer: 'google.com',
  device_type: 'mobile',
  browser: 'chrome',
  predicted_ltv: 180.00
});
```

### Adicionar mais user_data:

```javascript
// Exemplo: adicionar pa?s e g?nero
trackLead({
  email: 'joao@email.com',
  phone: '11999999999',
  firstName: 'Jo?o',
  lastName: 'Silva',
  city: 'S?o Paulo',
  state: 'SP',
  zip: '01310100',
  country: 'br',          // +1 par?metro
  gender: 'm'             // +1 par?metro
});
```

---

## ? Conclus?o

### Eventos Mais Importantes (com mais par?metros):

1. **InitiateCheckout** - 21 par?metros (6 custom + 7 user + 8 meta)
2. **Lead** - 19 par?metros (4 custom + 7 user + 8 meta)
3. **Purchase** - 19 par?metros (7 custom + 4 user + 8 meta)

### Eventos de Engajamento (menos par?metros):

4. **ViewContent** - 14-16 par?metros
5. **PageView** - 13 par?metros
6. **CTAClick** - 12-13 par?metros
7. **ScrollDepth** - 10 par?metros

### Recomenda??o:

? **Priorize enviar dados completos** em Lead, InitiateCheckout e Purchase  
? **Garanta 7 campos de user_data** para EQM 9.0+  
? **Mantenha eventos simples** nos demais (engajamento)  

**Sua implementa??o atual j? est? ?tima!** ??

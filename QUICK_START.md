# ?? Quick Start: Stape.io Meta Conversions API

## ? Setup R?pido (5 minutos)

### 1?? Configure as Credenciais

```bash
# Copie o template
cp .env.local.example .env.local
```

Edite `.env.local` e adicione:

```bash
# Sua URL do Stape.io (sem barra no final)
STAPE_CONTAINER_URL=https://sgtm.maracujazeropragas.com

# Seu Meta Access Token
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxx

# Pixel ID (j? configurado)
NEXT_PUBLIC_META_PIXEL_ID=642933108377475
```

### 2?? Obter Credenciais

#### **Stape Container URL**
1. Acesse https://app.stape.io/
2. Seu container ? **Settings** ? **Server URL**
3. Copie a URL completa

#### **Meta Access Token**
1. Acesse https://business.facebook.com/settings/system-users
2. Selecione/crie um System User
3. **Generate New Token**
4. Selecione seu app e permiss?es:
   - `ads_management`
   - `business_management`
5. Copie o token (come?a com `EAA...`)

### 3?? Teste a Integra??o

```bash
# Inicie o servidor
npm run dev

# Em outro terminal, teste a API
curl http://localhost:3000/api/track/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "stapeConfigured": true,
  "pixelIdConfigured": true,
  "accessTokenConfigured": true
}
```

### 4?? Teste um Evento Real

```bash
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "PageView",
    "eventType": "standard",
    "customParams": {
      "value": 39.9,
      "currency": "BRL"
    },
    "userData": {
      "email": "test@example.com",
      "firstName": "Jo?o",
      "lastName": "Silva"
    }
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "eventName": "PageView",
  "eventId": "PageView_1234567890_abc123",
  "stapeResponse": { ... }
}
```

### 5?? Verifique no Stape.io

1. V? para https://app.stape.io/
2. Seu container ? **Preview Mode**
3. Voc? ver? o evento PageView chegando

### 6?? Verifique no Meta

1. Acesse https://business.facebook.com/events_manager2
2. Selecione seu Pixel (642933108377475)
3. V? para **Test Events**
4. Voc? ver? o evento com alto EQM (9.0+)

---

## ?? Eventos Dispon?veis

### Frontend (j? implementado em `page.tsx`)

```typescript
import {
  trackPageView,
  trackViewContent,
  trackScrollDepth,
  trackCTAClick,
  trackLead,
  trackInitiateCheckout
} from '@/lib/trackingService';

// PageView (dispara automaticamente ao carregar p?gina)
await trackPageView();

// ViewContent (dispara ap?s 15s ou 25% scroll)
await trackViewContent({ trigger_type: 'timing' });

// ScrollDepth (dispara em 50% e 75% de scroll)
await trackScrollDepth(50);

// CTA Click (dispara ao clicar em bot?es)
await trackCTAClick('Comprar Agora', {
  button_position: 'hero'
});

// Lead (dispara ao submeter formul?rio)
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

// InitiateCheckout (dispara ao submeter formul?rio)
await trackInitiateCheckout({
  email: 'user@example.com',
  // ... mesmo formato do Lead
});
```

---

## ?? Troubleshooting

### Erro: "Stape.io n?o configurado corretamente"
- ? Verifique se `.env.local` existe
- ? Verifique se as vari?veis est?o corretas
- ? Reinicie o servidor: `npm run dev`

### Eventos n?o aparecem no Meta
- ? Verifique o Access Token (pode ter expirado)
- ? Verifique logs do Stape.io para erros
- ? Verifique se o container est? ativo

### CORS Error
- ? N?o deveria acontecer (tracking ? server-side)
- ? Se acontecer, verifique a configura??o do Stape.io

---

## ?? Documenta??o Completa

- [`STAPE_IMPLEMENTATION.md`](./STAPE_IMPLEMENTATION.md) - Guia t?cnico completo
- [`MIGRATION_SUMMARY.md`](./MIGRATION_SUMMARY.md) - Resumo da migra??o
- [Stape.io Docs](https://stape.io/helpdesk/documentation/meta-conversions-api-gateway-overview)

---

## ? Checklist de Deploy

Antes de fazer deploy em produ??o:

- [ ] Configurar `.env.local` (ou vari?veis no servidor)
- [ ] Testar eventos em desenvolvimento
- [ ] Verificar eventos no Stape.io Preview Mode
- [ ] Verificar EQM no Meta Events Manager (deve ser 9.0+)
- [ ] Verificar que todos os eventos est?o disparando
- [ ] Fazer build de produ??o: `npm run build`
- [ ] Testar em produ??o ap?s deploy
- [ ] Monitorar eventos nas primeiras 24h

---

## ?? Pronto!

Seu tracking server-side est? configurado e funcionando!

**Vantagens:**
- ? 100% de captura (n?o bloque?vel)
- ? EQM 9.0+ (melhor atribui??o)
- ? Privacidade (dados hasheados no servidor)
- ? Performance (tracking ass?ncrono)
- ? C?digo limpo e mant?vel

**D?vidas?** Consulte a documenta??o completa nos arquivos mencionados acima.

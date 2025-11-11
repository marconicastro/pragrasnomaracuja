# 📘 Guia Completo de Implementação: DataLayer e Tracking GTM Server-Side

## 🎯 Objetivo deste Documento

Este documento serve como **referência completa** para implementar do zero um sistema de tracking via **Google Tag Manager Server-Side** com **Meta Conversions API (CAPI)**. 

**Formato:** Conversacional e técnico, adequado para ser usado por uma IA para replicar a estrutura em novos projetos.

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Estrutura do DataLayer](#estrutura-do-datalayer)
3. [Eventos Implementados](#eventos-implementados)
4. [Configuração do GTM Server-Side](#configuração-do-gtm-server-side)
5. [Implementação Passo a Passo](#implementação-passo-a-passo)
6. [Estrutura de Arquivos](#estrutura-de-arquivos)
7. [Variáveis de Ambiente](#variáveis-de-ambiente)
8. [Exemplos de Uso](#exemplos-de-uso)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ Visão Geral da Arquitetura

### Fluxo de Dados

```
┌─────────────────┐
│   Browser       │
│  (Next.js App)  │
└────────┬────────┘
         │
         │ 1. Evento disparado (ex: Lead, Purchase)
         │    Função: trackLeadElite(), trackPurchaseElite()
         │
         ▼
┌─────────────────┐
│  DataLayer      │
│  (window.dataLayer)│
│                 │
│  - event        │
│  - event_id     │
│  - action_source│
│  - user_data    │
│  - custom_data  │
└────────┬────────┘
         │
         │ 2. Push para DataLayer
         │    Função: pushToDataLayer()
         │
         ▼
┌─────────────────┐
│  GTM Server-Side│
│  (Stape.io)     │
│                 │
│  - Intercepta   │
│  - Processa     │
│  - Normaliza    │
│  - Envia CAPI   │
└────────┬────────┘
         │
         │ 3. Envio para Meta CAPI
         │
         ▼
┌─────────────────┐
│  Meta CAPI      │
│  (Facebook)      │
│                 │
│  - Recebe evento│
│  - Deduplica    │
│  - Atribui      │
└─────────────────┘
```

### Componentes Principais

1. **Browser (Client-Side)**
   - Funções de tracking: `trackPageViewElite()`, `trackLeadElite()`, etc.
   - DataLayer: `pushToDataLayer()`, `pushPageView()`, `pushLead()`, etc.
   - Persistência: `localStorage`, `sessionStorage`, cookies

2. **GTM Server-Side (Stape.io)**
   - Intercepta eventos do DataLayer
   - Processa e normaliza dados
   - Envia para Meta CAPI via Conversions API

3. **Server-Side (Webhook)**
   - Recebe eventos externos (ex: Purchase via webhook Cakto)
   - Busca dados persistidos (fbp/fbc)
   - Envia para GTM Server-Side ou Meta CAPI direto

---

## 📊 Estrutura do DataLayer

### Formato Base de um Evento

```typescript
{
  // ✅ OBRIGATÓRIO: Nome do evento
  event: 'page_view' | 'view_item' | 'add_to_cart' | 'begin_checkout' | 'generate_lead' | 'purchase',
  
  // ✅ OBRIGATÓRIO: Event ID único (para deduplicação)
  event_id: 'PageView_1762603285854_aachf2o02f',
  
  // ✅ OBRIGATÓRIO: Origem do evento
  action_source: 'website', // 'website' para browser, 'other' para server
  
  // ✅ OBRIGATÓRIO: Dados do usuário (Advanced Matching)
  user_data: {
    user_id: 'external_id_123',           // ID externo (session ID ou external_id)
    email_address: 'usuario@email.com',   // Email (será hasheado pelo GTM)
    phone_number: '5511999999999',        // Telefone (será hasheado pelo GTM)
    first_name: 'João',                   // Nome (será hasheado pelo GTM)
    last_name: 'Silva',                   // Sobrenome (será hasheado pelo GTM)
    city: 'São Paulo',                    // Cidade (será hasheado pelo GTM)
    region: 'São Paulo',                   // Estado (será hasheado pelo GTM)
    postal_code: '01310100',              // CEP (será hasheado pelo GTM)
    country: 'BR',                        // País (será hasheado pelo GTM)
    fbp: 'fb.1.1762197216212.722663367903060652',  // Facebook Browser ID (CRÍTICO!)
    fbc: 'fb.1.1762538585425.IwAR2eX8Z7Y9w1L4K6P3Q8R5T2U1V4W6X9Y2Z3A7B8C1D2E3F4G5H6I7J8K9L0',  // Facebook Click ID (CRÍTICO!)
    client_user_agent: 'Mozilla/5.0...'   // User Agent (capturado automaticamente)
  },
  
  // ✅ Campos também no nível raiz (para acesso direto no GTM)
  // Isso facilita o acesso no GTM Server-Side usando {{ed - email_address}}
  email_address: 'usuario@email.com',
  phone_number: '5511999999999',
  first_name: 'João',
  last_name: 'Silva',
  city: 'São Paulo',
  region: 'São Paulo',
  postal_code: '01310100',
  country: 'BR',
  user_id: 'external_id_123',
  fbp: 'fb.1.1762197216212.722663367903060652',
  fbc: 'fb.1.1762538585425.IwAR2eX8Z7Y9w1L4K6P3Q8R5T2U1V4W6X9Y2Z3A7B8C1D2E3F4G5H6I7J8K9L0',
  
  // ✅ Dados do produto/conteúdo (custom_data)
  value: 39.9,                            // Valor do produto
  currency: 'BRL',                         // Moeda
  content_ids: ['hacr962'],               // IDs dos produtos
  contents: [{                            // Detalhes dos produtos
    id: 'hacr962',
    quantity: 1,
    item_price: 39.9
  }],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  num_items: 1,
  
  // ✅ Ecommerce (apenas para Purchase)
  ecommerce: {
    transaction_id: 'ORDER_123',
    value: 39.9,
    currency: 'BRL',
    items: [{
      item_id: 'hacr962',
      item_name: 'Sistema 4 Fases - Ebook Trips',
      price: 39.9,
      quantity: 1,
      item_category: 'digital_product',
      item_brand: 'Ebook Trips'
    }]
  }
}
```

### Campos Críticos para Deduplicação

**IMPORTANTE:** Para deduplicação correta entre browser e server, os seguintes campos DEVEM ser idênticos:

1. **`event_id`**: Formato `{eventName}_{timestamp}_{random}`
   - Exemplo: `InitiateCheckout_1762603285854_aachf2o02f`
   - Browser e Server DEVEM usar o MESMO `event_id`

2. **`action_source`**: 
   - Browser: `'website'`
   - Server: `'other'`

3. **`user_data`**: Todos os campos devem estar presentes e normalizados
   - `fbp` e `fbc` são CRÍTICOS para atribuição
   - `user_id` (external_id) é CRÍTICO para matching

---

## 🎯 Eventos Implementados

### 1. PageView

**Função:** `trackPageViewElite()`

**DataLayer Event:** `page_view`

**Estrutura:**
```typescript
{
  event: 'page_view',
  event_id: 'PageView_1762603285854_aachf2o02f',
  action_source: 'website',
  user_data: { /* todos os campos */ },
  // Campos também no nível raiz
  email_address: '...',
  phone_number: '...',
  // ... etc
}
```

**Quando disparar:**
- Ao carregar a página inicial
- Ao navegar para uma nova página (SPA)

**Código de exemplo:**
```typescript
import { trackPageViewElite } from '@/lib/eliteMetaPixelTracking';

// No useEffect ou no carregamento da página
useEffect(() => {
  trackPageViewElite();
}, []);
```

---

### 2. ViewContent (ViewItem)

**Função:** `trackViewContentElite()`

**DataLayer Event:** `view_item`

**Estrutura:**
```typescript
{
  event: 'view_item',
  event_id: 'ViewContent_1762603285854_aachf2o02f',
  action_source: 'website',
  value: 39.9,
  currency: 'BRL',
  content_ids: ['hacr962'],
  contents: [{ id: 'hacr962', quantity: 1, item_price: 39.9 }],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  num_items: 1,
  user_data: { /* todos os campos */ },
  // Campos também no nível raiz
  email_address: '...',
  // ... etc
}
```

**Quando disparar:**
- 2 segundos após PageView (timing)
- 10 segundos após PageView (backup)
- 20% de scroll na página

**Código de exemplo:**
```typescript
import { trackViewContentElite } from '@/lib/eliteMetaPixelTracking';

// Após 2 segundos do PageView
setTimeout(() => {
  trackViewContentElite({
    trigger_type: 'page_load',
    time_on_page: 2
  });
}, 2000);
```

---

### 3. AddToCart

**Função:** `trackAddToCartElite()`

**DataLayer Event:** `add_to_cart`

**Estrutura:**
```typescript
{
  event: 'add_to_cart',
  event_id: 'AddToCart_1762603285854_aachf2o02f',
  action_source: 'website',
  value: 39.9,
  currency: 'BRL',
  content_ids: ['hacr962'],
  contents: [{ id: 'hacr962', quantity: 1, item_price: 39.9 }],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  num_items: 1,
  user_data: { /* todos os campos */ },
  // Campos também no nível raiz
  email_address: '...',
  // ... etc
}
```

**Quando disparar:**
- Ao clicar no botão "COMPRAR AGORA"
- Ao adicionar produto ao carrinho

**Código de exemplo:**
```typescript
import { trackAddToCartElite } from '@/lib/eliteMetaPixelTracking';

const handleBuyClick = () => {
  trackAddToCartElite('COMPRAR AGORA');
};
```

---

### 4. GenerateLead

**Função:** `trackLeadElite()`

**DataLayer Event:** `generate_lead`

**Estrutura:**
```typescript
{
  event: 'generate_lead',
  event_id: 'Lead_1762603285854_aachf2o02f',
  action_source: 'website',
  value: 15.0,  // Valor do Lead
  currency: 'BRL',
  content_ids: ['hacr962'],
  contents: [{ id: 'hacr962', quantity: 1, item_price: 15.0 }],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  user_data: {
    // ✅ DADOS COMPLETOS DO FORMULÁRIO
    email_address: 'usuario@email.com',
    phone_number: '5511999999999',
    first_name: 'João',
    last_name: 'Silva',
    city: 'São Paulo',
    region: 'São Paulo',
    postal_code: '01310100',
    country: 'BR',
    user_id: 'external_id_123',
    fbp: 'fb.1.1762197216212.722663367903060652',
    fbc: 'fb.1.1762538585425.IwAR2eX8Z7Y9w1L4K6P3Q8R5T2U1V4W6X9Y2Z3A7B8C1D2E3F4G5H6I7J8K9L0',
    client_user_agent: 'Mozilla/5.0...'
  },
  // Campos também no nível raiz
  email_address: 'usuario@email.com',
  // ... etc
}
```

**Quando disparar:**
- Ao submeter formulário de Lead
- Quando usuário preenche e envia dados de contato

**Código de exemplo:**
```typescript
import { trackLeadElite } from '@/lib/eliteMetaPixelTracking';

const handleFormSubmit = async (formData) => {
  await trackLeadElite({
    email: formData.email,
    phone: formData.phone,
    firstName: formData.firstName,
    lastName: formData.lastName,
    city: formData.city,
    state: formData.state,
    zip: formData.zip
  });
};
```

**IMPORTANTE:** Este evento salva os dados do usuário para uso posterior (Purchase via webhook).

---

### 5. BeginCheckout (InitiateCheckout)

**Função:** `trackInitiateCheckoutElite()`

**DataLayer Event:** `begin_checkout`

**Estrutura:**
```typescript
{
  event: 'begin_checkout',
  event_id: 'InitiateCheckout_1762603285854_aachf2o02f',
  action_source: 'website',
  value: 39.9,
  currency: 'BRL',
  content_ids: ['hacr962'],
  contents: [{ id: 'hacr962', quantity: 1, item_price: 39.9 }],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  num_items: 1,
  user_data: {
    // ✅ DADOS COMPLETOS (mesmos do Lead)
    email_address: 'usuario@email.com',
    phone_number: '5511999999999',
    first_name: 'João',
    last_name: 'Silva',
    city: 'São Paulo',
    region: 'São Paulo',
    postal_code: '01310100',
    country: 'BR',
    user_id: 'external_id_123',
    fbp: 'fb.1.1762197216212.722663367903060652',
    fbc: 'fb.1.1762538585425.IwAR2eX8Z7Y9w1L4K6P3Q8R5T2U1V4W6X9Y2Z3A7B8C1D2E3F4G5H6I7J8K9L0',
    client_user_agent: 'Mozilla/5.0...'
  },
  // Campos também no nível raiz
  email_address: 'usuario@email.com',
  // ... etc
}
```

**Quando disparar:**
- Ao abrir modal de checkout
- Ao iniciar processo de pagamento
- 2 segundos após Lead (se aplicável)

**Código de exemplo:**
```typescript
import { trackInitiateCheckoutElite } from '@/lib/eliteMetaPixelTracking';

const handleCheckoutOpen = async (formData) => {
  await trackInitiateCheckoutElite({
    email: formData.email,
    phone: formData.phone,
    firstName: formData.firstName,
    lastName: formData.lastName,
    city: formData.city,
    state: formData.state,
    zip: formData.zip
  });
};
```

**IMPORTANTE:** Este evento usa o MESMO `event_id` que será usado no server-side para deduplicação.

---

### 6. Purchase

**Função:** `trackPurchaseElite()` (browser) ou `sendPurchaseToGTM()` (server/webhook)

**DataLayer Event:** `purchase`

**Estrutura (Browser):**
```typescript
{
  event: 'purchase',
  event_id: 'Purchase_ORDER123_1762603285854_aachf2o02f',
  action_source: 'website',
  ecommerce: {
    transaction_id: 'ORDER_123',
    value: 39.9,
    currency: 'BRL',
    items: [{
      item_id: 'hacr962',
      item_name: 'Sistema 4 Fases - Ebook Trips',
      price: 39.9,
      quantity: 1,
      item_category: 'digital_product',
      item_brand: 'Ebook Trips'
    }]
  },
  content_ids: ['hacr962'],
  contents: [{ id: 'hacr962', quantity: 1, item_price: 39.9 }],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  num_items: 1,
  value: 39.9,
  currency: 'BRL',
  user_data: { /* todos os campos */ },
  // Campos também no nível raiz
  email_address: '...',
  // ... etc
}
```

**Estrutura (Server/Webhook):**
```typescript
{
  event: 'purchase',
  event_id: 'ORDER_123_1762603285854',  // Formato: ${orderId}_${timestamp}
  action_source: 'other',  // ✅ Server-side
  ecommerce: {
    transaction_id: 'ORDER_123',
    value: 39.9,
    currency: 'BRL',
    items: [{
      item_id: 'hacr962',
      item_name: 'Sistema 4 Fases - Ebook Trips',
      price: 39.9,
      quantity: 1,
      item_category: 'digital_product',
      item_brand: 'Ebook Trips'
    }]
  },
  content_ids: ['hacr962'],
  contents: [{ id: 'hacr962', quantity: 1, item_price: 39.9 }],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  num_items: 1,
  user_data: {
    user_id: 'external_id_123',
    email_address: 'usuario@email.com',
    phone_number: '5511999999999',
    first_name: 'João',
    last_name: 'Silva',
    city: 'São Paulo',
    region: 'São Paulo',
    postal_code: '01310100',
    country: 'BR',
    fbp: 'fb.1.1762197216212.722663367903060652',
    fbc: 'fb.1.1762538585425.IwAR2eX8Z7Y9w1L4K6P3Q8R5T2U1V4W6X9Y2Z3A7B8C1D2E3F4G5H6I7J8K9L0'
  },
  client_ip_address: '192.168.1.1',
  client_user_agent: 'Mozilla/5.0...'
}
```

**Quando disparar:**
- **Browser:** Ao confirmar compra na página de obrigado (se aplicável)
- **Server:** Via webhook quando pagamento é confirmado (recomendado)

**Código de exemplo (Server/Webhook):**
```typescript
import { sendPurchaseToGTM, getUserDataFromKVOrPrisma } from '@/lib/offlineConversions';

// No webhook handler
const purchaseData = {
  orderId: 'ORDER_123',
  email: 'usuario@email.com',
  phone: '11999999999',
  firstName: 'João',
  lastName: 'Silva',
  value: 39.9,
  currency: 'BRL',
  timestamp: Date.now()
};

// Buscar dados persistidos (fbp/fbc)
const userData = await getUserDataFromKVOrPrisma(
  purchaseData.email,
  purchaseData.phone
);

// Enviar para GTM Server-Side
// ✅ sendPurchaseToGTM() valida automaticamente o fbc:
// 1. Sanitiza (remove apenas espaços externos)
// 2. Valida formato (fb.1.{timestamp}.{fbclid})
// 3. Valida timestamp (dentro de 24 horas)
// 4. Inclui no user_data apenas se válido
await sendPurchaseToGTM(purchaseData, userData || {});
```

**IMPORTANTE:** 
- Purchase via webhook é o método recomendado (mais confiável)
- Browser Purchase pode não disparar se usuário fechar a página antes
- **Captura de fbc:** Quando o Lead é gerado, o sistema verifica se há `fbclid` na URL:
  - Se houver `fbclid` na URL → cria novo `fbc` com timestamp atual: `fb.1.{timestamp}.{fbclid}` (garante validade de 24h)
  - Se não houver `fbclid` na URL → usa `fbc` do cookie `_fbc` (pode ser antigo, mas é melhor que nada)
- **Validação de fbc:** O `fbc` é automaticamente validado antes de ser incluído no Purchase:
  - Sanitização: Remove apenas espaços externos (preserva conteúdo interno)
  - Validação de formato: Verifica se segue padrão `fb.1.{timestamp}.{fbclid}`
  - Validação de timestamp: Verifica se está dentro da janela de 24 horas
  - Se inválido, o `fbc` não é incluído (evita erros no Meta CAPI)
- Para mais detalhes sobre captura e validação de fbc, consulte: [`docs/guides/GUIA_COMPLETO_IMPLEMENTACAO_FBC_PURCHASE_WEBHOOK.md`](../guides/GUIA_COMPLETO_IMPLEMENTACAO_FBC_PURCHASE_WEBHOOK.md)

---

## ⚙️ Configuração do GTM Server-Side

### 1. Container GTM Server-Side (Stape.io)

**URL do Container:** `https://event.maracujazeropragas.com`

**Client Name:** `Data Client`

**Endpoint:** `https://event.maracujazeropragas.com/data?client_name=Data%20Client`

### 2. Triggers Configurados

#### Trigger: `ce - page_view`
- **Tipo:** Custom Event
- **Event Name:** `page_view`
- **Condições:** Nenhuma

#### Trigger: `ce - view_item`
- **Tipo:** Custom Event
- **Event Name:** `view_item`
- **Condições:** Nenhuma

#### Trigger: `ce - add_to_cart`
- **Tipo:** Custom Event
- **Event Name:** `add_to_cart`
- **Condições:** Nenhuma

#### Trigger: `ce - begin_checkout`
- **Tipo:** Custom Event
- **Event Name:** `begin_checkout`
- **Condições:** Nenhuma

#### Trigger: `ce - generate_lead`
- **Tipo:** Custom Event
- **Event Name:** `generate_lead`
- **Condições:** Nenhuma

#### Trigger: `ce - purchase`
- **Tipo:** Custom Event
- **Event Name:** `purchase`
- **Condições:** Nenhuma

### 3. Tags Configuradas

Cada evento tem uma tag correspondente no GTM Server-Side que:
1. Intercepta o evento do DataLayer
2. Normaliza os dados
3. Hashea PII (email, phone, name, etc.)
4. Envia para Meta CAPI

**Exemplo de Tag (FB - Purchase):**
- **Tipo:** Facebook Conversions API
- **Trigger:** `ce - purchase`
- **Pixel ID:** `{{Pixel ID}}`
- **Access Token:** `{{Access Token}}`
- **Event Name:** `Purchase`
- **User Data:**
  - `fn`: `{{ed - user_data.first_name}}`
  - `ln`: `{{ed - user_data.last_name}}`
  - `em`: `{{ed - user_data.email_address}}`
  - `ph`: `{{ed - user_data.phone_number}}`
  - `ct`: `{{ed - user_data.city}}`
  - `st`: `{{ed - user_data.region}}`
  - `zp`: `{{ed - user_data.postal_code}}`
  - `country`: `{{ed - user_data.country}}`
  - `fbp`: `{{ed - user_data.fbp}}`
  - `fbc`: `{{ed - user_data.fbc}}`
  - `external_id`: `{{ed - user_data.user_id}}`
  - `client_ip_address`: `{{ed - client_ip_address}}`
  - `client_user_agent`: `{{ed - user_data.client_user_agent}}`
- **Custom Data:**
  - `value`: `{{ed - value}}`
  - `currency`: `{{ed - currency}}`
  - `content_ids`: `{{ed - content_ids}}`
  - `content_name`: `{{ed - content_name}}`
  - `content_type`: `{{ed - content_type}}`
  - `num_items`: `{{ed - num_items}}`
- **Event ID:** `{{ed - event_id}}`
- **Action Source:** `{{ed - action_source}}`

### 4. Variáveis do GTM Server-Side

#### Event Data Variables (ed -)

- `{{ed - event}}`: Nome do evento
- `{{ed - event_id}}`: Event ID único
- `{{ed - action_source}}`: Origem do evento
- `{{ed - value}}`: Valor do produto
- `{{ed - currency}}`: Moeda
- `{{ed - content_ids}}`: IDs dos produtos
- `{{ed - content_name}}`: Nome do produto
- `{{ed - content_type}}`: Tipo de conteúdo
- `{{ed - num_items}}`: Quantidade de itens
- `{{ed - email_address}}`: Email (nível raiz)
- `{{ed - phone_number}}`: Telefone (nível raiz)
- `{{ed - first_name}}`: Nome (nível raiz)
- `{{ed - last_name}}`: Sobrenome (nível raiz)
- `{{ed - city}}`: Cidade (nível raiz)
- `{{ed - region}}`: Estado (nível raiz)
- `{{ed - postal_code}}`: CEP (nível raiz)
- `{{ed - country}}`: País (nível raiz)
- `{{ed - user_id}}`: ID externo (nível raiz)
- `{{ed - fbp}}`: Facebook Browser ID (nível raiz)
- `{{ed - fbc}}`: Facebook Click ID (nível raiz)
- `{{ed - user_data.first_name}}`: Nome (dentro de user_data)
- `{{ed - user_data.last_name}}`: Sobrenome (dentro de user_data)
- `{{ed - user_data.email_address}}`: Email (dentro de user_data)
- `{{ed - user_data.phone_number}}`: Telefone (dentro de user_data)
- `{{ed - user_data.city}}`: Cidade (dentro de user_data)
- `{{ed - user_data.region}}`: Estado (dentro de user_data)
- `{{ed - user_data.postal_code}}`: CEP (dentro de user_data)
- `{{ed - user_data.country}}`: País (dentro de user_data)
- `{{ed - user_data.fbp}}`: Facebook Browser ID (dentro de user_data)
- `{{ed - user_data.fbc}}`: Facebook Click ID (dentro de user_data)
- `{{ed - user_data.user_id}}`: ID externo (dentro de user_data)
- `{{ed - user_data.client_user_agent}}`: User Agent (dentro de user_data)
- `{{ed - client_ip_address}}`: IP do cliente (nível raiz)
- `{{ed - client_user_agent}}`: User Agent (nível raiz)
- `{{ed - ecommerce.transaction_id}}`: ID da transação (Purchase)
- `{{ed - ecommerce.value}}`: Valor (Purchase)
- `{{ed - ecommerce.currency}}`: Moeda (Purchase)

---

## 🚀 Implementação Passo a Passo

### Passo 1: Instalar Dependências

```bash
npm install
# ou
yarn install
```

**Dependências principais:**
- `next` (framework)
- `@prisma/client` (banco de dados)
- `crypto` (hashing SHA-256)

### Passo 2: Configurar Variáveis de Ambiente

Criar arquivo `.env.local`:

```env
# GTM Server-Side
GTM_SERVER_URL=https://event.maracujazeropragas.com
GTM_WEBHOOK_CLIENT_NAME=Data Client

# Meta Pixel
NEXT_PUBLIC_META_PIXEL_ID=seu_pixel_id
META_ACCESS_TOKEN=seu_access_token
META_TEST_EVENT_CODE=seu_test_event_code (opcional)

# Database (Prisma)
DATABASE_URL=postgresql://user:password@host:port/database

# Vercel KV (opcional, para cache rápido)
KV_REST_API_URL=seu_kv_url
KV_REST_API_TOKEN=seu_kv_token
```

### Passo 3: Criar Estrutura de Arquivos

```
src/
├── lib/
│   ├── gtmDataLayer.ts              # ✅ Funções de push para DataLayer
│   ├── eliteMetaPixelTracking.ts    # ✅ Funções de tracking (Elite)
│   ├── offlineConversions.ts        # ✅ Webhook e Purchase server-side
│   ├── utils/
│   │   ├── eventId.ts               # ✅ Geração de Event ID
│   │   ├── metaDataNormalizer.ts    # ✅ Normalização de dados
│   │   ├── fbcValidator.ts          # ✅ Validação de fbc
│   │   └── fbcSanitizer.ts          # ✅ Sanitização de fbc
│   ├── advancedDataPersistence.ts   # ✅ Persistência de dados
│   ├── userDataPersistence.ts      # ✅ Persistência de user data
│   └── userTrackingStore.ts        # ✅ Store (KV/Prisma)
```

### Passo 4: Implementar Funções de Tracking

#### 4.1. Criar `gtmDataLayer.ts`

Este arquivo contém as funções que fazem push para o DataLayer:

- `pushToDataLayer()`: Função genérica
- `pushPageView()`: PageView
- `pushViewItem()`: ViewContent
- `pushAddToCart()`: AddToCart
- `pushBeginCheckout()`: InitiateCheckout
- `pushGenerateLead()`: Lead
- `pushPurchase()`: Purchase

**Características importantes:**
- Gera `event_id` automaticamente se não fornecido
- Adiciona `action_source: 'website'` automaticamente
- Normaliza `user_data` antes de enviar
- Inclui campos no nível raiz E dentro de `user_data`
- Salva debug no `localStorage`

#### 4.2. Criar `eliteMetaPixelTracking.ts`

Este arquivo contém as funções de tracking de alto nível:

- `trackPageViewElite()`: PageView com enrichment
- `trackViewContentElite()`: ViewContent
- `trackAddToCartElite()`: AddToCart
- `trackLeadElite()`: Lead (salva dados)
- `trackInitiateCheckoutElite()`: InitiateCheckout
- `trackPurchaseElite()`: Purchase (browser)

**Características importantes:**
- Gera `event_id` UMA VEZ e usa em ambos (DataLayer + tracking)
- Previne duplicação de `event_id`
- Enrichment automático para eventos frios
- Persistência de dados do usuário

#### 4.3. Criar `offlineConversions.ts`

Este arquivo contém funções para eventos server-side:

- `sendPurchaseToGTM()`: Envia Purchase para GTM Server-Side
- `sendOfflinePurchase()`: Envia Purchase direto para Meta CAPI
- `processCaktoWebhook()`: Processa webhook da Cakto
- `getUserDataFromKVOrPrisma()`: Busca dados persistidos

**Características importantes:**
- Busca `fbp`/`fbc` persistidos do Lead
- Valida e sanitiza `fbc` antes de enviar
- Normaliza todos os dados antes de hash
- Fallback para Meta CAPI direto se GTM falhar

### Passo 5: Integrar no App

#### 5.1. PageView (no `layout.tsx` ou `_app.tsx`)

```typescript
'use client';

import { useEffect } from 'react';
import { trackPageViewElite } from '@/lib/eliteMetaPixelTracking';

export default function RootLayout({ children }) {
  useEffect(() => {
    trackPageViewElite();
  }, []);

  return <>{children}</>;
}
```

#### 5.2. ViewContent (no `page.tsx`)

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { trackViewContentElite } from '@/lib/eliteMetaPixelTracking';

export default function HomePage() {
  const viewContentFiredRef = useRef(false);

  useEffect(() => {
    // Disparar após 2 segundos
    const timer = setTimeout(() => {
      if (!viewContentFiredRef.current) {
        viewContentFiredRef.current = true;
        trackViewContentElite({
          trigger_type: 'page_load',
          time_on_page: 2
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return <div>...</div>;
}
```

#### 5.3. Lead (no formulário)

```typescript
'use client';

import { trackLeadElite } from '@/lib/eliteMetaPixelTracking';

export default function LeadForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      email: e.target.email.value,
      phone: e.target.phone.value,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      city: e.target.city.value,
      state: e.target.state.value,
      zip: e.target.zip.value
    };

    // Disparar Lead
    await trackLeadElite(formData);

    // Enviar formulário...
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### 5.4. InitiateCheckout (no modal de checkout)

```typescript
'use client';

import { trackInitiateCheckoutElite } from '@/lib/eliteMetaPixelTracking';

export default function CheckoutModal({ isOpen, formData }) {
  useEffect(() => {
    if (isOpen) {
      // Aguardar 2s após Lead (se aplicável)
      const timer = setTimeout(() => {
        trackInitiateCheckoutElite({
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return <div>...</div>;
}
```

#### 5.5. Purchase (via webhook)

```typescript
// src/app/api/webhook-cakto/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { processCaktoWebhook } from '@/lib/offlineConversions';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validar secret
    const secret = process.env.CAKTO_WEBHOOK_SECRET;
    if (!validateCaktoWebhook(payload, secret)) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // Processar webhook
    const result = await processCaktoWebhook(payload);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Passo 6: Configurar GTM Server-Side

1. **Importar container GTM Server-Side:**
   - Usar arquivo `GTM-W4PGS3LR_workspace54.json` como referência
   - Configurar triggers para cada evento
   - Configurar tags para enviar para Meta CAPI

2. **Configurar variáveis:**
   - Pixel ID
   - Access Token
   - Mapear campos do DataLayer para Meta CAPI

3. **Testar:**
   - Usar GTM Preview Mode
   - Verificar eventos no DataLayer
   - Verificar eventos no Meta Events Manager

---

## 📁 Estrutura de Arquivos

```
projeto/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # PageView aqui
│   │   ├── page.tsx                # ViewContent aqui
│   │   ├── obrigado/
│   │   │   └── page.tsx            # Purchase (browser) aqui (opcional)
│   │   └── api/
│   │       └── webhook-cakto/
│   │           └── route.ts        # Purchase (server) aqui
│   ├── lib/
│   │   ├── gtmDataLayer.ts         # ✅ Push para DataLayer
│   │   ├── eliteMetaPixelTracking.ts # ✅ Funções de tracking
│   │   ├── offlineConversions.ts   # ✅ Webhook e Purchase
│   │   ├── utils/
│   │   │   ├── eventId.ts          # ✅ Geração de Event ID
│   │   │   ├── metaDataNormalizer.ts # ✅ Normalização
│   │   │   ├── fbcValidator.ts    # ✅ Validação fbc
│   │   │   └── fbcSanitizer.ts    # ✅ Sanitização fbc
│   │   ├── advancedDataPersistence.ts # ✅ Persistência avançada
│   │   ├── userDataPersistence.ts # ✅ Persistência user data
│   │   └── userTrackingStore.ts   # ✅ Store (KV/Prisma)
│   └── components/
│       └── OptimizedLeadForm.tsx   # Formulário de Lead
├── prisma/
│   └── schema.prisma               # Schema do banco
├── .env.local                      # Variáveis de ambiente
├── GTM-W4PGS3LR_workspace54.json   # Export do GTM Server-Side
└── package.json
```

---

## 🔐 Variáveis de Ambiente

### Obrigatórias

```env
# GTM Server-Side
GTM_SERVER_URL=https://event.maracujazeropragas.com
GTM_WEBHOOK_CLIENT_NAME=Data Client

# Meta Pixel
NEXT_PUBLIC_META_PIXEL_ID=seu_pixel_id
META_ACCESS_TOKEN=seu_access_token
```

### Opcionais

```env
# Test Event Code (para debug no Meta Events Manager)
META_TEST_EVENT_CODE=seu_test_event_code

# Database (Prisma)
DATABASE_URL=postgresql://user:password@host:port/database

# Vercel KV (cache rápido)
KV_REST_API_URL=seu_kv_url
KV_REST_API_TOKEN=seu_kv_token

# Webhook Cakto
CAKTO_WEBHOOK_SECRET=seu_secret
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Fluxo Completo (Lead → InitiateCheckout → Purchase)

```typescript
// 1. Usuário preenche formulário
const handleLeadSubmit = async (formData) => {
  // Disparar Lead
  await trackLeadElite({
    email: formData.email,
    phone: formData.phone,
    firstName: formData.firstName,
    lastName: formData.lastName,
    city: formData.city,
    state: formData.state,
    zip: formData.zip
  });
  
  // Salvar dados (já feito dentro de trackLeadElite)
  // Dados são persistidos com fbp/fbc para uso posterior
};

// 2. Usuário abre checkout (2s após Lead)
const handleCheckoutOpen = async (formData) => {
  // Aguardar 2s após Lead
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Disparar InitiateCheckout
  await trackInitiateCheckoutElite({
    email: formData.email,
    phone: formData.phone,
    firstName: formData.firstName,
    lastName: formData.lastName,
    city: formData.city,
    state: formData.state,
    zip: formData.zip
  });
};

// 3. Webhook recebe confirmação de pagamento
// (automático via processCaktoWebhook)
```

### Exemplo 2: Purchase via Webhook

```typescript
// src/app/api/webhook-cakto/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { processCaktoWebhook, validateCaktoWebhook } from '@/lib/offlineConversions';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validar secret
    const secret = process.env.CAKTO_WEBHOOK_SECRET;
    if (!validateCaktoWebhook(payload, secret)) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // Processar webhook (busca dados persistidos e envia Purchase)
    const result = await processCaktoWebhook(payload);

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error('❌ Erro ao processar webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 🔧 Troubleshooting

### Problema 1: Eventos não aparecem no Meta Events Manager

**Causas possíveis:**
- GTM Server-Side não está configurado corretamente
- Triggers não estão disparando
- Tags não estão enviando para Meta CAPI

**Solução:**
1. Verificar GTM Preview Mode
2. Verificar eventos no DataLayer (console do browser)
3. Verificar logs do GTM Server-Side
4. Verificar configuração das tags no GTM

### Problema 2: Deduplicação não funciona

**Causas possíveis:**
- `event_id` diferente entre browser e server
- `action_source` incorreto
- `user_data` incompleto ou diferente

**Solução:**
1. Verificar que `event_id` é idêntico entre browser e server
2. Verificar que `action_source` é `'website'` no browser e `'other'` no server
3. Verificar que `user_data` tem os mesmos campos em ambos

### Problema 3: fbp/fbc não estão sendo enviados

**Causas possíveis:**
- Cookies não estão sendo capturados
- Dados não estão sendo persistidos
- Dados não estão sendo buscados no webhook

**Solução:**
1. Verificar que cookies `_fbp` e `_fbc` existem no browser
2. Verificar que dados são salvos no Lead
3. Verificar que dados são buscados no webhook (email + telefone)

### Problema 4: Purchase não aparece no Meta

**Causas possíveis:**
- Webhook não está sendo chamado
- Dados não estão sendo encontrados (email/telefone)
- GTM Server-Side não está processando

**Solução:**
1. Verificar logs do webhook
2. Verificar que email/telefone estão corretos
3. Verificar que dados foram encontrados no KV/Prisma
4. Verificar que Purchase foi enviado para GTM Server-Side

---

## ✅ Checklist de Implementação

- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Estrutura de arquivos criada
- [ ] `gtmDataLayer.ts` implementado
- [ ] `eliteMetaPixelTracking.ts` implementado
- [ ] `offlineConversions.ts` implementado
- [ ] Utils implementados (eventId, normalizer, etc.)
- [ ] PageView integrado no layout
- [ ] ViewContent integrado na página
- [ ] Lead integrado no formulário
- [ ] InitiateCheckout integrado no checkout
- [ ] Purchase integrado no webhook
- [ ] GTM Server-Side configurado
- [ ] Triggers configurados
- [ ] Tags configuradas
- [ ] Testado no GTM Preview Mode
- [ ] Testado no Meta Events Manager
- [ ] Deduplicação funcionando

---

## 📚 Referências

- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Google Tag Manager Server-Side Documentation](https://developers.google.com/tag-manager/serverside)
- [Stape.io Documentation](https://stape.io/docs)

---

## 🎓 Notas Finais

Este documento foi criado para ser usado por uma IA para replicar a estrutura de tracking em novos projetos. 

**Princípios importantes:**
1. **Consistência:** Sempre usar os mesmos formatos e estruturas
2. **Normalização:** Sempre normalizar dados antes de hash/envio
3. **Persistência:** Sempre salvar dados do Lead para uso posterior
4. **Deduplicação:** Sempre usar o mesmo `event_id` entre browser e server
5. **Debug:** Sempre incluir logs e debug para facilitar troubleshooting

**Boas práticas:**
- Sempre validar dados antes de enviar
- Sempre normalizar dados antes de hash
- Sempre incluir todos os campos possíveis em `user_data`
- Sempre testar no GTM Preview Mode antes de publicar
- Sempre verificar eventos no Meta Events Manager

---

**Última atualização:** 2025-01-08
**Versão:** 1.0.0


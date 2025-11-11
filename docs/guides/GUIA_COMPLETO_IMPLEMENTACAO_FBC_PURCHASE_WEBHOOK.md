# 📘 GUIA COMPLETO: Implementação de FBC no Purchase via Webhook

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Passo 1: Captura do FBC no Frontend](#passo-1-captura-do-fbc-no-frontend)
4. [Passo 2: Salvamento no Vercel KV](#passo-2-salvamento-no-vercel-kv)
5. [Passo 3: Webhook de Purchase](#passo-3-webhook-de-purchase)
6. [Passo 4: Recuperação e Validação](#passo-4-recuperação-e-validação)
7. [Passo 5: Envio ao GTM Server-Side](#passo-5-envio-ao-gtm-server-side)
8. [Passo 6: Configuração do GTM](#passo-6-configuração-do-gtm)
9. [Utilitários Necessários](#utilitários-necessários)
10. [Variáveis de Ambiente](#variáveis-de-ambiente)
11. [Testes e Debug](#testes-e-debug)
12. [Troubleshooting](#troubleshooting)

---

## Visão Geral

Este documento explica **passo a passo** como implementar a captura e uso do **fbc (Facebook Click ID)** no fluxo de Purchase via Webhook.

### O que é FBC?

- **fbc** = Facebook Click ID
- Identificador único criado quando o usuário clica em um anúncio do Facebook
- Formato: `fb.1.{timestamp}.{fbclid}`
- Validade: **24 horas** após o clique
- **CRÍTICO** para atribuição correta de conversões no Meta

### Fluxo Completo

```
1. Usuário clica em anúncio → Cookie _fbc criado
2. Usuário gera Lead → fbc capturado e salvo no KV
3. Usuário compra (checkout externo) → Webhook recebe compra
4. Webhook busca fbc no KV → Valida e envia ao GTM
5. GTM envia ao Facebook → Atribuição correta!
```

---

## Arquitetura do Sistema

```
┌─────────────────┐
│   FRONTEND      │
│  (Next.js App)  │
│                 │
│ 1. Captura fbc  │
│    do cookie    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Route      │
│ /api/save-      │
│ tracking        │
│                 │
│ 2. Salva no KV  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vercel KV      │
│  (Redis)        │
│                 │
│ Chaves:         │
│ - user:email:   │
│ - user:phone:   │
└────────┬────────┘
         │
         │ (Quando compra acontece)
         │
         ▼
┌─────────────────┐
│  Webhook Cakto  │
│ /api/webhook-   │
│ cakto           │
│                 │
│ 3. Busca fbc    │
│    no KV        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validação      │
│  - Sanitizar    │
│  - Validar      │
│  - Verificar 24h│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GTM Server-    │
│  Side           │
│                 │
│ 4. Envia ao     │
│    Facebook     │
└─────────────────┘
```

---

## Passo 1: Captura do FBC no Frontend

### 1.1. Criar função para capturar cookies do Meta

**Arquivo:** `src/lib/advancedDataPersistence.ts`

```typescript
/**
 * Extrai fbp e fbc dos cookies
 * 
 * CRÍTICO: fbc deve ser preservado EXATAMENTE como vem do cookie.
 * Qualquer modificação causa erro no Meta CAPI.
 */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};
  
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    // CRÍTICO: decodeURIComponent preserva caracteres especiais do fbc
    try {
      acc[key] = value ? decodeURIComponent(value) : value;
    } catch (error) {
      console.warn('⚠️ Erro ao decodificar cookie:', key, error);
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);
  
  // CRÍTICO: fbc deve ser preservado EXATAMENTE
  // Apenas remover espaços externos (trim) - NADA MAIS!
  const rawFbc = cookies['_fbc'];
  const sanitizedFbc = rawFbc ? rawFbc.trim() : undefined;
  
  // Validação básica (sem modificar!)
  if (sanitizedFbc && !sanitizedFbc.startsWith('fb.1.')) {
    console.warn('⚠️ fbc formato inválido:', sanitizedFbc.substring(0, 30));
    return {
      fbp: cookies['_fbp'],
      fbc: undefined
    };
  }
  
  return {
    fbp: cookies['_fbp'],
    fbc: sanitizedFbc
  };
}
```

### 1.2. Capturar fbc quando Lead é gerado

**Arquivo:** `src/app/page.tsx` (ou onde o formulário de Lead está)

```typescript
import { getMetaCookies } from '@/lib/advancedDataPersistence';

const handlePreCheckoutSubmit = async (formData) => {
  // ... código do formulário ...
  
  // 1. Capturar cookies do Meta
  const metaCookies = getMetaCookies();
  
  // ✅ CRÍTICO: Verificar se há fbclid na URL (clique recente)
  // Se houver, criar novo fbc baseado no fbclid atual (ao invés de usar cookie antigo)
  let fbcToUse = metaCookies.fbc;
  const urlParams = new URLSearchParams(window.location.search);
  const fbclidFromUrl = urlParams.get('fbclid');
  
  if (fbclidFromUrl && fbclidFromUrl.length >= 20) {
    // ✅ Criar novo fbc baseado no fbclid da URL (clique atual)
    // Formato: fb.1.{timestamp}.{fbclid}
    const timestamp = Math.floor(Date.now() / 1000); // Timestamp em segundos
    fbcToUse = `fb.1.${timestamp}.${fbclidFromUrl}`;
    console.log('✅ Novo fbc criado a partir do fbclid da URL (clique atual)');
  }
  
  // 2. Enviar para API que salva no KV
  try {
    await fetch('/api/save-tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        fbp: metaCookies.fbp,  // ✅ Facebook Browser ID
        fbc: fbcToUse || undefined,  // ✅ Facebook Click ID (criado ou do cookie)
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        // ... outros dados ...
      })
    });
    
    console.log('✅ fbp/fbc salvos no Vercel KV');
  } catch (error) {
    console.error('⚠️ Erro ao salvar tracking:', error);
  }
  
  // ... resto do código ...
};
```

**⚠️ IMPORTANTE:**
- **Prioridade 1:** Se houver `fbclid` na URL → criar novo `fbc` com timestamp atual (garante validade de 24h)
- **Prioridade 2:** Se não houver `fbclid` na URL → usar `fbc` do cookie (pode ser antigo, mas é melhor que nada)
- Capturar fbc **ANTES** de redirecionar para checkout externo
- fbc só existe se usuário clicou em anúncio do Facebook
- Se não tiver fbc, não é erro (usuário pode ter vindo de outra fonte)

---

## Passo 2: Salvamento no Vercel KV

### 2.1. Criar interface de dados

**Arquivo:** `src/lib/userTrackingStore.ts`

```typescript
export interface UserTrackingData {
  email: string;
  fbp?: string;
  fbc?: string;  // ✅ CRÍTICO: Facebook Click ID
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
  // ... outros campos ...
  createdAt: number;
  updatedAt: number;
}
```

### 2.2. Função para salvar no KV

**Arquivo:** `src/lib/userTrackingStore.ts`

```typescript
import { kv } from '@vercel/kv';
import { normalizePhone } from './utils/metaDataNormalizer';

/**
 * Salva dados do usuário no Vercel KV (Redis)
 */
export async function saveUserTracking(
  data: Omit<UserTrackingData, 'createdAt' | 'updatedAt'>
): Promise<boolean> {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.warn('⚠️ Vercel KV não configurado');
      return false;
    }
    
    const { kv } = await import('@vercel/kv');
    
    const now = Date.now();
    const trackingData: UserTrackingData = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    // ✅ Salvar por email (chave principal)
    await kv.set(`user:email:${data.email.toLowerCase()}`, trackingData);
    
    // ✅ Salvar por telefone também (para busca alternativa)
    if (data.phone) {
      const phoneNormalized = normalizePhone(data.phone);
      await kv.set(`user:phone:${phoneNormalized}`, trackingData);
    }
    
    console.log('✅ User tracking salvo no Vercel KV:', {
      email: data.email,
      hasFbp: !!data.fbp,
      hasFbc: !!data.fbc,  // ✅ Verificar se fbc foi salvo
      fbc: data.fbc ? data.fbc.substring(0, 40) + '...' : 'undefined'
    });
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar no Vercel KV:', error);
    return false;
  }
}
```

### 2.3. API Route para receber dados

**Arquivo:** `src/app/api/save-tracking/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { saveUserTracking } from '@/lib/userTrackingStore';
import { normalizeEmail, normalizePhone, normalizeName } from '@/lib/utils/metaDataNormalizer';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { 
      email, 
      fbp, 
      fbc,  // ✅ Receber fbc do frontend
      firstName, 
      lastName, 
      phone 
    } = data;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // ⚠️ NORMALIZAÇÃO CRÍTICA: Normalizar dados antes de salvar
    const normalizedEmail = normalizeEmail(email);
    const normalizedFirstName = firstName ? normalizeName(firstName) : undefined;
    const normalizedLastName = lastName ? normalizeName(lastName) : undefined;
    const normalizedPhone = phone ? normalizePhone(phone) : undefined;
    
    // ✅ Salvar no KV (fbc será preservado exatamente como veio)
    const success = await saveUserTracking({
      email: normalizedEmail,
      fbp,  // ✅ Preservar fbp
      fbc,  // ✅ Preservar fbc EXATAMENTE (não normalizar!)
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      phone: normalizedPhone
    });
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to save' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error saving tracking:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

**⚠️ IMPORTANTE:**
- **NÃO normalizar fbc** (deve ser preservado exatamente como vem)
- Normalizar apenas email, nome e telefone
- Salvar por email E telefone (para busca alternativa)

---

## Passo 3: Webhook de Purchase

### 3.1. Estrutura do Webhook

**Arquivo:** `src/app/api/webhook-cakto/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserDataFromKVOrPrisma,
  sendPurchaseToGTM 
} from '@/lib/offlineConversions';
import { normalizeEmail, normalizePhone, splitNormalizedName } from '@/lib/utils/metaDataNormalizer';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validar evento
    if (payload.event !== 'purchase_approved' || payload.data.status !== 'paid') {
      return NextResponse.json({ success: true, message: 'Evento ignorado' });
    }
    
    // ⚠️ NORMALIZAÇÃO CRÍTICA: Normalizar dados do webhook
    const normalizedEmail = normalizeEmail(payload.data.customer.email);
    const normalizedPhone = normalizePhone(payload.data.customer.phone);
    const { firstName, lastName } = splitNormalizedName(payload.data.customer.name);
    
    // ✅ Buscar user data (KV + Prisma fallback) - usar email NORMALIZADO!
    const userData = await getUserDataFromKVOrPrisma(
      normalizedEmail,  // ✅ Email normalizado (lowercase)
      normalizedPhone    // ✅ Telefone normalizado
    );
    
    // Preparar purchaseData
    const purchaseData = {
      orderId: payload.data.refId,
      email: normalizedEmail,
      firstName,
      lastName: lastName || undefined,
      phone: normalizedPhone,
      value: payload.data.amount,
      currency: 'BRL',
      timestamp: payload.data.paidAt ? new Date(payload.data.paidAt).getTime() : Date.now()
    };
    
    // ✅ Enviar Purchase para GTM Server-Side (com fbc incluído)
    const result = await sendPurchaseToGTM(purchaseData, userData || {});
    
    return NextResponse.json({
      success: result.success,
      message: result.message
    });
    
  } catch (error: any) {
    console.error('⚠️ Erro ao processar webhook:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 200 }); // Retornar 200 para evitar retries
  }
}
```

---

## Passo 4: Recuperação e Validação

### 4.1. Função para buscar no KV

**Arquivo:** `src/lib/offlineConversions.ts`

```typescript
import { getUserTracking } from './userTrackingStore';

/**
 * Busca dados do usuário usando Vercel KV como primário, Prisma como fallback
 */
export async function getUserDataFromKVOrPrisma(
  email: string,
  phone?: string
): Promise<{
  fbp?: string;
  fbc?: string;  // ✅ fbc será retornado aqui
  firstName?: string;
  lastName?: string;
  phone?: string;
  // ... outros campos ...
} | null> {
  
  // 1. PRIORIDADE: Tentar Vercel KV primeiro (mais rápido)
  try {
    const kvData = await getUserTracking(email, phone);
    
    if (kvData) {
      console.log('✅ User data encontrado no Vercel KV:', {
        email: kvData.email,
        hasFbp: !!kvData.fbp,
        hasFbc: !!kvData.fbc,  // ✅ Verificar se fbc existe
        fbc: kvData.fbc ? kvData.fbc.substring(0, 40) + '...' : 'undefined',
        fbcLength: kvData.fbc?.length || 0
      });
      
      return {
        fbp: kvData.fbp,
        fbc: kvData.fbc,  // ✅ Retornar fbc
        firstName: kvData.firstName,
        lastName: kvData.lastName,
        phone: kvData.phone
      };
    }
  } catch (error) {
    console.warn('⚠️ Vercel KV não disponível, tentando Prisma:', error);
  }
  
  // 2. FALLBACK: Usar Prisma se KV não disponível
  // ... código do Prisma ...
  
  return null;
}
```

### 4.2. Função para buscar no KV (detalhada)

**Arquivo:** `src/lib/userTrackingStore.ts`

```typescript
/**
 * Busca usuário por email OU telefone
 */
export async function getUserTracking(
  email: string, 
  phone?: string
): Promise<UserTrackingData | null> {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return null;
    }
    
    const { kv } = await import('@vercel/kv');
    
    // 1. Buscar por email (prioridade)
    let userData = await kv.get<UserTrackingData>(
      `user:email:${email.toLowerCase()}`
    );
    
    if (userData) {
      console.log('✅ User data encontrado por EMAIL:', email);
      return userData;
    }
    
    // 2. Buscar por telefone (fallback)
    if (phone) {
      const phoneNormalized = normalizePhone(phone);
      userData = await kv.get<UserTrackingData>(
        `user:phone:${phoneNormalized}`
      );
      
      if (userData) {
        console.log('✅ User data encontrado por TELEFONE:', phone);
        return userData;
      }
    }
    
    console.warn('⚠️ User data NÃO encontrado:', { email, phone });
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar no Vercel KV:', error);
    return null;
  }
}
```

### 4.3. Validação do FBC

**Arquivo:** `src/lib/utils/fbcSanitizer.ts`

```typescript
/**
 * Sanitiza fbc removendo apenas espaços externos (não modifica conteúdo)
 * 
 * CRÍTICO: NÃO fazer toLowerCase(), não truncar, não modificar conteúdo interno!
 */
export function sanitizeFbc(fbc: string | null | undefined): string | null {
  if (!fbc || typeof fbc !== 'string') {
    return null;
  }
  
  // REMOVER APENAS espaços/brancos externos (trim)
  // NÃO modificar o conteúdo interno!
  const trimmed = fbc.trim();
  
  // Verificar formato básico (fb.1.timestamp.fbclid)
  if (!trimmed.startsWith('fb.1.')) {
    console.warn('⚠️ fbc não começa com "fb.1.":', trimmed.substring(0, 20) + '...');
    return null;
  }
  
  // Verificar se tem pelo menos 4 partes
  const parts = trimmed.split('.');
  if (parts.length < 4) {
    console.warn('⚠️ fbc formato inválido (menos de 4 partes):', trimmed);
    return null;
  }
  
  // Verificar se fbclid (4ª parte) não está vazia
  if (!parts[3] || parts[3].length < 10) {
    console.warn('⚠️ fbc fbclid muito curto ou vazio:', trimmed);
    return null;
  }
  
  // RETORNAR EXATAMENTE como está (apenas trim externo)
  return trimmed;
}
```

**Arquivo:** `src/lib/utils/fbcValidator.ts`

```typescript
/**
 * Valida se fbc está dentro da janela válida (24 horas)
 */
export function isValidFbcTimestamp(fbc: string): boolean {
  if (!isValidFbcFormat(fbc)) return false;
  
  const parts = fbc.split('.');
  const fbcTimestampStr = parts[2];
  const fbcTimestamp = parseInt(fbcTimestampStr);
  
  if (isNaN(fbcTimestamp)) return false;
  
  // ✅ CORREÇÃO: Facebook usa MILISSEGUNDOS quando timestamp tem 13 dígitos
  const now = Date.now(); // milissegundos
  const fbcTime = fbcTimestampStr.length === 13 
    ? fbcTimestamp // Já está em milissegundos
    : fbcTimestamp * 1000; // Converter segundos para milissegundos
  
  const diff = now - fbcTime;
  
  // Janela válida: 24 horas (86400000 ms)
  const VALID_WINDOW_MS = 24 * 60 * 60 * 1000;
  
  // fbc deve ser do passado (não futuro) e dentro de 24h
  return diff >= 0 && diff <= VALID_WINDOW_MS;
}

/**
 * Validação completa de fbc
 */
export function validateFbc(fbc: string): {
  valid: boolean;
  reason?: string;
} {
  if (!fbc) {
    return { valid: false, reason: 'fbc is empty' };
  }
  
  if (!isValidFbcFormat(fbc)) {
    return { valid: false, reason: 'invalid fbc format' };
  }
  
  if (!isValidFbcTimestamp(fbc)) {
    return { valid: false, reason: 'fbc timestamp outside valid window (24h)' };
  }
  
  return { valid: true };
}
```

---

## Passo 5: Envio ao GTM Server-Side

### 5.1. Função para enviar Purchase ao GTM

**Arquivo:** `src/lib/offlineConversions.ts`

```typescript
import { normalizeEmail, normalizePhone, normalizeName } from './utils/metaDataNormalizer';
import { sanitizeFbc } from './utils/fbcSanitizer';
import { validateFbc } from './utils/fbcValidator';

export async function sendPurchaseToGTM(
  purchaseData: {
    orderId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    value: number;
    currency: string;
    timestamp: number;
  },
  userData: {
    fbp?: string;
    fbc?: string;  // ✅ fbc será validado aqui
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    external_id?: string;
    client_ip_address?: string;
    client_user_agent?: string;
  }
): Promise<{ success: boolean; error?: string; message?: string }> {
  
  const gtmEndpoint = process.env.NEXT_PUBLIC_GTM_SERVER_SIDE_URL;
  
  if (!gtmEndpoint) {
    return {
      success: false,
      error: 'GTM Server-Side URL não configurado'
    };
  }
  
  // ✅ Validar e preparar fbc antes de criar user_data
  let validatedFbc: string | undefined = undefined;
  if (userData.fbc) {
    console.log('🔍 DEBUG fbc antes de validar:', {
      fbc: userData.fbc.substring(0, 40) + '...',
      fbcLength: userData.fbc.length,
      hasFbc: !!userData.fbc
    });
    
    // 1. Sanitizar (remove apenas espaços externos)
    const sanitizedFbc = sanitizeFbc(userData.fbc);
    
    console.log('🔍 DEBUG fbc após sanitizar:', {
      sanitized: sanitizedFbc ? sanitizedFbc.substring(0, 40) + '...' : 'null',
      isValid: !!sanitizedFbc
    });
    
    if (sanitizedFbc) {
      // 2. Validar (formato + timestamp dentro de 24h)
      const fbcValidation = validateFbc(sanitizedFbc);
      console.log('🔍 DEBUG fbc validação:', fbcValidation);
      
      if (fbcValidation.valid) {
        validatedFbc = sanitizedFbc;
        console.log('✅ fbc válido, será incluído no Purchase');
      } else {
        console.warn('⚠️ fbc inválido no sendPurchaseToGTM:', fbcValidation.reason);
      }
    }
  }
  
  // Preparar dados no formato DataLayer
  const eventData = {
    event: 'purchase',
    ecommerce: {
      transaction_id: purchaseData.orderId,
      value: purchaseData.value,
      currency: purchaseData.currency || 'BRL',
      items: [{
        item_id: 'PRODUCT_ID',
        item_name: 'Product Name',
        price: purchaseData.value,
        quantity: 1
      }]
    },
    user_data: {
      user_id: userData.external_id || undefined,
      email_address: normalizeEmail(purchaseData.email),
      phone_number: (purchaseData.phone || userData.phone) 
        ? normalizePhone(purchaseData.phone || userData.phone || '') 
        : undefined,
      first_name: (purchaseData.firstName || userData.firstName) 
        ? normalizeName(purchaseData.firstName || userData.firstName || '') 
        : undefined,
      last_name: (purchaseData.lastName || userData.lastName) 
        ? normalizeName(purchaseData.lastName || userData.lastName || '') 
        : undefined,
      city: userData.city ? normalizeCity(userData.city) : undefined,
      region: userData.state ? normalizeState(userData.state) : undefined,
      postal_code: userData.zip ? normalizeZip(userData.zip) : undefined,
      country: normalizeCountry(userData.country),
      // ✅ Adicionar fbp e fbc (CRÍTICO para atribuição!)
      ...(userData.fbp && { fbp: userData.fbp }),
      ...(validatedFbc && { fbc: validatedFbc })  // ✅ fbc validado incluído aqui
    },
    event_id: `${purchaseData.orderId}_${purchaseData.timestamp || Date.now()}`,
    ...(userData.client_ip_address && { client_ip_address: userData.client_ip_address }),
    ...(userData.client_user_agent && { client_user_agent: userData.client_user_agent })
  };
  
  // ⚠️ IMPORTANTE: GTM Server-Side espera array de eventos
  const payload = [eventData];
  
  console.log('📤 Enviando Purchase para GTM Server-Side:', {
    endpoint: gtmEndpoint,
    orderId: purchaseData.orderId,
    hasFbc: !!validatedFbc
  });
  
  try {
    const response = await fetch(gtmEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userData.client_user_agent || 'GTM-Server-Side-Webhook'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao enviar para GTM:', errorText);
      return {
        success: false,
        error: `GTM returned ${response.status}: ${errorText}`
      };
    }
    
    console.log('✅ Purchase enviado com sucesso para GTM');
    return {
      success: true,
      message: 'Purchase enviado com sucesso'
    };
    
  } catch (error: any) {
    console.error('❌ Erro ao enviar Purchase:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

**⚠️ IMPORTANTE:**
- GTM Server-Side espera **array de eventos**: `[eventData]`
- fbc deve estar em `user_data.fbc` (não no nível raiz)
- Validar fbc antes de incluir (formato + 24h)

---

## Passo 6: Configuração do GTM

### 6.1. Criar Variável Event Data para fbc

No GTM Server-Side → **Variáveis** → **Nova** → **Event Data Variable**:

```
Nome da variável: webhook-ed -user_data.fbc
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.fbc
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** Usar prefixo `0.` porque Purchase via webhook vem como array `[eventData]`!

### 6.2. Mapear na Tag Facebook Purchase

No GTM Server-Side → **Tags** → **FB - Purchase** → **User Data**:

Adicionar:

```
Property Name: fbc
Property Value: {{webhook-ed -user_data.fbc}}
```

### 6.3. Configuração Completa da Tag

A tag "FB - Purchase" deve ter:

**User Data:**
| Property Name | Property Value | Path |
|--------------|----------------|------|
| `First Name` | `{{ed - purchase.user_data.first_name}}` | `0.user_data.first_name` |
| `Last Name` | `{{ed - purchase.user_data.last_name}}` | `0.user_data.last_name` |
| `Email` | `{{ed - purchase.user_data.email_address}}` | `0.user_data.email_address` |
| `Phone` | `{{ed - purchase.user_data.phone_number}}` | `0.user_data.phone_number` |
| `Country` | `{{ed - purchase.user_data.country}}` | `0.user_data.country` |
| `fbp` | `{{webhook-ed -user_data.fbp}}` | `0.user_data.fbp` |
| `fbc` | `{{webhook-ed -user_data.fbc}}` | `0.user_data.fbc` |

**⚠️ IMPORTANTE:**
- Todos os paths começam com `0.` porque o payload é um array
- fbc e fbp devem estar em User Data (não em Custom Data)

---

## Utilitários Necessários

### 7.1. Normalização de Dados

**Arquivo:** `src/lib/utils/metaDataNormalizer.ts`

```typescript
/**
 * Normaliza email para padrão Facebook (lowercase + trim)
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.toLowerCase().trim();
}

/**
 * Normaliza nome para padrão Facebook (title case)
 */
export function normalizeName(name: string): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Normaliza telefone para padrão Facebook (apenas dígitos + código país)
 */
export function normalizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('55')) {
    return cleaned;
  }
  
  if (cleaned.length >= 10 && cleaned.length <= 11) {
    return `55${cleaned}`;
  }
  
  return cleaned;
}

/**
 * Extrai first_name e last_name de um nome completo
 */
export function splitNormalizedName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const normalized = normalizeName(fullName);
  const parts = normalized.split(' ');
  
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  };
}
```

---

## Variáveis de Ambiente

Adicionar no `.env.local`:

```bash
# Vercel KV (Redis)
KV_REST_API_URL=https://your-kv-instance.upstash.io
KV_REST_API_TOKEN=your-kv-token

# GTM Server-Side
NEXT_PUBLIC_GTM_SERVER_SIDE_URL=https://your-gtm-server-side.com/collect

# Webhook Secret (opcional, para validação)
CAKTO_WEBHOOK_SECRET=your-webhook-secret
```

---

## Testes e Debug

### 9.1. Testar Captura do FBC

No console do navegador:

```javascript
// Verificar se cookie _fbc existe
console.log('fbc:', document.cookie.match(/_fbc=([^;]+)/)?.[1]);

// Verificar função getMetaCookies
const { getMetaCookies } = await import('/src/lib/advancedDataPersistence');
const cookies = getMetaCookies();
console.log('Meta Cookies:', cookies);
```

### 9.2. Testar Salvamento no KV

Criar endpoint de teste:

```typescript
// src/app/api/test-save-tracking/route.ts
import { saveUserTracking } from '@/lib/userTrackingStore';

export async function POST() {
  const now = Math.floor(Date.now() / 1000);
  const randomFbclid = Math.random().toString(36).substring(2, 15);
  const fbc = `fb.1.${now}.${randomFbclid}`;
  const fbp = `fb.1.${Date.now()}.123456789`;
  
  const success = await saveUserTracking({
    email: 'teste@example.com',
    fbp,
    fbc,
    firstName: 'Teste',
    lastName: 'FBC',
    phone: '77998877666'
  });
  
  return Response.json({ success, fbc, fbp });
}
```

### 9.3. Testar Busca no KV

```typescript
// src/app/api/test-get-tracking/route.ts
import { getUserTracking } from '@/lib/userTrackingStore';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  
  if (!email && !phone) {
    return Response.json({ error: 'Email ou phone necessário' }, { status: 400 });
  }
  
  const data = await getUserTracking(email || '', phone || undefined);
  
  return Response.json({
    found: !!data,
    hasFbc: !!data?.fbc,
    fbc: data?.fbc ? data.fbc.substring(0, 40) + '...' : null,
    data
  });
}
```

### 9.4. Testar Webhook

Usar Postman ou curl:

```bash
curl -X POST http://localhost:3000/api/webhook-cakto \
  -H "Content-Type: application/json" \
  -d '{
    "event": "purchase_approved",
    "data": {
      "refId": "ORDER123",
      "status": "paid",
      "amount": 39.90,
      "customer": {
        "email": "teste@example.com",
        "phone": "77998877666",
        "name": "Teste FBC"
      },
      "paidAt": "2024-01-01T12:00:00Z"
    },
    "secret": "your-secret"
  }'
```

---

## Troubleshooting

### Problema 1: fbc não está sendo capturado

**Sintomas:**
- `hasFbc: false` nos logs
- fbc não aparece no KV

**Soluções:**
1. Verificar se cookie `_fbc` existe no navegador
2. Verificar se usuário clicou em anúncio do Facebook
3. Verificar se cookies não estão bloqueados (privacy settings)
4. Adicionar log antes de salvar:
   ```typescript
   console.log('🔍 DEBUG fbc antes de salvar:', {
     hasFbc: !!metaCookies.fbc,
     fbc: metaCookies.fbc ? metaCookies.fbc.substring(0, 40) + '...' : 'undefined'
   });
   ```

### Problema 2: fbc não está sendo encontrado no webhook

**Sintomas:**
- `hasFbc: false` quando busca no KV
- Email/telefone não encontrado

**Soluções:**
1. Verificar normalização de email/telefone (deve ser igual ao que foi salvo)
2. Verificar se dados foram salvos corretamente no KV
3. Verificar logs de busca:
   ```typescript
   console.log('🔍 DEBUG busca:', {
     emailBuscado: normalizedEmail,
     phoneBuscado: normalizedPhone,
     encontrado: !!kvData,
     hasFbc: !!kvData?.fbc
   });
   ```

### Problema 3: fbc está expirado

**Sintomas:**
- `fbc inválido: fbc timestamp outside valid window (24h)`

**Soluções:**
1. fbc tem validade de 24 horas
2. Se compra acontecer após 24h do clique, fbc será rejeitado (comportamento esperado)
3. Verificar timestamp do fbc:
   ```typescript
   const parts = fbc.split('.');
   const timestamp = parseInt(parts[2]);
   const fbcDate = new Date(timestamp * 1000);
   console.log('fbc criado em:', fbcDate);
   ```

### Problema 4: fbc não aparece no GTM

**Sintomas:**
- fbc não aparece na tag Facebook
- Variável `{{webhook-ed -user_data.fbc}}` retorna vazio

**Soluções:**
1. Verificar se path está correto: `0.user_data.fbc` (com `0.` no início!)
2. Verificar se fbc está sendo enviado no payload:
   ```typescript
   console.log('📦 Payload completo:', JSON.stringify(payload, null, 2));
   ```
3. Verificar se variável está mapeada corretamente na tag
4. Verificar Preview Mode do GTM para ver dados recebidos

### Problema 5: fbc está sendo modificado

**Sintomas:**
- fbc aparece diferente do original
- Meta rejeita fbc

**Soluções:**
1. **NUNCA** fazer `toLowerCase()` no fbc
2. **NUNCA** truncar fbc
3. **NUNCA** modificar conteúdo interno
4. Apenas `trim()` externo é permitido
5. Verificar função `sanitizeFbc` - deve apenas fazer trim

---

## Checklist de Implementação

- [ ] Função `getMetaCookies()` criada e funcionando
- [ ] fbc capturado no frontend quando Lead é gerado
- [ ] API `/api/save-tracking` criada e salvando no KV
- [ ] Função `saveUserTracking()` salva por email E telefone
- [ ] Webhook `/api/webhook-cakto` criado
- [ ] Função `getUserDataFromKVOrPrisma()` busca no KV
- [ ] Função `sanitizeFbc()` criada (apenas trim)
- [ ] Função `validateFbc()` criada (formato + 24h)
- [ ] Função `sendPurchaseToGTM()` valida e envia fbc
- [ ] Variável GTM `{{webhook-ed -user_data.fbc}}` criada
- [ ] Tag Facebook Purchase mapeada com fbc
- [ ] Variáveis de ambiente configuradas
- [ ] Testes realizados e funcionando
- [ ] Logs adicionados para debug

---

## Resumo Final

### Fluxo Completo em 6 Passos:

1. **Frontend** → Captura fbc do cookie `_fbc` quando Lead é gerado
2. **API Save** → Salva fbc no Vercel KV (por email e telefone)
3. **Webhook** → Recebe compra e busca fbc no KV (com normalização)
4. **Validação** → Sanitiza e valida fbc (formato + 24h)
5. **GTM** → Envia fbc no `user_data.fbc` do payload
6. **Facebook** → Tag mapeia `{{webhook-ed -user_data.fbc}}` e envia

### Pontos Críticos:

✅ **NORMALIZAÇÃO**: Email e telefone devem ser normalizados antes de buscar  
✅ **PRESERVAÇÃO**: fbc deve ser preservado EXATAMENTE (sem modificações)  
✅ **VALIDAÇÃO**: Validar formato e timestamp (24h) antes de enviar  
✅ **FORMATO GTM**: Payload deve ser array `[eventData]` e path usar `0.`  
✅ **FALLBACK**: Buscar por email primeiro, telefone como fallback  

---

**Documento criado em:** 2024  
**Versão:** 1.0  
**Autor:** Sistema de Tracking FBC


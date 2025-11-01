/**
 * ?? Offline Conversions - Purchase via Webhook Cakto
 * 
 * Sistema para capturar convers?es que acontecem FORA do site
 * (checkout externo Cakto) e enviar via Meta Conversions API (CAPI)
 * com atribui??o correta usando fbp/fbc persistidos.
 * 
 * MELHORIA: Busca por email + telefone (fallback se email for diferente)
 */

import crypto from 'crypto';

// ===== INTERFACES =====

export interface CaktoWebhookPayload {
  secret: string;
  event: string;
  data: {
    id: string;
    refId: string;
    customer: {
      name: string;
      birthDate?: string | null;
      email: string;
      phone: string;
      docNumber?: string;
    };
    affiliate?: string;
    offer: {
      id: string;
      name: string;
      price: number;
    };
    offer_type: string;
    product: {
      name: string;
      id: string;
      short_id: string;
      supportEmail: string;
      type: string;
      invoiceDescription: string;
    };
    parent_order?: string;
    checkoutUrl?: string | null;
    status: string;
    baseAmount: number;
    discount?: string | null;
    amount: number;
    fees: number;
    paymentMethod: string;
    paymentMethodName?: string;
    installments: number;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    sck?: string | null;
    fbc?: string | null;
    fbp?: string | null;
    paidAt?: string | null;
    createdAt: string;
  };
}

export interface OfflinePurchaseData {
  orderId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  value: number;
  currency: string;
  timestamp?: number;
}

// ===== WEBHOOK VALIDATION =====

/**
 * Valida webhook Cakto
 * 
 * A Cakto envia o campo "secret" no payload que deve ser comparado
 * com a chave secreta configurada no .env
 */
export function validateCaktoWebhook(
  payload: CaktoWebhookPayload,
  expectedSecret: string
): boolean {
  try {
    if (!payload.secret) {
      console.error('? Webhook sem campo "secret"');
      return false;
    }
    
    // Compara??o segura
    if (payload.secret !== expectedSecret) {
      console.error('? Secret inv?lido no webhook');
      return false;
    }
    
    console.log('? Webhook Cakto validado com sucesso');
    return true;
    
  } catch (error) {
    console.error('? Erro ao validar webhook:', error);
    return false;
  }
}

// ===== UTILITIES =====

/**
 * Normaliza telefone para busca consistente
 * Remove formata??o e garante que comece com 55 (Brasil)
 */
function normalizePhone(phone: string): string {
  // Remove tudo que n?o ? n?mero
  const cleaned = phone.replace(/\D/g, '');
  
  // Se j? come?a com 55, retorna
  if (cleaned.startsWith('55')) {
    return cleaned;
  }
  
  // Se tem 11 ou 10 d?gitos (DDD + n?mero), adiciona 55
  if (cleaned.length >= 10 && cleaned.length <= 11) {
    return `55${cleaned}`;
  }
  
  // Se tem 13 ou 12 d?gitos e come?a com 55, retorna
  if (cleaned.length >= 12 && cleaned.startsWith('55')) {
    return cleaned;
  }
  
  // Caso contr?rio, retorna como est? (melhor que falhar)
  return cleaned;
}

// ===== USER DATA LOOKUP =====

/**
 * Busca dados persistidos do usu?rio por email E telefone
 * 
 * ESTRAT?GIA INTELIGENTE:
 * 1. Tenta buscar por email (prioridade)
 * 2. Se n?o encontrar, busca por telefone (fallback)
 * 3. Retorna primeiro match encontrado
 * 
 * IMPORTANTE: Usu?rio pode usar email diferente no checkout!
 * Por isso a busca por telefone ? CR?TICA.
 * 
 * NOTA: Esta fun??o roda no servidor (API route), ent?o pode usar Prisma
 */
export async function getUserDataByEmailOrPhone(
  email: string,
  phone?: string
): Promise<{
  fbp?: string;
  fbc?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
  matchedBy?: 'email' | 'phone';
} | null> {
  
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    let userData = null;
    let matchedBy: 'email' | 'phone' | undefined;
    
    // 1. PRIORIDADE: Busca por email
    if (email) {
      userData = await prisma.userTracking.findUnique({
        where: { email: email.toLowerCase().trim() }
      });
      
      if (userData) {
        matchedBy = 'email';
        console.log('? User data encontrado por EMAIL:', email);
      }
    }
    
    // 2. FALLBACK: Busca por telefone (se n?o encontrou por email)
    if (!userData && phone) {
      const normalizedPhone = normalizePhone(phone);
      
      // Busca no banco (precisa normalizar o phone do banco tamb?m)
      const allUsers = await prisma.userTracking.findMany({
        where: {
          phone: {
            not: null
          }
        }
      });
      
      // Compara telefones normalizados
      userData = allUsers.find(user => {
        if (!user.phone) return false;
        const dbPhone = normalizePhone(user.phone);
        return dbPhone === normalizedPhone;
      }) || null;
      
      if (userData) {
        matchedBy = 'phone';
        console.log('? User data encontrado por TELEFONE:', phone);
        console.warn('?? Email diferente! Checkout:', email, '| Original:', userData.email);
      }
    }
    
    await prisma.$disconnect();
    
    if (!userData) {
      console.warn('? User data N?O encontrado:', { email, phone });
      return null;
    }
    
    return {
      fbp: userData.fbp || undefined,
      fbc: userData.fbc || undefined,
      firstName: userData.firstName || undefined,
      lastName: userData.lastName || undefined,
      phone: userData.phone || undefined,
      city: userData.city || undefined,
      state: userData.state || undefined,
      zip: userData.zip || undefined,
      matchedBy
    };
    
  } catch (error) {
    console.error('? Erro ao buscar user data:', error);
    return null;
  }
}

/**
 * Alias para compatibilidade (busca s? por email)
 * @deprecated Use getUserDataByEmailOrPhone() para melhor matching
 */
export async function getUserDataByEmail(email: string) {
  return getUserDataByEmailOrPhone(email);
}

/**
 * Salva dados do usu?rio no banco (chamado quando Lead acontece)
 * 
 * NOTA: Esta fun??o roda no servidor (API route)
 */
export async function saveUserTrackingData(data: {
  email: string;
  fbp?: string;
  fbc?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
}): Promise<boolean> {
  
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.userTracking.upsert({
      where: { email: data.email.toLowerCase().trim() },
      create: {
        email: data.email.toLowerCase().trim(),
        fbp: data.fbp,
        fbc: data.fbc,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: 'br'
      },
      update: {
        fbp: data.fbp || undefined,
        fbc: data.fbc || undefined,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zip: data.zip || undefined
      }
    });
    
    await prisma.$disconnect();
    
    console.log('? User tracking data salvo:', {
      email: data.email,
      hasFbp: !!data.fbp,
      hasFbc: !!data.fbc
    });
    
    return true;
    
  } catch (error) {
    console.error('? Erro ao salvar user tracking data:', error);
    return false;
  }
}

// ===== SHA-256 HASHING =====

/**
 * Hash SHA-256 para PII (Meta exige)
 */
export function hashSHA256(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value.toLowerCase().trim())
    .digest('hex');
}

// ===== SEND TO STAPE CAPI =====

/**
 * Envia Purchase offline para Meta via Stape CAPI
 */
export async function sendOfflinePurchase(
  purchaseData: OfflinePurchaseData,
  userData: {
    fbp?: string;
    fbc?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    state?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  
  try {
    const stapeUrl = process.env.NEXT_PUBLIC_STAPE_CONTAINER_URL;
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    
    if (!stapeUrl || !pixelId) {
      throw new Error('Stape URL ou Pixel ID n?o configurado');
    }
    
    // Preparar user_data (hashear PII)
    const user_data: Record<string, any> = {
      em: hashSHA256(purchaseData.email),
    };
    
    // Adicionar dados do formul?rio (se tiver)
    if (purchaseData.firstName) user_data.fn = hashSHA256(purchaseData.firstName);
    if (purchaseData.lastName) user_data.ln = hashSHA256(purchaseData.lastName);
    if (purchaseData.phone) {
      const phoneClean = purchaseData.phone.replace(/\D/g, '');
      user_data.ph = hashSHA256(phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`);
    }
    
    // Adicionar dados persistidos (CR?TICO para atribui??o!)
    if (userData.fbp) user_data.fbp = userData.fbp;
    if (userData.fbc) user_data.fbc = userData.fbc;
    if (userData.city) user_data.ct = hashSHA256(userData.city);
    if (userData.state) user_data.st = hashSHA256(userData.state);
    
    // Preparar evento
    const eventTime = purchaseData.timestamp 
      ? Math.floor(purchaseData.timestamp / 1000) 
      : Math.floor(Date.now() / 1000);
    
    const eventID = `Purchase_${purchaseData.orderId}_${eventTime}`;
    
    const payload = {
      data: [{
        event_name: 'Purchase',
        event_time: eventTime,
        event_id: eventID,
        event_source_url: 'https://pay.cakto.com.br',
        action_source: 'website',
        user_data,
        custom_data: {
          value: purchaseData.value,
          currency: purchaseData.currency,
          content_type: 'product',
          content_ids: ['339591'],
          content_name: 'Sistema 4 Fases - Ebook Trips',
          content_category: 'digital_product',
          num_items: 1,
          order_id: purchaseData.orderId
        }
      }]
    };
    
    // Enviar para Stape CAPIG
    console.log('?? Enviando Purchase via Stape CAPI:', {
      orderId: purchaseData.orderId,
      email: purchaseData.email,
      value: purchaseData.value,
      hasFbp: !!userData.fbp,
      hasFbc: !!userData.fbc
    });
    
    // Endpoint do Stape CAPIG (envia direto, sem /v15.0/pixelId)
    // O Stape CAPIG processa e encaminha para o Meta automaticamente
    const response = await fetch(stapeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stape CAPI error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    console.log('? Offline Purchase enviado via Stape CAPI:', {
      orderId: purchaseData.orderId,
      eventID,
      response: result
    });
    
    return { success: true };
    
  } catch (error: any) {
    console.error('? Erro ao enviar offline purchase:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// ===== WEBHOOK PROCESSOR =====

/**
 * Processa webhook da Cakto e envia Purchase
 */
export async function processCaktoWebhook(
  payload: CaktoWebhookPayload
): Promise<{ success: boolean; message: string }> {
  
  try {
    console.log('?? Webhook Cakto recebido:', {
      event: payload.event,
      orderId: payload.data.refId,
      email: payload.data.customer.email,
      phone: payload.data.customer.phone,
      status: payload.data.status
    });
    
    // Validar se ? um evento de compra aprovada
    if (payload.event !== 'purchase_approved') {
      console.log(`?? Evento "${payload.event}" ignorado (n?o ? purchase_approved)`);
      return {
        success: true,
        message: `Evento ${payload.event} recebido mas ignorado`
      };
    }
    
    // Validar se o pagamento foi confirmado
    if (payload.data.status !== 'paid') {
      console.log(`?? Status "${payload.data.status}" ignorado (n?o ? paid)`);
      return {
        success: true,
        message: `Status ${payload.data.status} ignorado`
      };
    }
    
    // Extrair dados do cliente
    const customer = payload.data.customer;
    const nameParts = customer.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    // Preparar dados da compra
    const purchaseData: OfflinePurchaseData = {
      orderId: payload.data.refId,
      email: customer.email,
      firstName,
      lastName: lastName || undefined,
      phone: customer.phone,
      value: payload.data.amount,
      currency: 'BRL',
      timestamp: payload.data.paidAt ? new Date(payload.data.paidAt).getTime() : Date.now()
    };
    
    if (!purchaseData.email) {
      throw new Error('Email n?o encontrado no payload');
    }
    
    // Buscar dados persistidos do usu?rio (fbp/fbc)
    // BUSCA POR EMAIL E TELEFONE (fallback se email for diferente!)
    const userData = await getUserDataByEmailOrPhone(
      purchaseData.email,
      purchaseData.phone
    );
    
    if (!userData) {
      console.warn('?? User data N?O encontrado:', {
        email: purchaseData.email,
        phone: purchaseData.phone
      });
      console.warn('?? Purchase ser? enviado sem fbp/fbc (atribui??o pode ser prejudicada)');
    } else {
      console.log('? User data encontrado:', {
        matchedBy: userData.matchedBy,
        email: purchaseData.email,
        hasFbp: !!userData.fbp,
        hasFbc: !!userData.fbc
      });
      
      // Alerta se encontrou por telefone (email diferente)
      if (userData.matchedBy === 'phone') {
        console.log('?? Match por TELEFONE! Usu?rio usou email diferente no checkout');
      }
    }
    
    // Enviar Purchase via Stape CAPI
    const result = await sendOfflinePurchase(
      purchaseData,
      userData || {}
    );
    
    if (!result.success) {
      throw new Error(result.error || 'Erro ao enviar Purchase');
    }
    
    return {
      success: true,
      message: 'Offline Purchase processado e enviado com sucesso'
    };
    
  } catch (error: any) {
    console.error('? Erro ao processar webhook Cakto:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

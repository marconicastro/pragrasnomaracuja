/**
 * ?? Offline Conversions - Purchase via Webhook Cakto
 * 
 * Sistema para capturar convers?es que acontecem FORA do site
 * (checkout externo Cakto) e enviar via Meta Conversions API (CAPI)
 * com atribui??o correta usando fbp/fbc persistidos.
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

// ===== USER DATA LOOKUP =====

/**
 * Busca dados persistidos do usu?rio por email
 * 
 * IMPORTANTE: Precisa dos dados que foram salvos quando o usu?rio
 * preencheu o formul?rio (Lead/InitiateCheckout)
 */
export function getUserDataByEmail(email: string): {
  fbp?: string;
  fbc?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
} | null {
  
  // TODO: Implementar busca no banco de dados (Prisma)
  // Por enquanto, retornar null
  // Ser? implementado na pr?xima etapa
  
  console.warn('?? getUserDataByEmail ainda n?o implementado (precisa banco)');
  return null;
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
    
    const response = await fetch(`${stapeUrl}/v15.0/${pixelId}/events`, {
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
    const userData = getUserDataByEmail(purchaseData.email);
    
    if (!userData) {
      console.warn('?? User data n?o encontrado para:', purchaseData.email);
      console.warn('?? Purchase ser? enviado sem fbp/fbc (atribui??o pode ser prejudicada)');
    } else {
      console.log('? User data encontrado:', {
        email: purchaseData.email,
        hasFbp: !!userData.fbp,
        hasFbc: !!userData.fbc
      });
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

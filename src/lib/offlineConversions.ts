/**
 * ?? Offline Conversions - Purchase via Webhook
 * 
 * Sistema para capturar convers?es que acontecem FORA do site
 * (checkout externo) e enviar via Meta Conversions API (CAPI)
 * com atribui??o correta usando fbp/fbc persistidos.
 */

import crypto from 'crypto';

// ===== INTERFACES =====

export interface CaktoWebhookPayload {
  // Estrutura ser? preenchida quando recebermos a documenta??o
  event: string;
  transaction_id?: string;
  customer_email?: string;
  customer_name?: string;
  amount?: number;
  status?: string;
  [key: string]: any;
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
 * Valida assinatura do webhook Cakto
 * 
 * AGUARDANDO: Documenta??o da Cakto para saber como validar
 */
export function validateCaktoWebhook(
  payload: any,
  signature: string,
  secret: string
): boolean {
  try {
    // TODO: Implementar valida??o conforme documenta??o Cakto
    // Exemplo gen?rico (pode variar):
    // const expectedSignature = crypto
    //   .createHmac('sha256', secret)
    //   .update(JSON.stringify(payload))
    //   .digest('hex');
    // 
    // return crypto.timingSafeEqual(
    //   Buffer.from(signature),
    //   Buffer.from(expectedSignature)
    // );
    
    console.warn('?? Valida??o de webhook ainda n?o implementada (aguardando docs)');
    return true; // Tempor?rio
    
  } catch (error) {
    console.error('Erro ao validar webhook:', error);
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
  
  // TODO: Implementar busca real
  // Op??es:
  // 1. localStorage (se webhook vier do browser - improv?vel)
  // 2. Banco de dados (melhor op??o)
  // 3. API externa
  
  console.warn('?? Busca de user data ainda n?o implementada');
  
  // Por enquanto, retornar null
  // Ser? implementado quando soubermos a estrutura do webhook
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
    
    if (userData.fbp) user_data.fbp = userData.fbp;
    if (userData.fbc) user_data.fbc = userData.fbc;
    if (userData.phone) {
      const phoneClean = userData.phone.replace(/\D/g, '');
      user_data.ph = hashSHA256(phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`);
    }
    if (userData.firstName) user_data.fn = hashSHA256(userData.firstName);
    if (userData.lastName) user_data.ln = hashSHA256(userData.lastName);
    if (userData.city) user_data.ct = hashSHA256(userData.city);
    if (userData.state) user_data.st = hashSHA256(userData.state);
    
    // Preparar evento
    const eventTime = purchaseData.timestamp 
      ? Math.floor(purchaseData.timestamp / 1000) 
      : Math.floor(Date.now() / 1000);
    
    const payload = {
      data: [{
        event_name: 'Purchase',
        event_time: eventTime,
        event_id: `Purchase_${purchaseData.orderId}_${eventTime}`,
        event_source_url: 'https://pay.cakto.com.br', // checkout externo
        action_source: 'website',
        user_data,
        custom_data: {
          value: purchaseData.value,
          currency: purchaseData.currency,
          content_type: 'product',
          content_ids: ['339591'],
          content_name: 'Sistema 4 Fases - Ebook Trips',
          num_items: 1,
          order_id: purchaseData.orderId
        }
      }]
    };
    
    // Enviar para Stape CAPIG
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
      email: purchaseData.email,
      value: purchaseData.value,
      fbp: userData.fbp ? 'presente' : 'ausente',
      fbc: userData.fbc ? 'presente' : 'ausente'
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
 * 
 * AGUARDANDO: Documenta??o completa da Cakto
 */
export async function processCaktoWebhook(
  payload: CaktoWebhookPayload
): Promise<{ success: boolean; message: string }> {
  
  try {
    // TODO: Adaptar conforme estrutura real do webhook Cakto
    console.log('?? Webhook Cakto recebido:', payload);
    
    // Validar se ? um evento de compra confirmada
    // TODO: Verificar campo correto conforme documenta??o
    if (payload.event !== 'purchase.approved' && payload.status !== 'paid') {
      return {
        success: false,
        message: 'Evento n?o ? uma compra confirmada'
      };
    }
    
    // Extrair dados (adaptar conforme estrutura real)
    const purchaseData: OfflinePurchaseData = {
      orderId: payload.transaction_id || 'unknown',
      email: payload.customer_email || '',
      value: payload.amount || 0,
      currency: 'BRL'
    };
    
    if (!purchaseData.email) {
      throw new Error('Email n?o encontrado no payload');
    }
    
    // Buscar dados persistidos do usu?rio
    const userData = getUserDataByEmail(purchaseData.email);
    
    if (!userData) {
      console.warn('?? User data n?o encontrado para:', purchaseData.email);
      // Mesmo assim, enviar Purchase (sem fbp/fbc)
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
      message: 'Offline Purchase processado com sucesso'
    };
    
  } catch (error: any) {
    console.error('? Erro ao processar webhook Cakto:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

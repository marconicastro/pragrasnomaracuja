/**
 * 📤 Offline Conversions - Purchase via Webhook Cakto
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
        console.warn('📤 Email diferente! Checkout:', email, '| Original:', userData.email);
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
  zip?: string;
  country?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  
  try {
    // DEBUG: Ver exatamente o que recebemos do KV
    console.log('🔍 DEBUG - userData recebido do KV:', {
      hasFbp: !!userData.fbp,
      hasFbc: !!userData.fbc,
      hasCity: !!userData.city,
      hasState: !!userData.state,
      hasZip: !!userData.zip,
      city: userData.city,
      state: userData.state,
      zip: userData.zip
    });
    
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
    
    // External ID (session) - NÃO hashear (conforme doc Meta)
    // Ganho: +0.22% conversões adicionais
    if (userData.external_id) {
      user_data.external_id = userData.external_id;
    } else {
      // Gerar external_id baseado no email (fallback se não tiver session)
      user_data.external_id = `purchase_${hashSHA256(purchaseData.email).substring(0, 16)}`;
    }
    
    // Geolocaliza??o (do Lead salvo) - DEVE HASHEAR! (todos os user_data exceto fbp/fbc/external_id)
    if (userData.city) user_data.ct = hashSHA256(userData.city.toLowerCase());
    if (userData.state) user_data.st = hashSHA256(userData.state.toLowerCase());
    if (userData.zip) user_data.zp = hashSHA256(userData.zip.replace(/\D/g, ''));
    // Pa?s sempre BR (DEVE HASHEAR!)
    user_data.country = hashSHA256('br');
    
    // Preparar evento - SEMPRE usar timestamp ATUAL (melhor prática)
    // Para eventos server-side, o ideal é enviar o timestamp de quando o webhook é processado
    const now = Math.floor(Date.now() / 1000);
    const eventTime = now;
    
    console.log('🕐 Timestamp do evento:', {
      unix: eventTime,
      iso: new Date(eventTime * 1000).toISOString(),
      local: new Date(eventTime * 1000).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    });
    
    const eventID = `Purchase_${purchaseData.orderId}_${eventTime}`;
    
    // Calcular Data Quality Score do Purchase
    let dataQualityScore = 0;
    if (user_data.em) dataQualityScore += 15;
    if (user_data.ph) dataQualityScore += 15;
    if (user_data.fn) dataQualityScore += 10;
    if (user_data.ln) dataQualityScore += 10;
    if (user_data.ct) dataQualityScore += 5;   // City
    if (user_data.st) dataQualityScore += 5;   // State
    if (user_data.zp) dataQualityScore += 3;   // ZIP
    if (user_data.country) dataQualityScore += 2; // Country
    if (user_data.fbp) dataQualityScore += 20; // CRÍTICO!
    if (user_data.fbc) dataQualityScore += 20; // CRÍTICO!
    
    // Test Event Code (opcional - para aparecer em Test Events do Meta)
    const testEventCode = process.env.META_TEST_EVENT_CODE;
    
    // Preparar custom_data - APENAS campos com dados REAIS (ZERO fake!)
    const customData: Record<string, any> = {
      // Dados obrigatórios do produto
      value: purchaseData.value,
      currency: purchaseData.currency,
      content_type: 'product',
      content_ids: ['hacr962'],
      content_name: 'Sistema 4 Fases - Ebook Trips',
      content_category: 'digital_product',
      num_items: 1,
      order_id: purchaseData.orderId,
      // Metadata Elite
      fb_data_quality_score: dataQualityScore,
      fb_tracking_version: '2.0_elite',
      fb_event_source: 'webhook_cakto',
      fb_purchase_type: 'offline_conversion'
    };
    
    // SOMENTE adicionar attribution SE tiver dados REAIS do Lead
    const userDataTyped = userData as any;
    
    if (userDataTyped && userDataTyped.firstTouchSource) {
      // Attribution data existe - adicionar tudo
      customData.fb_first_touch_source = userDataTyped.firstTouchSource;
      customData.fb_first_touch_medium = userDataTyped.firstTouchMedium;
      customData.fb_last_touch_source = userDataTyped.lastTouchSource;
      customData.fb_last_touch_medium = userDataTyped.lastTouchMedium;
      customData.fb_touchpoint_count = userDataTyped.touchpointCount;
      customData.fb_time_to_convert = userDataTyped.timeToConvert ? Math.floor(userDataTyped.timeToConvert / 1000) : 0;
      customData.fb_has_paid_click = userDataTyped.hasPaidClick;
      
      // Attribution journey completa
      if (userDataTyped.attributionJourney && userDataTyped.attributionJourney !== '{}') {
        customData.fb_attribution_journey = userDataTyped.attributionJourney;
      }
      
      console.log('✅ Attribution data do Lead encontrada e adicionada ao Purchase!');
    } else {
      console.log('ℹ️ Attribution data não disponível (user não tinha Lead salvo)');
    }
    
    // SOMENTE adicionar UTMs SE tiver dados REAIS do Lead
    if (userDataTyped && userDataTyped.utmFirstSource) {
      // UTM data existe - adicionar tudo
      customData.utm_first_source = userDataTyped.utmFirstSource;
      customData.utm_first_medium = userDataTyped.utmFirstMedium;
      customData.utm_first_campaign = userDataTyped.utmFirstCampaign;
      customData.utm_last_source = userDataTyped.utmLastSource;
      customData.utm_last_medium = userDataTyped.utmLastMedium;
      customData.utm_last_campaign = userDataTyped.utmLastCampaign;
      customData.utm_touch_count = userDataTyped.utmTouchCount;
      customData.utm_channels = userDataTyped.utmChannels;
      
      console.log('✅ UTM data do Lead encontrada e adicionada ao Purchase!');
    } else {
      console.log('ℹ️ UTM data não disponível (user não tinha UTMs no Lead)');
    }
    
    // Metadata sobre match (SOMENTE se matched)
    if (userDataTyped && userDataTyped.matchedBy) {
      customData.fb_matched_by = userDataTyped.matchedBy;
    }
    
    // Indicadores de fbp/fbc (SOMENTE se presentes)
    if (userData.fbp) customData.fb_has_fbp = true;
    if (userData.fbc) customData.fb_has_fbc = true;
    
    const payload: any = {
      data: [{
        event_name: 'Purchase',
        event_time: eventTime,
        event_id: eventID,
        event_source_url: 'https://pay.cakto.com.br',
        action_source: 'website',
        user_data,
        custom_data: customData
      }]
    };
    
    // Adicionar test_event_code se configurado (para debug no Meta Events Manager)
    if (testEventCode) {
      payload.test_event_code = testEventCode;
      console.log('🧪 Test Event Code ativado:', testEventCode);
    }
    
    console.log('📊 Purchase Data Quality Score:', dataQualityScore);
    
    // ESTRATÉGIA: Tentar Stape CAPIG primeiro (mantém IP/UA real)
    // Se falhar, fallback para Meta direto (garante envio)
    
    let response;
    let viaStape = false;
    let error404Details = '';
    
    // TENTATIVA 1: Via Stape CAPIG (MELHOR - mantém IP/UA real + fbp/fbc)
    try {
      console.log('📤 Tentando enviar via Stape CAPIG:', {
        orderId: purchaseData.orderId,
        stapeUrl,
        hasFbp: !!userData.fbp,
        hasFbc: !!userData.fbc
      });
      
      // CAPIG: Tentar múltiplos formatos de endpoint
      // Formato 1: /facebook/{pixel_id}
      // Formato 2: /stape-api/{capig_id}/v1/facebook
      // Formato 3: URL base do Stape (sa.stape.co)
      
      // CAPIG settings (atualizado 02/11/2024)
      const capigIdentifier = process.env.STAPE_CAPIG_IDENTIFIER || 'kmwitszu';
      const capigApiKey = process.env.STAPE_CAPIG_API_KEY;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (capigApiKey) {
        headers['Authorization'] = `Bearer ${capigApiKey}`;
        console.log('🔑 CAPIG API Key incluída (Authorization header)');
      }
      
      // TENTAR FORMATO 1: CAPIG raiz (POST direto na URL base)
      let stapeEndpoint = stapeUrl;
      
      console.log('🔄 Tentativa 1 - CAPIG raiz (POST direto):', stapeEndpoint);
      
      response = await fetch(stapeEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`❌ Tentativa 1 falhou: ${response.status} - ${errorText}`);
        
        // TENTAR FORMATO 2: CAPIG /events
        stapeEndpoint = `${stapeUrl}/events`;
        console.log('🔄 Tentativa 2 - CAPIG /events:', stapeEndpoint);
        
        response = await fetch(stapeEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorText2 = await response.text();
          console.warn(`❌ Tentativa 2 falhou: ${response.status} - ${errorText2}`);
          
          // TENTAR FORMATO 3: Custom domain (se diferente)
          if (stapeUrl !== 'https://capig.stape.pm') {
            stapeEndpoint = `${stapeUrl}/facebook`;
            console.log('🔄 Tentativa 3 - Custom domain:', stapeEndpoint);
            
            response = await fetch(stapeEndpoint, {
              method: 'POST',
              headers,
              body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
              const errorText3 = await response.text();
              console.warn(`❌ Tentativa 3 falhou: ${response.status} - ${errorText3}`);
              
              // TENTAR FORMATO 4: CAPIG /conversions
              stapeEndpoint = `${stapeUrl}/conversions`;
              console.log('🔄 Tentativa 4 - CAPIG /conversions:', stapeEndpoint);
              
              response = await fetch(stapeEndpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
              });
              
              if (!response.ok) {
                const errorText4 = await response.text();
                console.warn(`❌ Tentativa 4 falhou: ${response.status} - ${errorText4}`);
                
                // TENTAR FORMATO 5: sGTM container (se tiver tag Facebook CAPI configurada)
                const sgtmUrl = 'https://event.maracujazeropragas.com';
                stapeEndpoint = `${sgtmUrl}/facebook`;
                console.log('🔄 Tentativa 5 - sGTM container:', stapeEndpoint);
                
                response = await fetch(stapeEndpoint, {
                  method: 'POST',
                  headers,
                  body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                  const errorText5 = await response.text();
                  console.warn(`❌ Tentativa 5 falhou: ${response.status} - ${errorText5}`);
                  
                  // TENTAR FORMATO 6: CAPIG URL principal /facebook
                  stapeEndpoint = 'https://capig.stape.pm/facebook';
                  console.log('🔄 Tentativa 6 - URL principal Stape /facebook:', stapeEndpoint);
                  
                  response = await fetch(stapeEndpoint, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                  });
                  
                  if (!response.ok) {
                    error404Details = `Todas 6 tentativas falharam. Último: ${response.status} - ${await response.text()}`;
                    throw new Error(error404Details);
                  }
                }
              }
            }
          } else {
            error404Details = `Todas tentativas falharam. Último: ${response.status} - ${errorText2}`;
            throw new Error(error404Details);
          }
        }
      }
      
      // Se chegou aqui, deu certo!
      viaStape = true;
      console.log('✅ SUCCESS: Purchase enviado via Stape CAPIG (IP/UA real mantido!)');
      
    } catch (stapeError: any) {
      console.warn('⚠️ Stape CAPIG falhou, tentando fallback para Meta direto...');
      console.warn('Detalhes:', stapeError.message);
      
      // TENTATIVA 2: Fallback para Meta direto (FUNCIONA mas perde IP/UA)
      const accessToken = process.env.META_ACCESS_TOKEN;
      
      if (!accessToken) {
        throw new Error('Stape falhou E META_ACCESS_TOKEN não configurado. Não é possível enviar Purchase.');
      }
      
      console.log('📤 Tentando enviar via Meta CAPI direto (fallback)...');
      
      const metaEndpoint = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`;
      
      response = await fetch(metaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ambos falharam! Stape: ${error404Details} | Meta: ${response.status} - ${errorText}`);
      }
      
      console.log('✅ SUCCESS: Purchase enviado via Meta CAPI direto (fallback OK, mas sem IP/UA real)');
    }
    
    const result = await response.json();
    
    console.log('✅ Purchase processado:', {
      orderId: purchaseData.orderId,
      eventID,
      via: viaStape ? 'Stape CAPIG (🎯 IP/UA real!)' : 'Meta direto (fallback)',
      response: result
    });
    
    return { 
      success: true,
      viaStape,
      message: viaStape 
        ? 'Purchase enviado via Stape CAPIG - IP/UA real mantido!' 
        : 'Purchase enviado via Meta direto (fallback) - Stape não respondeu'
    };
    
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
    console.log('📤 Webhook Cakto recebido:', {
      event: payload.event,
      orderId: payload.data.refId,
      email: payload.data.customer.email,
      phone: payload.data.customer.phone,
      status: payload.data.status
    });
    
    // Validar se ? um evento de compra aprovada
    if (payload.event !== 'purchase_approved') {
      console.log(`📤 Evento "${payload.event}" ignorado (n?o ? purchase_approved)`);
      return {
        success: true,
        message: `Evento ${payload.event} recebido mas ignorado`
      };
    }
    
    // Validar se o pagamento foi confirmado
    if (payload.data.status !== 'paid') {
      console.log(`📤 Status "${payload.data.status}" ignorado (n?o ? paid)`);
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
      console.warn('📤 User data N?O encontrado:', {
        email: purchaseData.email,
        phone: purchaseData.phone
      });
      console.warn('📤 Purchase ser? enviado sem fbp/fbc (atribui??o pode ser prejudicada)');
    } else {
      console.log('? User data encontrado:', {
        matchedBy: userData.matchedBy,
        email: purchaseData.email,
        hasFbp: !!userData.fbp,
        hasFbc: !!userData.fbc
      });
      
      // Alerta se encontrou por telefone (email diferente)
      if (userData.matchedBy === 'phone') {
        console.log('📤 Match por TELEFONE! Usu?rio usou email diferente no checkout');
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

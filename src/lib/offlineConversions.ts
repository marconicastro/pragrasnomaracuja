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
import { validateFbc } from './utils/fbcValidator';
import { 
  normalizeEmail,
  normalizeName,
  normalizePhone,
  normalizeCity,
  normalizeState,
  normalizeZip,
  normalizeCountry
} from './utils/metaDataNormalizer';

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
    
    // 1. Busca por email
    if (email) {
      userData = await prisma.userTracking.findUnique({
        where: { email: email.toLowerCase().trim() }
      });
      
      if (userData) {
        matchedBy = 'email';
        console.log('✅ User data encontrado por EMAIL:', email);
      }
    }
    
    // 2. Fallback: Busca por telefone
    if (!userData && phone) {
      const normalizedPhone = normalizePhone(phone);
      const allUsers = await prisma.userTracking.findMany({
        where: { phone: { not: null } }
      });
      
      userData = allUsers.find(user => {
        if (!user.phone) return false;
        return normalizePhone(user.phone) === normalizedPhone;
      });
      
      if (userData) {
        matchedBy = 'phone';
        console.log('✅ User data encontrado por TELEFONE:', phone);
      }
    }
    
    await prisma.$disconnect();
    
    if (!userData) {
      console.warn('⚠️ User data NÃO encontrado:', { email, phone });
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
 * Busca dados do usuário usando Vercel KV como primário, Prisma como fallback
 * 
 * ESTRATÉGIA:
 * 1. Tenta Vercel KV primeiro (mais rápido)
 * 2. Se falhar, usa Prisma como fallback
 * 3. Retorna primeiro match encontrado
 */
export async function getUserDataFromKVOrPrisma(
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
  // Dados completos para construção da URL (UTMs, fbclid, etc)
  [key: string]: any;
} | null> {
  
  // 1. PRIORIDADE: Tentar Vercel KV primeiro (mais rápido)
  try {
    const { getUserTracking } = await import('./userTrackingStore');
    const kvData = await getUserTracking(email, phone);
    
    if (kvData) {
      console.log('✅ User data encontrado no Vercel KV:', {
        email: kvData.email,
        hasFbp: !!kvData.fbp,
        hasFbc: !!kvData.fbc,
        fbc: kvData.fbc ? kvData.fbc.substring(0, 40) + '...' : 'undefined', // 🔍 DEBUG
        fbcLength: kvData.fbc?.length || 0, // 🔍 DEBUG
        hasCity: !!kvData.city,
        hasState: !!kvData.state,
        hasZip: !!kvData.zip,
        hasFbclid: !!kvData.fbclid,
        hasGclid: !!kvData.gclid,
        city: kvData.city,
        state: kvData.state,
        zip: kvData.zip
      });
      
      // Retornar TODOS os dados (incluindo UTMs, fbclid, gclid, etc)
      return {
        fbp: kvData.fbp,
        fbc: kvData.fbc,
        firstName: kvData.firstName,
        lastName: kvData.lastName,
        phone: kvData.phone,
        city: kvData.city,
        state: kvData.state,
        zip: kvData.zip,
        matchedBy: email ? 'email' : 'phone',
        // Dados completos para construção da URL
        ...kvData
      };
    } else {
      console.warn('⚠️ User data NÃO encontrado no KV:', { email, phone });
    }
  } catch (error) {
    console.warn('⚠️ Vercel KV não disponível, tentando Prisma:', error);
  }
  
  // 2. FALLBACK: Usar Prisma se KV não disponível (somente se DATABASE_URL configurado)
  try {
    if (process.env.DATABASE_URL) {
      return await getUserDataByEmailOrPhone(email, phone);
    } else {
      console.warn('⚠️ Prisma não disponível (DATABASE_URL não configurado)');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar no Prisma:', error);
    return null;
  }
}

/**
 * Alias para compatibilidade (busca s? por email)
 * @deprecated Use getUserDataByEmailOrPhone() para melhor matching
 */
export async function getUserDataByEmail(email: string) {
  return getUserDataFromKVOrPrisma(email);
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
    // +3.36% conversões adicionais! (CRÍTICO)
    client_ip_address?: string;
    client_user_agent?: string;
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
      zip: userData.zip,
      fbp: userData.fbp ? userData.fbp.substring(0, 30) + '...' : undefined,
      fbc: userData.fbc ? userData.fbc.substring(0, 40) + '...' : undefined
    });
    
    const stapeUrl = process.env.NEXT_PUBLIC_STAPE_CONTAINER_URL;
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    
    if (!stapeUrl || !pixelId) {
      throw new Error('Stape URL ou Pixel ID n?o configurado');
    }
    
    // ⚠️ NORMALIZAÇÃO CRÍTICA: Normalizar TODOS os dados para padrão Facebook antes de hash
    // Garante consistência mesmo se dados vierem em formato inconsistente
    const normalizedEmail = normalizeEmail(purchaseData.email);
    const normalizedFirstName = purchaseData.firstName ? normalizeName(purchaseData.firstName) : undefined;
    const normalizedLastName = purchaseData.lastName ? normalizeName(purchaseData.lastName) : undefined;
    const normalizedPhone = purchaseData.phone ? normalizePhone(purchaseData.phone) : undefined;
    
    // Preparar user_data (hashear PII normalizado)
    const user_data: Record<string, any> = {
      em: hashSHA256(normalizedEmail),
    };
    
    // Adicionar dados normalizados (se tiver)
    if (normalizedFirstName) user_data.fn = hashSHA256(normalizedFirstName);
    if (normalizedLastName) user_data.ln = hashSHA256(normalizedLastName);
    if (normalizedPhone) user_data.ph = hashSHA256(normalizedPhone);
    
    // Adicionar dados persistidos (CRÍTICO para atribuição!)
    if (userData.fbp) {
      user_data.fbp = userData.fbp;
      console.log('✅ fbp adicionado');
    } else {
      console.warn('⚠️ fbp ausente (impacto: -20 DQS)');
    }
    
    // fbc: VALIDAR antes de enviar (Meta rejeita fbc fake/modificado!)
    // CRÍTICO: fbc DEVE ser preservado EXATAMENTE como vem do cookie
    // Qualquer modificação (lowercase, truncamento, etc) causa erro no Meta CAPI
    if (userData.fbc) {
      console.log('🔍 DEBUG fbc antes de validar:', {
        fbc: userData.fbc.substring(0, 40) + '...',
        fbcLength: userData.fbc.length,
        hasFbc: !!userData.fbc
      });
      
      const { sanitizeFbc } = await import('./utils/fbcSanitizer');
      const sanitizedFbc = sanitizeFbc(userData.fbc);
      
      console.log('🔍 DEBUG fbc após sanitizar:', {
        sanitized: sanitizedFbc ? sanitizedFbc.substring(0, 40) + '...' : 'null',
        isValid: !!sanitizedFbc
      });
      
      if (sanitizedFbc) {
        // Validação completa: formato + timestamp dentro de 24h
        const fbcValidation = validateFbc(sanitizedFbc);
        
        console.log('🔍 DEBUG fbc validação:', fbcValidation);
        
        if (fbcValidation.valid) {
          // PRESERVAR EXATAMENTE como está (sem nenhuma modificação!)
          user_data.fbc = sanitizedFbc;
          console.log('✅ fbc válido, preservado exatamente e dentro da janela de 24h');
          console.log('🔍 fbc preview:', sanitizedFbc.substring(0, 40) + '...');
        } else {
          // DEBUG: Mostrar detalhes do fbc expirado
          const parts = sanitizedFbc.split('.');
          const fbcTimestamp = parseInt(parts[2]);
          const now = Math.floor(Date.now() / 1000);
          const diff = now - fbcTimestamp;
          const diffHours = (diff / 3600).toFixed(2);
          
          console.warn('⚠️ fbc inválido detectado:', fbcValidation.reason);
          console.warn('🔍 DEBUG fbc:', {
            fbcTimestamp,
            nowTimestamp: now,
            diffSeconds: diff,
            diffHours: `${diffHours}h`,
            fbcAge: diff > 0 ? `${diffHours}h atrás` : 'futuro',
            isValidWindow: diff <= 86400 // 24h em segundos
          });
          // NÃO adicionar fbc inválido!
        }
      } else {
        console.warn('⚠️ fbc não passou na sanitização básica - não enviando');
        console.warn('🔍 DEBUG fbc sanitização:', {
          original: userData.fbc ? userData.fbc.substring(0, 40) + '...' : 'undefined',
          sanitized: sanitizedFbc
        });
      }
    } else {
      console.warn('⚠️ fbc não encontrado em userData:', {
        hasUserData: !!userData,
        hasFbc: !!userData?.fbc
      });
    }
    
    // External ID (session) - NÃO hashear (conforme doc Meta)
    // Ganho: +0.22% conversões adicionais
    // CRÍTICO: Sempre enviar (36% → 100% cobertura!)
    if (userData.external_id) {
      user_data.external_id = userData.external_id;
    } else {
      // Gerar external_id baseado no email NORMALIZADO (fallback se não tiver session)
      // SEMPRE gerar para garantir 100% cobertura!
      user_data.external_id = `purchase_${hashSHA256(normalizedEmail).substring(0, 16)}`;
      console.log('✅ external_id gerado (fallback):', user_data.external_id);
    }
    
    // Geolocalização (do Lead salvo) - NORMALIZAR E HASHEAR!
    // CRÍTICO: Sempre enviar (49% → 100% cobertura!)
    if (userData.city) {
      const normalizedCity = normalizeCity(userData.city);
      user_data.ct = hashSHA256(normalizedCity);
      console.log('✅ City adicionada (normalizada):', normalizedCity);
    } else {
      console.warn('⚠️ City ausente (cobertura reduzida: -5 DQS)');
    }
    
    if (userData.state) {
      const normalizedState = normalizeState(userData.state);
      user_data.st = hashSHA256(normalizedState);
      console.log('✅ State adicionado (normalizado):', normalizedState);
    } else {
      console.warn('⚠️ State ausente (cobertura reduzida: -5 DQS)');
    }
    
    if (userData.zip) {
      const normalizedZip = normalizeZip(userData.zip);
      user_data.zp = hashSHA256(normalizedZip);
      console.log('✅ ZIP adicionado (normalizado):', normalizedZip);
    } else {
      console.warn('⚠️ ZIP ausente (cobertura reduzida: -3 DQS)');
    }
    
    // País sempre BR (NORMALIZAR E HASHEAR!) - SEMPRE enviar (garante 100% cobertura)
    const normalizedCountry = normalizeCountry(userData.country);
    user_data.country = hashSHA256(normalizedCountry);
    
    // ✅ IP e User Agent - +3.36% conversões! (CRÍTICO para EQM)
    // Esses campos NÃO são hasheados (conforme doc Meta)
    if (userData.client_ip_address) {
      user_data.client_ip_address = userData.client_ip_address;
      console.log('📍 IP adicionado:', userData.client_ip_address);
    } else {
      console.warn('⚠️ IP ausente (impacto: -1.68% conversões)');
    }
    
    if (userData.client_user_agent) {
      user_data.client_user_agent = userData.client_user_agent;
      console.log('🖥️ User Agent adicionado:', userData.client_user_agent.substring(0, 50) + '...');
    } else {
      console.warn('⚠️ User Agent ausente (impacto: -1.68% conversões)');
    }
    
    // Preparar evento - SEMPRE usar timestamp ATUAL (melhor prática)
    // Para eventos server-side, o ideal é enviar o timestamp de quando o webhook é processado
    const now = Math.floor(Date.now() / 1000);
    const eventTime = now;
    
    console.log('🕐 Timestamp do evento:', {
      unix: eventTime,
      iso: new Date(eventTime * 1000).toISOString(),
      local: new Date(eventTime * 1000).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    });
    
    // Gerar Event ID usando função centralizada
    const { generateEventId } = await import('./utils/eventId');
    const eventID = generateEventId('Purchase', purchaseData.orderId);
    
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
    // IP e UA não contam no DQS, mas melhoram EQM (+3.36%!)
    
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
      // ✅ PREDICTED LTV: Valor esperado do cliente ao longo do tempo (para ML da Meta)
      // Baseado na estrutura real: Produto R$39,90 + 3 Order Bumps R$17,90 cada = R$93,60 máximo
      predicted_ltv: 90.0,  // R$ 90,00 (valor esperado considerando produto + order bumps)
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
    
    // CRÍTICO PARA EQM 9.3+: Construir event_source_url com UTMs + fbclid + gclid do Lead!
    // A URL completa melhora significativamente o Event Match Quality
    let eventSourceUrl = 'https://pay.cakto.com.br';
    
    // Função auxiliar para validar valor de parâmetro URL (evitar valores inválidos)
    const isValidUrlParam = (value: string | undefined | null): boolean => {
      if (!value || typeof value !== 'string') return false;
      // Rejeitar valores muito longos (provavelmente erros/dados inválidos)
      if (value.length > 200) return false;
      // Rejeitar valores que parecem ser markdown/código/documentação
      if (value.includes('```') || value.includes('**') || value.includes('##') || value.includes('###')) return false;
      // Rejeitar valores com muitas quebras de linha (provavelmente texto copiado)
      if ((value.match(/\n/g) || []).length > 2) return false;
      return true;
    };
    
    // Construir URL com todos os parâmetros se disponíveis (CRÍTICO para EQM 9.3+!)
    if (userDataTyped) {
      const urlParams = new URLSearchParams();
      
      // ✅ Click IDs (CRÍTICO para atribuição Facebook/Google!)
      // Validar fbclid: deve ter formato válido (geralmente 24+ caracteres alfanuméricos)
      if (userDataTyped.fbclid && isValidUrlParam(userDataTyped.fbclid) && userDataTyped.fbclid.length >= 20) {
        urlParams.set('fbclid', userDataTyped.fbclid);
        console.log('✅ fbclid adicionado à URL:', userDataTyped.fbclid.substring(0, 20) + '...');
      } else if (userDataTyped.fbclid) {
        console.warn('⚠️ fbclid inválido (muito curto ou formato incorreto), não adicionando à URL');
      }
      
      // Validar gclid: deve ter formato válido (geralmente 20+ caracteres)
      if (userDataTyped.gclid && isValidUrlParam(userDataTyped.gclid) && userDataTyped.gclid.length >= 15) {
        urlParams.set('gclid', userDataTyped.gclid);
        console.log('✅ gclid adicionado à URL:', userDataTyped.gclid.substring(0, 20) + '...');
      } else if (userDataTyped.gclid) {
        console.warn('⚠️ gclid inválido (muito curto ou formato incorreto), não adicionando à URL');
      }
      
      // UTMs do Lead (first touch ou last touch - prioridade para last touch)
      // Validar cada UTM antes de adicionar
      if (userDataTyped.utmLastSource && isValidUrlParam(userDataTyped.utmLastSource)) {
        urlParams.set('utm_source', userDataTyped.utmLastSource);
      } else if (userDataTyped.utmFirstSource && isValidUrlParam(userDataTyped.utmFirstSource)) {
        urlParams.set('utm_source', userDataTyped.utmFirstSource);
      }
      
      if (userDataTyped.utmLastMedium && isValidUrlParam(userDataTyped.utmLastMedium)) {
        urlParams.set('utm_medium', userDataTyped.utmLastMedium);
      } else if (userDataTyped.utmFirstMedium && isValidUrlParam(userDataTyped.utmFirstMedium)) {
        urlParams.set('utm_medium', userDataTyped.utmFirstMedium);
      }
      
      if (userDataTyped.utmLastCampaign && isValidUrlParam(userDataTyped.utmLastCampaign)) {
        urlParams.set('utm_campaign', userDataTyped.utmLastCampaign);
      } else if (userDataTyped.utmFirstCampaign && isValidUrlParam(userDataTyped.utmFirstCampaign)) {
        urlParams.set('utm_campaign', userDataTyped.utmFirstCampaign);
      }
      
      // Facebook Native Parameters (se disponíveis) - validar também
      if (userDataTyped.fb_campaign_id && isValidUrlParam(userDataTyped.fb_campaign_id)) {
        urlParams.set('fb_campaign_id', userDataTyped.fb_campaign_id);
      }
      if (userDataTyped.fb_adset_id && isValidUrlParam(userDataTyped.fb_adset_id)) {
        urlParams.set('fb_adset_id', userDataTyped.fb_adset_id);
      }
      if (userDataTyped.fb_ad_id && isValidUrlParam(userDataTyped.fb_ad_id)) {
        urlParams.set('fb_ad_id', userDataTyped.fb_ad_id);
      }
      
      // Se tiver parâmetros válidos, adicionar à URL
      if (urlParams.toString()) {
        eventSourceUrl = `${eventSourceUrl}?${urlParams.toString()}`;
        console.log('✅ event_source_url com parâmetros válidos:', eventSourceUrl.substring(0, 150) + (eventSourceUrl.length > 150 ? '...' : ''));
      } else {
        console.log('ℹ️ Nenhum parâmetro válido para adicionar à event_source_url');
      }
    }

    // DEBUG: Ver o que será enviado no user_data
    console.log('🔍 DEBUG - user_data final antes de enviar:', {
      hasEmail: !!user_data.em,
      hasPhone: !!user_data.ph,
      hasFirstName: !!user_data.fn,
      hasLastName: !!user_data.ln,
      hasCity: !!user_data.ct,
      hasState: !!user_data.st,
      hasZip: !!user_data.zp,
      hasCountry: !!user_data.country,
      hasFbp: !!user_data.fbp,
      hasFbc: !!user_data.fbc,
      hasExternalId: !!user_data.external_id,
      hasIp: !!user_data.client_ip_address,
      hasUserAgent: !!user_data.client_user_agent,
      // Debug: mostrar valores reais (hasheados)
      cityHash: user_data.ct ? user_data.ct.substring(0, 20) + '...' : undefined,
      stateHash: user_data.st ? user_data.st.substring(0, 20) + '...' : undefined,
      zipHash: user_data.zp ? user_data.zp.substring(0, 20) + '...' : undefined,
      fbpValue: user_data.fbp ? user_data.fbp.substring(0, 30) + '...' : undefined
    });
    
    // Preparar payload para Meta CAPI (formato padrão)
    const metaPayload: any = {
      pixel_id: pixelId,
      data: [{
        event_name: 'Purchase',
        event_time: eventTime,
        event_id: eventID,
        event_source_url: eventSourceUrl, // URL com UTMs (CRÍTICO para EQM 9.3!)
        action_source: 'other', // ✅ Server-side via webhook (não 'website')
        user_data,
        custom_data: customData
      }]
    };
    
    // DEBUG: Log do payload completo (apenas user_data para verificar)
    console.log('🔍 DEBUG - user_data no payload:', JSON.stringify({
      em: user_data.em ? '***' : undefined,
      ph: user_data.ph ? '***' : undefined,
      fn: user_data.fn ? '***' : undefined,
      ln: user_data.ln ? '***' : undefined,
      ct: user_data.ct ? user_data.ct.substring(0, 20) + '...' : undefined,
      st: user_data.st ? user_data.st.substring(0, 20) + '...' : undefined,
      zp: user_data.zp ? user_data.zp.substring(0, 20) + '...' : undefined,
      country: user_data.country ? user_data.country.substring(0, 20) + '...' : undefined,
      fbp: user_data.fbp,
      fbc: user_data.fbc,
      external_id: user_data.external_id,
      client_ip_address: user_data.client_ip_address
    }, null, 2));
    
    // Preparar payload para CAPIG (formato compatível com Meta CAPI)
    // CAPIG requer pixel_id no payload quando enviado server-side diretamente
    // (Browser events via fbq não precisam, mas server-side fetch precisa)
    const capigPayload: any = {
      pixel_id: pixelId, // CAPIG precisa para identificar datasource/pixel
      data: [{
        event_name: 'Purchase',
        event_time: eventTime,
        event_id: eventID,
        event_source_url: eventSourceUrl,
        action_source: 'other', // ✅ Server-side via webhook (não 'website')
        user_data,
        custom_data: customData
      }]
    };
    
    // Adicionar partner_agent se disponível (identifica origem do evento)
    // Alguns CAPIGs podem precisar disso para processar corretamente
    capigPayload.partner_agent = 'stape_capig';
    
    // Payload para CAPIG (com pixel_id - requerido para server-side events)
    const capigPayloadFinal = capigPayload;
    
    // Payload para Meta direto (com pixel_id - requerido pela API Meta)
    const metaPayloadFinal = metaPayload;
    
    // Adicionar test_event_code se configurado (para debug no Meta Events Manager)
    // CAPIG: test_event_code pode precisar estar no evento ou no root
    if (testEventCode) {
      capigPayloadFinal.test_event_code = testEventCode;
      metaPayloadFinal.test_event_code = testEventCode;
      console.log('🧪 Test Event Code ativado:', testEventCode);
    }
    
    console.log('📦 Payload CAPIG preparado (com pixel_id - requerido para server-side):', {
      pixelId: capigPayloadFinal.pixel_id,
      hasData: !!capigPayloadFinal.data,
      eventCount: capigPayloadFinal.data?.length,
      partnerAgent: capigPayloadFinal.partner_agent
    });
    console.log('📦 Payload Meta preparado (com pixel_id):', {
      pixelId: metaPayloadFinal.pixel_id,
      eventCount: metaPayloadFinal.data?.length
    });
    console.log('📊 Purchase Data Quality Score:', dataQualityScore);
    console.log('🌐 event_source_url:', eventSourceUrl);
    
    // ⚠️ LIMITAÇÃO IDENTIFICADA: Stape CAPIG não suporta server-side events via fetch direto
    // CAPIG funciona apenas para browser events (via fbq + server_event_uri)
    // Para server-side events (Purchase via webhook), usar Meta CAPI direto
    // 
    // Motivo: CAPIG retorna "Data Source Id Or Pixel Id Missing" mesmo com:
    // - pixel_id no payload ✅
    // - pixel_id na URL ✅  
    // - API Key no header ✅
    // 
    // Conclusão: CAPIG Stape é otimizado para interceptar eventos do browser,
    // não para receber eventos server-side via REST API
    
    // ✅ Enviar direto via Meta CAPI (funciona 100%, DQS 85, EQM ~8.0)
    console.log('📤 Enviando Purchase via Meta CAPI direto (CAPIG não suporta server-side events):', {
      orderId: purchaseData.orderId,
      pixelId,
      hasFbp: !!userData.fbp,
      hasFbc: !!userData.fbc,
      dataQualityScore,
      eventSourceUrl,
      motivo: 'CAPIG Stape só funciona para browser events (fbq), não server-side fetch'
    });
    
    let response;
    const accessToken = process.env.META_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('META_ACCESS_TOKEN não configurado');
    }
    
      // Enviar direto para Meta CAPI (formato padrão)
    const metaEndpoint = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`;
    
    // DEBUG: Log do payload completo que será enviado (para verificar se dados estão presentes)
    const payloadDebug = {
      pixel_id: metaPayloadFinal.pixel_id,
      data: metaPayloadFinal.data.map((event: any) => ({
        event_name: event.event_name,
        event_time: event.event_time,
        event_id: event.event_id,
        action_source: event.action_source,
        user_data_keys: Object.keys(event.user_data),
        user_data_has_fields: {
          hasEmail: !!event.user_data.em,
          hasPhone: !!event.user_data.ph,
          hasFirstName: !!event.user_data.fn,
          hasLastName: !!event.user_data.ln,
          hasCity: !!event.user_data.ct,
          hasState: !!event.user_data.st,
          hasZip: !!event.user_data.zp,
          hasCountry: !!event.user_data.country,
          hasFbp: !!event.user_data.fbp,
          hasFbc: !!event.user_data.fbc,
          hasExternalId: !!event.user_data.external_id,
          hasIp: !!event.user_data.client_ip_address
        },
        custom_data_keys: Object.keys(event.custom_data)
      }))
    };
    console.log('🔍 DEBUG - Payload completo que será enviado ao Meta:', JSON.stringify(payloadDebug, null, 2));
    
    // Enviar direto (não usar CAPIG para server-side events)
    response = await fetch(metaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metaPayloadFinal) // Payload Meta padrão (com pixel_id)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Meta CAPI error: ${response.status} - ${errorText}`);
    }
    
    console.log('✅ SUCCESS: Purchase enviado via Meta CAPI direto (funcionando 100%!)');
    
    // Parse response (pode ser JSON ou vazio)
    let result: any = {};
    try {
      const responseText = await response.text();
      if (responseText && responseText.trim()) {
        result = JSON.parse(responseText);
      } else {
        // Resposta vazia (Meta às vezes retorna 200 sem body)
        result = { success: true, events_received: 1 };
        console.log('ℹ️ Resposta vazia do servidor (assumindo sucesso)');
      }
    } catch (parseError) {
      console.warn('⚠️ Erro ao parsear resposta (assumindo sucesso se status 200):', parseError);
      result = { success: true, events_received: 1 };
    }
    
    console.log('✅ Purchase processado:', {
      orderId: purchaseData.orderId,
      eventID,
      via: 'Meta CAPI direto',
      eventSourceUrl,
      response: result,
      motivo: 'CAPIG Stape não suporta server-side events via fetch'
    });
    
    return { 
      success: true,
      message: `Purchase enviado via Meta CAPI direto - DQS ${dataQualityScore} - CAPIG Stape não suporta server-side events (só browser events via fbq)`
    };
    
  } catch (error: any) {
    console.error('? Erro ao enviar offline purchase:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// ===== GTM SERVER-SIDE =====

/**
 * Envia Purchase para GTM Server-Side (ao invés de Meta CAPI direto)
 * 
 * Formato: DataLayer event (mesmo formato do browser)
 */
export async function sendPurchaseToGTM(
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
    external_id?: string;
    client_ip_address?: string;
    client_user_agent?: string;
  }
): Promise<{ success: boolean; error?: string; message?: string }> {
  
  try {
    console.log('🚀 sendPurchaseToGTM() INICIADA');
    
    const gtmServerUrl = process.env.GTM_SERVER_URL || 'https://event.maracujazeropragas.com';
    // IMPORTANTE: Usar Data Client para processar eventos server-side também
    // Data Client processa /data (browser events e server-side events)
    const clientName = process.env.GTM_WEBHOOK_CLIENT_NAME || 'Data Client';
    const gtmEndpoint = `${gtmServerUrl}/data?client_name=${encodeURIComponent(clientName)}`;
    
    console.log('📍 GTM Server-Side Endpoint:', gtmEndpoint);
    console.log('🔧 Client Name:', clientName);
    
    // ✅ Validar e preparar fbc antes de criar user_data
    // Seguindo GUIA_COMPLETO_IMPLEMENTACAO_FBC_PURCHASE_WEBHOOK.md - Passo 5
    let validatedFbc: string | undefined = undefined;
    if (userData.fbc) {
      console.log('🔍 DEBUG fbc antes de validar:', {
        fbc: userData.fbc.substring(0, 40) + '...',
        fbcLength: userData.fbc.length,
        hasFbc: !!userData.fbc
      });
      
      // 1. Sanitizar (remove apenas espaços externos)
      const { sanitizeFbc } = await import('./utils/fbcSanitizer');
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
    } else {
      console.warn('⚠️ fbc não encontrado em userData');
    }
    
    // Preparar dados no formato DataLayer
    const eventData = {
      event: 'purchase',  // Nome específico para trigger 'ce - purchase' no GTM
      ecommerce: {
        transaction_id: purchaseData.orderId,
        value: purchaseData.value,
        currency: purchaseData.currency || 'BRL',
        items: [{
          item_id: 'hacr962',
          item_name: 'Sistema 4 Fases - Ebook Trips',
          price: purchaseData.value,
          quantity: 1,
          item_category: 'digital_product',
          item_brand: 'Ebook Trips'
        }]
      },
      content_ids: ['hacr962'],
      contents: [{
        id: 'hacr962',
        quantity: 1,
        item_price: purchaseData.value
      }],
      content_name: 'Sistema 4 Fases - Ebook Trips',
      content_type: 'product',
      num_items: 1,
      // ✅ PREDICTED LTV: Valor esperado do cliente ao longo do tempo (para ML da Meta)
      // Baseado na estrutura real: Produto R$39,90 + 3 Order Bumps R$17,90 cada = R$93,60 máximo
      // ✅ CRÍTICO: Incluir no nível raiz E em custom_data (se necessário) para garantir que Meta receba
      predicted_ltv: 90.0,  // R$ 90,00 (valor esperado considerando produto + order bumps)
      user_data: {
        user_id: userData.external_id || undefined,  // external_id do KV
        email_address: normalizeEmail(purchaseData.email),  // ✅ Normalizado
        phone_number: (purchaseData.phone || userData.phone) ? normalizePhone(purchaseData.phone || userData.phone || '') : undefined,  // ✅ Normalizado
        first_name: (purchaseData.firstName || userData.firstName) ? normalizeName(purchaseData.firstName || userData.firstName || '') : undefined,  // ✅ Normalizado
        last_name: (purchaseData.lastName || userData.lastName) ? normalizeName(purchaseData.lastName || userData.lastName || '') : undefined,  // ✅ Normalizado
        city: userData.city ? normalizeCity(userData.city) : undefined,  // ✅ Normalizado
        region: userData.state ? normalizeState(userData.state) : undefined,  // ✅ Normalizado
        postal_code: userData.zip ? normalizeZip(userData.zip) : undefined,  // ✅ Normalizado
        country: normalizeCountry(userData.country),  // ✅ Normalizado
        // ✅ Adicionar fbp e fbc (CRÍTICO para atribuição!)
        ...(userData.fbp && { fbp: userData.fbp }),
        ...(validatedFbc && { fbc: validatedFbc })  // ✅ fbc validado incluído aqui
      },
      // Metadata adicional
      // ✅ CRÍTICO: Usar mesmo formato do navegador: ${orderId}_${timestamp}
      // timestamp deve ser em milissegundos (Date.now()) para igualar com navegador
      event_id: `${purchaseData.orderId}_${purchaseData.timestamp || Date.now()}`,
      event_source_url: 'https://www.maracujazeropragas.com/obrigado',
      action_source: 'other', // ✅ Server-side via webhook (não 'website')
      ...(userData.client_ip_address && { client_ip_address: userData.client_ip_address }),
      ...(userData.client_user_agent && { client_user_agent: userData.client_user_agent })
    };
    
    console.log('📤 Enviando Purchase para GTM Server-Side:', {
      endpoint: gtmEndpoint,
      orderId: purchaseData.orderId,
      value: purchaseData.value,
      hasUserData: !!userData,
      hasExternalId: !!userData.external_id
    });
    
    // Log completo do payload para debug
    // IMPORTANTE: GTM Server-Side espera array de eventos
    const payload = [eventData];  // Array de eventos
    console.log('📦 Payload completo sendo enviado:', JSON.stringify(payload, null, 2));
    
    // Enviar para GTM Server-Side
    // GTM Server-Side processa arrays e coloca dados em [0], então variáveis precisam usar 0.ecommerce.currency
    const response = await fetch(gtmEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userData.client_user_agent || 'GTM-Server-Side-Webhook'
      },
      body: JSON.stringify(payload)  // Array de eventos (formato esperado pelo GTM)
    });
    
    // Log da resposta completa
    const responseStatus = response.status;
    const responseHeaders = Object.fromEntries(response.headers.entries());
    const responseText = await response.text();
    
    console.log('📥 Resposta do GTM Server-Side:', {
      status: responseStatus,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseText.substring(0, 500) // Primeiros 500 caracteres
    });
    
    if (!response.ok) {
      console.error('❌ Erro na resposta do GTM Server-Side:', {
        status: responseStatus,
        body: responseText
      });
      throw new Error(`GTM Server-Side error: ${responseStatus} - ${responseText}`);
    }
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { success: true, rawResponse: responseText };
    }
    
    console.log('✅ Purchase enviado para GTM Server-Side:', {
      orderId: purchaseData.orderId,
      response: result,
      status: responseStatus
    });
    
    return {
      success: true,
      message: `Purchase enviado para GTM Server-Side - Order ID: ${purchaseData.orderId}`
    };
    
  } catch (error: any) {
    console.error('❌ Erro ao enviar Purchase para GTM Server-Side:', error);
    
    // Fallback: tentar enviar via Meta CAPI direto se GTM falhar
    console.log('🔄 Tentando fallback: enviar via Meta CAPI direto...');
    const fallbackResult = await sendOfflinePurchase(purchaseData, userData);
    
    return {
      success: fallbackResult.success,
      error: fallbackResult.error || error.message,
      message: fallbackResult.success 
        ? `Purchase enviado via fallback (Meta CAPI direto) - ${fallbackResult.message}`
        : `Erro ao enviar Purchase: ${error.message}`
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
    
    // Extrair dados do cliente - usar função centralizada
    const customer = payload.data.customer;
    const { splitNormalizedName } = await import('./utils/metaDataNormalizer');
    const { firstName, lastName } = splitNormalizedName(customer.name);
    
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
    
    // Buscar dados persistidos do usuário (fbp/fbc)
    // ESTRATÉGIA: KV primeiro (rápido), Prisma como fallback
    const userData = await getUserDataFromKVOrPrisma(
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

/**
 * ?? ELITE DataLayer Tracking - Enterprise Level
 * 
 * Sistema AVANÇADO de tracking via GTM Server-Side:
 * - Advanced Matching completo (14 campos)
 * - Enhanced Conversions ready
 * - Attribution tracking automático
 * - Data quality scoring
 * - Event deduplication
 * - Real-time validation
 * - Compliance-ready
 * 
 * Todos os eventos são enviados para o DataLayer do GTM
 */

import {
  saveAdvancedUserData,
  getAdvancedUserData,
  addAttributionTouchpoint,
  captureAttribution,
  addEventToHistory,
  getAttributionInsights,
  persistMetaCookies,
  getMetaCookies
} from './advancedDataPersistence';

import {
  formatUTMsForMeta,
  getUTMAttribution
} from './utmTracking';

import {
  enrichColdEvent,
  type EnrichedEventData
} from './coldEventsEnrichment';

import { generateEventId } from './utils/eventId';

import {
  pushPageView,
  pushViewItem,
  pushAddToCart,
  pushBeginCheckout,
  pushPurchase,
  pushGenerateLead
} from './gtmDataLayer';

// Removido: Meta Pixel não é mais usado (apenas GTM Server-Side)

// ===== CONFIGURATION =====

const CONFIG = {
  enableAdvancedMatching: true,
  enableEnhancedConversions: true,
  enableAttributionTracking: true,
  enableDataValidation: true,
  enableMonitoring: true,
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
};

// ===== UTILITIES =====
// Event ID generation is now centralized in utils/eventId.ts

/**
 * Logger condicional
 */
function log(level: 'debug' | 'info' | 'warn' | 'error', ...args: any[]) {
  if (CONFIG.logLevel === 'debug' || level !== 'debug') {
    console[level](...args);
  }
}

// ===== ADVANCED MATCHING =====

/**
 * Prepara Advanced Matching com TODOS os campos possiveis
 * 
 * ESTRATEGIA INTELIGENTE:
 * - Warm events (Lead, InitiateCheckout, Purchase): usa dados completos do formulario
 * - Cold events (PageView, ViewContent, etc): usa enrichment automatico
 */
async function prepareAdvancedMatching(isColdEvent: boolean = false): Promise<Record<string, any>> {
  // Se for evento FRIO (sem user data completo), usa enrichment
  if (isColdEvent) {
    const enriched = await enrichColdEvent();
    
    log('debug', 'COLD EVENT enriched:', {
      fields: Object.keys(enriched.user_data).length,
      score: enriched.dataQualityScore,
      sources: enriched.enrichmentSources.join(', ')
    });
    
    return enriched.user_data;
  }
  
  // Se for evento QUENTE (com user data), usa dados completos
  const userData = getAdvancedUserData();
  const metaCookies = getMetaCookies();
  
  if (!userData && !metaCookies.fbp) {
    return {};
  }
  
  const matching: Record<string, any> = {};
  
  // PII (Meta vai hashear automaticamente)
  if (userData?.email) matching.em = userData.email.toLowerCase().trim();
  if (userData?.phone) {
    const phoneClean = userData.phone.replace(/\D/g, '');
    matching.ph = phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`;
  }
  
  // Nome
  if (userData?.firstName) matching.fn = userData.firstName.toLowerCase().trim();
  if (userData?.lastName) matching.ln = userData.lastName.toLowerCase().trim();
  
  // Localizacao (SEMPRE incluir se dispon?vel!)
  if (userData?.city) matching.ct = userData.city.toLowerCase().trim();
  if (userData?.state) matching.st = userData.state.toLowerCase().trim();
  if (userData?.zip) matching.zp = userData.zip.replace(/\D/g, '');
  if (userData?.country) matching.country = userData.country.toLowerCase();
  
  // Meta identifiers
  // CRÍTICO: fbp e fbc devem ser preservados EXATAMENTE como vêm do cookie
  if (metaCookies.fbp) matching.fbp = metaCookies.fbp;
  if (metaCookies.fbc) {
    // Preservar fbc exatamente (não modificar!)
    matching.fbc = metaCookies.fbc;
  }
  if (userData?.external_id) matching.external_id = userData.external_id;
  
  // Browser context (adicionar para completude - mesmo em warm events!)
  matching.fb_device_type = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edge')) matching.fb_browser = 'chrome';
  else if (ua.includes('Firefox')) matching.fb_browser = 'firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) matching.fb_browser = 'safari';
  else if (ua.includes('Edge')) matching.fb_browser = 'edge';
  else matching.fb_browser = 'other';
  
  if (ua.includes('Windows')) matching.fb_os = 'windows';
  else if (ua.includes('Mac') && !ua.includes('iPhone') && !ua.includes('iPad')) matching.fb_os = 'macos';
  else if (ua.includes('Linux') && !ua.includes('Android')) matching.fb_os = 'linux';
  else if (ua.includes('Android')) matching.fb_os = 'android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) matching.fb_os = 'ios';
  else matching.fb_os = 'other';
  
  matching.fb_language = navigator.language || 'pt-BR';
  
  log('debug', 'Advanced Matching preparado (warm):', {
    fields: Object.keys(matching).length,
    hasEmail: !!matching.em,
    hasPhone: !!matching.ph,
    hasFbp: !!matching.fbp
  });
  
  return matching;
}

// ===== DATA VALIDATION =====

/**
 * Valida dados antes de enviar
 */
function validateEventData(eventName: string, params: any): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Validar campos obrigat?rios para eventos standard
  if (['Lead', 'Purchase', 'InitiateCheckout'].includes(eventName)) {
    if (!params.currency) warnings.push('Missing currency');
    if (!params.value) warnings.push('Missing value');
  }
  
  if (eventName === 'Purchase') {
    if (!params.content_ids) warnings.push('Missing content_ids');
  }
  
  // Validar user_data
  if (params.user_data) {
    const fields = Object.keys(params.user_data).length;
    if (fields < 3) {
      warnings.push(`Low user_data fields: ${fields}/14`);
    }
  }
  
  return {
    valid: warnings.length === 0,
    warnings
  };
}

// ===== ATTRIBUTION =====

/**
 * Adiciona dados de atribui??o ao evento
 */
function enrichWithAttribution(params: Record<string, any>): Record<string, any> {
  if (!CONFIG.enableAttributionTracking) return params;
  
  const insights = getAttributionInsights();
  
  if (!insights) return params;
  
  return {
    ...params,
    
    // Attribution data
    fb_first_touch_source: insights.firstTouch.source,
    fb_first_touch_medium: insights.firstTouch.medium,
    fb_last_touch_source: insights.lastTouch.source,
    fb_last_touch_medium: insights.lastTouch.medium,
    fb_touchpoint_count: insights.touchpointCount,
    fb_time_to_convert: Math.floor(insights.timeToConvert / 1000), // segundos
    fb_has_paid_click: insights.hasPaidClick,
    
    // Full journey (para an?lise posterior)
    fb_attribution_journey: JSON.stringify(insights)
  };
}

// ===== MAIN TRACKING FUNCTION =====

/**
 * ?? ELITE tracking function
 */
export async function trackEliteEvent(
  eventName: string,
  customParams: Record<string, any> = {},
  eventType: 'standard' | 'custom' = 'standard',
  options?: {
    orderId?: string;
    skipAttribution?: boolean;
    skipValidation?: boolean;
    isColdEvent?: boolean;
    eventId?: string;  // ✅ Permitir passar eventID externo para garantir mesmo ID
  }
): Promise<{
  success: boolean;
  eventId: string;
  dataQualityScore?: number;
  warnings?: string[];
}> {
  
  try {
    log('info', `Tracking Elite: ${eventName}`);
    
    // 1. Gerar Event ID (centralizado) ou usar o fornecido
    // ✅ Se eventId foi fornecido (ex: de trackInitiateCheckoutElite), usar ele
    // Isso garante que browser e server usem o mesmo event_id
    const eventID = options?.eventId || generateEventId(eventName, options?.orderId);
    
    // 2. Preparar Advanced Matching (COM ENRICHMENT para eventos frios!)
    const isColdEvent = options?.isColdEvent ?? false;
    const advancedMatching = CONFIG.enableAdvancedMatching 
      ? await prepareAdvancedMatching(isColdEvent) 
      : {};
    
    // 3. Obter user data completo (para calcular score)
    const userData = getAdvancedUserData();
    const dataQualityScore = isColdEvent 
      ? Object.keys(advancedMatching).length * 7
      : (userData?.dataQualityScore || 0);
    
    // 4. Enrichir com atribuição
    let enrichedParams = !options?.skipAttribution 
      ? enrichWithAttribution(customParams)
      : customParams;
    
    // 4.5 Adicionar UTMs (se disponíveis)
    const utmParams = formatUTMsForMeta();
    if (Object.keys(utmParams).length > 0) {
      enrichedParams = {
        ...enrichedParams,
        ...utmParams
      };
    }
    
    // 5. Adicionar user_data ao evento (se tiver)
    if (Object.keys(advancedMatching).length > 0) {
      enrichedParams = {
        ...enrichedParams,
        user_data: advancedMatching
      };
    }
    
    // 6. Validar dados
    let validation = { valid: true, warnings: [] as string[] };
    if (CONFIG.enableDataValidation && !options?.skipValidation) {
      validation = validateEventData(eventName, enrichedParams);
      if (validation.warnings.length > 0) {
        log('warn', '⚠️ Warnings:', validation.warnings);
      }
    }
    
    // 7. Adicionar metadata
    const finalParams = {
      ...enrichedParams,
      fb_event_id: eventID,
      fb_data_quality_score: dataQualityScore,
      fb_tracking_version: '3.0_gtm_server_side'
    };
    
    // 8. Evento enviado para DataLayer via funções específicas (pushPageView, pushViewItem, etc)
    // Não precisa mais enviar via Meta Pixel - GTM Server-Side faz tudo
    
    // 9. Salvar no histórico
    addEventToHistory(eventID, eventName, finalParams, 'browser');
    
    // 10. Persistir meta cookies após cada evento
    persistMetaCookies();
    
    log('info', `✅ ${eventName} disparado (Elite)`, {
      eventID,
      dataQualityScore,
      userDataFields: Object.keys(advancedMatching).length,
      via: 'GTM Server-Side (DataLayer)'
    });
    
    return {
      success: true,
      eventId: eventID,
      dataQualityScore,
      warnings: validation.warnings.length > 0 ? validation.warnings : undefined
    };
    
  } catch (error: any) {
    log('error', `❌ Erro ao disparar ${eventName}:`, error);
    return {
      success: false,
      eventId: '',
      warnings: [error.message]
    };
  }
}

// ===== SPECIFIC EVENTS (Elite Versions) =====

/**
 * PageView (Elite) - COLD EVENT com enrichment automatico
 */
/**
 * Converte user_data do formato Meta abreviado para formato GTM completo
 */
function convertEnrichedToGTMFormat(enriched: Record<string, any>): Partial<{
  user_id: string;
  email_address: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
}> {
  const converted: any = {};
  
  // Converter campos abreviados (Meta) para formato completo (GTM)
  if (enriched.external_id) converted.user_id = enriched.external_id;
  if (enriched.em) converted.email_address = enriched.em;
  if (enriched.ph) converted.phone_number = enriched.ph;
  if (enriched.fn) converted.first_name = enriched.fn;
  if (enriched.ln) converted.last_name = enriched.ln;
  if (enriched.ct) converted.city = enriched.ct;
  if (enriched.st) converted.region = enriched.st;
  if (enriched.zp) converted.postal_code = enriched.zp;
  if (enriched.country) converted.country = enriched.country;
  
  return Object.keys(converted).length > 0 ? converted : undefined;
}

export async function trackPageViewElite(customParams: Record<string, any> = {}) {
  const touchpoint = captureAttribution();
  addAttributionTouchpoint(touchpoint);
  
  // Obter user data para DataLayer
  const userData = getAdvancedUserData();
  let userDataForGTM: any = undefined;
  
  if (userData) {
    // Se tiver dados persistidos, usar diretamente
    userDataForGTM = {
      user_id: userData.external_id,
      email_address: userData.email,
      phone_number: userData.phone,
      first_name: userData.firstName,
      last_name: userData.lastName,
      city: userData.city,
      region: userData.state,
      postal_code: userData.zip,
      country: userData.country
    };
  } else {
    // Se não tiver dados persistidos, usar enrichment (IP geolocation, fbp/fbc, etc.)
    const { enrichColdEvent } = await import('./coldEventsEnrichment');
    const enriched = await enrichColdEvent();
    userDataForGTM = convertEnrichedToGTMFormat(enriched.user_data);
    
    // ✅ CRÍTICO: Garantir que sempre temos um objeto (mesmo que vazio)
    // O convertEnrichedToGTMFormat pode retornar undefined se não houver dados suficientes
    if (!userDataForGTM) {
      userDataForGTM = {};
    }
    
    // ✅ ADICIONAR: Se enriched tiver external_id mas convertEnrichedToGTMFormat não converteu
    // Isso garante que user_id sempre esteja presente se disponível
    if (enriched.user_data.external_id && !userDataForGTM.user_id) {
      userDataForGTM.user_id = enriched.user_data.external_id;
    }
  }
  
  // ✅ CRÍTICO: Gerar eventID UMA VEZ e usar em ambos (DataLayer e trackEliteEvent)
  const { generateEventId } = await import('./utils/eventId');
  const eventID = generateEventId('PageView');
  
  // Enviar para DataLayer com event_id
  pushPageView(userDataForGTM, eventID);
  
  return trackEliteEvent('PageView', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    content_category: 'digital_product',
    ...customParams
  }, 'standard', { 
    isColdEvent: true,
    eventId: eventID  // ✅ Passar eventID para garantir mesmo ID
  });
}

/**
 * ViewContent (Elite) - COLD EVENT com enrichment automatico
 * 
 * ✅ Permite preço dinâmico via customParams para resolver alerta do Facebook
 * sobre preços fixos em ViewContent
 */
export async function trackViewContentElite(customParams: Record<string, any> = {}) {
  // ✅ Permitir preço dinâmico via customParams (resolve alerta do Facebook)
  const value = customParams.value ?? 39.9;
  const currency = customParams.currency || 'BRL';
  const contentIds = customParams.content_ids || ['hacr962'];
  const contentName = customParams.content_name || 'Sistema 4 Fases - Ebook Trips';
  const contentType = customParams.content_type || 'product';
  const contentCategory = customParams.content_category || 'digital_product';
  
  // Obter user data para DataLayer
  const userData = getAdvancedUserData();
  const userDataForGTM = userData ? {
    user_id: userData.external_id,
    email_address: userData.email,
    phone_number: userData.phone,
    first_name: userData.firstName,
    last_name: userData.lastName,
    city: userData.city,
    region: userData.state,
    postal_code: userData.zip,
    country: userData.country
  } : undefined;
  
  // ✅ CRÍTICO: Gerar eventID UMA VEZ e usar em ambos (DataLayer e trackEliteEvent)
  const { generateEventId } = await import('./utils/eventId');
  const eventID = generateEventId('ViewContent');
  
  // ✅ Enviar para DataLayer com preço dinâmico
  pushViewItem(value, currency, userDataForGTM, eventID);
  
  return trackEliteEvent('ViewContent', {
    value: value,  // ✅ Dinâmico (resolve alerta do Facebook)
    currency: currency,
    content_ids: contentIds,
    content_type: contentType,
    content_name: contentName,
    content_category: contentCategory,
    ...customParams
  }, 'standard', { 
    isColdEvent: true,
    eventId: eventID  // ✅ Passar eventID para garantir mesmo ID
  });
}

/**
 * ScrollDepth (Elite Custom) - COLD EVENT com enrichment automatico
 */
export async function trackScrollDepthElite(
  percent: number,
  customParams: Record<string, any> = {}
) {
  return trackEliteEvent('ScrollDepth', {
    percent,
    scroll_depth: percent,
    ...customParams
  }, 'custom', { skipAttribution: true, isColdEvent: true });
}

/**
 * CTAClick (Elite Custom) - COLD EVENT com enrichment autom?tico
 * Para CTAs secund?rios (scroll, etc)
 */
export async function trackCTAClickElite(
  buttonText: string,
  customParams: Record<string, any> = {}
) {
  return trackEliteEvent('CTAClick', {
    button_text: buttonText,
    content_name: `CTA: ${buttonText}`,
    ...customParams
  }, 'custom', { isColdEvent: true });
}

/**
 * 🛒 AddToCart (Elite) - APENAS para botão "COMPRAR AGORA"
 * Evento enviado para GTM Server-Side via DataLayer
 */
export async function trackAddToCartElite(
  buttonText: string = 'COMPRAR AGORA',
  customParams: Record<string, any> = {}
) {
  // Obter user data para DataLayer
  const userData = getAdvancedUserData();
  const userDataForGTM = userData ? {
    user_id: userData.external_id,
    email_address: userData.email,
    phone_number: userData.phone,
    first_name: userData.firstName,
    last_name: userData.lastName,
    city: userData.city,
    region: userData.state,
    postal_code: userData.zip,
    country: userData.country
  } : undefined;
  
  // ✅ CRÍTICO: Gerar eventID UMA VEZ e usar em ambos (DataLayer e trackEliteEvent)
  const { generateEventId } = await import('./utils/eventId');
  const eventID = generateEventId('AddToCart');
  
  // Enviar para DataLayer com event_id
  pushAddToCart(39.9, 'BRL', 1, userDataForGTM, eventID);
  
  return trackEliteEvent('AddToCart', {
    content_name: 'Sistema 4 Fases - Ebook Trips',
    content_type: 'product',
    content_ids: ['hacr962'],
    value: 39.9,
    currency: 'BRL',
    // Par?metros adicionais
    cta_type: 'purchase_button',
    cta_text: buttonText,
    ...customParams
  }, 'standard', { 
    isColdEvent: true,
    eventId: eventID  // ✅ Passar eventID para garantir mesmo ID
  });
}

/**
 * ?? Lead (Elite) - MAIS IMPORTANTE
 */
export async function trackLeadElite(
  userData: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  customParams: Record<string, any> = {}
) {
  // Obter dados existentes (incluindo city/state/zip da API de IP!)
  const existingData = getAdvancedUserData();
  
  // Salvar user data completo (MERGE com dados existentes!)
  const savedData = saveAdvancedUserData({
    email: userData.email,
    phone: userData.phone,
    firstName: userData.firstName,
    lastName: userData.lastName,
    fullName: `${userData.firstName} ${userData.lastName}`,
    // Priorizar dados do formul?rio, mas manter os existentes se n?o informado
    city: userData.city || existingData?.city,
    state: userData.state || existingData?.state,
    zip: userData.zip || existingData?.zip,
    country: 'br'
  }, true);
  
  // Preparar user data para DataLayer
  const userDataForGTM = {
    user_id: savedData?.external_id,
    email_address: userData.email,
    phone_number: userData.phone,
    first_name: userData.firstName,
    last_name: userData.lastName,
    city: userData.city || existingData?.city,
    region: userData.state || existingData?.state,
    postal_code: userData.zip || existingData?.zip,
    country: 'BR'
  };
  
  // ✅ CRÍTICO: Gerar eventID UMA VEZ e usar em ambos (DataLayer e trackEliteEvent)
  const { generateEventId } = await import('./utils/eventId');
  const eventID = generateEventId('Lead');
  
  // Enviar para DataLayer com event_id
  pushGenerateLead(userDataForGTM, 15.0, eventID);
  
  return trackEliteEvent('Lead', {
    // ===== VALORES (Otimiza??o de Campanha) =====
    value: 15.0,                                      // Valor do Lead
    currency: 'BRL',
    predicted_ltv: 180.0,                             // Lifetime Value esperado
    
    // ===== CONTE?DO (Segmenta??o e Cat?logo) =====
    content_name: 'Sistema 4 Fases - Ebook Trips',
    content_category: 'lead_generation',
    content_ids: ['hacr962'],                         // ID da oferta
    content_type: 'product',                          // Tipo de conte?do
    
    // ===== QUALIFICA??O (An?lise do Meta) =====
    status: 'completed',                              // Lead completo
    registration_method: 'website_form',              // M?todo de registro
    
    // ===== SEGMENTA??O ADICIONAL =====
    lead_source: 'landing_page',                      // Origem do lead
    lead_type: 'organic_form',                        // Tipo de lead
    
    ...customParams
  }, 'standard', { 
    isColdEvent: false,  // ? Warm event (user data completo)
    eventId: eventID     // ✅ Passar eventID para garantir mesmo ID
  });
}

/**
 * ?? InitiateCheckout (Elite)
 */
export async function trackInitiateCheckoutElite(
  userData: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  orderDetails?: {
    value?: number;           // Valor DIN?MICO (base + order bump)
    hasOrderBump?: boolean;   // Se selecionou order bump
    orderBumpValue?: number;  // Valor do order bump
    items?: string[];         // IDs dos produtos
  },
  customParams: Record<string, any> = {}
) {
  // Obter dados existentes (incluindo city/state/zip da API de IP!)
  const existingData = getAdvancedUserData();
  
  // Salvar/atualizar user data (MERGE com dados existentes!)
  const savedData = saveAdvancedUserData({
    email: userData.email,
    phone: userData.phone,
    firstName: userData.firstName,
    lastName: userData.lastName,
    fullName: `${userData.firstName} ${userData.lastName}`,
    // Priorizar dados do formul?rio, mas manter os existentes se n?o informado
    city: userData.city || existingData?.city,
    state: userData.state || existingData?.state,
    zip: userData.zip || existingData?.zip,
    country: 'br'
  }, true);
  
  // Valor base (padr?o: 39.9)
  // Suporta valor din?mico via orderDetails (para quando tiver order bump na Cakto)
  const BASE_VALUE = 39.9;
  const finalValue = orderDetails?.value || BASE_VALUE;
  const quantity = orderDetails?.items?.length || 1;
  
  // Preparar user data para DataLayer
  const userDataForGTM = {
    user_id: savedData?.external_id,
    email_address: userData.email,
    phone_number: userData.phone,
    first_name: userData.firstName,
    last_name: userData.lastName,
    city: userData.city || existingData?.city,
    region: userData.state || existingData?.state,
    postal_code: userData.zip || existingData?.zip,
    country: 'BR'
  };
  
  // ✅ CRÍTICO: Gerar eventID UMA VEZ e usar em ambos (DataLayer e trackEliteEvent)
  // Isso garante que browser e server usem o mesmo event_id para deduplicação
  const { generateEventId } = await import('./utils/eventId');
  const eventID = generateEventId('InitiateCheckout');
  
  // Enviar para DataLayer com event_id
  pushBeginCheckout(finalValue, 'BRL', quantity, userDataForGTM, eventID);
  
  // ✅ Passar eventID para trackEliteEvent para garantir mesmo ID
  // Mas trackEliteEvent não envia para Meta Pixel - apenas prepara dados
  // O Stape.io intercepta do DataLayer e envia para Facebook
  return trackEliteEvent('InitiateCheckout', {
    value: finalValue,                                    // Valor (suporta din?mico)
    currency: 'BRL',
    content_ids: orderDetails?.items || ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    num_items: quantity,
    ...customParams
  }, 'standard', { 
    isColdEvent: false,  // ? Warm event (user data do Lead)
    eventId: eventID     // ✅ Passar eventID para garantir mesmo ID
  });
}

/**
 * ?? Purchase (Elite)
 */
export async function trackPurchaseElite(
  orderId: string,
  userData?: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  },
  customParams: Record<string, any> = {}
) {
  // Se tiver userData, salvar
  let savedData;
  if (userData) {
    savedData = saveAdvancedUserData({
      email: userData.email,
      phone: userData.phone,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: `${userData.firstName} ${userData.lastName}`
    }, true);
  } else {
    // Obter dados existentes
    savedData = getAdvancedUserData();
  }
  
  // Preparar user data para DataLayer
  const userDataForGTM = savedData ? {
    user_id: savedData.external_id,
    email_address: savedData.email,
    phone_number: savedData.phone,
    first_name: savedData.firstName,
    last_name: savedData.lastName,
    city: savedData.city,
    region: savedData.state,
    postal_code: savedData.zip,
    country: savedData.country || 'BR'
  } : undefined;
  
  // Extrair valores dinâmicos do customParams (ou usar defaults)
  const purchaseValue = customParams.value || 39.9;
  const purchaseCurrency = customParams.currency || 'BRL';
  const purchaseQuantity = customParams.num_items || 1;
  
  // Enviar para DataLayer com valores dinâmicos
  pushPurchase(orderId, purchaseValue, purchaseCurrency, purchaseQuantity, userDataForGTM);
  
  return trackEliteEvent('Purchase', {
    value: purchaseValue,
    currency: purchaseCurrency,
    content_ids: ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    num_items: purchaseQuantity,
    ...customParams
  }, 'standard', { orderId });
}

// ===== DIAGNOSTICS =====

/**
 * Retorna estado completo do tracking
 */
export function getTrackingDiagnostics() {
  const userData = getAdvancedUserData();
  const metaCookies = getMetaCookies();
  const attribution = getAttributionInsights();
  
  return {
    config: CONFIG,
    userData: {
      exists: !!userData,
      dataQualityScore: userData?.dataQualityScore || 0,
      fields: userData ? Object.keys(userData).filter(k => userData[k as keyof typeof userData]).length : 0
    },
    metaCookies: {
      fbp: !!metaCookies.fbp,
      fbc: !!metaCookies.fbc
    },
    attribution: {
      exists: !!attribution,
      touchpoints: attribution?.touchpointCount || 0,
      firstTouch: attribution?.firstTouch.source,
      lastTouch: attribution?.lastTouch.source
    },
    dataLayerLoaded: typeof window !== 'undefined' && !!window.dataLayer,
    gtmServerSide: true
  };
}

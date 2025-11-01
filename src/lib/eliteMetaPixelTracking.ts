/**
 * ?? ELITE Meta Pixel Tracking - Enterprise Level
 * 
 * Sistema MAIS AVAN?ADO de tracking via Stape CAPIG Gateway:
 * - Advanced Matching completo (14 campos)
 * - Enhanced Conversions ready
 * - Attribution tracking autom?tico
 * - Data quality scoring
 * - Event deduplication
 * - Real-time validation
 * - Compliance-ready
 * 
 * MANT?M: Fluxograma CAPIG Gateway (dual tracking)
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

declare global {
  interface Window {
    fbq: (command: string, eventName: string, parameters?: any, options?: any) => void;
  }
}

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

/**
 * Gera Event ID ?nico (enterprise-grade)
 */
function generateEventId(eventName: string, orderId?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 12);
  const prefix = orderId ? `${eventName}_${orderId}` : eventName;
  return `${prefix}_${timestamp}_${random}`;
}

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
  if (metaCookies.fbp) matching.fbp = metaCookies.fbp;
  if (metaCookies.fbc) matching.fbc = metaCookies.fbc;
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
  }
): Promise<{
  success: boolean;
  eventId: string;
  dataQualityScore?: number;
  warnings?: string[];
}> {
  
  try {
    log('info', `Tracking Elite: ${eventName}`);
    
    // Verificar se Meta Pixel esta carregado
    if (typeof window === 'undefined' || !window.fbq) {
      log('warn', 'Meta Pixel nao carregado');
      return { success: false, eventId: '', warnings: ['Meta Pixel nao carregado'] };
    }
    
    // 1. Gerar Event ID
    const eventID = generateEventId(eventName, options?.orderId);
    
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
    
    // 4. Enrichir com atribui??o
    let enrichedParams = !options?.skipAttribution 
      ? enrichWithAttribution(customParams)
      : customParams;
    
    // 4.5 Adicionar UTMs (se dispon?veis)
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
        log('warn', '?? Warnings:', validation.warnings);
      }
    }
    
    // 7. Adicionar metadata
    const finalParams = {
      ...enrichedParams,
      fb_event_id: eventID,
      fb_data_quality_score: dataQualityScore,
      fb_tracking_version: '2.0_elite'
    };
    
    // 8. Disparar via Meta Pixel (CAPIG intercepta automaticamente!)
    if (eventType === 'custom') {
      window.fbq('trackCustom', eventName, finalParams, { eventID });
    } else {
      window.fbq('track', eventName, finalParams, { eventID });
    }
    
    // 9. Salvar no hist?rico
    addEventToHistory(eventID, eventName, finalParams, 'browser');
    
    // 10. Persistir meta cookies ap?s cada evento
    persistMetaCookies();
    
    log('info', `? ${eventName} disparado (Elite)`, {
      eventID,
      dataQualityScore,
      userDataFields: Object.keys(advancedMatching).length,
      via: 'Meta Pixel + Stape CAPIG (dual tracking)'
    });
    
    return {
      success: true,
      eventId: eventID,
      dataQualityScore,
      warnings: validation.warnings.length > 0 ? validation.warnings : undefined
    };
    
  } catch (error: any) {
    log('error', `? Erro ao disparar ${eventName}:`, error);
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
export async function trackPageViewElite(customParams: Record<string, any> = {}) {
  const touchpoint = captureAttribution();
  addAttributionTouchpoint(touchpoint);
  
  return trackEliteEvent('PageView', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    content_category: 'digital_product',
    ...customParams
  }, 'standard', { isColdEvent: true });
}

/**
 * ViewContent (Elite) - COLD EVENT com enrichment automatico
 */
export async function trackViewContentElite(customParams: Record<string, any> = {}) {
  return trackEliteEvent('ViewContent', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    content_category: 'digital_product',
    ...customParams
  }, 'standard', { isColdEvent: true });
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
 * ?? AddToCart (Elite) - APENAS para bot?o "COMPRAR AGORA"
 * Evento STANDARD enviado pelo Stape CAPIG
 */
export async function trackAddToCartElite(
  buttonText: string = 'COMPRAR AGORA',
  customParams: Record<string, any> = {}
) {
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
  }, 'standard', { isColdEvent: true });
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
  
  return trackEliteEvent('Lead', {
    value: 15.0,
    currency: 'BRL',
    content_name: 'Formul?rio de Contato - Sistema 4 Fases',
    content_category: 'lead_generation',
    predicted_ltv: 180.0,
    ...customParams
  }, 'standard');
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
  customParams: Record<string, any> = {}
) {
  // Obter dados existentes (incluindo city/state/zip da API de IP!)
  const existingData = getAdvancedUserData();
  
  // Salvar/atualizar user data (MERGE com dados existentes!)
  saveAdvancedUserData({
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
  
  return trackEliteEvent('InitiateCheckout', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    num_items: 1,
    ...customParams
  }, 'standard');
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
  if (userData) {
    saveAdvancedUserData({
      email: userData.email,
      phone: userData.phone,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: `${userData.firstName} ${userData.lastName}`
    }, true);
  }
  
  return trackEliteEvent('Purchase', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    num_items: 1,
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
    pixelLoaded: typeof window !== 'undefined' && !!window.fbq
  };
}

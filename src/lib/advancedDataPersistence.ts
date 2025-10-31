/**
 * ?? Advanced Data Persistence - Enterprise Level
 * 
 * Sistema completo de persist?ncia para tracking CAPIG Gateway:
 * - User data (PII)
 * - Attribution journey (multi-touch)
 * - Meta cookies (fbp, fbc)
 * - Event history
 * - Data quality scoring
 */

'use client';

// ===== INTERFACES =====

export interface AttributionTouchpoint {
  timestamp: number;
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  term?: string;
  fbclid?: string;
  gclid?: string;
  eventType: string;
  url: string;
}

export interface UserDataComplete {
  // PII
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  
  // Location
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  
  // Meta Identifiers
  fbp?: string;      // Facebook Browser ID
  fbc?: string;      // Facebook Click ID
  external_id?: string;
  
  // Session
  sessionId: string;
  
  // Timestamps
  firstSeen: number;
  lastSeen: number;
  
  // Consent
  consent: boolean;
  consentDate?: number;
  
  // Data Quality
  dataQualityScore?: number;
}

export interface EventHistory {
  eventId: string;
  eventName: string;
  timestamp: number;
  data: any;
  source: 'browser' | 'server';
}

export interface UserJourney {
  userData: UserDataComplete;
  attributionJourney: AttributionTouchpoint[];
  eventHistory: EventHistory[];
  dataQualityScore: number;
}

// ===== STORAGE KEYS =====

const KEYS = {
  USER_DATA: 'zc_user_data_v2',
  ATTRIBUTION: 'zc_attribution_journey',
  EVENT_HISTORY: 'zc_event_history',
  SESSION: 'zc_session_id',
  CONSENT: 'zc_consent',
  META_COOKIES: 'zc_meta_cookies'
};

// ===== UTILITY FUNCTIONS =====

function safeJSONParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ===== META COOKIES =====

/**
 * Extrai fbp e fbc dos cookies
 */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};
  
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return {
    fbp: cookies['_fbp'],
    fbc: cookies['_fbc']
  };
}

/**
 * Salva fbp/fbc no localStorage para usar em offline conversions
 */
export function persistMetaCookies(): void {
  const cookies = getMetaCookies();
  if (cookies.fbp || cookies.fbc) {
    localStorage.setItem(KEYS.META_COOKIES, JSON.stringify(cookies));
    console.log('?? Meta cookies persistidos:', cookies);
  }
}

/**
 * Recupera fbp/fbc salvos
 */
export function getPersistedMetaCookies(): { fbp?: string; fbc?: string } {
  const stored = localStorage.getItem(KEYS.META_COOKIES);
  return safeJSONParse(stored, {});
}

// ===== ATTRIBUTION TRACKING =====

/**
 * Captura par?metros UTM e fbclid/gclid da URL
 */
export function captureAttribution(): AttributionTouchpoint {
  if (typeof window === 'undefined') {
    return {
      timestamp: Date.now(),
      source: 'direct',
      medium: 'none',
      eventType: 'unknown',
      url: ''
    };
  }
  
  const url = new URL(window.location.href);
  const params = url.searchParams;
  
  // Capturar referrer
  const referrer = document.referrer;
  let source = params.get('utm_source') || 'direct';
  let medium = params.get('utm_medium') || 'none';
  
  // Se n?o tem UTM, tentar detectar pelo referrer
  if (source === 'direct' && referrer) {
    if (referrer.includes('facebook.com') || referrer.includes('fb.com')) {
      source = 'facebook';
      medium = 'referral';
    } else if (referrer.includes('google.com')) {
      source = 'google';
      medium = 'organic';
    } else if (referrer.includes('instagram.com')) {
      source = 'instagram';
      medium = 'referral';
    }
  }
  
  return {
    timestamp: Date.now(),
    source,
    medium,
    campaign: params.get('utm_campaign') || undefined,
    content: params.get('utm_content') || undefined,
    term: params.get('utm_term') || undefined,
    fbclid: params.get('fbclid') || undefined,
    gclid: params.get('gclid') || undefined,
    eventType: 'page_visit',
    url: window.location.href
  };
}

/**
 * Adiciona touchpoint na jornada
 */
export function addAttributionTouchpoint(touchpoint: AttributionTouchpoint): void {
  const journey = getAttributionJourney();
  journey.push(touchpoint);
  
  // Limitar a 50 touchpoints
  if (journey.length > 50) {
    journey.shift();
  }
  
  localStorage.setItem(KEYS.ATTRIBUTION, JSON.stringify(journey));
  console.log('?? Touchpoint adicionado:', touchpoint);
}

/**
 * Recupera jornada completa de atribui??o
 */
export function getAttributionJourney(): AttributionTouchpoint[] {
  const stored = localStorage.getItem(KEYS.ATTRIBUTION);
  return safeJSONParse(stored, []);
}

/**
 * Analisa jornada e retorna insights
 */
export function getAttributionInsights() {
  const journey = getAttributionJourney();
  
  if (journey.length === 0) {
    return null;
  }
  
  return {
    firstTouch: journey[0],
    lastTouch: journey[journey.length - 1],
    touchpointCount: journey.length,
    timeToConvert: journey[journey.length - 1].timestamp - journey[0].timestamp,
    channels: [...new Set(journey.map(t => t.source))],
    hasPaidClick: journey.some(t => t.fbclid || t.gclid)
  };
}

// ===== USER DATA =====

/**
 * Calcula score de qualidade dos dados (0-100)
 */
export function calculateDataQualityScore(userData: Partial<UserDataComplete>): number {
  let score = 0;
  
  // Campos cr?ticos (10 pontos cada)
  if (userData.email) score += 10;
  if (userData.phone) score += 10;
  
  // Nome completo (10 pontos)
  if (userData.firstName && userData.lastName) {
    score += 10;
  } else if (userData.fullName) {
    score += 5;
  }
  
  // Localiza??o (5 pontos cada)
  if (userData.city) score += 5;
  if (userData.state) score += 5;
  if (userData.zip) score += 5;
  if (userData.country) score += 5;
  
  // Meta identifiers (10 pontos cada)
  if (userData.fbp) score += 10;
  if (userData.fbc) score += 10;
  
  // Session (5 pontos)
  if (userData.sessionId) score += 5;
  
  // Consent (15 pontos)
  if (userData.consent) score += 15;
  
  return Math.min(score, 100);
}

/**
 * Salva dados do usu?rio com enriquecimento autom?tico
 */
export function saveAdvancedUserData(
  userData: Partial<UserDataComplete>,
  consent: boolean = true
): UserDataComplete {
  
  const existingData = getAdvancedUserData();
  const metaCookies = getMetaCookies();
  
  // Merge de dados (novos sobrescrevem antigos)
  const mergedData: UserDataComplete = {
    ...existingData,
    ...userData,
    
    // Meta cookies (sempre atualizar)
    fbp: metaCookies.fbp || existingData?.fbp,
    fbc: metaCookies.fbc || existingData?.fbc,
    
    // Session (manter existente ou criar novo)
    sessionId: existingData?.sessionId || generateSessionId(),
    
    // Timestamps
    firstSeen: existingData?.firstSeen || Date.now(),
    lastSeen: Date.now(),
    
    // Consent
    consent,
    consentDate: consent ? Date.now() : existingData?.consentDate,
    
    // Pa?s default
    country: userData.country || existingData?.country || 'br'
  };
  
  // Calcular score de qualidade
  mergedData.dataQualityScore = calculateDataQualityScore(mergedData);
  
  // Salvar
  localStorage.setItem(KEYS.USER_DATA, JSON.stringify(mergedData));
  
  // Persistir meta cookies tamb?m
  persistMetaCookies();
  
  console.log('?? User data salvo (Advanced):', {
    dataQualityScore: mergedData.dataQualityScore,
    fields: Object.keys(mergedData).filter(k => mergedData[k as keyof UserDataComplete])
  });
  
  return mergedData;
}

/**
 * Recupera dados avan?ados do usu?rio
 */
export function getAdvancedUserData(): UserDataComplete | null {
  const stored = localStorage.getItem(KEYS.USER_DATA);
  return safeJSONParse(stored, null);
}

// ===== EVENT HISTORY =====

/**
 * Adiciona evento ao hist?rico
 */
export function addEventToHistory(
  eventId: string,
  eventName: string,
  data: any,
  source: 'browser' | 'server' = 'browser'
): void {
  const history = getEventHistory();
  
  history.push({
    eventId,
    eventName,
    timestamp: Date.now(),
    data,
    source
  });
  
  // Limitar a 100 eventos
  if (history.length > 100) {
    history.shift();
  }
  
  localStorage.setItem(KEYS.EVENT_HISTORY, JSON.stringify(history));
}

/**
 * Recupera hist?rico de eventos
 */
export function getEventHistory(): EventHistory[] {
  const stored = localStorage.getItem(KEYS.EVENT_HISTORY);
  return safeJSONParse(stored, []);
}

/**
 * Estat?sticas do hist?rico
 */
export function getEventStats() {
  const history = getEventHistory();
  
  if (history.length === 0) return null;
  
  const eventCounts = history.reduce((acc, event) => {
    acc[event.eventName] = (acc[event.eventName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalEvents: history.length,
    eventCounts,
    firstEvent: history[0],
    lastEvent: history[history.length - 1],
    timespan: history[history.length - 1].timestamp - history[0].timestamp
  };
}

// ===== COMPLETE JOURNEY =====

/**
 * Recupera jornada completa do usu?rio
 */
export function getCompleteUserJourney(): UserJourney | null {
  const userData = getAdvancedUserData();
  
  if (!userData) return null;
  
  return {
    userData,
    attributionJourney: getAttributionJourney(),
    eventHistory: getEventHistory(),
    dataQualityScore: userData.dataQualityScore || 0
  };
}

// ===== CONSENT MANAGEMENT =====

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

/**
 * Salva estado de consentimento
 */
export function saveConsent(analytics: boolean, marketing: boolean): void {
  const consent: ConsentState = {
    analytics,
    marketing,
    timestamp: Date.now()
  };
  
  localStorage.setItem(KEYS.CONSENT, JSON.stringify(consent));
  
  // Atualizar user data tamb?m
  const userData = getAdvancedUserData();
  if (userData) {
    saveAdvancedUserData({ ...userData, consent: analytics });
  }
}

/**
 * Verifica consentimento
 */
export function hasConsent(type: 'analytics' | 'marketing'): boolean {
  const stored = localStorage.getItem(KEYS.CONSENT);
  const consent = safeJSONParse<ConsentState | null>(stored, null);
  
  if (!consent) return false;
  
  return consent[type];
}

/**
 * Limpa TODOS os dados (LGPD - Right to be Forgotten)
 */
export function clearAllUserData(): void {
  Object.values(KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  sessionStorage.clear();
  
  console.log('??? Todos os dados do usu?rio foram removidos (LGPD compliance)');
}

// ===== INITIALIZATION =====

/**
 * Inicializa sistema avan?ado de persist?ncia
 */
export function initializeAdvancedPersistence(): UserJourney | null {
  // Capturar atribui??o da p?gina atual
  const touchpoint = captureAttribution();
  addAttributionTouchpoint(touchpoint);
  
  // Persistir meta cookies
  persistMetaCookies();
  
  // Retornar jornada completa
  const journey = getCompleteUserJourney();
  
  if (journey) {
    console.log('?? Sistema Avan?ado de Persist?ncia Inicializado:', {
      dataQualityScore: journey.dataQualityScore,
      touchpoints: journey.attributionJourney.length,
      events: journey.eventHistory.length
    });
  }
  
  return journey;
}

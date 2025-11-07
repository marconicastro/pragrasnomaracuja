/**
 * ?? Elite UTM Tracking - Advanced Level
 * 
 * Sistema completo de captura, persist?ncia e atribui??o de UTMs
 * Integrado com Meta Pixel e Conversions API
 * 
 * Features:
 * - Captura autom?tica de UTMs da URL
 * - Persist?ncia multi-sess?o (localStorage + cookies)
 * - First-touch e Last-touch attribution
 * - UTM history completa (jornada do usu?rio)
 * - Integra??o com Meta Pixel custom parameters
 * - Fallback para referrer org?nico
 */

'use client';

// ===== INTERFACES =====

export interface UTMParameters {
  // UTMs padr?o (Google Analytics)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_id?: string;
  
  // Click IDs
  gclid?: string;  // Google Ads Click ID
  fbclid?: string; // Facebook Click ID
  
  // Facebook Native Parameters (dados ricos)
  fb_campaign_id?: string;
  fb_campaign_name?: string;
  fb_adset_id?: string;
  fb_adset_name?: string;
  fb_ad_id?: string;
  fb_ad_name?: string;
  fb_placement?: string;
  
  // Contexto
  referrer?: string;
  landing_page?: string;
  timestamp: number;
}

export interface UTMAttribution {
  firstTouch: UTMParameters;
  lastTouch: UTMParameters;
  touchCount: number;
  history: UTMParameters[];
  channels: string[];
}

// ===== STORAGE KEYS =====

const STORAGE_KEYS = {
  FIRST_TOUCH: 'elite_utm_first_touch',
  LAST_TOUCH: 'elite_utm_last_touch',
  HISTORY: 'elite_utm_history',
  SESSION: 'elite_utm_session'
};

// ===== UTILITY FUNCTIONS =====

/**
 * Detecta canal baseado em source/medium
 */
function detectChannel(source?: string, medium?: string): string {
  if (!source && !medium) return 'direct';
  
  const s = (source || '').toLowerCase();
  const m = (medium || '').toLowerCase();
  
  // Paid channels
  if (m.includes('cpc') || m.includes('ppc') || m.includes('paid')) {
    if (s.includes('google')) return 'google_ads';
    if (s.includes('facebook') || s.includes('fb') || s.includes('meta')) return 'facebook_ads';
    if (s.includes('instagram') || s.includes('ig')) return 'instagram_ads';
    if (s.includes('tiktok')) return 'tiktok_ads';
    if (s.includes('youtube') || s.includes('yt')) return 'youtube_ads';
    return 'paid_other';
  }
  
  // Social organic
  if (m.includes('social') || s.includes('facebook') || s.includes('instagram') || 
      s.includes('twitter') || s.includes('linkedin') || s.includes('tiktok')) {
    return 'social_organic';
  }
  
  // Email
  if (m.includes('email') || s.includes('newsletter') || s.includes('mail')) {
    return 'email';
  }
  
  // Referral
  if (m.includes('referral') || m.includes('link')) {
    return 'referral';
  }
  
  // Organic
  if (m.includes('organic') || s.includes('google') || s.includes('bing')) {
    return 'organic_search';
  }
  
  // Outros
  return source ? `other_${source}` : 'other';
}

/**
 * Extrai UTMs da URL
 */
export function extractUTMsFromURL(url?: string): UTMParameters | null {
  if (typeof window === 'undefined') return null;
  
  const urlToCheck = url || window.location.href;
  const urlObj = new URL(urlToCheck);
  const params = urlObj.searchParams;
  
  // Verificar se tem algum par?metro UTM
  const hasUTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id']
    .some(param => params.has(param));
  
  const hasClickID = params.has('gclid') || params.has('fbclid');
  
  if (!hasUTM && !hasClickID) return null;
  
  const utms: UTMParameters = {
    // UTMs padr?o
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_id: params.get('utm_id') || undefined,
    
    // Click IDs
    gclid: params.get('gclid') || undefined,
    fbclid: params.get('fbclid') || undefined,
    
    // Facebook Native Parameters (dados ricos)
    fb_campaign_id: params.get('fb_campaign_id') || undefined,
    fb_campaign_name: params.get('fb_campaign_name') || undefined,
    fb_adset_id: params.get('fb_adset_id') || undefined,
    fb_adset_name: params.get('fb_adset_name') || undefined,
    fb_ad_id: params.get('fb_ad_id') || undefined,
    fb_ad_name: params.get('fb_ad_name') || undefined,
    fb_placement: params.get('fb_placement') || undefined,
    
    // Contexto
    referrer: document.referrer || undefined,
    landing_page: urlObj.pathname + urlObj.search,
    timestamp: Date.now()
  };
  
  return utms;
}

/**
 * Detecta source/medium do referrer
 */
function detectFromReferrer(): Partial<UTMParameters> | null {
  if (typeof document === 'undefined' || !document.referrer) return null;
  
  try {
    const referrerURL = new URL(document.referrer);
    const hostname = referrerURL.hostname.toLowerCase();
    
    // Google
    if (hostname.includes('google.')) {
      return {
        utm_source: 'google',
        utm_medium: 'organic',
        referrer: document.referrer
      };
    }
    
    // Facebook
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
      return {
        utm_source: 'facebook',
        utm_medium: 'referral',
        referrer: document.referrer
      };
    }
    
    // Instagram
    if (hostname.includes('instagram.com')) {
      return {
        utm_source: 'instagram',
        utm_medium: 'referral',
        referrer: document.referrer
      };
    }
    
    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return {
        utm_source: 'youtube',
        utm_medium: 'referral',
        referrer: document.referrer
      };
    }
    
    // Outros referrers
    return {
      utm_source: hostname.replace('www.', ''),
      utm_medium: 'referral',
      referrer: document.referrer
    };
  } catch {
    return null;
  }
}

// ===== PERSISTENCE =====

/**
 * Salva First Touch (permanente)
 */
function saveFirstTouch(utms: UTMParameters): void {
  const existing = localStorage.getItem(STORAGE_KEYS.FIRST_TOUCH);
  if (!existing) {
    localStorage.setItem(STORAGE_KEYS.FIRST_TOUCH, JSON.stringify(utms));
    logger.log('?? First Touch UTM capturado:', utms);
  }
}

/**
 * Salva Last Touch (sempre atualiza)
 */
function saveLastTouch(utms: UTMParameters): void {
  localStorage.setItem(STORAGE_KEYS.LAST_TOUCH, JSON.stringify(utms));
  logger.log('?? Last Touch UTM atualizado:', utms);
}

/**
 * Adiciona ao hist?rico
 */
function addToHistory(utms: UTMParameters): void {
  try {
    const historyJSON = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history: UTMParameters[] = historyJSON ? JSON.parse(historyJSON) : [];
    
    // Limitar hist?rico a 50 entradas
    if (history.length >= 50) {
      history.shift();
    }
    
    history.push(utms);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    logger.warn('Erro ao salvar hist?rico de UTMs:', error);
  }
}

// ===== MAIN FUNCTIONS =====

/**
 * Inicializa tracking de UTMs (chamar no load da p?gina)
 */
export function initUTMTracking(): UTMParameters | null {
  if (typeof window === 'undefined') return null;
  
  // 1. Tentar extrair UTMs da URL
  let utms = extractUTMsFromURL();
  
  // 2. Se n?o tem UTMs na URL, tentar detectar do referrer
  if (!utms) {
    const referrerData = detectFromReferrer();
    if (referrerData) {
      utms = {
        ...referrerData,
        landing_page: window.location.pathname + window.location.search,
        timestamp: Date.now()
      } as UTMParameters;
    }
  }
  
  // 3. Se capturou algo, salvar
  if (utms) {
    saveFirstTouch(utms);
    saveLastTouch(utms);
    addToHistory(utms);
    
    // Salvar tamb?m na sess?o (para acesso r?pido)
    sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(utms));
    
    return utms;
  }
  
  return null;
}

/**
 * Obt?m First Touch UTMs
 */
export function getFirstTouchUTMs(): UTMParameters | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FIRST_TOUCH);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Obt?m Last Touch UTMs
 */
export function getLastTouchUTMs(): UTMParameters | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_TOUCH);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Obt?m UTMs da sess?o atual
 */
export function getCurrentSessionUTMs(): UTMParameters | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Obt?m hist?rico completo de UTMs
 */
export function getUTMHistory(): UTMParameters[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Obt?m atribui??o completa (first + last + history)
 */
export function getUTMAttribution(): UTMAttribution | null {
  const firstTouch = getFirstTouchUTMs();
  const lastTouch = getLastTouchUTMs();
  const history = getUTMHistory();
  
  if (!firstTouch && !lastTouch && history.length === 0) {
    return null;
  }
  
  // Extrair canais ?nicos
  const channels = [...new Set(
    history.map(utm => detectChannel(utm.utm_source, utm.utm_medium))
  )];
  
  return {
    firstTouch: firstTouch || history[0] || {} as UTMParameters,
    lastTouch: lastTouch || history[history.length - 1] || {} as UTMParameters,
    touchCount: history.length,
    history,
    channels
  };
}

/**
 * Formata UTMs para enviar ao Meta Pixel (custom parameters)
 */
export function formatUTMsForMeta(): Record<string, any> {
  const attribution = getUTMAttribution();
  if (!attribution) return {};
  
  const params: Record<string, any> = {};
  
  // First Touch
  if (attribution.firstTouch.utm_source) {
    params.utm_first_source = attribution.firstTouch.utm_source;
  }
  if (attribution.firstTouch.utm_medium) {
    params.utm_first_medium = attribution.firstTouch.utm_medium;
  }
  if (attribution.firstTouch.utm_campaign) {
    params.utm_first_campaign = attribution.firstTouch.utm_campaign;
  }
  
  // Last Touch
  if (attribution.lastTouch.utm_source) {
    params.utm_last_source = attribution.lastTouch.utm_source;
  }
  if (attribution.lastTouch.utm_medium) {
    params.utm_last_medium = attribution.lastTouch.utm_medium;
  }
  if (attribution.lastTouch.utm_campaign) {
    params.utm_last_campaign = attribution.lastTouch.utm_campaign;
  }
  
  // Metadata
  params.utm_touch_count = attribution.touchCount;
  params.utm_channels = attribution.channels.join(',');
  
  // Channel detection
  params.utm_first_channel = detectChannel(
    attribution.firstTouch.utm_source,
    attribution.firstTouch.utm_medium
  );
  params.utm_last_channel = detectChannel(
    attribution.lastTouch.utm_source,
    attribution.lastTouch.utm_medium
  );
  
  // Click IDs
  if (attribution.lastTouch.gclid) {
    params.gclid = attribution.lastTouch.gclid;
  }
  
  return params;
}

/**
 * Limpa dados de UTM (para testes ou LGPD)
 */
export function clearUTMData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEYS.FIRST_TOUCH);
  localStorage.removeItem(STORAGE_KEYS.LAST_TOUCH);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  
  logger.log('??? Dados de UTM limpos');
}

/**
 * Diagn?stico de UTMs (para debug)
 */
export function getUTMDiagnostics() {
  return {
    currentURL: typeof window !== 'undefined' ? window.location.href : 'N/A',
    hasUTMsInURL: !!extractUTMsFromURL(),
    firstTouch: getFirstTouchUTMs(),
    lastTouch: getLastTouchUTMs(),
    currentSession: getCurrentSessionUTMs(),
    historyCount: getUTMHistory().length,
    attribution: getUTMAttribution(),
    metaParams: formatUTMsForMeta()
  };
}

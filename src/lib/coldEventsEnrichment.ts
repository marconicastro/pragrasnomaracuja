/**
 * ?? Cold Events Enrichment - Maximizar EQM ANTES do Lead
 *
 * Estrat?gias para enriquecer eventos "frios" (PageView, ViewContent, ScrollDepth, CTAClick)
 * que acontecem ANTES do usu?rio preencher o formul?rio:
 *
 * 1. ? Dados persistidos (usu?rio retornando)
 * 2. ? IP-based geolocation (cidade/estado por IP)
 * 3. ? Browser fingerprint ?tico (device/OS)
 * 4. ? fbp/fbc cookies (sempre)
 * 5. ? Progressive data capture (campo por campo)
 * 6. ? Session enrichment
 */

'use client';

import { getAdvancedUserData, getMetaCookies } from './advancedDataPersistence';
import { getSessionId } from './session';
import { logger } from './utils/logger';
import { memoizeAsync } from './utils/memoize';
import {
  normalizeEmail,
  normalizeName,
  normalizePhone,
  normalizeCity,
  normalizeState,
  normalizeZip,
  normalizeCountry,
  splitNormalizedName,
} from './utils/metaDataNormalizer';
import { fetchWithTimeout } from './utils/fetchWithTimeout';

// ===== INTERFACES =====

export interface EnrichedEventData {
  user_data: Record<string, any>;
  dataQualityScore: number;
  enrichmentSources: string[];
}

export interface BrowserFingerprint {
  device_type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screen_resolution: string;
  language: string;
  timezone: string;
}

// Tipos permitidos (valores REAIS apenas!)
// 'other' = detectado do UA mas n?o ? chrome/safari/firefox/edge (REAL!)
// Se n?o conseguir detectar, retorna vazio (n?o adiciona campo)

export interface IPGeolocation {
  city?: string;
  state?: string;
  country: string;
  zip?: string;
}

// ===== BROWSER FINGERPRINTING =====

/**
 * Captura fingerprint etico do browser (sem tracking invasivo)
 *
 * IMPORTANTE: Sao dados REAIS de contexto do browser, nao PII
 * - Meta usa para detectar bots e segmentar
 * - NAO identifica usuario entre sites
 */
export function getBrowserFingerprint(): BrowserFingerprint | null {
  if (typeof window === 'undefined') {
    // Server-side: NAO retorna fingerprint (ZERO fake!)
    return null;
  }

  const ua = navigator.userAgent;

  // Detectar device type (REAL do user-agent)
  let device_type: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (/Mobile|Android|iPhone/i.test(ua)) {
    device_type = 'mobile';
  } else if (/iPad|Tablet/i.test(ua)) {
    device_type = 'tablet';
  }

  // Detectar browser (REAL do user-agent)
  let browser = 'other'; // Melhor que "unknown"
  if (ua.includes('Chrome') && !ua.includes('Edge')) browser = 'chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'safari';
  else if (ua.includes('Firefox')) browser = 'firefox';
  else if (ua.includes('Edge')) browser = 'edge';

  // Detectar OS (REAL do user-agent)
  let os = 'other'; // Melhor que "unknown"
  if (ua.includes('Windows')) os = 'windows';
  else if (ua.includes('Mac') && !ua.includes('iPhone') && !ua.includes('iPad')) os = 'macos';
  else if (ua.includes('Linux') && !ua.includes('Android')) os = 'linux';
  else if (ua.includes('Android')) os = 'android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'ios';

  return {
    device_type,
    browser,
    os,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || 'pt-BR',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo',
  };
}

// ===== IP-BASED GEOLOCATION =====

/**
 * Tenta obter geolocalizacao via APIs publicas ou client hint
 *
 * IMPORTANTE:
 * - Stape.io ja adiciona IP automaticamente no server-side
 * - So retorna dados REAIS da API
 * - Se falhar, retorna vazio (ZERO dados fake!)
 */
export async function getIPGeolocation(): Promise<IPGeolocation | null> {
  try {
    // Tentar usar API publica (ipapi.co tem 1000 req/dia gratis)
    const response = await fetchWithTimeout('https://ipapi.co/json/', {
      timeout: 2000,
    });

    if (response.ok) {
      const data = await response.json();

      // SO retorna se tiver dados REAIS
      if (!data.country_code) {
        logger.warn('IP geolocation API retornou dados invalidos');
        return null;
      }

      return {
        city: data.city ? data.city.toLowerCase() : undefined,
        state: data.region_code ? data.region_code.toLowerCase() : undefined,
        country: data.country_code.toLowerCase(),
        zip: data.postal || undefined,
      };
    }
  } catch (error) {
    logger.debug('IP geolocation nao disponivel', { error });
  }

  // Se falhar, retorna NULL (ZERO dados fake!)
  return null;
}

// Cache de geolocation (para nao fazer multiplas requests)
let geoCache: IPGeolocation | null = null;
let geoPromise: Promise<IPGeolocation | null> | null = null;

export async function getCachedIPGeolocation(): Promise<IPGeolocation | null> {
  if (geoCache !== null) return geoCache;

  if (!geoPromise) {
    geoPromise = getIPGeolocation().then(geo => {
      geoCache = geo;
      return geo;
    });
  }

  return geoPromise;
}

// ===== PROGRESSIVE DATA CAPTURE =====

/**
 * Monitora campos do formul?rio sendo preenchidos (progressive profiling)
 *
 * ?TICA: S? captura quando usu?rio digita, n?o envia at? ele submeter.
 * Usado apenas para ENRIQUECER eventos subsequentes enquanto ele navega.
 */

const progressiveData: {
  email?: string;
  phone?: string;
  name?: string;
  city?: string;
  state?: string;
  zip?: string;
} = {};

export function captureProgressiveData(field: string, value: string): void {
  if (!value || value.length < 3) return;

  // Valida??es b?sicas antes de capturar
  switch (field) {
    case 'email':
      if (value.includes('@') && value.includes('.')) {
        progressiveData.email = value.toLowerCase().trim();
      }
      break;
    case 'phone':
      const phoneClean = value.replace(/\D/g, '');
      if (phoneClean.length >= 10) {
        progressiveData.phone = phoneClean;
      }
      break;
    case 'name':
      if (value.trim().length >= 3) {
        progressiveData.name = value.trim();
      }
      break;
    case 'city':
      if (value.trim().length >= 3) {
        progressiveData.city = value.toLowerCase().trim();
      }
      break;
    case 'state':
      if (value.trim().length >= 2) {
        progressiveData.state = value.toLowerCase().trim();
      }
      break;
    case 'zip':
      const zipClean = value.replace(/\D/g, '');
      if (zipClean.length >= 5) {
        progressiveData.zip = zipClean;
      }
      break;
  }

  console.debug('?? Progressive data captured:', field);
}

export function getProgressiveData(): typeof progressiveData {
  return { ...progressiveData };
}

export function clearProgressiveData(): void {
  Object.keys(progressiveData).forEach(key => {
    delete progressiveData[key as keyof typeof progressiveData];
  });
}

// ===== MAIN ENRICHMENT FUNCTION =====

/**
 * ?? FUN??O PRINCIPAL: Enriquece eventos "frios" com dados dispon?veis
 *
 * Estrat?gia inteligente:
 * 1. Prioriza dados persistidos (usu?rio retornando)
 * 2. Adiciona progressive data (se dispon?vel)
 * 3. Adiciona fbp/fbc (sempre)
 * 4. Adiciona geolocation por IP (se dispon?vel)
 * 5. Adiciona browser fingerprint
 * 6. Calcula Data Quality Score
 */
// Memoized version (cache de 5 minutos)
const _enrichColdEvent = async (): Promise<EnrichedEventData> => {
  const sources: string[] = [];
  const user_data: Record<string, any> = {};

  // 1. PRIORIDADE: Dados persistidos (usuário já preencheu antes - segunda visita!)
  // ⚠️ NORMALIZAÇÃO CRÍTICA: Usar funções centralizadas para garantir padrão Facebook
  const persistedData = getAdvancedUserData();
  if (persistedData) {
    if (persistedData.email) {
      const normalizedEmail = normalizeEmail(persistedData.email);
      user_data.em = normalizedEmail; // ✅ Normalizado (lowercase + trim)
      sources.push('persisted_email');
    }
    if (persistedData.phone) {
      const normalizedPhone = normalizePhone(persistedData.phone);
      user_data.ph = normalizedPhone; // ✅ Normalizado (dígitos + 55)
      sources.push('persisted_phone');
    }
    if (persistedData.firstName) {
      const normalizedFirstName = normalizeName(persistedData.firstName);
      user_data.fn = normalizedFirstName; // ✅ Normalizado (title case)
      sources.push('persisted_first_name');
    }
    if (persistedData.lastName) {
      const normalizedLastName = normalizeName(persistedData.lastName);
      user_data.ln = normalizedLastName; // ✅ Normalizado (title case)
      sources.push('persisted_last_name');
    }
    if (persistedData.city) {
      const normalizedCity = normalizeCity(persistedData.city);
      user_data.ct = normalizedCity; // ✅ Normalizado (lowercase + trim)
      sources.push('persisted_city');
    }
    if (persistedData.state) {
      const normalizedState = normalizeState(persistedData.state);
      user_data.st = normalizedState; // ✅ Normalizado (lowercase + trim)
      sources.push('persisted_state');
    }
    if (persistedData.zip) {
      const normalizedZip = normalizeZip(persistedData.zip);
      user_data.zp = normalizedZip; // ✅ Normalizado (apenas dígitos)
      sources.push('persisted_zip');
    }
    if (persistedData.country) {
      const normalizedCountry = normalizeCountry(persistedData.country);
      user_data.country = normalizedCountry; // ✅ Normalizado (lowercase + trim)
      sources.push('persisted_country');
    }
    if (persistedData.external_id) {
      user_data.external_id = persistedData.external_id;
      sources.push('persisted_session');
    }
  }

  // 2. Progressive data (usuário começou a preencher MAS ainda não submeteu)
  // ⚠️ NORMALIZAÇÃO CRÍTICA: Usar funções centralizadas
  const progressive = getProgressiveData();
  if (progressive.email && !user_data.em) {
    const normalizedEmail = normalizeEmail(progressive.email);
    user_data.em = normalizedEmail; // ✅ Normalizado
    sources.push('progressive_email');
  }
  if (progressive.phone && !user_data.ph) {
    const normalizedPhone = normalizePhone(progressive.phone);
    user_data.ph = normalizedPhone; // ✅ Normalizado
    sources.push('progressive_phone');
  }
  if (progressive.name && !user_data.fn) {
    const { firstName, lastName } = splitNormalizedName(progressive.name);
    if (firstName) {
      user_data.fn = normalizeName(firstName); // ✅ Normalizado
      sources.push('progressive_first_name');
    }
    if (lastName) {
      user_data.ln = normalizeName(lastName); // ✅ Normalizado
      sources.push('progressive_last_name');
    }
    if (firstName || lastName) {
      sources.push('progressive_name');
    }
  }
  if (progressive.city && !user_data.ct) {
    const normalizedCity = normalizeCity(progressive.city);
    user_data.ct = normalizedCity; // ✅ Normalizado
    sources.push('progressive_city');
  }
  if (progressive.state && !user_data.st) {
    const normalizedState = normalizeState(progressive.state);
    user_data.st = normalizedState; // ✅ Normalizado
    sources.push('progressive_state');
  }
  if (progressive.zip && !user_data.zp) {
    const normalizedZip = normalizeZip(progressive.zip);
    user_data.zp = normalizedZip; // ✅ Normalizado
    sources.push('progressive_zip');
  }

  // ✅ CRÍTICO: Garantir external_id SEMPRE presente (session ID)
  // Se não tiver external_id ainda, gerar usando storage unificado ou timestamp
  if (!user_data.external_id) {
    const sessionId =
      typeof window !== 'undefined'
        ? getSessionId()
        : `sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;

    user_data.external_id = sessionId;
    sources.push('unified_session_id');
    logger.log('✅ External ID gerado/recuperado:', sessionId);
  }

  // 3. Meta cookies (SEMPRE - crítico!)
  // CRÍTICO: fbc deve ser preservado EXATAMENTE (sem modificações!)
  const metaCookies = getMetaCookies();
  if (metaCookies.fbp) {
    user_data.fbp = metaCookies.fbp;
    sources.push('meta_fbp');
  }
  if (metaCookies.fbc) {
    // Preservar fbc exatamente como vem do cookie (não modificar!)
    user_data.fbc = metaCookies.fbc;
    sources.push('meta_fbc');
  }

  // 4. IP Geolocation (SOMENTE se API retornar dados REAIS)
  if (!user_data.ct || !user_data.st || !user_data.country) {
    try {
      const geo = await getCachedIPGeolocation();

      // SOMENTE adiciona se tiver dados REAIS da API
      if (geo) {
        if (geo.city && !user_data.ct) {
          user_data.ct = geo.city;
          sources.push('ip_city');
        }
        if (geo.state && !user_data.st) {
          user_data.st = geo.state;
          sources.push('ip_state');
        }
        if (geo.zip && !user_data.zp) {
          user_data.zp = geo.zip;
          sources.push('ip_zip');
        }
        if (geo.country && !user_data.country) {
          user_data.country = geo.country;
          sources.push('ip_country');
        }

        // IMPORTANTE: Salvar no localStorage para uso futuro (Lead/Purchase)!
        // Isso garante que city/state/zip estar?o dispon?veis quando fizer Lead
        if (geo.city || geo.state || geo.zip) {
          const { saveAdvancedUserData } = await import('./advancedDataPersistence');
          saveAdvancedUserData(
            {
              city: geo.city,
              state: geo.state,
              zip: geo.zip,
              country: geo.country,
            },
            false
          ); // Sem consent ainda (s? geo p?blica)

          logger.log('?? Geolocaliza??o salva no localStorage para uso futuro!');
        }
      }
      // Se API falhar, NAO adiciona nada (ZERO dados fake!)
    } catch (error) {
      console.debug('Erro ao obter geolocation, continuando sem localizacao');
      // NAO adiciona dados fake!
    }
  }

  // SEMPRE adicionar country BR como fallback (99% dos users s?o BR)
  if (!user_data.country) {
    user_data.country = 'br';
    sources.push('default_country_br');
  }

  // 5. Browser fingerprint (SOMENTE se disponivel - client-side only!)
  const fingerprint = getBrowserFingerprint();
  if (fingerprint) {
    user_data.fb_device_type = fingerprint.device_type;
    user_data.fb_browser = fingerprint.browser;
    user_data.fb_os = fingerprint.os;
    user_data.fb_language = fingerprint.language;
    sources.push('browser_fingerprint');
  }

  // 6. Calcular Data Quality Score
  const dataQualityScore = calculateColdEventQuality(user_data);

  logger.log('?? Cold event enriched:', {
    fields: Object.keys(user_data).length,
    dataQualityScore,
    sources,
  });

  return {
    user_data,
    dataQualityScore,
    enrichmentSources: sources,
  };
};

// Export memoized version (cache: 5 minutos, recalcula a cada 5min)
export const enrichColdEvent = memoizeAsync(_enrichColdEvent, {
  ttl: 5 * 60 * 1000, // 5 minutos
  maxSize: 10, // Apenas 10 entradas (por sessão)
  keyGenerator: () => {
    if (typeof window === 'undefined') {
      return 'server';
    }
    try {
      return getSessionId() || 'anonymous';
    } catch {
      return 'anonymous';
    }
  },
});

/**
 * Calcula Data Quality Score para eventos frios
 */
function calculateColdEventQuality(user_data: Record<string, any>): number {
  let score = 0;

  // PII (vale mais)
  if (user_data.em) score += 15; // Email
  if (user_data.ph) score += 15; // Phone
  if (user_data.fn) score += 10; // First name
  if (user_data.ln) score += 10; // Last name

  // Localiza??o
  if (user_data.ct) score += 8; // City
  if (user_data.st) score += 8; // State
  if (user_data.zp) score += 5; // ZIP
  if (user_data.country) score += 4; // Country

  // Meta identifiers (cr?ticos!)
  if (user_data.fbp) score += 15; // Facebook Browser ID
  if (user_data.fbc) score += 10; // Facebook Click ID

  // Session/External ID
  if (user_data.external_id) score += 5;

  // Fingerprint (menor valor mas ajuda)
  if (user_data.fb_device_type) score += 2;
  if (user_data.fb_browser) score += 2;
  if (user_data.fb_os) score += 1;

  return Math.min(score, 100);
}

// ===== HELPER: Compara??o Cold vs Warm Events =====

/**
 * Retorna compara??o de qualidade entre eventos frios e quentes
 */
export async function getEventQualityComparison(): Promise<{
  coldEvent: { fields: number; score: number };
  warmEvent: { fields: number; score: number };
  improvement: string;
}> {
  const cold = await enrichColdEvent();
  const warm = getAdvancedUserData();

  return {
    coldEvent: {
      fields: Object.keys(cold.user_data).length,
      score: cold.dataQualityScore,
    },
    warmEvent: {
      fields: warm ? Object.keys(warm).filter(k => warm[k as keyof typeof warm]).length : 0,
      score: warm?.dataQualityScore || 0,
    },
    improvement: warm
      ? `+${warm.dataQualityScore - cold.dataQualityScore} points after Lead`
      : 'No warm data yet',
  };
}

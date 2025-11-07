/**
 * Cold Events Enrichment - Enriquecer dados antes do Lead
 */

'use client';

import { UserData } from '../storage/user-data';
import { logger } from '../logger';

interface IPGeolocation {
  city?: string;
  state?: string;
  country: string;
  zip?: string;
}

/**
 * Cache de geolocalização (evita múltiplas requests)
 */
let geoCache: IPGeolocation | null = null;
let geoPromise: Promise<IPGeolocation | null> | null = null;

/**
 * Obter geolocalização via IP (API pública)
 */
async function getIPGeolocation(): Promise<IPGeolocation | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(2000)
    });

    if (response.ok) {
      const data = await response.json();

      if (!data.country_code) {
        return null;
      }

      return {
        city: data.city?.toLowerCase(),
        state: data.region_code?.toLowerCase(),
        country: data.country_code.toLowerCase(),
        zip: data.postal
      };
    }
  } catch (error) {
    logger.debug('IP geolocation unavailable', error);
  }

  return null;
}

/**
 * Obter geolocalização com cache
 */
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

/**
 * Enriquecer user data com geolocalização
 */
export async function enrichWithGeolocation(
  userData: Partial<UserData>
): Promise<UserData> {
  const enriched: UserData = { ...userData };

  // Apenas enriquecer se faltar dados de localização
  if (!enriched.city || !enriched.state) {
    try {
      const geo = await getCachedIPGeolocation();

      if (geo) {
        enriched.city = enriched.city || geo.city;
        enriched.state = enriched.state || geo.state;
        enriched.zip = enriched.zip || geo.zip;
        enriched.country = enriched.country || geo.country;

        logger.debug('Enriched with geolocation', { 
          city: geo.city, 
          state: geo.state 
        });
      }
    } catch (error) {
      logger.debug('Failed to enrich with geolocation', error);
    }
  }

  // Garantir country sempre presente
  if (!enriched.country) {
    enriched.country = 'br';
  }

  return enriched;
}

/**
 * Browser fingerprint (contexto, não tracking invasivo)
 */
export function getBrowserContext() {
  if (typeof window === 'undefined') return {};

  const ua = navigator.userAgent;

  return {
    device_type: /Mobile|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop',
    language: navigator.language || 'pt-BR',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

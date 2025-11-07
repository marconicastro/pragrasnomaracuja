/**
 * GTM DataLayer - Envio simplificado para GTM
 */

'use client';

import { logger } from '../logger';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const BROWSER_DELAY_MS = 200; // Delay para servidor chegar primeiro

/**
 * Garantir que DataLayer existe
 */
function ensureDataLayer(): void {
  if (typeof window === 'undefined') return;

  if (!window.dataLayer) {
    window.dataLayer = [];
  }
}

/**
 * Enviar evento para GTM DataLayer
 */
export async function sendToGTM(payload: Record<string, any>): Promise<void> {
  if (typeof window === 'undefined') return;

  ensureDataLayer();

  // Delay para servidor chegar primeiro no Facebook
  await new Promise(resolve => setTimeout(resolve, BROWSER_DELAY_MS));

  try {
    window.dataLayer.push(payload);
    logger.debug('DataLayer push', {
      event: payload.event,
      event_id: payload.event_id
    });
  } catch (error) {
    logger.error('Failed to push to DataLayer', error);
  }
}

/**
 * Limpar DataLayer (apenas para testes)
 */
export function clearDataLayer(): void {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.length = 0;
  }
}

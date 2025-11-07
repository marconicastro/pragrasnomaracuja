/**
 * Tracking System - Simplificado e unificado
 * Substitui: eliteMetaPixelTracking.ts (987 linhas) → ~200 linhas
 */

'use client';

import { getUserData, getMetaCookies, UserData } from '../storage/user-data';
import { logger, trackingLogger } from '../logger';
import { enrichWithGeolocation } from './enrichment';
import { sendToGTM } from './gtm';
import { generateEventId } from './event-id';

interface TrackingOptions {
  userData?: Partial<UserData>;
  skipEnrichment?: boolean;
  eventId?: string;
}

/**
 * Função principal de tracking - simplificada
 */
export async function trackEvent(
  eventName: string,
  params: Record<string, any> = {},
  options: TrackingOptions = {}
): Promise<void> {
  try {
    // 1. Gerar event ID
    const eventId = options.eventId || generateEventId(eventName);
    
    // 2. Obter user data
    let userData = options.userData || getUserData();
    
    // 3. Enriquecer se necessário (cold events)
    if (!options.skipEnrichment && (!userData || !userData.email)) {
      userData = await enrichWithGeolocation(userData || {});
    }
    
    // 4. Adicionar meta cookies
    const metaCookies = getMetaCookies();
    
    // 5. Preparar payload completo
    const payload = {
      event: eventName,
      event_id: eventId,
      ...params,
      user_data: {
        ...userData,
        fbp: metaCookies.fbp,
        fbc: metaCookies.fbc,
        user_id: userData?.sessionId
      }
    };
    
    // 6. Enviar para GTM
    await sendToGTM(payload);
    
    trackingLogger.event(eventName, eventId, {
      hasUserData: !!userData?.email,
      dataQualityScore: userData?.dataQualityScore || 0
    });
    
  } catch (error) {
    trackingLogger.error(eventName, error);
    // Não bloquear fluxo do usuário
  }
}

// ===== Eventos Específicos =====

/**
 * PageView - Primeiro evento na página
 */
export const trackPageView = () =>
  trackEvent('page_view', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_name: 'Sistema 4 Fases - Ebook Trips'
  });

/**
 * ViewContent - Visualização do produto
 */
export const trackViewContent = (customParams: Record<string, any> = {}) =>
  trackEvent('view_item', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_name: 'Sistema 4 Fases - Ebook Trips',
    content_type: 'product',
    ...customParams
  });

/**
 * AddToCart - Clique em "Comprar Agora"
 */
export const trackAddToCart = () =>
  trackEvent('add_to_cart', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_name: 'Sistema 4 Fases - Ebook Trips',
    num_items: 1
  });

/**
 * Lead - Preenchimento do formulário
 */
export const trackLead = (userData: Partial<UserData>) =>
  trackEvent('generate_lead', {
    value: 15.0,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_name: 'Sistema 4 Fases - Ebook Trips'
  }, { userData, skipEnrichment: true });

/**
 * InitiateCheckout - Iniciar checkout
 */
export const trackInitiateCheckout = (userData: Partial<UserData>) =>
  trackEvent('begin_checkout', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_name: 'Sistema 4 Fases - Ebook Trips',
    num_items: 1
  }, { userData, skipEnrichment: true });

/**
 * Purchase - Conversão (via webhook)
 */
export const trackPurchase = (orderId: string, userData: Partial<UserData>, value: number = 39.9) =>
  trackEvent('purchase', {
    transaction_id: orderId,
    value,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_name: 'Sistema 4 Fases - Ebook Trips',
    num_items: 1
  }, { userData, skipEnrichment: true, eventId: `purchase_${orderId}` });

/**
 * Scroll Depth - Eventos customizados
 */
export const trackScrollDepth = (percent: number) =>
  trackEvent('scroll_depth', { percent, scroll_depth: percent });

/**
 * CTA Click - Cliques em CTAs secundários
 */
export const trackCTAClick = (buttonText: string) =>
  trackEvent('cta_click', { button_text: buttonText });

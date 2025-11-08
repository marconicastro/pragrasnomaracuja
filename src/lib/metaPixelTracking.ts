/**
 * 🚨 Legacy Meta Pixel wrappers (deprecated)
 *
 * Esses exports permanecem por compatibilidade e agora delegam
 * diretamente para as versões Elite (DataLayer + GTM Server-Side).
 */

'use client';

export {
  trackPageViewElite as trackPageView,
  trackViewContentElite as trackViewContent,
  trackScrollDepthElite as trackScrollDepth,
  trackCTAClickElite as trackCTAClick,
  trackLeadElite as trackLead,
  trackInitiateCheckoutElite as trackInitiateCheckout,
  trackPurchaseElite as trackPurchase
} from './eliteMetaPixelTracking';

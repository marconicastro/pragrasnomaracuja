/**
 * ?? Meta Pixel Tracking via Stape CAPIG Gateway
 * 
 * Sistema correto usando window.fbq() + Stape Conversions API Gateway
 * 
 * Fluxo:
 * 1. window.fbq() dispara evento
 * 2. Meta Pixel envia via browser (tradicional)
 * 3. Stape intercepta via server_event_uri e envia server-side
 * 4. Meta deduplica usando event_id
 */

declare global {
  interface Window {
    fbq: (command: string, eventName: string, parameters?: any, options?: any) => void;
  }
}

/**
 * Gera Event ID ?nico para deduplica??o
 */
function generateEventId(eventName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  return `${eventName}_${timestamp}_${random}`;
}

/**
 * Envia evento via Meta Pixel (Stape intercepta automaticamente)
 */
function trackMetaEvent(
  eventName: string,
  params: Record<string, any> = {},
  eventType: 'standard' | 'custom' = 'standard'
): { eventId: string; success: boolean } {
  
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('?? Meta Pixel n?o est? carregado');
    return { eventId: '', success: false };
  }

  // Gerar event ID ?nico para deduplica??o
  const eventID = generateEventId(eventName);

  try {
    // Disparar evento via Meta Pixel
    if (eventType === 'custom') {
      window.fbq('trackCustom', eventName, params, { eventID });
    } else {
      window.fbq('track', eventName, params, { eventID });
    }

    console.log(`?? ${eventName} disparado`, {
      eventID,
      eventType,
      via: 'Meta Pixel + Stape CAPIG Gateway'
    });

    return { eventId: eventID, success: true };
  } catch (error) {
    console.error(`? Erro ao disparar ${eventName}:`, error);
    return { eventId: eventID, success: false };
  }
}

// ===== EVENTOS ESPEC?FICOS =====

/**
 * ?? PageView
 */
export function trackPageView(customParams: Record<string, any> = {}) {
  return trackMetaEvent('PageView', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    ...customParams
  }, 'standard');
}

/**
 * ??? ViewContent
 */
export function trackViewContent(customParams: Record<string, any> = {}) {
  return trackMetaEvent('ViewContent', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    content_category: 'digital_product',
    ...customParams
  }, 'standard');
}

/**
 * ?? ScrollDepth (custom event)
 */
export function trackScrollDepth(
  percent: number,
  customParams: Record<string, any> = {}
) {
  return trackMetaEvent('ScrollDepth', {
    percent,
    scroll_depth: percent,
    ...customParams
  }, 'custom');
}

/**
 * ??? CTA Click (custom event)
 */
export function trackCTAClick(
  buttonText: string,
  customParams: Record<string, any> = {}
) {
  return trackMetaEvent('CTAClick', {
    button_text: buttonText,
    content_name: `CTA: ${buttonText}`,
    ...customParams
  }, 'custom');
}

/**
 * ?? Lead
 * 
 * IMPORTANTE: userData ser? automaticamente capturado pelo Meta Pixel
 * atrav?s dos dados de Advanced Matching e persist?ncia do browser
 */
export function trackLead(
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    zip?: string;
  } = {},
  customParams: Record<string, any> = {}
) {
  // Preparar user_data (Meta Pixel vai hashear automaticamente)
  const userDataFormatted: Record<string, any> = {};
  
  if (userData.email) userDataFormatted.em = userData.email;
  if (userData.phone) userDataFormatted.ph = userData.phone;
  if (userData.firstName) userDataFormatted.fn = userData.firstName;
  if (userData.lastName) userDataFormatted.ln = userData.lastName;
  if (userData.city) userDataFormatted.ct = userData.city;
  if (userData.state) userDataFormatted.st = userData.state;
  if (userData.zip) userDataFormatted.zp = userData.zip;

  return trackMetaEvent('Lead', {
    value: 15.0,
    currency: 'BRL',
    content_name: 'Formul?rio de Contato - Sistema 4 Fases',
    content_category: 'lead_generation',
    ...(Object.keys(userDataFormatted).length > 0 && { user_data: userDataFormatted }),
    ...customParams
  }, 'standard');
}

/**
 * ?? InitiateCheckout
 */
export function trackInitiateCheckout(
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    zip?: string;
  } = {},
  customParams: Record<string, any> = {}
) {
  // Preparar user_data
  const userDataFormatted: Record<string, any> = {};
  
  if (userData.email) userDataFormatted.em = userData.email;
  if (userData.phone) userDataFormatted.ph = userData.phone;
  if (userData.firstName) userDataFormatted.fn = userData.firstName;
  if (userData.lastName) userDataFormatted.ln = userData.lastName;
  if (userData.city) userDataFormatted.ct = userData.city;
  if (userData.state) userDataFormatted.st = userData.state;
  if (userData.zip) userDataFormatted.zp = userData.zip;

  return trackMetaEvent('InitiateCheckout', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    num_items: 1,
    ...(Object.keys(userDataFormatted).length > 0 && { user_data: userDataFormatted }),
    ...customParams
  }, 'standard');
}

/**
 * ?? Purchase
 */
export function trackPurchase(
  orderId: string,
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  } = {},
  customParams: Record<string, any> = {}
) {
  // Preparar user_data
  const userDataFormatted: Record<string, any> = {};
  
  if (userData.email) userDataFormatted.em = userData.email;
  if (userData.phone) userDataFormatted.ph = userData.phone;
  if (userData.firstName) userDataFormatted.fn = userData.firstName;
  if (userData.lastName) userDataFormatted.ln = userData.lastName;

  return trackMetaEvent('Purchase', {
    value: 39.9,
    currency: 'BRL',
    content_ids: ['hacr962'],
    content_type: 'product',
    content_name: 'Sistema 4 Fases - Ebook Trips',
    num_items: 1,
    transaction_id: orderId,
    ...(Object.keys(userDataFormatted).length > 0 && { user_data: userDataFormatted }),
    ...customParams
  }, 'standard');
}

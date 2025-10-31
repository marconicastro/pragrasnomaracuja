/**
 * ?? Servi?o de Tracking Server-Side via Stape.io
 * 
 * Sistema simplificado e limpo para enviar eventos Meta
 * atrav?s do Stape.io Meta Conversions API Gateway
 */

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface TrackEventParams {
  eventName: string;
  eventType?: 'standard' | 'custom';
  customParams?: Record<string, any>;
  userData?: UserData;
}

/**
 * Envia evento para API route que comunica com Stape.io
 */
export async function trackEvent({
  eventName,
  eventType = 'standard',
  customParams = {},
  userData = {},
}: TrackEventParams): Promise<{
  success: boolean;
  eventId?: string;
  error?: string;
}> {
  try {
    console.log(`?? Enviando evento: ${eventName}`);

    const response = await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventType,
        customParams: {
          event_source_url: typeof window !== 'undefined' ? window.location.href : '',
          ...customParams,
        },
        userData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`? Erro ao enviar ${eventName}:`, errorData);
      return {
        success: false,
        error: errorData.error || 'Erro desconhecido',
      };
    }

    const result = await response.json();
    console.log(`? ${eventName} enviado com sucesso:`, result);

    return {
      success: true,
      eventId: result.eventId,
    };
  } catch (error: any) {
    console.error(`? Erro ao enviar ${eventName}:`, error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ===== EVENTOS ESPEC?FICOS =====

/**
 * ?? PageView
 */
export async function trackPageView(customParams: Record<string, any> = {}) {
  return trackEvent({
    eventName: 'PageView',
    eventType: 'standard',
    customParams: {
      value: 39.9,
      currency: 'BRL',
      content_ids: ['339591'],
      content_type: 'product',
      content_name: 'Sistema 4 Fases - Ebook Trips',
      ...customParams,
    },
  });
}

/**
 * ??? ViewContent
 */
export async function trackViewContent(customParams: Record<string, any> = {}) {
  return trackEvent({
    eventName: 'ViewContent',
    eventType: 'standard',
    customParams: {
      value: 39.9,
      currency: 'BRL',
      content_ids: ['339591'],
      content_type: 'product',
      content_name: 'Sistema 4 Fases - Ebook Trips',
      ...customParams,
    },
  });
}

/**
 * ?? ScrollDepth (custom event)
 */
export async function trackScrollDepth(
  percent: number,
  customParams: Record<string, any> = {}
) {
  return trackEvent({
    eventName: 'ScrollDepth',
    eventType: 'custom',
    customParams: {
      percent,
      scroll_depth: percent,
      ...customParams,
    },
  });
}

/**
 * ??? CTA Click (custom event)
 */
export async function trackCTAClick(
  buttonText: string,
  customParams: Record<string, any> = {}
) {
  return trackEvent({
    eventName: 'CTAClick',
    eventType: 'custom',
    customParams: {
      button_text: buttonText,
      content_name: `CTA: ${buttonText}`,
      ...customParams,
    },
  });
}

/**
 * ?? Lead
 */
export async function trackLead(
  userData: UserData,
  customParams: Record<string, any> = {}
) {
  return trackEvent({
    eventName: 'Lead',
    eventType: 'standard',
    customParams: {
      value: 15.0,
      currency: 'BRL',
      content_name: 'Formul?rio de Contato - Sistema 4 Fases',
      content_category: 'lead_generation',
      ...customParams,
    },
    userData,
  });
}

/**
 * ?? InitiateCheckout
 */
export async function trackInitiateCheckout(
  userData: UserData,
  customParams: Record<string, any> = {}
) {
  return trackEvent({
    eventName: 'InitiateCheckout',
    eventType: 'standard',
    customParams: {
      value: 39.9,
      currency: 'BRL',
      content_ids: ['339591'],
      content_type: 'product',
      content_name: 'Sistema 4 Fases - Ebook Trips',
      num_items: 1,
      ...customParams,
    },
    userData,
  });
}

/**
 * ?? Purchase
 */
export async function trackPurchase(
  userData: UserData,
  orderId: string,
  customParams: Record<string, any> = {}
) {
  return trackEvent({
    eventName: 'Purchase',
    eventType: 'standard',
    customParams: {
      value: 39.9,
      currency: 'BRL',
      content_ids: ['339591'],
      content_type: 'product',
      content_name: 'Sistema 4 Fases - Ebook Trips',
      num_items: 1,
      order_id: orderId,
      ...customParams,
    },
    userData,
  });
}

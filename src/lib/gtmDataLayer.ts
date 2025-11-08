/**
 * 🎯 GTM DataLayer Helper
 * 
 * Gerencia o envio de eventos para o DataLayer do GTM
 * Compatível com GA4 Enhanced Ecommerce e formato padrão do GTM
 */

declare global {
  interface Window {
    dataLayer: any[];
  }
}

import { normalizeUserData } from './utils/metaDataNormalizer';

// ===== CONFIGURAÇÃO =====

const PRODUCT_CONFIG = {
  item_id: 'hacr962',
  item_name: 'Sistema 4 Fases - Ebook Trips',
  price: 39.9,
  currency: 'BRL',
  category: 'digital_product',
  content_type: 'product'
};

// ===== TIPOS =====

interface EcommerceItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_category?: string;
  item_brand?: string;
}

interface UserData {
  user_id?: string;
  email_address?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  fbp?: string;  // ✅ Facebook Browser ID (crítico para deduplicação)
  fbc?: string;   // ✅ Facebook Click ID (crítico para atribuição)
}

interface DataLayerEvent {
  event: string;
  ecommerce?: {
    transaction_id?: string;
    value?: number;
    currency?: string;
    items?: EcommerceItem[];
  };
  user_data?: UserData;
  content_ids?: string[];
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
  num_items?: number;
  search_string?: string;
  coupon?: string;
  [key: string]: any;
}

// ===== UTILITÁRIOS =====

/**
 * Inicializa o DataLayer se não existir
 */
function ensureDataLayer(): void {
  if (typeof window === 'undefined') return;
  
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
}

/**
 * Prepara item de ecommerce no formato GA4
 */
function prepareEcommerceItem(
  itemId: string = PRODUCT_CONFIG.item_id,
  itemName: string = PRODUCT_CONFIG.item_name,
  price: number = PRODUCT_CONFIG.price,
  quantity: number = 1
): EcommerceItem {
  return {
    item_id: itemId,
    item_name: itemName,
    price: price,
    quantity: quantity,
    item_category: PRODUCT_CONFIG.category,
    item_brand: 'Ebook Trips'
  };
}

/**
 * Prepara user_data no formato do GTM
 * ✅ INCLUI: fbp, fbc, country, external_id (user_id) para igualar Server-Side
 */
function prepareUserData(userData?: Partial<UserData>): UserData | undefined {
  if (!userData || Object.keys(userData).length === 0) {
    return undefined;
  }

  const normalized = normalizeUserData({
    email: userData.email_address,
    firstName: userData.first_name,
    lastName: userData.last_name,
    phone: userData.phone_number,
    city: userData.city,
    state: userData.region,
    zip: userData.postal_code,
    country: userData.country
  });

  const prepared: UserData = {
    // ✅ CRÍTICO: Incluir TODOS os campos, mesmo que vazios (GTM precisa de todos)
    user_id: userData.user_id,
    email_address: normalized.email || userData.email_address,
    phone_number: normalized.phone || userData.phone_number,
    first_name: normalized.firstName || userData.first_name,
    last_name: normalized.lastName || userData.last_name,
    city: normalized.city || userData.city,
    region: normalized.state || userData.region,
    postal_code: normalized.zip || userData.postal_code,
    country: normalized.country || userData.country || 'br',
    // ✅ CRÍTICO: Incluir fbp e fbc (necessários para captura completa pelo GTM)
    fbp: userData.fbp,
    fbc: userData.fbc
  };

  return prepared;
}

/**
 * Prepara content_ids e contents no formato Meta/GTM
 */
function prepareContentData(
  contentIds: string[] = [PRODUCT_CONFIG.item_id],
  quantity: number = 1
) {
  return {
    content_ids: contentIds,
    contents: contentIds.map(id => ({
      id: id,
      quantity: quantity,
      item_price: PRODUCT_CONFIG.price
    }))
  };
}

// ===== FUNÇÃO PRINCIPAL =====

/**
 * Envia evento para o DataLayer do GTM
 * 
 * IMPORTANTE: Se event_id não for fornecido, será gerado automaticamente
 */
export function pushToDataLayer(eventData: DataLayerEvent, eventId?: string): void {
  if (typeof window === 'undefined') return;
  
  ensureDataLayer();
  
  // Gerar event_id se não fornecido
  let finalEventId = eventId;
  if (!finalEventId && eventData.event) {
    // Client-side: gerar event_id único
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 12);
    finalEventId = `${eventData.event}_${timestamp}_${random}`;
  }
  
  // ✅ CRÍTICO: Adicionar event_id e action_source
  const eventDataWithMeta = {
    ...eventData,
    ...(finalEventId && { event_id: finalEventId }),
    // ✅ action_source: Indica origem do evento para o Meta
    action_source: 'website' // Browser events sempre são 'website'
  };
  
  try {
    window.dataLayer.push(eventDataWithMeta);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 DataLayer push:', {
        event: eventDataWithMeta.event,
        event_id: finalEventId,
        action_source: 'website'
      });
    }
  } catch (error) {
    console.error('❌ Erro ao enviar para DataLayer:', error);
  }
}

// ===== EVENTOS ESPECÍFICOS =====

/**
 * 📄 page_view
 * 
 * IMPORTANTE: Campos também no nível raiz para facilitar acesso no GTM Server-Side
 */
export function pushPageView(userData?: Partial<UserData>, eventId?: string): void {
  const preparedUserData = prepareUserData(userData);
  
  // 🔧 DEDUPLICAÇÃO: fbp/fbc apenas em user_data (não no custom_data raiz)
  pushToDataLayer({
    event: 'page_view',
    // ✅ Campos user_data no nível raiz (para acesso direto no GTM)
    // ✅ CRÍTICO: Incluir TODOS os campos para garantir captura completa pelo GTM
    ...(preparedUserData?.email_address && { email_address: preparedUserData.email_address }),
    ...(preparedUserData?.phone_number && { phone_number: preparedUserData.phone_number }),
    ...(preparedUserData?.first_name && { first_name: preparedUserData.first_name }),
    ...(preparedUserData?.last_name && { last_name: preparedUserData.last_name }),
    ...(preparedUserData?.city && { city: preparedUserData.city }),
    ...(preparedUserData?.region && { region: preparedUserData.region }),
    ...(preparedUserData?.postal_code && { postal_code: preparedUserData.postal_code }),
    ...(preparedUserData?.country && { country: preparedUserData.country }),
    ...(preparedUserData?.user_id && { user_id: preparedUserData.user_id }),
    ...(preparedUserData?.fbp && { fbp: preparedUserData.fbp }),
    ...(preparedUserData?.fbc && { fbc: preparedUserData.fbc }),
    // ✅ user_data contém tudo (incluindo fbp/fbc)
    user_data: preparedUserData
  }, eventId);
}

/**
 * 👁️ view_item (view_content)
 * 
 * IMPORTANTE: Campos também no nível raiz para facilitar acesso no GTM Server-Side
 */
export function pushViewItem(
  value: number = PRODUCT_CONFIG.price,
  currency: string = PRODUCT_CONFIG.currency,
  userData?: Partial<UserData>,
  eventId?: string
): void {
  const contentData = prepareContentData();
  const preparedUserData = prepareUserData(userData);
  
  // 🔧 DEDUPLICAÇÃO: Remover items e fbp/fbc do custom_data raiz
  pushToDataLayer({
    event: 'view_item',
    // ❌ REMOVIDO ecommerce.items
    value: value,
    currency: currency,
    ...contentData,
    content_name: PRODUCT_CONFIG.item_name,
    content_type: PRODUCT_CONFIG.content_type,
    num_items: 1,
    // ✅ Campos user_data no nível raiz
    // ✅ CRÍTICO: Incluir TODOS os campos para garantir captura completa pelo GTM
    ...(preparedUserData?.email_address && { email_address: preparedUserData.email_address }),
    ...(preparedUserData?.phone_number && { phone_number: preparedUserData.phone_number }),
    ...(preparedUserData?.first_name && { first_name: preparedUserData.first_name }),
    ...(preparedUserData?.last_name && { last_name: preparedUserData.last_name }),
    ...(preparedUserData?.city && { city: preparedUserData.city }),
    ...(preparedUserData?.region && { region: preparedUserData.region }),
    ...(preparedUserData?.postal_code && { postal_code: preparedUserData.postal_code }),
    ...(preparedUserData?.country && { country: preparedUserData.country }),
    ...(preparedUserData?.user_id && { user_id: preparedUserData.user_id }),
    ...(preparedUserData?.fbp && { fbp: preparedUserData.fbp }),
    ...(preparedUserData?.fbc && { fbc: preparedUserData.fbc }),
    // ✅ user_data contém tudo (incluindo fbp/fbc)
    user_data: preparedUserData
  }, eventId);
}

/**
 * 🛒 add_to_cart
 * 
 * IMPORTANTE: Campos também no nível raiz para facilitar acesso no GTM Server-Side
 */
export function pushAddToCart(
  value: number = PRODUCT_CONFIG.price,
  currency: string = PRODUCT_CONFIG.currency,
  quantity: number = 1,
  userData?: Partial<UserData>,
  eventId?: string
): void {
  const contentData = prepareContentData([PRODUCT_CONFIG.item_id], quantity);
  const preparedUserData = prepareUserData(userData);
  
  // 🔧 DEDUPLICAÇÃO: Remover items e fbp/fbc do custom_data raiz
  pushToDataLayer({
    event: 'add_to_cart',
    // ❌ REMOVIDO ecommerce.items
    value: value,
    currency: currency,
    ...contentData,
    content_name: PRODUCT_CONFIG.item_name,
    content_type: PRODUCT_CONFIG.content_type,
    num_items: quantity,
    // ✅ Campos user_data no nível raiz
    // ✅ CRÍTICO: Incluir TODOS os campos para garantir captura completa pelo GTM
    ...(preparedUserData?.email_address && { email_address: preparedUserData.email_address }),
    ...(preparedUserData?.phone_number && { phone_number: preparedUserData.phone_number }),
    ...(preparedUserData?.first_name && { first_name: preparedUserData.first_name }),
    ...(preparedUserData?.last_name && { last_name: preparedUserData.last_name }),
    ...(preparedUserData?.city && { city: preparedUserData.city }),
    ...(preparedUserData?.region && { region: preparedUserData.region }),
    ...(preparedUserData?.postal_code && { postal_code: preparedUserData.postal_code }),
    ...(preparedUserData?.country && { country: preparedUserData.country }),
    ...(preparedUserData?.user_id && { user_id: preparedUserData.user_id }),
    ...(preparedUserData?.fbp && { fbp: preparedUserData.fbp }),
    ...(preparedUserData?.fbc && { fbc: preparedUserData.fbc }),
    // ✅ user_data contém tudo (incluindo fbp/fbc)
    user_data: preparedUserData
  }, eventId);
}

/**
 * 🛍️ begin_checkout
 * 
 * IMPORTANTE: Campos também no nível raiz para facilitar acesso no GTM Server-Side
 */
export function pushBeginCheckout(
  value: number = PRODUCT_CONFIG.price,
  currency: string = PRODUCT_CONFIG.currency,
  quantity: number = 1,
  userData?: Partial<UserData>,
  eventId?: string
): void {
  const contentData = prepareContentData([PRODUCT_CONFIG.item_id], quantity);
  const preparedUserData = prepareUserData(userData);
  
  // 🔧 DEDUPLICAÇÃO: Remover items do ecommerce para igualar com servidor
  // Servidor NÃO envia items dentro de ecommerce, apenas value/currency
  // Meta usa custom_data para deduplica, então ambos devem ser idênticos
  
  pushToDataLayer({
    event: 'begin_checkout',
    // ❌ REMOVIDO ecommerce.items (servidor não tem)
    // Apenas value/currency no nível raiz
    value: value,
    currency: currency,
    // ✅ Manter content_ids, contents, num_items (servidor tem)
    ...contentData,
    content_name: PRODUCT_CONFIG.item_name,
    content_type: PRODUCT_CONFIG.content_type,
    num_items: quantity,
    // ✅ Campos user_data no nível raiz (para acesso direto no GTM)
    // ✅ CRÍTICO: Incluir TODOS os campos para garantir captura completa pelo GTM
    ...(preparedUserData?.email_address && { email_address: preparedUserData.email_address }),
    ...(preparedUserData?.phone_number && { phone_number: preparedUserData.phone_number }),
    ...(preparedUserData?.first_name && { first_name: preparedUserData.first_name }),
    ...(preparedUserData?.last_name && { last_name: preparedUserData.last_name }),
    ...(preparedUserData?.city && { city: preparedUserData.city }),
    ...(preparedUserData?.region && { region: preparedUserData.region }),
    ...(preparedUserData?.postal_code && { postal_code: preparedUserData.postal_code }),
    ...(preparedUserData?.country && { country: preparedUserData.country }),
    ...(preparedUserData?.user_id && { user_id: preparedUserData.user_id }),
    ...(preparedUserData?.fbp && { fbp: preparedUserData.fbp }),
    ...(preparedUserData?.fbc && { fbc: preparedUserData.fbc }),
    // ✅ user_data contém tudo (incluindo fbp/fbc)
    user_data: preparedUserData
  }, eventId);
}

/**
 * 💰 purchase
 * 
 * Evento: 'purchase' (nome específico para trigger do GTM)
 */
export function pushPurchase(
  transactionId: string,
  value: number = PRODUCT_CONFIG.price,
  currency: string = PRODUCT_CONFIG.currency,
  quantity: number = 1,
  userData?: Partial<UserData>
): void {
  const contentData = prepareContentData([PRODUCT_CONFIG.item_id], quantity);
  const preparedUserData = prepareUserData(userData);
  
  pushToDataLayer({
    event: 'purchase', // Nome específico para trigger 'ce - purchase' no GTM
    ecommerce: {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: [prepareEcommerceItem(PRODUCT_CONFIG.item_id, PRODUCT_CONFIG.item_name, value, quantity)]
    },
    ...contentData,
    content_name: PRODUCT_CONFIG.item_name,  // ✅ Adicionar para Meta custom_data
    content_type: PRODUCT_CONFIG.content_type,  // ✅ Adicionar para Meta custom_data
    num_items: quantity,
    // ✅ Campos ecommerce no nível raiz (para acesso direto: {{ed - value}}, {{ed - currency}})
    value: value,
    currency: currency,
    // ✅ Campos user_data no nível raiz (para acesso direto: {{ed - email_address}})
    ...(preparedUserData?.email_address && { email_address: preparedUserData.email_address }),
    ...(preparedUserData?.phone_number && { phone_number: preparedUserData.phone_number }),
    ...(preparedUserData?.first_name && { first_name: preparedUserData.first_name }),
    ...(preparedUserData?.last_name && { last_name: preparedUserData.last_name }),
    ...(preparedUserData?.city && { city: preparedUserData.city }),
    ...(preparedUserData?.region && { region: preparedUserData.region }),
    ...(preparedUserData?.postal_code && { postal_code: preparedUserData.postal_code }),
    ...(preparedUserData?.country && { country: preparedUserData.country }),
    // ✅ CRÍTICO: Incluir fbp, fbc, user_id no nível raiz (igualar Server-Side)
    ...(preparedUserData?.user_id && { user_id: preparedUserData.user_id }),
    ...(preparedUserData?.fbp && { fbp: preparedUserData.fbp }),
    ...(preparedUserData?.fbc && { fbc: preparedUserData.fbc }),
    // ✅ Campos também dentro de user_data (para compatibilidade)
    user_data: preparedUserData
  });
}

/**
 * 📝 generate_lead
 * 
 * Evento: 'generate_lead' (nome específico para trigger do GTM)
 * 
 * IMPORTANTE: Campos também no nível raiz para facilitar acesso no GTM Server-Side
 */
export function pushGenerateLead(
  userData: Partial<UserData>,
  value?: number,
  eventId?: string
): void {
  const contentData = prepareContentData();
  const preparedUserData = prepareUserData(userData);
  
  // 🔧 DEDUPLICAÇÃO: fbp/fbc apenas em user_data
  pushToDataLayer({
    event: 'generate_lead',
    ...(value && {
      value: value,
      currency: PRODUCT_CONFIG.currency
    }),
    ...contentData,
    // ✅ Campos no nível raiz
    // ✅ CRÍTICO: Incluir TODOS os campos para garantir captura completa pelo GTM
    ...(preparedUserData?.email_address && { email_address: preparedUserData.email_address }),
    ...(preparedUserData?.phone_number && { phone_number: preparedUserData.phone_number }),
    ...(preparedUserData?.first_name && { first_name: preparedUserData.first_name }),
    ...(preparedUserData?.last_name && { last_name: preparedUserData.last_name }),
    ...(preparedUserData?.city && { city: preparedUserData.city }),
    ...(preparedUserData?.region && { region: preparedUserData.region }),
    ...(preparedUserData?.postal_code && { postal_code: preparedUserData.postal_code }),
    ...(preparedUserData?.country && { country: preparedUserData.country }),
    ...(preparedUserData?.user_id && { user_id: preparedUserData.user_id }),
    ...(preparedUserData?.fbp && { fbp: preparedUserData.fbp }),
    ...(preparedUserData?.fbc && { fbc: preparedUserData.fbc }),
    // ✅ user_data contém tudo (incluindo fbp/fbc)
    user_data: preparedUserData
  }, eventId);
}

// ===== FUNÇÃO GENÉRICA PARA EVENTOS PERSONALIZADOS =====

/**
 * Evento customizado para o DataLayer
 */
export function pushCustomEvent(
  eventName: string,
  params: Record<string, any> = {},
  userData?: Partial<UserData>
): void {
  pushToDataLayer({
    event: eventName,
    ...params,
    user_data: prepareUserData(userData)
  });
}


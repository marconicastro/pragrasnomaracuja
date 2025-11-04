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
 */
function prepareUserData(userData?: Partial<UserData>): UserData | undefined {
  if (!userData || Object.keys(userData).length === 0) {
    return undefined;
  }

  return {
    user_id: userData.user_id,
    email_address: userData.email_address,
    phone_number: userData.phone_number,
    first_name: userData.first_name,
    last_name: userData.last_name,
    city: userData.city,
    region: userData.region,
    postal_code: userData.postal_code,
    country: userData.country || 'BR'
  };
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
 */
export function pushToDataLayer(eventData: DataLayerEvent): void {
  if (typeof window === 'undefined') return;
  
  ensureDataLayer();
  
  try {
    window.dataLayer.push(eventData);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 DataLayer push:', eventData);
    }
  } catch (error) {
    console.error('❌ Erro ao enviar para DataLayer:', error);
  }
}

// ===== EVENTOS ESPECÍFICOS =====

/**
 * 📄 page_view
 */
export function pushPageView(userData?: Partial<UserData>): void {
  pushToDataLayer({
    event: 'page_view',
    user_data: prepareUserData(userData)
  });
}

/**
 * 👁️ view_item (view_content)
 */
export function pushViewItem(
  value: number = PRODUCT_CONFIG.price,
  currency: string = PRODUCT_CONFIG.currency,
  userData?: Partial<UserData>
): void {
  const contentData = prepareContentData();
  
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      value: value,
      currency: currency,
      items: [prepareEcommerceItem()]
    },
    ...contentData,
    user_data: prepareUserData(userData)
  });
}

/**
 * 🛒 add_to_cart
 */
export function pushAddToCart(
  value: number = PRODUCT_CONFIG.price,
  currency: string = PRODUCT_CONFIG.currency,
  quantity: number = 1,
  userData?: Partial<UserData>
): void {
  const contentData = prepareContentData([PRODUCT_CONFIG.item_id], quantity);
  
  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      value: value,
      currency: currency,
      items: [prepareEcommerceItem(PRODUCT_CONFIG.item_id, PRODUCT_CONFIG.item_name, value, quantity)]
    },
    ...contentData,
    num_items: quantity,
    user_data: prepareUserData(userData)
  });
}

/**
 * 🛍️ begin_checkout
 */
export function pushBeginCheckout(
  value: number = PRODUCT_CONFIG.price,
  currency: string = PRODUCT_CONFIG.currency,
  quantity: number = 1,
  userData?: Partial<UserData>
): void {
  const contentData = prepareContentData([PRODUCT_CONFIG.item_id], quantity);
  
  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      value: value,
      currency: currency,
      items: [prepareEcommerceItem(PRODUCT_CONFIG.item_id, PRODUCT_CONFIG.item_name, value, quantity)]
    },
    ...contentData,
    num_items: quantity,
    user_data: prepareUserData(userData)
  });
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
  
  pushToDataLayer({
    event: 'purchase', // Nome específico para trigger 'ce - purchase' no GTM
    ecommerce: {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: [prepareEcommerceItem(PRODUCT_CONFIG.item_id, PRODUCT_CONFIG.item_name, value, quantity)]
    },
    ...contentData,
    num_items: quantity,
    user_data: prepareUserData(userData)
  });
}

/**
 * 📝 generate_lead
 * 
 * Evento: 'generate_lead' (nome específico para trigger do GTM)
 */
export function pushGenerateLead(
  userData: Partial<UserData>,
  value?: number
): void {
  const contentData = prepareContentData();
  
  pushToDataLayer({
    event: 'generate_lead', // Nome específico para trigger 'ce - generate_lead' no GTM
    ...(value && {
      ecommerce: {
        value: value,
        currency: PRODUCT_CONFIG.currency
      }
    }),
    ...contentData,
    user_data: prepareUserData(userData)
  });
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


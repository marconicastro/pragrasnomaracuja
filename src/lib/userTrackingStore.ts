/**
 * ?? User Tracking Store - Vercel KV (Redis)
 * 
 * Substitui Prisma para salvar fbp/fbc sem precisar de banco SQL
 * Funciona perfeitamente na Vercel!
 */

'use server';

// ===== INTERFACES =====

export interface UserTrackingData {
  email: string;
  fbp?: string;
  fbc?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
  // Attribution data (para manter no Purchase)
  attributionJourney?: string; // JSON stringified
  firstTouchSource?: string;
  firstTouchMedium?: string;
  lastTouchSource?: string;
  lastTouchMedium?: string;
  touchpointCount?: number;
  timeToConvert?: number;
  hasPaidClick?: boolean;
  // UTM data (para manter no Purchase)
  utmFirstSource?: string;
  utmFirstMedium?: string;
  utmFirstCampaign?: string;
  utmLastSource?: string;
  utmLastMedium?: string;
  utmLastCampaign?: string;
  utmTouchCount?: number;
  utmChannels?: string; // comma-separated
  // Facebook Native Parameters (dados ricos)
  fb_campaign_id?: string;
  fb_campaign_name?: string;
  fb_adset_id?: string;
  fb_adset_name?: string;
  fb_ad_id?: string;
  fb_ad_name?: string;
  fb_placement?: string;
  // External ID (session) - Meta Match Quality
  external_id?: string;
  // Timestamps
  createdAt: number;
  updatedAt: number;
}

// ===== VERCEL KV FUNCTIONS =====

/**
 * Salva dados do usu?rio no Vercel KV (Redis)
 */
export async function saveUserTracking(data: Omit<UserTrackingData, 'createdAt' | 'updatedAt'>): Promise<boolean> {
  try {
    // Tentar usar Vercel KV se dispon?vel
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import('@vercel/kv');
      
      const now = Date.now();
      const trackingData: UserTrackingData = {
        ...data,
        createdAt: now,
        updatedAt: now
      };
      
      // Salvar por email (chave principal)
      await kv.set(`user:email:${data.email.toLowerCase()}`, trackingData);
      
      // Salvar por telefone tamb?m (para busca alternativa)
      if (data.phone) {
        const phoneNormalized = normalizePhone(data.phone);
        await kv.set(`user:phone:${phoneNormalized}`, trackingData);
      }
      
      console.log('? User tracking salvo no Vercel KV:', {
        email: data.email,
        hasFbp: !!data.fbp,
        hasFbc: !!data.fbc,
        hasCity: !!data.city,
        hasState: !!data.state,
        hasZip: !!data.zip,
        city: data.city,
        state: data.state,
        zip: data.zip
      });
      
      return true;
    }
    
    // Fallback: Sem KV dispon?vel (desenvolvimento local)
    console.warn('?? Vercel KV n?o dispon?vel, dados n?o persistidos');
    return false;
    
  } catch (error) {
    console.error('? Erro ao salvar no Vercel KV:', error);
    return false;
  }
}

/**
 * Busca usu?rio por email OU telefone
 */
export async function getUserTracking(
  email: string, 
  phone?: string
): Promise<UserTrackingData | null> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import('@vercel/kv');
      
      // 1. Buscar por email (prioridade)
      let userData = await kv.get<UserTrackingData>(`user:email:${email.toLowerCase()}`);
      
      if (userData) {
        console.log('? User data encontrado por EMAIL:', email);
        return userData;
      }
      
      // 2. Buscar por telefone (fallback)
      if (phone) {
        const phoneNormalized = normalizePhone(phone);
        userData = await kv.get<UserTrackingData>(`user:phone:${phoneNormalized}`);
        
        if (userData) {
          console.log('? User data encontrado por TELEFONE:', phone);
          console.warn('?? Email diferente! Checkout:', email, '| Original:', userData.email);
          return userData;
        }
      }
      
      console.warn('? User data n?o encontrado:', { email, phone });
      return null;
    }
    
    console.warn('?? Vercel KV n?o dispon?vel');
    return null;
    
  } catch (error) {
    console.error('? Erro ao buscar no Vercel KV:', error);
    return null;
  }
}

// ===== UTILITIES =====

function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('55')) {
    return cleaned;
  }
  
  if (cleaned.length >= 10 && cleaned.length <= 11) {
    return `55${cleaned}`;
  }
  
  return cleaned;
}

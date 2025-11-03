/**
 * 🔄 Compatibilidade: userDataPersistence.ts
 * 
 * Este arquivo mantém compatibilidade com código legado que ainda usa
 * userDataPersistence.ts. Internamente redireciona para advancedDataPersistence.ts
 * 
 * NOTA: Este é um wrapper de compatibilidade. Novos códigos devem usar
 * advancedDataPersistence.ts diretamente.
 */

import {
  saveAdvancedUserData,
  getAdvancedUserData,
  clearAllUserData
} from '../advancedDataPersistence';

/**
 * Gera Session ID compatível
 */
function generateSessionIdCompat(): string {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Obtém Session ID do advancedDataPersistence ou gera novo
 */
function getAdvancedSessionId(): string {
  const data = getAdvancedUserData();
  if (data?.sessionId) {
    return data.sessionId;
  }
  
  // Se não tiver, tentar do localStorage diretamente
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('zc_session_id');
    if (stored) return stored;
    
    const persistentSession = localStorage.getItem('zc_persistent_session');
    if (persistentSession) return persistentSession;
  }
  
  // Gerar novo se não encontrar
  return generateSessionIdCompat();
}

// Tipagem compatível
interface PersistedUserData {
  email?: string;
  phone?: string;
  fullName?: string;
  city?: string;
  state?: string;
  cep?: string;
  timestamp: number;
  sessionId: string;
  consent: boolean;
}

/**
 * Salva dados do usuário (compatibilidade)
 * Internamente usa advancedDataPersistence
 */
export const saveUserData = (
  userData: {
    email?: string;
    phone?: string;
    fullName?: string;
    city?: string;
    state?: string;
    cep?: string;
  },
  consent: boolean = true
): void => {
  // Converter para formato advancedDataPersistence
  const nameParts = userData.fullName?.split(' ') || [];
  
  saveAdvancedUserData({
    email: userData.email,
    phone: userData.phone,
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' '),
    fullName: userData.fullName,
    city: userData.city,
    state: userData.state,
    zip: userData.cep?.replace(/\D/g, ''),
    country: 'br'
  }, consent);
};

/**
 * Recupera dados persistidos (compatibilidade)
 */
export const getPersistedUserData = (): PersistedUserData | null => {
  const advancedData = getAdvancedUserData();
  
  if (!advancedData) return null;
  
  // Converter para formato compatível
  return {
    email: advancedData.email,
    phone: advancedData.phone,
    fullName: advancedData.fullName || 
      (advancedData.firstName && advancedData.lastName 
        ? `${advancedData.firstName} ${advancedData.lastName}` 
        : undefined),
    city: advancedData.city,
    state: advancedData.state,
    cep: advancedData.zip,
    timestamp: advancedData.lastSeen || Date.now(),
    sessionId: advancedData.sessionId,
    consent: advancedData.consent || false
  };
};

/**
 * Obtém Session ID (compatibilidade)
 */
export const getSessionId = (): string => {
  return getAdvancedSessionId();
};

/**
 * Limpa dados (compatibilidade)
 */
export const clearPersistedData = (): void => {
  clearAllUserData();
};

/**
 * Verifica se há dados persistidos (compatibilidade)
 */
export const hasPersistedData = (): boolean => {
  return getAdvancedUserData() !== null;
};

/**
 * Atualiza dados específicos (compatibilidade)
 */
export const updatePersistedData = (updates: Partial<PersistedUserData>): void => {
  const existing = getPersistedUserData();
  if (existing) {
    saveUserData({
      ...existing,
      ...updates
    }, existing.consent);
  } else {
    saveUserData(updates, true);
  }
};

/**
 * Formata dados para Meta (compatibilidade)
 */
export const formatUserDataForMeta = (userData: PersistedUserData | null) => {
  if (!userData) return {};
  
  const phoneClean = userData.phone?.replace(/\D/g, '') || '';
  const phoneWithCountry = phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`;
  
  const nameParts = userData.fullName?.toLowerCase().trim().split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  
  return {
    em: userData.email?.toLowerCase().trim(),
    ph: phoneWithCountry,
    fn: firstName,
    ln: lastName,
    ct: userData.city?.toLowerCase().trim() || null,
    st: userData.state?.toLowerCase().trim() || null,
    zip: userData.cep?.replace(/\D/g, '') || null,
    country: 'br',
    external_id: userData.sessionId,
    client_ip_address: null,
    client_user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null
  };
};

/**
 * Inicializa persistência (compatibilidade)
 */
export const initializePersistence = (): PersistedUserData | null => {
  return getPersistedUserData();
};


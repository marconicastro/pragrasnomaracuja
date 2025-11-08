'use client';

import {
  clearSessionId as clearUnifiedSessionId,
  getSessionId as ensureSessionId,
  peekSessionId,
  refreshSessionId as refreshUnifiedSessionId,
  SESSION_PERSISTENT_KEY,
  SESSION_STORAGE_KEY,
} from './session';
import { logger } from './utils/logger';

// Tipagem para dados do usuário persistidos
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

// Configurações
const STORAGE_KEY = 'zc_user_data';
const EXPIRY_DAYS = 14; // 14 dias de persistência

// Verificar se dados são válidos (não expiraram)
const isDataValid = (data: PersistedUserData): boolean => {
  const now = Date.now();
  const expiryTime = EXPIRY_DAYS * 24 * 60 * 60 * 1000; // prazo em ms
  return now - data.timestamp < expiryTime;
};

// Limpar dados expirados
const cleanExpiredData = (): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: PersistedUserData = JSON.parse(stored);
      if (!isDataValid(data)) {
        localStorage.removeItem(STORAGE_KEY);
        logger.log('🗑️ Dados expirados removidos do localStorage');
      }
    }
  } catch (error) {
    logger.warn('⚠️ Erro ao limpar dados expirados:', error);
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Salvar dados do usuário com persistência (MANTENDO SESSÃO UNIFICADA)
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
  try {
    cleanExpiredData(); // Limpar dados expirados primeiro

    if (!consent) {
      localStorage.removeItem(STORAGE_KEY);
      logger.log('🛑 Consentimento negado, dados locais não persistidos');
      return;
    }

    // Obter sessão unificada (não gerar nova)
    const currentSessionId = ensureSessionId();

    const persistedData: PersistedUserData = {
      ...userData,
      timestamp: Date.now(),
      sessionId: currentSessionId, // Usar sessão existente
      consent,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedData));
    logger.log('💾 Dados do usuário salvos com sessão mantida:', {
      hasEmail: !!userData.email,
      hasPhone: !!userData.phone,
      hasLocation: !!(userData.city || userData.state || userData.cep),
      consent,
      sessionId: currentSessionId,
    });
  } catch (error) {
    logger.warn('⚠️ Erro ao salvar dados do usuário:', error);
  }
};

// Recuperar dados persistidos
export const getPersistedUserData = (): PersistedUserData | null => {
  try {
    cleanExpiredData(); // Limpar dados expirados primeiro

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: PersistedUserData = JSON.parse(stored);
      if (isDataValid(data) && data.consent) {
        logger.log('📥 Dados recuperados do localStorage:', {
          hasEmail: !!data.email,
          hasPhone: !!data.phone,
          hasLocation: !!(data.city || data.state || data.cep),
          consent: data.consent,
          sessionId: data.sessionId,
        });
        return data;
      }
    }
    return null;
  } catch (error) {
    logger.warn('⚠️ Erro ao recuperar dados persistidos:', error);
    return null;
  }
};

// Obter ou gerar ID de sessão UNIFICADO e PERSISTENTE
export const getSessionId = (): string => {
  return ensureSessionId();
};

// Forçar atualização da sessão (usado após formulário)
export const updateSessionId = (): string => {
  const newSessionId = refreshUnifiedSessionId();
  logger.log('🔄 Sessão atualizada:', newSessionId);
  return newSessionId;
};

// Verificar se a sessão atual é diferente da persistida
export const hasSessionChanged = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const currentSession = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    const persistedSession = window.localStorage.getItem(SESSION_PERSISTENT_KEY);
    return currentSession !== persistedSession;
  } catch {
    // Se não conseguir acessar storage, considerar que não mudou
    const current = peekSessionId();
    return current === null;
  }
};

// Limpar todos os dados (logout/opt-out)
export const clearPersistedData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    clearUnifiedSessionId();
    logger.log('🗑️ Todos os dados do usuário foram removidos');
  } catch (error) {
    logger.warn('⚠️ Erro ao limpar dados:', error);
  }
};

// Verificar se há dados persistidos
export const hasPersistedData = (): boolean => {
  const data = getPersistedUserData();
  return data !== null;
};

// Atualizar dados específicos (mantendo os existentes)
export const updatePersistedData = (updates: Partial<PersistedUserData>): void => {
  const existingData = getPersistedUserData();
  if (existingData) {
    saveUserData(
      {
        ...existingData,
        ...updates,
      },
      existingData.consent
    );
  } else {
    saveUserData(updates);
  }
};

// Formatar dados para Meta (Advanced Matching) - CORRIGIDO E MELHORADO
export const formatUserDataForMeta = (userData: PersistedUserData | null) => {
  if (!userData) return {};

  // Formatar telefone - Adicionar código do país (55)
  const phoneClean = userData.phone?.replace(/\D/g, '') || '';
  let phoneWithCountry = phoneClean;

  // Se não tiver código do país, adicionar 55
  if (phoneClean.length === 10) {
    phoneWithCountry = `55${phoneClean}`;
  } else if (phoneClean.length === 11) {
    phoneWithCountry = `55${phoneClean}`;
  }

  // Separar nome e sobrenome - converter para lowercase
  const nameParts = userData.fullName?.toLowerCase().trim().split(' ') || [];
  const firstName = nameParts[0] || '';
  // CORREÇÃO: Capturar todo o sobrenome independente da quantidade
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  // Formatar CEP no padrão Facebook (apenas números, já está correto)
  const zipCode = userData.cep?.replace(/\D/g, '') || '';

  // Adicionar country padrão Brasil
  const country = 'br';

  return {
    em: userData.email?.toLowerCase().trim(),
    ph: phoneWithCountry,
    fn: firstName,
    ln: lastName,
    ct: userData.city?.toLowerCase().trim() || null,
    st: userData.state?.toLowerCase().trim() || null,
    zip: zipCode || null,
    country: country,
    external_id: userData.sessionId,
    client_ip_address: null, // EXPLICAÇÃO: null é CORRETO no frontend!
    client_user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
  };
};

// Inicializar sistema de persistência
export const initializePersistence = (): PersistedUserData | null => {
  cleanExpiredData();
  const data = getPersistedUserData();

  if (data) {
    logger.log('🎯 Usuário identificado via dados persistidos:', {
      hasEmail: !!data.email,
      hasPhone: !!data.phone,
      sessionId: data.sessionId,
      daysStored: Math.round((Date.now() - data.timestamp) / (24 * 60 * 60 * 1000)),
    });
  } else {
    logger.log('👤 Novo usuário detectado, sem dados persistidos');
  }

  return data;
};

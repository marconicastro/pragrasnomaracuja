/**
 * User Data Storage - Sistema unificado de persistência
 * Substitui: advancedDataPersistence.ts, userDataPersistence.ts, userTrackingStore.ts
 */

'use client';

import { logger } from '../logger';

export interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  fbp?: string;
  fbc?: string;
  sessionId?: string;
  dataQualityScore?: number;
}

const STORAGE_KEY = 'user_data';
const SESSION_KEY = 'session_id';

/**
 * Classe singleton para gerenciar dados do usuário
 */
class UserDataStorage {
  private cache: UserData | null = null;
  private syncInProgress = false;

  /**
   * Salvar dados do usuário (localStorage + API sync)
   */
  async save(data: Partial<UserData>, consent: boolean = true): Promise<UserData> {
    const sessionId = this.getSessionId();
    
    // Merge com dados existentes
    const existingData = this.get() || {};
    const fullData: UserData = {
      ...existingData,
      ...data,
      sessionId,
      country: data.country || existingData.country || 'br',
      dataQualityScore: this.calculateDataQualityScore({ ...existingData, ...data })
    };

    // Salvar localmente (sincronamente)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData));
      this.cache = fullData;
      logger.debug('User data saved to localStorage', { fields: Object.keys(fullData).length });
    } catch (error) {
      logger.error('Failed to save to localStorage', error);
    }

    // Sync com servidor (assíncrono, não bloqueia)
    if (consent && !this.syncInProgress) {
      this.syncToServer(fullData);
    }

    return fullData;
  }

  /**
   * Obter dados do usuário (cache-first)
   */
  get(): UserData | null {
    if (this.cache) {
      return this.cache;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.cache = JSON.parse(stored);
        return this.cache;
      }
    } catch (error) {
      logger.error('Failed to parse user data from localStorage', error);
    }

    return null;
  }

  /**
   * Obter ou gerar session ID
   */
  getSessionId(): string {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
      sessionStorage.setItem(SESSION_KEY, sessionId);
      logger.debug('Generated new session ID', { sessionId });
    }
    
    return sessionId;
  }

  /**
   * Limpar todos os dados
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.cache = null;
    logger.debug('User data cleared');
  }

  /**
   * Sincronizar com servidor (não bloqueia UI)
   */
  private async syncToServer(data: UserData): Promise<void> {
    if (this.syncInProgress) return;

    this.syncInProgress = true;
    
    try {
      const response = await fetch('/api/save-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000) // 5s timeout
      });

      if (!response.ok) {
        throw new Error(`Server sync failed: ${response.status}`);
      }

      logger.debug('User data synced to server');
    } catch (error) {
      logger.warn('Failed to sync user data to server', error);
      // Não bloquear - dados já estão no localStorage
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Calcular Data Quality Score (0-100)
   */
  private calculateDataQualityScore(data: Partial<UserData>): number {
    let score = 0;

    // PII (vale mais)
    if (data.email) score += 15;
    if (data.phone) score += 15;
    if (data.firstName) score += 10;
    if (data.lastName) score += 10;

    // Localização
    if (data.city) score += 8;
    if (data.state) score += 8;
    if (data.zip) score += 5;
    if (data.country) score += 4;

    // Meta identifiers
    if (data.fbp) score += 15;
    if (data.fbc) score += 10;

    return Math.min(score, 100);
  }
}

// Singleton instance
const storage = new UserDataStorage();

// Exports simplificados
export const saveUserData = (data: Partial<UserData>, consent?: boolean) => 
  storage.save(data, consent);

export const getUserData = () => 
  storage.get();

export const getSessionId = () => 
  storage.getSessionId();

export const clearUserData = () => 
  storage.clear();

/**
 * Hook para obter Meta cookies
 */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return {
    fbp: cookies._fbp,
    fbc: cookies._fbc
  };
}

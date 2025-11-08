'use client';

import { logger } from './utils/logger';

export const SESSION_STORAGE_KEY = 'zc_session_id';
export const SESSION_PERSISTENT_KEY = 'zc_persistent_session';

const isBrowser = typeof window !== 'undefined';

function safeGetItem(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch (error) {
    logger.warn('Nao foi possivel persistir sessao no storage', { key, error });
  }
}

function safeRemoveItem(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    // ignore
  }
}

export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function storeSessionId(sessionId: string): void {
  if (!isBrowser) return;
  safeSetItem(window.sessionStorage, SESSION_STORAGE_KEY, sessionId);
  safeSetItem(window.localStorage, SESSION_PERSISTENT_KEY, sessionId);
}

function readStoredSessionId(): string | null {
  if (!isBrowser) return null;

  const fromSession = safeGetItem(window.sessionStorage, SESSION_STORAGE_KEY);
  if (fromSession) return fromSession;

  const fromPersistent = safeGetItem(window.localStorage, SESSION_PERSISTENT_KEY);
  return fromPersistent;
}

/**
 * Garante que exista um session_id unificado no navegador e o retorna.
 * Em ambiente server-side retorna um ID efêmero.
 */
export function getSessionId(): string {
  const existing = readStoredSessionId();
  if (existing) return existing;

  const sessionId = generateSessionId();
  storeSessionId(sessionId);

  logger.debug('Sessao unificada criada', { sessionId });
  return sessionId;
}

/**
 * Retorna o session_id armazenado sem gerar um novo.
 */
export function peekSessionId(): string | null {
  return readStoredSessionId();
}

/**
 * Define explicitamente o session_id unificado no storage.
 */
export function setSessionId(sessionId: string): void {
  storeSessionId(sessionId);
}

/**
 * Gera um novo session_id, persiste e retorna.
 */
export function refreshSessionId(): string {
  const sessionId = generateSessionId();
  storeSessionId(sessionId);
  logger.debug('Sessao unificada atualizada', { sessionId });
  return sessionId;
}

/**
 * Remove o session_id de todos os storages do navegador.
 */
export function clearSessionId(): void {
  if (!isBrowser) return;
  safeRemoveItem(window.sessionStorage, SESSION_STORAGE_KEY);
  safeRemoveItem(window.localStorage, SESSION_PERSISTENT_KEY);
}

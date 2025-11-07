/**
 * 🚨 Sentry Error Monitoring
 * 
 * Integração com Sentry para monitoramento de erros em produção
 * - Configuração otimizada para Next.js
 * - Breadcrumbs personalizados
 * - Context enriquecido
 * - Performance monitoring
 */

import * as Sentry from '@sentry/nextjs';
import { logger } from '../utils/logger';

// Variável global para controle de inicialização
let sentryInitialized = false;

/**
 * Inicializa Sentry
 */
export function initSentry() {
  // Só inicializa em produção e se tiver DSN configurado
  if (
    sentryInitialized ||
    process.env.NODE_ENV !== 'production' ||
    !process.env.NEXT_PUBLIC_SENTRY_DSN
  ) {
    return;
  }

  try {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% das transações (produção)
      
      // Session Replay
      replaysSessionSampleRate: 0.01, // 1% das sessões
      replaysOnErrorSampleRate: 1.0, // 100% em caso de erro
      
      // Environment
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'production',
      
      // Release tracking
      release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
      
      // Integrations
      integrations: [
        new Sentry.BrowserTracing({
          // Não trackar certas URLs
          tracePropagationTargets: [
            'localhost',
            /^https:\/\/www\.maracujazeropragas\.com/
          ],
        }),
        new Sentry.Replay({
          // Mask all text content
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Filtros
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Random plugins/extensions
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        // Facebook blocked
        'fb_xd_fragment',
        // Ignorar erros de rede (já temos no logger)
        /Failed to fetch/i,
        /NetworkError/i,
        /Load failed/i,
      ],
      
      // Before send hook (enriquecimento)
      beforeSend(event, hint) {
        // Adicionar contexto customizado
        if (typeof window !== 'undefined') {
          event.contexts = event.contexts || {};
          event.contexts.user_session = {
            session_id: sessionStorage.getItem('session_id'),
            fbp: getCookie('_fbp'),
            fbc: getCookie('_fbc'),
          };
        }
        
        return event;
      },
    });

    sentryInitialized = true;
    logger.log('✅ Sentry initialized');
    
  } catch (error) {
    logger.error('Failed to initialize Sentry', { error });
  }
}

/**
 * Captura erro customizado
 */
export function captureError(
  error: Error | string,
  context?: Record<string, any>
) {
  if (!sentryInitialized) {
    logger.error('Sentry error (not initialized)', { error, context });
    return;
  }

  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Captura mensagem customizada
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, any>
) {
  if (!sentryInitialized) {
    logger.log(`Sentry message (not initialized): ${message}`, context);
    return;
  }

  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Set user context
 */
export function setSentryUser(user: {
  id?: string;
  email?: string;
  username?: string;
}) {
  if (!sentryInitialized) return;
  
  Sentry.setUser(user);
}

/**
 * Add breadcrumb (rastro de ações)
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, any>
) {
  if (!sentryInitialized) return;
  
  Sentry.addBreadcrumb({
    category,
    message,
    level: 'info',
    data,
  });
}

/**
 * Start performance transaction
 */
export function startTransaction(name: string, op: string) {
  if (!sentryInitialized) return null;
  
  return Sentry.startTransaction({
    name,
    op,
  });
}

// Helper: Get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
}



/**
 * Logger System - Centralizado e com níveis apropriados
 * Logs apenas em desenvolvimento, erros sempre capturados
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  userId?: string;
  eventId?: string;
  [key: string]: any;
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  /**
   * Debug - Apenas em desenvolvimento
   */
  debug(message: string, data?: any): void {
    if (this.isDev) {
      console.debug(`🔍 [DEBUG] ${message}`, data || '');
    }
  }

  /**
   * Info - Apenas em desenvolvimento
   */
  info(message: string, data?: any): void {
    if (this.isDev) {
      console.log(`ℹ️ [INFO] ${message}`, data || '');
    }
  }

  /**
   * Warn - Sempre (mas não envia para Sentry)
   */
  warn(message: string, data?: any): void {
    console.warn(`⚠️ [WARN] ${message}`, data || '');
  }

  /**
   * Error - Sempre + Sentry em produção
   */
  error(message: string, error?: any, context?: LogContext): void {
    console.error(`❌ [ERROR] ${message}`, error || '', context || '');

    // Enviar para Sentry em produção
    if (!this.isDev && this.isClient) {
      this.sendToSentry(message, error, context);
    }
  }

  /**
   * Envia erro para Sentry (lazy load)
   */
  private async sendToSentry(
    message: string,
    error: any,
    context?: LogContext
  ): Promise<void> {
    try {
      const { captureError } = await import('@/lib/monitoring/sentry');
      captureError(error || new Error(message), context);
    } catch (sentryError) {
      // Falha silenciosa - não bloquear aplicação
      console.error('Failed to send error to Sentry:', sentryError);
    }
  }

  /**
   * Log condicional baseado em nível
   */
  log(level: LogLevel, message: string, data?: any): void {
    switch (level) {
      case 'debug':
        this.debug(message, data);
        break;
      case 'info':
        this.info(message, data);
        break;
      case 'warn':
        this.warn(message, data);
        break;
      case 'error':
        this.error(message, data);
        break;
    }
  }
}

export const logger = new Logger();

/**
 * Logger específico para tracking (mais verboso em dev)
 */
export const trackingLogger = {
  event: (eventName: string, eventId: string, data?: any) => {
    logger.info(`📊 Event: ${eventName}`, { eventId, ...data });
  },

  deduplication: (eventId: string, reason: string) => {
    logger.warn(`🔄 Deduplication: ${eventId} - ${reason}`);
  },

  enrichment: (source: string, fields: number) => {
    logger.debug(`🔍 Enrichment: ${source} (+${fields} fields)`);
  },

  error: (eventName: string, error: any) => {
    logger.error(`Failed to track ${eventName}`, error, {
      component: 'tracking'
    });
  }
};

/**
 * Performance logger
 */
export const performanceLogger = {
  start: (label: string): (() => void) => {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      if (duration > 200) {
        logger.warn(`⏱️ Slow operation: ${label} took ${duration}ms`);
      } else {
        logger.debug(`⏱️ ${label}: ${duration}ms`);
      }
    };
  }
};

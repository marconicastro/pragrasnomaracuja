/**
 * 🎯 Logger Profissional
 * 
 * - Logs apenas em desenvolvimento
 * - Erros sempre logados (para Sentry capturar)
 * - Performance tracking embutido
 * - Formatação consistente
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface LogContext {
  component?: string;
  event?: string;
  duration?: number;
  [key: string]: any;
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  /**
   * Formata mensagem com emoji e contexto
   */
  private format(level: LogLevel, message: string, context?: LogContext): string {
    const emojis = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      success: '✅'
    };

    const emoji = emojis[level];
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    let formatted = `${emoji} [${timestamp}] ${message}`;
    
    if (context?.component) {
      formatted += ` [${context.component}]`;
    }
    
    if (context?.duration) {
      formatted += ` (${context.duration}ms)`;
    }

    return formatted;
  }

  /**
   * Debug (apenas dev)
   */
  debug(message: string, context?: LogContext) {
    if (!this.isDev) return;
    console.log(this.format('debug', message, context), context || '');
  }

  /**
   * Info (apenas dev)
   */
  info(message: string, context?: LogContext) {
    if (!this.isDev) return;
    console.log(this.format('info', message, context), context || '');
  }

  /**
   * Log simples (apenas dev)
   */
  log(message: string, ...args: any[]) {
    if (!this.isDev) return;
    console.log(message, ...args);
  }

  /**
   * Warning (apenas dev)
   */
  warn(message: string, context?: LogContext) {
    if (!this.isDev) return;
    console.warn(this.format('warn', message, context), context || '');
  }

  /**
   * Error (SEMPRE loga - para Sentry)
   */
  error(message: string, error?: Error | any, context?: LogContext) {
    console.error(this.format('error', message, context), error, context || '');
  }

  /**
   * Success (apenas dev)
   */
  success(message: string, context?: LogContext) {
    if (!this.isDev) return;
    console.log(this.format('success', message, context), context || '');
  }

  /**
   * Performance tracking
   */
  time(label: string): () => void {
    if (!this.isDev) return () => {};
    
    const start = performance.now();
    
    return () => {
      const duration = Math.round(performance.now() - start);
      this.debug(`⏱️ ${label}`, { duration });
    };
  }

  /**
   * Group (apenas dev)
   */
  group(label: string) {
    if (!this.isDev) return;
    console.group(label);
  }

  groupEnd() {
    if (!this.isDev) return;
    console.groupEnd();
  }

  /**
   * Table (apenas dev)
   */
  table(data: any) {
    if (!this.isDev) return;
    console.table(data);
  }

  /**
   * Assert (apenas dev)
   */
  assert(condition: boolean, message: string) {
    if (!this.isDev) return;
    console.assert(condition, message);
  }
}

// Singleton
export const logger = new Logger();

// Helpers para tracking de eventos específicos
export const trackingLogger = {
  event: (eventName: string, eventId: string, via: string = 'DataLayer') => {
    logger.success(`${eventName} disparado`, {
      component: 'tracking',
      event: eventName,
      eventId,
      via
    });
  },
  
  error: (eventName: string, error: Error) => {
    logger.error(`Erro ao disparar ${eventName}`, error, {
      component: 'tracking',
      event: eventName
    });
  },
  
  deduplication: (eventId: string, status: 'novo' | 'duplicado') => {
    if (status === 'duplicado') {
      logger.warn(`Event ID duplicado detectado`, {
        component: 'deduplication',
        eventId
      });
    }
  }
};


/**
 * ⚡ Performance Monitor
 * 
 * Monitora performance de operações críticas
 * - Tracking de eventos
 * - API calls
 * - Heavy computations
 */

import { logger } from './logger';

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: number;
  success: boolean;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 100; // Manter apenas últimas 100 métricas
  private readonly SLOW_THRESHOLD_MS = 100; // Alerta se > 100ms

  /**
   * Inicia tracking de performance
   */
  startTracking(operation: string): () => void {
    const start = performance.now();
    
    return (success = true, metadata?: Record<string, any>) => {
      const duration = Math.round(performance.now() - start);
      
      this.recordMetric({
        operation,
        duration,
        timestamp: Date.now(),
        success,
        metadata
      });

      // Alertar se operação foi lenta
      if (duration > this.SLOW_THRESHOLD_MS) {
        logger.warn(`Operação lenta detectada: ${operation}`, {
          duration,
          threshold: this.SLOW_THRESHOLD_MS,
          metadata
        });
      }
    };
  }

  /**
   * Registra métrica
   */
  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Manter apenas últimas N métricas
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }
  }

  /**
   * Obtém estatísticas
   */
  getStats(operation?: string): {
    count: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    successRate: number;
  } {
    const filtered = operation
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filtered.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        successRate: 0
      };
    }

    const durations = filtered.map(m => m.duration);
    const successes = filtered.filter(m => m.success).length;

    return {
      count: filtered.length,
      avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      successRate: Math.round((successes / filtered.length) * 100)
    };
  }

  /**
   * Obtém operações lentas
   */
  getSlowOperations(): PerformanceMetric[] {
    return this.metrics
      .filter(m => m.duration > this.SLOW_THRESHOLD_MS)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
  }

  /**
   * Limpa métricas
   */
  clear() {
    this.metrics = [];
  }

  /**
   * Exporta métricas para análise
   */
  export(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

// Singleton
export const performanceMonitor = new PerformanceMonitor();

// Helper para tracking de eventos
export function trackEventPerformance<T>(
  eventName: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const endTracking = performanceMonitor.startTracking(`event_${eventName}`);
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result
        .then(r => {
          endTracking(true, { eventName });
          return r;
        })
        .catch(e => {
          endTracking(false, { eventName, error: e.message });
          throw e;
        });
    }
    
    endTracking(true, { eventName });
    return Promise.resolve(result);
  } catch (e: any) {
    endTracking(false, { eventName, error: e.message });
    throw e;
  }
}


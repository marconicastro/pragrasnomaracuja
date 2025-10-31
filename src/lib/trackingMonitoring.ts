/**
 * ?? Real-Time Tracking Monitoring & Alerts
 * 
 * Sistema de monitoramento para detectar problemas no tracking
 */

'use client';

interface EventLog {
  eventId: string;
  eventName: string;
  success: boolean;
  timestamp: number;
  warnings?: string[];
  dataQualityScore?: number;
}

const MONITORING_KEY = 'zc_monitoring_logs';
const MAX_LOGS = 1000;

// ===== LOGGING =====

/**
 * Registra evento no sistema de monitoring
 */
export function logEvent(log: EventLog): void {
  const logs = getLogs();
  logs.push(log);
  
  // Limitar tamanho
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }
  
  localStorage.setItem(MONITORING_KEY, JSON.stringify(logs));
  
  // Verificar se precisa alertar
  checkForIssues();
}

/**
 * Recupera logs
 */
export function getLogs(limit?: number): EventLog[] {
  try {
    const stored = localStorage.getItem(MONITORING_KEY);
    if (!stored) return [];
    
    const logs: EventLog[] = JSON.parse(stored);
    return limit ? logs.slice(-limit) : logs;
  } catch {
    return [];
  }
}

// ===== ANALYTICS =====

/**
 * Estat?sticas de tracking
 */
export function getTrackingStats(timeframe: number = 3600000) {
  // Timeframe padr?o: ?ltima hora
  const now = Date.now();
  const logs = getLogs().filter(log => log.timestamp > now - timeframe);
  
  if (logs.length === 0) {
    return null;
  }
  
  const successCount = logs.filter(l => l.success).length;
  const failureCount = logs.filter(l => !l.success).length;
  const successRate = successCount / logs.length;
  
  // Eventos por tipo
  const eventCounts = logs.reduce((acc, log) => {
    acc[log.eventName] = (acc[log.eventName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Data quality m?dio
  const scores = logs
    .filter(l => l.dataQualityScore !== undefined)
    .map(l => l.dataQualityScore!);
  const avgDataQuality = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 0;
  
  // Warnings
  const warnings = logs
    .filter(l => l.warnings && l.warnings.length > 0)
    .flatMap(l => l.warnings!);
  
  return {
    totalEvents: logs.length,
    successCount,
    failureCount,
    successRate,
    eventCounts,
    avgDataQuality,
    warnings: [...new Set(warnings)], // unique
    period: timeframe
  };
}

// ===== ALERTING =====

const ALERT_THRESHOLDS = {
  minSuccessRate: 0.95, // 95%
  minDataQuality: 70,    // 70/100
  maxWarningsPerHour: 10
};

/**
 * Verifica se h? problemas que requerem aten??o
 */
export function checkForIssues(): void {
  const stats = getTrackingStats(3600000); // ?ltima hora
  
  if (!stats) return;
  
  const issues: string[] = [];
  
  // Taxa de sucesso baixa
  if (stats.successRate < ALERT_THRESHOLDS.minSuccessRate) {
    issues.push(`Taxa de sucesso baixa: ${(stats.successRate * 100).toFixed(1)}%`);
  }
  
  // Data quality baixo
  if (stats.avgDataQuality < ALERT_THRESHOLDS.minDataQuality) {
    issues.push(`Data Quality Score baixo: ${stats.avgDataQuality.toFixed(1)}`);
  }
  
  // Muitos warnings
  if (stats.warnings.length > ALERT_THRESHOLDS.maxWarningsPerHour) {
    issues.push(`Muitos warnings: ${stats.warnings.length}`);
  }
  
  // Se houver issues, alertar
  if (issues.length > 0) {
    console.warn('?? TRACKING ISSUES DETECTED:', issues);
    
    // Aqui voc? poderia enviar para Slack, Email, etc.
    // sendSlackAlert(issues);
  }
}

/**
 * Dashboard de monitoring (para debugging)
 */
export function printMonitoringDashboard(): void {
  const stats1h = getTrackingStats(3600000);
  const stats24h = getTrackingStats(86400000);
  
  console.group('?? TRACKING MONITORING DASHBOARD');
  
  if (stats1h) {
    console.log('\n? ?ltima Hora:');
    console.log('  Total eventos:', stats1h.totalEvents);
    console.log('  Taxa sucesso:', `${(stats1h.successRate * 100).toFixed(1)}%`);
    console.log('  Data Quality:', stats1h.avgDataQuality.toFixed(1));
    console.log('  Por tipo:', stats1h.eventCounts);
    if (stats1h.warnings.length > 0) {
      console.log('  ?? Warnings:', stats1h.warnings);
    }
  }
  
  if (stats24h) {
    console.log('\n?? ?ltimas 24h:');
    console.log('  Total eventos:', stats24h.totalEvents);
    console.log('  Taxa sucesso:', `${(stats24h.successRate * 100).toFixed(1)}%`);
    console.log('  Data Quality:', stats24h.avgDataQuality.toFixed(1));
  }
  
  console.groupEnd();
}

// ===== INTEGRATION WITH TRACKING =====

/**
 * Wrapper para eventos que adiciona monitoring autom?tico
 */
export function withMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  eventName: string
): T {
  return (async (...args: any[]) => {
    try {
      const result = await fn(...args);
      
      logEvent({
        eventId: result.eventId || 'unknown',
        eventName,
        success: result.success,
        timestamp: Date.now(),
        warnings: result.warnings,
        dataQualityScore: result.dataQualityScore
      });
      
      return result;
    } catch (error: any) {
      logEvent({
        eventId: 'error',
        eventName,
        success: false,
        timestamp: Date.now(),
        warnings: [error.message]
      });
      
      throw error;
    }
  }) as T;
}

/**
 * Event ID Generator - IDs únicos para deduplicação
 */

/**
 * Gerar event ID único
 */
export function generateEventId(eventName: string, orderId?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 12);
  
  if (orderId) {
    return `${eventName}_${orderId}_${timestamp}`;
  }
  
  return `${eventName}_${timestamp}_${random}`;
}

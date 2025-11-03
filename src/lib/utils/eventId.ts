/**
 * 🆔 Event ID Generation - Centralizado
 * 
 * Gera Event IDs únicos e consistentes para deduplication
 * Usado por todos os sistemas de tracking
 */

/**
 * Gera Event ID único no formato padronizado
 * 
 * Formato: {eventName}_{orderId?}_{timestamp}_{random}
 * 
 * @param eventName - Nome do evento (ex: 'Purchase', 'Lead')
 * @param orderId - ID da ordem (opcional, apenas para Purchase)
 * @returns Event ID único
 */
export function generateEventId(eventName: string, orderId?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 12);
  const prefix = orderId ? `${eventName}_${orderId}` : eventName;
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Valida formato de Event ID
 */
export function isValidEventId(eventId: string): boolean {
  if (!eventId || typeof eventId !== 'string') return false;
  
  // Formato esperado: {prefix}_{timestamp}_{random}
  const parts = eventId.split('_');
  if (parts.length < 3) return false;
  
  // Verificar se timestamp é válido (números)
  const timestamp = parseInt(parts[parts.length - 2]);
  if (isNaN(timestamp) || timestamp <= 0) return false;
  
  // Verificar se random existe
  if (!parts[parts.length - 1] || parts[parts.length - 1].length < 8) return false;
  
  return true;
}


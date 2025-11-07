/**
 * 🔒 FBC Sanitizer - Preserva fbc EXATAMENTE como vem do Facebook
 * 
 * O fbc (Facebook Click ID) DEVE ser preservado EXATAMENTE como vem do cookie _fbc.
 * Qualquer modificação (lowercase, trim, encoding, etc) causa erro no Meta CAPI.
 * 
 * Formato esperado: fb.1.{timestamp}.{fbclid}
 * Onde fbclid é uma string longa que NÃO pode ser modificada.
 */

/**
 * Sanitiza fbc removendo apenas espaços externos (não modifica conteúdo)
 * 
 * CRÍTICO: NÃO fazer toLowerCase(), não truncar, não modificar conteúdo interno!
 * 
 * @param fbc - Valor do cookie _fbc
 * @returns fbc sanitizado (apenas espaços externos removidos) ou null se inválido
 */
export function sanitizeFbc(fbc: string | null | undefined): string | null {
  if (!fbc || typeof fbc !== 'string') {
    return null;
  }
  
  // REMOVER APENAS espaços/brancos externos (trim)
  // NÃO modificar o conteúdo interno!
  const trimmed = fbc.trim();
  
  // Verificar formato básico (fb.1.timestamp.fbclid)
  if (!trimmed.startsWith('fb.1.')) {
    logger.warn('⚠️ fbc não começa com "fb.1.":', trimmed.substring(0, 20) + '...');
    return null;
  }
  
  // Verificar se tem pelo menos 4 partes
  const parts = trimmed.split('.');
  if (parts.length < 4) {
    logger.warn('⚠️ fbc formato inválido (menos de 4 partes):', trimmed);
    return null;
  }
  
  // Verificar se fbclid (4ª parte) não está vazia e tem tamanho mínimo
  if (!parts[3] || parts[3].length < 10) {
    logger.warn('⚠️ fbc fbclid muito curto ou vazio:', trimmed);
    return null;
  }
  
  // RETORNAR EXATAMENTE como está (apenas trim externo)
  // NÃO fazer toLowerCase, não truncar, não modificar!
  return trimmed;
}

/**
 * Preserva fbc sem nenhuma modificação
 * Usado quando já temos certeza que o fbc é válido
 * 
 * @param fbc - Valor do cookie _fbc
 * @returns fbc preservado ou null
 */
export function preserveFbc(fbc: string | null | undefined): string | null {
  if (!fbc || typeof fbc !== 'string') {
    return null;
  }
  
  // APENAS remover espaços externos - NADA MAIS!
  return fbc.trim();
}

/**
 * Valida se fbc parece válido antes de usar
 * 
 * @param fbc - Valor a validar
 * @returns true se parece válido
 */
export function isValidFbcFormat(fbc: string): boolean {
  if (!fbc || typeof fbc !== 'string') return false;
  
  const trimmed = fbc.trim();
  
  // Verificar formato: fb.1.timestamp.fbclid
  if (!trimmed.startsWith('fb.1.')) return false;
  
  const parts = trimmed.split('.');
  if (parts.length < 4) return false;
  
  // Verificar timestamp (3ª parte)
  const timestamp = parseInt(parts[2]);
  if (isNaN(timestamp) || timestamp <= 0) return false;
  
  // Verificar fbclid (4ª parte) - deve existir e ter tamanho mínimo
  if (!parts[3] || parts[3].length < 10) return false;
  
  return true;
}


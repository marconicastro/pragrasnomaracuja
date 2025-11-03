/**
 * 🔒 Facebook Click ID (fbc) Validator
 * 
 * Valida se fbc é real e não fake/modificado
 * fbc válido: fb.1.[timestamp].[fbclid real do Facebook]
 */

/**
 * Valida formato básico de fbc
 * Formato: fb.1.{timestamp}.{fbclid}
 */
export function isValidFbcFormat(fbc: string): boolean {
  if (!fbc || typeof fbc !== 'string') return false;
  
  const parts = fbc.split('.');
  
  // Deve ter pelo menos 4 partes: fb.1.timestamp.fbclid
  if (parts.length < 4) return false;
  
  // Primeira parte deve ser "fb"
  if (parts[0] !== 'fb') return false;
  
  // Segunda parte deve ser "1"
  if (parts[1] !== '1') return false;
  
  // Terceira parte deve ser timestamp válido (números)
  const timestamp = parseInt(parts[2]);
  if (isNaN(timestamp) || timestamp <= 0) return false;
  
  // Quarta parte deve ser fbclid (não vazio)
  if (!parts[3] || parts[3].length < 10) return false;
  
  return true;
}

/**
 * Valida se fbc está dentro da janela válida (24 horas)
 * 
 * @param fbc - Facebook Click ID
 * @returns true se fbc é válido e dentro da janela de 24h
 */
export function isValidFbcTimestamp(fbc: string): boolean {
  if (!isValidFbcFormat(fbc)) return false;
  
  const parts = fbc.split('.');
  const fbcTimestampStr = parts[2];
  const fbcTimestamp = parseInt(fbcTimestampStr);
  
  if (isNaN(fbcTimestamp)) return false;
  
  // ✅ CORREÇÃO: Facebook usa MILISSEGUNDOS quando timestamp tem 13 dígitos
  // Se tem 13 dígitos = milissegundos (não multiplicar)
  // Se tem 10 dígitos = segundos (multiplicar por 1000)
  const now = Date.now(); // milissegundos
  const fbcTime = fbcTimestampStr.length === 13 
    ? fbcTimestamp // Já está em milissegundos
    : fbcTimestamp * 1000; // Converter segundos para milissegundos
  
  const diff = now - fbcTime;
  
  // Janela válida: 24 horas (86400000 ms)
  const VALID_WINDOW_MS = 24 * 60 * 60 * 1000;
  
  // fbc deve ser do passado (não futuro) e dentro de 24h
  return diff >= 0 && diff <= VALID_WINDOW_MS;
}

/**
 * Validação completa de fbc
 * 
 * @param fbc - Facebook Click ID
 * @returns true se fbc é válido, false caso contrário
 */
export function validateFbc(fbc: string): {
  valid: boolean;
  reason?: string;
} {
  if (!fbc) {
    return { valid: false, reason: 'fbc is empty' };
  }
  
  if (!isValidFbcFormat(fbc)) {
    return { valid: false, reason: 'invalid fbc format' };
  }
  
  if (!isValidFbcTimestamp(fbc)) {
    return { valid: false, reason: 'fbc timestamp outside valid window (24h)' };
  }
  
  return { valid: true };
}


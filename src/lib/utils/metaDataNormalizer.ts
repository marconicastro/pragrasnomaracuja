/**
 * 🔧 Normalização de Dados para Padrão Facebook/Meta
 * 
 * GARANTE que todos os dados sigam o padrão do Facebook antes de:
 * - Hash SHA-256
 * - Envio para Meta CAPI
 * - Envio para GTM Server-Side
 * - Salvamento no KV/Prisma
 * 
 * PADRÃO FACEBOOK:
 * - Email: lowercase + trim
 * - Nome: title case (primeira letra maiúscula, resto minúscula)
 * - Telefone: apenas dígitos, com código do país (55 para Brasil)
 * - Cidade/Estado: lowercase + trim
 * - CEP: apenas dígitos
 */

/**
 * Normaliza email para padrão Facebook
 * - lowercase
 * - trim (remove espaços)
 * 
 * @param email Email original
 * @returns Email normalizado
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.toLowerCase().trim();
}

/**
 * Normaliza nome para padrão Facebook (title case)
 * - Primeira letra de cada palavra maiúscula
 * - Resto minúscula
 * - Remove espaços extras
 * 
 * @param name Nome original
 * @returns Nome normalizado (title case)
 */
export function normalizeName(name: string): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .trim()
    .split(/\s+/) // Split por espaços (inclui múltiplos espaços)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extrai first_name e last_name de um nome completo
 * Garante normalização (title case)
 * 
 * @param fullName Nome completo
 * @returns { firstName, lastName }
 */
export function splitNormalizedName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const normalized = normalizeName(fullName);
  const parts = normalized.split(' ');
  
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  };
}

/**
 * Normaliza telefone para padrão Facebook
 * - Remove tudo que não é dígito
 * - Adiciona código do país (55) se não tiver
 * - Garante formato: 55XXXXXXXXXXX
 * 
 * @param phone Telefone original
 * @returns Telefone normalizado (apenas dígitos, com 55)
 */
export function normalizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  
  // Remove tudo que não é dígito
  const cleaned = phone.replace(/\D/g, '');
  
  // Se já começa com 55, retorna
  if (cleaned.startsWith('55')) {
    return cleaned;
  }
  
  // Se tem 10 ou 11 dígitos (DDD + número), adiciona 55
  if (cleaned.length >= 10 && cleaned.length <= 11) {
    return `55${cleaned}`;
  }
  
  // Se tem 12 ou 13 dígitos e começa com 55, retorna
  if (cleaned.length >= 12 && cleaned.startsWith('55')) {
    return cleaned;
  }
  
  // Caso contrário, retorna como está (melhor que falhar)
  return cleaned;
}

/**
 * Normaliza cidade para padrão Facebook
 * - lowercase
 * - trim
 * 
 * @param city Cidade original
 * @returns Cidade normalizada
 */
export function normalizeCity(city: string): string {
  if (!city || typeof city !== 'string') return '';
  return city.toLowerCase().trim();
}

/**
 * Normaliza estado para padrão Facebook
 * - lowercase
 * - trim
 * 
 * @param state Estado original
 * @returns Estado normalizado
 */
export function normalizeState(state: string): string {
  if (!state || typeof state !== 'string') return '';
  return state.toLowerCase().trim();
}

/**
 * Normaliza CEP para padrão Facebook
 * - Remove tudo que não é dígito
 * - trim
 * 
 * @param zip CEP original
 * @returns CEP normalizado (apenas dígitos)
 */
export function normalizeZip(zip: string): string {
  if (!zip || typeof zip !== 'string') return '';
  return zip.replace(/\D/g, '').trim();
}

/**
 * Normaliza país para padrão Facebook
 * - lowercase
 * - trim
 * - Padrão: 'br' para Brasil
 * 
 * @param country País original
 * @returns País normalizado
 */
export function normalizeCountry(country?: string): string {
  if (!country || typeof country !== 'string') return 'br';
  return country.toLowerCase().trim() || 'br';
}

/**
 * Normaliza TODOS os dados de user_data para padrão Facebook
 * Garante consistência antes de hash ou envio
 * 
 * @param userData Dados do usuário (raw)
 * @returns Dados normalizados
 */
export function normalizeUserData(userData: {
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  country: string;
} {
  // Se tiver fullName, usar para extrair firstName e lastName
  let firstName = userData.firstName || '';
  let lastName = userData.lastName || '';
  
  if (userData.fullName) {
    const split = splitNormalizedName(userData.fullName);
    firstName = split.firstName;
    lastName = split.lastName;
  } else {
    // Normalizar firstName e lastName separadamente
    firstName = normalizeName(firstName);
    lastName = normalizeName(lastName);
  }
  
  return {
    email: normalizeEmail(userData.email || ''),
    firstName,
    lastName,
    phone: normalizePhone(userData.phone || ''),
    city: normalizeCity(userData.city || ''),
    state: normalizeState(userData.state || ''),
    zip: normalizeZip(userData.zip || ''),
    country: normalizeCountry(userData.country)
  };
}

/**
 * Log de normalização (para debug)
 * Mostra dados originais vs normalizados
 */
export function logNormalization(
  original: Record<string, any>,
  normalized: Record<string, any>,
  context: string = 'Normalização'
): void {
  const changes: Record<string, { original: any; normalized: any }> = {};
  
  for (const key in normalized) {
    if (original[key] !== normalized[key]) {
      changes[key] = {
        original: original[key],
        normalized: normalized[key]
      };
    }
  }
  
  if (Object.keys(changes).length > 0) {
    console.log(`🔧 ${context} - Dados alterados:`, changes);
  }
}


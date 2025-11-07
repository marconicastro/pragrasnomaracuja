/**
 * 🧪 Unit Tests: Meta Data Normalizer
 * 
 * Testes críticos para normalização de dados do Facebook
 */

import {
  normalizeEmail,
  normalizePhone,
  normalizeName,
  normalizeCity,
  normalizeState,
  normalizeZip,
  normalizeCountry,
  normalizeUserData,
  hashUserData,
} from '../metaDataNormalizer';

describe('normalizeEmail', () => {
  it('should normalize email correctly', () => {
    expect(normalizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com');
    expect(normalizeEmail(' test@example.com ')).toBe('test@example.com');
    expect(normalizeEmail('Test.User+tag@Example.COM')).toBe('test.user+tag@example.com');
  });

  it('should return undefined for invalid emails', () => {
    expect(normalizeEmail('')).toBeUndefined();
    expect(normalizeEmail('invalid')).toBeUndefined();
    expect(normalizeEmail('no@domain')).toBeUndefined();
  });
});

describe('normalizePhone', () => {
  it('should normalize Brazilian phone numbers', () => {
    expect(normalizePhone('(77) 99827-6042')).toBe('5577998276042');
    expect(normalizePhone('77 99827-6042')).toBe('5577998276042');
    expect(normalizePhone('77998276042')).toBe('5577998276042');
    expect(normalizePhone('+55 77 99827-6042')).toBe('5577998276042');
  });

  it('should handle other country codes', () => {
    expect(normalizePhone('+1 555-1234', 'us')).toBe('15551234');
  });

  it('should return undefined for invalid phones', () => {
    expect(normalizePhone('')).toBeUndefined();
    expect(normalizePhone('123')).toBeUndefined();
  });
});

describe('normalizeName', () => {
  it('should normalize names correctly', () => {
    expect(normalizeName('João Silva')).toBe('joão');
    expect(normalizeName('MARIA SANTOS')).toBe('maria');
    expect(normalizeName(' José ')).toBe('josé');
  });

  it('should remove accents and special characters', () => {
    expect(normalizeName('José')).toBe('josé');
    expect(normalizeName('François')).toBe('françois');
  });

  it('should return undefined for invalid names', () => {
    expect(normalizeName('')).toBeUndefined();
    expect(normalizeName('   ')).toBeUndefined();
  });
});

describe('normalizeCountry', () => {
  it('should normalize to lowercase 2-letter code', () => {
    expect(normalizeCountry('BR')).toBe('br');
    expect(normalizeCountry('Brazil')).toBe('br');
    expect(normalizeCountry('brasil')).toBe('br');
    expect(normalizeCountry('US')).toBe('us');
  });

  it('should return undefined for invalid countries', () => {
    expect(normalizeCountry('')).toBeUndefined();
    expect(normalizeCountry('XYZ')).toBeUndefined();
  });
});

describe('normalizeUserData', () => {
  it('should normalize all user data fields', () => {
    const input = {
      email: 'TEST@EXAMPLE.COM',
      firstName: 'JOÃO',
      lastName: 'SILVA',
      phone: '(77) 99827-6042',
      city: 'SÃO PAULO',
      state: 'SP',
      zip: '01234-567',
      country: 'BR',
    };

    const result = normalizeUserData(input);

    expect(result.email).toBe('test@example.com');
    expect(result.firstName).toBe('joão');
    expect(result.lastName).toBe('silva');
    expect(result.phone).toBe('5577998276042');
    expect(result.city).toBe('sãopaulo');
    expect(result.state).toBe('sp');
    expect(result.zip).toBe('01234567');
    expect(result.country).toBe('br');
  });

  it('should handle partial data', () => {
    const input = {
      email: 'test@example.com',
    };

    const result = normalizeUserData(input);

    expect(result.email).toBe('test@example.com');
    expect(result.firstName).toBeUndefined();
    expect(result.lastName).toBeUndefined();
  });
});

describe('hashUserData', () => {
  it('should hash user data with SHA-256', async () => {
    const data = {
      email: 'test@example.com',
      phone: '5577998276042',
      firstName: 'joão',
      lastName: 'silva',
    };

    const hashed = await hashUserData(data);

    expect(hashed.em).toBeDefined();
    expect(hashed.ph).toBeDefined();
    expect(hashed.fn).toBeDefined();
    expect(hashed.ln).toBeDefined();
    
    // Verificar que são hashes SHA-256 (64 caracteres hex)
    expect(hashed.em).toMatch(/^[a-f0-9]{64}$/);
    expect(hashed.ph).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should skip undefined values', async () => {
    const data = {
      email: 'test@example.com',
    };

    const hashed = await hashUserData(data);

    expect(hashed.em).toBeDefined();
    expect(hashed.ph).toBeUndefined();
    expect(hashed.fn).toBeUndefined();
  });

  it('should preserve external_id unhashed', async () => {
    const data = {
      external_id: 'user_12345',
    };

    const hashed = await hashUserData(data);

    expect(hashed.external_id).toBe('user_12345');
  });
});


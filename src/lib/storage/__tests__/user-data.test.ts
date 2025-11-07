/**
 * Testes do sistema de storage
 */

import { saveUserData, getUserData, getSessionId, clearUserData } from '../user-data';

// Mock localStorage e sessionStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock fetch
global.fetch = jest.fn();

describe('UserData Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    sessionStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('saveUserData', () => {
    it('should save user data to localStorage', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      await saveUserData(userData, false);

      const stored = getUserData();
      expect(stored).toMatchObject(userData);
    });

    it('should calculate data quality score', async () => {
      const userData = {
        email: 'test@example.com',
        phone: '5511999999999',
        firstName: 'John',
        lastName: 'Doe'
      };

      const result = await saveUserData(userData, false);

      expect(result.dataQualityScore).toBeGreaterThan(0);
    });

    it('should merge with existing data', async () => {
      await saveUserData({ email: 'test@example.com' }, false);
      await saveUserData({ firstName: 'John' }, false);

      const stored = getUserData();
      expect(stored).toMatchObject({
        email: 'test@example.com',
        firstName: 'John'
      });
    });
  });

  describe('getSessionId', () => {
    it('should generate session ID', () => {
      const sessionId = getSessionId();
      
      expect(sessionId).toMatch(/^sess_\d+_[a-z0-9]+$/);
    });

    it('should return same session ID on multiple calls', () => {
      const sessionId1 = getSessionId();
      const sessionId2 = getSessionId();
      
      expect(sessionId1).toBe(sessionId2);
    });
  });

  describe('clearUserData', () => {
    it('should clear all user data', async () => {
      await saveUserData({ email: 'test@example.com' }, false);
      
      clearUserData();
      
      expect(getUserData()).toBeNull();
    });
  });
});

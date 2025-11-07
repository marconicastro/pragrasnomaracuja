/**
 * 🧪 Unit Tests: Memoization
 * 
 * Testes para o sistema de cache/memoização
 */

import { memoize, memoizeAsync } from '../memoize';

describe('memoize', () => {
  it('should cache function results', () => {
    const fn = jest.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    // Primeira chamada - executa função
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);

    // Segunda chamada com mesmo argumento - retorna do cache
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1); // Não chamou de novo!

    // Chamada com argumento diferente - executa função
    expect(memoized(10)).toBe(20);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should respect TTL (Time To Live)', async () => {
    const fn = jest.fn((x: number) => x * 2);
    const memoized = memoize(fn, { ttl: 100 }); // 100ms

    // Primeira chamada
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);

    // Aguardar TTL expirar
    await new Promise(resolve => setTimeout(resolve, 150));

    // Chamada após TTL - deve executar novamente
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should respect maxSize and evict oldest entries', () => {
    const fn = jest.fn((x: number) => x * 2);
    const memoized = memoize(fn, { maxSize: 2 });

    memoized(1); // Cache: [1]
    memoized(2); // Cache: [1, 2]
    memoized(3); // Cache: [2, 3] (1 foi removido)

    expect(fn).toHaveBeenCalledTimes(3);

    // Chamar 1 novamente - deve executar (foi evicted)
    memoized(1);
    expect(fn).toHaveBeenCalledTimes(4);

    // Chamar 2 - deve vir do cache
    memoized(2);
    expect(fn).toHaveBeenCalledTimes(4); // Não chamou!
  });

  it('should allow custom key generator', () => {
    const fn = jest.fn((obj: { id: number }) => obj.id * 2);
    const memoized = memoize(fn, {
      keyGenerator: (obj) => obj.id.toString(),
    });

    memoized({ id: 5 });
    memoized({ id: 5 }); // Mesmo ID, cache hit

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should provide cache control methods', () => {
    const fn = jest.fn((x: number) => x * 2);
    const memoized = memoize(fn) as any;

    memoized(5);
    expect(memoized.getCacheSize()).toBe(1);

    memoized.clearCache();
    expect(memoized.getCacheSize()).toBe(0);
  });
});

describe('memoizeAsync', () => {
  it('should cache async function results', async () => {
    const fn = jest.fn(async (x: number) => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return x * 2;
    });
    const memoized = memoizeAsync(fn);

    // Primeira chamada
    const result1 = await memoized(5);
    expect(result1).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);

    // Segunda chamada - cache hit
    const result2 = await memoized(5);
    expect(result2).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should handle concurrent requests (deduplication)', async () => {
    const fn = jest.fn(async (x: number) => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return x * 2;
    });
    const memoized = memoizeAsync(fn);

    // Chamadas simultâneas
    const [result1, result2, result3] = await Promise.all([
      memoized(5),
      memoized(5),
      memoized(5),
    ]);

    expect(result1).toBe(10);
    expect(result2).toBe(10);
    expect(result3).toBe(10);
    
    // Deve ter executado apenas 1 vez (deduplication)!
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should respect TTL for async functions', async () => {
    const fn = jest.fn(async (x: number) => x * 2);
    const memoized = memoizeAsync(fn, { ttl: 100 });

    await memoized(5);
    expect(fn).toHaveBeenCalledTimes(1);

    // Aguardar TTL
    await new Promise(resolve => setTimeout(resolve, 150));

    await memoized(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});


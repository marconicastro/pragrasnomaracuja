/**
 * 🧠 Memoization Utilities
 * 
 * Cache de funções pesadas para melhor performance
 * - Cache com TTL (Time To Live)
 * - LRU (Least Recently Used) eviction
 * - Suporte async
 */

import { logger } from './logger';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hits: number;
}

interface MemoizeOptions {
  ttl?: number; // Time to live em ms (padrão: 5 min)
  maxSize?: number; // Máximo de entradas no cache (padrão: 100)
  keyGenerator?: (...args: any[]) => string;
}

/**
 * Memoize síncrono com TTL e LRU
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: MemoizeOptions = {}
): T {
  const {
    ttl = 5 * 60 * 1000, // 5 minutos
    maxSize = 100,
    keyGenerator = (...args) => JSON.stringify(args)
  } = options;

  const cache = new Map<string, CacheEntry<ReturnType<T>>>();

  const memoized = function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = keyGenerator(...args);
    const now = Date.now();
    
    // Verificar cache
    const cached = cache.get(key);
    if (cached && (now - cached.timestamp) < ttl) {
      cached.hits++;
      logger.debug(`Cache HIT: ${fn.name}`, { key, hits: cached.hits });
      return cached.value;
    }

    // Cache miss - executar função
    logger.debug(`Cache MISS: ${fn.name}`, { key });
    const result = fn.apply(this, args);

    // Armazenar no cache
    cache.set(key, {
      value: result,
      timestamp: now,
      hits: 0
    });

    // LRU eviction se exceder maxSize
    if (cache.size > maxSize) {
      // Remover entrada mais antiga com menos hits
      let oldest: string | null = null;
      let oldestScore = Infinity;

      for (const [k, entry] of cache.entries()) {
        const score = entry.hits / (now - entry.timestamp);
        if (score < oldestScore) {
          oldestScore = score;
          oldest = k;
        }
      }

      if (oldest) {
        cache.delete(oldest);
        logger.debug(`Cache EVICT: ${fn.name}`, { key: oldest });
      }
    }

    return result;
  };

  // Adicionar métodos de controle
  (memoized as any).clearCache = () => {
    cache.clear();
    logger.debug(`Cache CLEARED: ${fn.name}`);
  };

  (memoized as any).getCacheSize = () => cache.size;
  
  (memoized as any).getCacheStats = () => {
    const stats = {
      size: cache.size,
      totalHits: 0,
      entries: [] as Array<{ key: string; hits: number; age: number }>
    };

    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      stats.totalHits += entry.hits;
      stats.entries.push({
        key,
        hits: entry.hits,
        age: now - entry.timestamp
      });
    }

    return stats;
  };

  return memoized as T;
}

/**
 * Memoize assíncrono com TTL
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: MemoizeOptions = {}
): T {
  const {
    ttl = 5 * 60 * 1000,
    maxSize = 100,
    keyGenerator = (...args) => JSON.stringify(args)
  } = options;

  const cache = new Map<string, CacheEntry<Awaited<ReturnType<T>>>>();
  const pending = new Map<string, Promise<Awaited<ReturnType<T>>>>();

  const memoized = async function(this: any, ...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    const key = keyGenerator(...args);
    const now = Date.now();
    
    // Verificar cache
    const cached = cache.get(key);
    if (cached && (now - cached.timestamp) < ttl) {
      cached.hits++;
      logger.debug(`Async Cache HIT: ${fn.name}`, { key, hits: cached.hits });
      return cached.value;
    }

    // Verificar se já está sendo executado (evitar requisições duplicadas)
    if (pending.has(key)) {
      logger.debug(`Async Cache PENDING: ${fn.name}`, { key });
      return pending.get(key)!;
    }

    // Cache miss - executar função
    logger.debug(`Async Cache MISS: ${fn.name}`, { key });
    const promise = fn.apply(this, args);
    pending.set(key, promise);

    try {
      const result = await promise;

      // Armazenar no cache
      cache.set(key, {
        value: result,
        timestamp: Date.now(),
        hits: 0
      });

      // LRU eviction
      if (cache.size > maxSize) {
        const oldest = Array.from(cache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
        
        if (oldest) {
          cache.delete(oldest[0]);
          logger.debug(`Async Cache EVICT: ${fn.name}`, { key: oldest[0] });
        }
      }

      return result;
    } finally {
      pending.delete(key);
    }
  };

  // Métodos de controle
  (memoized as any).clearCache = () => cache.clear();
  (memoized as any).getCacheSize = () => cache.size;

  return memoized as T;
}

/**
 * Decorator para memoização (TypeScript)
 */
export function Memoize(options?: MemoizeOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = memoize(originalMethod, options);
    return descriptor;
  };
}



/**
 * Rate Limiter - Protege APIs contra abuso
 */

import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Limpar registros expirados a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime?: number;
}

/**
 * Rate limiter simples baseado em memória
 * Para produção, considerar usar Redis ou Vercel KV
 */
export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minuto
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Primeira request ou janela expirada
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime
    });
    return { 
      success: true, 
      remaining: maxRequests - 1,
      resetTime
    };
  }

  // Limite excedido
  if (record.count >= maxRequests) {
    return { 
      success: false, 
      remaining: 0,
      resetTime: record.resetTime
    };
  }

  // Incrementar contador
  record.count++;
  return { 
    success: true, 
    remaining: maxRequests - record.count,
    resetTime: record.resetTime
  };
}

/**
 * Obtém identificador único do cliente (IP)
 */
export function getClientIdentifier(request: NextRequest): string {
  // Tenta obter IP real (Vercel/Cloudflare headers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return 'unknown';
}

/**
 * Middleware helper para aplicar rate limiting
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<Response>,
  options: {
    maxRequests?: number;
    windowMs?: number;
  } = {}
) {
  return async (request: NextRequest): Promise<Response> => {
    const clientId = getClientIdentifier(request);
    const limitResult = rateLimit(
      clientId,
      options.maxRequests || 20,
      options.windowMs || 60000
    );

    if (!limitResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          resetAt: new Date(limitResult.resetTime!).toISOString()
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(options.maxRequests || 20),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(limitResult.resetTime),
            'Retry-After': String(Math.ceil((limitResult.resetTime! - Date.now()) / 1000))
          }
        }
      );
    }

    // Headers de rate limit
    const response = await handler(request);
    response.headers.set('X-RateLimit-Limit', String(options.maxRequests || 20));
    response.headers.set('X-RateLimit-Remaining', String(limitResult.remaining));
    response.headers.set('X-RateLimit-Reset', String(limitResult.resetTime));

    return response;
  };
}

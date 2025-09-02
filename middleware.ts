import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // SISTEMA ESTÁTICO DE PROTEÇÃO - Opção 3 (Simples e Seguro)
  const ACCESS_KEY = "pragras_2024_secure_access";
  const EXPECTED_VALUE = "granted";
  
  // Verificar se tem o parâmetro de acesso correto
  const hasValidAccess = url.searchParams.get(ACCESS_KEY) === EXPECTED_VALUE;
  
  // Se não tiver o parâmetro válido, redirecionar com o parâmetro
  if (!hasValidAccess && url.pathname === '/') {
    const newUrl = new URL('http://localhost:3000/');
    newUrl.searchParams.set(ACCESS_KEY, EXPECTED_VALUE);
    newUrl.searchParams.set('_t', Date.now().toString());
    
    return NextResponse.redirect(newUrl);
  }
  
  // Adicionar headers de segurança
  const response = NextResponse.next();
  
  // Headers para evitar cache
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  // Headers de segurança
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return response;
}

export const config = {
  matcher: [
    // Aplicar apenas à rota principal
    '/',
  ],
};
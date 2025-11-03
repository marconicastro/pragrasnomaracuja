import { NextRequest, NextResponse } from 'next/server';
import { getUserTracking } from '@/lib/userTrackingStore';

/**
 * API para buscar dados de Purchase recente (para página /obrigado)
 * 
 * Como Cakto não passa dados na URL, usamos esta estratégia:
 * 1. Webhook salva Purchase no KV com timestamp
 * 2. Página /obrigado busca email do localStorage
 * 3. Chama esta API que retorna Purchase recente
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email não fornecido' },
        { status: 400 }
      );
    }
    
    // Buscar dados do usuário no KV
    const userData = await getUserTracking(email);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Dados não encontrados' },
        { status: 404 }
      );
    }
    
    // Retornar dados do usuário (já tem fbp, fbc, etc.)
    return NextResponse.json({
      success: true,
      userData: {
        email: userData.email,
        phone: userData.phone,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fbp: userData.fbp,
        fbc: userData.fbc,
        city: userData.city,
        state: userData.state,
        zip: userData.zip
      }
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar Purchase recente:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}


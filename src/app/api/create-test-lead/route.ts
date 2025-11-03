import { NextRequest, NextResponse } from 'next/server';
import { saveUserTracking } from '@/lib/userTrackingStore';
import { saveUserTrackingData } from '@/lib/offlineConversions';

/**
 * API Route: Cria Lead de teste com fbc válido
 * 
 * Para testar webhook melhorado que busca Lead mais recente com fbc válido
 * 
 * POST /api/create-test-lead
 * Body: { email, phone, firstName, lastName }
 */

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      email = 'teste.webhook.fbc@maracujazeropragas.com',
      phone = '77998877666',
      firstName = 'Teste',
      lastName = 'Webhook FBC',
      city = 'Salvador',
      state = 'BA',
      zip = '40000'
    } = data;
    
    // ✅ GERAR fbc VÁLIDO (simulado para teste)
    // Formato: fb.1.{timestamp}.{fbclid_random}
    const now = Math.floor(Date.now() / 1000); // Timestamp em segundos (válido < 24h)
    const randomFbclid = Math.random().toString(36).substring(2, 15); // Random fbclid simulado
    const fbc = `fb.1.${now}.${randomFbclid}`;
    
    // ✅ GERAR fbp VÁLIDO (simulado)
    const fbp = `fb.1.${Date.now()}.123456789`;
    
    // ✅ Salvar no Vercel KV (prioridade)
    await saveUserTracking({
      email,
      fbp,
      fbc,
      firstName,
      lastName,
      phone,
      city,
      state,
      zip,
      // Dados adicionais para teste
      firstTouchSource: 'facebook',
      firstTouchMedium: 'cpc',
      lastTouchSource: 'facebook',
      lastTouchMedium: 'cpc',
      touchpointCount: 1,
      hasPaidClick: true
    });
    
    // ✅ Salvar no Prisma também (backup)
    await saveUserTrackingData({
      email,
      fbp,
      fbc,
      firstName,
      lastName,
      phone,
      city,
      state,
      zip
    });
    
    return NextResponse.json({
      success: true,
      message: 'Lead de teste criado com fbc válido',
      data: {
        email,
        phone,
        firstName,
        lastName,
        fbp,
        fbc,
        fbcValid: true,
        createdAt: new Date().toISOString(),
        note: 'fbc válido por 24h a partir de agora'
      }
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao criar Lead de teste:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


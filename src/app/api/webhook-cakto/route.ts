import { NextRequest, NextResponse } from 'next/server';
import { 
  validateCaktoWebhook,
  getUserDataFromKVOrPrisma,
  sendPurchaseToGTM,
  type CaktoWebhookPayload 
} from '@/lib/offlineConversions';

/**
 * 📨 Webhook Cakto - Offline Conversions (Purchase)
 * 
 * Recebe notifica📨es de compras aprovadas do checkout Cakto
 * e envia Purchase para Meta via Stape CAPI com fbp/fbc persistidos.
 * 
 * Endpoint: POST /api/webhook-cakto
 * 
 * Eventos processados:
 * - purchase_approved (status: paid) ? Purchase enviado para Meta
 * 
 * Outros eventos s?o recebidos mas ignorados.
 */

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 1. Verificar se h? body
    const text = await request.text();
    
    if (!text || text.trim() === '') {
      console.error('📨 Webhook recebeu payload vazio');
      return NextResponse.json(
        { error: 'Empty payload' },
        { status: 400 }
      );
    }
    
    // 2. Parse do payload
    let payload: CaktoWebhookPayload;
    try {
      payload = JSON.parse(text);
    } catch (parseError) {
      console.error('📨 Erro ao fazer parse do JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }
    
    console.log('📨 Webhook Cakto recebido:', {
      event: payload.event,
      timestamp: new Date().toISOString()
    });
    
    // 2. Validar secret
    const expectedSecret = process.env.CAKTO_WEBHOOK_SECRET;
    
    if (!expectedSecret) {
      console.error('⚠️ CAKTO_WEBHOOK_SECRET não configurado');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }
    
    const isValid = validateCaktoWebhook(payload, expectedSecret);
    
    if (!isValid) {
      console.error('⚠️ Webhook inv?lido (secret incorreto)');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }
    
    // 3. Processar webhook (inline - sem Prisma)
    // Validar evento
    if (payload.event !== 'purchase_approved' || payload.data.status !== 'paid') {
      return NextResponse.json({
        success: true,
        message: `Evento ${payload.event} ignorado`
      });
    }
    
    // Capturar IP dos headers (CRÍTICO para EQM +1.68% conversões!)
    const client_ip_address = 
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      undefined;
    
    console.log('📍 IP capturado do webhook:', client_ip_address || 'não disponível');
    
    // Buscar user data (KV + Prisma fallback)
    const userData = await getUserDataFromKVOrPrisma(
      payload.data.customer.email,
      payload.data.customer.phone
    );
    
    // Extrair dados
    const nameParts = payload.data.customer.name.split(' ');
    const purchaseData = {
      orderId: payload.data.refId,
      email: payload.data.customer.email,
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' ') || undefined,
      phone: payload.data.customer.phone,
      value: payload.data.amount,
      currency: 'BRL',
      timestamp: payload.data.paidAt ? new Date(payload.data.paidAt).getTime() : Date.now()
    };
    
    // Enriquecer userData com IP (se não tiver no KV)
    const enrichedUserData = {
      ...userData,
      client_ip_address: userData?.client_ip_address || client_ip_address
    };
    
    // Enviar Purchase para GTM Server-Side (ao invés de Meta CAPI direto)
    const result = await sendPurchaseToGTM(purchaseData, enrichedUserData || {});
    
    // 4. Log de performance
    const duration = Date.now() - startTime;
    console.log(`? Webhook processado em ${duration}ms:`, {
      event: payload.event,
      success: result.success,
      message: result.message
    });
    
    // 5. Retornar resposta
    // IMPORTANTE: Cakto interpreta QUALQUER resposta como entregue
    // Timeout: 10 segundos, 4 tentativas adicionais se falhar
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        processedIn: `${duration}ms`
      }, { status: 200 });
    } else {
      // Mesmo em erro, retornar 200 para não fazer retry
      // (erro j? foi logado, não adianta tentar novamente)
      return NextResponse.json({
        success: false,
        message: result.message,
        processedIn: `${duration}ms`
      }, { status: 200 });
    }
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    console.error('⚠️ Erro fatal ao processar webhook:', error);
    
    // Retornar 200 mesmo em erro para evitar retries desnecess?rios
    return NextResponse.json({
      success: false,
      error: error.message,
      processedIn: `${duration}ms`
    }, { status: 200 });
  }
}

// Método GET para verificação de saúde + DEBUG
export async function GET() {
  const secret = process.env.CAKTO_WEBHOOK_SECRET;
  
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/webhook-cakto',
    message: 'Webhook Cakto endpoint is running',
    timestamp: new Date().toISOString(),
    config: {
      hasSecret: !!secret,
      secretLength: secret ? secret.length : 0,
      secretPreview: secret ? `${secret.substring(0, 8)}...${secret.substring(secret.length - 4)}` : 'NOT_SET',
      hasStapeUrl: !!process.env.NEXT_PUBLIC_STAPE_CONTAINER_URL,
      hasPixelId: !!process.env.NEXT_PUBLIC_META_PIXEL_ID,
      nodeEnv: process.env.NODE_ENV
    },
    debug: {
      allEnvVarsCount: Object.keys(process.env).length,
      hasCAKTO: Object.keys(process.env).some(k => k.includes('CAKTO'))
    }
  });
}

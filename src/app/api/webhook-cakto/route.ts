import { NextRequest, NextResponse } from 'next/server';
import { 
  validateCaktoWebhook, 
  processCaktoWebhook,
  type CaktoWebhookPayload 
} from '@/lib/offlineConversions';

/**
 * ?? Webhook Cakto - Offline Conversions (Purchase)
 * 
 * Recebe notifica??es de compras aprovadas do checkout Cakto
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
    // 1. Parse do payload
    const payload: CaktoWebhookPayload = await request.json();
    
    console.log('?? Webhook Cakto recebido:', {
      event: payload.event,
      timestamp: new Date().toISOString()
    });
    
    // 2. Validar secret
    const expectedSecret = process.env.CAKTO_WEBHOOK_SECRET;
    
    if (!expectedSecret) {
      console.error('? CAKTO_WEBHOOK_SECRET n?o configurado');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }
    
    const isValid = validateCaktoWebhook(payload, expectedSecret);
    
    if (!isValid) {
      console.error('? Webhook inv?lido (secret incorreto)');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }
    
    // 3. Processar webhook
    const result = await processCaktoWebhook(payload);
    
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
      // Mesmo em erro, retornar 200 para n?o fazer retry
      // (erro j? foi logado, n?o adianta tentar novamente)
      return NextResponse.json({
        success: false,
        message: result.message,
        processedIn: `${duration}ms`
      }, { status: 200 });
    }
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    console.error('? Erro fatal ao processar webhook:', error);
    
    // Retornar 200 mesmo em erro para evitar retries desnecess?rios
    return NextResponse.json({
      success: false,
      error: error.message,
      processedIn: `${duration}ms`
    }, { status: 200 });
  }
}

// M?todo GET para verifica??o de sa?de
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/webhook-cakto',
    message: 'Webhook Cakto endpoint is running',
    config: {
      hasSecret: !!process.env.CAKTO_WEBHOOK_SECRET,
      hasStapeUrl: !!process.env.NEXT_PUBLIC_STAPE_CONTAINER_URL,
      hasPixelId: !!process.env.NEXT_PUBLIC_META_PIXEL_ID
    }
  });
}

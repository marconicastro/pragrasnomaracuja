import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * ?? API Route: Meta Conversions API via Stape.io Gateway
 * 
 * Envia eventos para o Meta atrav?s do Stape.io server-side tracking
 * Documenta??o: https://stape.io/helpdesk/documentation/meta-conversions-api-gateway-overview
 */

// Configura??es
const STAPE_CONTAINER_URL = process.env.STAPE_CONTAINER_URL;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

/**
 * Hash SHA-256 para dados PII
 */
function hashSHA256(data: string | null | undefined): string | null {
  if (!data) return null;
  
  const normalized = data.toString().toLowerCase().trim().replace(/\s+/g, '');
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Gera Event ID ?nico para deduplica??o
 */
function generateEventId(eventName: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const random = Math.random().toString(36).substring(2, 8);
  return `${eventName}_${timestamp}_${random}`;
}

/**
 * Extrai IP do cliente
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return '127.0.0.1'; // Fallback
}

/**
 * POST /api/track
 * Recebe eventos do frontend e envia para Stape.io
 */
export async function POST(request: NextRequest) {
  try {
    // Validar configura??o
    if (!STAPE_CONTAINER_URL || !META_PIXEL_ID || !META_ACCESS_TOKEN) {
      console.error('? Configura??o incompleta do Stape.io');
      return NextResponse.json(
        { error: 'Stape.io n?o configurado corretamente' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { 
      eventName, 
      eventType = 'standard',
      customParams = {},
      userData = {}
    } = body;

    // Validar evento
    if (!eventName) {
      return NextResponse.json(
        { error: 'eventName ? obrigat?rio' },
        { status: 400 }
      );
    }

    // Gerar Event ID para deduplica??o
    const eventId = generateEventId(eventName);
    const timestamp = Math.floor(Date.now() / 1000);

    // Obter dados do cliente da requisi??o
    const clientIP = getClientIP(request);
    const clientUserAgent = request.headers.get('user-agent') || '';

    // Hash dos dados do usu?rio (PII)
    const hashedUserData: Record<string, any> = {
      client_ip_address: clientIP,
      client_user_agent: clientUserAgent,
    };

    // Adicionar dados hasheados se fornecidos
    if (userData.email) {
      hashedUserData.em = hashSHA256(userData.email);
    }
    if (userData.phone) {
      hashedUserData.ph = hashSHA256(userData.phone);
    }
    if (userData.firstName) {
      hashedUserData.fn = hashSHA256(userData.firstName);
    }
    if (userData.lastName) {
      hashedUserData.ln = hashSHA256(userData.lastName);
    }
    if (userData.city) {
      hashedUserData.ct = hashSHA256(userData.city);
    }
    if (userData.state) {
      hashedUserData.st = hashSHA256(userData.state);
    }
    if (userData.zip) {
      hashedUserData.zp = hashSHA256(userData.zip);
    }
    if (userData.country) {
      hashedUserData.country = hashSHA256(userData.country || 'br');
    }

    // Montar payload para Stape.io Meta Conversions API Gateway
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: timestamp,
          event_id: eventId,
          event_source_url: customParams.event_source_url || request.headers.get('referer') || '',
          action_source: 'website',
          user_data: hashedUserData,
          custom_data: {
            ...customParams,
            currency: customParams.currency || 'BRL',
          },
        },
      ],
      access_token: META_ACCESS_TOKEN,
    };

    console.log('?? Enviando evento para Stape.io:', {
      eventName,
      eventId,
      stapeUrl: STAPE_CONTAINER_URL,
      hasUserData: Object.keys(hashedUserData).length > 2, // mais que IP e UA
    });

    // Enviar para Stape.io Meta Conversions API Gateway
    const stapeResponse = await fetch(
      `${STAPE_CONTAINER_URL}/v15.0/${META_PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const stapeResult = await stapeResponse.json();

    if (!stapeResponse.ok) {
      console.error('? Erro ao enviar evento para Stape.io:', stapeResult);
      return NextResponse.json(
        { 
          error: 'Erro ao enviar evento',
          details: stapeResult 
        },
        { status: stapeResponse.status }
      );
    }

    console.log('? Evento enviado com sucesso:', {
      eventName,
      eventId,
      stapeResponse: stapeResult,
    });

    return NextResponse.json({
      success: true,
      eventName,
      eventId,
      stapeResponse: stapeResult,
    });

  } catch (error: any) {
    console.error('? Erro ao processar evento:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno ao processar evento',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/track/health
 * Verifica sa?de da integra??o
 */
export async function GET(request: NextRequest) {
  const configured = !!(STAPE_CONTAINER_URL && META_PIXEL_ID && META_ACCESS_TOKEN);
  
  return NextResponse.json({
    status: configured ? 'ok' : 'not_configured',
    stapeConfigured: !!STAPE_CONTAINER_URL,
    pixelIdConfigured: !!META_PIXEL_ID,
    accessTokenConfigured: !!META_ACCESS_TOKEN,
  });
}

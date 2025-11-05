import { NextRequest, NextResponse } from 'next/server';
import { saveUserTracking } from '@/lib/userTrackingStore';
import { 
  normalizeEmail,
  normalizeName,
  normalizePhone,
  normalizeCity,
  normalizeState,
  normalizeZip,
  normalizeCountry
} from '@/lib/utils/metaDataNormalizer';

/**
 * API Route: Salva fbp/fbc + Attribution quando Lead acontece
 * 
 * Chamado pelo frontend ap?s disparar evento Lead
 * Salva dados no Vercel KV para uso posterior em Offline Conversions (Purchase)
 */

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // CRÍTICO: Capturar IP dos headers (EQM +1.68% conversões!)
    const client_ip_address = 
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      undefined;
    
    console.log('📍 IP capturado do request:', client_ip_address || 'não disponível');
    
    const { 
      email, fbp, fbc, firstName, lastName, phone, city, state, zip,
      // Attribution data
      attributionJourney, firstTouchSource, firstTouchMedium,
      lastTouchSource, lastTouchMedium, touchpointCount,
      timeToConvert, hasPaidClick,
      // UTM data
      utmFirstSource, utmFirstMedium, utmFirstCampaign,
      utmLastSource, utmLastMedium, utmLastCampaign,
      utmTouchCount, utmChannels,
      // Click IDs (CRÍTICO para atribuição!)
      fbclid, gclid,
      // Facebook Native Parameters
      fb_campaign_id, fb_campaign_name, fb_adset_id, fb_adset_name,
      fb_ad_id, fb_ad_name, fb_placement,
      // External ID (session) - +0.22% convers?es
      external_id,
      // User Agent (do frontend)
      client_user_agent
    } = data;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // ⚠️ NORMALIZAÇÃO CRÍTICA: Normalizar TODOS os dados para padrão Facebook antes de salvar
    // Garante consistência mesmo se dados vierem do formulário em formato inconsistente
    const normalizedEmail = normalizeEmail(email);
    const normalizedFirstName = firstName ? normalizeName(firstName) : undefined;
    const normalizedLastName = lastName ? normalizeName(lastName) : undefined;
    const normalizedPhone = phone ? normalizePhone(phone) : undefined;
    const normalizedCity = city ? normalizeCity(city) : undefined;
    const normalizedState = state ? normalizeState(state) : undefined;
    const normalizedZip = zip ? normalizeZip(zip) : undefined;
    const normalizedCountry = normalizeCountry(undefined); // BR por padrão
    
    const success = await saveUserTracking({
      email: normalizedEmail,  // ✅ Normalizado
      fbp,
      fbc,
      firstName: normalizedFirstName,  // ✅ Normalizado
      lastName: normalizedLastName,     // ✅ Normalizado
      phone: normalizedPhone,         // ✅ Normalizado
      city: normalizedCity,            // ✅ Normalizado
      state: normalizedState,          // ✅ Normalizado
      zip: normalizedZip,              // ✅ Normalizado
      // Attribution data
      attributionJourney,
      firstTouchSource,
      firstTouchMedium,
      lastTouchSource,
      lastTouchMedium,
      touchpointCount,
      timeToConvert,
      hasPaidClick,
      // UTM data
      utmFirstSource,
      utmFirstMedium,
      utmFirstCampaign,
      utmLastSource,
      utmLastMedium,
      utmLastCampaign,
      utmTouchCount,
      utmChannels,
      // Click IDs (CRÍTICO para atribuição!)
      fbclid,
      gclid,
      // Facebook Native Parameters
      fb_campaign_id,
      fb_campaign_name,
      fb_adset_id,
      fb_adset_name,
      fb_ad_id,
      fb_ad_name,
      fb_placement,
      // External ID (session) - +0.22% convers?es
      external_id,
      // IP e User Agent (CRÍTICO para EQM +3.36% conversões!)
      client_ip_address,
      client_user_agent
    });
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Tracking data saved'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to save tracking data'
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Error saving tracking data:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { saveUserTracking } from '@/lib/userTrackingStore';

/**
 * API Route: Salva fbp/fbc + Attribution quando Lead acontece
 * 
 * Chamado pelo frontend ap?s disparar evento Lead
 * Salva dados no Vercel KV para uso posterior em Offline Conversions (Purchase)
 */

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { 
      email, fbp, fbc, firstName, lastName, phone, city, state, zip,
      // Attribution data
      attributionJourney, firstTouchSource, firstTouchMedium,
      lastTouchSource, lastTouchMedium, touchpointCount,
      timeToConvert, hasPaidClick,
      // UTM data (NOVO!)
      utmFirstSource, utmFirstMedium, utmFirstCampaign,
      utmLastSource, utmLastMedium, utmLastCampaign,
      utmTouchCount, utmChannels
    } = data;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const success = await saveUserTracking({
      email,
      fbp,
      fbc,
      firstName,
      lastName,
      phone,
      city,
      state,
      zip,
      // Attribution data
      attributionJourney,
      firstTouchSource,
      firstTouchMedium,
      lastTouchSource,
      lastTouchMedium,
      touchpointCount,
      timeToConvert,
      hasPaidClick,
      // UTM data (NOVO!)
      utmFirstSource,
      utmFirstMedium,
      utmFirstCampaign,
      utmLastSource,
      utmLastMedium,
      utmLastCampaign,
      utmTouchCount,
      utmChannels
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

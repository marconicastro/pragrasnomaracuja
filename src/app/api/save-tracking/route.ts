import { NextRequest, NextResponse } from 'next/server';
import { saveUserTrackingData } from '@/lib/offlineConversions';

/**
 * API Route: Salva fbp/fbc quando Lead acontece
 * 
 * Chamado pelo frontend ap?s disparar evento Lead
 * Salva dados no banco para uso posterior em Offline Conversions
 */

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { email, fbp, fbc, firstName, lastName, phone, city, state, zip } = data;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const success = await saveUserTrackingData({
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

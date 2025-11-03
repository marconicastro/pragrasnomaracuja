'use client';

import { useEffect } from 'react';
import { initializeAdvancedPersistence, hasConsent } from '@/lib/advancedDataPersistence';
import { trackPageViewElite } from '@/lib/eliteMetaPixelTracking';

/**
 * 🎯 ELITE Meta Pixel - Sistema Enterprise
 * 
 * Sistema AVANÇADO de tracking Meta Pixel:
 * - Advanced Matching (14 campos)
 * - Enhanced Conversions ready
 * - Attribution tracking automático
 * - Data quality scoring
 * - Compliance/LGPD ready
 * - Offline Conversions (via Meta CAPI direto)
 * 
 * NOTA: Stape CAPIG desabilitado - usando Meta CAPI direto para Purchase
 */

declare global {
  interface Window {
    fbq: (command: string, eventName: string, parameters?: any, options?: any) => void;
    _fbq: any;
  }
}

interface EliteMetaPixelProps {
  pixelId?: string;
  stapeContainerUrl?: string;
}

export default function EliteMetaPixel({ 
  pixelId = '1403975024017865',
  stapeContainerUrl = 'https://capigateway.maracujazeropragas.com'
}: EliteMetaPixelProps) {
  
  useEffect(() => {
    // Verificar consentimento LGPD
    const consent = hasConsent('analytics');
    
    if (!consent) {
      console.log('?? Tracking pausado (aguardando consentimento)');
      return;
    }
    
    // 1. Inicializar UTM Tracking (PRIMEIRO!)
    if (typeof window !== 'undefined') {
      import('@/lib/utmTracking').then(({ initUTMTracking }) => {
        const capturedUTMs = initUTMTracking();
        if (capturedUTMs) {
          console.log('?? UTMs capturados:', capturedUTMs);
        }
      });
    }
    
    // 2. Inicializar sistema avan?ado de persist?ncia
    const journey = initializeAdvancedPersistence();
    
    console.log('?? Iniciando ELITE Meta Pixel System...');
    
    if (journey) {
      console.log('?? Data Quality Score:', journey.dataQualityScore);
      console.log('?? Attribution Touchpoints:', journey.attributionJourney.length);
      console.log('?? Event History:', journey.eventHistory.length);
    }
    
    // Carregar Meta Pixel
    (function(f: any, b: Document, e: string, v: string, n: any, t: HTMLScriptElement, s: Element) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      if (s.parentNode) {
        s.parentNode.insertBefore(t, s);
      }
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );

    // Configurar Meta Pixel
    if (window.fbq) {
      window.fbq('init', pixelId);
      
      // NOTA: Stape CAPIG desabilitado - usando Meta CAPI direto
      // Configuração mantida para compatibilidade, mas não ativa
      // Se precisar reabilitar Stape, descomentar as linhas abaixo:
      // window.fbq('set', 'autoConfig', false, pixelId);
      // window.fbq('set', 'agent', 'stape');
      // window.fbq('set', 'server_event_uri', stapeContainerUrl);
      
      console.log('✅ ELITE Meta Pixel inicializado');
      console.log('📊 Tracking Mode: Browser-side (Meta Pixel)');
      console.log('🔧 Features ELITE:');
      console.log('   ✅ Advanced Matching (14 campos)');
      console.log('   ✅ Attribution Tracking');
      console.log('   ✅ Data Quality Score');
      console.log('   ✅ Event Deduplication');
      console.log('   ✅ LGPD Compliant');
      console.log('   ✅ Offline Conversions (via Meta CAPI direto)');
      
      // 3. Disparar PageView Elite (com todos os dados)
      trackPageViewElite();
    }
  }, [pixelId, stapeContainerUrl]);

  return null;
}

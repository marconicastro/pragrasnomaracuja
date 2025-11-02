'use client';

import { useEffect } from 'react';
import { initializeAdvancedPersistence, hasConsent } from '@/lib/advancedDataPersistence';
import { trackPageViewElite } from '@/lib/eliteMetaPixelTracking';

/**
 * ?? ELITE Meta Pixel com Stape CAPIG Gateway
 * 
 * Sistema MAIS AVAN?ADO mantendo fluxograma CAPIG:
 * - Advanced Matching (14 campos)
 * - Enhanced Conversions ready
 * - Attribution tracking autom?tico
 * - Data quality scoring
 * - Compliance/LGPD ready
 * 
 * MANT?M: Dual tracking (browser + server via Stape)
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
  pixelId = '642933108377475',
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

    // Configurar Meta Pixel com Stape CAPIG
    if (window.fbq) {
      // 1. Inicializar Pixel
      window.fbq('init', pixelId);
      
      // 2. CONFIGURA??O STAPE CAPIG GATEWAY (ordem e sintaxe CR?TICAS!)
      // ?? IMPORTANTE: Passar pixelId em TODOS os 'set' para garantir que config ? aplicada!
      window.fbq('set', 'autoConfig', false, pixelId);
      window.fbq('set', 'agent', 'stape', pixelId);  // ? COM pixelId!
      window.fbq('set', 'server_event_uri', stapeContainerUrl, pixelId);  // ? COM pixelId!
      
      console.log('? ELITE Meta Pixel inicializado');
      console.log('?? Pixel ID:', pixelId);
      console.log('?? Stape Container:', stapeContainerUrl);
      console.log('? CAPIG Config:');
      console.log('   - autoConfig: false ?');
      console.log('   - agent: stape ?');
      console.log('   - server_event_uri: ' + stapeContainerUrl + ' ?');
      console.log('?? Dual Tracking:');
      console.log('   1?? Browser ? Meta Pixel endpoint');
      console.log('   2?? Server ? Meta Conversions API (via CAPIG)');
      console.log('?? Features ELITE:');
      console.log('   ? Advanced Matching (13 campos)');
      console.log('   ? Attribution Tracking');
      console.log('   ? Data Quality Score');
      console.log('   ? Event Deduplication');
      console.log('   ? LGPD Compliant');
      
      // 3. Disparar PageView Elite (com todos os dados)
      trackPageViewElite();
    }
  }, [pixelId, stapeContainerUrl]);

  return null;
}

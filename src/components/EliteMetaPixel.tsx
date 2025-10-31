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
  stapeContainerUrl = 'https://capig.maracujazeropragas.com'
}: EliteMetaPixelProps) {
  
  useEffect(() => {
    // Verificar consentimento LGPD
    const consent = hasConsent('analytics');
    
    if (!consent) {
      console.log('?? Tracking pausado (aguardando consentimento)');
      return;
    }
    
    // Inicializar sistema avan?ado de persist?ncia
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
      window.fbq('init', pixelId);
      
      // ? CONFIGURA??O STAPE CAPIG GATEWAY
      window.fbq('set', 'autoConfig', false, pixelId);
      window.fbq('set', 'agent', 'stape');
      window.fbq('set', 'server_event_uri', stapeContainerUrl);
      
      console.log('? ELITE Meta Pixel inicializado');
      console.log('?? Stape Container:', stapeContainerUrl);
      console.log('?? Dual Tracking:');
      console.log('   1?? Browser ? Meta Pixel endpoint');
      console.log('   2?? Server ? Meta Conversions API (via Stape)');
      console.log('?? Features ELITE:');
      console.log('   ? Advanced Matching (14 campos)');
      console.log('   ? Attribution Tracking');
      console.log('   ? Data Quality Score');
      console.log('   ? Event Deduplication');
      console.log('   ? LGPD Compliant');
      
      // Disparar PageView Elite (com todos os dados)
      trackPageViewElite();
    }
  }, [pixelId, stapeContainerUrl]);

  return null;
}

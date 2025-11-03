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

    // Configurar Meta Pixel (exatamente como MetaPixelStape funciona)
    // Aguardar script carregar completamente antes de configurar
    const initPixel = () => {
      if (window.fbq && typeof window.fbq === 'function') {
        try {
          // 1. Inicializar Pixel (PRIMEIRO!)
          window.fbq('init', pixelId);
          
          // ✅ CONFIGURAÇÃO STAPE CAPIG GATEWAY (HABILITADO)
          // CRÍTICO: Ordem e sintaxe são ESSENCIAIS! (igual ao MetaPixelStape)
          // 2. Desabilitar autoConfig ANTES de configurar CAPIG
          window.fbq('set', 'autoConfig', false, pixelId);
          
          // 3. Configurar agent (deve ser antes de server_event_uri)
          window.fbq('set', 'agent', 'stape', pixelId);
          
          // 4. Configurar server_event_uri (CRÍTICO - deve ser o último)
          // IMPORTANTE: URL SEM /events (Stape adiciona automaticamente)
          window.fbq('set', 'server_event_uri', stapeContainerUrl, pixelId);
          
          console.log('✅ ELITE Meta Pixel inicializado');
          console.log('📊 Tracking Mode: Dual (Browser + CAPIG)');
          console.log('🔧 Features ELITE:');
          console.log('   ✅ Advanced Matching (14 campos)');
          console.log('   ✅ Attribution Tracking');
          console.log('   ✅ Data Quality Score');
          console.log('   ✅ Event Deduplication');
          console.log('   ✅ LGPD Compliant');
          console.log('   ✅ CAPIG Gateway habilitado');
          console.log('📡 CAPIG URL:', stapeContainerUrl);
          console.log('🔄 Dual Tracking:');
          console.log('   1️⃣ Browser → Meta Pixel endpoint');
          console.log('   2️⃣ Server → CAPIG → Meta Conversions API');
          
          // Verificar se configuração foi aplicada
          setTimeout(() => {
            const pixelState = (window as any)._fbq?.getState?.();
            if (pixelState?.pixels?.[pixelId]) {
              console.log('✅ CAPIG Config verificado:', {
                server_event_uri: pixelState.pixels[pixelId].server_event_uri,
                agent: pixelState.pixels[pixelId].agent,
                autoConfig: pixelState.pixels[pixelId].autoConfig
              });
            }
          }, 500);
          
          // Disparar PageView Elite (com todos os dados)
          trackPageViewElite();
        } catch (error) {
          console.error('❌ Erro ao configurar Meta Pixel:', error);
        }
      } else {
        // Tentar novamente após 100ms
        setTimeout(initPixel, 100);
      }
    };

    // Aguardar um pouco para garantir que script carregou
    if (window.fbq) {
      initPixel();
    } else {
      // Se ainda não carregou, aguardar
      setTimeout(initPixel, 200);
    }
  }, [pixelId, stapeContainerUrl]);

  return null;
}

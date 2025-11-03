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
          // IMPORTANTE: Alguns CAPIGs precisam de /events no final, outros não
          // Vamos usar a URL exatamente como fornecida (usuário sabe qual funciona)
          const capigUrl = stapeContainerUrl.endsWith('/events') 
            ? stapeContainerUrl 
            : stapeContainerUrl;
          window.fbq('set', 'server_event_uri', capigUrl, pixelId);
          
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
          
          // CRÍTICO: Aguardar CAPIG configurar ANTES de disparar eventos!
          // Os comandos 'set' são assíncronos e precisam de tempo para processar
          setTimeout(() => {
            // Verificar se configuração foi aplicada
            const pixelState = (window as any)._fbq?.getState?.();
            if (pixelState?.pixels?.[pixelId]) {
              const capigConfig = {
                server_event_uri: pixelState.pixels[pixelId].server_event_uri,
                agent: pixelState.pixels[pixelId].agent,
                autoConfig: pixelState.pixels[pixelId].autoConfig
              };
              
              console.log('✅ CAPIG Config verificado:', capigConfig);
              
              // Verificar se server_event_uri está realmente configurado
              // Aceitar tanto com quanto sem /events
              const expectedUrl = stapeContainerUrl;
              const isConfigured = capigConfig.server_event_uri === expectedUrl || 
                                   capigConfig.server_event_uri === `${expectedUrl}/events` ||
                                   capigConfig.server_event_uri === expectedUrl.replace('/events', '');
              
              if (isConfigured || capigConfig.server_event_uri?.includes('capigateway')) {
                console.log('✅ CAPIG pronto! Config:', {
                  server_event_uri: capigConfig.server_event_uri,
                  agent: capigConfig.agent,
                  autoConfig: capigConfig.autoConfig,
                  pixelId: pixelId
                });
                console.log('📡 Disparando PageView (CAPIG configurado)...');
                // Agora sim, disparar PageView (CAPIG já está configurado)
                trackPageViewElite().then(result => {
                  console.log('📊 PageView result:', result);
                }).catch(err => {
                  console.error('❌ Erro ao disparar PageView:', err);
                });
              } else {
                console.warn('⚠️ CAPIG não configurado corretamente:', {
                  esperado: expectedUrl,
                  recebido: capigConfig.server_event_uri,
                  pixelId: pixelId
                });
                console.warn('⚠️ Tentando reconfigurar CAPIG...');
                // Tentar configurar novamente
                window.fbq('set', 'autoConfig', false, pixelId);
                window.fbq('set', 'agent', 'stape', pixelId);
                window.fbq('set', 'server_event_uri', stapeContainerUrl, pixelId);
                
                // Aguardar mais um pouco e disparar mesmo assim
                setTimeout(() => {
                  console.log('🔄 Disparando PageView (segunda tentativa após reconfigurar)...');
                  trackPageViewElite().then(result => {
                    console.log('📊 PageView result (tentativa 2):', result);
                  }).catch(err => {
                    console.error('❌ Erro ao disparar PageView (tentativa 2):', err);
                  });
                }, 500);
              }
            } else {
              console.warn('⚠️ Pixel state não disponível. Disparando PageView mesmo assim...');
              trackPageViewElite();
            }
          }, 1000); // Aguardar 1 segundo para garantir que CAPIG está configurado
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

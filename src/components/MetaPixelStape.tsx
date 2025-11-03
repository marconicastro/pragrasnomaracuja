'use client';

import { useEffect } from 'react';

/**
 * ?? Meta Pixel com Stape Conversions API Gateway (CAPIG)
 * 
 * Fluxo correto:
 * 1. Meta Pixel JavaScript carrega no browser
 * 2. Configurado com server_event_uri apontando para Stape
 * 3. Eventos enviados via window.fbq()
 * 4. Stape intercepta automaticamente e envia via:
 *    - Browser connection ? Meta Pixel endpoint
 *    - Server connection ? Meta Conversions API endpoint
 * 5. Meta deduplica usando event_id
 */

declare global {
  interface Window {
    fbq: (command: string, eventName: string, parameters?: any, options?: any) => void;
    _fbq: any;
  }
}

interface MetaPixelStapeProps {
  pixelId?: string;
  stapeContainerUrl?: string;
}

export default function MetaPixelStape({ 
  pixelId = '1403975024017865',
  stapeContainerUrl = 'https://capigateway.maracujazeropragas.com'
}: MetaPixelStapeProps) {
  
  useEffect(() => {
    // Carregar Meta Pixel JavaScript
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

    // Inicializar Meta Pixel
    if (window.fbq) {
      window.fbq('init', pixelId);
      
      // ? CONFIGURA??O STAPE CAPIG GATEWAY
      // ?? CR?TICO: Passar pixelId em TODOS os 'set' commands!
      window.fbq('set', 'autoConfig', false, pixelId);
      window.fbq('set', 'agent', 'stape', pixelId);  // ? COM pixelId!
      
      // ?? CR?TICO: server_event_uri aponta para Stape
      // Stape intercepta eventos e envia via server-side tamb?m
      window.fbq('set', 'server_event_uri', stapeContainerUrl, pixelId);  // ? COM pixelId!
      
      // Event ID ?nico para deduplica??o
      const eventID = `PageView_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      
      // PageView autom?tico
      window.fbq('track', 'PageView', {
        value: 39.9,
        currency: 'BRL',
        content_ids: ['hacr962'],
        content_type: 'product',
        content_name: 'Sistema 4 Fases - Ebook Trips'
      }, { eventID });
      
      console.log('? Meta Pixel + Stape CAPIG Gateway inicializado');
      console.log('?? Server Event URI:', stapeContainerUrl);
      console.log('?? Eventos ser?o enviados via:');
      console.log('   1?? Browser ? Meta Pixel endpoint');
      console.log('   2?? Server ? Meta Conversions API endpoint (via Stape)');
      console.log('   3?? Meta deduplica usando event_id');
    }
  }, [pixelId, stapeContainerUrl]);

  return null;
}

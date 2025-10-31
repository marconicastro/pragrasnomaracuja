'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { hasConsent, saveConsent } from '@/lib/advancedDataPersistence';

/**
 * ?? LGPD/GDPR Compliant Consent Banner
 * 
 * Gerencia consentimento do usu?rio para tracking
 */

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    // Verificar se j? tem consentimento
    const hasAnalyticsConsent = hasConsent('analytics');
    
    if (!hasAnalyticsConsent) {
      // Mostrar banner ap?s 1 segundo
      setTimeout(() => setShow(true), 1000);
    }
  }, []);
  
  const handleAccept = () => {
    saveConsent(true, true);
    setShow(false);
    
    // Recarregar para inicializar tracking
    window.location.reload();
  };
  
  const handleReject = () => {
    saveConsent(false, false);
    setShow(false);
  };
  
  if (!show) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 sm:p-6 z-50 shadow-2xl">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">
              ?? Cookies e Privacidade
            </h3>
            <p className="text-sm text-gray-300">
              Usamos cookies e tecnologias similares para melhorar sua experi?ncia, 
              personalizar conte?do e analisar o tr?fego do site. Ao clicar em "Aceitar", 
              voc? concorda com o uso de cookies conforme nossa{' '}
              <a href="/privacidade" className="underline">Pol?tica de Privacidade</a>.
            </p>
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            <Button
              onClick={handleReject}
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
            >
              Rejeitar
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Aceitar Todos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

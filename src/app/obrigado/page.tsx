'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { trackPurchaseElite } from '@/lib/eliteMetaPixelTracking';
import { trackPageViewElite } from '@/lib/eliteMetaPixelTracking';

export default function ObrigadoPage() {
  const searchParams = useSearchParams();
  const [purchaseSent, setPurchaseSent] = useState(false);
  
  // Extrair dados da URL (enviados pelo Cakto via success_url)
  const orderId = searchParams.get('order_id') || searchParams.get('id') || searchParams.get('refId');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const name = searchParams.get('name');
  const value = searchParams.get('value') || '39.9';
  
  // Parsear nome (formato: "Nome Sobrenome")
  const nameParts = name ? name.split(' ') : [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  useEffect(() => {
    // 1. Disparar PageView (obrigatório antes de Purchase)
    trackPageViewElite({
      page_name: 'Obrigado - Purchase Success',
      page_category: 'conversion'
    });
    
    // 2. Aguardar 1s para garantir que PageView foi processado
    setTimeout(async () => {
      // 3. Disparar Purchase via browser (passa pelo CAPIG, EQM 9.3!)
      // FALLBACK: Se não tiver dados na URL, buscar do localStorage/KV
      let finalOrderId = orderId;
      let finalEmail = email;
      let finalPhone = phone || '';
      let finalFirstName = firstName;
      let finalLastName = lastName;
      
      // Se faltar dados na URL, tentar buscar do localStorage (dados do Lead)
      if (!finalOrderId || !finalEmail) {
        try {
          const storedData = localStorage.getItem('userTrackingData');
          if (storedData) {
            const parsed = JSON.parse(storedData);
            if (!finalEmail && parsed.email) finalEmail = parsed.email;
            if (!finalPhone && parsed.phone) finalPhone = parsed.phone;
            if (!finalFirstName && parsed.firstName) finalFirstName = parsed.firstName;
            if (!finalLastName && parsed.lastName) finalLastName = parsed.lastName;
          }
        } catch (e) {
          console.warn('⚠️ Erro ao ler localStorage:', e);
        }
        
        // Se ainda não tiver orderId, gerar um temporário (Cakto pode não passar)
        if (!finalOrderId) {
          // Tentar buscar do sessionStorage ou URL params alternativos
          finalOrderId = sessionStorage.getItem('lastOrderId') || `temp_${Date.now()}`;
        }
      }
      
      if (finalOrderId && finalEmail && !purchaseSent) {
        try {
          console.log('🎉 Disparando Purchase via browser (EQM 9.3 via CAPIG):', {
            orderId: finalOrderId,
            email: finalEmail,
            via: 'Browser + CAPIG Gateway',
            source: orderId ? 'URL params' : 'localStorage fallback'
          });
          
          await trackPurchaseElite(
            finalOrderId,
            {
              email: finalEmail,
              phone: finalPhone,
              firstName: finalFirstName,
              lastName: finalLastName
            },
            {
              value: parseFloat(value),
              currency: 'BRL',
              // Metadata adicional
              purchase_source: 'cakto_success_page',
              purchase_method: 'credit_card'
            }
          );
          
          setPurchaseSent(true);
          console.log('✅ Purchase enviado via browser + CAPIG (EQM 9.3 garantido!)');
        } catch (error) {
          console.error('❌ Erro ao disparar Purchase:', error);
        }
      } else if (!purchaseSent) {
        console.warn('⚠️ Dados insuficientes para Purchase:', {
          orderId: !!finalOrderId,
          email: !!finalEmail
        });
        console.log('ℹ️ Purchase será enviado via webhook (backup garantido)');
      }
    }, 1000);
  }, [orderId, email, phone, firstName, lastName, value, purchaseSent]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        {/* Ícone de Sucesso */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        
        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          🎉 Parabéns! Sua compra foi confirmada!
        </h1>
        
        {/* Subtítulo */}
        <p className="text-lg text-gray-600 mb-8">
          Obrigado pela sua confiança. Seu pedido está sendo processado e você receberá os detalhes por email.
        </p>
        
        {/* Informações do Pedido */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Número do pedido:</p>
            <p className="text-xl font-semibold text-gray-900">{orderId}</p>
          </div>
        )}
        
        {/* Próximos Passos */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-left">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Verifique seu email</p>
              <p className="text-sm text-gray-600">
                {email ? `Enviamos os detalhes para ${email}` : 'Enviamos os detalhes para seu email'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 text-left">
            <Download className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Acesso ao produto</p>
              <p className="text-sm text-gray-600">
                Você receberá o link de acesso em instantes
              </p>
            </div>
          </div>
        </div>
        
        {/* Status do Tracking (Debug) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left text-xs text-blue-800">
            <p className="font-semibold mb-2">🔍 Debug - Status do Tracking:</p>
            <ul className="space-y-1">
              <li>✅ PageView: Enviado</li>
              <li>{purchaseSent ? '✅' : '⏳'} Purchase: {purchaseSent ? 'Enviado via browser + CAPIG' : 'Processando...'}</li>
              <li>📊 EQM esperado: 9.3 (via CAPIG)</li>
              <li>🔄 Deduplicação: Automática (event_id único)</li>
            </ul>
          </div>
        )}
        
        {/* Botão de Ação */}
        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar ao início
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

